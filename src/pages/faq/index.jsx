// /pages/faq.jsx
// FAQ — Multiidioma con i18n

import React, { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { WaveToDark, WaveToLight } from "@/componentes/ui/Waves";
import { loadMessages } from "@/lib/i18n";

/* === Tokens de diseño === */
const BG_DARK = "bg-[#0C212D] text-white";
const BG_ALT = "bg-[#112C3E] text-white";
const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const ACCENT = "from-[#EE7203] via-[#FF5A2B] to-[#FF3816]";
const GRAD = `bg-gradient-to-tr ${ACCENT}`;
const GRAD_TEXT = `bg-gradient-to-tr ${ACCENT} bg-clip-text text-transparent`;
const CARD_GLASS = "rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.35)]";
const CARD_DARK = "rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm shadow-lg shadow-black/20";
const CARD_LIGHT = "rounded-[2rem] border border-gray-200 bg-white shadow-sm";
const TITLE_DARK = "text-white font-bold tracking-tight";

/* === JSON-LD builder === */
function toFaqJsonLd(sections) {
  const allItems = sections.flatMap(s => s.items);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map(it => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a.replace(/<[^>]*>/g, '') },
    })),
  };
}


/* === Componente Individual para Animación === */
const FAQItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article
      id={item.id}
      className="scroll-mt-32 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-start justify-between p-6 text-left bg-white relative z-10 group"
        aria-expanded={isOpen}
      >
        <h3 className={`text-base sm:text-lg font-semibold pr-8 transition-colors duration-300 ${isOpen ? 'text-[#EE7203]' : 'text-[#112C3E] group-hover:text-[#EE7203]'}`}>
          {item.q}
        </h3>
        <span className={`shrink-0 flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 ${isOpen ? 'bg-[#EE7203] text-white' : 'bg-[#112C3E]/5 text-[#112C3E]'}`}>
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {/* Animación usando CSS Grid */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-2 bg-white">
            <div className="h-px w-full bg-gray-100 mb-4" aria-hidden="true" />
            <div
              dangerouslySetInnerHTML={{ __html: item.a }}
              className="prose prose-sm sm:prose-base max-w-none faq-override prose-headings:text-[#112C3E] prose-a:text-[#EE7203] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline"
            />
          </div>
        </div>
      </div>
    </article>
  );
};
/* === Slugify === */
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[áàä]/g, "a")
    .replace(/[éèë]/g, "e")
    .replace(/[íìï]/g, "i")
    .replace(/[óòö]/g, "o")
    .replace(/[úùü]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* === Página === */
export default function FAQPage({ messages }) {
  const t = messages?.faq ?? {};
  const router = useRouter();
  const { locale } = router;

  // i18n fallbacks para meta
  const meta = {
    title: t?.meta?.title || "Preguntas Frecuentes | Further",
    description: t?.meta?.description || "Encuentra respuestas sobre Further: idiomas, servicios corporativos, Further School, Academy, Media y más.",
    ogTitle: t?.meta?.ogTitle || "Preguntas Frecuentes | Further",
    ogDescription: t?.meta?.ogDescription || "Encuentra respuestas sobre Further: idiomas, servicios corporativos, Further School, Academy, Media y más.",
    twitterTitle: t?.meta?.twitterTitle || "Preguntas Frecuentes | Further",
    twitterDescription: t?.meta?.twitterDescription || "Encuentra respuestas sobre Further: idiomas, servicios corporativos, Further School, Academy, Media y más.",
  };

  // i18n fallbacks para breadcrumb
  const breadcrumb = {
    home: t?.breadcrumb?.home || "Inicio",
    current: t?.breadcrumb?.current || "Preguntas Frecuentes",
  };

  // i18n fallbacks para hero
  const hero = {
    title: t?.hero?.title || "Preguntas Frecuentes",
    subtitle: t?.hero?.subtitle || "Todo lo que necesitás saber",
    description: t?.hero?.description || "¿No encontrás la respuesta que buscás? Contactanos y te ayudamos.",
    skipLink: t?.hero?.skipLink || "Ir al contenido",
  };

  // i18n fallbacks para TOC
  const toc = {
    title: t?.toc?.title || "En esta página",
  };

  // i18n fallbacks para CTA
  const cta = {
    title: t?.cta?.title || "¿Todavía tenés dudas?",
    description: t?.cta?.description || "Estamos acá para ayudarte a elegir el mejor camino para vos o tu equipo.",
    contactButton: t?.cta?.contactButton || "Contactanos",
    mediaButton: t?.cta?.mediaButton || "Explorá Further Media",
  };

  // Obtener las secciones desde i18n
  const sections = t?.sections || [];

  // Agregar IDs a las secciones y preguntas
  const sectionsWithIds = useMemo(() => {
    return sections.map(section => ({
      ...section,
      items: section.items.map(item => ({
        ...item,
        id: slugify(item.q),
      })),
    }));
  }, [sections]);

  // Generar JSON-LD
  const jsonLd = useMemo(() => JSON.stringify(toFaqJsonLd(sections)), [sections]);

  // URL canónica basada en locale
  const canonicalUrl = `https://furthercorporate.com${locale !== 'es' ? `/${locale}` : ''}/faq`;

  return (
    <>
      {/* === SEO HEAD === */}
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.ogTitle} />
        <meta property="og:description" content={meta.ogDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={meta.twitterTitle} />
        <meta name="twitter:description" content={meta.twitterDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </Head>

      {/* === Skip link === */}
      <a
        href="#faq-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:text-[#0C212D] focus:bg-white"
      >
        {hero.skipLink}
      </a>

      <main className="bg-[#0C212D] min-h-screen font-sans selection:bg-[#EE7203] selection:text-white" id="top">
  
  {/* === HERO SECTION === */}
  <section className="relative relative overflow-hidden" aria-labelledby="faq-hero-title">
    {/* Fondo decorativo con gradiente corporativo difuminado */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-20">
       <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#EE7203] to-[#FF3816] blur-[120px]" />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm font-medium text-[#112C3E] bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
          <li>
            <Link
              href="/"
              className="text-gray-300 hover:text-[#EE7203] transition-colors focus-visible:outline-none"
            >
              {breadcrumb.home}
            </Link>
          </li>
          <li aria-hidden="true" className="text-gray-500">/</li>
          <li className="text-white">{breadcrumb.current}</li>
        </ol>
      </nav>

      <header>
        <h1
          id="faq-hero-title"
          className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
        >
          <span className="block">{hero.title}</span>
          <span className="bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent">
            {hero.subtitle}
          </span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed border-l-4 border-[#EE7203] pl-6">
          {hero.description}
        </p>
      </header>
    </div>
    
    {/* Wave Divider (Opcional: Si tus componentes Wave tienen relleno hardcoded, asegúrate que coincidan con #f9fafb) */}
    <div className="text-gray-50">
       <WaveToLight />
    </div>
  </section>

  {/* === CONTENIDO PRINCIPAL === */}
  <section
    id="faq-main"
    className="bg-gray-50 text-[#0C212D]"
    aria-labelledby="faq-content-title"
  >
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12 items-start">
        
        {/* === SIDEBAR / TOC === */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white rounded-2xl shadow-xl shadow-[#0C212D]/5 border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#EE7203] mb-6">
              {toc.title}
            </h2>
            <nav aria-label="Navegación de secciones">
              <ul className="space-y-1 relative border-l-2 border-gray-100 ml-2">
                {sectionsWithIds.map((section) => (
                  <li key={section.id} className="relative pl-6">
                    {/* Indicador visual en la linea de tiempo */}
                    <span className="absolute -left-[5px] top-3 h-2.5 w-2.5 rounded-full bg-white border-2 border-gray-300 group-hover:border-[#EE7203]" aria-hidden="true"></span>
                    
                    <a
                      href={`#${section.id}`}
                      className="block text-lg font-bold text-[#0C212D] hover:text-[#EE7203] transition-colors py-1 group"
                    >
                      {section.title}
                    </a>
                    
                    {/* Sub-items (preguntas) */}
                    <ul className="mt-2 space-y-2 mb-4">
                      {section.items.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className="block text-sm text-gray-500 hover:text-[#112C3E] hover:translate-x-1 transition-all duration-200 line-clamp-1"
                          >
                            {item.q}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* === LISTA DE FAQs === */}
        <div className="lg:col-span-8 space-y-12">
          {/* ✅ PARCHE DE COLOR: Lo sacamos del loop para que se renderice una sola vez */}
          {/* ✅ PARCHE DE COLOR mejorado */}
<style dangerouslySetInnerHTML={{__html: `
  .faq-override,
  .faq-override * {
    color: #1f2937 !important; /* gray-800 - más oscuro y legible */
  }
  
  .faq-override p, 
  .faq-override li, 
  .faq-override ul, 
  .faq-override ol,
  .faq-override span, 
  .faq-override div {
    color: #374151 !important; /* gray-700 */
    text-shadow: none !important;
  }
  
  .faq-override strong, 
  .faq-override b {
    color: #0C212D !important; /* Azul oscuro */
    font-weight: 700 !important;
  }
  
  .faq-override a {
    color: #EE7203 !important; /* Naranja */
    text-decoration: underline;
  }
  
  .faq-override a:hover {
    color: #FF5A2B !important;
  }

  /* Forzar que prose no interfiera */
  .faq-override.prose,
  .faq-override.prose p,
  .faq-override.prose li {
    color: #374151 !important;
  }
`}} />

          {sectionsWithIds.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-32"
              aria-labelledby={`section-${section.id}`}
            >
              <div className="flex items-center gap-4 mb-6 pb-2 border-b border-gray-200">
                <div className="h-8 w-1 bg-gradient-to-b from-[#EE7203] to-[#FF3816] rounded-full"></div>
                <h2
                  id={`section-${section.id}`}
                  className="text-2xl sm:text-3xl font-bold text-[#0C212D]"
                >
                  {section.title}
                </h2>
              </div>

              <div className="space-y-4">
                {section.items.map((item) => (
                  <FAQItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
    
    <div className="text-[#112C3E]">
        <WaveToDark />
    </div>
  </section>

  {/* === CTA SECTION === */}
  <section className="bg-[#112C3E] py-20 lg:py-28 relative overflow-hidden" aria-labelledby="faq-cta-title">
    {/* Elementos decorativos de fondo */}
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#EE7203] rounded-full blur-[150px] opacity-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
    
    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
      <div className="bg-[#0C212D] rounded-3xl p-8 md:p-12 lg:p-16 border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Glow interior */}
        <div className="absolute left-0 bottom-0 w-full h-2 bg-gradient-to-r from-[#EE7203] to-[#FF3816]" />

        <div className="relative z-10 max-w-3xl">
          <h2
            id="faq-cta-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
             <span className="bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent">
              {cta.title}
             </span>
          </h2>
          <p className="text-lg text-gray-400 mb-10 leading-relaxed">
            {cta.description}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#EE7203] to-[#FF3816] hover:brightness-110 transition-all shadow-lg shadow-orange-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE7203]"
            >
              {cta.contactButton}
            </Link>
            <Link
              href="/further-media#podcast"
              className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-bold text-white border border-white/20 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {cta.mediaButton}
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
    </>
  );
}

/* ===== i18n loader ===== */
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: await loadMessages(locale),
    },
  };
}