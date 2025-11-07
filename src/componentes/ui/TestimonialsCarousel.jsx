"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { FaStar } from "react-icons/fa"; // ⭐ o usa Lucide: import { Star } from "lucide-react"

export default function TestimonialsCarousel({ items = [] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  // === autoplay ===
  useEffect(() => {
    if (!items?.length) return;
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [items.length, paused]);

  if (!items || items.length === 0) return null;
  const current = items[index];

  return (
    <div
      className="relative overflow-hidden max-w-4xl mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* === Testimonio actual === */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="w-full"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm shadow-lg shadow-black/20 p-8 text-center">
            {/* ⭐ Estrellas */}
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: current.rating || 5 }).map((_, i) => (
                <FaStar key={i} className="text-[#EE7203] w-4 h-4" />
              ))}
            </div>

            {/* Reseña */}
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-6 italic">
              “{current.review}”
            </p>

            {/* Nombre + fuente */}
            <div className="text-white/70 text-sm">
              <strong className="text-white">{current.name}</strong>
              {current.source ? ` · ${current.source}` : ""}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* === Indicadores === */}
      <div className="flex justify-center gap-2 mt-8">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${
              i === index
                ? "bg-[#EE7203] scale-110"
                : "bg-white/25 hover:bg-white/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
