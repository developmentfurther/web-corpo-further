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

// ✅ Función para limpiar undefined recursivamente
function cleanUndefined(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => cleanUndefined(item)).filter(item => item !== undefined);
  }
  
  if (obj !== null && typeof obj === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanUndefined(value);
      }
    }
    return cleaned;
  }
  
  return obj;
}

// ============================================
// saveBlogLocale
// ============================================

export async function saveBlogLocale({ slug, locale, title, summary, html="", blocks=[] }) {
  if (!slug || !locale) throw new Error("slug y locale son obligatorios");
  
  console.log("🟢 saveBlogLocale recibió:", { slug, locale, title, summary, blocks: blocks?.length });
  
  const ref = doc(db, "blogs", slug);
  const now = serverTimestamp();
  
  // ✅ LIMPIAR BLOCKS RECURSIVAMENTE
  const cleanedBlocks = cleanUndefined(blocks);
  
  console.log("🟢 blocks originales:", blocks.length, "items");
  console.log("🟢 blocks limpiados:", cleanedBlocks.length, "items");
  console.log("🟢 Primer block original:", JSON.stringify(blocks[0], null, 2));
  console.log("🟢 Primer block limpiado:", JSON.stringify(cleanedBlocks[0], null, 2));
  
  // ✅ Construir el objeto locale
  const localeData = {
    title: title || "",
    summary: summary || "",
    html: html || "",
    blocks: Array.isArray(cleanedBlocks) ? cleanedBlocks : []
  };

  const updatePayload = {
    locales: {
      [locale]: localeData
    },
    updatedAt: now
  };

  try {
    await setDoc(ref, updatePayload, { merge: true });
    console.log("✅ saveBlogLocale exitoso");
  } catch (error) {
    console.error("❌ Error en saveBlogLocale setDoc:", error);
    console.error("❌ updatePayload que falló:", JSON.stringify(updatePayload, null, 2).substring(0, 500));
    throw error;
  }

  return { ok: true };
}

// ============================================
// saveBlogMeta
// ============================================

export async function saveBlogMeta({ 
  title, 
  summary, 
  coverUrl, 
  coverKitId,
  status, 
  locale, 
  slug,
  featured
}) {
  const baseSlug = slug || slugify(title || "post");
  const finalSlug = slug || await ensureUniqueSlug(baseSlug);
  const ref = doc(db, "blogs", finalSlug);
  const snap = await getDoc(ref);

  const now = serverTimestamp();

  if (!snap.exists()) {
    // ✅ CREAR NUEVO DOCUMENTO
    const newDoc = {
      status: status || "private",
      coverUrl: coverUrl || "",
      featured: featured || false, // ✅ AGREGADO
      createdAt: now,
      updatedAt: now,
    };

    if (coverKitId && String(coverKitId).trim()) {
      newDoc.coverKitId = String(coverKitId).trim();
    }

    newDoc.locales = {
      [locale]: {
        title: title || "",
        summary: summary || "",
        html: "",
        blocks: []
      }
    };
    
    await setDoc(ref, newDoc);
  } else {
    // ✅ ACTUALIZAR DOCUMENTO EXISTENTE
    const updateData = {
      status: status || "private",
      coverUrl: coverUrl || "",
      featured: featured || false, // ✅ AGREGADO
      updatedAt: now,
    };

    if (coverKitId && String(coverKitId).trim()) {
      updateData.coverKitId = String(coverKitId).trim();
    }

    await setDoc(ref, updateData, { merge: true });
  }
  
  return { slug: finalSlug, status: status || "private", coverUrl: coverUrl || "" };
}

// ============================================
// READ (meta + un locale)
// ============================================

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
    coverKitId: data.coverKitId || "",
    featured: data.featured || false, // ✅ AGREGADO
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

// ============================================
// LIST
// ============================================

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
      coverKitId: v.coverKitId || "",
      featured: v.featured || false, // ✅ AGREGADO
      locales: v.locales ? Object.keys(v.locales) : [],
      updatedAt: v.updatedAt,
    };
  });
}

// ============================================
// DELETE
// ============================================

export async function deleteBlog(slug) {
  await deleteDoc(doc(db, "blogs", slug));
  return { ok: true };
}