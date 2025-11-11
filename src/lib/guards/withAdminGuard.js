import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ContextGeneral from "@/services/contextGeneral";

export default function withAdminGuard(Component) {
  return function ProtectedPage(props) {
    const { user, ready, checkingAuth, isAdmin } = useContext(ContextGeneral);
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      // Esperar a que Firebase termine su chequeo
      if (checkingAuth || !ready) return;

      // 🔹 1. Usuario no autenticado
      if (!user) {
        router.replace("/login");
        return;
      }

      // 🔹 2. Usuario autenticado pero no admin
      if (!isAdmin) {
        router.replace("/");
        return;
      }

      // 🔹 3. Usuario autorizado → mostrar contenido
      setAuthorized(true);
    }, [user, ready, checkingAuth, isAdmin, router]);

    // Mientras Firebase verifica
    if (checkingAuth || !ready) {
      return (
        <div className="min-h-screen flex items-center justify-center text-gray-400 bg-[#0A1628]">
          Cargando sesión segura…
        </div>
      );
    }

    // Aún no autorizado → no renderiza contenido sensible
    if (!authorized) return null;

    // ✅ Usuario admin: render real
    return <Component {...props} />;
  };
}
