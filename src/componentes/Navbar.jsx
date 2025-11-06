// componentes/layout/Navbar.jsx
"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import LanguageSwitcher from "@/componentes/ui/LanguageSwitcher";

/* ========= tokens ========= */
const BRAND_GRAD = "bg-gradient-to-tr from-[#EE7203] to-[#FF3816]";
const LINK_BASE =
  "px-4 py-2.5 text-sm font-semibold tracking-wide rounded-xl outline-none text-white/90 hover:text-white transition-all duration-200 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#FF3816]/60";

/* ========= locales ========= */
const LOCALES = { DEFAULT: "es", SUPPORTED: ["en", "es", "pt"] };

/* ========= paths ========= */
const PATHS = {
  en: {
    home: "/",
    about: "/nosotros",
    contact: "/contacto",
    faq: "/faq",
    school: "/further-school",
    corporate: {
      training: "/corporate-services",
      academy: "/academy",
      furthermore: "/furthermore",
      tefl: "/TEFL",
    },
    media: {
      records: "/further-media",
      youtube: "https://www.youtube.com/",
      tiktok: "https://www.tiktok.com/",
    },
    news: "/news",
  },
  es: {
    home: "/",
    about: "/nosotros",
    contact: "/contacto",
    faq: "/faq",
    school: "/further-school",
    corporate: {
      training: "/corporate-services",
      academy: "/academy",
      furthermore: "/furthermore",
      tefl: "/TEFL",
    },
    media: {
      records: "/further-media",
      youtube: "https://www.youtube.com/",
      tiktok: "https://www.tiktok.com/",
    },
    news: "/news",
  },
  pt: {
    home: "/",
    about: "/nosotros",
    contact: "/contacto",
    faq: "/faq",
    school: "/further-school",
    corporate: {
      training: "/corporate-services",
      academy: "/academy",
      furthermore: "/furthermore",
      tefl: "/TEFL",
    },
    media: {
      records: "/further-media",
      youtube: "https://www.youtube.com/",
      tiktok: "https://www.tiktok.com/",
    },
    news: "/news",
  },
};

/* ========= helpers ========= */
const isExternal = (href = "") =>
  /^https?:\/\//i.test(href) ||
  href.startsWith("mailto:") ||
  href.startsWith("tel:");

function SmartLink({ href, children, className, onClick, ...rest }) {
  const { locale } = useRouter();
  if (isExternal(href)) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }
  const hasHash = href.includes("#");
  return (
    <Link
      href={href}
      locale={locale}
      scroll={!hasHash}
      className={className}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Link>
  );
}

/* ========= hooks ========= */
function useScrollColor(threshold = 200) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > threshold);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // estado inicial

    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}


function useEscape(fn) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && fn && fn();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fn]);
}

/* ========= Dropdown ========= */
function Dropdown({ label, items, open, setOpen, id, parentHref }) {
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [open, setOpen]);

  useEscape(() => setOpen(false));

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {parentHref ? (
        <SmartLink
          href={parentHref}
          className={`${LINK_BASE} inline-flex items-center gap-1.5`}
          onClick={() => setOpen(false)}
        >
          <span>{label}</span>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </SmartLink>
      ) : (
        <button
          className={`${LINK_BASE} inline-flex items-center gap-1.5`}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{label}</span>
          <svg
            className={`h-4 w-4 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z" />
          </svg>
        </button>
      )}

      <AnimatePresence>
        {open && items?.length > 0 && (
          <motion.div
            ref={ref}
            id={id}
            role="menu"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0C212D]/98 backdrop-blur-2xl ring-1 ring-white/5 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.7)]"
          >
            <div className="p-2" role="none">
              {items.map((it, idx) => (
                <motion.div
                  key={it.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <SmartLink
                    role="menuitem"
                    href={it.href}
                    className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/90 hover:text-white hover:bg-gradient-to-r hover:from-[#FF3816]/10 hover:to-transparent transition-all duration-200 outline-none focus:bg-white/10 focus:text-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-medium">{it.label}</span>
                    <svg
                      className="ml-auto h-4 w-4 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </SmartLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========= NAV por idioma ========= */
function useNavByLocale(messages) {
  const { locale } = useRouter();
  const loc = LOCALES.SUPPORTED.includes(locale) ? locale : LOCALES.DEFAULT;
  const p = PATHS[loc] || PATHS[LOCALES.DEFAULT];

  const nav = messages?.nav || {};
  const corp = nav?.corporate || {};
  const media = nav?.furtherMedia || {};

  const trainingLabel =
    loc === "es" ? "Capacitaciones" : corp?.training || "Training";

  const labels = {
    about: nav?.about || "About",
    corporate: corp?._ || "Corporate",
    training: trainingLabel,
    academy: corp?.academy || "Further Academy",
    furthermore: corp?.furthermore || "Furthermore",
    tefl: corp?.tefl || "TEFL",
    school: nav?.school || "School",
    media: media?._ || "Further Media",
    records: media?.records || "Further Records",
    youtube: media?.youtube || "YouTube",
    tiktok: media?.tiktok || "TikTok",
    faq: nav?.faq || "FAQ",
    cta: messages?.common?.cta?.contact || "Contact",
    ctaMobile: messages?.common?.cta?.contact || "Contact",
  };

  const NAV = [
  {
    label: labels.about,
    href: p.about,
    items: [
      { label: labels.about, href: p.about },
      { label: labels.faq, href: p.faq },
    ],
  },
  {
    label: labels.corporate,
    items: [
      { label: labels.training, href: p.corporate.training },
      { label: labels.academy, href: p.corporate.academy },
      { label: labels.furthermore, href: p.corporate.furthermore },
      { label: labels.tefl, href: p.corporate.tefl },
    ],
  },
  { label: labels.school, href: p.school },
  {
    label: labels.media,
    href: p.media.records,
    items: [
      { label: labels.records, href: `${p.media.records}#spotify` },
      { label: labels.youtube, href: `${p.media.records}#youtube` },
      { label: labels.tiktok, href: `${p.media.records}#tiktok` },
    ],
  },
  { label: "News", href: p.news },
];


  return { NAV, labels, paths: p, locale: loc };
}

/* ========= Navbar ========= */
export default function Navbar({ messages }) {
  const router = useRouter();
  const scrolled = useScrollColor(200);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState({});
  const [activePath, setActivePath] = useState("/");
  const { NAV, labels, paths: p } = useNavByLocale(messages);
  const [atHero, setAtHero] = useState(true);


  useEscape(() => {
    setOpen({});
    setMobileOpen(false);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prev = window.history.scrollRestoration;
    try {
      window.history.scrollRestoration = "manual";
    } catch {}
    return () => {
      try {
        window.history.scrollRestoration = prev || "auto";
      } catch {}
    };
  }, []);

  useEffect(() => {
  const hero = document.querySelector("#hero"); // el id del video-section
  if (!hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      setAtHero(entry.isIntersecting);
    },
    { rootMargin: "-80px 0px 0px 0px" } // dispara un poco antes del final
  );

  observer.observe(hero);
  return () => observer.disconnect();
}, []);

  useEffect(() => {
    const setFromAsPath = () =>
      setActivePath((router.asPath || "/").split("?")[0]);
    setFromAsPath();

    const onDone = (url) => {
      setActivePath(new URL(url, window.location.origin).pathname);
      setOpen({});
      setMobileOpen(false);
      const hasHash = url.includes("#");
      if (!hasHash) {
        const prefersReduce = window.matchMedia?.(
          "(prefers-reduced-motion: reduce)"
        )?.matches;
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: prefersReduce ? "auto" : "smooth",
        });
      }
    };

    router.events.on("routeChangeComplete", onDone);
    router.events.on("hashChangeComplete", onDone);
    return () => {
      router.events.off("routeChangeComplete", onDone);
      router.events.off("hashChangeComplete", onDone);
    };
  }, [router]);

  // ⤵️ Desktop: degradé arriba cuando NO está pinned; sólido cuando pinned
    const desktopWrap = useMemo(() => {
  const base =
    "hidden md:block md:fixed md:top-0 md:w-full md:z-50 transition-all duration-700 ease-out will-change-transform";

  const whenTop =
    "bg-transparent text-white shadow-none border-b border-transparent";

  const whenScrolled =
    "bg-[#0C212D]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]";

  return `${base} ${scrolled ? whenScrolled : whenTop}`;
}, [scrolled]);



  // Mobile bottom fixed (sin cambios)
  const mobileWrap =
    "md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0C212D]/95 backdrop-blur-xl border-t border-white/10";

  const isActive = (href) =>
    href && href !== "#" && activePath?.startsWith(href);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ===== Desktop Top Nav ===== */}
      <div className={desktopWrap}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <SmartLink
            href={p.home}
            className="flex items-center rounded-xl p-1 focus-visible:ring-2 focus-visible:ring-[#FF3816]/60 outline-none h-20"
          >
            <div className="relative h-full aspect-[16/5]">
              <Image
                src="/images/logo.png"
                alt={messages?.common?.brand || "Further Corporate"}
                fill
                priority
                className="object-contain"
                sizes="300px"
              />
            </div>
          </SmartLink>

          <div className="hidden items-center gap-2 md:flex">
            {NAV.map((item) =>
              item.items ? (
                <Dropdown
                  key={item.label}
                  label={item.label}
                  items={item.items}
                  id={`dd-${item.label}`}
                  open={!!open[item.label]}
                  parentHref={item.href}
                  setOpen={(v) =>
                    setOpen((s) => {
                      const closed = Object.keys(s).reduce(
                        (acc, k) => ((acc[k] = false), acc),
                        {}
                      );
                      return { ...closed, [item.label]: v };
                    })
                  }
                />
              ) : (
                <SmartLink
                  key={item.label}
                  href={item.href}
                  className={`${LINK_BASE} relative overflow-hidden`}
                  onClick={() => setActivePath(item.href)}
                >
                  <span className={isActive(item.href) ? "text-white" : ""}>
                    {item.label}
                  </span>
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="activeTab"
                      className={`${BRAND_GRAD} absolute -bottom-1 left-4 right-4 h-[3px] rounded-full`}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </SmartLink>
              )
            )}

            <div className="ml-1">
              <LanguageSwitcher />
            </div>

            <SmartLink
              href={p.contact}
              className="ml-2 relative inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#FF3816]/60 overflow-hidden group"
            >
              <span
                className={`${BRAND_GRAD} absolute inset-0 transition-transform duration-300 group-hover:scale-105`}
              />
              <span className="relative flex items-center gap-2">
                {labels.cta}
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </SmartLink>
          </div>
        </nav>
      </div>

      {/* ===== Mobile Bottom Nav ===== */}
      <div
        className={mobileWrap}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
          <SmartLink
            href={p.home}
            className="flex items-center rounded-xl p-1 outline-none h-12"
          >
            <div className="relative h-full aspect-[16/5]">
              <Image
                src="/images/logo.png"
                alt={messages?.common?.brand || "Further Corporate"}
                fill
                priority
                className="object-contain"
                sizes="220px"
              />
            </div>
          </SmartLink>
          <MenuButton
            open={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          />
        </nav>
      </div>

      {/* ===== Mobile Menu ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-gradient-to-br from-[#0C212D] via-[#0C212D] to-[#1a2f3d] z-[70] md:hidden overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-gradient-to-b from-[#0C212D] to-transparent backdrop-blur-xl z-10">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center h-14">
                    <div className="relative h-full aspect-[16/5]">
                      <Image
                        src="/images/logo.png"
                        alt={messages?.common?.brand || "Further Corporate"}
                        fill
                        priority
                        className="object-contain"
                        sizes="220px"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl p-2 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 6L18 18M6 18L18 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="px-6 pt-4">
                <LanguageSwitcher />
              </div>

              <div className="p-6 space-y-2">
                {useNavByLocale(messages).NAV.map((item, idx) =>
                  item.items ? (
                    <motion.details
                      key={item.label}
                      className="group"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      open={false}
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between rounded-2xl px-5 py-4 text-white/90 hover:bg-white/5 hover:text-white transition-all duration-200 bg-white/[0.02]">
                        <span className="font-semibold text-base">
                          {item.label}
                        </span>
                        <svg
                          className="h-5 w-5 transition-transform duration-300 group-open:rotate-180"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 111.04 1.08l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z" />
                        </svg>
                      </summary>
                      <div className="mt-2 ml-2 space-y-1 overflow-hidden">
                        {item.items.map((it, subIdx) => (
                          <motion.div
                            key={it.label}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: subIdx * 0.05 }}
                          >
                            <SmartLink
                              href={it.href}
                              className="flex items-center gap-3 rounded-xl px-5 py-3 text-sm hover:bg-gradient-to-r hover:from-[#FF3816]/10 hover:to-transparent hover:text-white text-white/80 transition-all duration-200"
                              onClick={() => setMobileOpen(false)}
                            >
                              <span className="font-medium">{it.label}</span>
                            </SmartLink>
                          </motion.div>
                        ))}
                      </div>
                    </motion.details>
                  ) : (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <SmartLink
                        href={item.href}
                        className="flex items-center justify-between rounded-2xl px-5 py-4 hover:bg-white/5 hover:text-white transition-all duration-200 bg-white/[0.02] text-white/90"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="font-semibold text-base">
                          {item.label}
                        </span>
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </SmartLink>
                    </motion.div>
                  )
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <SmartLink
                    href={p.contact}
                    className="mt-6 relative flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold text-white outline-none overflow-hidden group"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span
                      className={`${BRAND_GRAD} absolute inset-0 transition-transform duration-300 group-hover:scale-105`}
                    />
                    <span className="relative">{labels.cta}</span>
                    <svg
                      className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </SmartLink>
                </motion.div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-gradient-to-t from-[#0C212D] to-transparent">
                <p className="text-xs text-white/40 text-center">
                  © 2025 {messages?.common?.brand || "Further Corporate"}. All
                  rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ========= MenuButton ========= */
function MenuButton({ open, onClick }) {
  return (
    <button
      className="md:hidden relative rounded-xl p-2 text-white/90 hover:text-white focus-visible:ring-2 focus-visible:ring-[#FF3816]/60 outline-none hover:bg-white/5 transition-all duration-200"
      aria-label="Toggle menu"
      aria-expanded={open}
      onClick={onClick}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <motion.path
          d={open ? "M6 6L18 18" : "M4 6h16"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ d: open ? "M6 6L18 18" : "M4 6h16" }}
          transition={{ duration: 0.2 }}
        />
        <motion.path
          d="M4 12h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.1 }}
        />
        <motion.path
          d={open ? "M6 18L18 6" : "M4 18h16"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ d: open ? "M6 18L18 6" : "M4 18h16" }}
          transition={{ duration: 0.2 }}
        />
      </svg>
    </button>
  );
}
