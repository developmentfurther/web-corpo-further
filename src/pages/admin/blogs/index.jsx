import { useEffect, useState } from "react";
import withAdminGuard from "@/lib/guards/withAdminGuard";
import Link from "next/link";
import { listBlogs, deleteBlog } from "@/lib/firestore/blogs";
import { getAuth, signOut } from "firebase/auth";
import firebaseApp from "@/services/firebase";
import { useRouter } from "next/router";

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

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut(auth); // Cierra sesión Firebase
      await fetch("/api/logout", { method: "POST" }); // Borra cookie de sesión
      localStorage.clear();
      sessionStorage.clear();
      router.replace("/login");
    } catch (err) {
      console.error("❌ Error al cerrar sesión:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) return <main className="p-6 text-white">Cargando…</main>;

  return (
    <main className="min-h-screen bg-[#0A1628] text-white p-6 pt-28">
      <div className="max-w-5xl mx-auto">
        {/* Header superior */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Blogs</h1>
            <Link
              href="/admin/blogs/new"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#EE7203] to-[#FF3816] font-semibold"
            >
              Nuevo
            </Link>
          </div>

          {/* Botón de logout */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-red-500/15 hover:bg-red-500/25 border border-red-400/30 text-red-200 transition disabled:opacity-60"
          >
            {loggingOut ? (
              <>
                <span className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                Cerrando…
              </>
            ) : (
              <>
                <LogoutIcon />
                Cerrar sesión
              </>
            )}
          </button>
        </div>

        {/* Tabla de blogs */}
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left px-4 py-3">Slug</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Locales</th>
                <th className="text-right px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug} className="border-t border-white/10">
                  <td className="px-4 py-3">{r.slug}</td>
                  <td className="px-4 py-3">{r.status}</td>
                  <td className="px-4 py-3">
                    {Array.isArray(r.locales) ? r.locales.join(", ") : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/news/${r.slug}`}
                      className="px-3 py-1 rounded bg-white/10 hover:bg-white/15 mr-2"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/admin/blogs/${r.slug}`}
                      className="px-3 py-1 rounded bg-white/10 hover:bg-white/15 mr-2"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => onDelete(r.slug)}
                      className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-white/60"
                  >
                    Sin blogs aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
