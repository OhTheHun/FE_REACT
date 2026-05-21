import { useState } from 'react'

export function useNoteDraft(selectedNote, updateNote) {
  const [title, setTitle] = useState(selectedNote?.title || '')
  const [content, setContent] = useState(selectedNote?.content || '')

  const save = () => {
    if (!selectedNote || !updateNote) return
    updateNote({ id: selectedNote.id, title, content })
  }

  return { title, content, setTitle, setContent, save }
}
