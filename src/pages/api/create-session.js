// /pages/api/create-session.js
import { serialize } from "cookie";
import { SignJWT } from "jose";
import admin from "@/lib/firebaseAdmin";

const ADMINS = [
  "sebas@gmail.com",
  "saabtian@gmail.com",
  "test@test.com",
  "dev@dev.com",
  "comunicacioncorporativafurther@gmail.com",
];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ error: "Missing idToken" });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const email = (decoded.email || "").toLowerCase();

    if (!ADMINS.includes(email)) {
      return res.status(403).json({ error: "Not an admin" });
    }

    // Firmar el JWT de sesión
    const secret = new TextEncoder().encode(process.env.SESSION_JWT_SECRET);
    const sessionJwt = await new SignJWT({
      sub: decoded.uid,
      email,
      admin: true,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h") // duración del token (8 horas laborales)
      .sign(secret);

    // 🔹 Duración real de la cookie (8h)
    const maxAgeSeconds = 7 * 24 * 60 * 60; // ✅ 604800 segundos (1 semana)

    // 🔹 Ajuste dinámico de dominio según entorno
    const domain =
      process.env.NODE_ENV === "production"
        ? ".furthercorporate.com"
        : "localhost";

    // Crear cookie
    const cookie = serialize("session", sessionJwt, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: maxAgeSeconds,
      domain: process.env.NODE_ENV === "production" ? domain : undefined,
    });

    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ create-session error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}
