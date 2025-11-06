"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function HeroSchool() {
  const t = useTranslations("school.hero");
  const { scrollYProgress } = useScroll({ offset: ["start start", "end start"] });

  // Parallax leve del video
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, -120]);

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
          <source src="/videos/school.mp4" type="video/mp4" />
        </motion.video>

        {/* Overlay oscuro para contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/60 via-[#0A1628]/85 to-[#0A1628]/95" />
      </motion.div>

      {/* 🧱 Contenido principal */}
      <motion.div
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center px-6 sm:px-8 text-center max-w-3xl"
      >
        {/* Badge */}
        {t("badge") && (
          <motion.div
            {...fadeUp}
            className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-1.5 rounded-full text-xs text-white/80 mb-5 backdrop-blur-sm"
          >
            <span className="h-2 w-2 rounded-full bg-[#FF3816]" />
            {t("badge")}
          </motion.div>
        )}

        {/* Título */}
        <motion.h1
          {...fadeUp}
          className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4"
        >
          <span className="block">{t("title")}</span>
          <span className={`${GRAD_TEXT} block`}>{t("subtitle")}</span>
        </motion.h1>

        {/* Descripción (opcional futura) */}
        {t.raw("description") && (
          <motion.p
            {...fadeUp}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed"
          >
            {t("description")}
          </motion.p>
        )}

        {/* CTA */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <a
            href="#why"
            className="relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white rounded-full overflow-hidden shadow-lg text-sm sm:text-base"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#EE7203] to-[#FF3816]" />
            <span className="relative flex items-center gap-2">
              {t("ctaPrimary") || "Explore our programs"}
              <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </a>

          
        </motion.div>
      </motion.div>
    </header>
  );
}
