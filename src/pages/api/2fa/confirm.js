// /pages/api/2fa/confirm.js
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  // cookie válida por 30 min
  const cookie = serialize("2fa_verified", "true", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60,
  });

  res.setHeader("Set-Cookie", cookie);
  return res.status(200).json({ ok: true });
}
