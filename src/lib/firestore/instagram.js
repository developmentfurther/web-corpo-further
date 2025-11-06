// lib/firestore/instagram.js
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import firebaseApp from "@/services/firebase";
import ImageKit from "imagekit";

const db = getFirestore(firebaseApp);

// === CREATE / UPDATE ===
export async function saveInstagramPost(input) {
  const id = input.id || Date.now().toString();
  const ref = doc(db, "instagramPosts", id);

  const payload = {
    id,
    imageUrl: input.imageUrl || "",
    imageKitId: input.imageKitId || "",
    href: input.href || "",
    caption: input.caption || "",
    order: input.order || 0,
    visible: input.visible ?? true,
    createdAt: input.createdAt || serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, payload, { merge: true });
  return { id, ...payload };
}

// === READ ===
export async function getInstagramPost(id) {
  const snap = await getDoc(doc(db, "instagramPosts", id));
  return snap.exists() ? snap.data() : null;
}

// === LIST ===
export async function listInstagramPosts() {
  const q = query(collection(db, "instagramPosts"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

// === DELETE ===
export async function deleteInstagramPost(id) {
  const ref = doc(db, "instagramPosts", id);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    if (data.imageKitId) {
      try {
        const imagekit = new ImageKit({
          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
          privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
          urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
        });
        await imagekit.deleteFile(data.imageKitId);
        console.log(`🗑️ Imagen eliminada de ImageKit (${data.imageKitId})`);
      } catch (err) {
        console.warn("⚠️ No se pudo eliminar la imagen de ImageKit:", err.message);
      }
    }
  }

  await deleteDoc(ref);
  console.log(`✅ Post eliminado (${id})`);
}

// === VISIBILITY TOGGLE ===
export async function toggleVisibility(id, visible) {
  await updateDoc(doc(db, "instagramPosts", id), {
    visible,
    updatedAt: serverTimestamp(),
  });
}


// === LISTADO PÚBLICO (solo visibles) ===
export async function listPublicInstagramPosts() {
  const q = query(
    collection(db, "instagramPosts"),
    where("visible", "==", true),
    orderBy("order", "asc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}