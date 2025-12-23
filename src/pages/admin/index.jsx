import Link from "next/link";
import { FiFileText, FiInstagram, FiUsers, FiSettings, FiLogOut } from "react-icons/fi";
import withAdminGuard from "@/lib/guards/withAdminGuard";
import { useContext } from "react";
import ContextGeneral from "@/services/contextGeneral";
import { useRouter } from "next/router";

function AdminDashboard() {
  const { user, logout } = useContext(ContextGeneral);
  const router = useRouter();


  const modules = [
    {
      title: "Blogs",
      href: "/admin/blogs",
      icon: <FiFileText className="w-7 h-7" />,
      desc: "Crear, editar y gestionar los artículos del blog corporativo.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Instagram",
      href: "/admin/instagram",
      icon: <FiInstagram className="w-7 h-7" />,
      desc: "Administrá los posts de Instagram que aparecen en la web.",
      gradient: "from-pink-500 to-purple-600",
    },
    {
      title: "Usuarios",
      href: "#",
      icon: <FiUsers className="w-7 h-7" />,
      desc: "Gestión de usuarios y permisos administrativos.",
      disabled: true,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Configuración",
      href: "#",
      icon: <FiSettings className="w-7 h-7" />,
      desc: "Ajustes generales del panel y del sitio.",
      disabled: true,
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent"></div>
      
      <div className="relative z-10 py-16 px-6 pt-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-16">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-block mb-4">
                  <span className="text-sm font-semibold tracking-wider text-orange-400 uppercase bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20">
                    Admin Dashboard
                  </span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-black mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                    Further
                  </span>
                  <br />
                  <span className="text-white/90">Control Center</span>
                </h1>
                <p className="text-xl text-white/60 font-light">
                  Bienvenido{user?.email ? (
                    <span className="text-white/80 font-medium">, {user.email}</span>
                  ) : ""}
                </p>
              </div>

              {/* Botón logout mejorado */}
              <button
                onClick={logout}
                className="group px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-red-500/20"
              >
                <FiLogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-semibold">Cerrar sesión</span>
              </button>
            </div>

            <p className="text-lg text-white/50 max-w-2xl">
              Seleccioná un módulo para gestionar el contenido de la plataforma
            </p>
          </header>

          {/* Grid de módulos */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {modules.map((m) =>
              m.disabled ? (
                <div
                  key={m.title}
                  className="group relative bg-white/[0.02] backdrop-blur-sm border border-white/5 rounded-3xl p-8 overflow-hidden opacity-60 cursor-not-allowed"
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-5`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${m.gradient} opacity-40`}>
                        {m.icon}
                      </div>
                      <span className="text-xs font-bold text-white/30 uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full">
                        Próximamente
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3 text-white/70">
                      {m.title}
                    </h2>
                    
                    <p className="text-white/40 text-sm leading-relaxed mb-6">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ) : (
                <Link 
                  key={m.title} 
                  href={m.href} 
                  className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-3xl p-8 overflow-hidden hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10"
                >
                  {/* Gradient hover effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Animated border gradient */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${m.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${m.gradient} opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                        {m.icon}
                      </div>
                      <div className="text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3 text-white/90 group-hover:text-white transition-colors duration-300">
                      {m.title}
                    </h2>
                    
                    <p className="text-white/50 text-sm leading-relaxed mb-6 group-hover:text-white/70 transition-colors duration-300">
                      {m.desc}
                    </p>
                    
                    <div className={`inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${m.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all duration-300`}>
                      <span>Acceder al módulo</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAdminGuard(AdminDashboard);