// /pages/api/newsletter.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email, origin } = req.body;

  if (!email || !origin) {
    return res.status(400).json({ error: "Faltan datos: email u origen" });
  }

  try {
    // Transport configurado con variables seguras
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // tu email
        pass: process.env.EMAIL_PASS, // contraseña de aplicación
      },
    });

    const info = await transporter.sendMail({
      from: `"Further Newsletter" <${process.env.EMAIL_USER}>`,
      to: process.env.MAIL_RECEIVER || process.env.EMAIL_USER,
      subject: `Nuevo suscriptor - ${origin}`,
      html: `
        <div style="font-family:Arial,sans-serif;">
          <h2>Nuevo registro desde ${origin}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p>Fecha: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log("Mail enviado:", info.messageId);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error enviando newsletter:", err);
    return res.status(500).json({ error: "Error enviando el mail" });
  }
}
