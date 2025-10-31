"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Services() {
  const t = useTranslations("home.services360");

  const CARDS = [
    {
      id: 1,
      title: t("cards.corporate.title"),
      subtitle: t("cards.corporate.subtitle"),
      logo: "/images/logos/further-corporate.png",
      link: "/",
    },
    {
      id: 2,
      title: t("cards.academy.title"),
      subtitle: t("cards.academy.subtitle"),
      logo: "/images/logos/further-academy.png",
      link: "/academy",
    },
    {
      id: 3,
      title: t("cards.school.title"),
      subtitle: t("cards.school.subtitle"),
      logo: "/images/logos/further-school.png",
      link: "/further-school",
    },
    {
      id: 4,
      title: t("cards.media.title"),
      subtitle: t("cards.media.subtitle"),
      logo: "/images/logos/further-media.png",
      link: "/further-media",
    },
    {
      id: 5,
      title: t("cards.tefl.title"),
      subtitle: t("cards.tefl.subtitle"),
      logo: "/images/logos/further-tefl.png",
      link: "/tefl",
    },
    {
      id: 6,
      title: t("cards.more.title"),
      subtitle: t("cards.more.subtitle"),
      logo: "/images/logos/further-more.png",
      link: "/furthermore",
    },
  ];

  const [centerIndex, setCenterIndex] = useState(1);
  const [paused, setPaused] = useState(false);
  const n = CARDS.length;
  const leftIndex = (centerIndex - 1 + n) % n;
  const rightIndex = (centerIndex + 1) % n;

  const visible = useMemo(
    () => [
      { card: CARDS[leftIndex], pos: -1 },
      { card: CARDS[centerIndex], pos: 0 },
      { card: CARDS[rightIndex], pos: 1 },
    ],
    [leftIndex, centerIndex, rightIndex]
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setCenterIndex((i) => (i + 1) % n);
    }, 3000);
    return () => clearInterval(t);
  }, [paused, n]);

  const goNext = () => setCenterIndex((i) => (i + 1) % n);
  const goPrev = () => setCenterIndex((i) => (i - 1 + n) % n);

  const CARD_W = 256;
  const GAP = 32;
  const SLOT = CARD_W + GAP;
  const slotToX = (pos) => pos * SLOT;

  const trans = {
    type: "spring",
    stiffness: 100,
    damping: 30,
    mass: 1.2,
    ease: "easeInOut",
  };

  const styleByPos = (pos) => {
    const isCenter = pos === 0;
    return {
      scale: isCenter ? 1.15 : 0.9,
      opacity: isCenter ? 1 : 0.55,
      filter: isCenter ? "blur(0px)" : "blur(3px) brightness(0.8)",
      zIndex: isCenter ? 10 : 1,
    };
  };

  return (
    <section className="relative py-32 text-white overflow-hidden">
      {/* ==== Fondo ==== */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/bg-corporate.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px) brightness(0.4)",
          transform: "scale(1.1)",
        }}
      />
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* ==== Header ==== */}
      <div className="relative z-10 text-center mb-20">
        <h2
          className="text-5xl font-semibold tracking-tight mb-4 
             bg-gradient-to-r from-white via-[#A8CFFF] to-[#80B3FF] 
             bg-clip-text text-transparent 
             drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          {t("title")}
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* ==== Carrusel ==== */}
      <div className="relative max-w-6xl mx-auto px-8">
        <button
          onClick={goPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition backdrop-blur-md"
        >
          <FiChevronLeft className="text-2xl text-white" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition backdrop-blur-md"
        >
          <FiChevronRight className="text-2xl text-white" />
        </button>

        <div
          className="relative h-[520px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {visible.map(({ card, pos }) => (
              <motion.div
                key={card.id}
                initial={{ x: slotToX(pos), opacity: 0.001, scale: 0.95 }}
                animate={{ x: slotToX(pos), ...styleByPos(pos), opacity: 1 }}
                transition={trans}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ width: CARD_W }}
              >
                <div className="relative w-64 h-88 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_50px_rgba(0,0,0,0.3)] overflow-hidden group cursor-pointer transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] via-white/[0.05] to-transparent rounded-[2rem]" />
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                    <div className="w-28 h-28 mb-5 rounded-full bg-white/20 flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-110">
                      <Image
                        src={card.logo}
                        alt={`${card.title} logo`}
                        width={90}
                        height={90}
                        className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-6">
                      {card.subtitle}
                    </p>
                    <Link
                      href={card.link}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white 
                        bg-gradient-to-r from-[#EE7203] to-[#FF3816] shadow-[0_0_25px_rgba(238,114,3,0.35)] 
                        hover:shadow-[0_0_40px_rgba(255,56,22,0.5)] 
                        transition-all duration-300 backdrop-blur-sm"
                    >
                      {t("visitButton")}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Glow inferior */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[900px] h-[250px] bg-gradient-radial from-white/20 to-transparent blur-3xl opacity-50 pointer-events-none" />
    </section>
  );
}
