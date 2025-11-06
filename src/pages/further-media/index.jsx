// /pages/further-media/index.jsx
// Further Media — i18n + Blubrry + Spotify + YouTube + TikTok
// Azul de secciones igual al Footer: #0A1628 (y fix de bleed en borde derecho)

import React from "react";
import Head from "next/head";
import Link from "next/link";
import { loadMessages } from "@/lib/i18n";
import { WaveToDark, WaveToLight } from "@/componentes/ui/Waves";
/* ========= Tokens ========= */
const BG_DARK = "bg-[#0A1628] text-white"; // hero igual al navbar (más oscuro)
const BG_BLUE = "bg-[#0A1628] text-white"; // azul igual al Footer
const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

/* Gradiente naranja→rojo */
const ACCENT = "from-[#EE7203] via-[#FF5A2B] to-[#FF3816]";
const GRAD = `bg-gradient-to-tr ${ACCENT}`;
const GRAD_TEXT = `bg-gradient-to-tr ${ACCENT} bg-clip-text text-transparent`;

/* Tipografías */
const TITLE_DARK = "text-white font-bold tracking-tight";
const SUB_DARK = "text-white/70";
const TITLE_LIGHT = "text-gray-900 font-bold tracking-tight";
const SUB_LIGHT = "text-gray-600";

/* Cards donde sí suman */
const CARD_GLASS =
  "rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.35)]";
const CARD_DARK =
  "rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-sm shadow-lg shadow-black/20";
const CARD_LIGHT = "rounded-[2rem] border border-gray-200 bg-white shadow-sm";

/* ===== Helpers: normalizo URLs de YouTube (id o url) ===== */
function toYouTubeEmbedSrc(idOrUrl = "") {
  return idOrUrl.startsWith("http")
    ? idOrUrl
        .replace("youtu.be/", "www.youtube.com/embed/")
        .replace("watch?v=", "embed/")
    : `https://www.youtube.com/embed/${idOrUrl}`;
}


/* ===== Defaults ===== */
const DEFAULT_BLUBRRY =
  "https://player.blubrry.com/3778744/playlist/?episodes=50&scroll=1&display=nw#undefined";
const DEFAULT_SPOTIFY_SHOW_ID = "1S9j1XZF0DscjTgITQOqH6";
const DEFAULT_YT = ["jkh2soMiyvM", "NSaMDoGdA60"];
const DEFAULT_TIKTOK_PROFILE = "@further_corporate";

/* ===== SVG Logos (accesibles) ===== */
function SpotifyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm4.43 14.57a.9.9 0 0 1-1.24.29c-3.39-2.07-7.67-2.54-12.7-1.38a.9.9 0 0 1-.41-1.76c5.45-1.26 10.15-.73 14 1.59a.9.9 0 0 1 .35 1.26Zm1.64-3.05a1 1 0 0 1-1.38.33c-3.88-2.37-9.79-3.07-14.37-1.67a1 1 0 1 1-.58-1.92c5.08-1.54 11.6-.76 15.96 1.9a1 1 0 0 1 .37 1.36Zm.14-3.21c-4.6-2.75-12.26-3-16.63-1.64a1.1 1.1 0 0 1-.64-2.11c4.9-1.48 13.25-1.19 18.48 1.94a1.1 1.1 0 0 1-1.21 1.87Z"
      />
    </svg>
  );
}

function YouTubeMusicIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...props}
    >
      {/* Círculo rojo */}
      <circle cx="12" cy="12" r="10" fill="#FF0000" />
      {/* Anillo blanco */}
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="#fff" strokeWidth="1.6" />
      {/* Triángulo blanco central */}
      <polygon points="10,8.5 10,15.5 15,12" fill="#fff" />
    </svg>
  );
}


function AmazonMusicIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M21.8 16.8c-3.6 2.3-7.2 3.4-10.8 3.4-3.6 0-7.1-1.1-10.8-3.4-.3-.2-.4-.6-.2-.9.2-.3.6-.4.9-.2 3.5 2.2 6.9 3.2 10.1 3.2 3.2 0 6.6-1 10.1-3.2.3-.2.7-.1.9.2.2.3.1.7-.2.9ZM6 7.5c0-.3.2-.5.5-.5h1c.3 0 .5.2.5.5v7c0 .3-.2.5-.5.5h-1c-.3 0-.5-.2-.5-.5v-7Zm4-1.5c0-.3.2-.5.5-.5h1c.3 0 .5.2.5.5v8.5c0 .3-.2.5-.5.5h-1c-.3 0-.5-.2-.5-.5V6Zm4 1c0-.3.2-.5.5-.5h1c.3 0 .5.2.5.5v7.5c0 .3-.2.5-.5.5h-1c-.3 0-.5-.2-.5-.5V7Zm4 2c0-.3.2-.5.5-.5h1c.3 0 .5.2.5.5v5.5c0 .3-.2.5-.5.5h-1c-.3 0-.5-.2-.5-.5V9Z"
      />
    </svg>
  );
}
function ApplePodcastsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 3 1.9 5.5 4.5 6.5l-1.5 5.4a1 1 0 0 0 1.2 1.2L12 21l2.8 1.1a1 1 0 0 0 1.2-1.2l-1.5-5.4A7 7 0 0 0 19 9a7 7 0 0 0-7-7Zm0 10.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"
      />
    </svg>
  );
}

/* ===== Page ===== */
export default function FurtherMediaPage({ messages }) {
  const t = messages?.furtherMedia ?? {};

  /* SEO */
  const metaTitle = t?.meta?.title || "Further Media";
  const metaDesc =
    t?.meta?.description ||
    "Podcast, YouTube and TikTok to help you learn English.";

  /* Embeds */
  const blubrrySrc =
    t?.podcast?.blubrry?.embedUrl || t?.blubrry?.embedUrl || DEFAULT_BLUBRRY;

  const spotifySrc =
    t?.spotify?.embedUrl ||
    (t?.spotify?.showId
      ? `https://open.spotify.com/embed/show/${t.spotify.showId}?utm_source=generator`
      : `https://open.spotify.com/embed/show/${DEFAULT_SPOTIFY_SHOW_ID}?utm_source=generator`);

  const ytIds =
    Array.isArray(t?.youtube?.videoIds) && t.youtube.videoIds.length
      ? t.youtube.videoIds
      : DEFAULT_YT;

  const tiktokEmbed =
    t?.tiktok?.embedUrl ||
    (t?.tiktok?.videoId
      ? `https://www.tiktok.com/embed/v2/video/${t.tiktok.videoId}`
      : null);

  const tiktokProfileUrl =
    t?.tiktok?.profileUrl ||
    (t?.tiktok?.profile
      ? `https://www.tiktok.com/${t.tiktok.profile.replace(/^@/, "")}`
      : `https://www.tiktok.com/${DEFAULT_TIKTOK_PROFILE.replace(/^@/, "")}`);

  return (
    <>
      {/* ===== Head: SEO + preconnect ===== */}
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://your-domain.com/further-media" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Further Corporate" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta
          property="og:url"
          content="https://your-domain.com/further-media"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />

        <link rel="preconnect" href="https://open.spotify.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="" />
        <link
          rel="preconnect"
          href="https://player.blubrry.com"
          crossOrigin=""
        />
        <link rel="preconnect" href="https://www.tiktok.com" crossOrigin="" />
      </Head>

      {/* Skip link a11y */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:text-[#0A1628] focus:bg-white"
      >
        Skip to content
      </a>

      {/* ===== Layout ===== */}
      <main className={`${BG_DARK} min-h-screen overflow-x-clip`} id="top">
        {/* === HERO (oscuro profundo) — recortado contra bleed === */}
        <section
          className="relative z-10 overflow-hidden"
          aria-labelledby="media-hero-title"
        >
          {/* orbs sutiles dentro del section */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
          >
            <div className="absolute -top-28 -right-24 h-72 w-72 rounded-full bg-[#EE7203]/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#FF3816]/20 blur-3xl" />
          </div>

          <div className={`${SHELL} pt-28 pb-16 lg:pt-36 lg:pb-24`}>
            <div className="grid gap-10 lg:grid-cols-[1.12fr_1fr] lg:items-center">
              {/* Copy */}
              <div className="space-y-8">
                <div>
                  <h1
                    id="media-hero-title"
                    className={`${TITLE_DARK} text-4xl sm:text-5xl lg:text-6xl leading-[1.08]`}
                  >
                    <span className="block mb-2">
                      {t?.hero?.title || "Further Media"}
                    </span>
                    <span className={`${GRAD_TEXT}`}>
                      {t?.hero?.subtitle ||
                        "Podcast, YouTube & TikTok to learn better, faster."}
                    </span>
                  </h1>
                  <p className="mt-4 text-white/80 max-w-2xl">
                    {t?.hero?.description ||
                      "Bite-sized content with real-world English, pronunciation tips, and themed vocabulary."}
                  </p>
                </div>

                {/* Nav anclas */}
                <nav
                  className="sticky top-0 z-30 rounded-2xl border border-white/10 bg-[#0A1628]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0A1628]/60"
                  aria-label={t?.nav?.label || "Section navigation"}
                >
                  <ul className="flex flex-wrap gap-2 p-2">
                    {[
                      { href: "#podcast", label: t?.nav?.podcast || "Podcast" },
                      { href: "#spotify", label: t?.nav?.spotify || "Spotify" },
                      { href: "#youtube", label: t?.nav?.youtube || "YouTube" },
                      { href: "#tiktok", label: t?.nav?.tiktok || "TikTok" },
                      { href: "#apps", label: t?.nav?.apps || "Apps" },
                      { href: "#classes", label: t?.nav?.classes || "Classes" },
                    ].map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white/90 hover:text-white ring-inset ring-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 hover:bg-white/5 transition"
                        >
                          <span className={`h-2 w-2 rounded-full ${GRAD}`} />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Visual */}
              <div className={`${CARD_GLASS} p-2`}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                  <img
                    src={
                      t?.hero?.imageSrc ||
                      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1480&auto=format&fit=crop"
                    }
                    alt={t?.hero?.imageAlt || "Podcast production desk"}
                    className="object-cover w-full h-full"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                {t?.hero?.caption && (
                  <div className="mt-4 px-4 pb-2 text-sm text-white/65">
                    {t.hero.caption}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Baja a sección blanca */}
          <WaveToLight />
        </section>

        {/* === INTRO (blanco) === */}
        <section
          className="bg-white text-gray-900"
          aria-labelledby="records-title"
        >
          <div className={`${SHELL} py-12`}>
            <header className="mb-6">
              <h2
                id="records-title"
                className={`${TITLE_LIGHT} text-3xl sm:text-4xl`}
              >
                {t?.records?.title ||
                  "Further Records: The podcast for English learners"}
              </h2>
              <p className={`${SUB_LIGHT} mt-2 max-w-3xl`}>
                {t?.records?.intro ||
                  "Our English podcast complements the #FurtherExperience. Learn topic-based English with tailored exercises to reinforce comprehension and pronunciation."}
              </p>
            </header>

            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-4">
                <p className="text-gray-800">
                  {t?.records?.body ||
                    "Vocabulary breakdowns and short clips are available on our YouTube channel with engaging characters."}
                </p>
              </div>

              <div className="md:col-span-5">
                <div className={`${CARD_LIGHT} p-6 relative overflow-hidden`}>
                  <div
                    className="absolute -top-12 -right-12 h-56 w-56 rounded-full blur-3xl opacity-30"
                    style={{
                      background:
                        "radial-gradient(circle, #EE7203 0%, transparent 60%)",
                    }}
                  />
                  <div className="h-28 rounded-xl bg-gray-50 border border-gray-200 grid place-items-center">
                    <span className={`text-sm font-semibold ${GRAD_TEXT}`}>
                      Further Records
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sube a banda azul (PODCAST) — color Footer */}
          <WaveToDark />
        </section>

        {/* === PODCAST (Blubrry) — azul Footer, iframe limpio === */}
        <section
          id="podcast"
          className={BG_BLUE}
          aria-labelledby="podcast-title"
        >
          <div className={`${SHELL} py-12`}>
            <h3
              id="podcast-title"
              className={`${TITLE_DARK} text-2xl sm:text-3xl mb-4`}
            >
              {t?.podcast?.title ||
                t?.spotify?.title ||
                "Further Records — Podcast"}
            </h3>

            <div className="w-full">
              <iframe
                title={t?.podcast?.title || "Further Records — Podcast"}
                src={blubrrySrc}
                className="w-full"
                style={{ minHeight: 560, border: "none" }}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </section>

        {/* === SPOTIFY (azul Footer) — sin contenedor, se adapta === */}
        <section
          id="spotify"
          className={BG_BLUE}
          aria-labelledby="spotify-title"
        >
          <div className={`${SHELL} py-12`}>
            <h3
              id="spotify-title"
              className={`${TITLE_DARK} text-2xl sm:text-3xl mb-4`}
            >
              {t?.spotify?.title || "Further Records on Spotify"}
            </h3>

            <div className="w-full">
              <iframe
                title={t?.spotify?.title || "Further Records on Spotify"}
                src={spotifySrc}
                className="w-full"
                height={352}
                style={{ border: "none", borderRadius: 12 }}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>

          {/* Hacia Apps (blanco) */}
          <WaveToLight/>
        </section>

        {/* === APPS (blanco) con logos === */}
        <section
          id="apps"
          className="bg-white text-gray-900"
          aria-labelledby="apps-title"
        >
          <div className={`${SHELL} py-12`}>
            <h4 id="apps-title" className={`${TITLE_LIGHT} text-2xl mb-5`}>
              {t?.apps?.title || "Also available on"}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href={t?.apps?.spotifyUrl || "https://www.youtube.com/playlist?app=desktop&list=PLNccVrIVJ8qP2ACXgZOUSzLvhBWL-REbs"}
                target="_blank"
                rel="noopener noreferrer"
                className={`${CARD_LIGHT} p-5 flex items-center justify-center gap-3 hover:bg-gray-50 transition outline-none focus-visible:ring-2 focus-visible:ring-gray-300`}
                aria-label="Open on Spotify"
              >
                <YouTubeMusicIcon className="h-6 w-6 text-[#1DB954]" />
                <span className="font-semibold text-gray-900">Youtube Music</span>
              </a>
              <a
                href={t?.apps?.amazonUrl || "https://music.amazon.com/podcasts/5caa1c4a-442f-475c-b2b7-96587d0eecc2/further-records"}
                target="_blank"
                rel="noopener noreferrer"
                className={`${CARD_LIGHT} p-5 flex items-center justify-center gap-3 hover:bg-gray-50 transition outline-none focus-visible:ring-2 focus-visible:ring-gray-300`}
                aria-label="Open on Amazon Music"
              >
                <AmazonMusicIcon className="h-6 w-6 text-[#232F3E]" />
                <span className="font-semibold text-gray-900">
                  Amazon Music
                </span>
              </a>
              <a
                href={t?.apps?.appleUrl || "https://podcasts.apple.com/es/podcast/further-records/id1771034234"}
                target="_blank"
                rel="noopener noreferrer"
                className={`${CARD_LIGHT} p-5 flex items-center justify-center gap-3 hover:bg-gray-50 transition outline-none focus-visible:ring-2 focus-visible:ring-gray-300`}
                aria-label="Open on Apple Podcasts"
              >
                <ApplePodcastsIcon className="h-6 w-6 text-[#A970FF]" />
                <span className="font-semibold text-gray-900">
                  Apple Podcasts
                </span>
              </a>
            </div>
          </div>

          {/* Sube a CLASSES (azul Footer) */}
          <WaveToDark />
        </section>

        {/* === CLASSES (azul Footer) === */}
        <section
          id="classes"
          className={BG_BLUE}
          aria-labelledby="classes-title"
        >
          <div className={`${SHELL} py-12`}>
            <h4
              id="classes-title"
              className={`${TITLE_DARK} text-2xl sm:text-3xl mb-3`}
            >
              {t?.classes?.title || "English classes that go further"}
            </h4>
            <p className="text-white/85 max-w-3xl">
              {t?.classes?.body ||
                "Each course includes complementary material to reinforce concepts beyond the classroom."}
            </p>
          </div>
        </section>

        {/* === YOUTUBE (azul Footer) === */}
        <section
          id="youtube"
          className={BG_BLUE}
          aria-labelledby="youtube-title"
        >
          <div className={`${SHELL} py-12`}>
            <h4
              id="youtube-title"
              className={`${TITLE_DARK} text-2xl sm:text-3xl mb-4`}
            >
              {t?.youtube?.title || "Further Corporate on YouTube"}
            </h4>

            <div className="grid md:grid-cols-2 gap-6">
              {[ytIds[0], ytIds[1]].map((vid, i) => (
                <div key={i} className={`${CARD_DARK} overflow-hidden`}>
                  <div className="relative pt-[56.25%]">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={toYouTubeEmbedSrc(vid)}
                      title={
                        t?.youtube?.title || "Further Corporate on YouTube"
                      }
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-6">
              <a
                href={t?.youtube?.channelUrl || "https://www.youtube.com/"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-white/15 hover:bg-white/5 transition outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {t?.youtube?.cta || "Visit our YouTube channel"}
              </a>
            </div>
          </div>

          {/* Hacia TikTok (blanco) */}
          <WaveToLight/>
        </section>

        {/* === TIKTOK (blanco) === */}
        <section
          id="tiktok"
          className="bg-white text-gray-900"
          aria-labelledby="tiktok-title"
        >
          <div className={`${SHELL} py-12`}>
            {tiktokEmbed ? (
              <div className={`${CARD_LIGHT} overflow-hidden`}>
                {/* 9:16 */}
                <div className="relative pt-[177.77%]" />
                <iframe
                  className="absolute inset-0 h-full w-full rounded-b-[2rem]"
                  src="https://www.tiktok.com/@further_corporate"
                  title={t?.tiktok?.title || "Further Corporate on TikTok"}
                  frameBorder="0"
                  allow="encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ) : (
              <div className={`${CARD_LIGHT} p-6 text-center`}>
                <h4
                  id="tiktok-title"
                  className={`${TITLE_LIGHT} text-2xl mb-2`}
                >
                  {t?.tiktok?.title || "Further Corporate on TikTok"}
                </h4>
                <p className={`${SUB_LIGHT} mb-4`}>
                  {t?.tiktok?.body || "Follow us for more short-form practice."}
                </p>
                <div className="text-center mt-6">
              <a
                href="https://www.tiktok.com/@further_corporate"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 transition outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
              >
                {t?.tiktok?.title || "Further Corporate on TikTok"}
              </a>
            </div>
              </div>
            )}

            
          </div>

          {/* Sube a CTA final (azul Footer) */}
          <WaveToDark />
        </section>

        {/* === CTA final (azul Footer) === */}
        <section className={BG_BLUE} aria-labelledby="cta-title">
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
                  id="cta-title"
                  className={`${TITLE_DARK} text-3xl sm:text-4xl`}
                >
                  <span className={GRAD_TEXT}>Practice makes progress.</span>
                </h3>
                <p className="mt-2 text-white/80 max-w-2xl">
                  {t?.cta?.body ||
                    "Join our classes and power up your English with real media."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/contacto"
                    className="inline-flex items-center rounded-xl px-5 py-3 font-semibold text-[#0C212D] bg-white hover:bg-white/90 transition outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    {t?.cta?.primary || "Request consultation"}
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center rounded-xl px-5 py-3 font-semibold text-white border border-white/15 hover:bg-white/5 transition outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    {t?.cta?.secondary || "Back to Home"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* a11y anchor */}
        <div id="main-content" className="sr-only" />
      </main>
    </>
  );
}

/* ===== i18n loader (Pages Router) ===== */
export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: await loadMessages(locale),
    },
  };
}
