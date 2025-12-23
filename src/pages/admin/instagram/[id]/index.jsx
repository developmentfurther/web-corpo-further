import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAdminGuard from "@/lib/guards/withAdminGuard";
import { motion, AnimatePresence } from "framer-motion";
import {
  getInstagramPost,
  saveInstagramPost,
  deleteInstagramPost,
} from "@/lib/firestore/instagram";

function EditInstagramPost() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    imageUrl: "",
    href: "",
    caption: "",
    order: 0,
    visible: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState({ open: false, type: "", message: "" });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const data = await getInstagramPost(id);
      if (data) setForm(data);
      setLoading(false);
    };
    load();
  }, [id]);

  // === Modal mejorado ===
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
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/10 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full"></div>
            
            <div className="relative z-10">
              <div className="mb-6">
                <div className={`w-14 h-14 bg-gradient-to-br ${modal.type === 'delete' ? 'from-red-500 to-red-600' : 'from-pink-500 to-purple-600'} rounded-2xl flex items-center justify-center mb-4`}>
                  {modal.type === 'delete' ? (
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {modal.type === 'delete' ? '¿Eliminar este post?' : 'Confirmación'}
                </h3>
                <p className="text-white/70">{modal.message}</p>
              </div>
              
              <div className="flex gap-3">
                {modal.type === "delete" ? (
                  <>
                    <button
                      onClick={() => setModal({ open: false })}
                      className="flex-1 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        if (modal.onConfirm) modal.onConfirm();
                        setModal({ open: false });
                      }}
                      className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 font-semibold shadow-lg hover:shadow-red-500/30 transition-all duration-300"
                    >
                      Eliminar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setModal({ open: false })}
                    className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-semibold shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
                  >
                    Aceptar
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveInstagramPost({ ...form, id });
      setModal({
        open: true,
        type: "success",
        message: "✅ Post actualizado correctamente",
      });
      setTimeout(() => router.push("/admin/instagram"), 800);
    } catch (err) {
      console.error(err);
      setModal({
        open: true,
        type: "error",
        message: "❌ Error al guardar cambios. Revisá la consola.",
      });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    setModal({
      open: true,
      type: "delete",
      message: "Esta acción eliminará el post y su imagen de ImageKit. No se puede deshacer.",
      onConfirm: async () => {
        await deleteInstagramPost(id);
        router.push("/admin/instagram");
      },
    });
  };

  if (loading) {
    return (
      <main className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white grid place-items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-lg">Cargando post...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-10 px-6 pt-28 relative overflow-hidden">
      <Modal />
      
      {/* Fondos decorativos */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-orange-500/15 via-pink-500/10 to-transparent blur-3xl rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Botón volver mejorado */}
        <button
          onClick={() => router.push("/admin/instagram")}
          className="group mb-8 text-white/60 hover:text-white transition-all duration-300 flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-xl px-4 py-2.5"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Volver</span>
        </button>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-block mb-3">
            <span className="text-xs font-bold tracking-widest text-pink-400 uppercase bg-pink-500/10 px-4 py-1.5 rounded-full border border-pink-500/20">
              Editar contenido
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Editar Post
            </span>
          </h1>
          <p className="text-white/50 text-lg">
            Modificá los detalles del post de Instagram
          </p>
        </div>

        {/* Layout con preview y form */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Preview - Columna izquierda */}
          {form.imageUrl && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="sticky top-28">
                <p className="text-sm font-bold text-white/70 mb-3">Vista previa</p>
                <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-4 overflow-hidden">
                  <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-pink-500/30 shadow-xl shadow-pink-500/20">
                    <img
                      src={form.imageUrl}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-white/70 line-clamp-3 leading-relaxed">
                      {form.caption || "Sin descripción"}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${form.visible ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                      <span className="text-xs text-white/50">
                        {form.visible ? 'Publicado' : 'Oculto'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Formulario - Columna derecha */}
          <div className={form.imageUrl ? "lg:col-span-3" : "lg:col-span-5"}>
            <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl p-8 lg:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-8">
              
              {/* URL de imagen */}
              <div>
                <label className="block text-sm font-bold text-white/70 mb-2">
                  URL de imagen
                  <span className="text-pink-400 ml-1">*</span>
                </label>
                <input
                  type="url"
                  className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 outline-none transition-all duration-300 focus:bg-white/10 font-mono text-sm"
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  required
                />
                <p className="text-xs text-white/40 mt-2">
                  URL de la imagen almacenada en ImageKit
                </p>
              </div>

              {/* Enlace */}
              <div>
                <label className="block text-sm font-bold text-white/70 mb-2">
                  Enlace (href)
                  <span className="text-pink-400 ml-1">*</span>
                </label>
                <input
                  type="url"
                  className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 outline-none transition-all duration-300 focus:bg-white/10"
                  placeholder="https://instagram.com/p/..."
                  value={form.href}
                  onChange={(e) => setForm({ ...form, href: e.target.value })}
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-bold text-white/70 mb-2">
                  Descripción / Caption
                </label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 outline-none h-32 resize-none transition-all duration-300 focus:bg-white/10"
                  placeholder="Escribí una descripción para el post..."
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                />
              </div>

              {/* Grid para orden y visible */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white/70 mb-2">
                    Orden
                  </label>
                  <input
                    type="number"
                    className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 rounded-xl px-4 py-3 outline-none transition-all duration-300 focus:bg-white/10"
                    placeholder="0"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: Number(e.target.value) })
                    }
                  />
                  <p className="text-xs text-white/40 mt-2">
                    Menor número aparece primero
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white/70 mb-4">
                    Visibilidad
                  </label>
                  <label className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/10 transition-all duration-300">
                    <input
                      type="checkbox"
                      checked={form.visible}
                      onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                      className="w-6 h-6 rounded-lg accent-pink-500 cursor-pointer"
                    />
                    <div>
                      <p className="font-semibold text-white/90">Visible</p>
                      <p className="text-xs text-white/50">Mostrar en la web</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onDelete}
                  className="sm:flex-1 px-6 py-4 rounded-xl bg-red-500/10 border border-red-400/30 text-red-300 hover:bg-red-500/20 hover:border-red-400/50 font-bold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  disabled={saving}
                  className={`sm:flex-[2] px-6 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    saving 
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:from-pink-600 hover:to-purple-700 hover:shadow-pink-500/40 hover:scale-[1.02]"
                  }`}
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Guardar cambios</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAdminGuard(EditInstagramPost);