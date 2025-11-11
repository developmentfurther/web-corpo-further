"use client"
// services/context.js
import React, { useEffect, useRef, useState } from "react";
import ContextGeneral from "./contextGeneral";
import firebaseApp from "./firebase";
import { useRouter } from "next/router";
import { getBlog } from "@/lib/firestore/blogs";
import { listBlogs, getBlogContent } from "@/lib/firestore/blogs";


import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

/* Anti-flicker */
function useDelayedFlag(flag, delayMs = 220) {
  const [show, setShow] = useState(() => Boolean(flag));
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    let t;
    if (flag) t = setTimeout(() => setShow(true), delayMs);
    else setShow(false);
    return () => clearTimeout(t);
  }, [flag, delayMs]);
  return show;
}

function Context(props) {
  const router = useRouter();
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  const locale = router.locale || "es";

  /* Usuario y flags mínimos */
  const [user, setUser] = useState(null);
  const admins = ["saabtian@gmail.com", "sebas@gmail.com","dev@dev.com", "test@test.com", "comunicacioncorporativafurther@gmail.com"]; // ↓ se compara en lowercase
  const [userProfile, setUserProfile] = useState(null);
  const [skipUserUntil2FA, setSkipUserUntil2FA] = useState(false);


  /* Loaders/flags */
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const showLoader = useDelayedFlag(checkingAuth, 220);
  const [twoFAStatus, setTwoFAStatus] = useState(null); 




  const isAdmin = Boolean(
    user?.email && admins.includes((user.email || "").toLowerCase())
  );
  const ready = authReady && !checkingAuth;

  /* Crea/actualiza /users/{emailLower} con perfil mínimo */
  const ensureUserDocument = async (firebaseUser) => {
    const emailLower = String(firebaseUser?.email || "")
      .trim()
      .toLowerCase();
    if (!emailLower) return null;

    const ref = doc(firestore, `users/${emailLower}`);
    const snap = await getDoc(ref);

    const ADMINS = admins.map((e) => e.toLowerCase());
    const isListedAdmin = ADMINS.includes(emailLower);

    const baseProfile = {
      email: emailLower,
      displayName: firebaseUser.displayName || "",
      photoURL: firebaseUser.photoURL || "",
      permisos: [], // reservado para futuro (vacío)
      roles: { admin: isListedAdmin },
      creadoEn: serverTimestamp(),
      ultimoAcceso: serverTimestamp(),
      lastLoginMeta: {
        ua: typeof navigator !== "undefined" ? navigator.userAgent : "",
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      },
    };

    if (!snap.exists()) {
      await setDoc(ref, baseProfile);
      return { id: ref.id, ...baseProfile };
    } else {
      const data = snap.data() || {};
      const patch = {};

      if (typeof data.email !== "string" || data.email !== emailLower)
        patch.email = emailLower;
      patch.roles = { ...(data.roles || {}), admin: isListedAdmin };
      patch.ultimoAcceso = serverTimestamp();

      if (Object.keys(patch).length > 0) {
        await setDoc(ref, patch, { merge: true });
      }

      return { id: ref.id, ...data, ...patch };
    }
  };

  /* Verificador de sesión (sin fetch de datos) */
  const inspectorSesion = async (usuarioFirebase) => {
  setCheckingAuth(true);
  setAuthReady(false);

  try {
    // 🔹 Si no hay sesión → limpiar todo
    if (!usuarioFirebase) {
      setUser(null);
      setUserProfile(null);
      setCheckingAuth(false);
      setAuthReady(true);
      return;
    }

    // 🔹 Si hay sesión válida → cargar perfil
    const emailLower = usuarioFirebase.email?.toLowerCase() || null;
    if (!emailLower) {
      setUser(null);
      setUserProfile(null);
      setCheckingAuth(false);
      setAuthReady(true);
      return;
    }

    setUser(usuarioFirebase);
    const profile = await ensureUserDocument(usuarioFirebase);
    setUserProfile(profile);
  } finally {
    setCheckingAuth(false);
    setAuthReady(true);
  }
};


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, inspectorSesion);
    return () => {
      try {
        unsub && unsub();
      } catch (_) {}
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ==========================
     BLOGS: cache global
     ========================== */
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);

  // 🔹 Carga inicial de metadatos de blogs públicos
  useEffect(() => {
  (async () => {
    try {
      const base = await listBlogs({ status: "public" });
      const items = await Promise.all(
        base.map(async (b) => {
          const meta = await import("@/lib/firestore/blogs")
            .then((m) => m.getBlog(b.slug, locale))
            .catch(() => null);
          return {
            slug: b.slug,
            locale,
            coverUrl: meta?.coverUrl || b.coverUrl || "",
            title: meta?.title || b.title || b.slug,
            summary: meta?.summary || "",
          };
        })
      );
      setBlogs(items);
    } catch (err) {
      console.error("❌ Error al cargar blogs:", err);
    } finally {
      setBlogsLoading(false);
    }
  })();
}, [locale]); // 👈 importante

;

  // 🔹 Obtener blog completo (lazy: carga HTML solo si no está cacheado)
const getBlogBySlug = async (slug, locale = "es") => {
  const lc = locale || "es";
  const sameLocale = (b) => b.slug === slug && (b.locale || "es") === lc;
  const found = blogs.find(sameLocale);

  // 1) No está en cache o el que está es de otro idioma → cargar todo (meta + content)
  if (!found) {
    try {
      const [meta, content] = await Promise.all([
        getBlog(slug, lc),
        getBlogContent(slug, lc),
      ]);
      if (!meta) return null;

     const combined = { ...meta, ...content, locale: lc, html: content?.html || "" };


      setBlogs((prev) => [
        ...prev.filter((b) => !sameLocale(b)), // limpia solo este slug+locale
        combined,
      ]);

      return combined;
    } catch (err) {
      console.error("⚠️ Error al cargar blog por slug:", err);
      return null;
    }
  }

  // 2) Ya está en cache y es del mismo locale
  if (found.html) return found;

  try {
    const content = await getBlogContent(slug, lc);
    const merged = { ...found, html: content?.html || "", locale: lc };

    setBlogs((prev) => [
      ...prev.filter((b) => !sameLocale(b)),
      merged,
    ]);

    return merged;
  } catch (err) {
    console.error("⚠️ Error al cargar contenido del blog:", err);
    return found;
  }
};




  

  return (
    <ContextGeneral.Provider
  value={{
    // servicios
    auth,
    firestore,

    // usuario
    user,
    setUser,          // 👈 agregado
    userProfile,
    setUserProfile,   // 👈 agregado
    isAdmin,
    twoFAStatus,          // 👈 nuevo
    setTwoFAStatus,     
    // flags
    loader: showLoader,
    checkingAuth,
    authReady,
    ready,

    blogs,
    blogsLoading,
    getBlogBySlug,
  }}
>

      {props.children}
    </ContextGeneral.Provider>
  );
}

export default Context;
