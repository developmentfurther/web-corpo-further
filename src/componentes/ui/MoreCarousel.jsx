import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX, FiMaximize2 } from "react-icons/fi";

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
  if (src.startsWith("http") || src.startsWith("/")) return src;
  return `/images/school/${src}`;
}

export default function ModernCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalImages = imageFiles.length;

  // 🎯 Navegación
  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  const goToSlide = useCallback((index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // ⏱️ Auto-play
  useEffect(() => {
    if (isPaused || selected) return;
    const timer = setInterval(goToNext, 4000);
    return () => clearInterval(timer);
  }, [isPaused, selected, goToNext]);

  // ⌨️ Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape" && selected) setSelected(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext, selected]);

  // 🎨 Variantes de animación
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  return (
    <div className="mt-10 relative">
      {/* === CARRUSEL PRINCIPAL === */}
      <div 
        className="relative max-w-7xl mx-auto px-4 sm:px-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Contenedor principal con efecto de profundidad */}
        <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
          
          {/* Slides con AnimatePresence */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
              }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setSelected(imageFiles[currentIndex])}
            >
              {/* Imagen principal */}
              <Image
                src={normalizeSrc(imageFiles[currentIndex])}
                alt={`Gallery image ${currentIndex + 1}`}
                fill
                priority={currentIndex === 0}
                className="object-cover"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Botón de ampliar */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(imageFiles[currentIndex]);
                }}
              >
                <FiMaximize2 className="w-5 h-5" />
              </motion.button>

              {/* Contador de imágenes */}
              <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md text-white text-sm font-medium">
                {currentIndex + 1} / {totalImages}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Botones de navegación */}
          <button
            onClick={goToPrev}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* === THUMBNAILS === */}
        <div className="mt-6 flex gap-3 justify-center overflow-x-auto pb-2 px-2 snap-x snap-mandatory scrollbar-hide">
          {imageFiles.map((file, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden snap-center transition-all ${
                index === currentIndex
                  ? "ring-4 ring-orange-500 ring-offset-2 ring-offset-slate-900 shadow-2xl"
                  : "ring-2 ring-white/20 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={normalizeSrc(file)}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
              {index === currentIndex && (
                <motion.div
                  layoutId="activeThumb"
                  className="absolute inset-0 bg-gradient-to-t from-orange-500/40 to-transparent"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Indicador de progreso */}
        <div className="mt-4 flex justify-center gap-2">
          {imageFiles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="relative h-1 w-8 sm:w-12 rounded-full bg-white/20 overflow-hidden"
            >
              {index === currentIndex && (
                <motion.div
                  layoutId="progress"
                  className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* === MODAL FULLSCREEN === */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Imagen ampliada */}
              <div className="relative w-full h-full">
                <Image
                  src={normalizeSrc(selected)}
                  alt="Fullscreen view"
                  fill
                  className="object-contain rounded-2xl"
                />
              </div>

              {/* Botón cerrar */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </motion.button>

              {/* Navegación en modal */}
              <motion.button
                whileHover={{ scale: 1.1, x: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                  setSelected(imageFiles[(currentIndex - 1 + totalImages) % totalImages]);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
              >
                <FiChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, x: 4 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                  setSelected(imageFiles[(currentIndex + 1) % totalImages]);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
              >
                <FiChevronRight className="w-6 h-6" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}