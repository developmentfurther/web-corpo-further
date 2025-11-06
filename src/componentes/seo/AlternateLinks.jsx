import Head from "next/head";
import { useRouter } from "next/router";

const LOCALES = ["es", "en"];
const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tu-dominio.com";

export default function AlternateLinks() {
  const { asPath, locale } = useRouter();
  const path = asPath === "/" ? "" : asPath;

  // defaultLocale = 'es' (sin prefijo). 'en' lleva /en
  const hrefFor = (l) => `${BASE}${l === "es" ? "" : `/${l}`}${path}`;

  return (
    <Head>
      {LOCALES.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={hrefFor(l)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${BASE}${path}`} />
      {/* Canonical por idioma (simple) */}
      <link rel="canonical" href={hrefFor(locale || "es")} />
    </Head>
  );
}
