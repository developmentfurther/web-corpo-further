import { authenticator } from "otplib";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import firebaseApp from "@/services/firebase";

const db = getFirestore(firebaseApp);

export default async function handler(req, res) {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ error: "Faltan datos" });

    const ref = doc(db, "2fa", email.toLowerCase());
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return res.status(404).json({ error: "2FA no configurado" });
    }

    const { secret } = snap.data();
    const valid = authenticator.verify({ token: code, secret });
    if (!valid) return res.status(401).json({ error: "Código incorrecto" });

    // 🔐 Guardar verificación temporal
    const now = new Date();
   const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // ✅ 1 semana
    await updateDoc(ref, {
      enabled: true,
      lastUsed: serverTimestamp(),
      verifiedUntil: Timestamp.fromDate(expires),
    });

    return res.status(200).json({ ok: true, verifiedUntil: expires });
  } catch (err) {
    console.error("Error validando 2FA:", err);
    return res.status(500).json({ error: err.message });
  }
}
