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
            animate={{ opacity: 1, y: 0 }}
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

           {/* -- Columna WhatsApp */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduce ? 0.2 : 0.5, ease: "easeOut" }}
            className="col-span-1"
          >
            <h3 className="text-sm font-semibold tracking-wide uppercase text-white/90">
              {t("footer.contactTitle", { defaultMessage: "Contact Us" })}
            </h3>
            <p className="mt-2 text-sm text-white/70 leading-relaxed">
              {t("footer.whatsappCopy", { 
                defaultMessage: "Have questions? Chat with us on WhatsApp for information about courses and enrollment."
              })}
            </p>

            <a
              href="https://wa.me/5491125673306?text=Hola%21%20Quiero%20informaci%C3%B3n%20sobre%20inscripciones%20y%20cursos%20disponibles."
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white ${ACCENT_GRAD} hover:brightness-110 hover:scale-[1.02] active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition-all duration-200 shadow-md shadow-orange-500/20`}
            >
              <svg 
                className="h-4 w-4" 
                fill="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>{t("footer.whatsappButton", { defaultMessage: "Chat on WhatsApp" })}</span>
            </a>
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
      animate={{ opacity: 1, y: 0 }}
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
