// pages/404.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    // Redirige al home cuando alguien entra a una ruta inexistente
    router.replace("/");
  }, [router]);

  // Podés devolver un loader mientras redirige
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0C212D] text-white">
      <p className="animate-pulse">Redirecting to home...</p>
    </div>
  );
}
