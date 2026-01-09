import { useEffect, useState } from "react";
import withAdminGuard from "@/lib/guards/withAdminGuard";
import Link from "next/link";
import { listBlogs, deleteBlog } from "@/lib/firestore/blogs";
import { getAuth } from "firebase/auth";
import firebaseApp from "@/services/firebase";
import AdminBackButton from "@/componentes/ui/AdminBackButton";
import { 
  FiPlus, FiEye, FiEdit2, FiTrash2, FiGlobe, 
  FiCheckCircle, FiClock, FiSearch, FiFilter, FiX 
} from "react-icons/fi";

function AdminBlogsList() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // === NUEVOS ESTADOS PARA FILTROS ===
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'az'

  // eslint-disable-next-line no-unused-vars
  const auth = getAuth(firebaseApp);

  const load = async () => {
    setLoading(true);
    try {
      const items = await listBlogs();
      // Asumimos que items trae 'createdAt' o 'date'. Si no, el orden será por defecto.
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

  // === LÓGICA DE FILTRADO Y ORDENAMIENTO ===
  const filteredRows = rows
    .filter((row) => {
      // Filtra por slug (y título si tu objeto row lo tiene)
      const term = searchTerm.toLowerCase();
      const slugMatch = row.slug?.toLowerCase().includes(term);
      // const titleMatch = row.title?.toLowerCase().includes(term); // Descomentar si tienes título
      return slugMatch; // || titleMatch
    })
    .sort((a, b) => {
      if (sortBy === 'az') {
        return a.slug.localeCompare(b.slug);
      }
      // Asumiendo que tienes un campo de fecha 'createdAt' o similar. 
      // Si no existe, usa 0 para evitar errores.
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();

      if (sortBy === 'oldest') {
        return dateA - dateB;
      }
      // Default: newest
      return dateB - dateA;
    });

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0A1628] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#EE7203] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm font-medium">Cargando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A1628] text-gray-200 pt-28 pb-12 px-6">
      
      <div className="relative max-w-7xl mx-auto space-y-8">
        <AdminBackButton />

        {/* Header */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Gestión de Blogs
              </h1>
              <p className="text-gray-400 text-sm">
                {rows.length} {rows.length === 1 ? 'artículo' : 'artículos'} en total
              </p>
            </div>

            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#EE7203] hover:bg-[#d66602] text-white font-medium transition-colors shadow-lg shadow-orange-900/20"
            >
              <FiPlus className="w-5 h-5" />
              Nuevo Blog
            </Link>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard 
              label="Total" 
              value={rows.length} 
              icon={<FiGlobe className="w-5 h-5 text-[#EE7203]" />} 
              bgIcon="bg-[#EE7203]/10"
            />
            <StatCard 
              label="Públicos" 
              value={rows.filter(r => r.status === 'public').length} 
              icon={<FiCheckCircle className="w-5 h-5 text-green-400" />} 
              bgIcon="bg-green-500/10"
            />
            <StatCard 
              label="No listados" 
              value={rows.filter(r => r.status === 'unlisted').length} 
              icon={<FiClock className="w-5 h-5 text-yellow-400" />} 
              bgIcon="bg-yellow-500/10"
            />
          </div>

          {/* === BARRA DE FILTROS (NUEVA) === */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Buscador */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar por slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0f1d33] border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#EE7203] focus:ring-1 focus:ring-[#EE7203] transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <FiX />
                </button>
              )}
            </div>

            {/* Selector de Orden */}
            <div className="relative min-w-[200px]">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#0f1d33] border border-gray-800 rounded-lg pl-10 pr-8 py-3 text-white appearance-none focus:outline-none focus:border-[#EE7203] cursor-pointer"
              >
                <option value="newest">Más recientes</option>
                <option value="az">Alfabético (A-Z)</option>
              </select>
              {/* Flechita custom para el select */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-[#0f1d33] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-[#14243e]">
                  <th className="px-6 py-4 font-semibold text-gray-300">Slug</th>
                  <th className="px-6 py-4 font-semibold text-gray-300">Estado</th>
                  <th className="px-6 py-4 font-semibold text-gray-300">Idiomas</th>
                  <th className="px-6 py-4 font-semibold text-gray-300 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredRows.map((r) => (
                  <tr 
                    key={r.slug} 
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4 text-white font-medium group-hover:text-[#EE7203] transition-colors">
                      {r.slug}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          r.status === 'public'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}
                      >
                        {r.status === 'public' ? 'Público' : 'No listado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {Array.isArray(r.locales) ? r.locales.join(", ").toUpperCase() : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ActionButton href={`/news/${r.slug}`} icon={<FiEye />} title="Ver" />
                        <ActionButton href={`/admin/blogs/${r.slug}`} icon={<FiEdit2 />} title="Editar" isEdit />
                        <button
                          onClick={() => onDelete(r.slug)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          title="Eliminar"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center opacity-50">
                        <FiSearch className="w-8 h-8 mb-2" />
                        <p className="text-gray-300 font-medium">No se encontraron resultados</p>
                        <p className="text-sm text-gray-500">Prueba con otro término de búsqueda</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer de la tabla (Contador de resultados filtrados) */}
          <div className="bg-[#14243e] px-6 py-3 border-t border-gray-800 text-xs text-gray-400 flex justify-between items-center">
             <span>Viendo {filteredRows.length} de {rows.length} registros</span>
          </div>
        </div>
      </div>
    </main>
  );
}

// === Componentes Auxiliares (Sin cambios, solo reutilizados) ===
function StatCard({ label, value, icon, bgIcon }) {
  return (
    <div className="bg-[#0f1d33] border border-gray-800 rounded-xl p-5 flex items-center justify-between shadow-lg">
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-lg ${bgIcon} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}

function ActionButton({ href, icon, title, isEdit }) {
  return (
    <Link
      href={href}
      className={`p-2 rounded-lg transition-colors ${
        isEdit 
        ? "text-gray-400 hover:text-[#EE7203] hover:bg-[#EE7203]/10" 
        : "text-gray-400 hover:text-white hover:bg-white/10"
      }`}
      title={title}
    >
      <span className="w-4 h-4 block">{icon}</span>
    </Link>
  );
}

export default withAdminGuard(AdminBlogsList);