// /lib/guards/withAdminGuard.js
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ContextGeneral from "@/services/contextGeneral";

export default function withAdminGuard(Component) {
  return function ProtectedPage(props) {
    const { user, ready, checkingAuth, isAdmin, twoFAStatus } =
      useContext(ContextGeneral);
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
      // 👇 Espera hasta que la autenticación esté completamente lista
      if (checkingAuth || !ready) return;

      // 1️⃣ Sin usuario → ir a login
      if (!user) {
        router.replace("/login");
        return;
      }

      // 2️⃣ Si hay usuario pero no completó el 2FA → ir a /2fa
      if (twoFAStatus && twoFAStatus !== "ok") {
        router.replace("/2fa");
        return;
      }

      // 3️⃣ Usuario autenticado pero sin permisos de admin → ir a inicio
      if (!isAdmin) {
        router.replace("/");
        return;
      }

      // ✅ Todo correcto → autorizado
      setAuthorized(true);
    }, [user, ready, checkingAuth, isAdmin, twoFAStatus, router]);

    if (checkingAuth || !ready) {
      return (
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Cargando acceso seguro…
        </div>
      );
    }

    if (!authorized) return null;

    return <Component {...props} />;
  };
}
