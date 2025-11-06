"use client";
import { useState } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";

export default function UploadToImageKit({ onUploaded }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      onProgress: (p) => setProgress(Math.round(p)),
    };

    try {
      setLoading(true);
      const compressed = await imageCompression(file, options);
      console.log(
        `✅ Comprimida de ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressed.size / 1024 / 1024).toFixed(2)}MB`
      );

      const formData = new FormData();
      formData.append("file", compressed, compressed.name || file.name);

      const res = await fetch("/api/upload-imagekit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data.error || "Upload failed");

      onUploaded?.(data.optimizedUrl || data.url);
      alert("✅ Imagen subida correctamente");
    } catch (err) {
      console.error(err);
      alert("❌ Error al subir la imagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white/80">Subir imagen</label>
      <input type="file" accept="image/*" onChange={handleFile} className="text-sm" />
      {preview && (
        <div className="mt-3 relative w-40 h-28 rounded-xl overflow-hidden border border-white/10">
          <Image src={preview} alt="preview" fill className="object-cover" />
        </div>
      )}
      {loading && (
        <p className="text-xs text-white/70">
          Comprimiendo / Subiendo... {progress ? `${progress}%` : ""}
        </p>
      )}
    </div>
  );
}
