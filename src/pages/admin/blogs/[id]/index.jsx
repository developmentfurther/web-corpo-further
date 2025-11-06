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
    status: "private",
  });

  const [blocks, setBlocks] = useState({ blocks: [] });

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
          status: meta?.status || "private",
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

  const onSave = async (e) => {
    e.preventDefault();
    if (!blocks?.blocks || blocks.blocks.length === 0) {
      alert("El contenido del blog está vacío.");
      return;
    }

    setSaving(true);
    try {
      const html = renderBlocksToHtml(blocks.blocks || []);

      // 1) Meta raíz (status/cover). No pasamos title/summary aquí porque viven por-locale.
      await saveBlogMeta({
        slug: id,
        status: form.status,
        coverUrl: form.coverUrl,
        locale, // por si el doc aún no tenía este locale en 'locales'
      });

      // 2) Contenido por-locale (edición humana, sin IA)
      await saveBlogLocale({
        slug: id,
        locale,
        title: form.title,
        summary: form.summary,
        html,
        blocks: blocks.blocks || [],
      });

      alert(`Guardado (${locale.toUpperCase()}) ✅`);
    } catch (err) {
      console.error("❌ Error al guardar:", err);
      alert("❌ Error al guardar.");
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
          onClick={() => router.push("/admin")}
          className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition"
        >
          <span className="text-lg">←</span>
          <span className="text-sm">Volver al listado</span>
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

              <div>
                <label className={LABEL}>Cover URL</label>
                <input
                  className={INPUT}
                  value={form.coverUrl}
                  onChange={(e) =>
                    setForm({ ...form, coverUrl: e.target.value })
                  }
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
                onClick={() => router.push("/admin")}
                className={BTN_SECONDARY}
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default withAdminGuard(EditBlog);
