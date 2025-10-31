// src/pages/_app.js
import "@/styles/globals.css";
import Context from "@/services/context";
// 👇 ajustá el path real de tu layout
import Layout from "@/componentes/Layout";
import { IntlProvider } from "next-intl";

export default function App({ Component, pageProps, router }) {
  const locale = router?.locale || "es";
  const messages = pageProps?.messages || {};

  return (
    <IntlProvider
      locale={locale}
      defaultLocale="es"
      messages={messages}
      timeZone="UTC" // opcional
      now={new Date()} // opcional
    >
      <Context>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Context>
    </IntlProvider>
  );
}
