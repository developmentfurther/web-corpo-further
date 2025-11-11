"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations();
  const prefersReduced = useReducedMotion();
  const [videoLoaded, setVideoLoaded] = useState(true); // fallback por si falla

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const GRADIENT_TEXT =
    "bg-gradient-to-r from-[#EE7203] via-[#FF3816] to-[#EE7203] bg-clip-text text-transparent";

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center min-h-[100vh] w-full overflow-hidden bg-black text-white"
    >
  <div className="absolute inset-0 z-0">
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster="/images/hero-poster.webp"
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/videos/homepage.webm" type="video/webm" />
      <source src="/videos/homepage.mp4" type="video/mp4" />
    </video>
       
        {/* Overlay para contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#0A1628]/90" />
      </div>

      {/* 🔥 Orbe decorativo único */}
      {!prefersReduced && (
        <div
          aria-hidden
          className="absolute left-[10%] top-[25%] w-[22rem] h-[22rem] bg-[radial-gradient(circle,rgba(255,100,50,0.35),transparent_70%)] blur-[60px] opacity-30"
        />
      )}

      {/* 🧱 Contenido principal */}
      <motion.div
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-start text-left px-8 md:px-20 max-w-5xl"
      >
        {/* Badge */}
        <motion.div
          {...fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-5 py-2 shadow-md mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-[#EE7203] to-[#FF3816] opacity-70 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-[#EE7203] to-[#FF3816]" />
          </span>
          <span className="text-sm font-medium text-white/90 tracking-wide">
            {t("home.hero.badge")}
          </span>
        </motion.div>

        {/* Título */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
        >
          {t("home.hero.title.prefix")}{" "}
          <span className="relative inline-block">
            <span className={`${GRADIENT_TEXT} animate-gradient`}>
              {t("home.hero.title.highlight")}
            </span>
            <span className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-r from-[#EE7203]/60 via-[#FF3816]/60 to-[#EE7203]/60 -z-10" />
          </span>
        </motion.h1>

        {/* Descripción */}
        <motion.p
          {...fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-6 text-lg md:text-xl text-white/85 max-w-3xl leading-relaxed"
        >
          {t("home.hero.description")}
        </motion.p>

        {/* Frase */}
        <motion.p
          {...fadeUp}
          transition={{ delay: 0.2 }}
          className="mt-4 text-white/80 italic text-lg md:text-[1.25rem] max-w-2xl leading-relaxed"
        >
          {t("home.hero.descriptionAlt")}
        </motion.p>

        {/* CTA */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.3 }}
          className="mt-10 relative"
        >
          <button
            onClick={() => {
              const el = document.getElementById("home-contact");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-r from-[#EE7203] to-[#FF3816] shadow-lg hover:shadow-[0_0_35px_rgba(238,114,3,0.5)] transition-all overflow-hidden backdrop-blur-sm"
          >
            <span className="relative z-10 flex items-center gap-3">
              <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
              {t("common.buttons.requestConsultation")}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF3816] to-[#EE7203] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ✨ Gradiente animado */
const styles = `
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.animate-gradient {
  background-size: 200% auto;
  animation: gradient 4s ease infinite;
}
`;
