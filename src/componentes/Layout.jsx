// /componentes/Layout.jsx
import React, { useContext } from "react";
import Head from "next/head";
import Loader from "./Loader";
import ContextGeneral from "@/services/contextGeneral";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import dynamic from "next/dynamic";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ⬇️ Import client-only para evitar hydration mismatches
const MrFurther = dynamic(() => import("@/componentes/bot/MrFurther"), {
  ssr: false,
});

function Layout({ children }) {
  const context = useContext(ContextGeneral);
  const router = useRouter();

  const hideChrome =
    router?.pathname === "/dashboard/[id]" ||
    router?.asPath?.startsWith("/dashboard/");

  return (
    <div style={{ display: "grid" }}>
      <Head>
        <meta
          name="description"
          content="Corporate English programs for executives and companies."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </Head>

      {context.loader && <Loader />}

      {!hideChrome && <Navbar />}

      <Toaster />

      {/* Bot con avatar y SSR deshabilitado */}
      <MrFurther />

      <div className="min-h-dvh ">{children}</div>

      {!hideChrome && (
        <Footer
          onSubscribe={async (email) => {
            await addDoc(collection(context.firestore, "leads"), {
              email,
              createdAt: serverTimestamp(),
            });
            toast.success("Subscribed! Check your inbox.");
          }}
        />
      )}
    </div>
  );
}

export default Layout;

// En cada page
import { loadMessages } from "@/lib/i18n";
export async function getStaticProps({ locale = "es" }) {
  return { props: { messages: await loadMessages(locale) } };
}
