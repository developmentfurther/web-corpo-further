// /pages/contacto.jsx
// Contact — Next.js Pages Router + Tailwind + i18n (messages.contact) + SEO + JSON-LD
// Estilo alineado a /further-school, /further-media y /faq: hero dark (glass), ondas invertidas, sección central blanca, CTA dark.

import React, { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { loadMessages } from "@/lib/i18n";

/* ===== Tokens coherentes ===== */
const BG_DARK = "bg-[#0C212D] text-white";
const BG_ALT = "bg-[#112C3E] text-white";
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

/* Ondas invertidas (1 path optimizado) */
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

/* JSON-LD helper */
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

  // SEO
  const metaTitle = t?.meta?.title || "Contacto | Further Corporate";
  const metaDesc =
    t?.meta?.description ||
    "Contactanos para programas corporativos de idiomas y consultoría.";
  const canonical = t?.meta?.canonical || "https://your-domain.com/contacto";

  // JSON-LD
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    origin: "",
    accept: false,
  });
  const [status, setStatus] = useState({ state: "idle", error: "" }); // idle | sending | success | error
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
    // Validaciones accesibles
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
        body: JSON.stringify({ ...form, locale: t?.locale, origin: "Further Contact"}),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus({ state: "success", error: "" });
      setForm({ name: "", email: "", company: "", origin: "", message: "", accept: false });
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

      {/* Skip link */}
      <a
        href="#contact-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:text-[#0C212D] focus:bg-white"
      >
        {t?.a11y?.skip || "Skip to content"}
      </a>

      {/* ===== Layout alternado: dark → light → dark con ondas ===== */}
      <main className={`${BG_DARK} min-h-screen`} id="top">
        {/* === HERO (dark + glass + breadcrumb) === */}
        <section className="relative z-10" aria-labelledby="contact-hero-title">
          {/* orbs sutiles */}
          <div className="pointer-events-none" aria-hidden>
            <div className="absolute -top-28 -right-24 h-72 w-72 rounded-full bg-[#EE7203]/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#FF3816]/20 blur-3xl" />
          </div>

          <div className={`${SHELL} pt-28 pb-16 lg:pt-36 lg:pb-24`}>
            <div className={`${CARD_GLASS} p-6 lg:p-8`}>
              <nav aria-label="Breadcrumb" className="text-sm text-white/70">
                <ol className="flex items-center gap-2">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
                    >
                      {t?.breadcrumb?.home || "Home"}
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-white">
                    {t?.breadcrumb?.contact || "Contact"}
                  </li>
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
                  {t?.hero?.body ||
                    "Tell us about your team, goals and timeframe. We’ll get back within one business day."}
                </p>
              </header>
            </div>
          </div>

          {/* Onda bajando a la sección blanca */}
          <WaveDivider from="dark" height={80} flip />
        </section>

        {/* === CONTENIDO (blanco): Form + Sidebar === */}
        <section
          id="contact-main"
          className="bg-white text-gray-900"
          aria-labelledby="contact-form-title"
        >
          <div className={`${SHELL} py-12`}>
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Formulario (card blanca) */}
              <div className="lg:col-span-7">
                <form
                  onSubmit={onSubmit}
                  noValidate
                  className={`${CARD_LIGHT} p-6 md:p-8`}
                  aria-describedby="form-status"
                >
                  <h2
                    id="contact-form-title"
                    className="text-2xl font-bold mb-6"
                  >
                    {t?.form?.title || "Send us a message"}
                  </h2>

                  {/* estado accesible */}
                  <div id="form-status" aria-live="polite" className="sr-only">
                    {status.state === "sending"
                      ? sendingMsg
                      : status.state === "success"
                      ? thanksMsg
                      : status.error}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold mb-1"
                      >
                        {t?.form?.fields?.name?.label || "Full name"}
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={onChange}
                        placeholder={
                          t?.form?.fields?.name?.placeholder || "Jane Doe"
                        }
                        className="w-full rounded-xl bg-white border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
                        aria-invalid={
                          status.state === "error" && !form.name
                            ? "true"
                            : "false"
                        }
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold mb-1"
                      >
                        {t?.form?.fields?.email?.label || "Work email"}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={onChange}
                        placeholder={
                          common?.forms?.emailPlaceholder || "you@company.com"
                        }
                        className="w-full rounded-xl bg-white border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
                        aria-invalid={
                          status.state === "error" &&
                          !emailRegex.test(form.email)
                            ? "true"
                            : "false"
                        }
                      />
                    </div>

                    {/* Empresa */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="company"
                        className="block text-sm font-semibold mb-1"
                      >
                        {t?.form?.fields?.company?.label ||
                          "Company (optional)"}
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={form.company}
                        onChange={onChange}
                        placeholder={
                          t?.form?.fields?.company?.placeholder || "ACME Inc."
                        }
                        className="w-full rounded-xl bg-white border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
                      />
                    </div>

                    {/* Mensaje */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold mb-1"
                      >
                        {t?.form?.fields?.message?.label || "Message"}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={form.message}
                        onChange={onChange}
                        placeholder={
                          t?.form?.fields?.message?.placeholder ||
                          "Tell us about your goals, team size and timeline..."
                        }
                        className="w-full rounded-xl bg-white border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300 resize-y"
                        aria-invalid={
                          status.state === "error" && !form.message
                            ? "true"
                            : "false"
                        }
                      />
                    </div>

                    {/* Consentimiento */}
                    <div className="md:col-span-2 flex items-start gap-3">
                      <input
                        id="accept"
                        name="accept"
                        type="checkbox"
                        checked={form.accept}
                        onChange={onChange}
                        className="mt-1 h-5 w-5 rounded border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-gray-300"
                        aria-describedby="consent-desc"
                      />
                      <label htmlFor="accept" className="text-sm">
                        <span
                          dangerouslySetInnerHTML={{
                            __html:
                              t?.consent?.label ||
                              "I agree to the <a href='/privacy'>privacy policy</a>.",
                          }}
                        />
                      </label>
                    </div>
                    <p
                      id="consent-desc"
                      className="md:col-span-2 text-xs text-gray-600"
                    >
                      {t?.consent?.help ||
                        "We will only use your data to contact you about this request."}
                    </p>
                  </div>

                  {/* Mensajes visibles */}
                  {status.state === "error" && (
                    <div
                      role="alert"
                      className="mt-4 rounded-lg border border-red-500/30 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {status.error}
                    </div>
                  )}
                  {status.state === "success" && (
                    <div
                      role="status"
                      className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                    >
                      {thanksMsg}
                    </div>
                  )}

                  {/* Botones */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={status.state === "sending"}
                      className="relative inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold text-white bg-[#0C212D] hover:bg-[#0C212D]/90 transition outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:opacity-70"
                    >
                      {status.state === "sending"
                        ? sendingMsg
                        : t?.form?.cta || common?.cta?.send || "Send"}
                    </button>
                    <Link
                      href="/"
                      className="inline-flex items-center rounded-xl px-5 py-3 font-semibold text-gray-900 border border-gray-200 bg-white hover:bg-gray-50 transition outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                    >
                      {t?.form?.secondary || "Back to Home"}
                    </Link>
                  </div>
                </form>
              </div>

              {/* Sidebar (cards dark) */}
              <aside className="lg:col-span-5 space-y-6">
                <div className={`${CARD_DARK} p-6`}>
                  <h2 className="text-base font-bold mb-2">
                    {t?.sidebar?.title || "Contact information"}
                  </h2>
                  <p className="text-white/80">
                    {t?.sidebar?.body ||
                      "Prefer direct contact? Here are our details."}
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    {t?.company?.email && (
                      <p>
                        <span className="text-white/60">Email:</span>{" "}
                        <a
                          className="underline hover:text-white"
                          href={`mailto:${t.company.email}`}
                        >
                          {t.company.email}
                        </a>
                      </p>
                    )}
                    {t?.company?.phone && (
                      <p>
                        <span className="text-white/60">Phone:</span>{" "}
                        <a
                          className="underline hover:text-white"
                          href={`tel:${t.company.phone.replace(/\s+/g, "")}`}
                        >
                          {t.company.phone}
                        </a>
                      </p>
                    )}
                    {t?.company?.address && (
                      <p className="text-white/80">{t.company.address}</p>
                    )}
                  </div>
                </div>

                <div className={`${CARD_DARK} p-6 relative overflow-hidden`}>
                  <div
                    className={`absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl opacity-30 ${GRAD}`}
                    aria-hidden
                  />
                  <h3 className="text-lg font-bold">
                    {t?.cta?.title || "Ready to get started?"}
                  </h3>
                  <p className="text-white/80 mt-1">
                    {t?.cta?.body ||
                      "Schedule a quick call and we’ll design your program."}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={t?.cta?.href || "/"}
                      className="inline-flex items-center rounded-xl px-5 py-3 font-semibold text-[#0C212D] bg-white hover:bg-white/90 transition outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      {t?.cta?.label ||
                        common?.buttons?.scheduleCall ||
                        "Schedule Call"}
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {/* Onda subiendo a CTA dark */}
          <WaveDivider from="light" height={66} flip />
        </section>

        {/* === CTA final (dark alt) === */}
        <section className={`${BG_DARK}`} aria-labelledby="contact-cta-title">
          <div className={`${SHELL} py-16`}>
            <div
              className={`${CARD_DARK} p-8 md:p-10 relative overflow-hidden`}
            >
              <div
                aria-hidden
                className={`absolute -right-10 -top-10 h-60 w-60 rounded-full blur-3xl opacity-30 ${GRAD}`}
              />
              <div className="relative">
                <h3
                  id="contact-cta-title"
                  className="text-3xl sm:text-4xl font-bold"
                >
                  <span className={GRAD_TEXT}>
                    {t?.ctaFinal?.title || "Let’s talk"}
                  </span>
                </h3>
                <p className="mt-2 text-white/80 max-w-2xl">
                  {t?.ctaFinal?.body ||
                    "Tell us about your goals. We’ll tailor a solution."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={`mailto:${
                      t?.company?.email || "hello@your-domain.com"
                    }`}
                    className="inline-flex items-center rounded-xl px-5 py-3 font-semibold text-[#0C212D] bg-white hover:bg-white/90 transition outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    {t?.ctaFinal?.primary || "Email us"}
                  </a>
                  <Link
                    href="/further-media#podcast"
                    className="inline-flex items-center rounded-xl px-5 py-3 font-semibold text-white border border-white/15 hover:bg-white/5 transition outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    {t?.ctaFinal?.secondary || "Explore our media"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

/* i18n loader */
export async function getStaticProps({ locale }) {
  return { props: { messages: await loadMessages(locale) } };
}
