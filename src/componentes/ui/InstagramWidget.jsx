import { useContext } from "react";
import ContextGeneral from "@/services/contextGeneral";
import Image from "next/image";

function InstagramWidget({ ig }) {
  const { instagramFeed, instagramLoaded } = useContext(ContextGeneral);

  return (
    <section id="instagram" className="bg-white text-gray-900">
      <div className="max-w-7xl mx-auto py-16">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF,#515BD4)",
              }}
            >
              📸
            </div>
            <div>
              <p className="font-semibold text-gray-900">{ig.title}</p>
              <p className="text-gray-600 text-sm">{ig.handle}</p>
            </div>
          </div>
          <a
            href={ig.href}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
          >
            {ig.followLabel}
          </a>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {instagramLoaded &&
          Array.isArray(instagramFeed) &&
          instagramFeed.length > 0 ? (
            instagramFeed.map((post) => (
              <a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square rounded-xl overflow-hidden"
              >
                <Image
                  src={post.imageUrl}
                  alt="Post de Instagram"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </a>
            ))
          ) : (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-gray-100 animate-pulse"
              />
            ))
          )}
        </div>

        <p className="mt-6 text-center text-gray-500 text-sm">{ig.credit}</p>
      </div>
    </section>
  );
}

export default InstagramWidget;
