import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ContextGeneral from "@/services/contextGeneral";

export default function withAdminGuard(Component) {
  return function ProtectedPage(props) {
    const { user, ready, checkingAuth, isAdmin } = useContext(ContextGeneral);
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (!checkingAuth && ready) {
        // 🔹 1. Usuario no autenticado → al login
        if (!user) {
          router.replace("/login");
          return;
        }

        // 🔹 2. Usuario autenticado pero no admin → fuera
        if (!isAdmin) {
          router.replace("/");
          return;
        }

        // 🔹 3. Usuario autorizado
        setAuthorized(true);
      }
    }, [user, ready, checkingAuth, isAdmin, router]);

    if (checkingAuth || !ready) {
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
