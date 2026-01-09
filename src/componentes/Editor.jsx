// /componentes/Editor.jsx
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
      const { default: ImageTool } = await import("@editorjs/image");


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
        

            
          
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file) {
                  try {
                    const formData = new FormData();
                    formData.append("file", file);

                    const response = await fetch("/api/upload-imagekit", {
                      method: "POST",
                      body: formData,
                    });

                    const data = await response.json();

                    if (!response.ok || !data?.url) {
                      throw new Error(data.error || "Error al subir imagen");
                    }

                    return {
                      success: 1,
                      file: {
                        url: data.optimizedUrl || data.url,
                      },
                    };
                  } catch (error) {
                    console.error("Error uploading image:", error);
                    return {
                      success: 0,
                      message: error.message || "Error al subir la imagen",
                    };
                  }
                },

                async uploadByUrl(url) {
                  return {
                    success: 1,
                    file: {
                      url: url,
                    },
                  };
                },
              },
            },
          },
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
      className="prose prose-invert max-w-none [&_h1]:text-3xl [&_h2]:text-2xl [&_p]:text-base [&_img]:rounded-lg [&_img]:my-4"
    />
  );
}