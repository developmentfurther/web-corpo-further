// src/pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initial = await Document.getInitialProps(ctx);
    return { ...initial, locale: ctx?.locale || "es" };
  }

  render() {
    // ✅ Obtenemos el ID desde el .env
    const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
    const isProd = process.env.NODE_ENV === "production";

    return (
      <Html lang={this.props.locale}>
        <Head>
          {/* ✅ Google Tag Manager solo se carga en producción */}
          {isProd && GTM_ID && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                  })(window,document,'script','dataLayer','${GTM_ID}');
                `,
              }}
            />
          )}
        </Head>

        <body className="antialiased">
          {/* ✅ GTM noscript backup (solo producción) */}
          {isProd && GTM_ID && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              ></iframe>
            </noscript>
          )}

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
