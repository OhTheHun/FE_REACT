import { useCallback, useMemo, useState } from 'react'
import { createEmptyNote, sampleNotes } from '../features/notes/notesService'

export function useNoteWorkspace() {
  const [notes, setNotes] = useState(sampleNotes)
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id || '')

  const addNote = useCallback(() => {
    const note = createEmptyNote()
    setNotes((current) => [note, ...current])
    setSelectedNoteId(note.id)
  }, [])

  const deleteNote = useCallback((id) => {
    setNotes((current) => current.filter((note) => note.id !== id))
    setSelectedNoteId((currentId) => (currentId === id ? notes[0]?.id || '' : currentId))
  }, [notes])

  const updateNote = useCallback((updated) => {
    setNotes((current) =>
      current.map((note) => (note.id === updated.id ? { ...note, ...updated, updatedAt: new Date().toISOString() } : note)),
    )
  }, [])

  const selectedNote = useMemo(() => notes.find((note) => note.id === selectedNoteId) || notes[0], [notes, selectedNoteId])

  return {
    notes,
    selectedNoteId,
    selectedNote,
    setSelectedNoteId,
    addNote,
    deleteNote,
    updateNote,
  }
}
