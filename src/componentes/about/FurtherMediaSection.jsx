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
      platform: "spotify"
    },
    {
      id: t("cards.youtube.id"),
      title: t("cards.youtube.title"),
      desc: t("cards.youtube.desc"),
      img: "/images/furthershorts.png",
      link: "/further-media#youtube",
      platform: "youtube"
    },
    {
      id: t("cards.tiktok.id"),
      title: t("cards.tiktok.title"),
      desc: t("cards.tiktok.desc"),
      img: "/images/furthertiktok.png",
      link: "/further-media#tiktok",
      platform: "tiktok"
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

    {/* Overlay naranja */}
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
            {/* Glow dinámico */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 bg-gradient-to-br from-[#EE7203]/20 via-[#FF3816]/25 to-transparent rounded-[2rem]" />

            {/* Imagen con blur al hover */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
  <Link href={card.link}>
    <Image
      src={card.img}
      alt={card.title}
      fill
      className="object-cover object-center transition-all duration-700 group-hover:scale-110 group-hover:blur-md cursor-pointer"
    />
  </Link>

              {/* Logo SVG centrado */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700">
                {card.platform === "spotify" && (
                  
<svg
  viewBox="0 0 64 64"
  className="w-16 h-16 text-white opacity-90 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
  aria-label="Spotify"
>
  <defs>
    {/* Las ondas en negro recortan (knockout) el círculo blanco */}
    <mask id="spx">
      <rect width="64" height="64" fill="#fff" />
      <path
        d="M17 26c9-3.2 22.5-2.7 31 1.7"
        stroke="#000"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M19 33c8-2.5 19.9-2 27.5 1.6"
        stroke="#000"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M21 40c7-2.1 17.4-1.6 24 1.4"
        stroke="#000"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </mask>
  </defs>
  {/* círculo “brand” monocromo (blanco) con las ondas recortadas */}
  <circle cx="32" cy="32" r="28" fill="currentColor" mask="url(#spx)" />
</svg>

                )}
                {card.platform === "youtube" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-16 h-16 text-white opacity-90 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    fill="currentColor"
                  >
                    <path d="M10 15.5v-7l6 3.5-6 3.5Zm12-3.5c0-2.12-.2-3.35-.45-4.22a2.93 2.93 0 0 0-2.06-2.06C18.62 5.5 12 5.5 12 5.5s-6.62 0-7.49.22A2.93 2.93 0 0 0 2.45 7.78C2.23 8.65 2 9.88 2 12s.2 3.35.45 4.22c.23.88 1 1.83 2.06 2.06.87.22 7.49.22 7.49.22s6.62 0 7.49-.22a2.93 2.93 0 0 0 2.06-2.06c.23-.87.45-2.1.45-4.22Z" />
                  </svg>
                )}
                {card.platform === "tiktok" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-14 h-14 text-white opacity-90 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    fill="currentColor"
                  >
                    <path d="M17.5 6.5a5.5 5.5 0 0 1-3.5-1.3V14a5 5 0 1 1-5-5c.3 0 .7 0 1 .1v3a2 2 0 1 0 2 2V2h2a3.5 3.5 0 0 0 3.5 3.5Z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Texto */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-8">
              <Link href={card.link}>
  <h3
    className="text-xl font-semibold mb-2 text-white transition-all duration-300 group-hover:text-[#FF8145] cursor-pointer"
  >
    {card.title}
  </h3>
</Link>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                {card.desc}
              </p>

              <Link
                href={card.link}
                onClick={(e) => {
                  if (card.link?.startsWith("#")) {
                    e.preventDefault();
                    const target = document.querySelector(card.link);
                    if (target) {
                      target.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
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
