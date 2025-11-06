import { authenticator } from "otplib";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
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

    // ✅ Si es válido → marcar como activado
    await updateDoc(ref, {
      enabled: true,
      lastUsed: serverTimestamp(),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error validando 2FA:", err);
    return res.status(500).json({ error: err.message });
  }
}
