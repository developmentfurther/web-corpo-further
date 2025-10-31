"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useScroll } from "framer-motion";
import { FiArrowRight, FiPlay } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations(); // ✅ Traducciones
  const { scrollYProgress } = useScroll({ offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white">
      {/* 🎥 Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/images/hero-poster.webp"
        className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
      >
        <source src="/videos/hero-bg.webm" type="video/webm" />
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Gradiente Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 pointer-events-none" />

      {/* 🔮 Luces dinámicas */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-[10%] w-[25rem] h-[25rem] bg-[radial-gradient(circle_at_center,rgba(255,100,50,0.5),transparent_70%)] blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1.1, 1.3, 1.1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[20%] right-[10%] w-[30rem] h-[30rem] bg-[radial-gradient(circle_at_center,rgba(238,114,3,0.4),transparent_70%)] blur-[120px]"
      />

      {/* 🧠 Contenido principal */}
      
<motion.div
  style={{ y, opacity }}
  className="relative z-10 flex flex-col items-start text-left px-8 md:px-20 max-w-5xl"
>
  {/* 🔸 Badge con flotación */}
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-lg px-5 py-2 shadow-[0_0_30px_rgba(255,255,255,0.08)] mb-6 animate-float-slow"
  >
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full rounded-full bg-gradient-to-r from-[#EE7203] to-[#FF3816] opacity-70 animate-ping"></span>
      <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-[#EE7203] to-[#FF3816]" />
    </span>
    <span className="text-sm font-medium text-white/90 tracking-wide">
      {t("home.hero.badge")}
    </span>
  </motion.div>

  {/* 🌈 Glow decorativo detrás del texto */}
  <div
    aria-hidden
    className="absolute -left-40 top-10 w-[550px] h-[550px] bg-[radial-gradient(circle_at_center,rgba(255,98,0,0.5),transparent_70%)] blur-[120px] opacity-30 animate-pulse-slow"
  />
  <div
    aria-hidden
    className="absolute left-[40%] bottom-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(255,56,22,0.5),transparent_70%)] blur-[140px] opacity-20 animate-pulse-slower"
  />

  {/* 🧠 Título */}
  <motion.h1
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className="relative text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
  >
    {t("home.hero.title.prefix")}{" "}
    <span className="relative inline">
      <span className="bg-gradient-to-r from-[#EE7203] via-[#FF3816] to-[#EE7203] bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
        {t("home.hero.title.highlight")}
      </span>
      {/* Glow detrás */}
      <span className="absolute inset-0 blur-2xl opacity-40 bg-gradient-to-r from-[#EE7203]/60 via-[#FF3816]/60 to-[#EE7203]/60 -z-10"></span>
    </span>
  </motion.h1>

  {/* 💬 Descripción */}
  <motion.p
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.2, delay: 0.15 }}
    className="mt-7 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed backdrop-blur-[2px]"
  >
    {t("home.hero.description")}
  </motion.p>

  {/* 🚀 CTA */}
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.3, delay: 0.3 }}
    className="mt-10 relative"
  >
    <button
  onClick={() => {
    const el = document.getElementById("home-contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }}
  className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-r from-[#EE7203] to-[#FF3816] shadow-[0_0_25px_rgba(238,114,3,0.3)] hover:shadow-[0_0_45px_rgba(238,114,3,0.6)] transition-all overflow-hidden backdrop-blur-sm"
>
  <span className="relative z-10 flex items-center gap-3">
    <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
    {t("common.buttons.requestConsultation")}
  </span>
  <div className="absolute inset-0 bg-gradient-to-r from-[#FF3816] to-[#EE7203] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
</button>

  </motion.div>
</motion.div>




      <ParallaxGlow />
    </section>
  );
}

/* 🔁 Parallax reactivo */
function ParallaxGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [viewport, setViewport] = useState({ width: 1, height: 1 });

  const rotateX = useTransform(mouseY, [0, viewport.height], [15, -15]);
  const rotateY = useTransform(mouseX, [0, viewport.width], [-15, 15]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    update();
    const move = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("resize", update);
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("mousemove", move);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div style={{ rotateX, rotateY }} className="absolute inset-0 z-0 pointer-events-none">
      <motion.div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_80%)] blur-3xl -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
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
