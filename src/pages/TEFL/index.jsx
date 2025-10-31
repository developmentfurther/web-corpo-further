

import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { FiCheck, FiBookOpen, FiGlobe, FiUsers, FiAward, FiChevronRight, FiPlay, FiHelpCircle } from "react-icons/fi";
import { loadMessages } from "@/lib/i18n";
import { WaveToDark, WaveToLight } from "@/componentes/ui/Waves";

/* ===== Design Tokens (coherentes con el resto del sitio) ===== */
const HEADER_BLUE = "#0A1628";
const BG_DARK = "bg-[#0A1628] text-white";
const BG_ALT_DARK = "bg-[#0A1628] text-white";
const LIGHT_WRAP = "bg-gradient-to-br from-white via-gray-50 to-white text-gray-900";

const ACCENT = "from-[#EE7203] via-[#FF5A2B] to-[#FF3816]";
const GRAD = `bg-gradient-to-tr ${ACCENT}`;
const GRAD_TEXT = `bg-gradient-to-tr ${ACCENT} bg-clip-text text-transparent`;

const TITLE_DARK = "text-white font-extrabold tracking-tight";
const SUB_DARK = "text-white/75";
const BODY_DARK = "text-white/90";
const TITLE_LIGHT = "text-gray-900 font-extrabold tracking-tight";
const SUB_LIGHT = "text-gray-600";
const BODY_LIGHT = "text-gray-800";

const CARD_GLASS =
  "rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.35)]";
const CARD_LIGHT = "rounded-[2rem] border border-gray-200 bg-white shadow-sm";
const CARD_DARK = "rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm shadow-lg shadow-black/20";

const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const LINK_BTN =
  "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#FF3816]/60 transition";

/* ===== Animaciones accesibles (livianas) ===== */
function useAnims() {
  const reduce = useReducedMotion();
  return {
    fadeUp: {
      hidden: { opacity: 0, y: reduce ? 0 : 22 },
      show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
    },
    fadeIn: {
      hidden: { opacity: 0, scale: reduce ? 1 : 0.98 },
      show: { opacity: 1, scale: 1, transition: { duration: 0.55 } },
    },
    leftIn: {
      hidden: { opacity: 0, x: reduce ? 0 : -20 },
      show: { opacity: 1, x: 0, transition: { duration: 0.55 } },
    },
    rightIn: {
      hidden: { opacity: 0, x: reduce ? 0 : 20 },
      show: { opacity: 1, x: 0, transition: { duration: 0.55 } },
    },
    stagger: { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } } },
  };
}

/* ===== Page ===== */
export default function TEFLIndex({ messages }) {
  const t = messages?.tefl ?? {};
  const meta = t.meta ?? {};
const hero = t.hero ?? {};
const blocks = t.blocks ?? {};
const workAbroad = blocks.workAbroad ?? {};
const cert = blocks.cert ?? {};
const cta = t.cta ?? {};
const tracks = t.tracks?.items ?? [];
const steps = t.steps?.items ?? [];
const faqs = t.faqs?.items ?? [];
const intro = t.intro ?? {};
const video = t.video ?? {};
  const { fadeUp, fadeIn, leftIn, rightIn, stagger } = useAnims();

  // Parallax del video en hero
  const { scrollYProgress } = useScroll();
  const vScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const vY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <MotionConfig reducedMotion="user">
      <>
        <Head>
          <title>{meta.title || "TEFL — Teaching English as a Foreign Language"}</title>
          <meta
            name="description"
            content={
              meta.description ||
              "Professional TEFL foundations: methodology, planning, and measurable impact."
            }
          />
          {meta.canonical && <link rel="canonical" href={meta.canonical} />}
          <meta property="og:type" content="website" />
          <meta property="og:title" content={meta.title || "TEFL — Teaching English as a Foreign Language"} />
          <meta
            property="og:description"
            content={
              meta.description ||
              "Professional TEFL foundations: methodology, planning, and measurable impact."
            }
          />
        </Head>

        {/* ===== MAIN ===== */}
        <main className={`${BG_DARK} min-h-screen overflow-x-clip`}>
          {/* ========== HERO (dark con video) ========== */}
<section
  className="relative z-10 overflow-hidden py-24 lg:py-28"
  aria-labelledby="tefl-hero-title"
>
  <div className="absolute inset-0 `${BG_DARK}" />

  <div
    className={`${SHELL} relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center`}
  >
    {/* Texto */}
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className="space-y-8"
    >
      <motion.span
        variants={fadeUp}
        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/85 backdrop-blur-sm"
      >
        <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#EE7203] to-[#FF3816]" />
        TEFL Program
      </motion.span>

      <motion.h1
        variants={fadeUp}
        id="tefl-hero-title"
        className={`${TITLE_DARK} text-4xl sm:text-5xl lg:text-6xl leading-[1.08]`}
      >
        <span className="block">{hero?.title || "TEFL:"}</span>
        <span className={`${GRAD_TEXT} block`}>
          {hero?.subtitle || "Teaching English as a Foreign Language"}
        </span>
      </motion.h1>

      {hero?.description && (
        <motion.p
          variants={fadeUp}
          className={`${SUB_DARK} text-lg max-w-xl`}
        >
          {hero.description}
        </motion.p>
      )}
    </motion.div>

    {/* Imagen */}
    <motion.div
  variants={fadeIn}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.2 }}
  className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10"
>
  <Image
    src={hero?.imageSrc?.trim() ? hero.imageSrc : "/images/bg-tefl.jpeg"}
    alt={hero?.imageAlt || "TEFL classroom"}
    fill
    sizes="(min-width:1024px) 40vw, 100vw"
    className="object-cover scale-105 hover:scale-110 transition-transform duration-700 ease-out"
    priority
  />
</motion.div>
  </div>

 
</section>

          <WaveToLight />



          {/* ========== TRACKS (Light) ========== */}
          <section id="tracks" className={LIGHT_WRAP} aria-labelledby="tracks-title">
            <div className={`${SHELL} py-14`}>
              <h2 id="tracks-title" className={`${TITLE_LIGHT} text-3xl sm:text-4xl mb-8`}>
                {t?.tracks?.title || "Program Tracks"}
              </h2>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tracks.map((trk, i) => {
  // Asignamos íconos manualmente según posición
  const icons = [FiGlobe, FiAward, FiUsers];
  const Icon = icons[i] || FiBookOpen;

  return (
    <motion.article
      key={trk.title + i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn}
      className={`${CARD_LIGHT} p-6`}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
          <Icon className="h-6 w-6 text-gray-700" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{trk.title}</h3>
            {trk.pill && (
              <span className="px-2 py-0.5 rounded-lg text-xs border border-gray-200 bg-gray-50 text-gray-600">
                {trk.pill}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 mt-1">{trk.body}</p>
        </div>
      </div>
    </motion.article>
  );
})}

              </div>
            </div>

            {/* Vuelve al dark */}
            <WaveToDark />
          </section>

         {/* --- BLOQUE CON VIDEO A LA DERECHA --- */}
<section className={`${BG_ALT_DARK} text-white`}>
  <div className={`${SHELL} py-20`}>
    <div
      className={`grid gap-10 lg:grid-cols-[1.1fr_1fr] items-center ${CARD_GLASS} p-8 lg:p-12`}
    >
      {/* Texto a la izquierda */}
      <div>
  <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
    {t?.video?.heading?.split(" ").slice(0, -3).join(" ") || "Convertite en"}{" "}
    <span className={GRAD_TEXT}>
      {t?.video?.heading?.split(" ").slice(-3).join(" ") || "profesor/a de inglés"}
    </span>
    <br />
    {t?.video?.subheading || "y abrí tus fronteras laborales"}
  </h2>

  <p className="text-white/80 text-lg mb-6">
    {t?.video?.lead || "¿Soñás con enseñar inglés y viajar por el mundo?"}
  </p>

  <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-[#EE7203] to-[#FF3816]" />

  <p className="text-white/70 mt-6 leading-relaxed max-w-xl">
    {t?.video?.description ||
      "Nuestro curso TEFL te brinda las herramientas necesarias para enseñar inglés a hablantes no nativos. Incluye prácticas docentes, metodología moderna y oportunidades laborales dentro de Further Corporate."}
  </p>
</div>


      {/* Video a la derecha */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 aspect-video">
        <iframe
          src="https://www.youtube.com/embed/lS8_TU-yAr4"
          title="TEFL video"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full object-cover"
        ></iframe>

        {/* Overlay decorativo sutil */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1628]/40 via-transparent to-[#EE7203]/20 pointer-events-none" />
      </div>
    </div>
  </div>
  <WaveToLight />
</section>


          {/* ========== CURRICULUM (Light) ========== */}
          <section id="curriculum" className={LIGHT_WRAP} aria-labelledby="curriculum-title">
            <div className={`${SHELL} py-16`}>
              <header className="text-center mb-10">
                <h3 id="curriculum-title" className={`${TITLE_LIGHT} text-3xl sm:text-4xl`}>
  {cert?.title || "Certification & Methodology"}
</h3>
                <p className={`${SUB_LIGHT} mt-2 max-w-2xl mx-auto`}>
                  {workAbroad?.lead || "A hands-on approach to planning, delivery, and evaluation."}
                </p>
              </header>

              <div className="grid gap-6 md:grid-cols-2">
  {(cert?.items ?? [
    {
      icon: FiBookOpen,
      title: "Communicative Approach",
      text:
        cert?.body1 ||
        "Learn frameworks like Communicative Approach, TBL, PPP, and solid assessment practices.",
    },
    {
      icon: FiUsers,
      title: "Lesson Planning",
      text:
        cert?.body2 ||
        "Plan effective lessons, manage classrooms, and measure real learning outcomes.",
    },
  ]).map((it, idx) => (
    <div key={idx} className={`${CARD_LIGHT} p-6`}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
          {it.icon ? (
            <it.icon className="h-6 w-6 text-gray-700" />
          ) : (
            <FiBookOpen className="h-6 w-6 text-gray-700" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900">{it.title}</h4>
          <p className="text-sm text-gray-700 mt-1">{it.text}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {[
          "Practical templates",
          "Real classroom scenarios",
          "CEFR alignment",
        ].map((k) => (
          <li
            key={k}
            className="flex items-center gap-2 text-sm text-gray-800"
          >
            <FiCheck className="text-[#FF3816]" /> <span>{k}</span>
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>

{/* Logos debajo de las cards */}
{cert?.logos?.length > 0 && (
  <div className="flex flex-wrap justify-center gap-8 mt-12 opacity-80">
    {cert.logos.map((src, i) => (
      <Image
        key={i}
        src={src}
        width={90}
        height={60}
        alt={`Certification logo ${i + 1}`}
        className="object-contain"
      />
    ))}
  </div>
)}

            </div>
            <WaveToDark />
          </section>

          {/* ========== HOW IT WORKS (Dark) ========== */}
          <section id="steps" className={`${BG_ALT_DARK} text-white`} aria-labelledby="steps-title">
            <div className={`${SHELL} py-16`}>
              <h3 id="steps-title" className={`${TITLE_DARK} text-3xl sm:text-4xl mb-8`}>
                {t?.steps?.title || "How it works"}
              </h3>

              <div className="grid gap-6 md:grid-cols-3">
                {steps.map((s, i) => (
                  <div key={s.title + i} className={`${CARD_GLASS} p-6`}>
                    <div className="text-5xl font-black text-white/20">{i + 1}</div>
                    <h4 className="text-xl font-semibold mt-2">{s.title}</h4>
                    <p className="text-white/80 mt-2">{s.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <WaveToLight />
          </section>

          {/* ========== FAQ (Light) ========== */}
          <section id="faqs" className={LIGHT_WRAP} aria-labelledby="faq-title">
            <div className={`${SHELL} py-16`}>
              <h3 id="faq-title" className={`${TITLE_LIGHT} text-3xl sm:text-4xl mb-6`}>
                {t?.faqs?.title || "Frequently asked questions"}
              </h3>
              <div className="grid gap-4">
                {faqs.map((f, i) => (
                  <details key={f.q + i} className={`${CARD_LIGHT} p-5 group`}>
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <div className="flex items-center gap-2">
                        <FiHelpCircle className="text-gray-500" />
                        <span className="font-semibold text-gray-900">{f.q}</span>
                      </div>
                      <span className="text-gray-500 group-open:rotate-90 transition">
                        <FiChevronRight />
                      </span>
                    </summary>
                    <p className="mt-3 text-gray-700">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
            <WaveToDark />
          </section>

          {/* ========== CTA FINAL (Dark) ========== */}
          <section className={`${BG_DARK} text-white`} aria-labelledby="cta-title">
            <div className={`${SHELL} py-20`}>
              <div className={`${CARD_GLASS} p-8 lg:p-12`}>
                <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center">
                  <div>
                    <h4 id="cta-title" className={`${TITLE_DARK} text-3xl sm:text-4xl`}>
                      {cta?.title}
                    </h4>
                    {cta?.subtitle && <p className={`${SUB_DARK} text-lg mt-2`}>{cta.subtitle}</p>}
                  </div>
                  <div className="flex lg:justify-end">
                    <Link href={cta?.href || "/contacto"} className={`${LINK_BTN} ${GRAD} text-white`}>
                      {cta?.button || "Request Consultation"} <FiChevronRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </>
    </MotionConfig>
  );
}

/* i18n */
export async function getStaticProps({ locale }) {
  return { props: { messages: await loadMessages(locale) } };
}
