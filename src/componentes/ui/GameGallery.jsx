"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";



export default function GamesGallery({messages}) {
  const t = messages?.furthermore ?? {};
  const [active, setActive] = useState(null);
  const games = messages?.furthermore?.games?.list ?? [];

  return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 w-full overflow-hidden">
    <motion.h2
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-2xl sm:text-3xl font-extrabold mb-8 text-gray-900 text-center"
    >
      {t?.gallery?.title || "Nuestros Juegos"}
    </motion.h2>

    {/* GRID */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-full">
      {(t?.games?.list || []).map((game, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.02 }}
          className="relative w-full max-w-full aspect-[4/5] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
          onClick={() => setActive(game)}
        >
          <img
            src={game.img}
            alt={game.title}
            className="object-cover w-full h-auto max-w-full transition-transform duration-500 group-hover:scale-105"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white p-4 text-center">
            <h3 className="text-xl font-bold mb-2">{game.title}</h3>
            <p className="text-sm opacity-90">{game.summary}</p>
          </div>
        </motion.div>
      ))}
    </div>

    {/* === MODAL === */}
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="
              relative bg-white rounded-2xl w-full max-w-[95vw] sm:max-w-3xl md:max-w-4xl
              overflow-hidden shadow-2xl flex flex-col md:grid md:grid-cols-[1fr_1.2fr]
            "
          >
            {/* Cerrar */}
            <button
              onClick={() => setActive(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Imagen */}
            <div className="relative w-full h-64 sm:h-80 md:h-auto max-w-full overflow-hidden">
              <img
                src={active.img}
                alt={active.title}
                className="w-full h-full object-cover max-w-full"
              />
            </div>

            {/* Texto */}
            <div className="p-5 sm:p-6 md:p-8 text-gray-800 overflow-y-auto max-h-[80vh]">
              <h3 className="text-xl sm:text-2xl font-bold text-[#EE7203] mb-3 sm:mb-4">
                {active.title}
              </h3>
              <p className="text-sm sm:text-base mb-3">
                {active.description || active.summary}
              </p>

              <div className="mt-6 sm:hidden flex justify-center">
                <button
                  onClick={() => setActive(null)}
                  className="px-6 py-2 rounded-xl bg-[#EE7203] text-white font-semibold active:scale-95 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

}
