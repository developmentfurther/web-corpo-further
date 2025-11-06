// src/componentes/ui/Footer.jsx
// Footer accesible, performante y con estética dark + gradiente naranja→rojo.

import React, { useContext, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiSend,
  FiArrowRight,
} from "react-icons/fi";
import { useTranslations } from "next-intl";
import ContextGeneral from "@/services/contextGeneral";

/* ----------------- Design tokens ----------------- */
const ACCENT_GRAD = "bg-gradient-to-tr from-[#EE7203] to-[#FF3816]";
const SHELL = "max-w-7xl mx-auto px-6";

/* ----------------- Default content (override via props) ----------------- */
const defaultNav = {
  services: [
    { label: "Corporate Training", href: "/services/corporate" },
    { label: "Exam Preparation", href: "/services/exams" },
    { label: "Workshops & Talks", href: "/services/workshops" },
    { label: "Custom Programs", href: "/services/custom" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Work / Case Studies", href: "/work" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Press Kit", href: "/press" },
    { label: "FAQ", href: "/faq" },
    { label: "Help Center", href: "/help" },
  ],
};

const defaultSocial = [
  { label: "LinkedIn", href: "https://ar.linkedin.com/company/furthercorporate", icon: FiLinkedin },
  { label: "Instagram", href: "https://www.instagram.com/furthercorporate/", icon: FiInstagram },
  { label: "YouTube", href: "https://www.youtube.com/@furthercorporate", icon: FiYoutube },
];

/* ----------------- Footer component ----------------- */
export default function Footer({
  companyName, // si no llega, tomamos common.brand
  nav = defaultNav,
  social = defaultSocial,
  onSubscribe, // opcional: (email) => Promise|void
}) {
  const t = useTranslations();
  const brand = companyName || t("common.brand");

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const reduce = useReducedMotion();

  // Si no lo usás, podés quitarlo.
  const { firestore } = useContext(ContextGeneral) || {};

  const isValidEmail = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()),
    [email]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValidEmail) {
      setMsg(t("common.forms.invalidEmail"));
      return;
    }
    try {
      setBusy(true);
      setMsg("");
      if (typeof onSubscribe === "function") {
        await onSubscribe(email.trim());
      }
      setMsg(t("common.forms.thanks"));
      setEmail("");
    } catch (err) {
      setMsg(t("common.forms.error"));
    } finally {
      setBusy(false);
    }
  }

  // Títulos de columnas (ya en JSON)
  const colTitles = {
    services: t("footer.columns.services", { defaultMessage: "Services" }),
    company: t("footer.columns.company", { defaultMessage: "Company" }),
    resources: t("footer.columns.resources", { defaultMessage: "Resources" }),
  };

  return (
    <footer
      className="relative mt-24 text-white bg-[#0A1628]"
      role="contentinfo"
    >
      {/* -- Glow superior con gradiente y grilla sutil */}
      <div className="relative">
        <div className={`h-[2px] ${ACCENT_GRAD}`} aria-hidden />
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(600px 120px at 50% 0%, rgba(255,255,255,0.35), transparent)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.2))",
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
          aria-hidden
        >
          <defs>
            <pattern
              id="f-grid"
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <path d="M36 0H0v36" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#f-grid)" />
        </svg>
      </div>

      {/* -- Contenido principal del footer */}
      <div className={`${SHELL} py-14`}>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* -- Columna Brand (logo + copy) */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduce ? 0.2 : 0.5, ease: "easeOut" }}
            className="col-span-1"
          >
            <a
              href="/"
              className="inline-flex items-center rounded-xl focus-visible:ring-2 focus-visible:ring-white/40 outline-none h-12 md:h-14"
            >
              <div className="relative h-full aspect-[16/5]">
                <Image
                  src="/images/logo.png"
                  alt={`${brand} logo`}
                  fill
                  priority
                  className="object-contain"
                  sizes="(min-width: 768px) 280px, 200px"
                />
              </div>
            </a>

            <p className="mt-3 text-sm text-white/70 max-w-xs leading-relaxed">
              {t("footer.brandCopy", {
                defaultMessage:
                  "Language consultancy for companies and individuals — onsite, online, or blended. CEFR-ready placement and measurable outcomes.",
              })}
            </p>

            {/* -- Redes sociales accesibles */}
            <nav aria-label="Social links" className="mt-4">
              <ul className="flex items-center gap-3">
                {social.map((s) => {
                  const Icon = s.icon;
                  return (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/80 hover:text-white hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition"
                      >
                        <Icon aria-hidden className="h-4 w-4" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>

          {/* -- Columna Services */}
          <FooterColumn title={colTitles.services} items={nav.services} />

          {/* -- Columna Company */}
          <FooterColumn title={colTitles.company} items={nav.company} />

          {/* -- Columna Resources */}
          <FooterColumn title={colTitles.resources} items={nav.resources} />

          {/* -- Columna Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduce ? 0.2 : 0.5, ease: "easeOut" }}
            className="col-span-1"
          >
            <h3 className="text-sm font-semibold tracking-wide uppercase text-white/90">
              {t("footer.newsletterTitle")}
            </h3>
            <p className="mt-2 text-sm text-white/70">
              {t("footer.newsletterCopy")}
            </p>

            <form
              onSubmit={async (e) => {
                    e.preventDefault();
                      const form = e.currentTarget; // 👈 más seguro
  const email = form.email.value.trim(); // ya funciona
                    if (!email) return alert("Por favor, ingresa un email válido.");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          origin: "Newsletter", // 👈 aquí definís de dónde vino
        }),
      });

      if (res.ok) {
        alert("Gracias por suscribirte. Te contactaremos pronto.");
        e.target.reset();
      } else {
        const data = await res.json();
        alert(data.error || "Ocurrió un error al enviar el mail.");
      }
    } catch (error) {
      console.error(error);
      alert("Error enviando el formulario.");
    }
  }}
              className="mt-4"
              aria-describedby="newsletter-desc"
              noValidate
            >
              <span id="newsletter-desc" className="sr-only">
                {t("footer.a11y.newsletterDesc", {
                  defaultMessage:
                    "Enter your email to subscribe to the newsletter.",
                })}
              </span>

              {/* Honeypot anti-bot */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="flex items-center gap-2">
                <label htmlFor="email" className="sr-only">
                  {t("footer.a11y.emailLabel", { defaultMessage: "Email" })}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  inputMode="email"
                  autoComplete="email"
                  placeholder={t("common.forms.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-sm placeholder-white/40 outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className={`shrink-0 inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white ${ACCENT_GRAD} hover:brightness-110 active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition`}
                >
                  <FiSend aria-hidden className="h-4 w-4" />
                  <span>
                    {busy
                      ? t("common.forms.sending")
                      : t("common.cta.subscribe")}
                  </span>
                </button>
              </div>

              <p
                className="mt-2 text-xs text-white/70"
                role="status"
                aria-live="polite"
              >
                {msg}
              </p>
            </form>
          </motion.div>
        </div>

        {/* -- Línea legal inferior */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} {brand}. {t("footer.copyright")}
          </p>
          <ul className="flex items-center gap-4 text-xs text-white/70">
            <li>
              <a
                href="/privacy"
                className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
              >
                {t("footer.legal.privacy")}
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
              >
                {t("footer.legal.terms")}
              </a>
            </li>
            <li>
              <a
                href="/cookies"
                className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded inline-flex items-center gap-1"
              >
                {t("footer.legal.cookies")}{" "}
                <FiArrowRight aria-hidden className="h-3.5 w-3.5" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

/* ----------------- Sub-componente de columna ----------------- */
function FooterColumn({ title, items = [] }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0.2 : 0.5, ease: "easeOut" }}
      className="col-span-1"
    >
      <h3 className="text-sm font-semibold tracking-wide uppercase text-white/90">
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it.href}>
            <a
              href={it.href}
              className="text-sm text-white/70 hover:text-white rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition"
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
