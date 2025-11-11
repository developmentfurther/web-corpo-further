import { getFirestore, doc, getDoc, Timestamp } from "firebase/firestore";
import firebaseApp from "@/services/firebase";

const db = getFirestore(firebaseApp);

export default async function handler(req, res) {
  try {
    const email = req.query.email?.toLowerCase();
    if (!email) return res.status(400).json({ error: "Email requerido" });

    const ref = doc(db, "2fa", email);
    const snap = await getDoc(ref);

    if (!snap.exists())
      return res.status(200).json({ enabled: false, verified: false });

    const data = snap.data();
    const enabled = !!data.enabled;
    let verified = false;

    if (enabled && data.verifiedUntil) {
      const expires = data.verifiedUntil.toDate();
      verified = new Date() < expires;
    }

    return res.status(200).json({ enabled, verified });
  } catch (err) {
    console.error("Error obteniendo estado 2FA:", err);
    return res.status(500).json({ error: err.message });
  }
}
