import { useState, useEffect } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useToast } from '../../components/common/Toast'
import { adminApi } from './adminApi'

const PRIORITY_STYLE = {
  high:   { cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',     label: '🔴 Cao' },
  medium: { cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', label: '🟡 Trung bình' },
  low:    { cls: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', label: '🟢 Thấp' },
}

export default function AdminReports() {
  const { show } = useToast()
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState('pending')
  const [confirmHideTarget, setConfirmHideTarget] = useState(null)
  const [confirmIgnoreTarget, setConfirmIgnoreTarget] = useState(null)
  
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchReports = async (p = 1, status = activeTab) => {
    try {
      setLoading(true)
      // the backend statuses are pending, resolved, rejected
      // frontend tabs were pending, resolved. We map 'resolved' tab to both or just use backend values
      let apiStatus = status
      if (status === 'resolved') {
        // Backend returns either resolved or rejected. We might need to fetch without status to get all non-pending?
        // Or backend just gives paginated data. Let's fetch without status if tab is resolved, and filter frontend, 
        // OR better, change tabs to: pending, resolved, rejected
      }
      
      const queryStatus = status === 'pending' ? 'pending' : (status === 'resolved' ? 'resolved' : 'rejected')
      const res = await adminApi.getReports({ page: p, per_page: 10, status: status === 'all' ? '' : queryStatus })
      
      setReports(res.data || [])
      setPage(res.current_page || 1)
      setTotalPages(res.last_page || 1)
    } catch (err) {
      console.error(err)
      show({ type: 'error', message: 'Không thể tải danh sách báo cáo' })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await adminApi.getDashboardStats()
      setStats(res)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    fetchReports(1, activeTab)
  }, [activeTab])

  const handleHideNote = async (id) => {
    try {
      await adminApi.actionReport(id, { action: 'hide_note' })
      show({ type: 'success', title: 'Ẩn ghi chú thành công', message: `Đã xử lý ẩn nội dung báo cáo ${id}.` })
      fetchReports(page, activeTab)
      fetchStats()
    } catch (err) {
      show({ type: 'error', message: err.message || 'Lỗi khi xử lý báo cáo' })
    } finally {
      setConfirmHideTarget(null)
    }
  }

  const handleIgnoreReport = async (id) => {
    try {
      await adminApi.actionReport(id, { action: 'reject' })
      show({ type: 'info', title: 'Bỏ qua báo cáo', message: `Báo cáo ${id} đã bị từ chối/bỏ qua.` })
      fetchReports(page, activeTab)
      fetchStats()
    } catch (err) {
      show({ type: 'error', message: err.message || 'Lỗi khi từ chối báo cáo' })
    } finally {
      setConfirmIgnoreTarget(null)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchReports(newPage, activeTab)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Báo cáo vi phạm</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Xử lý báo cáo nội dung công khai vi phạm tiêu chuẩn từ người dùng.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">{stats?.unresolved_reports || 0}</p>
          <p className="text-xs font-semibold text-red-500 mt-1">Chờ xử lý</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap
            ${activeTab === 'pending'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
        >
          Chờ xử lý
          {stats?.unresolved_reports > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center">
              {stats.unresolved_reports}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('resolved')}
          className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap
            ${activeTab === 'resolved'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
        >
          Đã xử lý
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap
            ${activeTab === 'rejected'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
        >
          Đã bỏ qua / Từ chối
        </button>
      </div>

      {/* Reports list */}
      <div className="space-y-3 min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-sm font-semibold text-slate-400">Không có báo cáo nào ở mục này!</p>
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.Id || report.id}
              className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Left info */}
                <div className="flex-1 space-y-2">
                  {/* Header row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md font-mono">
                      {report.Id || report.id}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PRIORITY_STYLE[report.priority]?.cls || PRIORITY_STYLE.medium.cls}`}>
                      {PRIORITY_STYLE[report.priority]?.label || PRIORITY_STYLE.medium.label}
                    </span>
                    {report.status !== 'pending' && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase
                        ${report.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                        {report.status === 'resolved' ? '✓ Đã xử lý' : '– Đã từ chối'}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 ml-auto">{new Date(report.CreatedTime || report.created_at).toLocaleString('vi-VN')}</span>
                  </div>

                  {/* Note title */}
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">📄</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        &quot;{report.note?.title || 'Unknown Note'}&quot;
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">Lý do:</span> {report.reason}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Bởi: <span className="font-medium">{report.reporter?.display_name || 'Anonymous'}</span> ({report.reporter?.email || ''})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {report.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0 self-center sm:self-start sm:mt-6">
                    <button
                      type="button"
                      id={`ignore-report-${report.Id || report.id}`}
                      onClick={() => setConfirmIgnoreTarget(report.Id || report.id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
                    >
                      Bỏ qua
                    </button>
                    <button
                      type="button"
                      id={`hide-report-${report.Id || report.id}`}
                      onClick={() => setConfirmHideTarget(report.Id || report.id)}
                      className="btn-danger-custom py-1.5 px-3 text-xs"
                    >
                      🚫 Ẩn ghi chú
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="py-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">Trang {page} / {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="px-3 py-1 rounded border border-slate-200 dark:border-slate-600 disabled:opacity-50"
            >
              Trước
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="px-3 py-1 rounded border border-slate-200 dark:border-slate-600 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}

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

