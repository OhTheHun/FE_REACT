import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useToast } from '../components/common/Toast'
import { fetchPublicNoteById, likeNote, reportNote } from '../features/notes/notesService'
import { apiFetch } from '../services/api'

export default function SharedNotePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { show } = useToast()

  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('toxic')
  const [reportDesc, setReportDesc] = useState('')
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  useEffect(() => {
    const likedIds = JSON.parse(localStorage.getItem('jotdown_liked_notes') || '[]')
    setLiked(likedIds.includes(id))
  }, [id])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)

    fetchPublicNoteById(id)
      .then((data) => {
        if (!cancelled) {
          setNote(data)
          setLikesCount(data?.likes_count || 0)
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  const handleLike = async () => {
    const alreadyLiked = liked
    setLiked(!alreadyLiked)
    setLikesCount((c) => c + (alreadyLiked ? -1 : 1))

    const likedIds = JSON.parse(localStorage.getItem('jotdown_liked_notes') || '[]')
    const newIds = alreadyLiked ? likedIds.filter((x) => x !== id) : [...likedIds, id]
    localStorage.setItem('jotdown_liked_notes', JSON.stringify(newIds))

    try {
      await likeNote(id)
    } catch {
      // revert
      setLiked(alreadyLiked)
      setLikesCount((c) => c + (alreadyLiked ? 1 : -1))
    }
  }

  const handleReportSubmit = async (e) => {
    e.preventDefault()
    setIsSubmittingReport(true)

    // Translate technical reason key to user-friendly category name
    const reasonLabels = {
      toxic: 'Nội dung độc hại, xúc phạm hoặc bạo lực',
      copyright: 'Vi phạm bản quyền sở hữu trí tuệ',
      spam: 'Nội dung spam, quảng cáo rác',
      other: 'Lý do khác'
    }
    const categoryLabel = reasonLabels[reportReason] || 'Báo cáo vi phạm'
    const mergedReason = `[${categoryLabel}] - ${reportDesc.trim()}`

    try {
      await reportNote(id, { reason: mergedReason })
      show({ type: 'success', title: 'Đã gửi báo cáo', message: 'Cảm ơn bạn đã giúp cộng đồng JotDown an toàn hơn!' })
    } catch (err) {
      console.error('Lỗi khi gửi báo cáo lên API:', err)
      // Fallback to localStorage if API not available yet
      try {
        const reports = JSON.parse(localStorage.getItem('jotdown_reports') || '[]')
        const newReport = {
          id: `REP-${Math.floor(100 + Math.random() * 900)}`,
          note_id: id,
          note_title: note?.title,
          reason: mergedReason,
          status: 'pending',
          created_at: new Date().toISOString(),
        }
        localStorage.setItem('jotdown_reports', JSON.stringify([newReport, ...reports]))
        show({ type: 'success', title: 'Đã gửi báo cáo', message: 'Cảm ơn bạn đã đóng góp!' })
      } catch { /* ignore */ }
    } finally {
      setIsSubmittingReport(false)
      setShowReportModal(false)
      setReportDesc('')
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    show({ type: 'success', title: 'Đã sao chép liên kết chia sẻ' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Đang tải ghi chú...</p>
        </div>
      </div>
    )
  }

  if (notFound || !note) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950 text-center p-6">
        <span className="text-6xl">🔒</span>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ghi chú không tồn tại</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Ghi chú này không công khai, đã bị xóa, hoặc đường dẫn không hợp lệ.
        </p>
        <button
          onClick={() => navigate('/shared-notes')}
          className="px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold transition-all cursor-pointer"
        >
          ← Khám phá cộng đồng
        </button>
      </div>
    )
  }

  const rawAuthorName = note.user?.name || note.author?.name || note.author || ''
  const authorName = (rawAuthorName && rawAuthorName !== 'Ẩn danh') ? rawAuthorName : 'Thành viên JotDown'
  const authorInitial = authorName.charAt(0).toUpperCase()


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">JotDown</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold uppercase">Shared</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
            >
              🔗 Sao chép link
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 transition-colors flex items-center gap-1"
            >
              🚩 Báo cáo
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        <article
          className="rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-6 sm:p-8 space-y-6 transition-all bg-white dark:bg-slate-900"
          style={{ borderLeftColor: note.color || undefined, borderLeftWidth: note.color ? '4px' : undefined }}
        >
          {/* Author + meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
                {authorInitial}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{authorName}</h3>
                <p className="text-[11px] text-slate-400">Thành viên JotDown</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Like button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 ${
                  liked
                    ? 'bg-red-100 dark:bg-red-950/30 text-red-500 border border-red-200 dark:border-red-900/50'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-500 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{liked ? '❤️' : '🤍'}</span>
                <span>{likesCount}</span>
              </button>

              <div className="text-right">
                <p className="text-[11px] text-slate-400">Cập nhật lần cuối</p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-350">
                  {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                  }) : 'Gần đây'}
                </p>
              </div>
            </div>
          </div>

          {/* Title + Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {note.title}
            </h1>
            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
              {note.content || <em className="text-slate-400">Không có nội dung.</em>}
            </div>
          </div>
        </article>

        {/* CTA */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-950/20 dark:to-indigo-950/20 border border-primary-100 dark:border-primary-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Thích ghi chú kiểu này?</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tạo và chia sẻ ghi chú của riêng bạn với JotDown — hoàn toàn miễn phí.</p>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold transition-all hover:scale-[1.02] cursor-pointer"
          >
            ✍️ Bắt đầu viết ngay
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} JotDown App · <span className="cursor-pointer hover:text-primary-500" onClick={() => navigate('/shared-notes')}>Khám phá cộng đồng</span></p>
      </footer>

      {/* Report Modal */}
      {showReportModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-modal animate-slide-up border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🚩</span> Báo cáo nội dung vi phạm
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Lý do báo cáo</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                >
                  <option value="toxic">Nội dung độc hại, xúc phạm hoặc bạo lực</option>
                  <option value="copyright">Vi phạm bản quyền sở hữu trí tuệ</option>
                  <option value="spam">Nội dung spam, quảng cáo rác</option>
                  <option value="other">Lý do khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Chi tiết / Minh chứng</label>
                <textarea
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  required
                  placeholder="Vui lòng cung cấp thêm thông tin chi tiết về nội dung vi phạm..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                >
                  {isSubmittingReport ? 'Đang gửi...' : 'Gửi báo cáo'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
