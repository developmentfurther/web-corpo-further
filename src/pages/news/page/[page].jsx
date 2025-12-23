"use client";
import Head from "next/head";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import ContextGeneral from "@/services/contextGeneral";
import { useRouter } from "next/router";
import { loadMessages } from "@/lib/i18n";
import { FiClock, FiCalendar, FiArrowRight, FiStar } from "react-icons/fi";

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

  const title = t("news.title", "Noticias");
  const subtitle = t("news.subtitle", "Descubre nuestras últimas publicaciones e insights");

  // === LÓGICA DE FILTRADO ===
  const featuredRaw = blogs.filter(b => b.featured === true || b.featured === "true");
  const featuredPosts = featuredRaw.slice(0, 3);
  
  const regularPosts = [
    ...blogs.filter(b => !b.featured && b.featured !== "true"),
    ...featuredRaw.slice(3)
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (blogsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C212D]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#EE7203] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{title} · Further Corporate</title>
        <meta name="description" content={subtitle} />
      </Head>

      <main className="min-h-screen bg-gray-50">
        
        {/* === HEADER === */}
        <section className="bg-[#0C212D] pt-32 pb-16 px-6 sm:px-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#EE7203] opacity-5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                >
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-[2px] w-10 bg-[#EE7203]"></div>
                    <span className="text-[#EE7203] font-bold tracking-widest text-sm uppercase">Blog & News</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                    {title}
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl font-light">
                    {subtitle}
                </p>
                </motion.div>
            </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          
          {/* === 1. NOTICIA PRINCIPAL (HERO CARD) === */}
          {featuredPosts[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => router.push(`/news/${featuredPosts[0].slug}`)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border-2 border-gray-200 hover:border-[#EE7203] transition-all duration-300 mb-12"
            >
              <div className="grid lg:grid-cols-2 items-center">
                
                {/* Imagen */}
                <div className="relative w-full overflow-hidden">
                  {featuredPosts[0].coverUrl && (
                    <img 
                      src={featuredPosts[0].coverUrl}
                      alt={featuredPosts[0].title}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  {/* Etiqueta a la derecha */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-[#EE7203] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg border border-[#FF3816]">
                        {t("news.topStory", "Historia Principal")}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <FiCalendar className="text-[#EE7203]" />
                    {/* FECHA HARDCODEADA COMO PEDISTE */}
                    <span>{formatDate("2025-06-23", locale)}</span>
                    <span className="mx-2">•</span>
                    <FiClock className="text-[#EE7203]" />
                    <span>{featuredPosts[0].readTime || "5"} {t("news.minRead", "min lectura")}</span>
                  </div>

                  <h2 className="text-3xl md:text-3xl font-bold text-[#0C212D] mb-4 leading-tight group-hover:text-[#EE7203] transition-colors">
                    {featuredPosts[0].title}
                  </h2>

                  <p className="text-gray-600 text-base mb-6 leading-relaxed line-clamp-3">
                    {featuredPosts[0].summary}
                  </p>

                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-2 text-[#0C212D] font-bold border-b-2 border-[#EE7203] pb-1 group-hover:text-[#EE7203] transition-colors">
                      {t("news.readMore", "Leer artículo completo")} <FiArrowRight />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* === 2. SUB-DESTACADOS (GRID 2 COLUMNAS) === */}
          {featuredPosts.length > 1 && (
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {featuredPosts.slice(1, 3).map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => router.push(`/news/${post.slug}`)}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border-2 border-gray-200 hover:border-[#EE7203] transition-all duration-300 flex flex-col"
                >
                  <div className="w-full aspect-video relative overflow-hidden bg-[#112C3E] border-b border-gray-100">
                     {post.coverUrl && (
                        <img 
                          src={post.coverUrl}
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        />
                     )}
                     <div className="absolute top-4 right-4">
                        <span className="bg-white/95 backdrop-blur text-[#0C212D] px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm border border-gray-200">
                            <FiStar className="text-[#EE7203]" /> {t("news.featured", "Destacado")}
                        </span>
                     </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold">
                        {post.category || t("news.defaultCategory", "Noticia")}
                    </div>
                    <h3 className="text-2xl font-bold text-[#0C212D] mb-3 leading-snug group-hover:text-[#EE7203] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-1">
                      {post.summary}
                    </p>
                    <div className="flex items-center text-[#EE7203] font-semibold text-sm gap-2">
                        {t("news.readMore", "Leer más")} <FiArrowRight />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* === 3. LISTA REGULAR (GRID 3 COLUMNAS) === */}
          {regularPosts.length > 0 && (
            <div className="border-t border-gray-200 pt-16">
              <h3 className="text-2xl font-bold text-[#0C212D] mb-8">
                {t("news.latestNews", "Más Recientes")}
              </h3>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <motion.article 
                    key={post.slug}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    onClick={() => router.push(`/news/${post.slug}`)}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#EE7203] hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    <div className="w-full aspect-video relative overflow-hidden bg-gray-200 border-b border-gray-100">
                        {post.coverUrl && (
                            <img 
                              src={post.coverUrl}
                              alt={post.title}
                              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                        )}
                        <div className="absolute inset-0 bg-[#0C212D]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                        <div className="text-xs text-gray-500 mb-2 font-medium flex justify-between">
                            <span>{formatDate(post.date, locale)}</span>
                        </div>
                        <h4 className="text-lg font-bold text-[#0C212D] mb-3 leading-snug group-hover:text-[#FF3816] transition-colors">
                            {post.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4 flex-1">
                            {post.summary || t("news.noSummary", "Sin resumen disponible")}
                        </p>
                        
                        <span className="text-xs font-bold text-[#EE7203] uppercase tracking-wider group-hover:underline">
                            {t("news.readStory", "Leer historia")}
                        </span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// Helpers
function formatDate(dateString, locale) {
  if (!dateString) return "";
  // Se usa new Date(dateString) para las fechas reales
  // Si envías "2025-06-23" como string, también funcionará
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}