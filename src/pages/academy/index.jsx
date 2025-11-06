import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { useRouter } from "next/router";
import { loadMessages } from "@/lib/i18n";
import CarouselInfinitePause from "@/componentes/ui/CarrouselInfinitePause";
import HeroAcademy from "@/componentes/hero/HeroAcademy";

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
    whileInView: { opacity: 1, y: 0 },
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

          {/* === FEATURED COURSE === */}
          <section id="featured" className="relative py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5EE] via-white to-[#FFEFE7]" />
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className={`${WRAP}`}
              >
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-3xl font-bold text-gray-900">
                    🎓 {t("academy.featured.section")}
                  </h3>
                  <Link href="#latest" className={LINK_LIGHT}>
                    {t("academy.featured.browseAll")} →
                  </Link>
                </div>

                {/* CARD */}
                <div className="grid lg:grid-cols-2 gap-12 items-center rounded-3xl backdrop-blur-xl bg-white/80 border border-white/50 shadow-[0_8px_40px_rgba(238,114,3,0.08)] overflow-hidden">
                  {/* Text */}
                  <div className="p-10 space-y-6">
                    <div className="flex gap-2">
                      <Badge>{t("academy.featured.badgeOffer")}</Badge>
                      <Badge>{t("academy.featured.badgeHot")}</Badge>
                    </div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      {t("academy.featured.kicker")}
                    </p>
                    <h4 className="text-3xl font-extrabold text-gray-900">
                      {t("academy.featured.title")}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {t("academy.featured.desc")}
                    </p>
                    <div className="bg-white/70 border border-orange-100 rounded-2xl p-5">
                      <h5 className="text-[#EE7203] font-semibold mb-2">
                        Practical. Interactive. Real Results.
                      </h5>
                      <ul className="grid sm:grid-cols-2 gap-2 text-gray-800 text-sm">
                        <li>🎬 Short, focused video lessons</li>
                        <li>🧩 Guided exercises & templates</li>
                        <li>🎥 “Video as a Mirror” self-recordings</li>
                        <li>🏁 Expert final pitch feedback</li>
                      </ul>
                    </div>
                    <div className="flex gap-4 pt-4">
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
                        className={LINK_LIGHT}
                      >
                        {t("academy.featured.goCourse")}
                      </Link>
                    </div>
                  </div>

                  {/* Visual */}
                  <div className="relative h-[420px]">
                    <Image
                      src="/images/academy/pitch.avif"
                      alt="Pitch Mastery cover"
                      fill
                      className="object-cover rounded-3xl lg:rounded-l-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="text-sm opacity-80">
                        {t("academy.featured.limited")}
                      </p>
                      <div className="flex items-baseline gap-3 mt-1">
                        <span className="text-4xl font-bold">
                          {t("academy.featured.price.sale")}
                        </span>
                        <span className="line-through text-white/70">
                          {t("academy.featured.price.original")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </section>

        {/* === ALL COURSES / LIGHT VERSION === */}
<section id="all-courses" className="relative bg-white text-gray-900 py-20 overflow-hidden">
  <div className={WRAP}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-center mb-14"
    >
      <h3 className="text-3xl sm:text-4xl font-extrabold">
        {t("academy.latest.title") || "Our Courses"}
      </h3>
      <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
        {t("academy.latest.subtitle") ||
          "Discover our self-paced, business-focused English programs."}
      </p>
    </motion.div>

    {/* Grid of cards */}
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c, i) => (
 
  <motion.article
    key={i}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.2 }}
    whileHover={{
      y: -6,
      scale: 1.02,
      boxShadow: "0 12px 40px rgba(238,114,3,0.15)",
    }}
    className="group relative rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-500 overflow-hidden flex flex-col cursor-pointer"
  >
    {/* Imagen con overlay */}
<div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
  {/* Imagen principal */}
  {c.image ? (
    <Image
      src={c.image}
      alt={c.title}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-cover transition-transform duration-700 group-hover:scale-110"
      priority={false}
    />
  ) : (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
      + Add Image
    </div>
  )}

  {/* Overlay en hover */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />
  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]">
    
  </div>
</div>


    {/* Contenido */}
    <div className="flex-1 p-6 flex flex-col justify-between">
      <div>
        <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#EE7203] transition-colors">
          {c.title}
        </h4>
        <p className="mt-2 text-gray-600 text-sm leading-relaxed line-clamp-4">
          {c.desc}
        </p>

        {/* Info */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
            {c.level}
          </span>
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
            </svg>
            {c.duration}
          </span>
        </div>

        {/* Precio */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-[#EE7203]">
            {c.price}
          </span>
          {c.oldPrice && (
            <span className="text-gray-400 line-through">{c.oldPrice}</span>
          )}
          {c.tag && (
            <span className="text-xs uppercase font-semibold text-[#EE7203] ml-auto">
              {c.tag}
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 flex">
        <Link
          href={c.link || "#"} target="_blank"
          className="relative inline-flex items-center justify-center w-full rounded-xl px-5 py-3 font-semibold text-white overflow-hidden shadow-md hover:shadow-lg transition-transform hover:scale-[1.03]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#EE7203] to-[#FF3816]" />
          <span className="relative z-10">View Details</span>
        </Link>
      </div>
    </div>
  </motion.article>
))}

     
    </div>
  </div>
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
