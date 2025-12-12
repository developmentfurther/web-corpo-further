"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiMaximize2, FiX,FiPlay  } from "react-icons/fi";
import { useState } from "react";

function ExpandableVideo({ src, title, t, mapUrl }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative group rounded-3xl overflow-hidden bg-[#0C212D] border border-white/10"
      >
        <div className="relative aspect-video">
          <iframe
            src={src}
            className="w-full h-full object-cover"
            allow="autoplay; fullscreen; picture-in-picture"
          />
          <div className="
  absolute inset-0 
  bg-gradient-to-t from-black/80 via-black/40 to-black/20
  opacity-90 group-hover:opacity-70
  transition-opacity duration-300
" />

<button
  onClick={() => setOpen(true)}
  aria-label={t?.common?.play || "Play video"}
  className="
    absolute inset-0 z-10
    flex items-center justify-center
    transition-opacity duration-300
    group-hover:opacity-100
  "
>
  <div
    className="
      flex items-center justify-center
      w-16 h-16 sm:w-20 sm:h-20
      rounded-full
      bg-white/15 backdrop-blur-md
      border border-white/30
      text-white
      hover:bg-[#EE7203]/40
      transition-all duration-300
      shadow-lg shadow-black/40
    "
  >
    <FiPlay className="w-7 h-7 sm:w-8 sm:h-8 ml-1" />
  </div>
</button>

          <button
            onClick={() => setOpen(true)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur text-white hover:bg-[#EE7203]/40 transition"
          >
            <FiMaximize2 />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <a
  href={mapUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="
    inline-flex items-center gap-2
    text-[#EE7203] mt-2 text-sm font-medium
    hover:text-[#FF3816]
    transition-colors
  "
>
  <FiMapPin className="w-4 h-4" />
  {t?.locations?.viewLocation}
</a>

        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-6xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={src}
                className="w-full h-full rounded-2xl"
                allow="autoplay; fullscreen; picture-in-picture"
              />
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-12 right-0 p-3 rounded-full bg-white/10 text-white hover:bg-[#EE7203]/40"
              >
                <FiX />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function LocationsSection({ t, SHELL, GRAD_TEXT, BTN_PRIMARY }) {
  return (
    <section id="locations" className="bg-[#0A1628] text-white">
      <div className={`${SHELL} py-24`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold">
            <span className={GRAD_TEXT}>
              {t?.locations?.title || "Conocé nuestras sedes"}
            </span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto mt-4 text-lg">
            {t?.locations?.intro}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          <ExpandableVideo
            src="https://player.vimeo.com/video/1134646362"
            title="Parque Patricios"
             t={t}
             mapUrl={"https://www.google.com/maps/place/La+Rioja+1775,+C1258+Cdad.+Aut%C3%B3noma+de+Buenos+Aires/@-34.631488,-58.4089305,17z/data=!3m1!4b1!4m6!3m5!1s0x95bccb04d199c947:0xe891bed4a99cdea2!8m2!3d-34.6314924!4d-58.4063556!16s%2Fg%2F11wpmjgc1f?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"}
          />
          <ExpandableVideo
            src="https://player.vimeo.com/video/1134605055"
            title="Saavedra"
             t={t}
             mapUrl={"https://www.google.com/maps/place/Av.+Garc%C3%ADa+del+R%C3%ADo+2866,+C1429+Cdad.+Aut%C3%B3noma+de+Buenos+Aires/@-34.5496765,-58.4736713,17z"}

          />
        </div>

        <div className="text-center mt-16">
          <a href="/contacto" className={BTN_PRIMARY}>
            {t?.locations?.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
