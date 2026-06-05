import { formatDate } from '../../utils/formatDate'

const NOTE_COLOR_MAP = {
  '#ffffff': 'note-color-default',
  '#FEF3C7': 'note-color-yellow',
  '#D1FAE5': 'note-color-green',
  '#DBEAFE': 'note-color-blue',
  '#FCE7F3': 'note-color-pink',
  '#FFEDD5': 'note-color-orange',
  '#EDE9FE': 'note-color-purple',
}

function NoteStatusBadge({ icon, title, color }) {
  return (
    <span title={title} className={`inline-flex items-center ${color}`}>
      {icon}
    </span>
  )
}

export default function NoteCard({ note, active, view = 'list', onSelect, onDelete }) {
  const colorClass = NOTE_COLOR_MAP[note.color] || 'note-color-default'

  const badges = [
    note.is_pinned && (
      <NoteStatusBadge
        key="pin"
        title="Đã ghim"
        color="text-amber-500"
        icon={
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
          </svg>
        }
      />
    ),
    note.is_favorite && (
      <NoteStatusBadge
        key="fav"
        title="Yêu thích"
        color="text-red-500"
        icon={
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        }
      />
    ),
    note.is_protected && (
      <NoteStatusBadge
        key="lock"
        title="Được bảo vệ"
        color="text-slate-500"
        icon={
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        }
      />
    ),
    note.visibility === 'public' && (
      <NoteStatusBadge
        key="pub"
        title="Công khai"
        color="text-emerald-500"
        icon={
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    ),
  ].filter(Boolean)

  if (view === 'grid') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => e.key === 'Enter' && onSelect()}
        className={`relative rounded-2xl border-2 p-4 cursor-pointer transition-all duration-200 group min-h-[140px] flex flex-col
          ${active ? 'border-primary-400 shadow-md' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-card-hover'}
          ${colorClass}`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 flex-1">{note.title}</h3>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-all cursor-pointer flex-shrink-0"
            title="Xóa ghi chú"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 flex-1">{note.content}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">{badges}</div>
          <span className="text-xs text-slate-400">{formatDate(note.updatedAt || note.UpdatedTime)}</span>
        </div>
      </div>
    )
  }

  // List view
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className={`flex items-start gap-3 px-4 py-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 group
        ${active ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-900/10' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/30'}
      `}
    >
      {/* Color dot */}
      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colorClass} border border-slate-200 dark:border-slate-600`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate flex-1">{note.title}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">{badges}</div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{note.content}</p>
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">{formatDate(note.updatedAt || note.UpdatedTime)}</span>
      </div>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete() }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-500 transition-all cursor-pointer flex-shrink-0 self-center"
        title="Xóa ghi chú"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}
