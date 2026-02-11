// /lib/guards/withAdminGuard.js
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ContextGeneral from "@/services/contextGeneral";

export default function withAdminGuard(Component) {
  return function ProtectedPage(props) {
    const { user, ready, checkingAuth, isAdmin } =
      useContext(ContextGeneral);
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
  if (checkingAuth || !ready) return;

  if (!user) {
    router.replace("/login");
    return;
  }

  if (!isAdmin) {
    router.replace("/unauthorized");
    return;
  }

  setAuthorized(true);
}, [user, ready, checkingAuth, isAdmin]);


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
