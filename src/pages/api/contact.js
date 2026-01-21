// /pages/api/contact.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { name, email, company, phone, message, origin } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Further Contact <contacto@furthercorporate.com>",
to: ["nataliaandrea.garcia@gmail.com"],
 // 👈 TU EMAIL (única opción en sandbox)
      replyTo: email,
      subject: `Nuevo mensaje desde ${origin || "Formulario General"}`,
      html: `
        <div style="font-family:Arial,sans-serif;">
          <h2>Nuevo mensaje desde ${origin || "sitio web"}</h2>
          <p><strong>Nombre:</strong> ${name || "No indicado"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Compañía:</strong> ${company || "-"}</p>
          <p><strong>Teléfono:</strong> ${phone || "-"}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message}</p>
          <hr/>
          <p>Origen del formulario: <b>${origin}</b></p>
          <p>Fecha: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Error de Resend:", error);
      return res.status(500).json({ error: error.message || "Error al enviar el mail." });
    }

    console.log("✅ Mail enviado:", data.id);
    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    console.error("❌ Error enviando mail:", error);
    return res.status(500).json({ error: "Error al enviar el mail." });
  }
}