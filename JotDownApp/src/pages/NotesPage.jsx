import NoteCard from '../features/notes/NoteCard'
import NoteEditor from '../features/notes/NoteEditor'
import { useNoteWorkspace } from '../hooks/useNoteWorkspace'
import { useNoteDraft } from '../hooks/useNoteDraft'

function NotesPage() {
  const { notes, selectedNoteId, setSelectedNoteId, addNote, deleteNote } = useNoteWorkspace()
  const selectedNote = notes.find((note) => note.id === selectedNoteId) || notes[0]
  const noteDraft = useNoteDraft(selectedNote)

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Your workspace</p>
            <h1 className="text-2xl font-semibold text-slate-900">Ghi chú</h1>
          </div>
          <button className="btn btn-primary btn-sm" onClick={addNote}>
            Thêm note
          </button>
        </div>
        <div className="space-y-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              active={note.id === selectedNote?.id}
              onSelect={() => setSelectedNoteId(note.id)}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Note editor</p>
            <h2 className="text-2xl font-semibold text-slate-900">Chi tiết</h2>
          </div>
        </div>
        <NoteEditor note={selectedNote} draft={noteDraft} />
      </section>
    </div>
  )
}

export default NotesPage
