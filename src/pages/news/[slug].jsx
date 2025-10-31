// /pages/news/[slug].jsx
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { getBlog, getBlogContent, listBlogs } from "@/lib/firestore/blogs";
import { renderBlocksToHtml } from "@/lib/renderEditor";
import { loadMessages } from "@/lib/i18n";

const COLORS = {
  dark: "#0C212D",
  alt: "#112C3E",
  gradFrom: "#EE7203",
  gradTo: "#FF3816",
};

export default function BlogDetail({ post, related, messages }) {
  const t = (k, d) => k.split(".").reduce((o, i) => (o ? o[i] : undefined), messages) ?? d;
  if (!post) return <div className="p-10 text-white/60">Blog no encontrado</div>;

  return (
    <>
      <Head>
        <title>{post.title} · Further News</title>
        <meta name="description" content={post.summary} />
      </Head>

      <main
        className="min-h-screen text-white overflow-hidden"
        style={{ backgroundColor: COLORS.dark }}
      >
        {/* --- HERO --- */}
        <section className="relative isolate">
          {post.coverUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.coverUrl})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0C212D]/80 to-[#0C212D]" />
          <div className="relative max-w-5xl mx-auto px-6 pt-48 pb-28 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent"
            >
              {post.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-white/80 text-lg max-w-2xl mx-auto"
            >
              {post.summary}
            </motion.p>
          </div>
        </section>

        {/* --- BOTÓN VOLVER ATRÁS --- */}
<section className="relative max-w-5xl mx-auto px-6 mt-8 mb-4">
  <Link
    href="/news"
    className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF3816] hover:text-[#EE7203] transition-colors group"
  >
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5 transition-transform group-hover:-translate-x-1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5L3 12l7.5-7.5M3 12h18"
      />
    </motion.svg>
    {t("news.backToNews", "Volver a Noticias")}
  </Link>
</section>


        {/* --- CUERPO DEL POST --- */}
        <section className="max-w-3xl mx-auto px-6 pb-24">
          <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="prose prose-invert max-w-none prose-headings:font-semibold prose-a:text-[#FF3816] hover:prose-a:text-[#EE7203] prose-a:transition-colors"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </section>

        {/* --- OTROS ARTÍCULOS --- */}
        {related?.length > 0 && (
          <section
            className="relative py-20"
            style={{ backgroundColor: COLORS.alt }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C212D]/30 to-transparent" />
            <div className="relative max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold mb-10 bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent text-center">
                {t("news.otherArticles" || "Other Articles")}
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((b, i) => (
                  <motion.div
                    key={b.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-xl shadow-[0_0_30px_-12px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-[1.02]"
                  >
                    {b.coverUrl && (
                      <div
                        className="h-40 bg-cover bg-center"
                        style={{ backgroundImage: `url(${b.coverUrl})` }}
                      />
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent">
                        {b.title}
                      </h3>
                      <p className="text-sm text-white/70 line-clamp-2 mb-3">
                        {b.summary}
                      </p>
                      <Link
                        href={`/news/${b.slug}`}
                        className="text-sm font-semibold text-[#FF3816] hover:text-[#EE7203] underline decoration-transparent hover:decoration-[#EE7203]"
                      >
                        {t("news.readMore" || "Read More")} →
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

// Formateador de titulo. Les quita los "-"
function formatTitle(title = "") {
  if (!title) return "";
  return title
    .replace(/-/g, " ")
    .replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}


// === STATIC GENERATION ===
export async function getStaticPaths() {
  const locales = ["es", "en", "pt"];
  const all = await listBlogs({ status: "public" });
  const paths = [];

  for (const locale of locales) {
    for (const b of all) {
      paths.push({ params: { slug: b.slug }, locale });
    }
  }

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params, locale }) {
  const slug = params?.slug;
  if (!slug) return { notFound: true };

  const messages = await loadMessages(locale, ["common", "nav", "news"]).catch(() => ({}));
  const meta = await getBlog(slug, locale);
  const content = await getBlogContent(slug, locale);
  const html = renderBlocksToHtml(content.blocks || []);

  const post = { ...meta, html };

  const all = await listBlogs({ status: "public" });

// 🔹 Traer la metadata traducida por idioma
const related = await Promise.all(
  all
    .filter((b) => b.slug !== slug)
    .slice(0, 3)
    .map(async (b) => {
      const meta = await getBlog(b.slug, locale).catch(() => null);
      return {
        slug: b.slug,
        coverUrl: meta?.coverUrl || b.coverUrl || "",
        title: formatTitle(meta?.title || b.title || b.slug),
        summary: meta?.summary || b.summary || "",
      };
    })
);


  return {
    props: { post, related, messages },
    revalidate: 60,
  };
}
