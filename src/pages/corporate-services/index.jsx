// /pages/corporate-services/index.jsx
// Corporate Services — diseño alineado con “Nosotros” (ondas invertidas verticalmente)

import React, { useMemo, useState, useRef, useEffect } from "react";
import Head from "next/head";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  animate,
  useInView,
  useMotionValue,
} from "framer-motion";
import { loadMessages } from "@/lib/i18n";
import { WaveToDark, WaveToLight } from "@/componentes/ui/Waves";
import { useTranslations } from "next-intl";
import { FiAward, FiUsers, FiTarget, FiBookOpen  } from "react-icons/fi";
import Ecosistema from "@/componentes/home/Ecosistema";
import StatsCorporate from "@/componentes/home/StatsCorporate";
import HeroCorporate from "@/componentes/hero/HeroCorporate";

/* ==============================
   Design Tokens (dark + light)
   ============================== */
/* Azul unificado:
   - Base deep:   #0C212D
   - Alterno (footer-like): #0A1628
*/
const BG =
  "bg-gradient-to-b from-[#0A1628] via-[#0C212D] to-[#0C212D] text-white";
const BG_ALT = "bg-[#0A1628]/80";
const GRAD = "bg-gradient-to-br from-[#EE7203] via-[#FF5A1F] to-[#FF3816]";
const GRAD_SUBTLE =
  "bg-gradient-to-br from-[#EE7203]/20 via-[#FF5A1F]/10 to-[#FF3816]/20";
const GRAD_TEXT =
  "bg-gradient-to-r from-[#EE7203] via-[#FF5A1F] to-[#FF3816] bg-clip-text text-transparent";
const CARD =
  "relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl shadow-2xl shadow-black/40";
const CARD_HOVER =
  "hover:border-white/25 hover:shadow-[0_20px_70px_rgba(238,114,3,0.15)] transition-all duration-500";
const LINK =
  "inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#FF3816]/60 transition-all duration-300";
const TITLE = "text-white font-black tracking-tight";
const SUB = "text-white/70 leading-relaxed";
const TEXT = "text-white/85 leading-relaxed";
const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

/* Light section tokens */
const LIGHT_WRAP = "bg-gradient-to-br from-white via-gray-50 to-white";

/* ==============================
   Animation Variants
   ============================== */
const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};
const itemFade = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const itemScale = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};
const floatingAnimation = {
  y: [-10, 10, -10],
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
};


/* ==============================
   Floating Orbs + Grid
   ============================== */
function FloatingOrbs() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <motion.div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
        style={{
          background: "radial-gradient(circle, #EE7203 0%, transparent 70%)",
        }}
        animate={floatingAnimation}
      />
      <motion.div
        className="absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full blur-[100px] opacity-15"
        style={{
          background: "radial-gradient(circle, #FF3816 0%, transparent 70%)",
        }}
        animate={{
          y: [10, -10, 10],
          transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.div
        className="absolute bottom-20 left-1/4 w-[300px] h-[300px] rounded-full blur-[80px] opacity-10"
        style={{
          background: "radial-gradient(circle, #FF5A1F 0%, transparent 70%)",
        }}
        animate={{
          y: [-15, 15, -15],
          transition: { duration: 10, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    </div>
  );
}
function GridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30" aria-hidden>
      <svg
        className="absolute w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}



/* ==============================
   Main Page
   ============================== */
export default function CorporateIndex({ messages }) {
  const tCorp = messages?.corporate ?? {};
  const tCommon = messages?.common ?? {};
  const tCta = messages?.tech ?? {};
  const t = useTranslations();
  const statsRaw = t.raw("corporate.stats");

  const stats = [
  { ...statsRaw.yearsInBusiness, icon: FiAward },
  { ...statsRaw.corporatePartners, icon: FiUsers },
  { ...statsRaw.corporateStudents, icon: FiTarget },
  { ...statsRaw.privateStudents, icon: FiBookOpen },
];


  const metaHome = messages?.meta?.home ?? {};
  const metaTitle =
    tCorp?.meta?.title ??
    metaHome?.title ??
    "Further Corporate: B2B Language Services";
  const metaDesc =
    tCorp?.meta?.description ??
    metaHome?.description ??
    "Corporate language training with CEFR-aligned assessment and measurable outcomes.";

  const hero = {
    badge:
      tCorp?.hero?.badge ??
      "Corporate Language Solutions",
    prefix:
      tCorp?.hero?.title?.prefix ??
      "Servicios de idiomas",
    highlight: tCorp?.hero?.title?.highlight ?? "B2B",
    description:
      tCorp?.hero?.description ??
      "Programas corporativos personalizados, alineados al CEFR, con resultados medibles.",
    ctaPrimary: tCommon?.buttons?.requestProposal ?? "Request Proposal",
    ctaSecondary: tCommon?.cta?.learnMore ?? "Learn More",
  };

 


  const serviceCardsRaw =
    tCorp?.services?.cards ?? [];
  const serviceCards = Array.isArray(serviceCardsRaw) ? serviceCardsRaw : [];
  const defaultServices = [
    {
      title: "Corporate Training",
      description:
        "Customized B2B programs designed for your team's specific needs and industry context.",
    },
    {
      title: "Executive Programs",
      description:
        "One-on-one coaching for C-suite executives with flexible scheduling and personalized content.",
    },
    {
      title: "International Certification",
      description:
        "Comprehensive exam preparation for globally recognized language certifications.",
    },
  ];
  const servicesSource =
    serviceCards.length > 0 ? serviceCards : defaultServices;

  const services = useMemo(
    () =>
      servicesSource.slice(0, 3).map((c, i) => ({
        title: c?.title || "Service",
        body: c?.description ?? "",
        icon:
          i === 0 ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="5"
                width="18"
                height="12"
                rx="2"
                fill="currentColor"
                className="text-white/10"
              />
              <path
                d="M3 16h18M10 19h4"
                stroke="#FF6A1F"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="11" r="2" fill="#EE7203" />
            </svg>
          ) : i === 1 ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 20v-8l8-4 8 4v8"
                fill="none"
                stroke="#FF6A1F"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="8" r="2.5" fill="#EE7203" />
              <path
                d="M8 20v-6m8 6v-6"
                stroke="currentColor"
                strokeOpacity=".3"
                strokeWidth="2"
              />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeOpacity=".4"
                strokeWidth="2"
              />
              <path
                d="M8 16v-4m4 4v-7m4 7V9"
                stroke="#FF6A1F"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          ),
      })),
    [servicesSource]
  );

  const languages =
    Array.isArray(tCorp?.languages) && tCorp.languages.length
      ? tCorp.languages
      : [
          "English",
          "Italiano",
          "Deutsch",
          "Português",
          "Français",
          "Español (L2)",
        ];

  const cefr = {
    title: tCorp?.cefr?.title ?? "CEFR Placement",
    whyTitle: tCorp?.cefr?.whyTitle ?? "Why CEFR?",
    p1:
      tCorp?.cefr?.p1 ??
      "Placement and tracking aligned with CEFR for transparent, international standards.",
    p2:
      tCorp?.cefr?.p2 ??
      "From A1 (beginner) to C2 (mastery), with consistent, measurable evaluation.",
    blogLabel: tCommon?.cta?.learnMore ?? "Learn More",
    blogHref:
      tCorp?.cefr?.blogHref ?? "/blog/evaluando-la-fluidez-que-es-el-cefr",
    bullets:
      Array.isArray(tCorp?.cefr?.bullets) && tCorp.cefr.bullets.length
        ? tCorp.cefr.bullets
        : [
            "Transparent levels",
            "International comparability",
            "Measurable progress",
          ],
  };

  const testimonialsNS =
    tCorp?.testimonials 
    messages?.about?.testimonials ??
    {};
  const testimonials = Array.isArray(testimonialsNS?.items)
    ? testimonialsNS.items
    : [];

  const forms = {
    emailPH: tCommon?.forms?.emailPlaceholder ?? "you@company.com",
    invalidEmail:
      tCommon?.forms?.invalidEmail ?? "Please enter a valid email address.",
    thanks:
      tCommon?.forms?.thanks ?? "Thanks! Please check your inbox to confirm.",
    error: tCommon?.forms?.error ?? "Something went wrong. Please try again.",
    sending: tCommon?.forms?.sending ?? "Sending...",
    ctaSend: tCommon?.cta?.send ?? "Send",
  };

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState({ state: "idle", error: "" });
  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // dentro del componente CorporateIndex()
const onSubmit = async (e) => {
  e.preventDefault();

  if (!form.name.trim())
    return setStatus({ state: "error", error: "Please enter your full name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    return setStatus({ state: "error", error: forms.invalidEmail });
  if (form.message.trim().length < 10)
    return setStatus({
      state: "error",
      error: "Please provide more details (10+ characters).",
    });

  try {
    setStatus({ state: "sending", error: "" });

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        origin: "Further Corporate", // 👈 aquí definís el origen
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Mail send failed");
    }

    setStatus({ state: "ok", error: "" });
    setForm({ name: "", email: "", phone: "", message: "" });
  } catch (err) {
    console.error("❌ Error sending contact:", err);
    setStatus({
      state: "error",
      error: forms.error || "Something went wrong. Please try again.",
    });
  }
};


  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
      </Head>

      <MotionConfig reducedMotion="user">
        <main className={`min-h-screen relative overflow-hidden`}>
          <FloatingOrbs />
          <GridPattern />

          {/* HERO */}
          <HeroCorporate />
        
        {/* STATS */}
          <StatsCorporate />
                

        {/* EMPRESAS CARROUSEL */}

          {/* SERVICES */}
          <section id="servicios" className="relative py-24">
            <div className={SHELL}>
              <motion.div
                variants={itemFade}
                initial="hidden"
                animate="show"
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className={`${TITLE} text-4xl sm:text-5xl lg:text-6xl`}>
  {tCorp.sections?.servicesTitle?.prefix}{" "}
  <span className={GRAD_TEXT}>{tCorp.sections?.servicesTitle?.highlight}</span>
</h2>

              </motion.div>

              <motion.div
                className="grid gap-8 md:grid-cols-3"
                variants={containerStagger}
                initial="hidden"
                animate="show"
                viewport={{ once: true, amount: 0.2 }}
              >
                {services.map((svc) => (
                  <motion.article
                    key={svc.title}
                    variants={itemScale}
                    className={`${CARD} ${CARD_HOVER} p-8 group overflow-hidden`}
                    whileHover={{ y: -10, rotateX: 0.0001 }}
                  >
                    <div
                      className={`absolute inset-0 ${GRAD_SUBTLE} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                    />
                    <div className="relative">
                      <motion.div
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6 ring-1 ring-white/10 group-hover:ring-white/30 group-hover:scale-110 transition-all duration-500"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {svc.icon}
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#EE7203] group-hover:to-[#FF3816] transition-all duration-300">
                        {svc.title}
                      </h3>
                      <p className={`${TEXT} text-base`}>{svc.body}</p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
            
          </section>
          <Ecosistema />

          {/* LANGUAGES + CEFR */}
          <section
            className={`${BG_ALT} backdrop-blur-xl border-y border-white/10 py-24`}
          >
            <div className={SHELL}>
              <div className="grid gap-12 lg:grid-cols-2">
                <motion.div
                  variants={itemFade}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <h2 className={`${TITLE} text-3xl sm:text-4xl mb-6`}>
  {tCorp.sections?.languagesTitle?.prefix}{" "}
  <span className={GRAD_TEXT}>{tCorp.sections?.languagesTitle?.highlight}</span>
</h2>

                  <div className="flex flex-wrap gap-3">
                    {languages.map((l, i) => (
                      <motion.span
                        key={l}
                        className="px-5 py-2.5 rounded-2xl border border-white/15 bg-white/5 text-white font-medium hover:border-white/30 hover:bg-white/10 transition-all cursor-default"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                      >
                        {l}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  className={`${CARD} ${CARD_HOVER} p-8`}
                  variants={itemScale}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-2xl font-bold mb-4">{cefr.title}</h3>
                  <p className={`${SUB} mb-3`}>{cefr.p1}</p>
                  <p className={`${SUB} mb-6`}>{cefr.p2}</p>
                  <ul className="space-y-2 mb-6">
                    {cefr.bullets.map((b, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#EE7203] to-[#FF3816]" />
                        <span className={TEXT}>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.a
                    href={cefr.blogHref}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#EE7203] to-[#FF3816] hover:gap-3 transition-all"
                    whileHover={{ x: 4 }}
                  >
                    {cefr.blogLabel} <span>↗</span>
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </section>

          {/* TESTIMONIALS */}
          {testimonials.length > 0 && (
            <section className="relative py-24">
              <div className={SHELL}>
               <motion.h2
  className={`${TITLE} text-4xl sm:text-5xl text-center mb-16`}
>
  {tCorp.sections?.testimonialsTitle?.prefix}{" "}
  <span className={GRAD_TEXT}>{tCorp.sections?.testimonialsTitle?.highlight}</span>
</motion.h2>


                <motion.div
                  className="grid gap-8 md:grid-cols-2"
                  variants={containerStagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {testimonials.map((t, i) => (
                    <motion.blockquote
                      key={i}
                      variants={itemScale}
                      className={`${CARD} ${CARD_HOVER} p-8 relative group`}
                      whileHover={{ y: -6 }}
                    >
                      <div className="absolute -top-2 left-8 h-1 w-20 bg-gradient-to-r from-[#EE7203] to-[#FF3816] rounded-full" />
                      <p
                        className={`${TEXT} text-lg leading-relaxed italic mb-6`}
                      >
                        "{t?.quote}"
                      </p>
                      <footer className="border-t border-white/10 pt-4">
                        {t?.name && (
                          <div className="font-bold text-white text-lg">
                            {t.name}
                          </div>
                        )}
                        {t?.role && (
                          <div className="text-sm text-white/60 mt-1">
                            {t.role}
                          </div>
                        )}
                      </footer>
                    </motion.blockquote>
                  ))}
                </motion.div>
              </div>
            </section>
          )}

          {/* CONTACT */}
          <section
            id="contacto"
            className={`${BG_ALT} backdrop-blur-xl border-t border-white/10 py-24`}
          >
            <div className={SHELL}>
              <motion.div
                variants={itemFade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
              >
               <h2 className={`${TITLE} text-4xl sm:text-5xl text-center mb-4`}>
  {tCorp.form.title}
</h2>
                <p className={`${SUB} text-center mb-12`}>{tCorp.form.subtitle}</p>

                <motion.form
                  onSubmit={onSubmit}
                  noValidate
                  className={`${CARD} ${CARD_HOVER} p-8 space-y-6`}
                  variants={itemScale}
                >
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-white/80"
                      >
                        {tCorp.form.fields.name.label}
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={onChange}
                        className="w-full rounded-xl bg-white/10 border border-white/10 text-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF3816]/60 focus:border-white/30 transition-all"
                        placeholder={tCorp.form.fields.name.placeholder}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-white/80"
                      >
                        {tCorp.form.fields.email.label}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        className="w-full rounded-xl bg-white/10 border border-white/10 text-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF3816]/60 focus:border-white/30 transition-all"
                        placeholder={tCorp.form.fields.email.placeholder}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-white/80"
                    >
                      {tCorp.form.fields.phone.label}
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={onChange}
                      className="w-full rounded-xl bg-white/10 border border-white/10 text-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF3816]/60 focus:border-white/30 transition-all"
                      placeholder={tCorp.form.fields.phone.placeholder}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium text-white/80"
                      >
                        {tCorp.form.fields.message.label}
                      </label>
                      <span
                        className="text-xs text-white/50"
                        aria-live="polite"
                      >
                        {form.message.length} / 500
                      </span>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      maxLength={500}
                      value={form.message}
                      onChange={onChange}
                      className="w-full rounded-xl bg-white/10 border border-white/10 text-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#FF3816]/60 focus:border-white/30 transition-all resize-none"
                      placeholder={tCorp.form.fields.message.placeholder}
                      required
                    />
                  </div>

                  {status.state === "error" && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2"
                    >
                      {status.error}
                    </motion.p>
                  )}
                  {status.state === "ok" && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="status"
                      className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2"
                    >
                      {forms.thanks}
                    </motion.p>
                  )}

                  <motion.button
                    type="submit"
                    className={`${LINK} ${GRAD} text-white font-semibold shadow-2xl shadow-orange-500/30 w-full justify-center text-lg`}
                    disabled={status.state === "sending"}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {status.state === "sending" ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          ◌
                        </motion.span>
                        {forms.sending}
                      </>
                    ) : (
                      <>
                        {forms.ctaSend}
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </>
                    )}
                  </motion.button>
                </motion.form>
              </motion.div>
            </div>
          </section>

          {/* FOOTER CTA */}
          <section className="relative py-20">
            <div className={SHELL}>
              <motion.div
                className={`${CARD} ${GRAD} p-12 text-center overflow-hidden relative`}
                variants={itemScale}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                
                <div className="relative z-10">
                    <h2 className={`${TITLE} text-3xl sm:text-4xl mb-4`}>
  {t("corporate.followTitle", "Follow Us on LinkedIn")}
</h2>
<p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
  {t(
    "corporate.followText",
    "Stay up to date with insights, success stories, and corporate language strategies."
  )}
</p>


  <motion.a
    href="https://www.linkedin.com/company/furthercorporate/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-[#0C212D] font-bold text-lg hover:bg-white/90 transition-all shadow-xl"
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.98 }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-[#0A66C2]"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.286c-.966 0-1.75-.784-1.75-1.75S5.534 5.214 6.5 5.214 8.25 6 8.25 6.964s-.784 1.75-1.75 1.75zM20 19h-3v-4.604c0-1.097-.021-2.507-1.528-2.507-1.531 0-1.767 1.195-1.767 2.427V19h-3v-9h2.885v1.23h.041c.403-.763 1.387-1.567 2.853-1.567 3.05 0 3.616 2.007 3.616 4.617V19z" />
    </svg>
    Follow on LinkedIn
    <motion.span
      animate={{ x: [0, 4, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      →
    </motion.span>
  </motion.a>
</div>

              </motion.div>
            </div>
          </section>
        </main>
      </MotionConfig>
    </>
  );
}

/* ==============================
   i18n (Pages Router)
   ============================== */
export async function getStaticProps({ locale }) {
  let messages = null;
  try {
    messages = await loadMessages(locale);
  } catch (e) {}
  if (!messages && locale !== "es") {
    messages = await loadMessages("es");
  }
  return { props: { messages } };
}
