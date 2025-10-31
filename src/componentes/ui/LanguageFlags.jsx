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

// We can rename it to be more specific
function FlagHalfEN({ className = "h-10 w-10" }) {
  // --- US Flag Proportions (on a 40-unit height) ---
  const stripeHeight = 40 / 13;
  const cantonHeight = (7 / 13) * 40; // Covers 7 stripes
  const cantonWidth = 12; // 0.4 * 30 (width of US half)
  const starRadius = 0.6; // Slightly larger stars
  const starRows = [...Array(9)]; // 9 rows for stars

  return (
    <svg
      viewBox="0 0 60 40"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* This clip path is the key to the UK flag's counter-changed red saltire.
          It defines two areas (top-right and bottom-left) where the red
          saltire will be visible.
        */}
        <clipPath id="uk-red-saltire-clip">
          <path d="M15,0 30,0 30,20 0,20 0,40 15,40z" />
        </clipPath>
      </defs>

      {/* === MITAD IZQUIERDA — UK (Corrected) === */}
      <g>
        {/* 1. Blue background */}
        <rect width="30" height="40" fill="#012169" />
        
        {/* 2. White Saltire (St. Andrew) - Corner-to-corner */}
        <path d="M0 0 L30 40 M0 40 L30 0" stroke="#FFF" strokeWidth="6" />
        
        {/* 3. Red Saltire (St. Patrick) - Clipped */}
        <g clipPath="url(#uk-red-saltire-clip)">
          <path d="M0 0 L30 40 M0 40 L30 0" stroke="#C8102E" strokeWidth="2" />
        </g>
        
        {/* 4. Central Cross (St. George) - (Your original was correct) */}
        <rect x="12" width="6" height="40" fill="#FFF" />
        <rect y="17" width="30" height="6" fill="#FFF" />
        <rect x="13" width="4" height="40" fill="#C8102E" />
        <rect y="18" width="30" height="4" fill="#C8102E" />
      </g>

      {/* === MITAD DERECHA — USA (Corrected) === */}
      <g>
        {/* 1. Red background (for the 7 red stripes) */}
        <rect x="30" width="30" height="40" fill="#B22234" />
        
        {/* 2. Six white stripes (at odd indices: 1, 3, 5, 7, 9, 11) */}
        {[...Array(6)].map((_, i) => (
          <rect
            key={`us-stripe-${i}`}
            x="30"
            y={stripeHeight * (i * 2 + 1)} // y = 1*h, 3*h, 5*h...
            width="30"
            height={stripeHeight}
            fill="#FFF"
          />
        ))}
        
        {/* 3. Blue Canton (Union) */}
        <rect
          x="30"
          y="0"
          width={cantonWidth}
          height={cantonHeight}
          fill="#3C3B6E"
        />
        
        {/* 4. 50 Stars (9 rows: 6-5-6-5-6-5-6-5-6) */}
        <g fill="#FFF">
          {starRows.map((_, r) => {
            const isSixStarRow = r % 2 === 0;
            const numStars = isSixStarRow ? 6 : 5;
            const starCols = [...Array(numStars)];
            const y = (cantonHeight / 10) * (r + 1);
            
            return starCols.map((_, c) => {
              // Spacing logic for 6-star vs 5-star rows
              const x_spacing_factor = isSixStarRow ? 12 : 10;
              const x = 30 + (cantonWidth / x_spacing_factor) * (c * 2 + 1);
              return <circle key={`${r}-${c}`} cx={x} cy={y} r={starRadius} />;
            });
          })}
        </g>
      </g>
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
    { id: "es", name: "Argentina — Español", Component: FlagAR },
    { id: "en", name: "UK / USA — English", Component: FlagHalfEN },
    { id: "de", name: "Alemania — Deutsch", Component: FlagDE },
    { id: "fr", name: "Francia — Français", Component: FlagFR },
    { id: "pt", name: "Brasil — Português", Component: FlagBR },
    { id: "it", name: "Italia — Italiano", Component: FlagIT },
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
