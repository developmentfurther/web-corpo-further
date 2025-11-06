import fs from "fs";
import { formidable } from "formidable";
import ImageKit from "imagekit";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Error parsing form:", err);
      res.status(500).json({ error: "Error parsing form" });
      return;
    }

    try {
      const file = Array.isArray(files.file)
        ? files.file[0]
        : files.file || files?.[Object.keys(files)[0]]?.[0];

      if (!file) {
        res.status(400).json({ error: "Missing file" });
        return;
      }

      const filePath = file.filepath || file.path;
      if (!fs.existsSync(filePath)) {
        res.status(400).json({ error: "File not found" });
        return;
      }

      // ✅ Configuración del SDK de ImageKit
      const imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
      });

      // ✅ Leemos el archivo en base64
      const fileBuffer = fs.readFileSync(filePath);
      const base64File = fileBuffer.toString("base64");

      console.log("📦 Subiendo archivo con ImageKit SDK...");

      // ✅ Subida con SDK (sin fetch ni form-data)
      const uploadResponse = await imagekit.upload({
        file: base64File,
        fileName: file.originalFilename || "upload.jpg",
        folder: "/further",
      });

      console.log("✅ Subida exitosa:", uploadResponse.url);

      const optimizedUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}${uploadResponse.filePath}?tr=w-1600,q-80`;

      res.status(200).json({
        ok: true,
        url: uploadResponse.url,
        optimizedUrl,
        fileId: uploadResponse.fileId,
      });
    } catch (error) {
      console.error("❌ Error al subir a ImageKit:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
}
