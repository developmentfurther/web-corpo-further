// lib/guards/withAdminGuard.js
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ContextGeneral from "@/services/contextGeneral";

function Protected({ Component, props }) {
  const { user, ready, checkingAuth, isAdmin } = useContext(ContextGeneral);
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (checkingAuth || !ready) return;
    if (!user) return router.replace("/login");
    if (!isAdmin) return router.replace("/");
    setAuthorized(true);
  }, [user, ready, checkingAuth, isAdmin, router]);

  if (checkingAuth || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 bg-[#0A1628]">
        Cargando sesión segura…
      </div>
    );
  }

  if (!authorized) return null;

  return <Component {...props} />;
}

// 🚫 Desactiva SSR para páginas protegidas
export default function withAdminGuard(Component) {
  return dynamic(() => Promise.resolve((props) => (
    <Protected Component={Component} props={props} />
  )), { ssr: false });
}
