import { useEffect, useState } from "react";
import withAdminGuard from "@/lib/guards/withAdminGuard";
import Link from "next/link";
import { listBlogs, deleteBlog } from "@/lib/firestore/blogs";
import { getAuth, signOut } from "firebase/auth";
import firebaseApp from "@/services/firebase";
import { useRouter } from "next/router";
import AdminBackButton from "@/componentes/ui/AdminBackButton";
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiGlobe, FiCheckCircle, FiClock } from "react-icons/fi";
import { motion } from "framer-motion";

function AdminBlogsList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const auth = getAuth(firebaseApp);

  const load = async () => {
    setLoading(true);
    try {
      const items = await listBlogs();
      setRows(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (slug) => {
    if (!confirm(`Eliminar "${slug}"? Se borrarán todas las traducciones.`)) return;
    await deleteBlog(slug);
    await load();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0C212D] to-[#0A1628] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#EE7203] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white/70 text-lg font-medium">Cargando blogs...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#0C212D] to-[#0A1628] text-white pt-28 pb-12 px-6">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#EE7203]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#FF3816]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <AdminBackButton />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                Gestión de{" "}
                <span className="bg-gradient-to-r from-[#EE7203] to-[#FF3816] bg-clip-text text-transparent">
                  Blogs
                </span>
              </h1>
              <p className="text-white/60">
                {rows.length} {rows.length === 1 ? 'artículo' : 'artículos'} publicados
              </p>
            </div>

            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#EE7203] to-[#FF3816] text-white font-bold shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
            >
              <FiPlus className="w-5 h-5" />
              Nuevo Blog
            </Link>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium mb-1">Total</p>
                  <p className="text-3xl font-bold text-white">{rows.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EE7203]/20 to-[#FF3816]/20 flex items-center justify-center">
                  <FiGlobe className="w-6 h-6 text-[#EE7203]" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium mb-1">Públicos</p>
                  <p className="text-3xl font-bold text-white">
                    {rows.filter(r => r.status === 'public').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <FiCheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-medium mb-1">No listados</p>
                  <p className="text-3xl font-bold text-white">
                    {rows.filter(r => r.status === 'unlisted').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center">
                  <FiClock className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-sm font-bold text-white/80 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-white/80 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-white/80 uppercase tracking-wider">
                    Idiomas
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-bold text-white/80 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((r, i) => (
                  <motion.tr
                    key={r.slug}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#EE7203] to-[#FF3816]" />
                        <span className="font-medium text-white">{r.slug}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          r.status === 'public'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}
                      >
                        {r.status === 'public' ? (
                          <>
                            <FiCheckCircle className="w-3 h-3" />
                            Público
                          </>
                        ) : (
                          <>
                            <FiClock className="w-3 h-3" />
                            No listado
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiGlobe className="w-4 h-4 text-[#EE7203]" />
                        <span className="text-white/70 text-sm">
                          {Array.isArray(r.locales) ? r.locales.join(", ") : "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/news/${r.slug}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-all hover:scale-105"
                          title="Ver artículo"
                        >
                          <FiEye className="w-4 h-4" />
                          Ver
                        </Link>
                        <Link
                          href={`/admin/blogs/${r.slug}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#EE7203]/20 hover:bg-[#EE7203]/30 text-[#EE7203] text-sm font-medium transition-all hover:scale-105 border border-[#EE7203]/30"
                          title="Editar artículo"
                        >
                          <FiEdit2 className="w-4 h-4" />
                          Editar
                        </Link>
                        <button
                          onClick={() => onDelete(r.slug)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-all hover:scale-105 border border-red-500/30"
                          title="Eliminar artículo"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                          <FiGlobe className="w-8 h-8 text-white/30" />
                        </div>
                        <p className="text-white/60 text-lg font-medium mb-2">
                          No hay blogs aún
                        </p>
                        <p className="text-white/40 text-sm mb-6">
                          Comienza creando tu primer artículo
                        </p>
                        <Link
                          href="/admin/blogs/new"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#EE7203] to-[#FF3816] text-white font-semibold hover:scale-105 transition-transform"
                        >
                          <FiPlus className="w-4 h-4" />
                          Crear primer blog
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer with pagination placeholder */}
          {rows.length > 0 && (
            <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">
                  Mostrando <span className="font-semibold text-white">{rows.length}</span> artículos
                </p>
                {/* Aquí podrías agregar paginación en el futuro */}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

export default withAdminGuard(AdminBlogsList);

/* === Ícono de logout === */
function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}