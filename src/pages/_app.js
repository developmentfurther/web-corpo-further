// src/pages/_app.js
import "@/styles/globals.css";
import Context from "@/services/context";
// 👇 ajustá el path real de tu layout
import Layout from "@/componentes/Layout";
import { IntlProvider } from "next-intl";

export default function App({ Component, pageProps, router }) {
  const locale = router?.locale || "es";
  const messages = pageProps?.messages || {}; // ← fallback vacío evita loop

  return (
   <IntlProvider
  locale={locale}
  defaultLocale="es"
  messages={messages}
  onError={(err) => {
    // ✅ Solo mostrar una vez por sesión
    if (typeof window !== "undefined") {
      if (!window.__i18nWarned) window.__i18nWarned = new Set();
      if (window.__i18nWarned.has(err.message)) return;
      window.__i18nWarned.add(err.message);
    }

    // Mostrar solo en desarrollo
    if (process.env.NODE_ENV === "development") {
      console.warn("🌐 i18n fallback:", err.message);
    }
  }}
  getMessageFallback={({ key }) => key} // muestra la key en pantalla si falta
>

      <Context>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Context>
    </IntlProvider>
  );
}