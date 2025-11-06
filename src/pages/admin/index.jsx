// /pages/admin/index.jsx
import Link from "next/link";
import { FiFileText, FiInstagram, FiUsers, FiSettings } from "react-icons/fi";
import withAdminGuard from "@/lib/guards/withAdminGuard";

const CARD =
  "bg-white/[0.05] border border-white/10 rounded-2xl p-6 flex flex-col items-start justify-between transition hover:bg-white/[0.08] hover:border-white/20";
const GRAD_TEXT =
  "bg-gradient-to-r from-[#EE7203] via-[#FF4D1F] to-[#FF3816] bg-clip-text text-transparent";

function AdminDashboard() {
  const modules = [
    {
      title: "Blogs",
      href: "/admin/blogs",
      icon: <FiFileText className="w-6 h-6" />,
      desc: "Crear, editar y gestionar los artículos del blog corporativo.",
    },
    {
      title: "Instagram",
      href: "/admin/instagram",
      icon: <FiInstagram className="w-6 h-6" />,
      desc: "Administrá los posts de Instagram que aparecen en la web.",
    },
    {
      title: "Usuarios (próximamente)",
      href: "#",
      icon: <FiUsers className="w-6 h-6 opacity-50" />,
      desc: "Gestión de usuarios y permisos administrativos.",
      disabled: true,
    },
    {
      title: "Configuración (próximamente)",
      href: "#",
      icon: <FiSettings className="w-6 h-6 opacity-50" />,
      desc: "Ajustes generales del panel y del sitio.",
      disabled: true,
    },
  ];

  return (
    <main className="min-h-screen bg-[#0A1628] text-white py-16 px-6 pt-28">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold">
            Panel de{" "}
            <span className={GRAD_TEXT}>Administración Further</span>
          </h1>
          <p className="text-white/70 mt-3">
            Bienvenido al panel de gestión. Seleccioná un módulo para comenzar.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) =>
            m.disabled ? (
              <div
                key={m.title}
                className={`${CARD} opacity-50 cursor-not-allowed`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {m.icon}
                  <h2 className="text-xl font-semibold">{m.title}</h2>
                </div>
                <p className="text-white/70 text-sm">{m.desc}</p>
              </div>
            ) : (
              <Link key={m.title} href={m.href} className={CARD}>
                <div className="flex items-center gap-3 mb-3">
                  {m.icon}
                  <h2 className="text-xl font-semibold">{m.title}</h2>
                </div>
                <p className="text-white/70 text-sm flex-1">{m.desc}</p>
                <div className="mt-5 text-sm font-medium text-[#FF6A1F]">
                  Ir al módulo →
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </main>
  );
}

export default withAdminGuard(AdminDashboard);
