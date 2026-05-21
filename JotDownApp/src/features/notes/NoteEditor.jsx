import { useEffect } from 'react'

function NoteEditor({ note, draft }) {
  useEffect(() => {
    if (!note) return
    draft.reset(note)
  }, [note, draft])

  if (!note) {
    return <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-600">Chọn một ghi chú để bắt đầu.</div>
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <input
          type="text"
          value={draft.title}
          onChange={(event) => draft.setTitle(event.target.value)}
          className="input input-bordered input-primary w-full"
          placeholder="Tiêu đề ghi chú"
        />
        <textarea
          rows={10}
          value={draft.content}
          onChange={(event) => draft.setContent(event.target.value)}
          className="textarea textarea-bordered textarea-primary w-full"
          placeholder="Nội dung ghi chú"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 text-slate-600">
          <p className="text-sm">Lưu ý ghi chú sẽ được cập nhật tạm thời.</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={draft.save}>
          Lưu thay đổi
        </button>
      </div>
    </div>
  )
}

export default NoteEditor
