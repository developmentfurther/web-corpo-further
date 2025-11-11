import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ContextGeneral from "@/services/contextGeneral";

export default function withAdminGuard(Component) {
  return function ProtectedPage(props) {
    const { user, isAdmin, checkingAuth, authReady, twoFAStatus } =
      useContext(ContextGeneral);
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (!checkingAuth && authReady) {
        // 🔹 1. No hay usuario → login
        if (!user) {
          router.replace("/login");
          return;
        }

        // 🔹 2. Usuario sin permisos → home
        if (!isAdmin) {
          router.replace("/");
          return;
        }

        // 🔹 3. 2FA requerido pero no verificado
        if (twoFAStatus === "unverified" || twoFAStatus === "disabled") {
          console.log("🔐 Redirigiendo a verificación 2FA...");
          router.replace("/2fa");
          return;
        }

        // 🔹 4. 2FA correcto → permitir acceso
        if (twoFAStatus === "ok") {
          setAuthorized(true);
        }
      }
    }, [user, isAdmin, checkingAuth, authReady, twoFAStatus, router]);

    if (checkingAuth || !authReady) {
      return (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Verificando acceso…
        </div>
      );
    }

    if (!authorized) return null;

    return <Component {...props} />;
  };
}
