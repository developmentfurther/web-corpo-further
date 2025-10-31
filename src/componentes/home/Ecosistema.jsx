"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Ecosistema () {
    const t = useTranslations("home.services360")

    return(
<section
  id="ecosystem"
  className="relative py-28 lg:py-36 overflow-hidden text-white 
             bg-gradient-to-b from-[#0C212D] via-[#112C3E] to-[#0C212D]"
>
  {/* Fondo decorativo sutil */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_70%)] pointer-events-none" />
  <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-[#EE7203]/10 to-transparent opacity-70" />

  <motion.div
  className="relative z-10 mt-0"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
>
    
    {/* Título */}
    <h3
      className="text-4xl sm:text-5xl font-extrabold text-center mb-14 
                 bg-gradient-to-r from-[#EE7203] via-[#FF3816] to-[#FF8145]
                 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,120,40,0.25)]"
    >
      {t("ecosystem.title")}
    </h3>

    {/* Cards */}
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
      {/* === Card 1 === */}
      <motion.div
        whileHover={{ scale: 1.05, y: -6 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="relative rounded-3xl p-8 text-center 
                   bg-gradient-to-b from-[#112C3E]/70 to-[#0C212D]/80 
                   border border-white/10 backdrop-blur-xl 
                   shadow-[0_8px_40px_rgba(0,0,0,0.25)] 
                   hover:shadow-[0_0_40px_rgba(255,56,22,0.45)] 
                   transition-all duration-150 ease-out"
      >
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl 
                        bg-gradient-to-tr from-[#EE7203] to-[#FF3816] shadow-lg">
          {/* 🎓 SVG Academic Cap */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="1.8" className="w-8 h-8">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
            <path d="M12 21v-6" />
          </svg>
        </div>
        <h4 className="text-xl font-bold mb-3 text-white">
          {t("ecosystem.excellence")}
        </h4>
        <p className="text-white/70 text-sm leading-relaxed">
          {t("ecosystem.excellenceDesc")}
        </p>
      </motion.div>

      {/* === Card 2 === */}
      <motion.div
        whileHover={{ scale: 1.05, y: -6 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="relative rounded-3xl p-8 text-center 
                   bg-gradient-to-b from-[#112C3E]/70 to-[#0C212D]/80 
                   border border-white/10 backdrop-blur-xl 
                   shadow-[0_8px_40px_rgba(0,0,0,0.25)] 
                   hover:shadow-[0_0_40px_rgba(255,56,22,0.45)] 
                   transition-all duration-150 ease-out"
      >
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl 
                        bg-gradient-to-tr from-[#EE7203] to-[#FF3816] shadow-lg">
          {/* 🤖 SVG AI */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="white" strokeWidth="1.8" className="w-8 h-8">
            <path d="M9 2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v3H3a2 2 0 00-2 2v2a2 2 0 002 2h1v3a2 2 0 002 2h1v1a2 2 0 002 2h2a2 2 0 002-2v-1h1a2 2 0 002-2v-3h1a2 2 0 002-2v-2a2 2 0 00-2-2h-1V7a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H9z" />
          </svg>
        </div>
        <h4 className="text-xl font-bold mb-3 text-white">
          {t("ecosystem.ai")}
        </h4>
        <p className="text-white/70 text-sm leading-relaxed">
          {t("ecosystem.aiDesc")}
        </p>
      </motion.div>

      {/* === Card 3 === */}
      <motion.div
        whileHover={{ scale: 1.05, y: -6 }}
        transition={{ duration: 0.12, ease: "easeOut" }}
        className="relative rounded-3xl p-8 text-center 
                   bg-gradient-to-b from-[#112C3E]/70 to-[#0C212D]/80 
                   border border-white/10 backdrop-blur-xl 
                   shadow-[0_8px_40px_rgba(0,0,0,0.25)] 
                   hover:shadow-[0_0_40px_rgba(255,56,22,0.45)] 
                   transition-all duration-150 ease-out"
      >
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl 
                        bg-gradient-to-tr from-[#EE7203] to-[#FF3816] shadow-lg">
          {/* 💬 SVG Chat / People */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke="white" strokeWidth="1.8"
            className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M7 8h10M7 12h6m2 8a9 9 0 100-18 9 9 0 000 18z" />
          </svg>
        </div>
        <h4 className="text-xl font-bold mb-3 text-white">
          {t("ecosystem.human")}
        </h4>
        <p className="text-white/70 text-sm leading-relaxed">
          {t("ecosystem.humanDesc")}
        </p>
      </motion.div>
    </div>

    {/* Frase final */}
{/* Frase final */}
<motion.p
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.4 }}
  transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
  className="mt-20 text-xl md:text-2xl text-center text-white/85 
             max-w-4xl mx-auto leading-relaxed font-light 
             tracking-wide px-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
>
  <span className="block text-white/70">
    En Further incorporamos tecnología de vanguardia para potenciar tu experiencia
  </span>
</motion.p>


  </motion.div>
</section>
    )
}