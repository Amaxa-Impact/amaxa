'use client'

import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

const Tiptap = ({
  text,
}: {
  id: string,
  text: JSONContent
}) => {
  const [content, setContent] = useState(text)
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate(props) {
      setContent(props.editor.getJSON())
    },
  })

  return <EditorContent editor={editor} />
}

export default Tiptap
