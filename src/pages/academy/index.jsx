import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { useRouter } from "next/router";
import { loadMessages } from "@/lib/i18n";
import HeroAcademy from "@/componentes/hero/HeroAcademy";
import { ArrowRight, PlayCircle, Clock, ChevronRight } from "lucide-react";

/* === TOKENS === */
const BG_DARK = "bg-[#0A1628] text-white";
const CARD_GLASS =
  "rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.25)]";
const CARD_LIGHT = "rounded-3xl border border-gray-200 bg-white shadow-xl";
const BRAND_GRAD = "bg-gradient-to-tr from-[#EE7203] to-[#FF3816]";
const GRAD_TEXT =
  "bg-gradient-to-tr from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent";
const WRAP = "mx-auto w-full max-w-7xl px-4 sm:px-6";
const LINK_LIGHT =
  "inline-flex items-center gap-2 px-4 py-2 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#FF3816]/40 hover:bg-gray-50 transition text-gray-700";
const CTA_SOLID =
  "relative inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold overflow-hidden";

/* === i18n helper === */
function useT(messages) {
  return (path, fallback = "") =>
    path
      .split(".")
      .reduce((acc, k) => (acc && acc[k] != null ? acc[k] : null), messages) ??
    fallback;
}

/* === Badge === */
function Badge({ children, tone = "light" }) {
  const base =
    tone === "light"
      ? "text-[#FF3816] bg-[#FFF1E9] border border-[#FFD6C0]"
      : "text-white bg-[#FF3816]/90";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${base}`}
    >
      {children}
    </span>
  );
}

/* === Wave Dividers === */
function WaveToLight({ className = "" }) {
  return (
    <div aria-hidden className={`relative ${className}`}>
      <svg
        className="block w-full h-20 -scale-y-100 translate-y-[1px]"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0V46.29c47.79,22,103.59,29,158,17.39C256,41,312,2,376,1.5S512,39,576,55.5s128,17,192-5,128-71,192-44,128,101,240,114V0Z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
}
function WaveToDark({ className = "" }) {
  return (
    <div aria-hidden className={`relative ${className}`}>
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

/* === PAGE === */
export default function AcademyPage({ messages }) {
  const { locale } = useRouter();
  const t = useT(messages);
  const prefersReduced = useReducedMotion();

  const metaTitle = t("academy.meta.title");
  const metaDesc = t("academy.meta.description");

  const courses = Object.values(t("academy.latest.items",{}))

  /* === anim === */
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: prefersReduced ? 0 : 0.6, ease: "easeOut" },
  };

  return (
    <MotionConfig reducedMotion="user">
      <div >
        <Head>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDesc} />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:description" content={metaDesc} />
          <meta property="og:locale" content={locale} />
        </Head>

        {/* === HERO === */}
        <HeroAcademy />
        <WaveToLight />



        {/* === TRUST === */}
        <section className="bg-white text-gray-900">
         

          {/* === INTRO === */}
          <motion.section {...fadeUp} className={`${WRAP} py-20`}>
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  {t("academy.intro.kicker")}
                </p>
                <h2 className="text-3xl sm:text-4xl font-black mt-2">
                  {t("academy.intro.title")}{" "}
                  <span className={GRAD_TEXT}>
                    {t("academy.intro.highlight")}
                  </span>
                </h2>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  {t("academy.intro.copy")}
                </p>
                <ul className="mt-6 grid sm:grid-cols-2 gap-2 text-gray-900">
                  {[t("academy.intro.points.selfPaced"),
                    t("academy.intro.points.cert"),
                    t("academy.intro.points.specialized"),
                    t("academy.intro.points.flexible")].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FF3816]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
                <Image
                  src="/images/academy/portada.avif"
                  alt={t("academy.intro.imageAlt")}
                  width={800}
                  height={600}
                  className="object-cover"
                />
              </div>
            </div>
          </motion.section>

 <section id="featured" className="relative py-24 overflow-hidden">
  {/* OPTIMIZACIÓN: Usar un div estático simple para el fondo, evitar repaints complejos */}
  <div className="absolute inset-0 bg-[#FFF5EE]" />
  
  {/* Decorative subtle gradient - Opcional, si sigue lento, sacá esta línea */}
  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-[#FFEFE7]" />

  <div className="relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }} // Carga un poco antes de llegar
      transition={{ duration: 0.6, ease: "easeOut" }} // Duración un poco más corta se siente más ágil
      className={`${WRAP} will-change-transform`} // Habilita aceleración de hardware
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900">
          {t("academy.featured.section")}
        </h2>
        <Link href="#all-courses" className={LINK_LIGHT}>
          {t("academy.featured.browseAll")}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Featured Card */}
      {/* OPTIMIZACIÓN: 
          1. Saqué 'backdrop-blur-xl'.
          2. Cambié bg-white/80 a bg-white/95 (casi sólido, mucho más rápido).
          3. Reduje el spread de la sombra de 40px a 25px.
      */}
      <div className="grid lg:grid-cols-2 gap-0 rounded-3xl bg-white/95 border border-white/50 shadow-[0_4px_25px_rgba(238,114,3,0.06)] overflow-hidden">
        
        {/* Content */}
        <div className="p-12 space-y-6 flex flex-col justify-center">
          <div className="flex gap-2">
            <Badge>{t("academy.featured.badgeOffer")}</Badge>
            <Badge>{t("academy.featured.badgeHot")}</Badge>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
              {t("academy.featured.kicker")}
            </p>
            <h3 className="text-4xl font-extrabold text-gray-900 leading-tight">
              {t("academy.featured.title")}
            </h3>
          </div>
          
          <p className="text-gray-700 leading-relaxed text-lg">
            {t("academy.featured.desc")}
          </p>

          {/* Features Box */}
          {/* Mantenemos el gradiente aquí porque es pequeño y no afecta tanto */}
          <div className="bg-gradient-to-br from-white to-orange-50/50 border border-orange-100 rounded-2xl p-6 space-y-4">
            <h4 className="text-[#EE7203] font-semibold text-lg">
              Practical. Interactive. Real Results.
            </h4>
            <ul className="grid sm:grid-cols-2 gap-3 text-gray-800 text-sm">
              <li className="flex items-start gap-2">
                <PlayCircle className="w-4 h-4 text-[#EE7203] mt-0.5 flex-shrink-0" />
                <span>Short, focused video lessons</span>
              </li>
              <li className="flex items-start gap-2">
                {/* SVG simplificado inline está bien */}
                <svg className="w-4 h-4 text-[#EE7203] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
                <span>Guided exercises & templates</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#EE7203] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Video as a Mirror self-recordings</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#EE7203] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Expert final pitch feedback</span>
              </li>
            </ul>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="https://academy.furthercorporate.com/all-courses/0TQTPo4jpzpjU4xo66Gp"
              className={CTA_SOLID}
            >
              <span className={`${BRAND_GRAD} absolute inset-0`} />
              <span className="relative text-white font-semibold">
                {t("academy.featured.startCourse")}
              </span>
            </Link>
            <Link
              href="https://academy.furthercorporate.com/all-courses/0TQTPo4jpzpjU4xo66Gp"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:border-[#EE7203] hover:text-[#EE7203] transition-colors duration-300" // Cambiado transition-all por transition-colors para performance
            >
              {t("academy.featured.goCourse")}
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative h-full min-h-[420px]">
          <Image
            src="/images/academy/pitch.avif"
            alt="Pitch Mastery cover"
            fill
            priority // IMPORTANTE: Carga prioritaria para el LCP (Largest Contentful Paint)
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={85} // Reducir un poco la calidad (default es 75, pero 85 es buen balance)
          />
          {/* Overlay simplificado: evitar gradientes complejos si no son necesarios */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/90 via-[#0A1628]/10 to-transparent" />
          
          {/* Price Badge */}
          <div className="absolute bottom-8 left-8 right-8">
            {/* Aquí sí dejamos el backdrop-blur porque es un área chica, no mata la PC */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <p className="text-sm text-white/80 mb-2">
                {t("academy.featured.limited")}
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-white">
                  {t("academy.featured.price.sale")}
                </span>
                <span className="text-xl line-through text-white/60">
                  {t("academy.featured.price.original")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
</section>

      {/* All Courses Section */}
      <section id="all-courses" className="relative bg-white py-24 overflow-hidden">
        <div className={WRAP}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              {t("academy.latest.title") || "Our Courses"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("academy.latest.subtitle") || "Discover our self-paced, business-focused English programs."}
            </p>
          </motion.div>

          {/* Courses Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-56 w-full overflow-hidden">
                  {course.image ? (
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm font-medium">Add Image</span>
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Tag */}
                  {course.tag && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#EE7203] text-white shadow-lg">
                        {course.tag}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#EE7203] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {course.desc}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {course.level}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-extrabold text-[#EE7203]">
                        {course.price}
                      </span>
                      {course.oldPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          {course.oldPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={course.link || "#"}
                    target="_blank"
                    className="relative inline-flex items-center justify-center w-full rounded-xl px-6 py-3.5 font-semibold text-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group/btn"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-[#EE7203] to-[#FF3816] transition-transform duration-300 group-hover/btn:scale-105" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      View Details
                      <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
      </section>


        <WaveToDark className="-mb-[1px]" />
        <div className="h-8 bg-[#0A1628]" />
      </div>
    </MotionConfig>
  );
}

/* === getStaticProps === */
export async function getStaticProps({ locale = "en" }) {
  const messages = await loadMessages(locale);
  return { props: { messages } };
}
