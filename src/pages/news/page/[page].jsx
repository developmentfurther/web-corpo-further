"use client";
import Head from "next/head";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import ContextGeneral from "@/services/contextGeneral";
import { useRouter } from "next/router";
import { loadMessages } from "@/lib/i18n";

export default function NewsPage() {
  const router = useRouter();
  const locale = router.locale || "es";
  const { blogs, blogsLoading } = useContext(ContextGeneral);
  const [messages, setMessages] = useState({});
  const t = (k, d) =>
    k.split(".").reduce((o, i) => (o ? o[i] : undefined), messages) ?? d;

  useEffect(() => {
    if (!locale) return;
    loadMessages(locale, ["common", "nav", "news"])
      .then(setMessages)
      .catch(() => ({}));
  }, [locale]);

  const title = t("news.title", "News");
  const subtitle = t("news.subtitle", "Our latest articles and stories");

  if (blogsLoading)
    return (
      <div className="p-20 text-center text-gray-500">
        Cargando noticias...
      </div>
    );

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={subtitle} />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white text-gray-900 pt-28">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-gray-200">
          {/* sutiles orbes naranjas */}
          <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_10%,rgba(255,130,50,0.08),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(70%_90%_at_20%_90%,rgba(255,56,22,0.06),transparent)]" />

          <div className="relative z-10 text-center max-w-3xl mx-auto px-6 pt-28 pb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-4 text-gray-600 text-lg"
            >
              {subtitle}
            </motion.p>
          </div>
        </section>

        {/* GRID DE BLOGS */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          {blogs.length === 0 ? (
            <p className="text-center text-gray-500">
              {t("news.noPosts", "No hay publicaciones disponibles.")}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                >
                  {post.coverUrl && (
                    <div
                      className="h-48 bg-cover bg-center w-full transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${post.coverUrl})` }}
                    />
                  )}

                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex-1">
                      <h3
                        className="text-lg sm:text-xl font-bold mb-2 leading-snug bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent group-hover:brightness-110"
                        title={post.title}
                      >
                        {formatTitle(post.title)}
                      </h3>

                      {post.summary ? (
                        <p className="text-sm text-gray-700">
                          {truncateWords(post.summary, 25)}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          {t("news.noSummary", "Sin descripción disponible.")}
                        </p>
                      )}
                    </div>

                    <div className="mt-5">
                      <button
                        onClick={() => router.push(`/news/${post.slug}`)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#EE7203] hover:text-[#FF3816] underline decoration-transparent hover:decoration-[#FF3816] transition"
                      >
                        {t("news.readMore", "Leer más")} →
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

/* === Helpers === */
function truncateWords(text = "", maxWords = 25) {
  const clean = text.trim().replace(/\s+/g, " ");
  const words = clean.split(" ");
  if (words.length <= maxWords) return clean;
  return words.slice(0, maxWords).join(" ") + "…";
}

function formatTitle(title = "") {
  if (!title) return "";
  return title
    .replace(/-/g, " ")
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
