import React, { useEffect } from "react";
import Image from "next/image";

function Loader() {
  useEffect(() => {
    // Bloquear scroll Y mientras el loader está montado
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0C212D] overflow-hidden">
      {/* Glow animado detrás del logo */}
      <div className="absolute w-60 h-60 rounded-full bg-gradient-to-tr from-[#EE7203] to-[#FF3816] blur-3xl opacity-30 animate-pulse" />

      {/* Logo */}
      <div className="relative flex flex-col items-center gap-4"></div>
    </div>
  );
}

export default Loader;
