"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";

/** ====== Flags (SVG inline, sin requests externas) ====== */
function FlagGB({ className = "h-4 w-6" }) {
  // Union Jack simplificado
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <clipPath id="gbClip">
        <rect width="60" height="40" rx="3" />
      </clipPath>
      <g clipPath="url(#gbClip)">
        <path fill="#012169" d="M0 0h60v40H0z" />
        <path stroke="#fff" strokeWidth="8" d="M0 0l60 40M60 0L0 40" />
        <path stroke="#C8102E" strokeWidth="5" d="M0 0l60 40M60 0L0 40" />
        <path fill="#fff" d="M25 0h10v40H25zM0 15h60v10H0z" />
        <path fill="#C8102E" d="M27 0h6v40h-6zM0 17h60v6H0z" />
      </g>
    </svg>
  );
}
function FlagAR({ className = "h-4 w-6" }) {
  // Bandera Argentina (simplificada, sin sol detallado)
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      <rect width="60" height="40" rx="3" fill="#75AADB" />
      <rect y="13.333" width="60" height="13.333" fill="#fff" />
      {/* Sol simplificado */}
      <circle cx="30" cy="20" r="4.2" fill="#F6B40E" />
    </svg>
  );
}
function FlagBR({ className = "h-4 w-6" }) {
  // Bandera de Brasil (simplificada)
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden>
      {/* Fondo verde */}
      <rect width="60" height="40" rx="3" fill="#009B3A" />
      {/* Rombo amarillo */}
      <polygon
        points="30,5 55,20 30,35 5,20"
        fill="#FFDF00"
      />
      {/* Círculo azul */}
      <circle cx="30" cy="20" r="8" fill="#002776" />
      {/* Banda blanca (simplificada) */}
      <path
        d="M22 19.5a18 18 0 0 1 16 1"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.8"
      />
    </svg>
  );
}


/** ====== UI helpers ====== */
const BTN =
  "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition";
const ITEM =
  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20";

/** ====== Componente ====== */
export default function LanguageSwitcher() {
  const router = useRouter();
  const { pathname, asPath, query, locale: current, locales } = router;

  // Mapeo de idiomas soportados con banderas
  const ALL = useMemo(
    () => ({
      en: { code: "en", label: "English", short: "EN", Flag: FlagGB },
      es: { code: "es", label: "Español (AR)", short: "ES", Flag: FlagAR },
      pt: { code: "pt", label: "Português ", short: "PT", Flag: FlagBR },
    }),
    []
  );

  // Limita a los locales configurados en Next (o fallback)
  const options = useMemo(() => {
    const list = locales && locales.length ? locales : ["en", "es"];
    return list.map((lc) => ALL[lc]).filter(Boolean);
  }, [locales, ALL]);

  const active = ALL[current] || ALL.es;

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const change = (to) => {
    setOpen(false);
    if (to === current) return;
    router.push({ pathname, query }, asPath, { locale: to, scroll: false });
  };

  return (
    <div className="relative" ref={ref}>
      {/* Botón principal */}
      <button
        type="button"
        className={BTN}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        onClick={() => setOpen((v) => !v)}
      >
        <active.Flag />
        <span className="hidden sm:inline">{active.short}</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          aria-label="Languages"
          className="absolute right-0 z-50 mt-2 w-44 rounded-2xl border border-white/10 bg-[#0C212D]/95 backdrop-blur-xl p-2 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)]"
        >
          {options.map(({ code, label, Flag }) => {
            const selected = code === current;
            return (
              <button
                key={code}
                role="menuitemradio"
                aria-checked={selected}
                className={`${ITEM} ${selected ? "bg-white/10" : ""}`}
                onClick={() => change(code)}
              >
                <Flag />
                <span className="flex-1 text-left">{label}</span>
                {selected && (
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
