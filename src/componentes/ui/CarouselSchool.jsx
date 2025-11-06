// /componentes/ui/CarouselSchool.jsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const imageFiles = [
  "school1.png",
  "school2.jpg",
  "school3.jpg",
  "school4.jpg",
  "school5.jpg",
  "school6.jpg",
  "school7.jpg",
  "school8.jpg",
  "school11.jpeg",
  "school12.jpeg",
];

function normalizeSrc(src) {
  if (!src) return "/images/placeholder.jpg";
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return src;
  return `/images/school/${src}`;
}

export default function CarouselSchool() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState(null);

  // Cambio automático cada 3 segundos
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % imageFiles.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [paused]);

  const src = normalizeSrc(imageFiles[index]);

  return (
    <div
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* === Imagen actual === */}
      <AnimatePresence mode="wait">
        <motion.div
          key={src}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={src}
            alt={`Imagen ${index + 1}`}
            fill
            priority={false}
            className="object-cover cursor-pointer"
            onClick={() => {
              setSelected(src);
              setPaused(true);
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* === Indicadores === */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {imageFiles.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index
                ? "bg-gradient-to-r from-[#EE7203] to-[#FF3816] w-5"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* === Modal ampliado === */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelected(null);
              setPaused(false);
            }}
          >
            <motion.div
              className="relative max-w-5xl w-full aspect-[4/3]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 20 }}
            >
              <Image
                src={normalizeSrc(selected)}
                alt="Vista ampliada"
                fill
                className="rounded-2xl shadow-2xl object-cover"
              />
              <button
                onClick={() => {
                  setSelected(null);
                  setPaused(false);
                }}
                className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
