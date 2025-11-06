// /lib/renderEditor.js
export function renderBlocksToHtml(blocks = []) {
  if (!Array.isArray(blocks)) return "";

  return blocks
    .map((block) => {
      const d = block.data || {};

      switch (block.type) {
        case "header":
          return `<h${d.level || 2}>${esc(d.text || "")}</h${d.level || 2}>`;

        case "paragraph":
          return `<p>${esc(d.text || "")}</p>`;

        case "list": {
          const tag = d.style === "ordered" ? "ol" : "ul";
          const items = (d.items || [])
            .map((i) => {
              if (typeof i === "string") return `<li>${esc(i)}</li>`;
              if (i?.content) return `<li>${esc(i.content)}</li>`;
              if (i?.text) return `<li>${esc(i.text)}</li>`;
              return "";
            })
            .join("");
          return `<${tag}>${items}</${tag}>`;
        }

        case "quote":
          return `
            <blockquote>
              <p>${esc(d.text || "")}</p>
              ${d.caption ? `<cite>${esc(d.caption)}</cite>` : ""}
            </blockquote>
          `;

        case "code":
          return `<pre><code>${esc(d.code || "")}</code></pre>`;

        case "image":
          return `
            <figure>
              <img src="${d.file?.url || ""}" alt="${esc(d.caption || "")}" />
              ${d.caption ? `<figcaption>${esc(d.caption)}</figcaption>` : ""}
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
