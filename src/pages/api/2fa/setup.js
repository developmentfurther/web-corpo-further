import { authenticator } from "otplib";
import QRCode from "qrcode";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import firebaseApp from "@/services/firebase";

const db = getFirestore(firebaseApp);

export default async function handler(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requerido" });

    const ref = doc(db, "2fa", email.toLowerCase());
    const snap = await getDoc(ref);

    // ✅ Ya tiene 2FA activo
    if (snap.exists() && snap.data().enabled === true) {
      return res.status(200).json({ alreadyEnabled: true });
    }

    // 🚀 Genera un nuevo secreto + QR
    const secret = authenticator.generateSecret();
    const service = "Further Admin Panel";
    const otpauth = authenticator.keyuri(email, service, secret);
    const qr = await QRCode.toDataURL(otpauth);

    await setDoc(
      ref,
      {
        secret,
        enabled: false,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    return res.status(200).json({ qr, otpauth });
  } catch (err) {
    console.error("Error generando 2FA:", err);
    return res.status(500).json({ error: err.message });
  }
}
