"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function HeroTefl() {
  const t = useTranslations("tefl"); // 👈 namespace TEFL

  const fadeUp = {
    initial: { opacity: 0, y: 25 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const GRAD_TEXT =
    "bg-gradient-to-r from-[#EE7203] via-[#FF5A1F] to-[#FF3816] bg-clip-text text-transparent";

  return (
    <header
      id="hero"
      className="relative flex items-center justify-center text-center min-h-[85vh] sm:min-h-[100vh] overflow-hidden text-white"
    >
      {/* 🖼 Fondo con imagen o video */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/teflbg.jpg"
          alt={t("meta.title") || "TEFL Program background"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/10 via-[#0A1628]/80 to-[#0A1628]/100" />
      </div>

      {/* ✨ Orbes decorativos */}
      <div
        aria-hidden
        className="absolute top-[25%] left-[15%] w-[18rem] h-[18rem] bg-[radial-gradient(circle_at_center,rgba(255,88,0,0.25),transparent_70%)] blur-[120px]"
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
          {t("hero.badge") || "International TEFL Certification"}
        </motion.div>

        {/* Título */}
        <motion.h1
          {...fadeUp}
          className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4"
        >
          <span>{t("hero.title") || "TEFL:"} </span>
          <span className={GRAD_TEXT}>
            {t("hero.subtitle") || "Teaching English as a Foreign Language"}
          </span>
        </motion.h1>

        {/* Descripción */}
        <motion.p
          {...fadeUp}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed"
        >
          {t("hero.description") ||
            "Certificación internacional para enseñar inglés en cualquier parte del mundo. Metodología moderna, práctica y reconocida globalmente."}
        </motion.p>

        

        {/* CTA */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <a
            href="#program"
            className="relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white rounded-full overflow-hidden shadow-lg text-sm sm:text-base group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#EE7203] to-[#FF3816]" />
            <span className="relative flex items-center gap-2">
              {t("hero.cta") || "Discover the Program"}
              <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </a>
        </motion.div>
      </motion.div>
    </header>
  );
}
