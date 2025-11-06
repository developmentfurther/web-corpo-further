// /pages/admin/instagram/index.jsx (versión UI mejorada)
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

  // === Modal simple ===
  const Modal = () => (
    <AnimatePresence>
      {modal.open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
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
            <p className="text-lg font-semibold mb-4">{modal.message}</p>
            <div className="flex justify-end gap-3">
              {modal.type === "confirm" ? (
                <>
                  <button
                    onClick={() => setModal({ open: false })}
                    className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (modal.onConfirm) modal.onConfirm();
                      setModal({ open: false });
                    }}
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-[#EE7203] to-[#FF3816] font-semibold"
                  >
                    Confirmar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModal({ open: false })}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-[#EE7203] to-[#FF3816] font-semibold"
                >
                  Aceptar
                </button>
              )}
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
    <main className="min-h-screen bg-[#0A1628] text-white py-10 px-6 pt-28 relative">
      <Modal />
      <button
        onClick={() => router.push("/admin/instagram")}
        className="mb-6 text-white/70 hover:text-white transition flex items-center gap-2"
      >
        <span>←</span> Volver
      </button>

      <form
        onSubmit={onSave}
        className="max-w-xl mx-auto space-y-5 bg-white/[0.05] p-8 rounded-2xl border border-white/10 shadow-xl"
      >
        <h1 className="text-2xl font-bold mb-4">Nuevo Post</h1>

        {/* Imagen */}
        <div className="space-y-3">
          <label className="block mb-1 font-medium">Imagen</label>
          {!form.imageUrl ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full bg-white/10 rounded px-3 py-2 outline-none cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gradient-to-r file:from-[#EE7203] file:to-[#FF3816] file:text-white hover:file:opacity-90"
            />
          ) : (
            <div className="flex items-center gap-4">
              <div className="relative w-40 h-28 rounded-lg overflow-hidden border border-white/10 shadow-md">
                <Image
                  src={form.imageUrl}
                  alt="preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                {sizes.beforeMB > 0 && (
                  <p className="text-xs text-white/60">
                    {sizes.beforeMB.toFixed(2)} MB →{" "}
                    {sizes.afterMB.toFixed(2)} MB
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="bg-red-600/90 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition"
                >
                  Eliminar imagen
                </button>
              </div>
            </div>
          )}
          {uploading && (
            <p className="text-sm text-white/70">
              Subiendo... {progress}%
            </p>
          )}
        </div>

        {/* Campos */}
        <div>
          <label className="block mb-1 font-medium">Enlace (href)</label>
          <input
            className="w-full bg-white/10 rounded px-3 py-2 outline-none"
            value={form.href}
            onChange={(e) => setForm({ ...form, href: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Descripción</label>
          <textarea
            className="w-full bg-white/10 rounded px-3 py-2 outline-none h-24 resize-none"
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Orden</label>
          <input
            type="number"
            className="w-full bg-white/10 rounded px-3 py-2 outline-none"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: Number(e.target.value) })
            }
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.visible}
            onChange={(e) =>
              setForm({ ...form, visible: e.target.checked })
            }
            className="w-5 h-5 accent-[#EE7203]"
          />
          <label>Visible</label>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className={`w-full bg-gradient-to-r from-[#EE7203] to-[#FF3816] px-6 py-2 rounded-md font-semibold shadow-lg ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Guardar
        </button>
      </form>
    </main>
  );
}

export default withAdminGuard(NewInstagram);
