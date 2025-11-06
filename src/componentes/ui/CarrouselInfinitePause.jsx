import { motion, useAnimationControls, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

function CarouselInfinitePause() {
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
        duration: 40, // 🔹 velocidad del loop (más alto = más lento)
        repeat: Infinity,
      },
    });
  };

  const pauseAnimation = () => {
    controls.stop(); // detiene el timeline
  };

  useEffect(() => {
    startAnimation();
    return () => controls.stop();
  }, []);

  return (
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
            className="flex-shrink-0 h-24 sm:h-28 md:h-32 w-40 sm:w-52 md:w-64 flex items-center justify-center"
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
  );
}

export default CarouselInfinitePause;
