// /pages/furthermore/index.jsx
// Furthermore — "Aprendé inglés jugando" | i18n es/en con fallbacks
// Diseño alineado (dark → light → dark) con ondas invertidas verticalmente.
// ✅ Removidas las "líneas naranjas horizontales" del HERO (arriba y abajo).

import React from "react";
import Head from "next/head";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { FiInstagram } from "react-icons/fi";
import { loadMessages } from "@/lib/i18n";

/* ===== Design tokens ===== */
/* Azul unificado con School:
   - Base:       #0A1628
   - Secundario: #0C212D */
const BG_DARK = "bg-[#0A1628] text-white";
const BG_ALT_DARK = "bg-[#0C212D]";

const ACCENT = "from-[#EE7203] via-[#FF5A2B] to-[#FF3816]";
const GRAD = `bg-gradient-to-tr ${ACCENT}`;
const GRAD_TEXT = `bg-gradient-to-tr ${ACCENT} bg-clip-text text-transparent`;

const CARD_DARK =
  "rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm shadow-lg shadow-black/20";
const SOFT_CARD_DARK =
  "rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition";

/* Light block tokens (para la sección blanca) */
const LIGHT_WRAP =
  "bg-gradient-to-br from-white via-gray-50 to-white text-gray-900";
const CARD_LIGHT = "rounded-2xl border border-gray-200 bg-white shadow-sm";
const SOFT_CARD_LIGHT =
  "rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition";

const LINK_DARK =
  "inline-flex items-center gap-2 px-4 py-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/40 hover:bg-white/5 transition";
const BTN_PRIMARY_DARK =
  "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-gray-900 bg-white hover:bg-gray-100 active:scale-[.99] transition shadow-sm";
const BTN_GHOST_DARK =
  "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white/90 border border-white/20 hover:bg-white/10 active:scale-[.99] transition";

const TITLE_DARK = "text-white font-extrabold tracking-tight";
const SUB_DARK = "text-white/80";

const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

/* ===== Ondas invertidas verticalmente ===== */
function WaveToLight({ className = "" }) {
  return (
    <div aria-hidden className={`relative ${className}`}>
      <svg
        className="block w-full h-20 -scale-y-100 translate-y-[1px]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
      >
        <path
          d="M0,0V46.29c47.79,22,103.59,29,158,17.39C256,41,312,2,376,1.5S512,39,576,55.5s128,17,192-5,128-71,192-44,128,101,240,114V0Z"
          fill="#FDFDFD"
        />
      </svg>
    </div>
  );
}

function WaveToDark({ className = "" }) {
  return (
    <div aria-hidden className={`relative ${className}`}>
      <svg
        className="block w-full h-16 -scale-y-100 translate-y-[1px]"  // 👈 se superpone 1px
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
      >
        <path
          d="M1200,0V16c-61,13-122,40-183,47S792,47,713,47,550,84,471,99,315,109,236,88,77,25,0,16V0Z"
          fill="#0A1628" // 👈 mismo color que el fondo dark siguiente
        />
      </svg>
    </div>
  );
}


/* ===== anim helpers ===== */
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

export default function FurthermorePage({ messages }) {
  const t = messages?.furthermore ?? {};
  const { fadeUp, fadeIn, leftIn, rightIn, stagger } = useAnims();

  /* ===== SEO ===== */
  const metaTitle =
    t?.meta?.title || "Furthermore — Learn English Through Play";
  const metaDesc =
    t?.meta?.description ||
    "Aprendizaje lúdico para todas las edades. Llevá el inglés a todos lados con nuestra serie de juegos FURTHERMORE.";

  /* ===== i18n fallbacks ===== */
  const hero = {
    title: t?.hero?.title || "Furthermore:",
    subtitle: t?.hero?.subtitle || "Aprendé inglés jugando",
  };

  const intro = {
    kicker: t?.intro?.kicker || "Aprendizaje lúdico",
    title: t?.intro?.title || "Aprendizaje lúdico para todas las edades",
    body:
      t?.intro?.body ||
      "Con nuestra serie de juegos FURTHERMORE, ¡llevá el inglés a todos lados! Jugá con tu familia, tus amigos, o usalo para un juego corporativo. Buscamos involucrar los contextos fuera del aula para aprender inglés jugando.",
    motto: t?.intro?.motto || "The more you play, the more you learn.",
  };

  const ig = {
    title: t?.instagram?.title || "Furthermore",
    handle: t?.instagram?.handle || "@furtherlanguages",
    href: t?.instagram?.href || "https://www.instagram.com/furtherlanguages/",
    cta: t?.instagram?.cta || "Visitanos en Instagram",
    followLabel: t?.instagram?.followLabel || "Seguir",
    loadMore: t?.instagram?.loadMore || "Cargar más",
    credit: t?.instagram?.widgetCredit || "Free Instagram Feed widget",
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
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
      </Head>

      <MotionConfig reducedMotion="user">
        <main className={`${BG_DARK} min-h-screen`}>
          {/* ===== HERO (oscuro, sin líneas naranjas) ===== */}
          <section className="relative overflow-hidden">
            {/* glows de fondo */}
            <div className="pointer-events-none" aria-hidden>
              <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-[#EE7203]/25 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#FF3816]/20 blur-3xl" />
            </div>

            {/* header content */}
            <div className={`${SHELL} pt-24 pb-12`}>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={stagger}
                className="grid lg:grid-cols-12 gap-10 items-center"
              >
                <motion.div variants={leftIn} className="lg:col-span-8">
                  <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/10 mb-4">
                    {intro.kicker}
                  </p>

                  <h1 className={`${TITLE_DARK} leading-[1.05] max-w-5xl`}>
                    <span className="block text-4xl sm:text-6xl lg:text-7xl">
                      {hero.title}
                    </span>
                    <span
                      className={`${GRAD_TEXT} block text-3xl sm:text-5xl lg:text-6xl`}
                      style={{ textShadow: "0 1px 0 rgba(0,0,0,.35)" }}
                    >
                      {hero.subtitle}
                    </span>
                  </h1>

                  <p className={`${SUB_DARK} mt-6 max-w-2xl`}>{intro.body}</p>

                  <p className="text-white/90 font-semibold text-lg mt-3">
                    “{intro.motto}”
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href="#gallery" className={BTN_PRIMARY_DARK}>
                      {t?.cta?.primary || "Ver juegos"}
                    </a>
                    <a href="#instagram" className={BTN_GHOST_DARK}>
                      {t?.cta?.secondary || "Seguir en Instagram"}
                    </a>
                  </div>
                </motion.div>

                <motion.div variants={rightIn} className="lg:col-span-4">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <img
                      src="https://images.unsplash.com/photo-1602080858428-57174f9431cf?q=80&w=1600&auto=format&fit=crop"
                      alt="People playing an English learning card game"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ---- Onda hacia bloque blanco (invertida) ---- */}
          <WaveToLight />

          {/* ===== BLOQUE CLARO ===== */}
          <section className={LIGHT_WRAP}>
            {/* FEATURE CARDS (mismo contenido, estilos light) */}
            <div className={`${SHELL} py-14`}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((f) => (
                  <motion.div
                    key={f.title}
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="show"
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
            </div>

            {/* GALERÍA */}
            <div id="gallery" className="border-y border-gray-200">
              <div className={`${SHELL} py-14`}>
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-900">
                  {t?.gallery?.title || "Nuestros juegos"}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl bg-gray-100 border border-gray-200"
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* INSTAGRAM */}
            <div id="instagram">
              <div className={`${SHELL} py-16`}>
                <div className={`${CARD_LIGHT} p-6`}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF,#515BD4)",
                        }}
                        aria-hidden
                      >
                        <FiInstagram className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {ig.title}
                        </div>
                        <div className="text-gray-500 text-sm">{ig.handle}</div>
                      </div>
                    </div>
                    <a
                      href={ig.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#FF3816]/40 hover:bg-gray-50 transition border border-gray-200 text-gray-700"
                    >
                      {ig.followLabel}
                    </a>
                  </div>

                  {/* placeholder del feed */}
                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-xl bg-gray-100 animate-pulse"
                        aria-hidden
                      />
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-center">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#FF3816]/40 hover:bg-gray-50 transition border border-gray-200 text-gray-700">
                      {ig.loadMore}
                    </button>
                  </div>

                  <p className="mt-6 text-center text-gray-500 text-sm">
                    {ig.credit}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ---- Onda de regreso al oscuro (invertida) ---- */}
          <WaveToDark />

          {/* ===== CTA BAR (oscuro, contenido intacto) ===== */}
          <section className={`${BG_ALT_DARK}`}>
            <div className={`${SHELL} py-14`}>
              <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 border border-white/10">
                <div className="absolute inset-0 -z-10 opacity-30">
                  <div className={`w-full h-full ${GRAD}`} />
                </div>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      {t?.ctaBar?.title || "¿Querés jugar y aprender?"}
                    </h2>
                    <p className="text-white/80 mt-2">
                      {t?.ctaBar?.subtitle ||
                        "Escribinos y te contamos cómo llevar FURTHERMORE a tu casa o a tu empresa."}
                    </p>
                  </div>
                  <form
                    className="grid gap-3"
                    onSubmit={async (e) => {
                    e.preventDefault();
                      const form = e.currentTarget; // 👈 más seguro
  const email = form.email.value.trim(); // ya funciona
                    if (!email) return alert("Por favor, ingresa un email válido.");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          origin: "Further More", // 👈 aquí definís de dónde vino
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
                    <label className="sr-only" htmlFor="email-furthermore">
                      {messages?.footer?.a11y?.emailLabel || "Email"}
                    </label>
                    <input
                      id="email-furthermore"
                      name="email"
                      type="email"
                      required
                      placeholder={
                        messages?.common?.forms?.emailPlaceholder ||
                        "tu@empresa.com"
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-white/50 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    />
                    <div className="flex gap-3">
                      <button type="submit" className={BTN_PRIMARY_DARK}>
                        {messages?.common?.cta?.send || "Enviar"}
                      </button>
                      <a href="/contacto" className={BTN_GHOST_DARK}>
                        {messages?.common?.buttons?.scheduleCall ||
                          "Programar llamada"}
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
