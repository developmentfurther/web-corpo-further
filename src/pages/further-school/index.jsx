// /pages/further-school/index.jsx
// Further School of Languages (B2C) — i18n es/en con fallbacks.
// Estilo alineado a /pages/nosotros y /furthermore: hero dark (glass), ondas invertidas,
// sección central blanca, animaciones livianas, y navegación clara.

import React from "react";
import Head from "next/head";
import Image from "next/image";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useTransform,
  AnimatePresence 
} from "framer-motion";
import {
  FiSmile,
  FiMapPin,
  FiMusic,
  FiAward,
  FiGlobe,
  FiInstagram,
} from "react-icons/fi";
import { loadMessages } from "@/lib/i18n";
import TestimonialsCarousel from "@/componentes/ui/TestimonialsCarousel";
import { WaveToDark, WaveToLight } from "@/componentes/ui/Waves";
import InstagramWidget from "@/componentes/ui/InstagramWidget";
import CarouselSchool from "@/componentes/ui/CarouselSchool";
import HeroSchool from "@/componentes/hero/HeroSchool";



/* ===== Azul unificado (más oscuro) ===== */
const HEADER_BLUE_HEX = "#0A1628";
const BG_DARK = "bg-[#0A1628]"; // fondo dark principal
const BG_ALT = "bg-[#0A1628]"; // banda dark alternativa (mismo tono)
const TEXT_DARK = "text-white";
const TEXT_LIGHT = "text-gray-900";

/* Gradiente de acento (naranja→rojo) */
const ACCENT = "from-[#EE7203] via-[#FF5A2B] to-[#FF3816]";
const GRAD = `bg-gradient-to-tr ${ACCENT}`;
const GRAD_TEXT = `bg-gradient-to-tr ${ACCENT} bg-clip-text text-transparent`;

/* Cards */
const CARD_GLASS =
  "rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.35)]";
const CARD_DARK =
  "rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm shadow-lg shadow-black/20";
const CARD_LIGHT = "rounded-[2rem] border border-gray-200 bg-white shadow-sm";

/* Tipos de texto */
const TITLE_DARK = "text-white font-bold tracking-tight";
const SUB_DARK = "text-white/70";
const BODY_DARK = "text-white/90";
const TITLE_LIGHT = "text-gray-900 font-bold tracking-tight";
const SUB_LIGHT = "text-gray-600";
const BODY_LIGHT = "text-gray-800";

/* Contenedor */
const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

/* Botones */
const LINK_BASE =
  "inline-flex items-center gap-2 rounded-xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#FF3816]/60 transition-all duration-300";
const BTN_PRIMARY = `${LINK_BASE} px-6 py-3 text-gray-900 bg-white hover:bg-gray-100 active:scale-[.99] shadow-sm`;
const BTN_GHOST = `${LINK_BASE} px-6 py-3 text-white/90 border border-white/20 hover:bg-white/10 active:scale-[.99]`;

/* ===== Ondas (invertidas) ===== */
function WaveDivider({
  from = "dark", // "dark" | "light"
  flip = false, // true → mira hacia abajo
  height = 72,
  className = "",
}) {
  const fill = from === "dark" ? "#FFFFFF" : HEADER_BLUE_HEX;
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

/* ===== Animaciones accesibles (ligeras) ===== */
function useAnims() {
  const reduce = useReducedMotion();
  return {
    fadeUp: {
      hidden: { opacity: 0, y: reduce ? 0 : 22 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    },
    fadeIn: {
      hidden: { opacity: 0, scale: reduce ? 1 : 0.98 },
      show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    },
    leftIn: {
      hidden: { opacity: 0, x: reduce ? 0 : -18 },
      show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    },
    rightIn: {
      hidden: { opacity: 0, x: reduce ? 0 : 18 },
      show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    },
    stagger: { hidden: {}, show: { transition: { staggerChildren: 0.08 } } },
  };
}


/* ===== Mini-carousel para testimonios (auto + pausa on hover) ===== */


/* ===== Página ===== */
export default function FurtherSchoolPage({ messages }) {
  const t = messages?.school ?? {};
  const common = messages?.common ?? {};
  const { fadeUp, fadeIn, leftIn, rightIn, stagger } = useAnims();

  // Parallax hero
  const { scrollYProgress } = useScroll();
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  /* SEO */
  const metaTitle =
    t?.meta?.title ||
    "Further School of Languages — Aprendiendo inglés desde 1997";
  const metaDesc =
    t?.meta?.description ||
    "Clases presenciales y online para todas las edades. Preparación para exámenes Cambridge y TOEFL.";

  /* i18n fallbacks (sin romper keys actuales) */
  const hero = {
    title: t?.hero?.title || "Further School of Languages:",
    subtitle: t?.hero?.subtitle || "Aprendiendo inglés desde 1997",
    badge:
      t?.hero?.badge ||
      t?.meta?.title?.split(" — ")[1] ||
      "Learning English Since 1997",
    imageSrc:
      t?.hero?.imageSrc ||
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=1480&auto=format&fit=crop",
    imageAlt: t?.hero?.imageAlt || "English class with motivated students",
  };

  const sec = {
    funTitle: t?.sections?.fun?.title || "Aprender inglés de manera divertida",
    funBody:
      t?.sections?.fun?.body || "Nuestras clases son todo menos aburridas...",
    parkTitle:
      t?.sections?.park?.title || "Escuela de inglés en Parque Patricios",
    parkBody:
      t?.sections?.park?.body ||
      "Further School of Languages brinda clases de inglés presenciales y online...",
    cultureBody:
      t?.sections?.culture?.body ||
      "Entendemos el idioma como un componente dentro de la cultura. Promovemos música, cine y conversación real.",
  };

  const exams = {
    title: t?.exams?.title || "Preparación para exámenes internacionales",
    expertIntro:
      t?.exams?.expertIntro || "Somos expertos en preparación para",
    cambridgeTitle:
      t?.exams?.cambridgeTitle || "Exámenes de inglés de Cambridge",
    cambridge: t?.exams?.cambridge || ["FCE", "CAE", "CPE", "IELTS", "BEC"],
    usTitle: t?.exams?.usTitle || "Exámenes de inglés Estadounidense",
    toefl: t?.exams?.toefl || "TOEFL: Test of English as a Foreign Language",
  };

  const ig = {
    handle: t?.instagram?.handle || "@furtherlanguages",
    title: t?.instagram?.title || "Further School",
    followLabel: t?.instagram?.followLabel || "Seguir",
    loadMore: t?.instagram?.loadMore || "Cargar más",
    credit: t?.instagram?.widgetCredit || "Free Instagram Feed widget",
    body:
      t?.instagram?.ctaBody ||
      "Enfocamos la frescura en nuestras clases, incorporando el juego, la espontaneidad, y la naturalidad como herramientas fundamentales.",
    cta: t?.instagram?.cta || "Visitanos en Instagram",
    href: t?.instagram?.href || "https://www.instagram.com/furtherlanguages/",
  };

  // Testimonios (usa home o school si existen; si no, fallback breve)
  const testimonials =
    t?.testimonials?.items ??
    messages?.home?.testimonials?.items ??
    [];

    

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
      </Head>

      <MotionConfig reducedMotion="user">
        {/* ===== MAIN ===== */}
        <main
          className={`${BG_DARK} ${TEXT_DARK} min-h-screen overflow-x-clip`}
        >
          {/* === HERO === */}
          <HeroSchool />
          <WaveDivider from="dark" height={66} flip />


              {/* WHY FURTHER */}
<section id="why" className="bg-gradient-to-br from-white via-gray-50 to-white text-gray-900" aria-labelledby="why-title">
  <div className={`${SHELL} py-20`}>
    {/* ================= INTRO ================= */}
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="max-w-4xl mx-auto text-center mb-20"
    >
      <motion.h2
        id="why-title"
        variants={fadeUp}
        className="text-4xl sm:text-5xl font-extrabold mb-5"
      >
        <span className="bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent">
          {t?.why?.title || "¿Por qué Further?"}
        </span>
      </motion.h2>
      <motion.p
        variants={fadeUp}
        className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto"
      >
        {t?.why?.intro ||
          "Entendemos el idioma como un componente cultural. Por ello, promovemos un ambiente de constante habla inglesa para que la experiencia de aprendizaje sea completamente natural, enfocada en la comunicación real y la fluidez."}
      </motion.p>
    </motion.div>

    {/* ================= APRENDEMOS JUGANDO ================= */}
    <motion.div
      variants={fadeUp}
      className={`${CARD_LIGHT} p-10 sm:p-14 mb-20 relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#EE7203]/[0.04] to-[#FF3816]/[0.04]" />
      <div className="relative z-10 text-center space-y-5">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t?.why?.funTitle || "Aprendemos jugando"}
        </h3>
        <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
          {t?.why?.funBody ||
            "Nuestras clases son todo menos aburridas. Con juegos, actividades, eventos, y material multimedia propio, tu aprendizaje de inglés va a ser dinámico e interesante clase a clase."}
        </p>
      </div>
    </motion.div>

    {/* ================= NUESTROS VALORES (con layout de metodología) ================= */}
    <section className="bg-white text-gray-900" aria-labelledby="values-title">
      <div className={`${CARD_LIGHT} p-8 sm:p-12`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Texto */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              {t?.why?.valuesKicker || "Nuestros valores"}
            </p>
            <h2
              id="values-title"
              className="text-2xl sm:text-3xl font-extrabold text-gray-900"
            >
              {t?.why?.valuesTitle || "Principios que nos definen"}{" "}
              <span className={GRAD_TEXT}>
                {t?.why?.valuesHighlight || "Nuestra esencia"}
              </span>
            </h2>
            <p className="mt-3 text-gray-700">
              {t?.why?.valuesIntro ||
                "Creemos en una enseñanza de calidad, comunicativa y moderna, que inspire curiosidad y fomente la comunidad."}
            </p>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(t?.why?.values || [
                "Proyecto 100% inmersivo",
                "Enfoque comunicacional",
                "Arista proyectual - lúdica",
                "Excelencia Académica",
                "Comunidad",
              ]).map((tx, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-900">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF3816]" />
                  <span>{tx}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Imagen o carrusel */}
          <div className="relative">
            <CarouselSchool />
          </div>
        </div>
      </div>
    </section>

    {/* ================= SEDES ================= */}
    <motion.div
      variants={fadeUp}
      className="mt-24 text-center"
    >
      <h3 className="text-3xl font-extrabold text-gray-900 mb-14">
        {t?.why?.locationsTitle || "Conocé nuestras sedes"}
      </h3>

      <div className="grid gap-14 lg:grid-cols-2 max-w-6xl mx-auto">
        {/* Parque Patricios */}
        <div className={`${CARD_LIGHT} p-6 sm:p-8`}>
          <h4 className="text-xl font-bold mb-2 text-gray-900">
            {t?.why?.locations?.patricios?.title || "Parque Patricios"}
          </h4>
          <p className="text-gray-700 mb-4">
            {t?.why?.locations?.patricios?.body ||
              "Desde 1997, nuestro instituto te espera en el corazón de Parque Patricios."}
          </p>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-gray-200">
            <video
              src={t?.why?.locations?.patricios?.videoSrc || "/videos/school-patricios.mp4"}
              poster={t?.why?.locations?.patricios?.poster || "/images/school-patricios.webp"}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>

        {/* Saavedra */}
        <div className={`${CARD_LIGHT} p-6 sm:p-8`}>
          <h4 className="text-xl font-bold mb-2 text-gray-900">
            {t?.why?.locations?.saavedra?.title || "Saavedra"}
          </h4>
          <p className="text-gray-700 mb-4">
            {t?.why?.locations?.saavedra?.body ||
              "Ahora encontrá también la #ExperienciaFurther en el norte de Buenos Aires."}
          </p>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-gray-200">
            <video
              src={t?.why?.locations?.saavedra?.videoSrc || "/videos/school-saavedra.mp4"}
              poster={t?.why?.locations?.saavedra?.poster || "/images/school-saavedra.webp"}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</section>




<WaveDivider from="dark" height={66}  />


          

        
         {/* === EXÁMENES (dark) === */}
<section id="exams" aria-labelledby="exams-title">
  <div className={`${SHELL} py-16`}>
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="space-y-8"
    >
      <motion.h2
        variants={fadeUp}
        id="exams-title"
        className={`${TITLE_DARK} text-3xl`}
      >
        {exams.title}
      </motion.h2>

      <motion.p variants={fadeUp} className={`${SUB_DARK}`}>
        {exams.expertIntro}
      </motion.p>

      {/* Contenedor de tarjetas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* === Exámenes Cambridge === */}
        <motion.div variants={fadeIn} className={`${CARD_DARK} p-6`}>
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FiAward aria-hidden="true" />
            {exams.cambridgeTitle}
          </h3>

          <div className="flex flex-wrap gap-2">
            {["FCE", "CAE", "CPE", "IELTS", "BEC", "BULATS"].map((x) => (
              <span
                key={x}
                className="px-4 py-1.5 rounded-xl border border-white/10 bg-white/5 text-white/90 text-sm font-medium hover:bg-white/10 transition"
              >
                {x}
              </span>
            ))}
          </div>
        </motion.div>

        {/* === Examen TOEFL === */}
        <motion.div variants={fadeIn} className={`${CARD_DARK} p-6`}>
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FiGlobe aria-hidden="true" />
            {exams.usTitle}
          </h3>

          <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/90 text-sm sm:text-base font-medium inline-block hover:bg-white/10 transition">
            TOEFL: Test of English as a Foreign Language
          </div>
        </motion.div>
      </div>
    </motion.div>
  </div>
</section>


          {/* === TESTIMONIOS (dark) === */}
   <section className={`${BG_ALT}`} aria-labelledby="testi-title">
  <div className={`${SHELL} py-16`}>
    <header className="mb-10 text-center">
      <h2 id="testi-title" className={`${TITLE_DARK} text-3xl mb-2`}>
        {t?.testimonials?.title ||
          messages?.home?.testimonials?.title ||
          "Lo que dicen nuestros alumnos"}
      </h2>
      <p className={`${SUB_DARK}`}>
        {t?.testimonials?.subtitle ||
          messages?.home?.testimonials?.subtitle ||
          "Resultados reales, progreso medible."}
      </p>
    </header>

    {Array.isArray(testimonials) && testimonials.length > 0 ? (
      <TestimonialsCarousel items={testimonials} />
    ) : (
      <div className={`${CARD_DARK} p-8 text-center`}>
        <blockquote className="text-xl text-white/90 leading-relaxed">
          “El programa transformó la confianza de nuestros alumnos para
          comunicar en inglés en tiempo récord.”
        </blockquote>
        <div className="mt-4 text-white/70 text-sm">María · Directora de RR. HH.</div>
      </div>
    )}
  </div>
  
</section>

{/* 👇 NUEVO separador para pasar al Instagram light */}
<WaveDivider from="dark" height={90} flip={true} />

          {/* === INSTAGRAM (blanco + CTA) === */}
            
        <InstagramWidget
  ig={{
    title: "Further School",
    handle: "@furtherlanguages",
    href: "https://www.instagram.com/furtherlanguages/",
    followLabel: "Ver en Instagram",
    credit: "Fotos desde Instagram público",
  }}
/>

        
          {/* === CTA BAR (dark) === */}
          <section
            id="contact"
            className={`${BG_ALT} ${TEXT_DARK}`}
            aria-labelledby="cta-title"
          >
            <div className={`${SHELL} py-14`}>
              <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 border border-white/10">
                <div className="absolute inset-0 -z-10 opacity-30">
                  <div className={`w-full h-full ${GRAD}`} />
                </div>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2
                      id="cta-title"
                      className="text-2xl sm:text-3xl font-bold"
                    >
                      {messages?.home?.cta?.title ||
                        "¿Listo para potenciar las habilidades lingüísticas?"}
                    </h2>
                    <p className="text-white/80 mt-2">
                      {messages?.home?.cta?.subtitle ||
                        "Contactanos para diseñar un plan a medida."}
                    </p>
                  </div>
                  <form
  className="grid gap-3"
  onSubmit={async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    if (!email) return alert("Por favor, ingresa un email válido.");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          origin: "Further School", // 👈 aquí definís de dónde vino
        }),
      });

      if (res.ok) {
        alert("Gracias por suscribirte. Te contactaremos pronto.");
        e.target.reset();
      } else {
        const data = await res.json();
        alert(data.error || "Ocurrió un error al enviar el mail.");
      }
    } catch (error) {
      console.error(error);
      alert("Error enviando el formulario.");
    }
  }}
  aria-label="Quick contact form"
>
  <label className="sr-only" htmlFor="email-school">
    {messages?.footer?.a11y?.emailLabel || "Email"}
  </label>
  <input
    id="email-school"
    name="email"
    type="email"
    required
    placeholder={
      messages?.common?.forms?.emailPlaceholder || "tu@empresa.com"
    }
    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-white/50 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/40"
  />
  <div className="flex gap-3">
    <button type="submit" className={BTN_PRIMARY}>
      {messages?.common?.cta?.send || "Enviar"}
    </button>
    <a href="/contacto" className={BTN_GHOST}>
      {messages?.common?.buttons?.scheduleCall || "Programar llamada"}
    </a>
  </div>
  <p className="text-white/60 text-xs">
    {messages?.footer?.a11y?.newsletterDesc ||
      "Ingresa tu correo para que te contactemos."}
  </p>
</form>

                </div>
              </div>
            </div>
          </section>
        </main>
      </MotionConfig>
    </>
  );
}

/* ===== i18n loader (Pages Router) ===== */
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: await loadMessages(locale),
    },
  };
}
