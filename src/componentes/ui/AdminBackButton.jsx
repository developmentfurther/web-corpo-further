// /componentes/admin/AdminBackButton.jsx
"use client";
import { useRouter } from "next/router";
import { FiArrowLeft, FiHome } from "react-icons/fi";

export default function AdminBackButton({ 
  label = "Volver al panel", 
  className = "",
  showIcon = true,
  variant = "default" // "default" | "minimal" | "gradient"
}) {
  const router = useRouter();

  const baseStyles = "group relative inline-flex items-center gap-2.5 font-medium transition-all duration-300";
  
  const variants = {
    default: `
      px-4 py-2.5 rounded-xl
      bg-white/5 hover:bg-white/10
      border border-white/10 hover:border-white/20
      text-white/70 hover:text-white
      shadow-lg shadow-black/5
      backdrop-blur-sm
    `,
    minimal: `
      px-3 py-2 rounded-lg
      text-white/60 hover:text-white
      hover:bg-white/5
    `,
    gradient: `
      px-5 py-3 rounded-xl
      bg-gradient-to-r from-white/10 to-white/5
      hover:from-white/15 hover:to-white/10
      border border-white/20
      text-white shadow-xl shadow-orange-500/10
      hover:shadow-orange-500/20
      backdrop-blur-md
    `
  };

  return (
    <button
      onClick={() => router.push("/admin")}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {/* Efecto de hover animado */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#EE7203]/0 to-[#FF3816]/0 group-hover:from-[#EE7203]/5 group-hover:to-[#FF3816]/5 transition-all duration-300" />
      
      {/* Contenido */}
      <div className="relative flex items-center gap-2.5">
        {showIcon && (
          <div className="relative">
            {/* Icono con animación */}
            <FiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            
            {/* Icono de home que aparece en hover */}
            
          </div>
        )}
        
        <span className="text-sm tracking-wide">
          {label}
        </span>
      </div>
      
      {/* Línea decorativa inferior */}
      {variant === "gradient" && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-4/5 bg-gradient-to-r from-[#EE7203] to-[#FF3816] transition-all duration-500 rounded-full" />
      )}
    </button>
  );
}