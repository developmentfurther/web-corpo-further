// /pages/faq.jsx
// FAQ — Multiidioma con i18n

import React, { useMemo } from "react";
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

      <main className={`${BG_DARK} min-h-screen`} id="top">
        {/* === HERO === */}
        <section className="relative z-10" aria-labelledby="faq-hero-title">
          <div className="pointer-events-none" aria-hidden>
            
          </div>

          <div className={`${SHELL} pt-28 pb-16 lg:pt-36 lg:pb-24`}>
            <div className={`${CARD_GLASS} p-6 lg:p-8`}>
              <nav aria-label="Breadcrumb" className="text-sm text-white/70">
                <ol className="flex items-center gap-2">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
                    >
                      {breadcrumb.home}
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-white">{breadcrumb.current}</li>
                </ol>
              </nav>

              <header className="mt-4">
                <h1
                  id="faq-hero-title"
                  className={`${TITLE_DARK} text-4xl sm:text-5xl lg:text-6xl leading-[1.08]`}
                >
                  <span className="block mb-2">{hero.title}</span>
                  <span className={`${GRAD_TEXT}`}>{hero.subtitle}</span>
                </h1>
                <p className="mt-4 text-white/80 max-w-2xl">
                  {hero.description}
                </p>
              </header>
            </div>
          </div>

          <WaveToLight />
        </section>

        {/* === CONTENIDO === */}
        <section
          id="faq-main"
          className="bg-white text-gray-900"
          aria-labelledby="faq-content-title"
        >
          <div className={`${SHELL} py-12 lg:py-16`}>
            <div className="grid gap-10 lg:grid-cols-12">
              {/* TOC - Índice de navegación */}
              <aside className="lg:col-span-4">
                <div className={`${CARD_LIGHT} p-6 sticky top-24`}>
                  <h2 className="text-base font-bold mb-4 text-gray-900">
                    {toc.title}
                  </h2>
                  <nav aria-label="Navegación de secciones">
                    <ul className="space-y-3">
                      {sectionsWithIds.map((section) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            className="block text-sm font-semibold text-gray-900 hover:text-[#EE7203] transition rounded-md px-3 py-2 hover:bg-gray-50 outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                          >
                            {section.title}
                          </a>
                          <ul className="mt-2 ml-3 space-y-1.5">
                            {section.items.map((item) => (
                              <li key={item.id}>
                                <a
                                  href={`#${item.id}`}
                                  className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 outline-none focus-visible:ring-2 focus-visible:ring-gray-300 transition"
                                >
                                  <span
                                    className={`h-1 w-1 rounded-full ${GRAD} shrink-0`}
                                    aria-hidden
                                  />
                                  <span className="line-clamp-2">{item.q}</span>
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

              {/* Contenido principal - Secciones de FAQ */}
              <div className="lg:col-span-8 space-y-8">
                {sectionsWithIds.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className={`${CARD_LIGHT} overflow-hidden scroll-mt-24`}
                    aria-labelledby={`section-${section.id}`}
                  >
                    <div className={`${GRAD} px-6 py-4`}>
                      <h2
                        id={`section-${section.id}`}
                        className="text-xl sm:text-2xl font-bold text-white"
                      >
                        {section.title}
                      </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {section.items.map((item) => (
                        <article
                          key={item.id}
                          id={item.id}
                          className="scroll-mt-24"
                        >
                          <details className="group">
                            <summary className="flex cursor-pointer items-center justify-between px-6 py-5 list-none hover:bg-gray-50 transition">
                              <h3 className="text-base sm:text-lg font-semibold pr-6 text-gray-900">
                                {item.q}
                              </h3>
                              <span
                                className={`shrink-0 h-9 w-9 grid place-items-center rounded-full text-white ${GRAD} transition-transform duration-300 group-open:rotate-45`}
                                aria-hidden="true"
                              >
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="12" y1="5" x2="12" y2="19" />
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                              </span>
                            </summary>
                            <div className="px-6 pb-6 pt-0 leading-relaxed">
                              <div
                                dangerouslySetInnerHTML={{ __html: item.a }}
                                className="prose prose-sm max-w-none prose-p:text-gray-900 prose-strong:text-gray-900 prose-a:text-[#EE7203]"
                                style={{ color: '#111827' }}
                              />
                            </div>
                          </details>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>

          <WaveToDark />
        </section>

        {/* === CTA final === */}
        <section className={`${BG_ALT}`} aria-labelledby="faq-cta-title">
          <div className={`${SHELL} py-16`}>
            <div className={`${CARD_DARK} p-8 md:p-10 relative overflow-hidden`}>
              <div
                aria-hidden
                className={`absolute -right-10 -top-10 h-60 w-60 rounded-full blur-3xl opacity-30 ${GRAD}`}
              />
              <div className="relative">
                <h2
                  id="faq-cta-title"
                  className={`${TITLE_DARK} text-3xl sm:text-4xl`}
                >
                  <span className={GRAD_TEXT}>{cta.title}</span>
                </h2>
                <p className="mt-2 text-white/80 max-w-2xl">
                  {cta.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/contacto"
                    className="inline-flex items-center rounded-xl px-5 py-3 font-semibold text-[#0C212D] bg-white hover:bg-white/90 transition outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    {cta.contactButton}
                  </Link>
                  <Link
                    href="/further-media#podcast"
                    className="inline-flex items-center rounded-xl px-5 py-3 font-semibold text-white border border-white/15 hover:bg-white/5 transition outline-none focus-visible:ring-2 focus-visible:ring-white/40"
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