// /pages/admin/blogs/new.jsx
import { useState } from "react";
import { useRouter } from "next/router";
import withAdminGuard from "@/lib/guards/withAdminGuard";
import { saveBlogMeta, saveBlogLocale } from "@/lib/firestore/blogs";
import {
  SHELL,
  CARD,
  INPUT,
  LABEL,
  BTN_PRIMARY,
  BTN_SECONDARY,
  TITLE,
} from "@/styles/adminStyles";
import { renderBlocksToHtml } from "@/lib/renderEditor";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/componentes/Editor"), { ssr: false });

function NewBlog() {
  const router = useRouter();

  // ============================
  // Estado del formulario
  // ============================
  const [form, setForm] = useState({
    title: "",
    summary: "",
    coverUrl: "",      // se llena automáticamente con ImageKit
    coverKitId: "",    // ID del archivo en ImageKit
    locale: "es",
    status: "public",
    featured: false,
  });

  const [blocks, setBlocks] = useState({ blocks: [] });
  const [saving, setSaving] = useState(false);

  // ============================
  // Estados para subir imagen
  // ============================
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sizes, setSizes] = useState({ beforeMB: 0, afterMB: 0 });

  // ============================
  // Subida de imagen a ImageKit
  // ============================
  async function handleCoverFile(e) {
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
      setUploading(true);
      const beforeMB = file.size / 1024 / 1024;
      const compressed = await imageCompression(file, options);
      const afterMB = compressed.size / 1024 / 1024;
      setSizes({ beforeMB, afterMB });

      const formData = new FormData();
      formData.append("file", compressed, compressed.name || file.name);

      const res = await fetch("/api/upload-imagekit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data?.url)
        throw new Error(data.error || "Error al subir");

      setForm((f) => ({
        ...f,
        coverUrl: data.optimizedUrl || data.url,
        coverKitId: data.fileId || "",
      }));

      alert("✅ Imagen subida correctamente a ImageKit");
    } catch (err) {
      console.error(err);
      alert("❌ Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  // ============================
  // Guardar blog
  // ============================
const onSave = async (e) => {
  e.preventDefault();

  if (!blocks?.blocks || blocks.blocks.length === 0) {
    alert("El contenido del blog está vacío.");
    return;
  }

  if (!form.coverUrl) {
    alert("Por favor, subí una imagen de portada antes de guardar.");
    return;
  }

  setSaving(true);
  try {
    const html = renderBlocksToHtml(blocks.blocks || []);

    // 1️⃣ Construir metaData LIMPIO - sin spreads ni nada raro
    const metaData = {};
    
    metaData.title = form.title || "";
    metaData.summary = form.summary || "";
    metaData.coverUrl = form.coverUrl || "";
    metaData.status = form.status || "public";
    metaData.locale = form.locale || "es";
    metaData.featured = form.featured || false;
    
    // Solo agregar coverKitId si existe
    if (form.coverKitId && String(form.coverKitId).trim()) {
      metaData.coverKitId = String(form.coverKitId).trim();
    }

    // ✅ DEBUG COMPLETO
    console.log("📤 metaData COMPLETO:", JSON.stringify(metaData, null, 2));
    console.log("📤 form.coverKitId original:", form.coverKitId);
    console.log("📤 Todas las keys de metaData:", Object.keys(metaData));
    console.log("📤 Valores undefined?", Object.entries(metaData).filter(([k,v]) => v === undefined));

    const meta = await saveBlogMeta(metaData);

    // 2️⃣ Guardar contenido del idioma base
    await saveBlogLocale({
      slug: meta.slug,
      locale: metaData.locale,
      title: metaData.title,
      summary: metaData.summary,
      html,
      blocks: blocks.blocks || [],
    });

    // 3️⃣ Auto-traducción si idioma base = "es"
    if (metaData.locale === "es") {
      for (const to of ["en", "pt"]) {
        try {
          const res = await fetch("/api/translate-blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "es",
              to,
              html,
              blocks: blocks.blocks || [],
              title: metaData.title,
              summary: metaData.summary,
            }),
          });

          const data = await res.json();

          await saveBlogLocale({
            slug: meta.slug,
            locale: to,
            title: data?.translatedTitle || metaData.title,
            summary: data?.translatedSummary || metaData.summary,
            html: data?.translatedHtml || html,
            blocks: Array.isArray(data?.translatedBlocks) 
              ? data.translatedBlocks 
              : blocks.blocks || [],
          });

          console.log(`✅ ${to.toUpperCase()} traducido correctamente`);
        } catch (err) {
          console.error(`❌ Error al traducir ${to}:`, err);
          await saveBlogLocale({
            slug: meta.slug,
            locale: to,
            title: metaData.title,
            summary: metaData.summary,
            html,
            blocks: blocks.blocks || [],
          });
        }
      }
    }

    alert("✅ Blog creado con éxito.");
    router.push(`/admin/blogs/${meta.slug}?locale=${metaData.locale}`);
  } catch (err) {
    console.error("❌ Error al crear blog:", err);
    console.error("❌ Stack completo:", err.stack);
    alert(`❌ Error al crear el blog: ${err.message}`);
  } finally {
    setSaving(false);
  }
};

  // ============================
  // Render
  // ============================
  const previewHtml = renderBlocksToHtml(blocks?.blocks || []);

  return (
    <main className="min-h-screen bg-[#0A1628] text-white py-10 pt-28">
      <div className={SHELL}>
        <button
          onClick={() => router.push("/admin")}
          className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition"
        >
          <span className="text-lg">←</span>
          <span className="text-sm">Volver al listado</span>
        </button>

        <div className={CARD}>
          <h1 className={TITLE}>Nuevo Blog</h1>

          <form onSubmit={onSave} className="space-y-6">
            {/* 🏷️ Título */}
            <div>
              <label className={LABEL}>Título</label>
              <input
                className={INPUT}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Título del post..."
                required
              />
            </div>

            {/* 📝 Resumen */}
            <div>
              <label className={LABEL}>Resumen</label>
              <textarea
                className={`${INPUT} h-24 resize-none`}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="Breve descripción..."
                required
              />
            </div>

            {/* 🖼️ Imagen de portada */}
            <div>
              <label className={LABEL}>Imagen de portada</label>

              {!form.coverUrl ? (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFile}
                  className="w-full bg-white/10 rounded px-3 py-2 outline-none cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gradient-to-r file:from-[#EE7203] file:to-[#FF3816] file:text-white hover:file:opacity-90"
                />
              ) : (
                <div className="flex items-center gap-4">
                  <div className="relative w-40 h-28 rounded-lg overflow-hidden border border-white/10 shadow-md">
                    <Image
                      src={form.coverUrl}
                      alt="cover preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    {sizes.beforeMB > 0 && (
                      <p className="text-xs text-white/60">
                        {sizes.beforeMB.toFixed(2)} MB → {sizes.afterMB.toFixed(2)} MB
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          coverUrl: "",
                          coverKitId: "",
                        }))
                      }
                      className="bg-red-600/90 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition"
                    >
                      Eliminar imagen
                    </button>
                  </div>
                </div>
              )}

              {uploading && (
                <p className="text-sm text-white/70 mt-2">
                  Subiendo... {progress}%
                </p>
              )}
            </div>

            {/* 🌐 Idioma y estado */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className={LABEL}>Idioma base</label>
                <select
                  className={INPUT}
                  value={form.locale}
                  onChange={(e) => setForm({ ...form, locale: e.target.value })}
                >
                  <option value="es">es</option>
                  <option value="en">en</option>
                  <option value="pt">pt</option>
                </select>
              </div>
              <div className="flex-1">
                <label className={LABEL}>Estado</label>
                <select
                  className="w-full bg-[#112C3E] text-white border border-white/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF3816]"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="public">public</option>
                  <option value="unlisted">unlisted</option>
                </select>
              </div>
            </div>
            {/* ⭐ Destacado */}
<div className="flex items-center gap-3">
  <input
    type="checkbox"
    id="featured"
    checked={form.featured}
    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
    className="w-5 h-5 rounded border-white/20 bg-[#112C3E] text-[#FF3816] focus:ring-2 focus:ring-[#FF3816]"
  />
  <label htmlFor="featured" className={LABEL}>
    Marcar como destacado
  </label>
</div>

            {/* 🧩 Editor visual */}
            <div>
              <label className={LABEL}>Contenido</label>
              <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.1]">
                <div id="editorjs" />
                <Editor
                  data={blocks}
                  onChange={setBlocks}
                  holder="editorjs"
                  slug="draft"
                />
              </div>
            </div>

            {/* 👀 Vista previa */}
            <div className="mt-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-white/70 text-sm mb-3">Vista previa:</h3>
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>

            {/* 🚀 Botones */}
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={saving} className={BTN_PRIMARY}>
                {saving ? "Guardando..." : "Crear blog"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin")}
                className={BTN_SECONDARY}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default withAdminGuard(NewBlog);
