"use client";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ContextGeneral from "@/services/contextGeneral";

export default function BlogDetail() {
  const router = useRouter();
  const locale = router.locale || "es";
  const { slug } = router.query;
  const { getBlogBySlug, blogs } = useContext(ContextGeneral);
  const [post, setPost] = useState(null);

 useEffect(() => {
  if (!slug) return;
  setPost(null);
  getBlogBySlug(slug, router.locale || "es").then(setPost);
}, [slug, router.locale]);


  if (!post)
    return (
      <div className="p-20 text-center text-gray-500">
        Cargando publicación...
      </div>
    );

  // Artículos relacionados (simples, desde el contexto)
  const related = blogs
    ?.filter((b) => b.slug !== slug)
    .slice(0, 3) || [];

  return (
    <>
      <Head>
        <title>{post.title} · Further News</title>
        <meta name="description" content={post.summary} />
      </Head>

      <main className="min-h-screen bg-white text-gray-900 overflow-hidden">
        {/* HERO */}
        <section className="relative isolate">
          {post.coverUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.coverUrl})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/90 to-white" />

          <div className="relative max-w-5xl mx-auto px-6 pt-48 pb-28 text-center">
            <motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="
    text-4xl sm:text-5xl font-extrabold
    bg-gradient-to-r from-[#EE7203] to-[#FF3816]
    bg-clip-text text-transparent
    leading-tight
    break-words
    whitespace-pre-line
  "
>
  {post.title}
</motion.h1>


            {post.summary && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-4 text-gray-700 text-lg max-w-2xl mx-auto"
              >
                {post.summary}
              </motion.p>
            )}
          </div>
        </section>

        {/* BOTÓN VOLVER */}
        <section className="relative max-w-5xl mx-auto px-6 mt-6 mb-8">
          <button
            onClick={() => router.push("/news")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#EE7203] hover:text-[#FF3816] transition-colors group"
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
            Volver a Noticias
          </button>
        </section>

        {/* CONTENIDO */}
<section className="max-w-3xl mx-auto px-6 pb-24">
  <motion.article
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="
      prose max-w-none
      text-gray-800
      prose-headings:text-gray-900
      prose-strong:text-gray-900
      prose-p:text-gray-800
      prose-li:text-gray-700
      prose-a:text-[#EE7203] hover:prose-a:text-[#FF3816]
      prose-img:rounded-xl
      prose-blockquote:border-l-[#EE7203]
      [&_*]:!text-gray-800           /* ⬅ fuerza texto gris */
      [&_*]:!text-opacity-100        /* ⬅ elimina opacidad heredada */
      [&_p]:!text-gray-800
      [&_span]:!text-gray-800
      [&_li]:!text-gray-700
      [&_strong]:!text-gray-900
      [&_em]:!text-gray-700
    "
    dangerouslySetInnerHTML={{ __html: post.html }}
  />
</section>


        {/* OTROS ARTÍCULOS */}
        {related.length > 0 && (
          <section className="py-20 bg-gray-50 border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent">
                Otros artículos
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((b, i) => (
                  <motion.div
                    key={b.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
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
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {b.summary}
                      </p>
                      <button
                        onClick={() => router.push(`/news/${b.slug}`)}
                        className="text-sm font-semibold text-[#EE7203] hover:text-[#FF3816] underline decoration-transparent hover:decoration-[#FF3816] transition-colors"
                      >
                        Leer más →
                      </button>
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
