import { useState } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useToast } from '../../components/common/Toast'

const MOCK_REPORTS = [
  { id: 'REP-101', note_title: 'Tài liệu mật học kì 1', reported_by: 'user1@example.com', reporter_name: 'Trần Thị B', reason: 'Vi phạm bản quyền tài liệu đại học', status: 'pending', date: '2026-06-05 10:15', priority: 'high' },
  { id: 'REP-102', note_title: 'Chia sẻ khóa học lậu', reported_by: 'user2@example.com', reporter_name: 'Lê Văn C', reason: 'Spam quảng cáo thương mại trái phép', status: 'pending', date: '2026-06-04 15:40', priority: 'high' },
  { id: 'REP-103', note_title: 'Note nháp cá nhân', reported_by: 'admin@example.com', reporter_name: 'Admin', reason: 'Nội dung chứa liên kết độc hại', status: 'resolved', date: '2026-06-02 11:20', priority: 'medium' },
  { id: 'REP-104', note_title: 'Bài viết không phù hợp', reported_by: 'user4@example.com', reporter_name: 'Nguyễn Văn A', reason: 'Nội dung phản cảm, vi phạm cộng đồng', status: 'ignored', date: '2026-05-31 08:30', priority: 'low' },
]

const PRIORITY_STYLE = {
  high:   { cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',     label: '🔴 Cao' },
  medium: { cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: '🟡 Trung bình' },
  low:    { cls: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', label: '🟢 Thấp' },
}

export default function AdminReports() {
  const { show } = useToast()
  const [reports, setReports] = useState(MOCK_REPORTS)
  const [activeTab, setActiveTab] = useState('pending')
  const [confirmHideTarget, setConfirmHideTarget] = useState(null)
  const [confirmIgnoreTarget, setConfirmIgnoreTarget] = useState(null)

  const handleHideNote = (id) => {
    setReports(reports.map((r) => r.id === id ? { ...r, status: 'resolved' } : r))
    show({ type: 'success', title: 'Ẩn ghi chú thành công', message: `Đã xử lý ẩn nội dung báo cáo ${id}.` })
    setConfirmHideTarget(null)
  }

  const handleIgnoreReport = (id) => {
    setReports(reports.map((r) => r.id === id ? { ...r, status: 'ignored' } : r))
    show({ type: 'info', title: 'Bỏ qua báo cáo', message: `Báo cáo ${id} đã được bỏ qua.` })
    setConfirmIgnoreTarget(null)
  }

  const pendingReports = reports.filter((r) => r.status === 'pending')
  const resolvedReports = reports.filter((r) => r.status !== 'pending')
  const displayedReports = activeTab === 'pending' ? pendingReports : resolvedReports

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Báo cáo vi phạm</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Xử lý báo cáo nội dung công khai vi phạm tiêu chuẩn từ người dùng.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">{pendingReports.length}</p>
          <p className="text-xs font-semibold text-red-500 mt-1">Chờ xử lý</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-4">
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {reports.filter((r) => r.status === 'resolved').length}
          </p>
          <p className="text-xs font-semibold text-emerald-500 mt-1">Đã xử lý</p>
        </div>
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/50 p-4">
          <p className="text-2xl font-extrabold text-slate-600 dark:text-slate-300">
            {reports.filter((r) => r.status === 'ignored').length}
          </p>
          <p className="text-xs font-semibold text-slate-400 mt-1">Đã bỏ qua</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          type="button"
          id="tab-reports-pending"
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all border-b-2 cursor-pointer
            ${activeTab === 'pending'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
        >
          Chờ xử lý
          {pendingReports.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {pendingReports.length}
            </span>
          )}
        </button>
        <button
          type="button"
          id="tab-reports-resolved"
          onClick={() => setActiveTab('resolved')}
          className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 cursor-pointer
            ${activeTab === 'resolved'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
        >
          Đã xử lý / Bỏ qua ({resolvedReports.length})
        </button>
      </div>

      {/* Reports list */}
      <div className="space-y-3">
        {displayedReports.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-sm font-semibold text-slate-400">Không có báo cáo nào cần xử lý!</p>
          </div>
        )}

        {displayedReports.map((report) => (
          <div
            key={report.id}
            className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-card"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* Left info */}
              <div className="flex-1 space-y-2">
                {/* Header row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md font-mono">
                    {report.id}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PRIORITY_STYLE[report.priority]?.cls}`}>
                    {PRIORITY_STYLE[report.priority]?.label}
                  </span>
                  {report.status !== 'pending' && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase
                      ${report.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                      {report.status === 'resolved' ? '✓ Đã ẩn ghi chú' : '– Đã bỏ qua'}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 ml-auto">{report.date}</span>
                </div>

                {/* Note title */}
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">📄</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      &quot;{report.note_title}&quot;
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Lý do:</span> {report.reason}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Bởi: <span className="font-medium">{report.reporter_name}</span> ({report.reported_by})
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {report.status === 'pending' && (
                <div className="flex gap-2 flex-shrink-0 self-center sm:self-start sm:mt-6">
                  <button
                    type="button"
                    id={`ignore-report-${report.id}`}
                    onClick={() => setConfirmIgnoreTarget(report.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="button"
                    id={`hide-report-${report.id}`}
                    onClick={() => setConfirmHideTarget(report.id)}
                    className="btn-danger-custom py-1.5 px-3 text-xs"
                  >
                    🚫 Ẩn ghi chú
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={confirmHideTarget !== null}
        onClose={() => setConfirmHideTarget(null)}
        onConfirm={() => handleHideNote(confirmHideTarget)}
        title="Xử phạt: Ẩn ghi chú"
        message="Ghi chú bị báo cáo sẽ được chuyển chế độ sang Riêng tư vĩnh viễn và ẩn khỏi mọi không gian công cộng."
        variant="danger"
        confirmText="Xác nhận ẩn"
        cancelText="Hủy"
      />
      <ConfirmModal
        isOpen={confirmIgnoreTarget !== null}
        onClose={() => setConfirmIgnoreTarget(null)}
        onConfirm={() => handleIgnoreReport(confirmIgnoreTarget)}
        title="Bỏ qua báo cáo"
        message="Bạn chắc chắn nội dung ghi chú này hợp lệ và muốn đóng báo cáo này?"
        variant="warning"
        confirmText="Đồng ý bỏ qua"
        cancelText="Hủy"
      />
    </div>
  )
}
