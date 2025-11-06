// src/componentes/blog/BlogEditorJSE.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/router";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

/* ----------------- small utils ----------------- */
const MAX_TITLE = 110;
const MAX_EXCERPT = 200;
const MAX_TAGS = 10;

function slugify(str = "") {
  return str
    .toLowerCase()
    .trim()
    .replace(/[áàä]/g, "a")
    .replace(/[éèë]/g, "e")
    .replace(/[íìï]/g, "i")
    .replace(/[óòö]/g, "o")
    .replace(/[úùü]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
function countWords(text = "") {
  return (text.match(/\b\w+\b/g) || []).length;
}
function estimateReadMinutes(blocks) {
  const text = (blocks || [])
    .map((b) => {
      if (b.type === "paragraph" && b.data?.text) return b.data.text;
      if (b.type === "header" && b.data?.text) return b.data.text;
      if (b.type === "quote" && b.data?.text) return b.data.text;
      if (b.type === "list" && Array.isArray(b.data?.items))
        return b.data.items.join(" ");
      return "";
    })
    .join(" ");
  const words = countWords(text.replace(/<[^>]+>/g, " "));
  return Math.max(1, Math.round(words / 200));
}

/* --- helper para mensajes de error más claros --- */
function explainFsError(prefix, e) {
  const code = e?.code || e?.name || "unknown";
  const msg = e?.message || "";
  let hint = "";
  if (code.includes("permission-denied")) {
    hint =
      "Firestore rules bloquearon la escritura. Asegurate de estar autenticado o de que las reglas permitan write para este usuario.\nEj. dev:\nservice cloud.firestore { match /databases/{db}/documents { match /{document=**} { allow read, write: if request.auth != null; } } }";
  } else if (code.includes("unavailable") || code.includes("network")) {
    hint = "Problema de red/Firestore no disponible. Verificá conexión.";
  } else if (code.includes("invalid-argument")) {
    hint =
      "Argumento inválido. Revisá que 'firestore' sea una instancia de Firestore (getFirestore) y no el App.";
  }
  return `${prefix}: ${code}\n${msg}${hint ? `\n\n${hint}` : ""}`;
}

/* ----------------- Componente ----------------- */
export default function BlogEditorEJS({
  firestore, // ← solo Firestore, sin Storage
  user,
  onPublished,
}) {
  const router = useRouter();
  const holderRef = useRef(null);
  const editorRef = useRef(null);
  const titleInputRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [postId, setPostId] = useState(null);
  const [dirty, setDirty] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [coverUrl, setCoverUrl] = useState("");

  const [slugEdited, setSlugEdited] = useState(false);
  const returnTab = (router.query?.returnTab || "content").toString();

  /* --- guardas de contexto --- */
  const assertDeps = () => {
    if (!firestore) {
      toast.error("Firestore no está disponible (context/prop undefined).");
      throw new Error("Firestore undefined");
    }
  };

  /* ------------ init EditorJS (dynamic import, sin SSR) ------------ */
  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!holderRef.current || editorRef.current) return;

      // limpia para evitar duplicados
      holderRef.current.innerHTML = "";

      const [
        { default: EditorJS },
        { default: Header },
        { default: List },
        { default: ImageTool },
        { default: Embed },
        { default: Quote },
      ] = await Promise.all([
        import("@editorjs/editorjs"),
        import("@editorjs/header"),
        import("@editorjs/list"),
        import("@editorjs/image"),
        import("@editorjs/embed"),
        import("@editorjs/quote"),
      ]);

      const instance = new EditorJS({
        holder: holderRef.current,
        placeholder:
          "Write your content here… Tip: type / to open the block menu",
        autofocus: true,
        logLevel: "ERROR",
        tools: {
          header: {
            class: Header,
            inlineToolbar: ["bold", "italic", "link"],
            config: { levels: [2, 3, 4], defaultLevel: 2 },
          },
          list: { class: List, inlineToolbar: true },
          quote: { class: Quote, inlineToolbar: true },
          embed: {
            class: Embed,
            config: { services: { youtube: true, twitter: true } },
          },
          image: {
            class: ImageTool,
            // Solo URL: NO uploadByFile
            config: {
              uploader: {
                async uploadByUrl(url) {
                  try {
                    // validación mínima de URL
                    new URL(url);
                    return { success: 1, file: { url } };
                  } catch {
                    toast.error("Invalid image URL");
                    return { success: 0 };
                  }
                },
              },
            },
          },
        },
        onChange: () => setDirty(true),
      });

      try {
        await instance.isReady;
        if (!cancelled) editorRef.current = instance;
      } catch (e) {
        console.error("EditorJS init error:", e);
      }
    }

    init();

    return () => {
      cancelled = true;
      const ed = editorRef.current;
      if (ed && typeof ed.destroy === "function") ed.destroy();
      editorRef.current = null;
      if (holderRef.current) holderRef.current.innerHTML = "";
    };
  }, []);

  /* ------------ helper: insertar debajo del cursor ------------ */
  const insertAt = (type, data = {}) => {
    const api = editorRef.current;
    if (!api) return;
    const current =
      typeof api.blocks.getCurrentBlockIndex === "function"
        ? api.blocks.getCurrentBlockIndex()
        : api.blocks.getBlocksCount() - 1;
    const index = Math.max(0, (current ?? -1) + 1);
    api.blocks.insert(type, data, {}, index);
    setDirty(true);
  };

  /* ------------ toolbar ------------ */
  const insertH2 = () =>
    insertAt("header", { level: 2, text: "Section title" });
  const insertH3 = () =>
    insertAt("header", { level: 3, text: "Subsection title" });
  const insertH4 = () =>
    insertAt("header", { level: 4, text: "Tertiary title" });
  const insertList = () =>
    insertAt("list", {
      style: "unordered",
      items: ["Item 1", "Item 2", "Item 3"],
    });
  const insertOrdered = () =>
    insertAt("list", { style: "ordered", items: ["First", "Second", "Third"] });
  const insertQuote = () =>
    insertAt("quote", {
      text: "A concise, compelling quote…",
      caption: "— Author",
    });

  // Imagen por URL (sin Storage)
  const insertImageByUrlPrompt = async () => {
    const url = window.prompt("Paste image URL:");
    if (!url) return;
    try {
      new URL(url);
      insertAt("image", { file: { url }, caption: "" });
      toast.success("Image inserted");
    } catch {
      toast.error("Invalid image URL");
    }
  };

  const youtubeToEmbed = (url) => {
    try {
      const u = new URL(url);
      let id = "";
      if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
      else if (u.hostname.includes("youtube.com"))
        id = u.searchParams.get("v") || "";
      if (!id) return null;
      return {
        service: "youtube",
        source: `https://www.youtube.com/watch?v=${id}`,
        embed: `https://www.youtube.com/embed/${id}`,
        width: 580,
        height: 320,
      };
    } catch {
      return null;
    }
  };

  const insertYoutube = async () => {
    const url = window.prompt("Paste YouTube URL:");
    if (!url) return;
    const data = youtubeToEmbed(url);
    if (!data) {
      toast.error("Invalid YouTube URL");
      return;
    }
    insertAt("embed", { ...data, caption: "" });
  };

  /* ------------ Title → slug automático ------------ */
  useEffect(() => {
    if (!slugEdited) setSlug(slugify(title));
  }, [title, slugEdited]);

  /* ------------ Navegación segura ------------ */
  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  /* ------------ Atajos ------------ */
  useEffect(() => {
    const onKey = (e) => {
      const isCmd = e.metaKey || e.ctrlKey;
      if (isCmd && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveDraft();
      }
      if (isCmd && (e.key === "Enter" || e.key === "NumpadEnter")) {
        e.preventDefault();
        handleSaveAndPublish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ------------ Guardar ------------ */
  const saveDraft = async () => {
    const ed = editorRef.current;
    if (!ed) return null;

    try {
      assertDeps();

      const rawTitleDom = titleInputRef.current?.value ?? title ?? "";
      const currentTitle = rawTitleDom
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .trim();

      if (!currentTitle) {
        titleInputRef.current?.focus();
        toast.error("Title is required");
        return null;
      }
      if (currentTitle.length > MAX_TITLE) {
        toast.error(`Title too long (max ${MAX_TITLE})`);
        return null;
      }
      if (excerpt.length > MAX_EXCERPT) {
        toast.error(`Excerpt too long (max ${MAX_EXCERPT})`);
        return null;
      }

      setSaving(true);

      const content = await ed.save();
      const readMinutes = estimateReadMinutes(content.blocks);

      const payload = {
        title: currentTitle,
        slug:
          (slugEdited ? slug : slugify(currentTitle)) || slugify(currentTitle),
        excerpt: (excerpt || "").trim(),
        tags,
        coverUrl: coverUrl || "",
        status: "draft",
        authorEmail: user?.email || "anon",
        updatedAt: serverTimestamp(),
        ...(postId ? {} : { createdAt: serverTimestamp() }),
        content,
        readMinutes,
        seo: {
          title: currentTitle,
          description: (excerpt || "").trim(),
        },
      };

      if (!postId) {
        const postsColRef = collection(firestore, "posts");
        const refDoc = await addDoc(postsColRef, payload);
        setPostId(refDoc.id);
        toast.success("Draft created");
        setDirty(false);
        return refDoc.id;
      } else {
        await setDoc(doc(firestore, "posts", postId), payload, { merge: true });
        toast.success("Draft saved");
        setDirty(false);
        return postId;
      }
    } catch (e) {
      console.error("[saveDraft] Firestore error:", e);
      toast.error(explainFsError("Save failed", e));
      return null;
    } finally {
      setSaving(false);
    }
  };

  /* ------------ Publicar ------------ */
  const handleSaveAndPublish = async () => {
    try {
      const id = await saveDraft();
      if (!id) return;

      setSaving(true);
      await setDoc(
        doc(firestore, "posts", id),
        {
          status: "published",
          publishedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      toast.success("Published");
      setDirty(false);
      onPublished?.(id);
    } catch (e) {
      console.error("[publish] Firestore error:", e);
      toast.error(explainFsError("Publish failed", e));
    } finally {
      setSaving(false);
    }
  };

  /* ------------ Tags ------------ */
  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t) return;
    if (tags.includes(t)) {
      toast.info("Tag already added");
      setTagInput("");
      return;
    }
    if (tags.length >= MAX_TAGS) {
      toast.error(`Maximum ${MAX_TAGS} tags`);
      return;
    }
    setTags([...tags, t]);
    setTagInput("");
    setDirty(true);
  };
  const removeTag = (t) => {
    setTags(tags.filter((x) => x !== t));
    setDirty(true);
  };

  /* ------------ UI ------------ */
  const BTN =
    "px-2.5 py-1.5 rounded-lg text-sm border border-white/15 bg-white/10 hover:bg-white/15 outline-none focus-visible:ring-2 focus-visible:ring-[#EE7203]/40 text-white";
  const GRAD =
    "text-white border border-white/10 bg-gradient-to-r from-[#EE7203] to-[#FF3816] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE7203]/50 hover:opacity-95 active:opacity-90 transition";

  const goBackAdmin = () => {
    router.push({ pathname: "/admin", query: { tab: returnTab } });
  };

  /* ------------ Cover URL helpers ------------ */
  const setCoverFromUrl = () => {
    const url = (coverUrl || "").trim();
    if (!url) {
      toast.error("Please paste an image URL");
      return;
    }
    try {
      new URL(url);
      if (
        !/^data:image\//.test(url) &&
        !/\.(png|jpg|jpeg|webp|gif|avif)(\?.*)?$/i.test(url)
      ) {
        toast.message(
          "URL set (non-standard extension). We will still try to render it."
        );
      }
      setCoverUrl(url);
      setDirty(true);
      toast.success("Cover URL set");
    } catch {
      toast.error("Invalid URL");
    }
  };
  const clearCover = () => {
    setCoverUrl("");
    setDirty(true);
  };

  return (
    <div className="space-y-5 text-white">
      {/* Top bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={goBackAdmin}
          className="inline-flex items-center gap-2 text-sm rounded-xl px-3 py-2 border border-white/10 bg-white/5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE7203]/50 transition"
          aria-label="Back to Admin"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back to Admin
        </button>

        <div className="ml-auto flex items-center gap-2 text-xs">
          <span
            className={`px-2 py-1 rounded-lg border ${
              dirty
                ? "border-[#FF3816]/30 bg-[#FF3816]/10 text-[#FFB5A9]"
                : "border-white/15 bg-white/5 text-white/70"
            }`}
          >
            {dirty ? "Unsaved changes" : "All changes saved"}
          </span>
          {postId && (
            <span className="px-2 py-1 rounded-lg border border-white/15 bg-white/5 text-white/70">
              ID: {postId.slice(0, 6)}…
            </span>
          )}
        </div>
      </div>

      {/* Title + slug + cover (URL only) */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <input
            ref={titleInputRef}
            type="text"
            required
            placeholder="Post title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value.slice(0, MAX_TITLE));
              setDirty(true);
            }}
            className="w-full bg-transparent text-2xl font-bold outline-none placeholder-white/40"
            aria-label="Post title"
          />
          <span className="text-xs text-white/60">
            {title.length}/{MAX_TITLE}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1 min-w-0">
            <label className="block text-xs text-white/60 mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugEdited(true);
                setDirty(true);
              }}
              className="w-full bg-white/5 text-sm p-2 rounded-lg outline-none placeholder-white/40"
              placeholder="auto-generated-from-title"
              aria-label="Slug"
            />
            {!slugEdited && (
              <p className="mt-1 text-[11px] text-white/50">
                The slug is auto-generated from title until you edit it.
              </p>
            )}
          </div>
        </div>

        {/* Cover via URL */}
        <div className="space-y-2">
          <label className="block text-xs text-white/60">Cover image URL</label>
          <div className="flex gap-2">
            <input
              type="url"
              inputMode="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setCoverFromUrl();
                }
              }}
              placeholder="https://cdn.example.com/cover.webp"
              aria-label="Cover image URL"
              className="flex-1 bg-white/5 text-sm p-2 rounded-lg outline-none placeholder-white/40"
            />
            <button type="button" className={BTN} onClick={setCoverFromUrl}>
              Set URL
            </button>
            {coverUrl && (
              <button
                type="button"
                className={BTN}
                onClick={clearCover}
                aria-label="Clear cover"
              >
                Clear
              </button>
            )}
          </div>
          {coverUrl ? (
            <div className="flex items-center gap-3">
              <div className="w-36 h-20 rounded-lg overflow-hidden ring-1 ring-white/15 bg-black/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={() => {
                    toast.error("Cover preview failed to load");
                  }}
                />
              </div>
              <a
                href={coverUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs underline text-white/70"
              >
                Open cover in new tab
              </a>
            </div>
          ) : (
            <span className="text-xs text-white/50">No cover</span>
          )}
        </div>
      </div>

      {/* Excerpt + tags */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
        <div>
          <label className="block text-xs text-white/60 mb-1">Excerpt</label>
          <div className="flex items-start gap-2">
            <textarea
              placeholder="Short description for SEO and social cards"
              value={excerpt}
              onChange={(e) => {
                const v = e.target.value.slice(0, MAX_EXCERPT);
                setExcerpt(v);
                setDirty(true);
              }}
              rows={2}
              className="w-full bg-white/5 text-sm p-2 rounded-lg outline-none placeholder-white/40"
              aria-label="Excerpt"
            />
            <span className="text-xs text-white/60 mt-1">
              {excerpt.length}/{MAX_EXCERPT}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/60 mb-1">Tags</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 bg-white/5 text-sm p-2 rounded-lg outline-none placeholder-white/40"
              aria-label="Add tag"
            />
            <button type="button" onClick={addTag} className={BTN}>
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-lg border border-white/15 bg-white/10"
                >
                  #{t}
                  <button
                    type="button"
                    aria-label={`Remove ${t}`}
                    onClick={() => removeTag(t)}
                    className="opacity-80 hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button className={BTN} type="button" onClick={insertH2}>
          H2
        </button>
        <button className={BTN} type="button" onClick={insertH3}>
          H3
        </button>
        <button className={BTN} type="button" onClick={insertH4}>
          H4
        </button>
        <button className={BTN} type="button" onClick={insertList}>
          • List
        </button>
        <button className={BTN} type="button" onClick={insertOrdered}>
          1. List
        </button>
        <button className={BTN} type="button" onClick={insertQuote}>
          “ Quote
        </button>
        <button className={BTN} type="button" onClick={insertImageByUrlPrompt}>
          Image URL
        </button>
        <button className={BTN} type="button" onClick={insertYoutube}>
          YouTube
        </button>
        <span className="ml-auto text-xs text-white/60">
          {dirty ? "Unsaved changes" : "All changes saved"}
        </span>
      </div>

      {/* Editor */}
      <div
        ref={holderRef}
        className="editorjs-dark min-h-[420px] rounded-2xl border border-white/10 bg-[#0C212D]/40 p-4"
        aria-label="Post body editor"
      />

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={saveDraft}
          disabled={saving}
          className="px-4 py-2 rounded-lg text-white border border-white/15 bg-white/10 hover:bg-white/15"
        >
          {saving && !postId ? "Saving…" : "Save Draft  ⌘S"}
        </button>
        <button
          onClick={handleSaveAndPublish}
          disabled={saving}
          className={`px-4 py-2 rounded-lg ${GRAD}`}
        >
          {saving ? "Publishing…" : "Publish  ⌘Enter"}
        </button>
      </div>

      {/* Footnote */}
      <p className="text-xs text-white/50">
        Tip: Use headings (H2/H3/H4) to structure content. Keep the excerpt
        under {MAX_EXCERPT} characters for SEO.
      </p>
    </div>
  );
}
