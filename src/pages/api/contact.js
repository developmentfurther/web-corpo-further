// /pages/api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  const { name, email, company , phone, message, origin } = req.body;

  if (!email || !message)
    return res.status(400).json({ error: "Faltan datos obligatorios." });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Further Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.MAIL_RECEIVER || process.env.EMAIL_USER,
      subject: `Nuevo mensaje desde ${origin || "Formulario General"}`,
      html: `
        <div style="font-family:Arial,sans-serif;">
          <h2>Nuevo mensaje desde ${origin || "sitio web"}</h2>
          <p><strong>Nombre:</strong> ${name || "No indicado"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Compañia:</strong> ${company}</p>
          <p><strong>Teléfono:</strong> ${phone || "-"}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message}</p>
          <hr/>
          <p>Origen del formulario: <b>${origin}</b></p>
          <p>Fecha: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log("✅ Mail enviado:", info.messageId);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error enviando mail:", error);
    return res.status(500).json({ error: "Error al enviar el mail." });
  }
}
