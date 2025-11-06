import { motion, useAnimationControls, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

function CarouselInfinitePause() {
  const t = useTranslations("corporate.companies"); // 👈 clave i18n esperada

  const logos = [
    "/images/logos/accenture.png",
    "/images/logos/boca.png",
    "/images/logos/egger.png",
    "/images/logos/manpower.png",
    "/images/logos/merck.png",
    "/images/logos/mirgor.png",
    "/images/logos/nosis.png",
  ];

  const controls = useAnimationControls();
  const x = useMotionValue(0);
  const animationRef = useRef(null);

  const startAnimation = () => {
    animationRef.current = controls.start({
      x: ["0%", "-50%"],
      transition: {
        ease: "linear",
        duration: 40, // 🔹 velocidad del loop
        repeat: Infinity,
      },
    });
  };

  const pauseAnimation = () => controls.stop();

  useEffect(() => {
    startAnimation();
    return () => controls.stop();
  }, []);

  return (
    <section
      className="bg-white text-gray-900 py-14"
      aria-labelledby="clients-title"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* === Título y subtítulo i18n === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h2
            id="clients-title"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900"
          >
            {t("title")}
          </h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* === Carrusel === */}
        <div
          className="relative w-full overflow-hidden py-6 group"
          onMouseEnter={pauseAnimation}
          onMouseLeave={startAnimation}
        >
          <motion.div
            className="flex gap-20 items-center"
            animate={controls}
            style={{ x }}
          >
            {logos.concat(logos).map((src, i) => (
              <motion.div
                key={i}
                className="flex-shrink-0 h-20 sm:h-24 md:h-28 w-40 sm:w-52 md:w-64 flex items-center justify-center"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={src}
                  alt={`Client logo ${i + 1}`}
                  className="max-h-16 sm:max-h-20 md:max-h-24 mx-auto grayscale hover:grayscale-0 opacity-85 hover:opacity-100 transition-all duration-500 object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CarouselInfinitePause;
