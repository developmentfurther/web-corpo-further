"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function HeroCorporate() {
  const t = useTranslations("corporate.hero");

  const fadeUp = {
    initial: { opacity: 0, y: 25 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const GRAD_TEXT =
    "bg-gradient-to-r from-[#EE7203] via-[#FF5A2B] to-[#FF3816] bg-clip-text text-transparent";

  return (
    <header
      id="hero"
      className="relative flex items-center justify-center text-center min-h-[80vh] sm:min-h-[100vh] overflow-hidden text-white"
    >
      {/* 🖼 Imagen de fondo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/bg-corporate.jpeg"
          alt="Corporate Services background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-100"
        />
        {/* 🎨 Capa de degradado progresivo */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/10 via-[#0A1628]/75 to-[#0A1628]/100" />

      </div>

      {/* ✨ Luces decorativas sutiles */}
      <div
        aria-hidden
        className="absolute top-1/3 left-[15%] w-[18rem] h-[18rem] bg-[radial-gradient(circle_at_center,rgba(255,88,0,0.25),transparent_70%)] blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] right-[15%] w-[22rem] h-[22rem] bg-[radial-gradient(circle_at_center,rgba(238,114,3,0.35),transparent_70%)] blur-[140px]"
      />

      {/* 🧱 Contenido principal */}
      <motion.div
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center px-6 sm:px-8 text-center max-w-3xl"
      >
        {/* Badge */}
        <motion.div
          {...fadeUp}
          className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-1.5 rounded-full text-xs text-white/80 mb-5 backdrop-blur-sm"
        >
          <span className="h-2 w-2 rounded-full bg-[#FF3816]" />
          {t("badge")}
        </motion.div>

        {/* Título */}
        <motion.h1
          {...fadeUp}
          className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4"
        >
          <span>{t("title.prefix")} </span>
          <span className={GRAD_TEXT}>{t("title.highlight")}</span>
        </motion.h1>

        {/* Descripción */}
        <motion.p
          {...fadeUp}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed"
        >
          {t("description")}
        </motion.p>

        {/* Subtexto */}
        <motion.p
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="mt-3 text-white font-semibold text-sm sm:text-base"
        >
        </motion.p>

        {/* CTA */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <a
            href="#services"
            className="relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white rounded-full overflow-hidden shadow-lg text-sm sm:text-base"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#EE7203] to-[#FF3816]" />
            <span className="relative flex items-center gap-2">
              {t("ctaPrimary") || "Ver servicios"}
              <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </a>

          <a
            href="/about"
            className="text-white/80 hover:text-white transition-colors text-sm sm:text-base"
          >
            {t("ctaSecondary") || "Conocé nuestra historia"} →
          </a>
        </motion.div>
      </motion.div>
    </header>
  );
}
