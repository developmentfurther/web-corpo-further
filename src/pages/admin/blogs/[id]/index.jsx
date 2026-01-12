// /pages/admin/blogs/[id].jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAdminGuard from "@/lib/guards/withAdminGuard";
import {
  getBlog,
  getBlogContent,
  saveBlogMeta,
  saveBlogLocale,
} from "@/lib/firestore/blogs";
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
const LOCALES = ["es", "en", "pt"];

function EditBlog() {
  const router = useRouter();
  const { id } = router.query; // id = slug

  const [locale, setLocale] = useState("es");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    summary: "",
    coverUrl: "",
    coverKitId: "",
    locale: "es",
    status: "private",
    featured: false,
  });

  const [blocks, setBlocks] = useState({ blocks: [] });

  // ============================
  // Estados para subir imagen
  // ============================
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sizes, setSizes] = useState({ beforeMB: 0, afterMB: 0 });

  // ============================
  // Estados para botón flotante draggable
  // ============================
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Cargar meta + contenido por idioma
  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const meta = await getBlog(id, locale);
        const content = await getBlogContent(id, locale);

        if (!alive) return;
        setForm({
          title: meta?.title || "",
          summary: meta?.summary || "",
          coverUrl: meta?.coverUrl || "",
          coverKitId: meta?.coverKitId || "",
          status: meta?.status || "private",
          locale: meta?.locale || locale,
          featured: meta?.featured || false,
        });
        setBlocks({ blocks: content?.blocks || [] });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, locale]);

  // ============================
  // Drag handlers para el botón flotante
  // ============================
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Limitar el botón dentro del viewport
    const maxX = window.innerWidth - 60; // 60px es el ancho aproximado del botón
    const maxY = window.innerHeight - 60;
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, position]);

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

      // 1️⃣ Actualizar meta (usando el slug existente 'id')
      const metaData = {
        slug: id, // ✅ Usar el slug existente
        title: form.title,
        summary: form.summary,
        coverUrl: form.coverUrl,
        status: form.status,
        locale: form.locale,
        featured: form.featured || false,
      };
      
      if (form.coverKitId) {
        metaData.coverKitId = form.coverKitId;
      }

      await saveBlogMeta(metaData);

      // 2️⃣ Guardar solo el contenido del idioma actual (sin auto-traducción)
      await saveBlogLocale({
        slug: id,
        locale: locale, // ✅ Usar el locale del tab actual
        title: form.title,
        summary: form.summary,
        html,
        blocks: blocks.blocks || [],
      });

      alert(`✅ ${locale.toUpperCase()} guardado correctamente.`);
      
      // Recargar para mostrar cambios
      router.replace(router.asPath);
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      alert(`❌ Error al guardar: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!id || loading) {
    return <div className="p-6 text-white/70">Cargando…</div>;
  }

  const previewHtml = renderBlocksToHtml(blocks?.blocks || []);

  return (
    <main className="min-h-screen bg-[#0A1628] text-white py-10 pt-28">
      <div className={SHELL}>
        <button
          type="button"
          onClick={() => router.push("/admin/blogs")}
          className={BTN_SECONDARY}
        >
          Volver a Blogs
        </button>

        <div className={CARD}>
          <h1 className={TITLE}>Editar blog: {id}</h1>

          {/* Tabs de idioma */}
          <div className="flex gap-2 mb-6">
            {LOCALES.map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-3 py-1.5 rounded ${
                  l === locale
                    ? "bg-gradient-to-r from-[#EE7203] to-[#FF3816] text-white"
                    : "bg-white/10 text-white/70"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <form onSubmit={onSave} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Título</label>
                <input
                  className={INPUT}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className={LABEL}>Resumen</label>
                <textarea
                  className={`${INPUT} h-24 resize-none`}
                  value={form.summary}
                  onChange={(e) =>
                    setForm({ ...form, summary: e.target.value })
                  }
                />
              </div>

              {/* 🖼️ Imagen de portada */}
              <div className="md:col-span-2">
                <label className={LABEL}>Imagen de portada</label>

                {!form.coverUrl ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFile}
                    className="w-full bg-white/10 rounded px-3 py-2 outline-none cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gradient-to-r file:from-[#EE7203] file:to-[#FF3816] file:text-white hover:file:opacity-90"
                  />
                ) : (
                  <div className="space-y-3">
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
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFile}
                        className="w-full bg-white/10 rounded px-3 py-2 outline-none cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gradient-to-r file:from-[#EE7203] file:to-[#FF3816] file:text-white hover:file:opacity-90"
                      />
                      <p className="text-xs text-white/50 mt-1">
                        Selecciona una nueva imagen para reemplazar la actual
                      </p>
                    </div>
                  </div>
                )}

                {uploading && (
                  <p className="text-sm text-white/70 mt-2">
                    Subiendo... {progress}%
                  </p>
                )}
              </div>

              <div>
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
            </div>

            {/* Editor */}
            <div>
              <label className={LABEL}>Contenido</label>
              <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.1]">
                {/* Contenedor físico para Editor.js */}
                <div id="editorjs-edit" />
                <Editor
                  data={blocks}
                  onChange={setBlocks}
                  holder="editorjs-edit"
                  slug={`${id}-${locale}`}
                />
              </div>
            </div>

            {/* Vista previa */}
            <div className="mt-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-white/70 text-sm mb-3">Vista previa:</h3>
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className={BTN_PRIMARY} disabled={saving}>
                {saving ? "Guardando…" : `Guardar ${locale.toUpperCase()}`}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/blogs")}
                className={BTN_SECONDARY}
              >
                Volver a Blogs
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ============================
          BOTÓN FLOTANTE DRAGGABLE
          ============================ */}
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        onMouseDown={handleMouseDown}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-[#EE7203] to-[#FF3816] text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" 
            />
          </svg>
        )}
      </button>
    </main>
  );
}

export default withAdminGuard(EditBlog);