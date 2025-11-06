// /pages/api/2fa/status.js
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseApp from "@/services/firebase";

const db = getFirestore(firebaseApp);

export default async function handler(req, res) {
  try {
    const email = req.query.email?.toLowerCase();
    if (!email) return res.status(400).json({ error: "Email requerido" });

    const ref = doc(db, "2fa", email);
    const snap = await getDoc(ref);

    if (!snap.exists()) return res.status(200).json({ enabled: false });

    const data = snap.data();
    return res.status(200).json({
      enabled: !!data.enabled,
      verified: !!data.enabled, // si enabled=true → ya verificado
    });
  } catch (err) {
    console.error("Error obteniendo estado 2FA:", err);
    return res.status(500).json({ error: err.message });
  }
}
