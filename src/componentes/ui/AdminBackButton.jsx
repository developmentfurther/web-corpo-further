// /componentes/admin/AdminBackButton.jsx
"use client";
import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";

export default function AdminBackButton({ label = "Volver", className = "" }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={`flex items-center gap-2 text-white/70 hover:text-white transition ${className}`}
    >
      <FiArrowLeft className="text-lg" />
      <span className="text-sm">{label}</span>
    </button>
  );
}
