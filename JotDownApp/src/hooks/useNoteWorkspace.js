/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createNote as createNoteApi,
  deleteNote as deleteNoteApi,
  fetchNotes,
  favoriteNote,
  pinNote,
  protectNote,
  updateNote as updateNoteApi,
} from '../features/notes/notesService'

export function useNoteWorkspace(filters = {}) {
  const [notes, setNotes] = useState([])
  const [selectedNoteId, setSelectedNoteId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Giữ filters mới nhất qua ref để tránh stale closure
  const filtersKey = JSON.stringify(filters)

  const refreshNotes = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const nextNotes = await fetchNotes(filters)
      setNotes(nextNotes)
      setSelectedNoteId((currentId) => currentId || nextNotes[0]?.id || '')
    } catch (err) {
      setError(err.message || 'Không thể tải ghi chú.')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey])

  useEffect(() => {
    refreshNotes()
  }, [refreshNotes])

  const addNote = useCallback(async (extras = {}) => {
    const note = await createNoteApi(extras)
    setNotes((current) => [note, ...current])
    setSelectedNoteId(note.id)
    return note
  }, [])

  const deleteNote = useCallback(async (id) => {
    await deleteNoteApi(id)
    setNotes((current) => {
      const nextNotes = current.filter((note) => note.id !== id)
      setSelectedNoteId((currentId) => (currentId === id ? nextNotes[0]?.id || '' : currentId))
      return nextNotes
    })
  }, [])

  const updateNote = useCallback(async (updated) => {
    const note = await updateNoteApi(updated)
    setNotes((current) =>
      current.map((item) => (item.id === note.id ? { ...item, ...note } : item)),
    )
    return note
  }, [])

  const updatePinStatus = useCallback(async (id, isPinned) => {
    const note = await pinNote(id, isPinned)
    setNotes((current) =>
      current.map((item) => (item.id === note.id ? { ...item, ...note } : item)),
    )
    return note
  }, [])

  const updateFavoriteStatus = useCallback(async (id, isFavorite) => {
    const note = await favoriteNote(id, isFavorite)
    setNotes((current) =>
      current.map((item) => (item.id === note.id ? { ...item, ...note } : item)),
    )
    return note
  }, [])

  const updateProtectionStatus = useCallback(async (id, isProtected, password) => {
    const note = await protectNote(id, isProtected, password)
    setNotes((current) =>
      current.map((item) => (item.id === note.id ? { ...item, ...note } : item)),
    )
    return note
  }, [])

  const selectedNote = useMemo(() => notes.find((note) => note.id === selectedNoteId) || notes[0], [notes, selectedNoteId])

  return {
    notes,
    selectedNoteId,
    selectedNote,
    loading,
    error,
    refreshNotes,
    setSelectedNoteId,
    addNote,
    deleteNote,
    updateNote,
    updatePinStatus,
    updateFavoriteStatus,
    updateProtectionStatus,
  }
}
