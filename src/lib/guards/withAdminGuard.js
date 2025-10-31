// /lib/guards/withAdminGuard.jsx
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import ContextGeneral from "@/services/contextGeneral";

export default function withAdminGuard(Component) {
  return function ProtectedPage(props) {
    const { user, isAdmin, ready, checkingAuth } = useContext(ContextGeneral);
    const router = useRouter();

    useEffect(() => {
      if (!checkingAuth && ready) {
        if (!user) router.replace("/login");
        else if (!isAdmin) router.replace("/");
      }
    }, [user, isAdmin, ready, checkingAuth, router]);

    if (!ready || checkingAuth) {
      return (
        <div className="min-h-screen flex items-center justify-center text-gray-500">
          Loading...
        </div>
      );
    }

    if (!user || !isAdmin) return null;
    return <Component {...props} />;
  };
}