// /pages/admin/instagram/[id]/index.jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAdminGuard from "@/lib/guards/withAdminGuard";
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

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const data = await getInstagramPost(id);
      if (data) setForm(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveInstagramPost({ ...form, id });
      alert("✅ Post actualizado");
      router.push("/admin/instagram");
    } catch (err) {
      console.error(err);
      alert("Error al guardar cambios.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("¿Eliminar este post permanentemente?")) return;
    await deleteInstagramPost(id);
    router.push("/admin/instagram");
  };

  if (loading)
    return (
      <main className="min-h-screen bg-[#0A1628] text-white grid place-items-center">
        <p>Cargando...</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-[#0A1628] text-white py-10 px-6 pt-28">
      <button
        onClick={() => router.push("/admin/instagram")}
        className="mb-6 text-white/70 hover:text-white transition"
      >
        ← Volver
      </button>

      <form
        onSubmit={onSave}
        className="max-w-xl mx-auto space-y-5 bg-white/[0.05] p-6 rounded-2xl border border-white/10"
      >
        <h1 className="text-2xl font-bold mb-4">Editar Post</h1>

        <div>
          <label className="block mb-1">Imagen (URL)</label>
          <input
            className="w-full bg-white/10 rounded px-3 py-2 outline-none"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Enlace (href)</label>
          <input
            className="w-full bg-white/10 rounded px-3 py-2 outline-none"
            value={form.href}
            onChange={(e) => setForm({ ...form, href: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Descripción</label>
          <textarea
            className="w-full bg-white/10 rounded px-3 py-2 outline-none h-24 resize-none"
            value={form.caption}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1">Orden</label>
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
            onChange={(e) => setForm({ ...form, visible: e.target.checked })}
          />
          <label>Visible</label>
        </div>

        {/* Previsualización */}
        {form.imageUrl && (
          <div className="mt-6 border border-white/10 rounded-xl overflow-hidden">
            <img
              src={form.imageUrl}
              alt="preview"
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={onDelete}
            className="px-5 py-2 rounded-md border border-red-400/50 text-red-300"
          >
            Eliminar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-white text-[#0A1628] px-6 py-2 rounded-md font-semibold"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default withAdminGuard(EditInstagramPost);
