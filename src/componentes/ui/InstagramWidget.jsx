"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { listPublicInstagramPosts } from "@/lib/firestore/instagram";
import { FiInstagram } from "react-icons/fi";
import { motion } from "framer-motion";

function InstagramWidget({ ig }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await listPublicInstagramPosts();
      setPosts(data);
    })();
  }, []);

  return (
    <section id="instagram" className="bg-white text-gray-900">
      <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-10 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center shadow-md mx-auto sm:mx-0"
              style={{
                background:
                  "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF,#515BD4)",
              }}
            >
              <FiInstagram className="text-white text-2xl" />
            </div>
            <div>
              <p className="font-semibold text-lg">{ig.title}</p>
              <p className="text-gray-600 text-sm">{ig.handle}</p>
            </div>
          </div>

          <a
            href={ig.href}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 transition text-sm font-medium"
          >
            {ig.followLabel}
          </a>
        </div>

        {/* Grid */}
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Cargando...</p>
        ) : (
          <div
            className="
              grid 
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              gap-4 sm:gap-6
            "
          >
            {posts.slice(0, 6).map((post, i) => (
              <motion.a
                key={post.id || i}
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="
                  relative 
                  block 
                  aspect-[4/5]
                  overflow-hidden 
                  rounded-2xl 
                  group 
                  border 
                  border-gray-100
                  shadow-sm 
                  hover:shadow-lg 
                  transition-all 
                  duration-500
                  

                "
              >
                <Image
                  src={`${post.imageUrl}?tr=w-600,q-80`}
                  alt={post.caption || "Post de Instagram"}
                  width={600}
                  height={600}
                  className="
                    object-cover 
                    w-full 
                    h-full 
                    transition-transform 
                    duration-700 
                    ease-[cubic-bezier(0.22,1,0.36,1)] 
                    group-hover:scale-110
                  "
                />

                {/* Overlay */}
                <div
                  className="
                    absolute inset-0 
                    bg-black/0 
                    group-hover:bg-black/50 
                    transition-all 
                    duration-500 
                    flex 
                    items-center 
                    justify-center
                  "
                >
                  <div
                    className="
                      opacity-0 
                      group-hover:opacity-100 
                      transition-opacity 
                      duration-500 
                      text-white 
                      text-center 
                      px-3
                    "
                  >
                    <FiInstagram className="text-xl sm:text-2xl mx-auto mb-1" />
                    {post.caption && (
                      <p className="text-xs sm:text-sm line-clamp-2 leading-snug">
                        {post.caption}
                      </p>
                    )}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {/* Credit */}
        <p className="mt-10 text-center text-gray-500 text-sm">{ig.credit}</p>
      </div>
    </section>
  );
}

export default InstagramWidget;
