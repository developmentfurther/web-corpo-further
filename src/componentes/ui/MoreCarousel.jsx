// /componentes/ui/CarouselSchool.jsx
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const imageFiles = [
  "/images/furthermore/furthermore1.jpeg",
  "/images/furthermore/furthermore2.jpeg",
  "/images/furthermore/furthermore3.jpeg",
  "/images/furthermore/furthermore4.jpg",
  "/images/furthermore/furthermore5.jpg",
  "/images/furthermore/furthermore6.jpg",
  "/images/furthermore/furthermore7.jpg",
];

function normalizeSrc(src) {
  if (!src) return "/images/placeholder.jpg";
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return src;
  return `/images/school/${src}`;
}

export default function MoreCarousel() {
  const [selected, setSelected] = useState(null);
  const [paused, setPaused] = useState(false);

  const duration = 60; // 🔸 velocidad más lenta

  return (
    <div className="mt-10 relative select-none">
      {/* === Desktop (loop infinito) === */}
      <div
        className="hidden sm:block overflow-hidden"
        onMouseEnter={() => setPaused(true)} // 🧠 pausa al hover
        onMouseLeave={() => !selected && setPaused(false)} // ▶️ reanuda solo si no hay modal abierto
      >
        <motion.div
          className="flex gap-10 w-max"
          animate={paused ? {} : { x: ["0%", "-50%"] }}
          transition={{
            repeat: paused ? 0 : Infinity,
            duration,
            ease: "linear",
          }}
        >
          {[...imageFiles, ...imageFiles].map((file, i) => {
            const src = normalizeSrc(file);
            return (
              <motion.div
                key={`${file}-${i}`}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative group cursor-pointer"
                onClick={() => {
                  setSelected(src);
                  setPaused(true);
                }}
              >
                <div className="aspect-[4/3] w-[400px] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={src}
                    alt={`Foto ${i + 1}`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    // onError={(e) =>
                    //   (e.currentTarget.src = "/images/placeholder.jpg")
                    // }
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <motion.div
                  className="absolute bottom-3 left-3 text-white/90 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ y: 10, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                >
                  Ver imagen →
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* === Mobile (scroll táctil manual) === */}
      <div className="sm:hidden overflow-x-auto flex gap-4 snap-x snap-mandatory px-2 pb-2">
        {imageFiles.map((file, i) => {
          const src = normalizeSrc(file);
          return (
            <div
              key={i}
              className="snap-center flex-shrink-0 w-[85%] rounded-2xl overflow-hidden shadow-md cursor-pointer aspect-[4/3]"
              onClick={() => {
                setSelected(src);
                setPaused(true);
              }}
            >
              <Image
                src={src}
                alt={`Foto ${i + 1}`}
                width={500}
                height={375}
                className="object-cover w-full h-full"
                // onError={(e) =>
                //   (e.currentTarget.src = "/images/placeholder.jpg")
                // }
              />
            </div>
          );
        })}
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
                // onError={(e) =>
                //   (e.currentTarget.src = "/images/placeholder.jpg")
                // }
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
