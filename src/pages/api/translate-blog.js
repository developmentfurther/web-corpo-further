// /pages/api/translate-blog.js
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  const { from = "es", to = "en", html = "", blocks = [], title = "", summary = "" } = req.body || {};
  if (!html || !to)
    return res.status(400).json({ error: "Faltan datos (html, to)" });

  const key = process.env.GEMINI_API_KEY;
  if (!key)
    return res.status(500).json({ error: "Falta GEMINI_API_KEY" });

  const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;

  try {
    const prompt = `
You are a precise translator. Translate everything from ${from} to ${to}.

TASKS:
1️⃣ Translate the provided TITLE and SUMMARY clearly.
2️⃣ Translate the provided HTML but preserve all tags and structure.
3️⃣ Translate the provided Editor.js BLOCKS JSON, keeping same structure and keys, only translate human text.

Return STRICT JSON:
{
  "translatedTitle": "…",
  "translatedSummary": "…",
  "translatedHtml": "<html...>",
  "translatedBlocks": [ /* same structure */ ]
}

TITLE: ${title}
SUMMARY: ${summary}
HTML: ${html}
BLOCKS JSON: ${JSON.stringify(blocks || [])}
    `.trim();

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    });

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const tryParse = (s) => {
      if (!s) return null;
      const fenced = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
      const raw = fenced ? fenced[1] : s;
      const firstBrace = raw.indexOf("{");
      const lastBrace = raw.lastIndexOf("}");
      if (firstBrace === -1 || lastBrace === -1) return null;
      try {
        return JSON.parse(raw.slice(firstBrace, lastBrace + 1));
      } catch {
        return null;
      }
    };

    const parsed = tryParse(text);

    // ⚙️ Extra: traducción de emergencia de título/resumen
    async function translateTextSnippet(textToTranslate) {
      if (!textToTranslate) return textToTranslate;
      try {
        const miniPrompt = `Translate this text from ${from} to ${to}:\n\n${textToTranslate}`;
        const miniResp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: miniPrompt }] }],
          }),
        });
        const miniData = await miniResp.json();
        const out = miniData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        return out || textToTranslate;
      } catch {
        return textToTranslate;
      }
    }

    // ✅ Si no pudo parsear nada, igual forzamos traducción básica
    if (!parsed) {
      const translatedTitle = await translateTextSnippet(title);
      const translatedSummary = await translateTextSnippet(summary);

      return res.status(200).json({
        translatedTitle,
        translatedSummary,
        translatedHtml: html,
        translatedBlocks: blocks,
        _warn: "fallback_basic_translation",
      });
    }

    // ✅ Parseado OK → si faltan campos, los traducimos por separado
    let { translatedTitle, translatedSummary, translatedHtml, translatedBlocks } = parsed;

    if (!translatedTitle || translatedTitle.trim() === title.trim()) {
      translatedTitle = await translateTextSnippet(title);
    }
    if (!translatedSummary || translatedSummary.trim() === summary.trim()) {
      translatedSummary = await translateTextSnippet(summary);
    }

    return res.status(200).json({
      translatedTitle: translatedTitle || title,
      translatedSummary: translatedSummary || summary,
      translatedHtml: translatedHtml || html,
      translatedBlocks: Array.isArray(translatedBlocks) ? translatedBlocks : blocks,
    });
  } catch (e) {
    console.error("translate-blog exception:", e);
    return res.status(200).json({
      translatedTitle: title,
      translatedSummary: summary,
      translatedHtml: html,
      translatedBlocks: blocks,
      _warn: "fallback_copy_due_to_exception",
    });
  }
}
