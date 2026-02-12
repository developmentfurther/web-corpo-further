// /pages/contacto.jsx
import React, { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { loadMessages } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion"; // <--- IMPORTANTE

/* ===== Tokens coherentes ===== */
const BG_DARK = "bg-[#0C212D] text-white";
const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

/* Gradiente naranja→rojo */
const ACCENT = "from-[#EE7203] via-[#FF5A2B] to-[#FF3816]";
const GRAD = `bg-gradient-to-tr ${ACCENT}`;
const GRAD_TEXT = `bg-gradient-to-tr ${ACCENT} bg-clip-text text-transparent`;

/* Cards */
const CARD_GLASS =
  "rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.35)]";
const CARD_DARK =
  "rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm shadow-lg shadow-black/20";
const CARD_LIGHT = "rounded-[2rem] border border-gray-200 bg-white shadow-sm";

/* Ondas invertidas */
function WaveDivider({
  from = "dark",
  flip = false,
  height = 72,
  className = "",
}) {
  const fill = from === "dark" ? "#FFFFFF" : "#0C212D";
  return (
    <div
      aria-hidden
      className={className}
      style={{ transform: flip ? "scaleY(-1)" : "none" }}
    >
      <svg
        role="presentation"
        focusable="false"
        width="100%"
        height={height}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="block w-full"
      >
        <path
          d="M0 0v48c55 18 122 22 188 8 96-20 156-51 230-51 75 0 139 33 213 49 74 16 145 12 219-7 74-19 148-61 222-38 74 23 148 103 228 111V0H0Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

function toContactJsonLd({
  brand = "Further Corporate",
  url = "https://your-domain.com/contacto",
  telephone,
  email,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
      "@type": "Organization",
      name: brand,
      url,
      ...(telephone ? { telephone } : {}),
      ...(email ? { email } : {}),
    },
  };
}

export default function ContactPage({ messages }) {
  // i18n
  const t = messages?.contact || {};
  const common = messages?.common || {};
  const tForm = messages?.sidebarContact || {};
  const tRoot = messages ?? {};

  // SEO
  const metaTitle = t?.meta?.title || "Contacto | Further Corporate";
  const metaDesc =
    t?.meta?.description ||
    "Contactanos para programas corporativos de idiomas y consultoría.";
  const canonical = t?.meta?.canonical || "https://your-domain.com/contacto";

  const jsonLd = useMemo(
    () =>
      JSON.stringify(
        toContactJsonLd({
          brand: messages?.common?.brand,
          url: canonical,
          telephone: t?.company?.phone,
          email: t?.company?.email,
        })
      ),
    [messages, canonical, t]
  );

  // Form state
  const [formType, setFormType] = useState("empresas"); // <--- NUEVO ESTADO
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "", // <--- Asegúrate de tener phone aquí
    message: "",
    accept: false,
  });
  const [status, setStatus] = useState({ state: "idle", error: "" });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

  const invalidEmailMsg =
    common?.forms?.invalidEmail || "Please enter a valid email address.";
  const sendingMsg = common?.forms?.sending || "Sending...";
  const thanksMsg =
    common?.forms?.thanks || "Thanks! Please check your inbox to confirm.";
  const errorMsg =
    common?.forms?.error || "Something went wrong. Please try again.";

  function onChange(e) {
    const { name, type, value, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name?.trim())
      return setStatus({
        state: "error",
        error: t?.errors?.name || "Please enter your name.",
      });
    if (!emailRegex.test(form.email || ""))
      return setStatus({ state: "error", error: invalidEmailMsg });
    if (!form.message?.trim())
      return setStatus({
        state: "error",
        error: t?.errors?.message || "Please write a short message.",
      });
    if (t?.consent?.required && !form.accept)
      return setStatus({
        state: "error",
        error: t?.errors?.consent || "Please accept the privacy policy.",
      });

    try {
      setStatus({ state: "sending", error: "" });
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          formType, // <--- Enviamos el tipo
          locale: t?.locale,
          origin: formType === "empresas" ? "Contact Page: Formulario Empresas" : "Contact Page: Formulario Particulares",
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus({ state: "success", error: "" });
      setForm({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: "",
        accept: false,
      });
    } catch {
      setStatus({ state: "error", error: errorMsg });
    }
  }

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </Head>

      <a
        href="#contact-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:text-[#0C212D] focus:bg-white"
      >
        {t?.a11y?.skip || "Skip to content"}
      </a>

      <main className={`${BG_DARK} min-h-screen`} id="top">
        {/* === HERO === */}
        <section className="relative z-10" aria-labelledby="contact-hero-title">
          <div className="pointer-events-none" aria-hidden>
            
            
          </div>

          <div className={`${SHELL} pt-28 pb-16 lg:pt-36 lg:pb-24`}>
            <div className={`${CARD_GLASS} p-6 lg:p-8`}>
              {/* ... Breadcrumb & Header ... */}
              <nav aria-label="Breadcrumb" className="text-sm text-white/70">
                <ol className="flex items-center gap-2">
                  <li>
                    <Link href="/" className="hover:text-white underline-offset-4 hover:underline">
                      {t?.breadcrumb?.home || "Home"}
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-white">{t?.breadcrumb?.contact || "Contact"}</li>
                </ol>
              </nav>

              <header className="mt-4">
                <h1
                  id="contact-hero-title"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]"
                >
                  <span className="block mb-2">
                    {t?.hero?.title || "Contact our team"}
                  </span>
                  <span className={GRAD_TEXT}>
                    {t?.hero?.subtitle || "Let’s build your language program"}
                  </span>
                </h1>
                <p className="mt-4 text-white/80 max-w-2xl">
                  {t?.hero?.body || "Tell us about your team, goals and timeframe..."}
                </p>
              </header>
            </div>
          </div>
          <WaveDivider from="dark" height={80} flip />
        </section>

       {/* === MAIN CONTENT === */}
<section
  id="contact-main"
  className="bg-[#f8fafc] text-[#0C212D]"
  aria-labelledby="contact-form-title"
>
  <div className={`${SHELL} py-16 lg:py-24`}>
    <div className="grid gap-12 lg:gap-16 lg:grid-cols-12 items-start">
      
      {/* ================= FORMULARIO ================= */}
      <div className="lg:col-span-7">
        <form
          onSubmit={onSubmit}
          noValidate
          className="bg-white rounded-[2.5rem] shadow-xl shadow-[#0C212D]/5 border border-[#0C212D]/5 p-8 sm:p-12 relative overflow-hidden"
          aria-describedby="form-status"
        >
          {/* Deco de fondo sutil en el form */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#EE7203]/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          {/* === TOGGLE LIGHT THEME === */}
          <div className="mb-10 relative z-10">
            <div className="flex items-center justify-center gap-1.5 p-1.5 bg-[#f8fafc] rounded-2xl border border-[#0C212D]/5 max-w-md mx-auto relative isolate">
              {["empresas", "particulares"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormType(type)}
                  className={`relative flex-1 py-3 px-6 rounded-[0.85rem] text-[0.95rem] font-bold transition-all duration-300 z-10 tracking-wide ${
                    formType === type
                      ? "text-white shadow-sm"
                      : "text-[#112C3E]/60 hover:text-[#0C212D] hover:bg-white/50"
                  }`}
                >
                  {/* Fondo animado */}
                  {formType === type && (
                    <motion.div
                      layoutId="activeTabBgLight"
                      className="absolute inset-0 bg-gradient-to-r from-[#EE7203] to-[#FF3816] rounded-[0.85rem] shadow-md shadow-[#EE7203]/20 -z-10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  {/* Labels usando i18n o fallback */}
                  {common?.forms?.contactTitles?.[type] || 
                   (type === "empresas" ? "Empresas" : "Particulares")}
                </button>
              ))}
            </div>
          </div>

          <h2
            id="contact-form-title"
            className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-[#0C212D] relative z-10"
          >
            {/* Título dinámico */}
            {common?.forms?.contactTitles?.[formType] || 
             (formType === 'empresas' ? "Contacto Empresas" : "Contacto Particulares")}
          </h2>

          <div id="form-status" aria-live="polite" className="sr-only">
            {status.state === "sending"
              ? sendingMsg
              : status.state === "success"
              ? thanksMsg
              : status.error}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold text-[#112C3E] mb-2 uppercase tracking-wider"
              >
                {t?.form?.fields?.name?.label || "Nombre completo"}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={onChange}
                placeholder={t?.form?.fields?.name?.placeholder || "Tu nombre"}
                className="w-full rounded-2xl bg-[#f8fafc] border border-transparent px-5 py-4 outline-none focus:bg-white focus:ring-2 focus:ring-[#EE7203]/20 focus:border-[#EE7203] hover:border-[#0C212D]/10 transition-all font-medium text-[#0C212D] placeholder:text-[#112C3E]/40"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-[#112C3E] mb-2 uppercase tracking-wider"
              >
                {t?.form?.fields?.email?.label || "Email"}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={onChange}
                placeholder={common?.forms?.emailPlaceholder || "hola@correo.com"}
                className="w-full rounded-2xl bg-[#f8fafc] border border-transparent px-5 py-4 outline-none focus:bg-white focus:ring-2 focus:ring-[#EE7203]/20 focus:border-[#EE7203] hover:border-[#0C212D]/10 transition-all font-medium text-[#0C212D] placeholder:text-[#112C3E]/40"
              />
            </div>

            {/* === INPUT DINÁMICO (Empresa / Teléfono) === */}
            <div className="md:col-span-2 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={formType}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {formType === "empresas" ? (
                    <div className="pt-1">
                      <label
                        htmlFor="company"
                        className="block text-sm font-bold text-[#112C3E] mb-2 uppercase tracking-wider"
                      >
                        {t?.form?.fields?.company?.label || "Empresa"}
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={form.company}
                        onChange={onChange}
                        placeholder={t?.form?.fields?.company?.placeholder || "Nombre de tu empresa"}
                        className="w-full rounded-2xl bg-[#f8fafc] border border-transparent px-5 py-4 outline-none focus:bg-white focus:ring-2 focus:ring-[#EE7203]/20 focus:border-[#EE7203] hover:border-[#0C212D]/10 transition-all font-medium text-[#0C212D] placeholder:text-[#112C3E]/40"
                      />
                    </div>
                  ) : (
                    <div className="pt-1">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-bold text-[#112C3E] mb-2 uppercase tracking-wider"
                      >
                        {common?.forms?.phone || "Teléfono"}
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={onChange}
                        placeholder="+54 11 1234 5678"
                        className="w-full rounded-2xl bg-[#f8fafc] border border-transparent px-5 py-4 outline-none focus:bg-white focus:ring-2 focus:ring-[#EE7203]/20 focus:border-[#EE7203] hover:border-[#0C212D]/10 transition-all font-medium text-[#0C212D] placeholder:text-[#112C3E]/40"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Message */}
<div className="md:col-span-2">
  <label
    htmlFor="message"
    className="block text-sm font-bold text-[#112C3E] mb-2 uppercase tracking-wider"
  >
    {t?.form?.fields?.message?.label || "Mensaje"}
  </label>
  <textarea
    id="message"
    name="message"
    required
    rows={5}
    value={form.message}
    onChange={onChange}
    placeholder={
      formType === "empresas"
        ? t?.form?.fields?.message?.placeholder || "Conte-nos seus objetivos, o tamanho da equipe..."
        : tRoot?.formPlaceholders?.message || "¿En qué podemos ayudarte?"
    }
    className="w-full rounded-2xl bg-[#f8fafc] border border-transparent px-5 py-4 outline-none focus:bg-white focus:ring-2 focus:ring-[#EE7203]/20 focus:border-[#EE7203] hover:border-[#0C212D]/10 resize-y transition-all font-medium text-[#0C212D] placeholder:text-[#112C3E]/40"
  />
</div>

            {/* Consent */}
            <div className="md:col-span-2 flex items-start gap-4 p-4 rounded-xl bg-[#f8fafc] border border-[#0C212D]/5">
              <div className="relative flex items-start pt-1">
                 <input
                  id="accept"
                  name="accept"
                  type="checkbox"
                  checked={form.accept}
                  onChange={onChange}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-[#112C3E]/20 bg-white checked:border-[#EE7203] checked:bg-[#EE7203] focus:outline-none focus:ring-2 focus:ring-[#EE7203]/20 focus:ring-offset-1 transition-all"
                />
                {/* Custom Checkmark */}
                <svg className="absolute top-[6px] left-[3px] w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <label htmlFor="accept" className="text-sm font-medium text-[#112C3E]/80 cursor-pointer leading-relaxed">
                <span
                  dangerouslySetInnerHTML={{
                    __html: t?.consent?.label || "Acepto los términos y condiciones.",
                  }}
                />
              </label>
            </div>
          </div>

          {/* Mensajes de Estado y Botones */}
          <div className="mt-8 relative z-10">
            
            {/* Animación del mensaje de éxito/error */}
            <AnimatePresence mode="wait">
              {status.state !== "idle" && status.state !== "sending" && (
                <motion.div
                  key={status.state}
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 overflow-hidden"
                >
                  <div 
                    className={`flex items-start gap-3 p-4 rounded-xl text-sm font-medium ${
                      status.state === "success" 
                        ? "bg-green-50 text-green-800 border border-green-200" 
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {status.state === "success" ? (
                      <svg className="w-5 h-5 flex-shrink-0 text-green-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <p className="leading-relaxed">
                      {status.state === "success" ? thanksMsg : status.error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={status.state === "sending" || status.state === "success"}
                className="relative w-full sm:w-auto inline-flex items-center justify-center rounded-2xl px-8 py-4 font-bold text-white bg-[#0C212D] hover:bg-[#112C3E] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0C212D]/50 disabled:opacity-70 shadow-lg shadow-[#0C212D]/20"
              >
                {status.state === "sending" ? (
                  <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {sendingMsg || "Enviando..."}
                  </span>
                ) : status.state === "success" ? (
                   <span className="flex items-center gap-2">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                     {t?.form?.ctaSuccess || "Enviado"}
                   </span>
                ) : (
                  t?.form?.cta || common?.cta?.send || "Enviar mensaje"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

     
      {/* ================= SIDEBAR ================= */}
<aside className="lg:col-span-5 h-full">
  <div className="bg-[#0C212D] text-white rounded-[2.5rem] p-8 sm:p-10 lg:p-12 shadow-2xl h-full flex flex-col justify-center relative overflow-hidden">
      
      {/* Deco de fondo en la sidebar */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#112C3E] to-transparent opacity-50 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#EE7203] rounded-full blur-[100px] opacity-20 pointer-events-none" />

      <div className="relative z-10">
        <h3 className="text-3xl font-extrabold mb-8 tracking-tight">
          {tForm?.title || "Información de contacto"}
        </h3>

        <div className="space-y-8">
          
          {/* Bloque: Emails */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#EE7203] mb-4">
              {tForm?.directEmails || "Emails Directos"}
            </h4>
            <ul className="space-y-4">
              {/* Email Empresa */}
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 p-2 rounded-xl bg-white/5 text-[#EE7203]">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                   </svg>
                </div>
                <div>
                  <p className="font-semibold text-white/90">
                    {tForm?.companyLabel || "Empresa:"}
                  </p>
                  <a href="mailto:incompany@furthercorporate.com" className="text-white/70 hover:text-white transition-colors break-all">
                    incompany@furthercorporate.com
                  </a>
                </div>
              </li>
              {/* Email Particular */}
              <li className="flex items-start gap-4">
                 <div className="flex-shrink-0 mt-1 p-2 rounded-xl bg-white/5 text-[#EE7203]">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                   </svg>
                </div>
                <div>
                  <p className="font-semibold text-white/90">
                    {tForm?.individualLabel || "Particular:"}
                  </p>
                  <a href="mailto:info@furthercorporate.com" className="text-white/70 hover:text-white transition-colors break-all">
                    info@furthercorporate.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className="w-full h-px bg-white/10" />

          {/* Bloque: Ubicaciones */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#EE7203] mb-4">
              {tForm?.ourLocations || "Nuestras Sedes"}
            </h4>
            <ul className="space-y-5">
              
              {/* Sede 1 */}
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 p-2 rounded-xl bg-white/5 text-[#EE7203]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white/90">Parque Patricios</p>
                  <p className="text-white/70 mt-0.5 mb-2">La Rioja 1775</p>
                  <a 
                    href="https://www.google.com/maps/place/La+Rioja+1775,+C1258+Cdad.+Aut%C3%B3noma+de+Buenos+Aires/@-34.6314924,-58.4063556,17z/data=!3m1!4b1!4m6!3m5!1s0x95bccb04d199c947:0xe891bed4a99cdea2!8m2!3d-34.6314924!4d-58.4063556!16s%2Fg%2F11wpmjgc1f?entry=ttu&g_ep=EgoyMDI2MDIwOC4wIKXMDSoASAFQAw%3D%3D" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EE7203] hover:text-white transition-colors bg-[#EE7203]/10 hover:bg-[#EE7203]/20 px-3 py-1.5 rounded-lg"
                  >
                    {tForm?.viewOnMap || "Ver en Google Maps"}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              </li>

              {/* Sede 2 */}
              <li className="flex items-start gap-4">
                 <div className="flex-shrink-0 mt-1 p-2 rounded-xl bg-white/5 text-[#EE7203]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white/90">Saavedra</p>
                  <p className="text-white/70 mt-0.5 mb-2">Av. García del Río 2866</p>
                  <a 
                    href="https://www.google.com/maps/place/Av.+Garc%C3%ADa+del+R%C3%ADo+2866,+C1429+Cdad.+Aut%C3%B3noma+de+Buenos+Aires/@-34.5496765,-58.4736713,17z/data=!4m6!3m5!1s0x95bcb69a1aba414b:0x4011d9d39d68d2cc!8m2!3d-34.5496765!4d-58.4736713!16s%2Fg%2F11rb4rxh4t?entry=ttu&g_ep=EgoyMDI2MDIwOC4wIKXMDSoASAFQAw%3D%3D" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EE7203] hover:text-white transition-colors bg-[#EE7203]/10 hover:bg-[#EE7203]/20 px-3 py-1.5 rounded-lg"
                  >
                    {tForm?.viewOnMap || "Ver en Google Maps"}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              </li>

            </ul>
          </div>

        </div>
      </div>
  </div>
</aside>

    </div>
  </div>
</section>

       
      </main>
    </>
  );
}

export async function getStaticProps({ locale }) {
  return { props: { messages: await loadMessages(locale) } };
}