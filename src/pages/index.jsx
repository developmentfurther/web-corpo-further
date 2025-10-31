// src/pages/index.jsx
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  animate,
  useInView,
  useMotionValue,
} from "framer-motion";
import {
  FiArrowRight,
  FiUsers,
  FiAward,
  FiBookOpen,
  FiZap,
  FiTarget,
  FiTrendingUp,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { useTranslations, useLocale } from "next-intl";

// Above-the-fold: import directo (no tocar diseño ni TTI del Hero)
import Hero from "../componentes/home/Hero";
import HomeContactForm from "@/componentes/home/HomeContactForm";


// Below-the-fold: code-splitting sin cambiar diseño, con SSR para SEO
const Services = dynamic(() => import("../componentes/home/Services"), {
  ssr: true,
});
const Testimonials = dynamic(() => import("../componentes/home/Testimonials"), {
  ssr: true,
});

/* ==============================
   Design Tokens
   ============================== */
const BG_PAGE = "relative min-h-screen bg-white text-gray-900 overflow-hidden";
const BG_NAVY = "bg-[#0A1628]";
const CARD_CORPORATE =
  "rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow";
const FOCUS =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EE7203] focus-visible:ring-offset-2";
const BTN_PRIMARY =
  "inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#EE7203] hover:bg-[#D66502] active:scale-[.98] transition shadow-sm " +
  FOCUS;
const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

/* ==============================
   WaveDivider (1 path, rendimiento)
   -- from: 'dark' rellena con #FFFFFF (para salir de sección dark)
   -- from: 'light' rellena con #0A1628 (para entrar a sección navy)
   -- flip: true → mira hacia abajo
   ============================== */
function WaveDivider({
  from = "dark",
  height = 76,
  flip = false,
  className = "",
}) {
  const fill = from === "dark" ? "#FFFFFF" : "#0A1628";
  return (
    <div
      aria-hidden
      className={className}
      style={{ transform: flip ? "scaleY(-1)" : "none" }}
    >
      <svg
        role="presentation"
        focusable="false"
        width="100%"
        height={height}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="block w-full"
      >
        <path
          d="M0 0v48c55 18 122 22 188 8 96-20 156-51 230-51 75 0 139 33 213 49 74 16 145 12 219-7 74-19 148-61 222-38 74 23 148 103 228 111V0H0Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

/* ==============================
   Counter (para Stats)
   ============================== */
function Counter({ value = 0, prefix = "", suffix = "+", duration = 1.2 }) {
  const locale = useLocale();
  const ref = useRef(null);
  const isIn = useInView(ref, { margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const [out, setOut] = useState("0");

  useEffect(() => {
    if (!isIn) return;
    const controls = animate(mv, value, {
      duration: reduce ? 0.4 : duration,
      ease: reduce ? "linear" : "easeOut",
      onUpdate: (latest) => {
        const num = Math.round(latest);
        setOut(
          `${prefix}${new Intl.NumberFormat(locale).format(num)}${suffix}`
        );
      },
    });
    return controls.stop;
  }, [isIn, value, prefix, suffix, duration, reduce, mv, locale]);

  return (
    <span
      ref={ref}
      className="tabular-nums font-bold"
      aria-live="polite"
      aria-atomic="true"
    >
      {out}
    </span>
  );
}

/* ==============================
   Stats (localizado)
   ============================== */
function Stats() {
  const t = useTranslations();
  const statsRaw = t.raw("home.stats");

  const stats = [
    { ...statsRaw.yearsInBusiness, icon: FiAward },
    { ...statsRaw.corporatePartners, icon: FiUsers },
    { ...statsRaw.corporateStudents, icon: FiTarget },
    { ...statsRaw.privateStudents, icon: FiBookOpen },
  ];

  return (
    <section className="py-16 lg:py-20 bg-white" aria-labelledby="stats-title">
      <div className={SHELL}>
        <h2 id="stats-title" className="sr-only">
          Key company metrics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-br from-[#EE7203] to-[#FF3816] flex items-center justify-center">
                <stat.icon className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                <Counter value={Number(stat.value)} suffix="+" />
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==============================
   Methodology (localizado)
   ============================== */
function Methodology() {
  const t = useTranslations();
  const bullets = t.raw("home.methodology.bullets");

  return (
    <section
  id="methodology"
  className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
  aria-labelledby="methodology-title"
>
  <div className={`${SHELL}`}>
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      {/* === Columna de texto === */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          id="methodology-title"
          className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-6"
        >
          {t("home.methodology.title")}
        </h2>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          {t("home.methodology.intro")}
        </p>

        <div className="space-y-6" role="list" aria-label="Methodology pillars">
          {bullets.map((b, i) => (
            <motion.div
              key={b.title}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="group relative flex gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition"
              role="listitem"
            >
              {/* Línea lateral animada */}
              <span className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gradient-to-b from-[#EE7203] to-[#FF3816] opacity-70 group-hover:opacity-100 transition" />
              <div className="w-12 h-12 rounded-lg bg-[#EE7203]/10 flex items-center justify-center flex-shrink-0">
                {i === 0 && (
                  <FiTarget className="w-6 h-6 text-[#EE7203]" aria-hidden="true" />
                )}
                {i === 1 && (
                  <FiTrendingUp className="w-6 h-6 text-[#EE7203]" aria-hidden="true" />
                )}
                {i === 2 && (
                  <FiZap className="w-6 h-6 text-[#EE7203]" aria-hidden="true" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{b.title}</h3>
                <p className="text-gray-600 text-sm">{b.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* === Columna con video YouTube === */}
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
  className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200"
>
  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
    <iframe
      className="absolute inset-0 w-full h-full"
      src="https://www.youtube.com/embed/NVZum4VeTw8?autoplay=1&mute=1&loop=1&controls=0&playlist=NVZum4VeTw8&rel=0"
      title="Further Methodology Video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
    ></iframe>
  </div>
</motion.div>


    </div>
  </div>
</section>

  );
}

/* ==============================
   CTA (localizado)
   ============================== */
function CTA() {
  const t = useTranslations();
  return (
    <section
      className={`${BG_NAVY} text-white py-20 lg:py-28`}
      aria-labelledby="cta-title"
    >
      <div className={SHELL}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 id="cta-title" className="text-3xl lg:text-4xl font-bold mb-6">
            {t("home.cta.title")}
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            {t("home.cta.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className={
                BTN_PRIMARY + " !bg-white !text-gray-900 hover:!bg-gray-100"
              }
              aria-label={t("common.buttons.requestProposal")}
            >
              <FiMail aria-hidden="true" />{" "}
              {t("common.buttons.requestProposal")}
            </button>
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition"
              aria-label={t("common.buttons.scheduleCall")}
            >
              <FiPhone aria-hidden="true" /> {t("common.buttons.scheduleCall")}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ==============================
   Main
   ============================== */
export default function CorporateWebsite() {
  const t = useTranslations();
  const router = useRouter();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const canonical = siteUrl ? `${siteUrl}${router.asPath || "/"}` : null;

  // JSON-LD (Organization + WebSite)
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t("meta.siteName"),
    url: siteUrl || undefined,
    logo: `${siteUrl || ""}/images/logo.png`,
    sameAs: [
      "https://www.linkedin.com/",
      "https://www.instagram.com/",
      "https://www.youtube.com/",
    ],
  };

  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: t("meta.siteName"),
    url: siteUrl || undefined,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl || ""}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Head>
        <title>{t("meta.home.title")}</title>
        <meta name="description" content={t("meta.home.description")} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        {canonical && <link rel="canonical" href={canonical} />}

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("meta.home.title")} />
        <meta property="og:description" content={t("meta.home.description")} />
        {siteUrl && <meta property="og:url" content={siteUrl} />}
        <meta
          property="og:image"
          content={`${siteUrl || ""}/images/logo.png`}
        />
        <meta property="og:image:alt" content={t("meta.siteName")} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("meta.home.title")} />
        <meta name="twitter:description" content={t("meta.home.description")} />
        <meta
          name="twitter:image"
          content={`${siteUrl || ""}/images/logo.png`}
        />

        {/* Perf hints */}
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin=""
        />
        <link rel="preload" as="image" href="/images/logo.png" />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </Head>

      {/* Skip link accesible */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-black focus:text-white focus:px-3 focus:py-2 focus:rounded-md"
      >
        Skip to content
      </a>

      <MotionConfig reducedMotion="user">
        <main id="main-content" role="main" className={BG_PAGE}>
          {/* Hero (no tocamos) */}
          <Hero />

          
          {/* 🔽 Onda desde hero (dark) hacia contenido blanco */}
          <WaveDivider from="dark" height={80} flip />

          {/* Stats */}
          <Stats />

          {/* Services (wrapper neutro; no cambiamos el componente) */}
          <section aria-label="Services">
            <Services />
          </section>

          {/* Methodology */}
          <Methodology />

          {/* Testimonials (wrapper neutro) */}
          <section aria-label="Testimonials">
            <Testimonials />
          </section>

          {/* 🔽 Onda desde secciones light hacia CTA navy */}
          <WaveDivider from="light" height={70} flip />


         {/* 🔽 Formulario de contacto embebido */}
        <HomeContactForm  />

          
        </main>
      </MotionConfig>
    </>
  );
}

// i18n (Pages Router)
import { loadMessages } from "@/lib/i18n";

export async function getStaticProps({ locale = "es" }) {
  return {
    props: {
      messages: await loadMessages(locale),
    },
  };
}
