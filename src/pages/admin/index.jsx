// /pages/admin/blogs/index.jsx
import { useEffect, useState } from "react";
import withAdminGuard from "@/lib/guards/withAdminGuard";
import Link from "next/link";
import { listBlogs, deleteBlog } from "@/lib/firestore/blogs";

function AdminBlogsList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const items = await listBlogs();
      setRows(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (slug) => {
    if (!confirm(`Eliminar "${slug}"? Se borrarán todas las traducciones.`)) return;
    await deleteBlog(slug);
    await load();
  };

  if (loading) return <main className="p-6 text-white">Cargando…</main>;

  return (
    <main className="min-h-screen bg-[#0A1628] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Blogs</h1>
          <Link href="/admin/blogs/new" className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#EE7203] to-[#FF3816] font-semibold">Nuevo</Link>
        </div>

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
              {rows.map(r => (
                <tr key={r.slug} className="border-t border-white/10">
                  <td className="px-4 py-3">{r.slug}</td>
                  <td className="px-4 py-3">{r.status}</td>
                  <td className="px-4 py-3">{Array.isArray(r.locales) ? r.locales.join(", ") : "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/news/${r.slug}`} className="px-3 py-1 rounded bg-white/10 hover:bg-white/15 mr-2">Ver</Link>
                    <Link href={`/admin/blogs/${r.slug}`} className="px-3 py-1 rounded bg-white/10 hover:bg-white/15 mr-2">Editar</Link>
                    <button onClick={() => onDelete(r.slug)} className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30">Eliminar</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-white/60">Sin blogs aún.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
export default withAdminGuard(AdminBlogsList);
