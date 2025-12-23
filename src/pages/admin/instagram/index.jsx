import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import withAdminGuard from "@/lib/guards/withAdminGuard";
import {
  listInstagramPosts,
  toggleVisibility,
  deleteInstagramPost,
} from "@/lib/firestore/instagram";
import AdminBackButton from "@/componentes/ui/AdminBackButton";

function InstagramList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, type: "", post: null });
  const router = useRouter();

  // === Cargar posts ===
  const load = async () => {
    setLoading(true);
    const data = await listInstagramPosts();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // === Eliminar con modal ===
  async function handleDelete(post) {
    setModal({ open: true, type: "confirm", post });
  }

  const confirmDelete = async (post) => {
    try {
      await deleteInstagramPost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      setModal({
        open: true,
        type: "alert",
        message: "🗑️ Post e imagen eliminados correctamente",
      });
    } catch (err) {
      console.error("❌ Error al eliminar el post:", err);
      setModal({
        open: true,
        type: "alert",
        message: "❌ Error al eliminar el post. Revisá la consola.",
      });
    }
  };

  /* ===== Modal animado reutilizable ===== */
  const Modal = () => (
    <AnimatePresence>
      {modal.open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setModal({ open: false })}
        >
          <motion.div
            className="bg-gradient-to-br from-slate-900 to-slate-950 border border-pink-500/20 text-white rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-pink-500/10 relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decoración de fondo */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/10 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full"></div>
            
            <div className="relative z-10">
              {modal.type === "confirm" ? (
                <>
                  <div className="mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">¿Eliminar este post?</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      "{modal.post?.caption || modal.post?.id}"
                    </p>
                  </div>
                  <p className="text-white/50 mb-8 text-sm bg-white/5 rounded-xl p-4 border border-white/10">
                    ⚠️ Se eliminará también su imagen de ImageKit. Esta acción no se puede deshacer.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setModal({ open: false })}
                      className="flex-1 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        confirmDelete(modal.post);
                        setModal({ open: false });
                      }}
                      className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-semibold shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-xl font-semibold">{modal.message}</p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setModal({ open: false })}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-semibold shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
                    >
                      Aceptar
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* ===== Loading ===== */
  if (loading) {
    return (
      <main className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white grid place-items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-lg">Cargando posts...</p>
        </div>
      </main>
    );
  }

  /* ===== Render ===== */
  return (
    <main className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen p-6 pt-28 relative overflow-hidden">
      <Modal />
      <AdminBackButton />
      
      {/* Fondo decorativo mejorado */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-orange-500/15 via-pink-500/10 to-transparent blur-3xl rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/5 to-transparent blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header mejorado */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
            <div>
              <div className="inline-block mb-3">
                <span className="text-xs font-bold tracking-widest text-pink-400 uppercase bg-pink-500/10 px-4 py-1.5 rounded-full border border-pink-500/20">
                  Gestión de contenido
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black mb-3">
                <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Instagram
                </span>
                <span className="text-white/90"> Posts</span>
              </h1>
              <p className="text-white/50 text-lg">
                Administrá el contenido que aparece en la web
              </p>
            </div>

            <Link
              href="/admin/instagram/new"
              className="group px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-white shadow-xl hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Nuevo Post</span>
            </Link>
          </div>

          {/* Contador de posts */}
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-white/70">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} en total
            </span>
          </div>
        </div>

        {/* Grid de posts */}
        {posts.length === 0 ? (
          <div className="text-center mt-32">
            <div className="inline-block p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl mb-6">
              <svg className="w-20 h-20 text-white/30 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white/60 text-xl font-light mb-2">
              No hay posts todavía
            </p>
            <p className="text-white/40 text-sm">
              Creá tu primer post para comenzar 📷
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
          >
            {posts.map((p) => (
              <motion.div
                key={p.id}
                layout
                variants={{ 
                  hidden: { opacity: 0, y: 30, scale: 0.95 }, 
                  show: { opacity: 1, y: 0, scale: 1 } 
                }}
              >
                <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 hover:scale-[1.02] hover:border-pink-500/30">
                  {/* Imagen con overlay gradient */}
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={`${p.imageUrl}?tr=w-600,q-80`}
                      alt={p.caption || "Instagram post"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Badge de estado */}
                    {!p.visible && (
                      <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full border border-red-400/50 shadow-lg">
                        Oculto
                      </div>
                    )}
                    
                    {p.visible && (
                      <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-400/50 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Publicado
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-5 flex flex-col gap-4">
                    <p className="text-sm text-white/70 line-clamp-2 leading-relaxed min-h-[2.5rem]">
                      {p.caption || "Sin descripción"}
                    </p>

                    {/* Botones de acción */}
                    <div className="flex flex-col gap-2 mt-auto">
                      <button
                        onClick={() => router.push(`/admin/instagram/${p.id}`)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold hover:bg-white/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group/btn"
                      >
                        <svg className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => toggleVisibility(p.id, !p.visible).then(load)}
                          className={`px-3 py-2 rounded-xl font-semibold transition-all duration-300 text-sm ${
                            p.visible
                              ? "bg-white/5 border border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30"
                              : "bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30"
                          }`}
                        >
                          {p.visible ? "Ocultar" : "Publicar"}
                        </button>

                        <button
                          onClick={() => handleDelete(p)}
                          className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-400/30 text-red-300 hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-300 font-semibold text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default withAdminGuard(InstagramList);