// pages/nosotros/index.jsx
// Página "Nosotros" (Further Corporate)
// - Hero con video y headline "+25 años..."
// - Sección blanca "¿Por qué elegir Further? / Nuestro compromiso es con la excelencia"
// - Bloque Misión / Visión / Staff docente
// - Sección Further Media con video incrustado
// - Testimonios (carrusel en grid)
// - CTA final "Sumate a la #ExperienciaFurther"

import React from "react";
import Head from "next/head";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { loadMessages } from "@/lib/i18n";
import HeroAbout from "@/componentes/hero/HeroAbout";
import {
  Target,
  Globe,
  Users,
  Headphones,
  PlayCircle,
  Clapperboard,
  ArrowUpRight,
} from "lucide-react";
import { WaveToDark, WaveToLight } from "@/componentes/ui/Waves";
import Link from "next/link";
import FurtherMediaSection from "@/componentes/about/FurtherMediaSection";

/* ====== Tokens ====== */
const BG_DARK = "bg-[#0A1628]";
const CARD_GLASS =
  "rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.35)]";
const GRAD = "bg-gradient-to-tr from-[#EE7203] via-[#FF4D1F] to-[#FF3816]";
const GRAD_TEXT =
  "bg-gradient-to-r from-[#EE7203] via-[#FF4D1F] to-[#FF3816] bg-clip-text text-transparent";
const TITLE_DARK = "text-white font-bold tracking-tight";
const SUB_DARK = "text-white/70";
const BODY_DARK = "text-white/90";
const TITLE_LIGHT = "text-gray-900 font-bold tracking-tight";
const SUB_LIGHT = "text-gray-600";
const BODY_LIGHT = "text-gray-800";
const LINK =
  "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#FF3816]/60 transition-all duration-300";

/* ====== Animations ====== */
function useVariants() {
  const reduce = useReducedMotion();
  return {
    fadeUp: {
      hidden: { opacity: 0, y: reduce ? 0 : 24 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      },
    },
    fadeIn: {
      hidden: { opacity: 0, scale: reduce ? 1 : 0.98 },
      show: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
      },
    },
    stagger: {
      hidden: {},
      show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
    },
  };
}

/* ====== Page ====== */
export default function AboutIndex({ messages }) {
  const t = messages?.about ?? {};
  const meta = t?.meta ?? {};
  const hero = t?.hero ?? {};
  const intro = t?.intro ?? {};
  const missionVision = t?.missionVision ?? {}; // 🔴 nuevo bloque en i18n
  const media = t?.media ?? {};
  const testimonials = t?.testimonials ?? {};
  const cta = t?.cta ?? {};

  const { fadeUp, fadeIn, stagger } = useVariants();
  const { scrollYProgress } = useScroll();
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <>
      <Head>
        <title>
          {meta.title || "Further Corporate: Consultora de idiomas líder"}
        </title>
        <meta
          name="description"
          content={
            meta.description ||
            "Somos Further Corporate: más de 25 años y 50.000 alumnos formados avalan nuestra trayectoria. Conocé nuestra misión, visión y propuesta única."
          }
        />
      </Head>

      <main
        className={`${BG_DARK} min-h-screen relative overflow-hidden text-white`}
      >
        {/* SECCIÓN HERO */}
          <HeroAbout />
          <WaveToLight />
  
      

      {/* ====================================================== */}
{/* SECCIÓN BLANCA: ¿Por qué elegir Further? / Excelencia */}
{/* ====================================================== */}
{(intro?.heading ||
  intro?.subheading ||
  (intro?.paragraphs ?? []).length > 0) && (
  <section
    className="relative bg-white text-gray-900 overflow-hidden"
    aria-labelledby="intro-title"
  >
    {/* Fondo parallax sutil */}
    <motion.div
      className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(238,114,3,0.07),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(255,56,22,0.06),transparent_60%)]"
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%"],
      }}
     
    />

    <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24 relative z-10">
      <motion.div
        initial="hidden"
        animate="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="rounded-[2rem] border border-gray-200 bg-white/80 backdrop-blur-xl shadow-lg p-8 lg:p-12 transition-all duration-500"
      >
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-center">
          {/* Columna izquierda */}
          <motion.div
            variants={fadeUp}
            className="relative z-10 group"
            whileHover={{ scale: 1.02 }}
          >
            <h2
              id="intro-title"
              className={`${TITLE_LIGHT} text-3xl sm:text-4xl mb-3`}
            >
              {intro?.heading}
            </h2>

            {intro?.subheading && (
              <p className={`${SUB_LIGHT} text-lg`}>
                {intro.subheading}
              </p>
            )}

            <div className="mt-5 w-16 h-1.5 rounded-full bg-gradient-to-r from-[#EE7203] to-[#FF3816] group-hover:w-28 transition-all duration-500" />
          </motion.div>

          {/* Columna derecha */}
          <motion.div
            variants={fadeUp}
            className="space-y-6 relative z-10"
          >
            {(intro?.paragraphs ?? []).map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className={`${BODY_LIGHT} leading-relaxed text-base`}
              >
                {p}
              </motion.p>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
)}

{/* ====================================== */}
{/* MISIÓN / VISIÓN / STAFF DOCENTE (light interactivo) */}
{/* ====================================== */}
{(missionVision?.mission ||
  missionVision?.vision ||
  missionVision?.staff) && (
  <section className="relative bg-white text-gray-900" aria-labelledby="mv-title">
    <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
      <motion.div
  initial="hidden"
  animate="show"
  viewport={{ once: true, amount: 0.25 }}
  variants={stagger}
  className="grid gap-10 lg:grid-cols-3"
>
  {[
  { data: missionVision?.mission, icon: <Target className="w-8 h-8 text-[#EE7203]" /> },
  { data: missionVision?.vision, icon: <Globe className="w-8 h-8 text-[#FF3816]" /> },
  { data: missionVision?.staff, icon: <Users className="w-8 h-8 text-[#EE7203]" /> },
].map(
    (item, i) =>
      item.data && (
        <motion.div
          key={i}
          variants={fadeUp}
          whileHover={{
            y: -8,
            rotateX: 3,
            rotateY: -2,
          }}
         
          className="relative group rounded-3xl border border-gray-200 bg-white shadow-lg p-8 overflow-hidden"
        >
          {/* Glow dinámico */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#EE7203]/10 via-[#FF4D1F]/10 to-[#FF3816]/10 blur-2xl transition-all duration-500" />

          {/* Icono flotante con animación sutil */}
          <motion.div
            className="absolute top-6 right-6 text-3xl"
            animate={{ y: [0, -6, 0] }}
            
          >
            {item.icon}
          </motion.div>

          {/* Título (desde i18n) */}
          <h3
            className={`${TITLE_LIGHT} text-xl font-bold mb-3 relative z-10`}
          >
            {item.data?.title}
          </h3>

          {/* Texto (desde i18n) */}
          <p
            className={`${BODY_LIGHT} text-base leading-relaxed relative z-10`}
          >
            {item.data?.text}
          </p>
        </motion.div>
      )
  )}
</motion.div>

    </div>

    {/* 🌊 Onda hacia dark para entrar a Further Media */}
   
  </section>
)}



  {/* ================================== */}
{/* FURTHER MEDIA (nueva versión estilo Service360) */}
{/* ================================== */}
<FurtherMediaSection />


        {/* ====================== */}
        {/* TESTIMONIOS (en blanco) */}
        {/* ====================== */}
        {Array.isArray(testimonials?.items) &&
          testimonials.items.length > 0 && (
            <section
              aria-labelledby="testimonials-title"
              className="relative z-10 bg-white text-gray-900"
            >
              <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
                <motion.div
                  initial="hidden"
                  animate="show"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={stagger}
                >
                  {/* Título / subtítulo */}
                  <motion.div
                    variants={fadeUp}
                    className="text-center mb-12"
                  >
                    <h3
                      id="testimonials-title"
                      className={`${TITLE_LIGHT} text-3xl sm:text-4xl`}
                    >
                      {testimonials?.title ||
                        "Testimonios de clientes"}
                    </h3>
                    {testimonials?.subtitle && (
                      <p
                        className={`${SUB_LIGHT} text-lg max-w-2xl mx-auto mt-3`}
                      >
                        {testimonials.subtitle ||
                          "Conocé la experiencia de empresas y profesionales que confían en nosotros"}
                      </p>
                    )}
                    <div className="mt-5 w-16 h-1.5 mx-auto rounded-full bg-gradient-to-r from-[#EE7203] to-[#FF3816]" />
                  </motion.div>

                  {/* Grid de testimonios */}
                  <div className="grid gap-8 md:grid-cols-2">
                    {testimonials.items.map((it, idx) => (
                      <motion.blockquote
                        key={idx}
                        variants={fadeUp}
                       className="relative bg-white border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-transform duration-300 ease-out"
                      >
                        {/* Comillas decorativas */}
                        <div className="absolute top-6 left-6 text-6xl font-serif text-[#EE7203]/25 leading-none select-none">
                          "
                        </div>

                        {/* Quote */}
                        {it?.quote && (
                          <p className="text-gray-700 leading-relaxed text-base relative z-10 pt-8">
                            {it.quote}
                          </p>
                        )}

                        {/* Footer */}
                        <footer className="mt-6 pt-6 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#EE7203] to-[#FF3816] flex items-center justify-center text-white font-bold">
                              {(it?.name || "?").charAt(0)}
                            </div>
                            <div>
                              {it?.name && (
                                <div className="font-semibold text-gray-900">
                                  {it.name}
                                </div>
                              )}
                              {it?.role && (
                                <div className="text-sm text-gray-600">
                                  {it.role}
                                </div>
                              )}
                              {it?.company && (
                                <div className="text-sm text-gray-500">
                                  {it.company}
                                </div>
                              )}
                            </div>
                          </div>
                        </footer>
                      </motion.blockquote>
                    ))}
                  </div>
                </motion.div>
              </div>
            
            </section>
          )}

        {/* ====================== */}
        {/* CTA FINAL (#ExperienciaFurther) */}
        {/* ====================== */}
        {cta?.button && (
          <section className="relative z-10">
            <div className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
              <motion.div
                initial="hidden"
                animate="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeIn}
                className={`${CARD_GLASS} p-10 lg:p-14`}
              >
                <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                  <div>
                    <h4 className={`${TITLE_DARK} text-3xl sm:text-4xl mb-4`}>
                      {cta?.title ||
                        "Sumate a la #ExperienciaFurther"}
                    </h4>
                    {cta?.subtitle && (
                      <p className={`${SUB_DARK} text-lg`}>
                        {cta.subtitle ||
                          "Te acompañamos de principio a fin en tu desarrollo lingüístico."}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 lg:justify-end">
                    <a
                      href={
                        cta?.href ||
                        "https://www.linkedin.com/company/further"
                      }
                      target={
                        cta?.href?.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        cta?.href?.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className={`${LINK} ${GRAD} text-white shadow-[0_10px_34px_rgba(238,114,3,0.35)] hover:scale-[1.02]`}
                      aria-label={cta?.button || "Visitanos en LinkedIn"}
                    >
                      {cta?.button || "Visitanos en LinkedIn"}{" "}
                      <ArrowUpRight className="w-5 h-5 ml-1" aria-hidden />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

/* i18n loader */
export async function getStaticProps({ locale }) {
  return { props: { messages: await loadMessages(locale) } };
}
