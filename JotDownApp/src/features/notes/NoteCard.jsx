import { formatDate } from '../../utils/formatDate'

function NoteCard({ note, active, onSelect, onDelete }) {
  return (
    <div className={`card rounded-3xl border ${active ? 'border-primary bg-primary/10' : 'border-slate-200 bg-white'} shadow-sm`}>
      <div className="card-body p-4">
        <button className="btn btn-ghost btn-square btn-sm text-slate-500" onClick={onDelete} type="button">
          ✕
        </button>
        <h3 className="text-lg font-semibold text-slate-900" onClick={onSelect}>
          {note.title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2">{note.content}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{formatDate(note.updatedAt)}</span>
          <button className="btn btn-xs btn-outline" type="button" onClick={onSelect}>
            Mở
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteCard
