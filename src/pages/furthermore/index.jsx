// /pages/furthermore/index.jsx
// Furthermore — "Aprendé inglés jugando" | i18n es/en con fallbacks

import React from "react";
import Head from "next/head";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { loadMessages } from "@/lib/i18n";
import GamesGallery from "@/componentes/ui/GameGallery"; // 👈 componente de juegos
import MoreCarousel from "@/componentes/ui/MoreCarousel";
import HeroMore from "@/componentes/hero/HeroMore";

/* ===== Design tokens ===== */
const BG_DARK = "bg-[#0A1628] text-white";
const BG_ALT_DARK = "bg-[#0C212D]";
const ACCENT = "from-[#EE7203] via-[#FF5A2B] to-[#FF3816]";
const GRAD = `bg-gradient-to-tr ${ACCENT}`;
const GRAD_TEXT = `bg-gradient-to-tr ${ACCENT} bg-clip-text text-transparent`;

const LIGHT_WRAP =
  "bg-gradient-to-br from-white via-gray-50 to-white text-gray-900";
const CARD_LIGHT = "rounded-2xl border border-gray-200 bg-white shadow-sm";
const SOFT_CARD_LIGHT =
  "rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition";

const BTN_PRIMARY_DARK =
  "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-gray-900 bg-white hover:bg-gray-100 active:scale-[.99] transition shadow-sm";
const BTN_GHOST_DARK =
  "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white/90 border border-white/20 hover:bg-white/10 active:scale-[.99] transition";

const TITLE_DARK = "text-white font-extrabold tracking-tight";
const SUB_DARK = "text-white/80";
const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

/* ===== Ondas ===== */
function WaveToLight() {
  return (
    <div aria-hidden className="relative">
      <svg
        className="block w-full h-20 -scale-y-100 translate-y-[1px]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0V46.29c47.79,22,103.59,29,158,17.39C256,41,312,2,376,1.5S512,39,576,55.5s128,17,192-5,128-71,192-44,128,101,240,114V0Z"
          fill="#FDFDFD"
        />
      </svg>
    </div>
  );
}

function WaveToDark() {
  return (
    <div aria-hidden className="relative">
      <svg
        className="block w-full h-16 -scale-y-100 translate-y-[1px]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M1200,0V16c-61,13-122,40-183,47S792,47,713,47,550,84,471,99,315,109,236,88,77,25,0,16V0Z"
          fill="#0A1628"
        />
      </svg>
    </div>
  );
}

/* ===== Animations ===== */
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

/* ===== PAGE ===== */
export default function FurthermorePage({ messages }) {
  const t = messages?.furthermore ?? {};
  const { fadeIn, leftIn, rightIn, stagger } = useAnims();

  /* i18n fallbacks */
  const hero = {
    title: t?.hero?.title || "Furthermore:",
    subtitle: t?.hero?.subtitle || "Aprendé inglés jugando",
  };

  const intro = {
    kicker: t?.intro?.kicker || "Aprendizaje lúdico",
    body:
      t?.intro?.body ||
      "Con nuestra serie de juegos FURTHERMORE, ¡llevá el inglés a todos lados! Jugá con tu familia, tus amigos, o usalo para un juego corporativo.",
    motto: t?.intro?.motto || "The more you play, the more you learn.",
  };

  // “etiquetas” de juego (contenido intacto)
  const features = [
    {
      emoji: "🎲",
      title: t?.features?.familyTitle || "Para familia y amigos",
      body:
        t?.features?.familyBody ||
        "Diversión en casa o de viaje. Actividades cortas, reglas simples y vocabulario útil.",
      pill: t?.features?.familyPill || "Casual",
    },
    {
      emoji: "🏢",
      title: t?.features?.corporateTitle || "Dinámicas corporativas",
      body:
        t?.features?.corporateBody ||
        "Icebreakers, team-building y práctica de inglés en contextos reales de trabajo.",
      pill: t?.features?.corporatePill || "B2B",
    },
    {
      emoji: "🌳",
      title: t?.features?.outdoorTitle || "Fuera del aula",
      body:
        t?.features?.outdoorBody ||
        "Llevá el aprendizaje a plazas, cafés o eventos. Inglés vivo y significativo.",
      pill: t?.features?.outdoorPill || "Contextos reales",
    },
  ];

  return (
    <>
      <Head>
        <title>
          {t?.meta?.title || "Furthermore — Learn English Through Play"}
        </title>
        <meta
          name="description"
          content={
            t?.meta?.description ||
            "Aprendizaje lúdico para todas las edades. Llevá el inglés a todos lados con nuestra serie de juegos FURTHERMORE."
          }
        />
      </Head>

      <MotionConfig reducedMotion="user">
        <main className={`min-h-screen`}>
          {/* ===== HERO ===== */}
          <HeroMore />

          <WaveToLight />

          {/* ===== BLOQUE CLARO ===== */}
          <section className={LIGHT_WRAP}>
            <div className={`${SHELL} py-14`}>
              {/* === FEATURE CARDS (tu bloque) === */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((f) => (
                  <motion.div
                    key={f.title}
                    variants={fadeIn}
                    initial="hidden"
                    animate="show"
                    viewport={{ once: true }}
                    className={`${SOFT_CARD_LIGHT} p-6`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl" aria-hidden>
                        {f.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {f.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded-lg text-xs border border-gray-200 bg-gray-50 text-gray-600">
                            {f.pill}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{f.body}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* === GAMES GALLERY (reemplaza Instagram) === */}
              <div id="gallery" className="mt-14">
               <GamesGallery messages={messages} />
              </div>

              <div id="more-gallery" className="mt-14">
                <MoreCarousel/>
              </div>

            </div>
          </section>
          
                {/* ===== CTA FINAL: Pedí tu juego ===== */}
<section className="relative bg-[#0A1628] text-white py-16 text-center">
  <div className="mx-auto max-w-3xl px-6">
    <h2 className="text-2xl sm:text-3xl font-bold mb-4">
      {t?.contact?.title || "Pedí tu juego de cartas Furthermore"}
    </h2>
    <p className="text-white/80 mb-10 text-lg">
      {t?.contact?.body ||
        "Contactanos por WhatsApp para conseguir tu set de juegos FURTHERMORE y comenzar a aprender inglés jugando."}
    </p>
    <a
      href="https://api.whatsapp.com/send/?phone=5491135821240&text=%C2%A1Hola%21+Me+interesa+conocer+m%C3%A1s+sobre+los+juegos+de+cartas+de+Furthermore+&type=phone_number&app_absent=0"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-semibold text-lg text-gray-900 bg-white hover:bg-gray-100 active:scale-[.98] transition-all shadow-md hover:shadow-lg"
    >
      {t?.contact?.button || "Escribinos por WhatsApp"}
    </a>
  </div>
</section>


          <WaveToDark />
        </main>
      </MotionConfig>
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
