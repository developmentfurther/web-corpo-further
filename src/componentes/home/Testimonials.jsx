"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export default function Testimonials({
  wrapperClass = "py-20 lg:py-28 bg-gray-50 overflow-hidden",
  containerClass = "mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8",
}) {
  const t = useTranslations();
  const testimonials = t.raw("home.testimonials.items");
  const [index, setIndex] = useState(0);

  // Cambio automático cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Animaciones suaves
  const variants = {
    enter: { opacity: 0, y: 20, scale: 0.98 },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const current = testimonials[index];

  return (
    <section id="testimonials" className={wrapperClass}>
      <div className={containerClass}>
        {/* Encabezado */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t("home.testimonials.title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("home.testimonials.subtitle")}
            </p>
          </motion.div>
        </div>

        {/* Testimonio activo */}
        <div className="relative h-[340px] sm:h-[320px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-md p-10 text-center"
            >
              {/* Estrellas */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-[#EE7203]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Texto */}
              <p className="text-gray-700 italic leading-relaxed mb-8 max-w-2xl mx-auto">
                “{current.quote}”
              </p>

              {/* Nombre y rol */}
              <div className="border-t border-gray-200 pt-4">
                <div className="font-bold text-gray-900">{current.name}</div>
                <div className="text-sm text-gray-600">{current.role}</div>
                <div className="text-sm text-[#EE7203] font-medium">
                  {current.company}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                i === index ? "bg-[#EE7203] w-6" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
