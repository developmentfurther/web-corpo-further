// /pages/admin/instagram/index.jsx
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

/* ===== Tokens visuales ===== */
const BG = "bg-[#0A1628]";
const GRAD =
  "bg-gradient-to-r from-[#EE7203] via-[#FF4D1F] to-[#FF3816]";
const CARD =
  "relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] backdrop-blur-xl shadow-[0_8px_28px_rgba(0,0,0,0.35)] transition-all duration-500";

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#0A1628] border border-white/10 text-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
          >
            {modal.type === "confirm" ? (
              <>
                <p className="text-lg font-semibold mb-4">
                  ¿Eliminar el post “{modal.post?.caption || modal.post?.id}”?
                </p>
                <p className="text-white/60 mb-6 text-sm">
                  Se eliminará también su imagen de ImageKit.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setModal({ open: false })}
                    className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      confirmDelete(modal.post);
                      setModal({ open: false });
                    }}
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-[#EE7203] to-[#FF3816] font-semibold"
                  >
                    Confirmar
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold mb-4">{modal.message}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setModal({ open: false })}
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-[#EE7203] to-[#FF3816] font-semibold"
                  >
                    Aceptar
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* ===== Loading ===== */
  if (loading) {
    return (
      <main className={`${BG} text-white grid place-items-center min-h-screen`}>
        <p className="animate-pulse text-white/80">Cargando posts...</p>
      </main>
    );
  }

  /* ===== Render ===== */
  return (
    <main className={`${BG} text-white min-h-screen p-6 pt-28 relative`}>
      <Modal />

      {/* Fondo decorativo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-24 -right-20 w-72 h-72 bg-[#EE7203]/25 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#FF3816]/20 blur-3xl rounded-full" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">Instagram Posts</h1>
        <Link
          href="/admin/instagram/new"
          className="px-5 py-2.5 rounded-md bg-gradient-to-r from-[#EE7203] to-[#FF3816] font-semibold text-white shadow-lg hover:shadow-orange-500/30 transition"
        >
          + Nuevo Post
        </Link>
      </div>

      {/* Grid de posts */}
      {posts.length === 0 ? (
        <p className="text-center text-white/70 mt-20 text-lg">
          No hay posts todavía 📷
        </p>
      ) : (
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {posts.map((p) => (
            <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <div
                className={`${CARD} group overflow-hidden`}
              >
                {/* Imagen */}
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={`${p.imageUrl}?tr=w-600,q-80`}
                    alt={p.caption || "Instagram post"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {!p.visible && (
                    <div className="absolute top-2 left-2 bg-red-600/80 text-xs font-semibold px-2 py-1 rounded-md">
                      Oculto
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div className="p-4 flex flex-col gap-3">
                  <p className="text-sm text-white/80 line-clamp-2">
                    {p.caption || "Sin descripción"}
                  </p>

                  <div className="flex flex-wrap gap-2 text-sm mt-auto">
                    <button
                      onClick={() => router.push(`/admin/instagram/${p.id}`)}
                      className="px-3 py-1 rounded-md bg-white text-[#0A1628] font-semibold hover:bg-gray-100 transition"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => toggleVisibility(p.id, !p.visible).then(load)}
                      className={`px-3 py-1 rounded-md border ${
                        p.visible
                          ? "border-white/20 text-white/80 hover:border-white/40"
                          : "border-yellow-400/60 text-yellow-300"
                      } transition`}
                    >
                      {p.visible ? "Ocultar" : "Publicar"}
                    </button>

                    <button
                      onClick={() => handleDelete(p)}
                      className="px-3 py-1 rounded-md border border-red-400/50 text-red-300 hover:border-red-400 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
}

export default withAdminGuard(InstagramList);
