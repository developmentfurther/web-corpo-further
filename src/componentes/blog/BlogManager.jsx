"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firestore } from "@/services/firebase";
import { motion } from "framer-motion";
import { toast } from "sonner";

const BRAND_BTN =
  "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#FF3816]/60";
const BRAND_GRAD = "bg-gradient-to-r from-[#EE7203] to-[#FF3816]";

export default function BlogManager() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(
        collection(firestore, "posts"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPosts(rows);
    } catch (e) {
      console.error(e);
      toast.error("Error loading posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const togglePublish = async (p) => {
    try {
      const ref = doc(firestore, "posts", p.id);
      const next = p.status === "published" ? "draft" : "published";
      await updateDoc(ref, {
        status: next,
        updatedAt: new Date(),
        ...(next === "published"
          ? { publishedAt: new Date() }
          : { publishedAt: null }),
      });
      toast.success(next === "published" ? "Published" : "Unpublished");
      load();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status");
    }
  };

  const removePost = async (p) => {
    const ok = window.confirm(
      `Delete "${p.title || "Untitled"}"? This cannot be undone.`
    );
    if (!ok) return;
    try {
      await deleteDoc(doc(firestore, "posts", p.id));
      toast.success("Post deleted");
      load();
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Content</h2>
          <p className="text-white/60 text-sm">Manage blog posts.</p>
        </div>
        <button
          onClick={() => router.push("/admin/blog/new")}
          className={`${BRAND_BTN} relative`}
        >
          <span
            className={`${BRAND_GRAD} absolute inset-0 rounded-xl opacity-90`}
          />
          <span className="relative">New Post</span>
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-2 text-xs text-white/60 border-b border-white/10">
          <div className="col-span-5">Title</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Created</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {loading ? (
          <div className="p-6 text-white/70">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="p-6 text-white/70">No posts yet.</div>
        ) : (
          <ul className="divide-y divide-white/10">
            {posts.map((p, idx) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.12, delay: idx * 0.02 }}
                className="grid grid-cols-12 items-center px-4 py-3"
              >
                <div className="col-span-5">
                  <div className="font-medium text-white">
                    {p.title || "Untitled"}
                  </div>
                  <div className="text-xs text-white/60 line-clamp-1">
                    {p.excerpt || "—"}
                  </div>
                </div>
                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center rounded-lg px-2 py-1 text-xs ${
                      p.status === "published"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-white/10 text-white/70"
                    }`}
                  >
                    {p.status || "draft"}
                  </span>
                </div>
                <div className="col-span-3 text-sm text-white/70">
                  {p.createdAt?.toDate
                    ? p.createdAt.toDate().toLocaleString()
                    : p.createdAt
                    ? new Date(p.createdAt).toLocaleString()
                    : "—"}
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <Link
                    href={`/blog/${p.id}`}
                    className="px-2 py-1 text-sm rounded-lg bg-white/5 hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-[#EE7203]/40"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => togglePublish(p)}
                    className="px-2 py-1 text-sm rounded-lg bg-white/5 hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-[#EE7203]/40"
                  >
                    {p.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => removePost(p)}
                    className="px-2 py-1 text-sm rounded-lg bg-white/5 hover:bg-white/10 text-red-300 outline-none focus-visible:ring-2 focus-visible:ring-[#EE7203]/40"
                  >
                    Delete
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
