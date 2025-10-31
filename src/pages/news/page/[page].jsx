// /pages/news/page/[page].jsx
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { listBlogs } from "@/lib/firestore/blogs";
import { loadMessages } from "@/lib/i18n";

const PAGE_SIZE = 6;
const COLORS = {
  dark: "#0C212D",
  accentFrom: "#EE7203",
  accentTo: "#FF3816",
  alt: "#112C3E",
  white: "#FFFFFF",
};

export default function NewsPage({ messages, items, locale, totalPages, page }) {
  const t = (k, d) => k.split(".").reduce((o, i) => (o ? o[i] : undefined), messages) ?? d;

  const title = t("news.title", "News");
  const subtitle = t("news.subtitle", "Our latest articles and stories");

  return (
    <>
      <Head>
        <title>{`${title} · Page ${page}`}</title>
        <meta name="description" content={subtitle} />
      </Head>

      <main
  className="min-h-screen text-white bg-gradient-to-b from-[#0A1628] via-[#0C212D] to-[#0C212D]"
>
  {/* HERO */}
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(70%_90%_at_50%_10%,rgba(238,114,3,0.08),transparent)]" />
    <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_90%_80%,rgba(255,56,22,0.06),transparent)]" />
    <div className="relative z-10 text-center max-w-3xl mx-auto px-6 pt-28 pb-16">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(238,114,3,0.3)]"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-4 text-white/70 text-lg"
      >
        {subtitle}
      </motion.p>
    </div>
  </section>

  
  {/* GRID DE BLOGS */}
<section className="max-w-7xl mx-auto px-6 pb-24">
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
    {items.map((post, i) => (
      <motion.article
        key={post.slug}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: i * 0.05 }}
        className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-xl shadow-[0_0_25px_-8px_rgba(0,0,0,0.6)] hover:shadow-[0_0_30px_-5px_rgba(255,56,22,0.3)] transition-all duration-500"
      >
        {/* Imagen */}
        {post.coverUrl && (
          <div
            className="h-48 bg-cover bg-center w-full transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${post.coverUrl})` }}
          />
        )}

       {/* Contenido */}
<div className="flex flex-col flex-1 p-6">
  <div className="flex-1">
    {/* --- TÍTULO LIMPIO --- */}
    <h3
      className="text-lg sm:text-xl font-bold mb-2 leading-snug bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent group-hover:brightness-110 transition-all"
      title={post.title}
    >
      {formatTitle(post.title)}
    </h3>

    {/* --- RESUMEN (Firestore, truncado) --- */}
    {post.summary && post.summary.trim() !== "" ? (
      <p className="text-sm text-white/70">
        {truncateWords(post.summary, 25)}
      </p>
    ) : (
      <p className="text-sm text-white/50 italic">
        {t("news.noPosts", "Sin descripción disponible.")}
      </p>
    )}
  </div>

  {/* --- BOTÓN VER MÁS --- */}
  <div className="mt-5">
    <Link
      href={`/news/${post.slug}`}
      className="inline-flex items-center gap-1 text-sm font-semibold text-[#FF3816] hover:text-[#EE7203] transition-colors underline decoration-transparent hover:decoration-[#EE7203]"
    >
      {t("news.readMore", "Ver más")}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 transition-transform group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 4.5L21 12l-7.5 7.5M21 12H3"
        />
      </svg>
    </Link>
  </div>
</div>




      </motion.article>
    ))}
  </div>
</section>


  {/* PAGINADOR */}
  {totalPages > 1 && (
    <div className="pb-20 flex justify-center gap-3">
      {Array.from({ length: totalPages }).map((_, i) => {
        const n = i + 1;
        const isActive = n === page;
        const href = n === 1 ? "/news" : `/news/page/${n}`;
        return (
          <Link
            key={n}
            href={href}
            scroll={false}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-[#EE7203] to-[#FF3816] text-white shadow-[0_0_20px_-5px_rgba(255,56,22,0.6)] scale-105"
                : "bg-white/10 hover:bg-white/20 text-white/80"
            }`}
          >
            {n}
          </Link>
        );
      })}
    </div>
  )}
</main>

    </>
  );
}

// --- Static generation ---
export async function getStaticPaths() {
  const locales = ["es", "en", "pt"];
  const paths = locales.map((locale) => ({
    params: { page: "1" },
    locale,
  }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps(ctx) {
  const locale = ctx.locale || "es";
  const messages = await loadMessages(locale, ["common", "nav", "news"]).catch(() => ({}));

  // Traer todos los blogs publicados
  const all = await listBlogs({ status: "public" });

  // Filtrar por idioma (si la metadata indica locales)
  const filtered = all.filter((b) =>
    Array.isArray(b.locales) ? b.locales.includes(locale) : true
  );

  // Ordenar por fecha
  const ordered = filtered.sort(
    (a, b) => (b.updatedAt?._seconds || 0) - (a.updatedAt?._seconds || 0)
  );

  // Calcular paginación
  const totalPages = Math.ceil(ordered.length / PAGE_SIZE);
  const page = parseInt(ctx.params?.page ?? "1", 10);
  const start = (page - 1) * PAGE_SIZE;
  const slice = ordered.slice(start, start + PAGE_SIZE);

  // 🔹 Cargar metadata real por idioma (getBlog)
  const items = await Promise.all(
    slice.map(async (b) => {
      const meta = await import("@/lib/firestore/blogs")
        .then((m) => m.getBlog(b.slug, locale))
        .catch(() => null);

      return {
        slug: b.slug,
        coverUrl: meta?.coverUrl || b.coverUrl || "",
        title: meta?.title || b.title || b.slug,
        summary: meta?.summary || "",
      };
    })
  );

  return {
    props: { messages, items, locale, totalPages, page },
    revalidate: 60,
  };
}


function truncateText(str = "", max = 110) {
  const clean = String(str).trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).trim() + "…";
}

// Devuelve el texto de preview que va abajo del título
function getPreviewText({ t, post }) {
  // 1. Intentar summary ya traducido en i18n por slug
  const translatedSummary = t(
    `blogs.${post.slug}.summary`,
    "__FALLBACK__"
  );

  if (translatedSummary !== "__FALLBACK__" && translatedSummary.trim() !== "") {
    return truncateText(translatedSummary, 110);
  }

  // 2. Intentar summary que viene directo de Firestore
  if (post.summary && post.summary.trim() !== "") {
    return truncateText(post.summary, 110);
  }

  // 3. Última chance: usar la key genérica (pero NO "No hay publicaciones disponibles")
  // porque eso suena a "no hay post", no a "no hay descripción".
  const fallback = t(
    "news.noPosts",
    "Sin descripción disponible."
  );

  return truncateText(fallback, 110);
}
function truncateWords(text = "", maxWords = 25) {
  const clean = text.trim().replace(/\s+/g, " ");
  const words = clean.split(" ");
  if (words.length <= maxWords) return clean;
  return words.slice(0, maxWords).join(" ") + "…";
}

function formatTitle(title = "") {
  if (!title) return "";
  // Quita guiones y pone mayúscula inicial por palabra
  return title
    .replace(/-/g, " ")
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

