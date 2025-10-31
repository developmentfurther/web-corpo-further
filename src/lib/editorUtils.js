// /lib/editorUtils.js
export function normalizeBlocks(blocks = []) {
  const safe = Array.isArray(blocks) ? blocks : [];
  if (safe.length > 0) return safe;
  return [
    {
      type: "paragraph",
      data: { text: "" },
    },
  ];
}
