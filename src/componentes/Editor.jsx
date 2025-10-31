import { useEffect, useRef } from "react";

export default function Editor({ data, onChange, holder }) {
  const ref = useRef();

  useEffect(() => {
    if (typeof window === "undefined") return;

    (async () => {
      const { default: EditorJS } = await import("@editorjs/editorjs");
      const { default: Header } = await import("@editorjs/header");
      const { default: List } = await import("@editorjs/list");
      const { default: Quote } = await import("@editorjs/quote");
      const { default: Paragraph } = await import("@editorjs/paragraph");

      if (ref.current) return;

      const editor = new EditorJS({
        holder,
        autofocus: true,
        data: data || { blocks: [] },
        tools: {
          paragraph: { class: Paragraph, inlineToolbar: true },
          header: { class: Header, inlineToolbar: true },
          list: { class: List, inlineToolbar: true },
          quote: { class: Quote, inlineToolbar: true },
        },
        async onChange(api) {
          const content = await api.saver.save();
          onChange(content);
        },
      });

      ref.current = editor;
    })();

    return () => {
      if (ref.current?.destroy) ref.current.destroy();
      ref.current = null;
    };
  }, [holder]);

  return (
    <div
      id={holder}
      className="prose prose-invert max-w-none [&_h1]:text-3xl [&_h2]:text-2xl [&_p]:text-base"
    />
  );
}