// /lib/firestore/blogs.js
import firebaseApp from "@/services/firebase";
import {
  getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp,
  collection, getDocs, query, orderBy, where, deleteDoc
} from "firebase/firestore";

const db = getFirestore(firebaseApp);

// -------- utils --------
const slugify = (s="") =>
  s.toString().toLowerCase()
    .normalize("NFKD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)+/g,"")
    .slice(0, 140);

async function ensureUniqueSlug(base) {
  let slug = base || "post";
  let i = 1;
  while (true) {
    const snap = await getDoc(doc(db, "blogs", slug));
    if (!snap.exists()) return slug;
    i++; slug = `${base}-${i}`;
  }
}

// -------- CREATE/UPDATE META (root) --------
export async function saveBlogMeta({ title, summary, coverUrl, status="private", locale="es", slug }) {
  const baseSlug = slug ? slug : slugify(title || "post");
  const finalSlug = slug ? slug : await ensureUniqueSlug(baseSlug);
  const ref = doc(db, "blogs", finalSlug);
  const snap = await getDoc(ref);

  const now = serverTimestamp();
  const rootPatch = {
    status,
    coverUrl: coverUrl || "",
    updatedAt: now,
  };

  if (!snap.exists()) {
    await setDoc(ref, {
      ...rootPatch,
      createdAt: now,
      locales: { [locale]: { title: title || "", summary: summary || "", html: "", blocks: [], updatedAt: now } }
    });
  } else {
    // no tocamos locales acá; solo meta raíz
    await setDoc(ref, rootPatch, { merge: true });
  }
  return { slug: finalSlug, status, coverUrl };
}

// -------- SAVE LOCALE (title/summary/html/blocks) --------
export async function saveBlogLocale({ slug, locale, title, summary, html="", blocks=[] }) {
  if (!slug || !locale) throw new Error("slug y locale son obligatorios");
  const ref = doc(db, "blogs", slug);
  const now = serverTimestamp();
  // Guardamos SOLO la rama del locale; no pisamos otros idiomas
  await setDoc(ref, {
    locales: {
      [locale]: {
        title: title || "",
        summary: summary || "",
        html: html || "",
        blocks: Array.isArray(blocks) ? blocks : [],
        updatedAt: now,
      }
    },
    updatedAt: now,
  }, { merge: true });
  return { ok: true };
}

// -------- READ (meta + un locale) --------
export async function getBlog(slug, locale="es") {
    if (!slug) {
    console.error("getBlog: slug indefinido");
    return null;
  }

  const ref = doc(db, "blogs", String(slug));
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();

  const l = data.locales?.[locale] || {};
  return {
    slug,
    status: data.status || "private",
    coverUrl: data.coverUrl || "",
    title: l.title || "",
    summary: l.summary || "",
    locale,
  };
}

export async function getBlogContent(slug, locale="es") {
  const ref = doc(db, "blogs", slug);
  const snap = await getDoc(ref);
  const l = snap.data()?.locales?.[locale] || {};
  return {
    blocks: Array.isArray(l.blocks) ? l.blocks : [],
    html: l.html || "",
  };
}

// -------- LIST --------
export async function listBlogs({ status } = {}) {
  const col = collection(db, "blogs");
  const q = status
    ? query(col, where("status", "==", status), orderBy("updatedAt", "desc"))
    : query(col, orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const v = d.data();
    return {
      slug: d.id,
      status: v.status,
      coverUrl: v.coverUrl,
      locales: v.locales ? Object.keys(v.locales) : [],
      updatedAt: v.updatedAt,
    };
  });
}

// -------- DELETE --------
export async function deleteBlog(slug) {
  await deleteDoc(doc(db, "blogs", slug));
  return { ok: true };
}
