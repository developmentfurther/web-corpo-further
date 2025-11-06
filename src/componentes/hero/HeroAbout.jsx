"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { FiArrowRight } from "react-icons/fi";

/* ===== Design Tokens (consistentes con Corporate / Furthermore) ===== */
const GRAD = "bg-gradient-to-r from-[#EE7203] via-[#FF5A1F] to-[#FF3816]";
const GRAD_TEXT =
  "bg-gradient-to-r from-[#EE7203] via-[#FF5A1F] to-[#FF3816] bg-clip-text text-transparent";
const LINK =
  "inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#FF3816]/60 transition-all duration-300";
const CARD_GLASS =
  "border border-white/15 bg-white/[0.08] backdrop-blur-xl shadow-lg rounded-full";

/* ===== Animaciones ===== */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

export default function HeroAbout() {
  const t = useTranslations("about.hero");
  const { scrollYProgress } = useScroll({ offset: ["start start", "end start"] });

  // Parallax leve del video
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section
      className="relative z-10 overflow-hidden min-h-[100vh] flex items-center justify-center text-white"
      aria-labelledby="about-hero-title"
    >
      {/* 🎥 Video de fondo */}
      <motion.div
        className="absolute inset-0 -z-10 overflow-hidden"
        style={{ perspective: 1000 }}
      >
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/images/school-poster.webp"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
          style={{ scale: videoScale, y: videoY }}
        >
          <source src="/videos/school-bg.webm" type="video/webm" />
          <source src="/videos/school-bg.mp4" type="video/mp4" />
        </motion.video>

        {/* Overlay oscuro para contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/60 via-[#0A1628]/85 to-[#0A1628]/95" />
      </motion.div>

      {/* ✨ Orbes decorativos */}
      <div className="pointer-events-none absolute inset-0 -z-[5]" aria-hidden>
        <div className="absolute -top-28 -right-24 h-72 w-72 rounded-full bg-[#EE7203]/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#FF3816]/20 blur-3xl" />
      </div>

      {/* 🧱 Contenido centrado */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative text-center px-6 max-w-3xl mx-auto space-y-8"
      >
        {/* Badge */}
        {t("badge") && (
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-1.5 rounded-full text-xs text-white/80 backdrop-blur-sm"
          >
            <span className="h-2 w-2 rounded-full bg-[#FF3816]" />
            {t("badge")}
          </motion.div>
        )}

        {/* Título principal */}
       <motion.h1
  variants={fadeUp}
  id="about-hero-title"
  className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] max-w-6xl mx-auto text-balance"
>
  {t("title.prefix") && (
    <span className="block mb-2">{t("title.prefix")}</span>
  )}
  {t("title.highlight") && (
    <span className={GRAD_TEXT}>{t("title.highlight")}</span>
  )}
</motion.h1>


        {/* Subtítulo */}
        {t("subtitle") && (
          <motion.p
            variants={fadeUp}
            className="text-white/80 text-lg max-w-xl mx-auto"
          >
            {t("subtitle")}
          </motion.p>
        )}

        {/* Descripción */}
        {t("description") && (
          <motion.p
            variants={fadeUp}
            className="text-white/70 text-base max-w-xl mx-auto"
          >
            {t("description")}
          </motion.p>
        )}

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          <a
            href={t("primaryCta.href") || "/contacto"}
            className={`${LINK} ${GRAD} text-white shadow-[0_10px_34px_rgba(238,114,3,0.35)] hover:scale-[1.02] active:scale-[.99]`}
          >
            {t("primaryCta.label") || "Contact us"} <FiArrowRight />
          </a>
          <a
            href={t("secondaryCta.href") || "/further-media"}
            className={`${LINK} ${CARD_GLASS} text-white/90 hover:border-white/20`}
          >
            {t("secondaryCta.label") || "Discover Further Media"} →
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
