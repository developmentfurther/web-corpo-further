// /pages/api/logout.js
import { serialize } from "cookie";

export default function handler(req, res) {
  const cookie = serialize("session", "", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), // expira inmediatamente
  });

  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ ok: true });
}
