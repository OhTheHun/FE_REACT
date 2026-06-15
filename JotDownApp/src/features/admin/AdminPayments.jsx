import { useState, useEffect } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useToast } from '../../components/common/Toast'
import { adminApi } from './adminApi'

const STATUS_MAP = {
  pending: { cls: 'badge-pending', label: 'Chờ duyệt' },
  success: { cls: 'badge-success', label: 'Thành công' },
  confirmed: { cls: 'badge-success', label: 'Thành công' },
  failed:  { cls: 'badge-failed',  label: 'Thất bại' },
}

const METHOD_ICON = {
  'VNPay': '💳',
  'MoMo': '🟣',
  'Ví Momo': '🟣',
  'Chuyển khoản': '🏦',
}

export default function AdminPayments() {
  const { show } = useToast()
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [approveTarget, setApproveTarget] = useState(null)
  
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPayments = async (p = 1, query = search) => {
    try {
      setLoading(true)
      const res = await adminApi.getPayments({ page: p, per_page: 20, q: query })
      setPayments(res.data || [])
      setPage(res.current_page || 1)
      setTotalPages(res.last_page || 1)
    } catch (err) {
      console.error(err)
      show({ type: 'error', message: 'Không thể tải danh sách giao dịch' })
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
    const delaySearch = setTimeout(() => {
      fetchPayments(1, search)
    }, 500)
    return () => clearTimeout(delaySearch)
  }, [search])

  const handleApprove = async (id) => {
    try {
      await adminApi.confirmPayment(id)
      show({ type: 'success', title: 'Đã duyệt giao dịch', message: `Mã ${id} được xác nhận thành công.` })
      fetchPayments(page, search)
      fetchStats()
    } catch (err) {
      show({ type: 'error', message: err.message || 'Lỗi khi xác nhận giao dịch' })
    } finally {
      setApproveTarget(null)
    }
  }

  const filtered = payments.filter((p) => {
    const pStatus = p.status === 'confirmed' ? 'success' : p.status
    const matchStatus = statusFilter === 'all' || pStatus === statusFilter || p.status === statusFilter
    return matchStatus
  })

  // Revenue summary (from global stats when possible, or estimate from current page)
  const totalRevenue = stats?.revenue || 0
  const pendingCount = payments.filter((p) => p.status === 'pending').length // approximate from current page if stats don't have it

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchPayments(newPage, search)
    }
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Giao dịch thanh toán</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Duyệt và kiểm tra lịch sử nâng cấp gói dịch vụ.</p>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Tổng doanh thu</p>
          <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
          </p>
          <p className="text-xs text-emerald-500 mt-1">Từ các gói trả phí</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Trạng thái (Trang này)</p>
          <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">{pendingCount}</p>
          <p className="text-xs text-amber-500 mt-1">Đang chờ duyệt</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Giao dịch thất bại</p>
          <p className="text-2xl font-extrabold text-red-700 dark:text-red-300 mt-1">
            {payments.filter((p) => p.status === 'failed').length}
          </p>
          <p className="text-xs text-red-400 mt-1">Tổng số lỗi (Trang này)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã, tên, email..."
            className="form-input pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
          {['all', 'pending', 'success', 'failed'].map((st) => (
            <button
              key={st}
              type="button"
              id={`payment-filter-${st}`}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors
                ${statusFilter === st
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
            >
              {st === 'all' ? 'Tất cả' : st === 'pending' ? ' Chờ duyệt' : st === 'success' ? ' Thành công' : ' Thất bại'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Mã đơn</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Khách hàng</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Gói</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Số tiền</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Phương thức</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Thời gian</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Trạng thái</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((p) => (
                <tr key={p.Id || p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="p-4 text-xs font-mono font-bold text-slate-600 dark:text-slate-300">{p.transaction_code || p.Id || p.id}</td>
                  <td className="p-4">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{p.user?.display_name || p.user_name || 'Unknown'}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{p.user?.email || p.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="badge-premium text-xs px-2 py-0.5 rounded-full font-medium">{p.plan?.name || p.plan || 'Premium'}</span>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">
                    {Number(p.amount).toLocaleString('vi-VN')}đ
                  </td>
                  <td className="p-4 text-xs text-slate-500 dark:text-slate-400">
                    {p.payment_method || p.method}
                  </td>
                  <td className="p-4 text-xs text-slate-400 whitespace-nowrap">{new Date(p.CreatedTime || p.date || p.created_at).toLocaleString('vi-VN')}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_MAP[p.status]?.cls || 'bg-slate-100'}`}>
                      {STATUS_MAP[p.status]?.label || p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {p.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          id={`approve-payment-${p.Id || p.id}`}
                          onClick={() => setApproveTarget(p.Id || p.id)}
                          className="btn-primary-custom py-1 px-3 text-xs"
                        >
                          Duyệt
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-xs text-slate-400 italic">Không tìm thấy giao dịch nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-400">
            <span>Trang {page} / {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-600 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-600 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm approve */}
      <ConfirmModal
        isOpen={approveTarget !== null}
        onClose={() => setApproveTarget(null)}
        onConfirm={() => handleApprove(approveTarget)}
        title="Duyệt giao dịch"
        message="Xác nhận rằng người dùng đã thanh toán đủ tiền nâng cấp gói. Hành động này sẽ tự động nâng cấp tài khoản của họ."
        variant="info"
        confirmText="Xác nhận duyệt"
        cancelText="Hủy"
      />
    </div>
  )
}

