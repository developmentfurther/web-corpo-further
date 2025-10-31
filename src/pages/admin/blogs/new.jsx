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

import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@/componentes/Editor"), { ssr: false });

function NewBlog() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    summary: "",
    coverUrl: "",
    locale: "es",
    status: "private",
  });

  const [blocks, setBlocks] = useState({ blocks: [] });
  const [saving, setSaving] = useState(false);

  const onSave = async (e) => {
    e.preventDefault();

    if (!blocks?.blocks || blocks.blocks.length === 0) {
      alert("El contenido del blog está vacío.");
      return;
    }

    setSaving(true);
    try {
      // HTML a partir de los bloques del editor
      const html = renderBlocksToHtml(blocks.blocks || []);

      // 1) Guardar meta raíz (crea el doc y setea status/cover + locale base)
      const meta = await saveBlogMeta({
        title: form.title,
        summary: form.summary,
        coverUrl: form.coverUrl,
        status: form.status,
        locale: form.locale, // es | en | pt
      });

      // 2) Guardar contenido del locale base (edición humana, sin IA)
      await saveBlogLocale({
        slug: meta.slug,
        locale: form.locale,
        title: form.title,
        summary: form.summary,
        html,
        blocks: blocks.blocks || [],
      });

      // 3) Auto-traducción SOLO si el idioma base es "es" → clonar EN/PT
      // 3️⃣ Auto-traducción (solo si idioma base es "es")
if (form.locale === "es") {
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
          title: form.title,
          summary: form.summary,
        }),
      });

      const data = await res.json();
      if (data?._warn) {
        console.warn("⚠️ Traducción con fallback:", data._warn);
      }

      // fallback: si Gemini no devuelve texto, copiamos el español
      const translatedTitle = data?.translatedTitle || form.title;
      const translatedSummary = data?.translatedSummary || form.summary;
      const translatedHtml = data?.translatedHtml || html;
      const translatedBlocks = Array.isArray(data?.translatedBlocks)
        ? data.translatedBlocks
        : blocks.blocks || [];

      // guardar traducción en Firestore
      await saveBlogLocale({
        slug: meta.slug,
        locale: to,
        title: translatedTitle,
        summary: translatedSummary,
        html: translatedHtml,
        blocks: translatedBlocks,
      });

      console.log(`✅ ${to.toUpperCase()} traducido correctamente`);
    } catch (err) {
      console.error(`❌ Error al traducir ${to}:`, err);
      // fallback: si falla la API, copiamos el español
      await saveBlogLocale({
        slug: meta.slug,
        locale: to,
        title: form.title,
        summary: form.summary,
        html,
        blocks: blocks.blocks || [],
      });
    }
  }
}


      alert("✅ Blog creado con éxito.");
      // Podés ir al listado o directo al editor ES
      router.push(`/admin/blogs/${meta.slug}?locale=${form.locale}`);
    } catch (err) {
      console.error("❌ Error al crear blog:", err);
      alert("❌ Error al crear el blog.");
    } finally {
      setSaving(false);
    }
  };

  const previewHtml = renderBlocksToHtml(blocks?.blocks || []);

  return (
    <main className="min-h-screen bg-[#0A1628] text-white py-10">
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

            <div>
              <label className={LABEL}>Cover URL</label>
              <input
                className={INPUT}
                value={form.coverUrl}
                onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

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

           {/* 🧩 Editor visual */}
<div>
  <label className={LABEL}>Contenido</label>
  <div className="bg-white/[0.05] rounded-xl p-4 border border-white/[0.1]">
    {/* Contenedor físico que Editor.js necesita */}
    <div id="editorjs" />
    <Editor
      data={blocks}
      onChange={setBlocks}
      holder="editorjs"
      slug="draft"
    />
  </div>
</div>

            {/* 🧩 Vista previa */}
            <div className="mt-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-white/70 text-sm mb-3">Vista previa:</h3>
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>

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
