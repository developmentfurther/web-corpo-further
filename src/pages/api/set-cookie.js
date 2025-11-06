// /pages/api/set-cookie.js
import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: "Missing token" });

  const cookie = serialize("authToken", token, {
    path: "/",
    httpOnly: true, // 🔒 no accesible desde JS
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ success: true });
}
