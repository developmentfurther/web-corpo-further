// /componentes/news/NewsList.jsx
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsList({ items, locale, t }) {
  if (!items || items.length === 0)
    return <p className="text-white/70">{t("news.empty", "No posts yet.")}</p>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`news-list-${locale}-${items[0]?.slug || "empty"}`}
      >
        {items.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className="rounded-2xl overflow-hidden border border-white/10 bg-white/3 hover:bg-white/6 transition"
          >
            {post.coverUrl && (
              <div
                className="h-36 bg-cover bg-center"
                style={{ backgroundImage: `url(${post.coverUrl})` }}
                aria-hidden
              />
            )}
            <div className="p-5">
              <h3 className="font-semibold mb-1">{post.title}</h3>
              <p className="text-sm text-white/70 line-clamp-3">{post.summary}</p>
              <div className="mt-3">
                <Link
                  href={`/news/${post.slug}`}
                  className="text-sm font-semibold text-white/90 hover:text-white underline decoration-[#FF3816]/40 hover:decoration-[#FF3816]"
                >
                  {t("news.readMore", "Read more")}
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
