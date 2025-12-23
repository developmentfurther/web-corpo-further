"use client";
import Head from "next/head";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ContextGeneral from "@/services/contextGeneral";
import { loadMessages } from "@/lib/i18n"; // Asegúrate de importar esto si no lo tenías
import { FiArrowLeft, FiClock, FiCalendar, FiShare2, FiLinkedin, FiTwitter, FiLink } from "react-icons/fi";

export default function BlogDetail() {
  const router = useRouter();
  const locale = router.locale || "es";
  const { slug } = router.query;
  const { getBlogBySlug, blogs } = useContext(ContextGeneral);
  const [post, setPost] = useState(null);
  const [messages, setMessages] = useState({});

  // Función de traducción simple
  const t = (k, d) =>
    k.split(".").reduce((o, i) => (o ? o[i] : undefined), messages) ?? d;

  // Carga de mensajes de traducción
  useEffect(() => {
    if (!locale) return;
    // Asegúrate de que "blog" esté en la lista de namespaces si usaste mi JSON anterior
    loadMessages(locale, ["common", "nav", "news", "blog"]) 
      .then(setMessages)
      .catch(() => ({}));
  }, [locale]);

  useEffect(() => {
    if (!slug) return;
    setPost(null);
    getBlogBySlug(slug, router.locale || "es").then(setPost);
  }, [slug, router.locale]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#EE7203] border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 font-medium">
            {t("blog.loading", "Cargando publicación...")}
          </span>
        </div>
      </div>
    );
  }

  // Filtrar relacionados y evitar mostrar el actual
  const related = blogs?.filter((b) => b.slug !== slug).slice(0, 3) || [];

  return (
    <>
      <Head>
        <title>{post.title} · {t("blog.headerTitle", "Further Insights")}</title>
        <meta name="description" content={post.summary} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        {post.coverUrl && <meta property="og:image" content={post.coverUrl} />}
      </Head>

      <main className="min-h-screen bg-white">
        
        {/* === HEADER DE NAVEGACIÓN === */}
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
            <button 
              onClick={() => router.push("/news")}
              className="group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0C212D] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#EE7203] group-hover:text-white transition-all">
                <FiArrowLeft />
              </div>
              <span className="hidden sm:inline">
                {t("blog.backToNews", "Volver a Noticias")}
              </span>
            </button>
            
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#EE7203] uppercase tracking-widest">
                    {t("blog.headerTitle", "Further Insights")}
                </span>
            </div>
          </div>
        </nav>

        {/* === HERO DE ARTÍCULO (ESTILO EDITORIAL) === */}
        <header className="max-w-4xl mx-auto px-6 pt-16 pb-12">
           {/* Categoría / Fecha */}
           <div className="flex items-center gap-4 text-sm mb-6">
              <span className="text-[#EE7203] font-bold uppercase tracking-wider">
                  {post.category || t("blog.defaultCategory", "Artículo")}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-gray-500 flex items-center gap-2">
                  <FiCalendar className="text-[#EE7203]" />
                  {formatDate(post.date, locale)}
              </span>
           </div>

           {/* Título Masivo */}
           <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-[#0C212D] leading-[1.1] mb-8 tracking-tight"
           >
              {post.title}
           </motion.h1>

           {/* Resumen / Lead */}
           {post.summary && (
             <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light border-l-4 border-[#EE7203] pl-6 mb-10">
               {post.summary}
             </p>
           )}

           {/* Autor y Tiempo de lectura */}
           <div className="flex items-center justify-between border-t border-b border-gray-100 py-6">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0C212D] flex items-center justify-center text-white font-bold text-sm">
                      FC
                  </div>
                  <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#0C212D]">
                        {t("blog.teamName", "Equipo Further")}
                      </span>
                      <span className="text-xs text-gray-400">
                        {t("blog.author", "Autor")}
                      </span>
                  </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                  <FiClock className="text-[#EE7203]" />
                  {post.readTime || "5"} {t("blog.readTime", "min lectura")}
              </div>
           </div>
        </header>

        {/* === IMAGEN DE PORTADA (FULL WIDTH CONTAINER) === */}
        {post.coverUrl && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto px-4 sm:px-6 mb-16"
            >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#0C212D]/10">
                    <img 
                        src={post.coverUrl} 
                        alt={post.title}
                        className="w-full h-auto object-cover"
                    />
                </div>
            </motion.div>
        )}

        {/* === CONTENIDO DEL ARTÍCULO === */}
        <article className="max-w-3xl mx-auto px-6 mb-20">
            <div 
                className="
                /* === CONFIGURACIÓN BASE === */
                prose prose-lg max-w-none
                prose-slate
                
                /* === ENCABEZADOS (Igual que tu Header) === */
                prose-headings:font-black 
                prose-headings:tracking-tight 
                prose-headings:text-[#0C212D]
                
                /* === TEXTO NORMAL === */
                prose-p:text-gray-600 
                prose-p:leading-8 
                prose-p:font-normal
                
                /* === ENLACES (Tu Naranja) === */
                prose-a:text-[#EE7203] 
                prose-a:font-bold 
                prose-a:no-underline 
                hover:prose-a:text-[#FF3816] 
                hover:prose-a:underline
                
                /* === ELEMENTOS DESTACADOS === */
                prose-strong:text-[#0C212D] 
                prose-strong:font-black
                
                /* === CITAS (BLOCKQUOTES) MODERNAS === */
                prose-blockquote:not-italic 
                prose-blockquote:font-medium 
                prose-blockquote:text-[#0C212D]
                prose-blockquote:border-l-4 
                prose-blockquote:border-l-[#EE7203]
                prose-blockquote:bg-gray-50 
                prose-blockquote:py-3 
                prose-blockquote:px-6 
                prose-blockquote:rounded-r-xl
                
                /* === LISTAS === */
                prose-li:text-gray-600
                prose-li:marker:text-[#EE7203] 
                prose-li:marker:font-bold
                
                /* === IMÁGENES DENTRO DEL TEXTO === */
                prose-img:rounded-3xl 
                prose-img:shadow-xl 
                prose-img:border 
                prose-img:border-gray-100
                prose-img:my-10

                /* === CÓDIGO === */
                prose-code:text-[#EE7203] 
                prose-code:bg-gray-100 
                prose-code:px-2 
                prose-code:py-1 
                prose-code:rounded-md 
                prose-code:before:content-none 
                prose-code:after:content-none

                /* === FORZADOS DE SEGURIDAD (Override de estilos inline) === */
                [&_h1]:!text-[#0C212D] [&_h1]:!font-black
                [&_h2]:!text-[#0C212D] [&_h2]:!font-black
                [&_h3]:!text-[#0C212D] [&_h3]:!font-bold
                [&_h4]:!text-[#0C212D] [&_h4]:!font-bold
                [&_p]:!text-gray-600
                [&_strong]:!text-[#0C212D]
                [&_li]:!text-gray-600
                "
                dangerouslySetInnerHTML={{ __html: post.html }}
            />

            {/* Tags / Share Section Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-[#0C212D] font-bold text-lg">
                        {t("blog.shareTitle", "¿Te gustó este artículo?")}
                    </p>
                    <div className="flex gap-3">
                         <SocialButton icon={<FiLinkedin />} onClick={() => share('linkedin', post)} />
                         <SocialButton icon={<FiTwitter />} onClick={() => share('twitter', post)} />
                         <SocialButton icon={<FiLink />} onClick={() => share('copy', post, t)} />
                    </div>
                </div>
            </div>
        </article>

        {/* === ARTÍCULOS RELACIONADOS === */}
        {related.length > 0 && (
            <section className="bg-[#F8FAFC] py-20 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 sm:px-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1 h-8 bg-[#EE7203]"></div>
                        <h3 className="text-2xl font-bold text-[#0C212D]">
                            {t("blog.continueReading", "Continúa leyendo")}
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {related.map((item, idx) => (
                            <motion.div
                                key={item.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => router.push(`/news/${item.slug}`)}
                                className="group cursor-pointer flex flex-col"
                            >
                                <div className="aspect-video rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 mb-4 relative">
                                    {item.coverUrl ? (
                                        <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full bg-[#112C3E] flex items-center justify-center text-white/20">Further</div>
                                    )}
                                </div>
                                <span className="text-xs font-bold text-[#EE7203] uppercase mb-2 block">
                                    {t("blog.recommended", "Recomendado")}
                                </span>
                                <h4 className="text-lg font-bold text-[#0C212D] leading-tight group-hover:text-[#EE7203] transition-colors">
                                    {item.title}
                                </h4>
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

// === COMPONENTES PEQUEÑOS ===
function SocialButton({ icon, onClick }) {
    return (
        <button 
            onClick={onClick}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#EE7203] hover:text-[#EE7203] hover:bg-white shadow-sm transition-all"
        >
            {icon}
        </button>
    )
}

// === HELPERS ===
function formatDate(dateString, locale) {
  const dateToUse = dateString ? new Date(dateString) : new Date();
  return dateToUse.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function share(platform, post, t) {
    // Verificamos que estamos en el cliente
    if (typeof window === 'undefined') return;

    const url = window.location.href;
    const text = post.title;
    
    if (platform === 'copy') {
        navigator.clipboard.writeText(url);
        // Usamos la función de traducción si se pasa, sino texto por defecto
        const msg = t ? t("blog.linkCopied", "Enlace copiado al portapapeles") : "Enlace copiado";
        alert(msg);
        return;
    }
    
    let shareUrl = '';
    
    if (platform === 'linkedin') {
        // Usamos el formato Legacy que es más robusto para popups
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
    }
    
    if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    }
    
    // Configuración para centrar el popup
    const width = 600;
    const height = 400;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    window.open(
        shareUrl, 
        'share-dialog', 
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,directories=no,status=no`
    );
}