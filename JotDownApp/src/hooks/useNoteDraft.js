import { useEffect, useState } from 'react'
import { useNoteWorkspace } from './useNoteWorkspace'

export function useNoteDraft(selectedNote) {
  const { updateNote } = useNoteWorkspace()
  const [title, setTitle] = useState(selectedNote?.title || '')
  const [content, setContent] = useState(selectedNote?.content || '')

  useEffect(() => {
    setTitle(selectedNote?.title || '')
    setContent(selectedNote?.content || '')
  }, [selectedNote])

  const save = () => {
    if (!selectedNote) return
    updateNote({ id: selectedNote.id, title, content })
  }

  const reset = (note) => {
    setTitle(note?.title || '')
    setContent(note?.content || '')
  }

  return { title, content, setTitle, setContent, save, reset }
}
