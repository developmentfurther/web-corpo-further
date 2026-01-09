"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FiArrowRight } from "react-icons/fi";
import { FaSpotify, FaYoutube, FaTiktok } from "react-icons/fa"; // Importamos logos oficiales

export default function FurtherMediaSection() {
  const t = useTranslations("furtherMedia");

  // Helper para scroll suave
  const handleScroll = (e, link) => {
    if (link?.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(link);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, "", link);
      }
    }
  };

  // Configuración de cards con sus iconos
  const CARDS = [
    {
      id: t("cards.records.id"),
      title: t("cards.records.title"),
      desc: t("cards.records.desc"),
      img: "/images/recordsbg.png",
      link: "/further-media#spotify",
      icon: FaSpotify, // Icono directo
      color: "hover:text-[#1DB954]" // Color oficial de marca al hover (opcional)
    },
    {
      id: t("cards.youtube.id"),
      title: t("cards.youtube.title"),
      desc: t("cards.youtube.desc"),
      img: "/images/furthershorts.png",
      link: "/further-media#youtube",
      icon: FaYoutube,
      color: "hover:text-[#FF0000]"
    },
    {
      id: t("cards.tiktok.id"),
      title: t("cards.tiktok.title"),
      desc: t("cards.tiktok.desc"),
      img: "/images/furthertiktok.png",
      link: "/further-media#tiktok",
      icon: FaTiktok,
      color: "hover:text-[#00F2EA]"
    },
  ];

  return (
    <section
      id="media"
      className="relative overflow-hidden bg-gradient-to-b from-[#0A1628] via-[#0C212D] to-[#0C212D] text-white py-28"
    >
      {/* === Fondo decorativo animado === */}
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

      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EE7203]/10 via-transparent to-[#0C212D]/90 z-0" />

      {/* === Contenido === */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        {/* Header */}
        <div className="mb-20">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#EE7203] via-[#FF3816] to-[#FF8145] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,120,40,0.25)]">
            {t("aboutSection.title")}
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            {t("aboutSection.subtitle")}
          </p>
        </div>

        {/* === Cards Grid === */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#112C3E]/70 to-[#0A1628]/70 shadow-2xl backdrop-blur-xl overflow-hidden"
            >
              {/* Glow effect al hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#EE7203]/20 via-[#FF3816]/10 to-transparent pointer-events-none" />

              {/* Imagen */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Link href={card.link} onClick={(e) => handleScroll(e, card.link)}>
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:blur-sm"
                  />
                </Link>

                {/* Icono Flotante Optimizado */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                   {/* Renderizamos el icono dinámicamente */}
                   <card.icon className={`w-16 h-16 text-white drop-shadow-lg transition-colors duration-300 ${card.color}`} />
                </div>
              </div>

              {/* Text Content */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-8">
                <Link href={card.link} onClick={(e) => handleScroll(e, card.link)}>
                  <h3 className="text-xl font-semibold mb-2 text-white transition-colors duration-300 group-hover:text-[#EE7203]">
                    {card.title}
                  </h3>
                </Link>
                
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {card.desc}
                </p>

                <Link
                  href={card.link}
                  onClick={(e) => handleScroll(e, card.link)}
                  className="group/btn inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#EE7203] to-[#FF3816] shadow-lg hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
                >
                  <span>{t("aboutSection.visitButton")}</span>
                  <FiArrowRight className="text-lg transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}