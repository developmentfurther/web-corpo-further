"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FiArrowRight } from "react-icons/fi";

export default function FurtherMediaSection() {
  const t = useTranslations("furtherMedia"); // 👈 namespace del JSON

  // cards traducibles
  const CARDS = [
    {
      id: t("cards.records.id"),
      title: t("cards.records.title"),
      desc: t("cards.records.desc"),
      img: "/images/recordsbg.png",
      link: "/further-media#spotify",
    },
    {
      id: t("cards.youtube.id"),
      title: t("cards.youtube.title"),
      desc: t("cards.youtube.desc"),
      img: "/images/recordsbg.png",
      link: "/further-media#youtube",
    },
    {
      id: t("cards.tiktok.id"),
      title: t("cards.tiktok.title"),
      desc: t("cards.tiktok.desc"),
      img: "/images/recordsbg.png",
      link: "/further-media#tiktok",
    },
  ];

  return (
    <section
      id="media"
      className="relative overflow-hidden bg-gradient-to-b from-[#0A1628] via-[#0C212D] to-[#0C212D] text-white py-28"
    >
      {/* === Fondo decorativo === */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(238,114,3,0.15), transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,56,22,0.15), transparent 60%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Overlay naranja para coherencia */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EE7203]/15 via-transparent to-[#0C212D]/80 z-0" />

      {/* === Contenido === */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        {/* Header */}
        <div className="mb-20">
          <h2
            className="text-4xl sm:text-5xl font-extrabold mb-4 
            bg-gradient-to-r from-[#EE7203] via-[#FF3816] to-[#FF8145]
            bg-clip-text text-transparent
            drop-shadow-[0_0_25px_rgba(255,120,40,0.25)]"
          >
            {t("aboutSection.title")}
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            {t("aboutSection.subtitle")}
          </p>
        </div>

        {/* === Cards === */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-[2rem] border border-white/10 
                bg-gradient-to-b from-[#112C3E]/70 to-[#0A1628]/70 
                shadow-[0_8px_40px_rgba(0,0,0,0.35)] 
                backdrop-blur-xl overflow-hidden transition-all duration-700"
            >
              {/* Glow dinámico al hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-br from-[#EE7203]/20 via-[#FF3816]/25 to-transparent rounded-[2rem]" />

              {/* Imagen */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Texto */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-8">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {card.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {card.desc}
                </p>
<Link
  href={card.link} // ej: "#spotify", "#youtube", "#tiktok"
  onClick={(e) => {
    // Evita que el Link haga scroll instantáneo
    if (card.link?.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(card.link);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      // opcional: actualiza la URL sin recargar la página
      window.history.pushState(null, "", card.link);
    }
  }}
  className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white 
    bg-gradient-to-r from-[#EE7203] to-[#FF3816] 
    shadow-[0_0_25px_rgba(238,114,3,0.35)] 
    hover:shadow-[0_0_40px_rgba(255,56,22,0.5)] 
    transition-all duration-300"
>
  <span>{t("aboutSection.visitButton")}</span>
  <FiArrowRight className="text-base translate-y-[1px] transition-transform duration-300 group-hover:translate-x-1" />
</Link>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
