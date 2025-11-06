"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations } from "next-intl";

/* ======== BANDERAS SVG ======== */
function FlagAR({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="60" height="40" fill="#75AADB" />
      <rect y="13.3" width="60" height="13.3" fill="#fff" />
      <circle cx="30" cy="20" r="4" fill="#F6B40E" />
    </svg>
  );
}

function FlagUS({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      {/* Fondo blanco */}
      <rect width="60" height="40" fill="#fff" />
      {/* Franjas rojas */}
      {[...Array(7)].map((_, i) => (
        <rect key={i} y={i * 5.714} width="60" height="2.857" fill="#B22234" />
      ))}
      {/* Cuadro azul (campo de estrellas) */}
      <rect width="24" height="20" fill="#3C3B6E" />
      {/* Estrellas (simplificadas por puntos blancos) */}
      {[...Array(9)].map((_, row) =>
        [...Array(row % 2 === 0 ? 6 : 5)].map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={2.4 + col * 4.0 + (row % 2 === 1 ? 2 : 0)}
            cy={2.2 + row * 2.2}
            r="0.4"
            fill="#fff"
          />
        ))
      )}
    </svg>
  );
}

function FlagUK({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      {/* Fondo azul */}
      <rect width="60" height="40" fill="#012169" />
      {/* Cruces diagonales blancas */}
      <path
        fill="#FFF"
        d="M0,0 24,16 0,16 0,24 24,24 0,40 8,40 30,26 52,40 60,40 60,32 36,16 60,16 60,8 36,8 60,0 52,0 30,14 8,0z"
      />
      {/* Cruces diagonales rojas */}
      <path
        fill="#C8102E"
        d="M0,0 25,17 20,17 0,4 0,0z M60,0 35,17 40,17 60,4 60,0z M0,40 25,23 20,23 0,36 0,40z M60,40 35,23 40,23 60,36 60,40z"
      />
      {/* Cruz central blanca */}
      <rect x="24" width="12" height="40" fill="#FFF" />
      <rect y="14" width="60" height="12" fill="#FFF" />
      {/* Cruz central roja */}
      <rect x="26" width="8" height="40" fill="#C8102E" />
      <rect y="16" width="60" height="8" fill="#C8102E" />
    </svg>
  );
}




function FlagDE({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="60" height="13.3" fill="#000" />
      <rect y="13.3" width="60" height="13.3" fill="#DD0000" />
      <rect y="26.6" width="60" height="13.3" fill="#FFCE00" />
    </svg>
  );
}

function FlagFR({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="20" height="40" fill="#0055A4" />
      <rect x="20" width="20" height="40" fill="#FFF" />
      <rect x="40" width="20" height="40" fill="#EF4135" />
    </svg>
  );
}

function FlagBR({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="60" height="40" fill="#009B3A" />
      <polygon points="30,5 55,20 30,35 5,20" fill="#FFDF00" />
      <circle cx="30" cy="20" r="8" fill="#002776" />
    </svg>
  );
}

function FlagIT({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="20" height="40" fill="#009246" />
      <rect x="20" width="20" height="40" fill="#FFF" />
      <rect x="40" width="20" height="40" fill="#CE2B37" />
    </svg>
  );
}

/* ======== MAIN COMPONENT ======== */
export default function LanguageFlags() {
  const [hovered, setHovered] = useState(null);
  const t = useTranslations();


  const flags = [
    { id: "en", name: "English US", Component: FlagUS },
    { id: "en", name: "English UK", Component: FlagUK},
    { id: "pt", name: "Português", Component: FlagBR },
    { id: "fr", name: "Français", Component: FlagFR },
    { id: "de", name: "Deutsch", Component: FlagDE },
    { id: "it", name: "Italiano", Component: FlagIT },
    { id: "es", name: "Spanish for Foreigners", Component: FlagAR },
  ];

  return (
    <section className="py-24 bg-[#0C212D] text-center relative overflow-hidden">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 
             bg-gradient-to-r from-[#ff9345] via-[#EE7203] to-[#FF3816] 
             bg-clip-text text-transparent 
             drop-shadow-[0_0_18px_rgba(255,120,40,0.25)] 
             tracking-tight">
        {t("common.flags.title")}
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {flags.map(({ id, name, Component }) => (
          <motion.div
            key={id}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            whileHover={{ scale: 1.15, y: -4 }}
            className="relative group"
          >
            <div className="rounded-2xl bg-white/10 p-4 hover:bg-white/20 transition-all shadow-lg backdrop-blur-md">
              <Component className="h-10 w-14" />
            </div>

            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: hovered === id ? 1 : 0, y: hovered === id ? 0 : 10 }}
              transition={{ duration: 0.25 }}
              className="absolute w-max left-1/2 -translate-x-1/2 mt-2 text-sm text-white/80 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md pointer-events-none"
            >
              {name}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
