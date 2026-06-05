import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useToast } from '../components/common/Toast'
import { sampleNotes } from '../features/notes/notesService'

export default function SharedNotePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { show } = useToast()
  
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('toxic')
  const [reportDesc, setReportDesc] = useState('')
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)

  // Giả lập tìm ghi chú (hỗ trợ cả ghi chú mẫu và ghi chú trong localStorage)
  useEffect(() => {
    setLoading(true)
    // 1. Thử tìm trong sampleNotes
    let found = sampleNotes.find((n) => n.id === id)
    
    // 2. Thử tìm trong localStorage nếu có lưu trữ người dùng
    if (!found) {
      try {
        const local = localStorage.getItem('jotdown_notes')
        if (local) {
          const parsed = JSON.parse(local)
          found = parsed.find((n) => n.id === id)
        }
      } catch (err) {
        console.error(err)
      }
    }

    // Thiết lập giả lập ghi chú nếu không tìm thấy để demo tuyệt vời nhất
    if (!found) {
      found = {
        id: id || 'demo-shared',
        title: 'Tài liệu hướng dẫn JotDown Community',
        content: 'Chào mừng bạn đến với cộng đồng chia sẻ ghi chú! Đây là nơi bạn có thể xuất bản các ghi chú học tập, công việc hoặc ý tưởng sáng tạo cá nhân của mình ở chế độ công khai để bất kỳ ai cũng có thể tham khảo.\n\nTính năng nổi bật:\n- Chia sẻ tức thì bằng đường dẫn\n- Giao diện đọc tối giản, tập trung\n- Hệ thống báo cáo nội dung xấu trực tiếp để bảo vệ cộng đồng lành mạnh.',
        color: '#DBEAFE',
        visibility: 'public',
        updatedAt: new Date().toISOString(),
        author: {
          name: 'Nguyễn Văn Minh',
          avatar: 'M',
          role: 'Pro Creator'
        }
      }
    }

    // Đảm bảo ghi chú này ở trạng thái public để xem được
    if (found && found.visibility !== 'public') {
      found.visibility = 'public'
    }

    setNote(found)
    setLoading(false)
  }, [id])

  const handleReportSubmit = (e) => {
    e.preventDefault()
    setIsSubmittingReport(true)
    
    // Giả lập lưu báo cáo vào localStorage để hiển thị bên trang Admin Reports nếu cần
    try {
      const reports = JSON.parse(localStorage.getItem('jotdown_reports') || '[]')
      const newReport = {
        id: `REP-${Math.floor(100 + Math.random() * 900)}`,
        note_id: note.id,
        note_title: note.title,
        reporter: 'Khách vãng lai (Community)',
        reason: reportReason === 'toxic' ? 'Nội dung độc hại' : reportReason === 'copyright' ? 'Vi phạm bản quyền' : reportReason === 'spam' ? 'Spam / Rác' : 'Lý do khác',
        description: reportDesc,
        status: 'pending',
        priority: reportReason === 'toxic' ? 'high' : 'medium',
        created_at: new Date().toISOString()
      }
      localStorage.setItem('jotdown_reports', JSON.stringify([newReport, ...reports]))
    } catch (err) {
      console.error(err)
    }

    setTimeout(() => {
      show({
        type: 'success',
        title: 'Đã gửi báo cáo thành công',
        message: 'Cảm ơn bạn đã đóng góp giúp cộng đồng JotDown an toàn hơn!'
      })
      setIsSubmittingReport(false)
      setShowReportModal(false)
      setReportDesc('')
    }, 1000)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    show({ type: 'success', title: 'Đã sao chép liên kết chia sẻ' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Đang tải ghi chú...</p>
        </div>
      </div>
    )
  }

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

      {/* Main content body container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        <article 
          className="rounded-3xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm p-6 sm:p-8 space-y-6 transition-all"
          style={{ backgroundColor: note.color ? `${note.color}15` : undefined }} // Subtle tint of note color
        >
          {/* Note Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
                {note.author?.avatar || 'A'}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-850 dark:text-white">{note.author?.name || 'Tác giả ẩn danh'}</h3>
                <p className="text-[11px] text-slate-400">{note.author?.role || 'Thành viên JotDown'}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-[11px] text-slate-400">Cập nhật lần cuối</p>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-350">
                {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Gần đây'}
              </p>
            </div>
          </div>

          {/* Title and Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {note.title}
            </h1>
            
            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">
              {note.content || <em className="text-slate-400">Không có nội dung.</em>}
            </div>
          </div>
        </article>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} JotDown App. Xem & chia sẻ ghi chú cộng đồng an toàn.</p>
      </footer>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-modal animate-slide-up border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-850">
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

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-red-500 hover:bg-red-650 text-white transition-colors disabled:opacity-50"
                >
                  {isSubmittingReport ? 'Đang gửi...' : 'Gửi báo cáo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
