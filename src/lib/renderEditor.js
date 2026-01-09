// /lib/renderEditor.js

export function renderBlocksToHtml(blocks = []) {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      const d = block.data || {};

      switch (block.type) {
        case "header":
          // Quitamos esc() del texto para permitir <b>, <i>, etc.
          return `<h${d.level || 2}>${d.text || ""}</h${d.level || 2}>`;

case "paragraph": {
  const html = d.text || "";

  // 1️⃣ Intentar detectar <a href="...">
  const anchorRegex = /<a[^>]+href="([^"]+)"[^>]*>.*?<\/a>/i;
  let url = null;

  const anchorMatch = html.match(anchorRegex);
  if (anchorMatch && html.trim() === anchorMatch[0]) {
    url = anchorMatch[1];
  }

  // 2️⃣ Si no hay <a>, intentar detectar URL plana
  if (!url) {
    const plainUrlRegex =
      /^(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtube\.com\/shorts\/|youtu\.be\/)[^\s]+)$/i;

    if (plainUrlRegex.test(html.trim())) {
      url = html.trim();
    }
  }

  // 3️⃣ Si tenemos URL, extraer videoId
  if (url) {
    try {
      const parsed = new URL(url);

      let videoId = null;

      if (parsed.hostname.includes("youtube.com")) {
        videoId = parsed.searchParams.get("v");
      } else if (parsed.hostname === "youtu.be") {
        videoId = parsed.pathname.slice(1);
      }

      if (videoId) {
        return `
          <div class="relative w-full aspect-video my-8 rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/${videoId}"
              class="absolute top-0 left-0 w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        `;
      }
    } catch {}
  }

  // 4️⃣ Fallback normal
  return `<p>${html}</p>`;
}


        case "list": {
          const tag = d.style === "ordered" ? "ol" : "ul";
          const items = (d.items || [])
            .map((i) => {
              // Permitimos HTML dentro de los items de la lista
              if (typeof i === "string") return `<li>${i}</li>`;
              if (i?.content) return `<li>${i.content}</li>`;
              if (i?.text) return `<li>${i.text}</li>`;
              return "";
            })
            .join("");
          return `<${tag}>${items}</${tag}>`;
        }

        case "quote":
          return `
            <blockquote>
              <p>${d.text || ""}</p> 
              ${d.caption ? `<cite>${d.caption}</cite>` : ""}
            </blockquote>
          `;

        case "code":
          // IMPORTANTE: En bloques de código SÍ mantenemos esc()
          // porque aquí sí queremos ver las etiquetas escritas literalmente.
          return `<pre><code>${esc(d.code || "")}</code></pre>`;

        case "image":
          return `
            <figure>
              <img src="${d.file?.url || ""}" alt="${esc(d.caption || "")}" />
              ${d.caption ? `<figcaption>${d.caption}</figcaption>` : ""}
            </figure>
          `;

        


        default:
          return "";
      }
    })
    .join("\n");
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}