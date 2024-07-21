"use client";

import { useState } from "react";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Tiptap = ({ text }: { id: string; text: JSONContent }) => {
  const [content, setContent] = useState(text);
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate(props) {
      setContent(props.editor.getJSON());
    },
  });

  return <EditorContent editor={editor} />;
};

export default Tiptap;
