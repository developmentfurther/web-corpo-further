import { useState } from "react";
import { useRouter } from "next/router";
import withAdminGuard from "@/lib/guards/withAdminGuard";
import { saveInstagramPost } from "@/lib/firestore/instagram";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { motion, AnimatePresence } from "framer-motion";

function NewInstagram() {
  const router = useRouter();
  const [form, setForm] = useState({
    imageUrl: "",
    imageKitId: "",
    href: "",
    caption: "",
    order: 0,
    visible: true,
  });

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sizes, setSizes] = useState({ beforeMB: 0, afterMB: 0 });
  const [modal, setModal] = useState({ open: false, type: "", message: "" });

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
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xl font-semibold">{modal.message}</p>
              </div>
              
              <div className="flex gap-3">
                {modal.type === "confirm" ? (
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
                      className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-semibold shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
                    >
                      Confirmar
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

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      onProgress: (p) => setProgress(Math.round(p)),
    };

    try {
      setUploading(true);
      const beforeMB = file.size / 1024 / 1024;
      const compressed = await imageCompression(file, options);
      const afterMB = compressed.size / 1024 / 1024;
      setSizes({ beforeMB, afterMB });

      const formData = new FormData();
      formData.append("file", compressed, compressed.name || file.name);

      const res = await fetch("/api/upload-imagekit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data?.url)
        throw new Error(data.error || "Error al subir");

      setForm((f) => ({
        ...f,
        imageUrl: data.optimizedUrl || data.url,
        imageKitId: data.fileId || "",
      }));

      setModal({
        open: true,
        type: "alert",
        message: "✅ Imagen subida correctamente a ImageKit",
      });
    } catch (err) {
      console.error(err);
      setModal({
        open: true,
        type: "alert",
        message: "❌ Error al comprimir o subir la imagen",
      });
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteImage() {
    if (!form.imageKitId) {
      setForm((f) => ({ ...f, imageUrl: "", imageKitId: "" }));
      setPreview(null);
      return;
    }
    setModal({
      open: true,
      type: "confirm",
      message: "¿Eliminar esta imagen del servidor?",
      onConfirm: async () => {
        try {
          const res = await fetch(
            `/api/delete-imagekit?fileId=${form.imageKitId}`,
            { method: "DELETE" }
          );
          const data = await res.json();
          if (!data.ok) throw new Error(data.error || "Error al eliminar");
          setModal({
            open: true,
            type: "alert",
            message: "🗑️ Imagen eliminada correctamente de ImageKit",
          });
          setForm((f) => ({ ...f, imageUrl: "", imageKitId: "" }));
          setPreview(null);
          setSizes({ beforeMB: 0, afterMB: 0 });
        } catch (err) {
          console.error(err);
          setModal({
            open: true,
            type: "alert",
            message: "❌ No se pudo eliminar la imagen",
          });
        }
      },
    });
  }

  const onSave = async (e) => {
    e.preventDefault();
    if (!form.imageUrl)
      return setModal({
        open: true,
        type: "alert",
        message: "Subí una imagen primero.",
      });

    await saveInstagramPost(form);
    setModal({
      open: true,
      type: "alert",
      message: "✅ Post creado correctamente",
    });
    setTimeout(() => router.push("/admin/instagram"), 800);
  };

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
              Crear contenido
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Nuevo Post
            </span>
          </h1>
          <p className="text-white/50 text-lg">
            Creá un nuevo post para Instagram
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-xl p-8 lg:p-10 rounded-3xl border border-white/10 shadow-2xl space-y-8">
          {/* Upload de imagen */}
          <div className="space-y-4">
            <label className="block text-lg font-bold mb-2">
              Imagen
              <span className="text-pink-400 ml-1">*</span>
            </label>
            
            {!form.imageUrl ? (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="group cursor-pointer block w-full bg-white/5 border-2 border-dashed border-white/20 hover:border-pink-500/50 rounded-2xl p-12 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-white/90 mb-2">
                      Arrastrá tu imagen o hacé click aquí
                    </p>
                    <p className="text-sm text-white/50">
                      PNG, JPG o WEBP (máx. 1MB después de compresión)
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
              >
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  <div className="relative w-full lg:w-64 aspect-square rounded-xl overflow-hidden border-2 border-pink-500/30 shadow-xl shadow-pink-500/20">
                    <Image
                      src={form.imageUrl}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h3 className="text-sm font-bold text-white/70 mb-2">Compresión aplicada</h3>
                      {sizes.beforeMB > 0 && (
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <p className="text-xs text-white/50 mb-1">Antes</p>
                            <p className="text-lg font-bold text-white/90">
                              {sizes.beforeMB.toFixed(2)} MB
                            </p>
                          </div>
                          <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-xs text-white/50 mb-1">Después</p>
                            <p className="text-lg font-bold text-pink-400">
                              {sizes.afterMB.toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="w-full bg-red-500/10 border border-red-400/30 text-red-300 hover:bg-red-500/20 hover:border-red-400/50 px-5 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar imagen
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {uploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white/90">
                      Subiendo imagen...
                    </p>
                    <p className="text-xs text-white/50">{progress}% completado</p>
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Campos del formulario */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
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

            <div className="lg:col-span-2">
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
                Orden de visualización (menor número aparece primero)
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
                  onChange={(e) =>
                    setForm({ ...form, visible: e.target.checked })
                  }
                  className="w-6 h-6 rounded-lg accent-pink-500 cursor-pointer"
                />
                <div>
                  <p className="font-semibold text-white/90">Publicar inmediatamente</p>
                  <p className="text-xs text-white/50">El post será visible en la web</p>
                </div>
              </label>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/admin/instagram")}
              className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 font-bold transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={uploading}
              className={`flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-bold shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                uploading 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:from-pink-600 hover:to-purple-700 hover:shadow-pink-500/40 hover:scale-[1.02]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Guardar Post
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default withAdminGuard(NewInstagram);