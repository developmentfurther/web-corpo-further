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
  FaStar,
  FiMaximize2
} from "react-icons/fi";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import LocationsSection from "@/componentes/school/Location";

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
  const tRoot = messages ?? {};
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
          className={` ${TEXT_DARK} min-h-screen overflow-x-clip`}
        >
          {/* === HERO === */}
          <HeroSchool />
          

<LocationsSection
  t={t}
  SHELL={SHELL}
  GRAD_TEXT={GRAD_TEXT}
  BTN_PRIMARY={BTN_PRIMARY}
/>


{/* Separador hacia la sección “¿Por qué Further?” */}
<WaveDivider from="dark" height={80} flip />



{/* WHY FURTHER */}
<section id="why" className="bg-[#f8fafc] text-[#0C212D] overflow-hidden" aria-labelledby="why-title">
  <div className={`${SHELL} py-24`}>
    
    {/* ================= INTRO ================= */}
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={stagger}
      className="max-w-4xl mx-auto text-center mb-24"
    >
      {/* CAMBIO 1: El H2 completo ahora tiene el gradiente aplicado */}
      <motion.h2
        id="why-title"
        variants={fadeUp}
        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent pb-1"
      >
         {t?.why?.title || "¿Por qué Further?"}
      </motion.h2>
      <motion.p
        variants={fadeUp}
        className="text-lg sm:text-xl text-[#112C3E]/80 leading-relaxed max-w-3xl mx-auto font-medium"
      >
        {t?.why?.intro ||
          "Entendemos el idioma como un componente cultural. Por ello, promovemos un ambiente de constante habla inglesa para que la experiencia de aprendizaje sea completamente natural, enfocada en la comunicación real y la fluidez."}
      </motion.p>
    </motion.div>

    {/* ================= APRENDEMOS JUGANDO (Gamificado V2) ================= */}
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="relative bg-white rounded-[2.5rem] shadow-xl border border-[#0C212D]/5 p-10 sm:p-16 mb-24 overflow-hidden group"
    >
      {/* Fondo decorativo con gradiente muy sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EE7203]/[0.02] to-[#FF3816]/[0.02]" />
      
      {/* CAMBIO 2: Elementos flotantes de "Gaming" más reconocibles */}
      
      {/* Elemento 1: Gamepad Controller (Arriba Derecha) */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} 
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-12 -right-12 opacity-[0.08] text-[#EE7203]"
      >
        <svg width="220" height="220" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M6 12h4m-2-2v4" />
            <line x1="15" y1="11" x2="15.01" y2="11" />
            <line x1="17" y1="13" x2="17.01" y2="13" />
        </svg>
      </motion.div>

      {/* Elemento 2: Consola Portátil (Abajo Izquierda) */}
      <motion.div 
        animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }} 
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-16 -left-10 opacity-[0.08] text-[#FF3816]"
      >
         <svg width="240" height="240" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M6 12h4m-2-2v4" />
            <circle cx="16" cy="12" r="2" />
        </svg>
      </motion.div>

      {/* Contenido principal de la tarjeta */}
      <div className="relative z-10 text-center space-y-6">
        {/* Ícono central de Play */}
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-[#EE7203] to-[#FF3816] rounded-2xl shadow-lg shadow-[#EE7203]/20 text-white mb-2 transform group-hover:scale-110 transition-transform duration-300">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0C212D]">
          {t?.why?.funTitle || "Aprendemos jugando"}
        </h3>
        <p className="text-[#112C3E]/80 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto font-medium">
          {t?.why?.funBody ||
            "Nuestras clases son todo menos aburridas. Con juegos, actividades, eventos, y material multimedia propio, tu aprendizaje de inglés va a ser dinámico e interesante clase a clase."}
        </p>
      </div>
    </motion.div>

    {/* ================= NUESTROS VALORES ================= */}
    <section aria-labelledby="values-title">
      <div className={`${CARD_LIGHT} bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 sm:p-14`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Texto y Lista */}
          <div className="flex flex-col justify-center">
            {t?.why?.valuesKicker && (
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#EE7203] mb-4">
                {t?.why?.valuesKicker}
              </p>
            )}
            <h2
              id="values-title"
              className="text-3xl sm:text-4xl font-extrabold text-[#0C212D] mb-4"
            >
              {t?.why?.valuesTitle || "Principios que nos definen"}{" "}
              <span className={GRAD_TEXT || "bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent"}>
                {t?.why?.valuesHighlight}
              </span>
            </h2>
            <p className="text-lg text-[#112C3E]/70 mb-8 leading-relaxed">
              {t?.why?.valuesIntro ||
                "Creemos en una enseñanza de calidad, comunicativa y moderna, que inspire curiosidad y fomente la comunidad."}
            </p>

            {/* Lista con checkmarks estilizados */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              {(t?.why?.values || [
                "Proyecto 100% inmersivo",
                "Enfoque comunicacional",
                "Arista proyectual - lúdica",
                "Excelencia Académica",
                "Comunidad",
              ]).map((tx, i) => (
                <li key={i} className="flex items-start gap-3 group">
                  <div className="flex-shrink-0 mt-1 h-6 w-6 rounded-full bg-[#0C212D]/5 flex items-center justify-center group-hover:bg-[#EE7203]/10 transition-colors">
                    <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#EE7203] to-[#FF3816]" />
                  </div>
                  <span className="text-[1.05rem] font-semibold text-[#112C3E] group-hover:text-[#EE7203] transition-colors">{tx}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Carrusel (Mantenido intacto) */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#0C212D]/10 ring-1 ring-[#0C212D]/5">
            <CarouselSchool />
          </div>

        </div>
      </div>
    </section>

  </div>
</section>




<WaveDivider from="dark" height={66}  />


          

        
         {/* === EXÁMENES (dark) === */}
<section id="exams" aria-labelledby="exams-title">
  <div className={`${SHELL} py-16`}>
    <motion.div
      initial="hidden"
      animate="show"
      viewport={{ once: true, amount: 0.2 }}
      className="space-y-8"
    >
      <motion.h2
        variants={fadeUp}
        id="exams-title"
        className={`${TITLE_DARK} text-3xl flex justify-center`}
      >
        {exams.title}
      </motion.h2>

      <motion.p variants={fadeUp} className={`${SUB_DARK} flex justify-center`}>
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

        
          {/* === CTA BAR (School Contact - Particulares Only) === */}
<section
  id="contact"
  className="bg-[#112C3E] text-white relative overflow-hidden"
  aria-labelledby="cta-title"
>
  <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
    
    {/* Tarjeta con fondo sólido #0C212D (El más oscuro de tu marca) */}
    <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 border border-white/10 bg-[#0C212D]">

      {/* Decoración de fondo usando tus colores exactos (Naranja y Rojo) */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#EE7203]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#FF3816]/10 blur-3xl pointer-events-none" />

      <div className="grid lg:grid-cols-2 gap-10 items-start relative z-10">
        
        {/* Columna Izquierda: Texto */}
        <div className="space-y-6">
          <h2
            id="cta-title"
            className="text-3xl sm:text-4xl font-bold tracking-tight"
          >
            {messages?.home?.cta?.title ||
              "¿Listo para potenciar las habilidades lingüísticas?"}
          </h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-md">
            {messages?.home?.cta?.subtitle ||
              "Completa el formulario y nos pondremos en contacto contigo para ofrecerte la mejor propuesta académica."}
          </p>
          
          {/* Info extra con acento Naranja #EE7203 */}
          <div className="pt-6 border-t border-white/10 text-sm space-y-3">
             <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EE7203]/20 text-[#EE7203]">
                  📍
                </span>
                <span className="text-white/90">Parque Patricios & Saavedra</span>
             </div>
             <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EE7203]/20 text-[#EE7203]">
                  📧
                </span>
                <span className="text-white/90">info@furtherenglish.com</span>
             </div>
          </div>
        </div>

        {/* Columna Derecha: Formulario Completo */}
        <FormSchoolContact messages={messages} />
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


function FormSchoolContact({ messages }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState({ state: "idle", error: "" });

  const t = messages?.contact?.form || {};
  const tRoot = messages ?? {};

  const common = messages?.common?.forms || {};
  const tBtn = messages?.common?.cta || {};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
       return setStatus({ state: "error", error: "Por favor completa los campos requeridos." });
    }

    try {
      setStatus({ state: "sending", error: "" });
      
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          origin: "Further School Page",
        }),
      });

      if (!res.ok) throw new Error("Error");
      
      setStatus({ state: "success", error: "" });
      setForm({ name: "", email: "", phone: "", message: "" });
      
    } catch (err) {
      setStatus({ state: "error", error: common.error || "Hubo un error al enviar." });
    }
  };

  // ESTILOS DE TU MARCA: Fondo #0C212D, Borde tenue, Focus Naranja
  const inputClass = "w-full px-4 py-3 rounded-xl bg-[#0C212D] border border-white/10 text-white placeholder-white/30 outline-none focus:ring-1 focus:ring-[#EE7203] focus:border-[#EE7203] transition-all";

  if (status.state === "success") {
    return (
      <div className="bg-[#0C212D] border border-[#EE7203]/30 rounded-2xl p-8 text-center animate-in fade-in">
        <h3 className="text-xl font-bold text-white mb-2">¡Mensaje Enviado!</h3>
        <p className="text-white/70">{common.thanks || "Gracias, te contactaremos pronto."}</p>
        <button 
           onClick={() => setStatus({ state: "idle", error: "" })}
           className="mt-6 text-sm text-[#EE7203] hover:text-[#FF3816] font-semibold underline decoration-2 underline-offset-4"
        >
           Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* Nombre */}
      <div>
        <label htmlFor="school-name" className="sr-only">Nombre</label>
        <input
          id="school-name"
          name="name"
          type="text"
          placeholder={t?.fields?.name?.placeholder || "Nombre completo"}
          value={form.name}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <label htmlFor="school-email" className="sr-only">Email</label>
          <input
            id="school-email"
            name="email"
            type="email"
            placeholder={common.emailPlaceholder || "Email"}
            value={form.email}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="school-phone" className="sr-only">Teléfono</label>
          <input
            id="school-phone"
            name="phone"
            type="tel"
            placeholder={tRoot?.formPlaceholders?.phone || "Teléfono / WhatsApp"}

            value={form.phone}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="school-message" className="sr-only">Mensaje</label>
        <textarea
          id="school-message"
          name="message"
          rows={3}
          placeholder={tRoot?.formPlaceholders?.message || "¿En qué podemos ayudarte?"}

          value={form.message}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Mensaje de Error (Usando rojo de marca #FF3816) */}
      {status.state === "error" && (
         <div className="text-[#FF3816] text-sm bg-[#FF3816]/10 p-3 rounded-lg border border-[#FF3816]/20">
            {status.error}
         </div>
      )}

      {/* Botón Submit (Gradiente Naranja -> Rojo) */}
      <button
        type="submit"
        disabled={status.state === "sending"}
        className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-[#EE7203] to-[#FF3816] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#EE7203]/20"
      >
        {status.state === "sending" 
           ? (common.sending || "Enviando...") 
           : (t.cta || "Enviar Consulta")}
      </button>

      
    </form>
  );
}