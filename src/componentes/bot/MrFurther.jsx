// /componentes/bot/MrFurther.jsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useContext } from "react";
import ContextGeneral from "@/services/contextGeneral";

/* ===== Estilo (tokens) ===== */
const BG_ALT = "bg-[#112C3E]";
const GRAD = "bg-gradient-to-tr from-[#EE7203] to-[#FF3816]";
const RING = "ring-1 ring-white/10";

/* Avatar del bot */
const BOT_IMG = "https://i.imgur.com/EbnS3w8.png";

/* ===== KNOWLEDGE (completo y consolidado) ===== */
const KNOWLEDGE = `
Sobre Further
- Empresa de enseñanza de idiomas y soluciones idiomáticas con sede en Buenos Aires; +25 años de trayectoria.
- Enfoque 100% comunicacional e inmersivo; B2B (empresas) y B2C (particulares).
- Idiomas: Inglés, Portugués, Italiano, Francés, Alemán y Español para Extranjeros.
- Staff docente de excelencia, con profesores nativos.
- +50.000 alumnos ya vivieron la #ExperienciaFurther.
- Misión: enseñar con enfoque comunicacional y práctico, para que los alumnos se sientan seguros al interactuar con otras culturas.
- Visión: generar valor que impacte a corto plazo en el desempeño laboral y potencie la competitividad global de empresas.

Pilares en la enseñanza
- Innovación, excelencia académica y calidez humana.
- Clases dinámicas, personalizadas, centradas en necesidades reales (laborales y personales).
- Experiencias inmersivas dentro y fuera del aula.

Servicios Corporativos (B2B)
- Capacitación para empresas: programas a medida, presenciales y online.
- Nivelación por CEFR (Marco Común Europeo) para transparencia y seguimiento.
- Clases presenciales en: CABA, Mar del Plata, Rosario, Córdoba, Mendoza y Salta.
- Workshops customizados: How to Make a Killer Presentation, HR for Success, Help Desk, Finance Programme.
- Conversational Club para mejorar fluidez en contextos laborales.
- Team Building con foco idiomático.
- Contacto B2B: incompany@furtherenglish.com

Further School (presencial)
- Sedes: Parque Patricios (La Rioja 1775) y Saavedra (García del Río 2866).
- Inglés para niños, adolescentes y adultos (desde 3 años); enfoque lúdico, inmersivo y comunicacional.
- Private Tuitions (presencial u online).
- Preparación de exámenes internacionales: Cambridge (FCE, CAE, CPE, IELTS), y exámenes de EEUU: TOEFL, GMAT, GRE, SAT.
- Email School: info@furtherenglish.com
- WhatsApp Parque Patricios: +54 9 11 3582-1240  https://wa.me/5491135821240
- WhatsApp Saavedra:        +54 9 11 3083-3275  https://wa.me/5491130833275
- Instagram School: @FurtherLanguages  https://www.instagram.com/furtherlanguages/

FURTHERMORE (juegos)
- Aprendizaje lúdico para todas las edades.
- Juegos actuales: The Old Maid, Go Pig.
- Venta en Front Desk de sedes o por Instagram @FurtherLanguages.

TEFL (Teaching English as a Foreign Language)
- Certificación para enseñar inglés en Buenos Aires con experiencia real de aula.
- Destinado a quienes quieren iniciar carrera docente internacional.
- Contacto TEFL: incompany@furtherenglish.com

Further Academy (Self-Study Online)
- Plataforma de autoestudio con cursos diseñados para el mundo corporativo.
- Foco en habilidades comunicacionales laborales: pitch, prompting, presentaciones, storytelling y más.
- Acceso: https://academy.furthercorporate.com/
- En Further Academy aprendés y avanzás a tu propio ritmo. Al finalizar el curso, un docente evalúa tu progreso y te otorga la certificación correspondiente, con el sello distintivo de la excelencia académica que caracteriza a Further.
- De esta manera, aplicamos herramientas innovadoras de IA, sin perder el plus del valor humano, esencial en los contextos educativos.
- Si querés conocer más información sobre Further Academy, contactate a incompany@furtherenglish.com

Further Media / Further Studios
- Podcast y recursos para practicar fuera del aula (audiovisual + worksheets).
- Spotify @FurtherRecords: https://open.spotify.com/show/1S9j1XZF0DscjTgITQOqH6
- YouTube @FurtherCorporate: https://www.youtube.com/@furthercorporate
- Instagram Corporate: @FurtherCorporate  https://www.instagram.com/furthercorporate/
- Instagram School:   @FurtherLanguages  https://www.instagram.com/furtherlanguages/
- LinkedIn: @FurtherCorporate  https://www.linkedin.com/company/furthercorporate/
- TikTok: @Further_Corporate   https://www.tiktok.com/@further_corporate
- Producción de contenido: Further Studios (Palermo Hollywood).

Diferenciales
- Profesores altamente capacitados con experiencia práctica.
- Clases adaptadas al mundo real y a necesidades de cada alumno/empresa.
- Propuestas 100% customizadas e inmersivas.
- Experiencia integral B2B y B2C.
- Material propio (incluye worksheets y herramientas de IA).
- Contenidos alineados al mundo corporativo actual.
- Próximo lanzamiento: campus para alumnos.
- Chatbot conversacional 24/7 para practicar desde cualquier lugar.

Ubicación y contacto
- Buenos Aires, Argentina. Oficinas administrativas en Belgrano.
- Sedes School: Parque Patricios (La Rioja 1775) y Saavedra (García del Río 2866).
- Contactos:
  · School: info@furtherenglish.com
  · Corporativo / TEFL: incompany@furtherenglish.com
  · WhatsApp Parque Patricios: +54 9 11 3582-1240
  · WhatsApp Saavedra: +54 9 11 3083-3275

Mapa de rutas (contenido de la web)
- /nosotros: trayectoria, empresas que nos eligen, misión/visión/valores, testimonios.
- /corporate-services (o /corporate): servicios B2B, capacitación para empresas, propuestas especiales, workshops, clientes.
- /further-school (o /school): clases para todas las edades, exámenes internacionales, proyecto educativo.
- /furthermore: juegos de mesa y aprendizaje lúdico.
- /TEFL: información del programa TEFL.
- /further-media (o /media): podcast y recursos para practicar inglés (videos, worksheets).
- /contacto (o /contact): más info, presupuestos, propuestas.
- /news: novedades y materiales de interés (incluye transcripción de podcast).
`.trim();

/* ===== System Instruction ===== */
const SYSTEM_INSTRUCTION = `
Eres "Mr. Further", un asistente que SOLO responde usando la información del KNOWLEDGE proporcionado. 
Si la consulta NO está relacionada con Further, debés responder EXACTAMENTE:
"Solo puedo responder sobre Further y los servicios/recursos descritos en nuestro material institucional."

PRIORIDADES (en orden):
1) Responder SOLO con información contenida en KNOWLEDGE.
2) Mantener un tono amable, claro y corporativo.
3) Responder en el idioma solicitado (es/en). Si no se indica, usar inglés.
4) Mantener respuestas breves (1–4 frases o bullets).
5) Si se mencionan redes sociales o WhatsApp, incluir los enlaces EXACTOS del KNOWLEDGE.
6) Indicar modalidad (presencial/online) y sedes cuando la información esté disponible.
7) No inventar información. Si no existe en KNOWLEDGE → derivar según el contexto del usuario.
8) No mencionar "KNOWLEDGE", "PDF" ni "fuente de datos".

IMPORTANTE:
— No generes contenido fuera de KNOWLEDGE.
— No respondas como modelo de IA: respondé como un asistente corporativo humano.
— Mantener estilo sobrio, profesional y directo.
`.trim();

/* ===== Portal ===== */
function Portal({ children }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

/* ===== Utils ===== */
function sanitizeUrls(txt = "") {
  return txt.replace(/(https?:\/\/\S+?)([.,;:!?])(?=\s|$)/g, "$1");
}

const INTERNAL_HOSTS = new Set([
  "furthercorporate.com",
  "www.furthercorporate.com",
  "furtherenglish.com",
  "www.furtherenglish.com",
]);

const PATH_ALIASES = {
  "/": "/",
  "/home": "/",
  "/about": "/about",
  "/nosotros": "/nosotros",
  "/corporate": "/corporate-services",
  "/corporate-services": "/corporate-services",
  "/school": "/further-school",
  "/further-school": "/further-school",
  "/furthermore": "/furthermore",
  "/media": "/further-media",
  "/further-media": "/further-media",
  "/tefl": "/TEFL",
  "/faq": "/faq",
  "/contact": "/contact",
  "/contacto": "/contacto",
  "/news": "/news",
};

function normalizeInternalPath(path = "/") {
  try {
    const clean = path.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";
    return PATH_ALIASES[clean] ?? clean;
  } catch {
    return "/";
  }
}

function LocalizedLink({ router, to, children, className }) {
  const href = normalizeInternalPath(to || "/");
  return (
    <Link
      href={href}
      locale={router?.locale}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children ?? href}
    </Link>
  );
}

const HOST_LABELS = {
  "open.spotify.com": "Spotify",
  "spotify.com": "Spotify",
  "youtube.com": "YouTube",
  "www.youtube.com": "YouTube",
  "youtu.be": "YouTube",
  "instagram.com": "Instagram",
  "www.instagram.com": "Instagram",
  "wa.me": "WhatsApp",
  "academy.furthercorporate.com": "Further Academy",
  "furthercorporate.com": "Further Corporate",
  "www.furthercorporate.com": "Further Corporate",
  "www.linkedin.com": "LinkedIn",
  "linkedin.com": "LinkedIn",
  "tiktok.com": "TikTok",
  "www.tiktok.com": "TikTok",
};

function prettyLabel(href, fallback) {
  try {
    const u = new URL(href);
    if (fallback && fallback !== href) return fallback;
    if (u.hostname === "wa.me") return "WhatsApp";
    if (HOST_LABELS[u.hostname]) return HOST_LABELS[u.hostname];
    return u.hostname.replace(/^www\./, "");
  } catch {
    if (href?.startsWith("mailto:")) return "Email";
    if (href?.startsWith("tel:")) return "Phone";
    if (href?.startsWith("/")) return fallback || "Open";
    return fallback || "Open";
  }
}

/* ===== Enlaces enriquecidos ===== */
function renderWithLinks(text, router) {
  if (!text) return null;

  const processed = text.replace(
    /(whatsapp[:\s-]*)(\+?\d[\d\s-]{6,}\d)/gi,
    (_, p1, p2) => {
      const digits = p2.replace(/[^\d]/g, "");
      return digits.length >= 6 ? `${p1}https://wa.me/${digits}` : `${p1}${p2}`;
    }
  );

  const tokens = [];
  let i = 0;

  const md =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[A-Za-z0-9\-/_#?=.%]+|mailto:[^\s)]+|tel:[^\s)]+)\)/g;
  const urlAbs = /https?:\/\/[^\s)]+/g;
  const urlRel = /(?:^|\s)(\/[A-Za-z0-9\-/_#?=.%]+)/g;
  const urlMailTel = /(mailto:[^\s)]+|tel:[^\s)]+)/g;

  const matches = [];
  const collect = (regex, kind) => {
    regex.lastIndex = 0;
    let m;
    while ((m = regex.exec(processed)) !== null) {
      if (kind === "md") {
        matches.push({
          start: m.index,
          end: m.index + m[0].length,
          type: "md",
          label: m[1],
          value: m[2],
        });
      } else if (kind === "rel") {
        const raw = m[1];
        const start = m.index + (m[0].startsWith(" ") ? 1 : 0);
        matches.push({
          start,
          end: start + raw.length,
          type: "rel",
          value: raw,
        });
      } else {
        matches.push({
          start: m.index,
          end: m.index + m[0].length,
          type: kind,
          value: m[0],
        });
      }
    }
  };

  collect(md, "md");
  collect(urlAbs, "abs");
  collect(urlRel, "rel");
  collect(urlMailTel, "mailtel");

  matches.sort((a, b) => a.start - b.start || b.end - a.end);
  const filtered = [];
  let lastEnd = -1;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      filtered.push(m);
      lastEnd = m.end;
    }
  }
  filtered.sort((a, b) => a.start - b.start);

  const commonClass =
    "underline underline-offset-2 decoration-white/40 hover:decoration-white transition break-words";

  for (const m of filtered) {
    if (i < m.start) tokens.push(processed.slice(i, m.start));

    const value = m.value;
    const label = m.label || value;

    const pushExternal = (href, lbl = label) =>
      tokens.push(
        <a
          key={`${m.type}-${m.start}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={commonClass}
        >
          {prettyLabel(href, lbl)}
        </a>
      );

    const pushInternal = (to, lbl = label) =>
      tokens.push(
        <LocalizedLink
          key={`${m.type}-${m.start}`}
          router={router}
          to={to}
          className={commonClass}
        >
          {prettyLabel(to, lbl)}
        </LocalizedLink>
      );

    const handleUrl = (raw, lbl) => {
      if (raw.startsWith("mailto:") || raw.startsWith("tel:"))
        return pushExternal(raw, lbl);
      if (raw.startsWith("http")) {
        try {
          const base =
            typeof window !== "undefined"
              ? window.location.origin
              : "https://furthercorporate.com";
          const u = new URL(raw, base);
          const sameOrigin =
            typeof window !== "undefined" &&
            u.origin === window.location.origin;
          const knownInternal = INTERNAL_HOSTS.has(u.hostname);
          if (sameOrigin || knownInternal)
            return pushInternal(`${u.pathname}${u.search}${u.hash}`, lbl);
        } catch {}
        return pushExternal(raw, lbl);
      }
      if (raw.startsWith("/")) return pushInternal(raw, lbl);
      return tokens.push(lbl);
    };

    if (m.type === "md") handleUrl(value, label);
    else if (m.type === "abs") handleUrl(value, value);
    else if (m.type === "rel") handleUrl(value, value);
    else if (m.type === "mailtel") handleUrl(value, value);

    i = m.end;
  }
  if (i < processed.length) tokens.push(processed.slice(i));
  return tokens;
}

/* ===== Bold + Links ===== */
function renderBoldAndLinks(str = "", router) {
  const parts = [];
  let last = 0;
  const re = /\*\*(.+?)\*\*/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) {
      parts.push({ type: "text", value: str.slice(last, m.index) });
    }
    parts.push({ type: "bold", value: m[1] });
    last = m.index + m[0].length;
  }
  if (last < str.length) parts.push({ type: "text", value: str.slice(last) });

  return parts.map((p, idx) =>
    p.type === "bold" ? (
      <strong key={`b-${idx}`} className="font-semibold text-white">
        {renderWithLinks(p.value, router)}
      </strong>
    ) : (
      <React.Fragment key={`t-${idx}`}>
        {renderWithLinks(p.value, router)}
      </React.Fragment>
    )
  );
}

/* ===== Formateo "bonito" de respuestas ===== */
function renderRichAnswer(text = "", router) {
  const trimmed = text.trim();
  const blocks = trimmed.split(/\n{2,}/);

  return blocks.map((block, bi) => {
    const lines = block
      .split(/\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const listLines = lines.filter((l) => /^(\*|-)\s+/.test(l));
    const isList = listLines.length >= 2 && listLines.length === lines.length;

    if (isList) {
      const items = lines.map((l) => l.replace(/^(\*|-)\s+/, ""));
      return (
        <ul
          key={`ul-${bi}`}
          className="my-2 ml-4 list-disc space-y-1 marker:text-white/70"
        >
          {items.map((it, ii) => (
            <li key={ii} className="pl-1">
              {renderBoldAndLinks(it, router)}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={`p-${bi}`} className="my-2 leading-relaxed">
        {renderBoldAndLinks(block, router)}
      </p>
    );
  });
}

/* ===== Bubble FAQ (fuera del modal) ===== */
function FaqBubblePortal({ anchorRect, items, onPick, onClose }) {
  if (typeof document === "undefined" || !anchorRect) return null;

  const vw = typeof window !== "undefined" ? window.innerWidth : 560;
  const maxWidth = Math.min(560, vw - 24);
  const left = Math.max(
    12,
    Math.min(anchorRect.right - maxWidth, vw - maxWidth - 12)
  );
  const top = anchorRect.bottom + 8;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10_000,
        pointerEvents: "none",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{
          position: "absolute",
          left,
          top,
          width: maxWidth,
          pointerEvents: "auto",
        }}
      >
        <div className="relative rounded-2xl bg-white text-[#0C212D] ring-1 ring-black/10 p-3 shadow-2xl">
          <span
            className="absolute right-6 -top-2 w-3 h-3 rotate-45 bg-white ring-1 ring-black/10"
            aria-hidden
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {items.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  onPick(q);
                  onClose();
                }}
                className="text-left px-3 py-2 rounded-xl bg-white hover:bg-white/90 text-[#0C212D] ring-1 ring-black/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3816]/40"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

/* ===== UI strings ===== */
function uiStrings(locale = "en") {
  if (locale?.startsWith("es")) {
    return {
      a11yOpen: "Abrir chat",
      a11yClose: "Cerrar chat",
      title: "Mr. Further",
      subtitle: "En línea — basado en material institucional",
      showFaq: "Ver Preguntas",
      hideFaq: "Ocultar Preguntas",
      inputPlaceholder: "Escribe tu mensaje…",
      poweredBy: "Con tecnología de",
      apiMissing: "Falta API key",
      hello: "¡Hola! Soy Mr. Further. ¿En qué puedo ayudarte?",
      faqItems: [
        "Quiero aprender inglés (particular)",
        "Mi empresa necesita capacitación",
        "¿Preparan para Cambridge, TOEFL o GMAT?",
        "¿Qué es Further Academy?",
        "¿Dónde están las sedes?",
        "Clases para niños y adolescentes",
      ],
      suggestions: [
        "Quiero aprender inglés (particular)",
        "Mi empresa necesita capacitación",
        "Preparación para exámenes internacionales",
        "¿Qué es Further Academy?",
        "Clases para niños",
      ],
      localeHint:
        "Responde en español, amable y corporativo, breve y preciso, usando solo el KNOWLEDGE.",
    };
  }
  return {
    a11yOpen: "Open chat",
    a11yClose: "Close chat",
    title: "Mr. Further",
    subtitle: "Online — grounded to institutional content",
    showFaq: "Show FAQ",
    hideFaq: "Hide FAQ",
    inputPlaceholder: "Type your message…",
    poweredBy: "Powered by",
    apiMissing: "API key missing",
    hello: "Hi! I'm Mr. Further. How can I help you today?",
    faqItems: [
      "I want to learn English (individual)",
      "My company needs training",
      "Do you prepare for Cambridge, TOEFL or GMAT?",
      "What is Further Academy?",
      "Where are the locations?",
      "Classes for kids and teens",
    ],
    suggestions: [
      "I want to learn English (individual)",
      "My company needs training",
      "International exam preparation",
      "What is Further Academy?",
      "Classes for children",
    ],
    localeHint:
      "Answer in English, friendly and corporate, concise and precise, using only the KNOWLEDGE.",
  };
}

/* ===== Componente principal ===== */
export default function MrFurther({ openDefault = false }) {
  const router = useRouter();
  const locale = router?.locale || "en";
  const ui = uiStrings(locale);

  // --- ADMIN CONTEXT ---
  const { isAdmin } = useContext(ContextGeneral);
  const isAdminRoute = router?.pathname?.startsWith("/admin");
  const isAdminMode = isAdmin && isAdminRoute;

  // --- UI DINÁMICA SEGÚN CONTEXTO ---
  const uiAdmin = {
    ...ui,
    hello: "👋 Hola Admin, soy tu asistente de blogs. Puedo ayudarte a crear y optimizar contenido para Further Corporate.",
    faqItems: [
      "¿Cómo funciona el módulo de blogs?",
      "¿Cómo debería estructurar un nuevo blog?",
      "¿Qué buenas prácticas recomiendas al redactar?",
      "¿Cómo se generan y editan las traducciones?",
      "¿Qué tener en cuenta antes de publicar?",
    ],
    suggestions: [
      "¿Cómo funciona el módulo de blogs?",
      "¿Cómo debería estructurar un nuevo blog?",
      "¿Qué buenas prácticas recomiendas al redactar?",
      "¿Cómo se generan y editan las traducciones?",
      "¿Qué tener en cuenta antes de publicar?",
    ],
  };
const uiIndividual = {
  ...ui,
  faqItems: locale?.startsWith("es")
    ? [
        "Quiero aprender inglés",
        "¿Dónde están las sedes?",
        "Clases para niños y adolescentes",
        "Preparación para exámenes internacionales",
        "Horarios y modalidades",
        "¿Qué idiomas enseñan además de inglés?",
        "¿Tienen clases online?",
        "¿Cuánto cuestan los cursos?",
        "Private Tuitions (clases personalizadas)",
        "Furthermore: juegos para aprender",
        "¿Qué es el TEFL?",
        "¿Preparan para Cambridge FCE, CAE, CPE?",
        "¿Preparan para TOEFL, GMAT, GRE?",
        "¿Desde qué edad pueden empezar los niños?",
        "¿Cómo es el enfoque comunicacional?",
        "¿Tienen material propio?",
        "Further Media: podcast y recursos",
        "¿Cómo me contacto por WhatsApp?",
      ]
    : [
        "I want to learn English",
        "Where are the locations?",
        "Classes for kids and teens",
        "International exam preparation",
        "Schedules and formats",
        "What other languages do you teach?",
        "Do you have online classes?",
        "How much do courses cost?",
        "Private Tuitions (personalized classes)",
        "Furthermore: learning games",
        "What is TEFL?",
        "Do you prepare for Cambridge FCE, CAE, CPE?",
        "Do you prepare for TOEFL, GMAT, GRE?",
        "What age can children start?",
        "How is the communicational approach?",
        "Do you have your own materials?",
        "Further Media: podcast and resources",
        "How do I contact via WhatsApp?",
      ],
  suggestions: locale?.startsWith("es")
    ? [
        "Quiero aprender inglés",
        "¿Dónde están las sedes?",
        "Clases para niños",
        "Preparación para exámenes",
        "¿Qué idiomas enseñan?",
        "Clases online",
      ]
    : [
        "I want to learn English",
        "Where are the locations?",
        "Classes for children",
        "Exam preparation",
        "What languages do you teach?",
        "Online classes",
      ],
};

const uiCorporate = {
  ...ui,
  faqItems: locale?.startsWith("es")
    ? [
        "Mi empresa necesita capacitación",
        "Capacitaciones in-company",
        "Workshops corporativos",
        "¿Qué es Further Academy?",
        "Programas a medida",
        "Conversational Club para empresas",
        "Team Building con enfoque idiomático",
        "¿Cómo funciona la nivelación CEFR?",
        "Workshops: Killer Presentation",
        "Workshops: HR for Success",
        "Workshops: Help Desk",
        "Workshops: Finance Programme",
        "¿Tienen clases presenciales en provincias?",
        "¿Qué idiomas ofrecen para empresas?",
        "¿Cómo solicito una propuesta B2B?",
        "¿Qué empresas ya los eligieron?",
        "Further Studios: producción de contenido",
        "¿Cómo me contacto para servicios corporativos?",
      ]
    : [
        "My company needs training",
        "In-company training",
        "Corporate workshops",
        "What is Further Academy?",
        "Custom programs",
        "Conversational Club for companies",
        "Team Building with language focus",
        "How does CEFR leveling work?",
        "Workshops: Killer Presentation",
        "Workshops: HR for Success",
        "Workshops: Help Desk",
        "Workshops: Finance Programme",
        "Do you have in-person classes in provinces?",
        "What languages do you offer for companies?",
        "How do I request a B2B proposal?",
        "What companies have chosen you?",
        "Further Studios: content production",
        "How do I contact for corporate services?",
      ],
  suggestions: locale?.startsWith("es")
    ? [
        "Mi empresa necesita capacitación",
        "Workshops corporativos",
        "Programas a medida",
        "Further Academy",
        "Conversational Club",
        "Nivelación CEFR",
      ]
    : [
        "My company needs training",
        "Corporate workshops",
        "Custom programs",
        "Further Academy",
        "Conversational Club",
        "CEFR leveling",
      ],
};


  

  // --- STATE PRINCIPAL ---
  const [open, setOpen] = useState(openDefault);
  const [showFAQ, setShowFAQ] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(null); // null | 'individual' | 'corporate'
  const [messages, setMessages] = useState([]);
  // Usa uiAdmin solo si está en modo admin
  const uiFinal = isAdminMode
  ? uiAdmin
  : userType === "individual"
  ? uiIndividual
  : userType === "corporate"
  ? uiCorporate
  : ui;


  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // --- CONTEXTO GEMINI SEGÚN RUTA Y TIPO DE USUARIO ---
  const BOT_CONTEXT = isAdminMode
    ? `
Eres el Asistente del Panel Admin de Further Corporate.
Ayudas a los administradores a crear, revisar y optimizar blogs de forma prolija, eficiente y alineada al estilo de la empresa.

Contexto:
- Further Corporate es una empresa de enseñanza de idiomas y soluciones corporativas con más de 25 años de trayectoria.
- Los blogs se crean primero en español (base), y al guardarse se traducen automáticamente al inglés y portugués con Gemini.
- Luego pueden editarse manualmente en los tres idiomas para mejorar calidad y coherencia.
- Cada blog incluye: título, resumen, contenido (Editor.js), idioma, estado (public/private/unlisted) y una imagen de portada externa (coverUrl).
- No se admiten imágenes dentro del contenido por límites de almacenamiento.

Tu tarea:
- Explicar cómo funciona el flujo de creación y traducción de blogs.
- Ayudar a redactar títulos y párrafos claros, profesionales y alineados con el tono corporativo.
- Revisar textos que te envíen (párrafos, titulares o resúmenes) y sugerir mejoras de estilo, coherencia y claridad.
- Ofrecer buenas prácticas de redacción, estructura y publicación.
- Responde de forma breve, concreta y profesional.
`
    : userType === 'individual'
    ? SYSTEM_INSTRUCTION + "\n\nKNOWLEDGE:\n" + KNOWLEDGE + `

CONTEXTO DEL USUARIO: Este usuario es un PARTICULAR/ESTUDIANTE.
Cuando no tengas información específica, SIEMPRE derivá a:
• **Parque Patricios**: +54 9 11 3582-1240 (https://wa.me/5491135821240)
• **Saavedra**: +54 9 11 3083-3275 (https://wa.me/5491130833275)  
• **Email**: info@furtherenglish.com

NO menciones incompany@furtherenglish.com a menos que pregunten específicamente por servicios corporativos.
`
    : userType === 'corporate'
    ? SYSTEM_INSTRUCTION + "\n\nKNOWLEDGE:\n" + KNOWLEDGE + `

CONTEXTO DEL USUARIO: Este usuario representa una EMPRESA.
Cuando no tengas información específica sobre servicios corporativos, workshops, Academy, TEFL o propuestas B2B, SIEMPRE derivá a:
• **Email Corporativo**: incompany@furtherenglish.com

NO menciones los WhatsApp de las sedes a menos que pregunten específicamente por cursos particulares.
`
    : SYSTEM_INSTRUCTION + "\n\nKNOWLEDGE:\n" + KNOWLEDGE;

  /* ==== Intro POP centrado (CSS fade+scale+y) → slide (Framer) ==== */
  const [introDone, setIntroDone] = useState(false);
  const [showWelcomeTip, setShowWelcomeTip] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    let t;
    const fire = () => {
      setIntroDone(true);
      setShowWelcomeTip(true);
      setTimeout(() => setShowWelcomeTip(false), 3500);
    };
    if (reduce) fire();
    else t = setTimeout(fire, 1600);
    return () => clearTimeout(t);
  }, []);

  /* Reinicia saludo al cambiar idioma */
  useEffect(() => {
    setShowFAQ(false);
    setUserType(null);
    setMessages([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  /* Autoscroll */
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    );
    return () => cancelAnimationFrame(id);
  }, [messages, open, loading, showFAQ]);

  /* Autosize textarea */
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, []);
  useEffect(() => autoResize(), [input, open, autoResize]);

  const lastTimeRef = useRef(0);
  async function sendText(text) {
    const now = Date.now();
    if (now - lastTimeRef.current < 1200) return;
    lastTimeRef.current = now;

    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setShowFAQ(false);
    setLoading(true);

    try {
      const response = await fetch("/api/mrfurther", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: BOT_CONTEXT,
          messages: [
            ...messages.slice(-12).map((m) => ({
              role: m.role,
              content: m.text,
            })),
            { role: "user", content: `${uiFinal.localeHint}\n\n${q}` },
          ],
          maxTokens: 250,
        }),
      });

      const data = await response.json();
      if (!data.output) throw new Error("No output from server");

      const cleaned = sanitizeUrls(data.output);
      setMessages((m) => [...m, { role: "assistant", text: cleaned }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: locale.startsWith("es")
            ? "Hubo un problema temporal. Por favor, volvé a intentar."
            : "Temporary issue. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(e) {
    e?.preventDefault?.();
    const q = input.trim();
    if (!q) return;
    setInput("");
    await sendText(q);
  }

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ===== FAB & PANEL ===== */
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  const fabPos = {
    right: "calc(env(safe-area-inset-right, 0px) + 1rem)",
    bottom: isMobile
      ? "calc(env(safe-area-inset-bottom, 0px) + 7rem)"
      : "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
  };

  /* Panel resizable (arriba-izquierda) */
  const [panelSize, setPanelSize] = useState({ w: 448, h: 608 });
  const minSize = { w: 320, h: 420 };
  const maxSize = { w: 720, h: 800 };
  const panelRef = useRef(null);
  const resizingRef = useRef({
    active: false,
    edge: null,
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
  });

  const startResize = (edge, e) => {
    e.preventDefault();
    const rect = panelRef.current?.getBoundingClientRect();
    resizingRef.current = {
      active: true,
      edge,
      startX: e.clientX,
      startY: e.clientY,
      startW: rect?.width || panelSize.w,
      startH: rect?.height || panelSize.h,
    };
    document.body.style.userSelect = "none";
  };

  const onMoveResize = useCallback(
    (e) => {
      if (!resizingRef.current.active) return;
      const { edge, startX, startY, startW, startH } = resizingRef.current;
      let newW = startW;
      let newH = startH;

      if (edge.includes("left")) {
        const dx = startX - e.clientX;
        newW = Math.min(Math.max(startW + dx, minSize.w), maxSize.w);
      }
      if (edge.includes("top")) {
        const dy = startY - e.clientY;
        newH = Math.min(Math.max(startH + dy, minSize.h), maxSize.h);
      }
      setPanelSize({ w: newW, h: newH });
    },
    [minSize.h, minSize.w, maxSize.h, maxSize.w]
  );

  const stopResize = useCallback(() => {
    if (!resizingRef.current.active) return;
    resizingRef.current.active = false;
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMoveResize);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", onMoveResize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [onMoveResize, stopResize]);

  /* ===== FAQ bubble anclaje ===== */
  const faqBtnRef = useRef(null);
  const [faqAnchorRect, setFaqAnchorRect] = useState(null);
  useEffect(() => {
    if (!showFAQ) return;
    const update = () => {
      const r = faqBtnRef.current?.getBoundingClientRect();
      if (r) setFaqAnchorRect(r);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [showFAQ]);

  /* Ajusta tamaño automáticamente según viewport */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setPanelSize({
          w: window.innerWidth - 24,
          h: window.innerHeight * 0.85,
        });
      } else {
        setPanelSize({ w: 448, h: 608 });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes mrPopIn {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.6);
          }
          60% {
            opacity: 1;
            transform: translateY(0) scale(1.06);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .mr-pop {
          animation: mrPopIn 820ms cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: transform, opacity;
          filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.35));
        }
      `}</style>

      <Portal>
        <LayoutGroup id="mr-fab-group">
          <AnimatePresence>
            {open && (
              <motion.div
                key="mr-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                style={{ position: "fixed", inset: 0, zIndex: 120 }}
                className="bg-black/40"
                aria-hidden
                onClick={() => {
    setOpen(false);
    setShowFAQ(false);  // ← AGREGA ESTA LÍNEA
  }}
                
              />
            )}
          </AnimatePresence>

          <AnimatePresence initial>
            {!introDone && (
              <div
                style={{
                  position: "fixed",
                  right: "calc(env(safe-area-inset-right, 0px) + 7rem)",
                  bottom: "calc(env(safe-area-inset-bottom, 0px) + 7rem)",
                  zIndex: 140,
                }}
                className="mr-pop"
              >
                <motion.button
                  layoutId="mr-fab"
                  layout
                  type="button"
                  aria-label="Asistente"
                  className="relative h-16 w-16 rounded-full shadow-xl shadow-black/40 focus:outline-none"
                  drag
                  dragMomentum={false}
                  dragElastic={0.2}
                  whileDrag={{ scale: 0.96 }}
                  onDragEnd={() => {
                    setIntroDone(true);
                    setShowWelcomeTip(true);
                    setTimeout(() => setShowWelcomeTip(false), 3500);
                  }}
                >
                  <span
                    className={`${GRAD} absolute inset-0 rounded-full`}
                    aria-hidden="true"
                  />
                  <span
                    className="absolute inset-[4px] rounded-full overflow-hidden bg-black/10"
                    aria-hidden="true"
                  >
                    <img
                      src={BOT_IMG}
                      alt="Mr. Further"
                      className="h-full w-full object-cover"
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  </span>
                </motion.button>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {introDone && (
              <motion.button
                key="corner-fab"
                layoutId="mr-fab"
                layout
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? uiFinal.a11yClose : uiFinal.a11yOpen}
                title={open ? uiFinal.a11yClose : uiFinal.a11yOpen}
                style={{ position: "fixed", ...fabPos, zIndex: 130 }}
                animate={{
                  y:
                    typeof window !== "undefined" && window.innerWidth < 768
                      ? (open ? 50 : 0)
                      : (open ? 20 : 0),
                  scale: open ? 0.95 : 1,
                  opacity: open ? 0.95 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 25,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                className="relative h-16 w-16 rounded-full shadow-xl shadow-black/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              >
                <span
                  className={`${GRAD} absolute inset-0 rounded-full`}
                  aria-hidden="true"
                />
                {!open && (
                  <span
                    className="absolute inset-[4px] rounded-full overflow-hidden bg-black/10"
                    aria-hidden="true"
                  >
                    <img
                      src={BOT_IMG}
                      alt="Mr. Further"
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  </span>
                )}
                {open && (
                  <span className="absolute inset-0 grid place-items-center">
                    <svg
                      className="w-7 h-7 text-white drop-shadow"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </span>
                )}
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showWelcomeTip && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                style={{
                  position: "fixed",
                  right: "calc(env(safe-area-inset-right, 0px) + 6.5rem)",
                  bottom:
                    typeof window !== "undefined" && window.innerWidth < 768
                      ? "calc(env(safe-area-inset-bottom, 0px) + 5.5rem)"
                      : "calc(env(safe-area-inset-bottom, 0px) + 2.4rem)",
                  zIndex: 131,
                  maxWidth: 280,
                }}
                className="relative px-4 py-2 text-sm text-[#0C212D] bg-white border border-[#CBD5E1] rounded-2xl
                  [filter:drop-shadow(0_2px_6px_rgba(0,0,0,.18))] pointer-events-none"
                role="status"
              >
                {locale?.startsWith("es")
                  ? "¡Hola! Soy Mr. Further."
                  : "Hi! I'm Mr. Further."}
                <span
                  aria-hidden
                  className="absolute -right-2 bottom-4 w-3.5 h-3.5 rotate-45 bg-[#CBD5E1] rounded-[2px]"
                />
                <span
                  aria-hidden
                  className="absolute -right-[7px] bottom=[18px] w-3 h-3 rotate-45 bg-white rounded-[2px] border border-white"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Panel */}
          <AnimatePresence>
            {open && (
              <motion.aside
                key="mr-panel"
                role="dialog"
                aria-label="Mr. Further chat"
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "fixed",
                  right: fabPos.right,
                  bottom: "calc(env(safe-area-inset-bottom, 0px) + 4.5rem)",
                  width: panelSize.w,
                  height: panelSize.h,
                  zIndex: 125,
                  contentVisibility: "auto",
                  containIntrinsicSize: "352px 608px",
                }}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                ref={panelRef}
                className={[
                  "rounded-3xl text-white",
                  BG_ALT,
                  RING,
                  "shadow-2xl shadow-black/60 flex flex-col relative",
                  "overflow-visible",
                ].join(" ")}
              >
                {/* Header */}
                <header
                  className={[
                    "relative flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10",
                    "bg-gradient-to-r from-[#0C212D]/90 to-[#112C3E]/90 backdrop-blur",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={BOT_IMG}
                      alt="Mr. Further avatar"
                      className="w-8 h-8 rounded-full border border-white/20 object-cover"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base font-bold tracking-tight">
                      Mr. Further
                    </h3>
                    <p className="text-xs text-white/70">
                      {locale?.startsWith("es")
                        ? "En línea — basado en material institucional"
                        : "Online — grounded to institutional content"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {userType && (
                      <button
                        ref={faqBtnRef}
                        type="button"
                        onClick={() => setShowFAQ((v) => !v)}
                        className="px-3 py-1.5 text-xs rounded-xl bg-white/10 hover:bg_white/15 transition ring-1 ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                        aria-expanded={showFAQ}
                      >
                        {showFAQ
                          ? locale?.startsWith("es")
                            ? "Ocultar Preguntas"
                            : "Hide FAQ"
                          : locale?.startsWith("es")
                          ? "Ver Preguntas"
                          : "Show FAQ"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
    setOpen(false);
    setShowFAQ(false);  // ← AGREGA ESTA LÍNEA
  }}
                      aria-label={
                        locale?.startsWith("es") ? "Cerrar chat" : "Close chat"
                      }
                      title={
                        locale?.startsWith("es") ? "Cerrar chat" : "Close chat"
                      }
                      className="h-9 w-9 rounded-xl grid place-items-center hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </header>

                {/* Chat */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  
                  {/* Selector de tipo de usuario */}
                  {!userType && !isAdminMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className="text-center text-white/80 text-sm mb-4">
                        {locale?.startsWith("es") 
                          ? "Para ofrecerte la mejor atención, contanos:"
                          : "To provide you with the best service, tell us:"}
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setUserType('individual');
                            setMessages([
                              { role: "assistant", text: uiFinal.hello },
                              { 
                                role: "assistant", 
                                text: locale?.startsWith("es")
                                  ? "Perfecto! Estoy aquí para ayudarte con tus consultas sobre cursos, sedes, horarios y más. ¿En qué puedo ayudarte?"
                                  : "Perfect! I'm here to help you with questions about courses, locations, schedules and more. How can I help you?"
                              }
                            ]);
                          }}
                          className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 ring-1 ring-white/20 transition-all shadow-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 grid place-items-center shadow-lg">
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-semibold text-white text-base mb-1">
                                {locale?.startsWith("es") ? "🎓 Soy particular / estudiante" : "🎓 I'm an individual / student"}
                              </div>
                              <div className="text-xs text-white/70">
                                {locale?.startsWith("es") 
                                  ? "Quiero aprender un idioma o informarme sobre cursos"
                                  : "I want to learn a language or get info about courses"}
                              </div>
                            </div>
                          </div>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setUserType('corporate');
                            setMessages([
                              { role: "assistant", text: uiFinal.hello },
                              { 
                                role: "assistant", 
                                text: locale?.startsWith("es")
                                  ? "Excelente! Estoy aquí para ayudarte con propuestas corporativas, capacitaciones, workshops y más. ¿Qué necesitás?"
                                  : "Excellent! I'm here to help you with corporate proposals, training programs, workshops and more. What do you need?"
                              }
                            ]);
                          }}
                          className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 ring-1 ring-white/20 transition-all shadow-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 grid place-items-center shadow-lg">
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-semibold text-white text-base mb-1">
                                {locale?.startsWith("es") ? "💼 Represento una empresa" : "💼 I represent a company"}
                              </div>
                              <div className="text-xs text-white/70">
                                {locale?.startsWith("es") 
                                  ? "Necesito capacitación para mi equipo o propuestas B2B"
                                  : "I need training for my team or B2B proposals"}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  <AnimatePresence mode="popLayout">
                    {messages.map((m, i) => {
                      const isUser = m.role === "user";
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 26,
                          }}
                          className={[
                            "flex",
                            isUser ? "justify-end" : "justify-start",
                          ].join(" ")}
                        >
                          <div
                            className={[
                              "max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-lg break-words",
                              isUser
                                ? `${GRAD} text-white rounded-br-md whitespace-pre-line`
                                : "bg_white/[0.06] text_white rounded-bl-md ring-1 ring-white/10",
                            ].join(" ")}
                          >
                            {isUser
                              ? renderWithLinks(m.text, router)
                              : renderRichAnswer(m.text, router)}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 bg-white/[0.06] ring-1 ring-white/10">
                        <div className="flex items-center gap-1.5">
                          {[0, 1, 2].map((j) => (
                            <motion.span
                              key={j}
                              className="h-2 w-2 rounded-full bg-white/70"
                              animate={{ y: [0, -8, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: j * 0.15,
                                ease: "easeInOut",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Sugerencias iniciales (solo si ya eligió tipo) */}
                  {!messages.some((m) => m.role === "user") && !loading && userType && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-wrap gap-2 pt-2"
                    >
                      {uiFinal.suggestions.map((s, idx) => (
                        <motion.button
                          key={s}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + idx * 0.06 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          className="text-xs px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white ring-1 ring-white/10 transition-all shadow-md"
                          onClick={() => {
                            setInput(s);
                            setTimeout(() => textareaRef.current?.focus(), 0);
                          }}
                        >
                          {s}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  <div ref={bottomRef} />
                </div>

                {/* Input - solo visible si ya eligió tipo */}
                {(
  <form
  onSubmit={sendMessage}
  className="p-4 border-t border-white/10 flex items-end gap-3"
>

  <div className="flex-1 relative">
    <textarea
      ref={textareaRef}
      rows={1}
      placeholder={uiFinal.inputPlaceholder}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onInput={autoResize}
      onKeyDown={onKeyDown}
      disabled={loading}
      className="w-full resize-none rounded-2xl px-4 py-3 pr-12 text-sm bg-white/[0.06] text-white placeholder:text-white/50 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-60 transition-all"
    />
  </div>

  <motion.button
    type="submit"
    disabled={loading || !input.trim()}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    className={[
      "shrink-0 h-12 w-12 rounded-2xl text-sm font-semibold text-white",
      GRAD,
      "shadow-lg ring-1 ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all grid place-items-center",
    ].join(" ")}
    aria-label="Send"
    title="Send"
  >
    {loading ? (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-30"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </motion.div>
    ) : (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
    )}
  </motion.button>
</form>
)}
              </motion.aside>
            )}
          </AnimatePresence>

          {/* FAQ Bubble por fuera del modal */}
          <AnimatePresence>
            {showFAQ && faqAnchorRect && (
              <FaqBubblePortal
                anchorRect={faqAnchorRect}
                items={uiFinal.faqItems}
                onPick={(q) => sendText(q)}
                onClose={() => setShowFAQ(false)}
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </Portal>
    </>
  );
}
