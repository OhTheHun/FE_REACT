import { useState } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useToast } from '../../components/common/Toast'

const MOCK_PAYMENTS = [
  { id: 'TXN-1001', user_name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', plan: 'Premium', amount: 79000, method: 'VNPay', status: 'pending', date: '2026-06-05 14:30' },
  { id: 'TXN-1002', user_name: 'Trần Thị B', email: 'tranthib@example.com', plan: 'Premium', amount: 79000, method: 'MoMo', status: 'success', date: '2026-06-04 09:15' },
  { id: 'TXN-1003', user_name: 'Lê Văn C', email: 'levanc@example.com', plan: 'Premium', amount: 79000, method: 'Ví Momo', status: 'failed', date: '2026-06-03 18:22' },
  { id: 'TXN-1004', user_name: 'Đặng Văn E', email: 'dangvane@example.com', plan: 'Premium', amount: 79000, method: 'Chuyển khoản', status: 'success', date: '2026-06-02 11:00' },
  { id: 'TXN-1005', user_name: 'Vũ Thị F', email: 'vuthif@example.com', plan: 'Premium', amount: 79000, method: 'VNPay', status: 'pending', date: '2026-06-01 08:45' },
]

const STATUS_MAP = {
  pending: { cls: 'badge-pending', label: 'Chờ duyệt' },
  success: { cls: 'badge-success', label: 'Thành công' },
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
  const [payments, setPayments] = useState(MOCK_PAYMENTS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [approveTarget, setApproveTarget] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)

  const handleApprove = (id) => {
    setPayments(payments.map((p) => p.id === id ? { ...p, status: 'success' } : p))
    show({ type: 'success', title: 'Đã duyệt giao dịch', message: `${id} được xác nhận thành công.` })
    setApproveTarget(null)
  }

  const handleReject = (id) => {
    setPayments(payments.map((p) => p.id === id ? { ...p, status: 'failed' } : p))
    show({ type: 'error', title: 'Đã từ chối giao dịch', message: `${id} bị đánh dấu thất bại.` })
    setRejectTarget(null)
  }

  const filtered = payments.filter((p) => {
    const matchSearch = !search || p.user_name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  // Revenue summary
  const successPayments = payments.filter((p) => p.status === 'success')
  const totalRevenue = successPayments.reduce((sum, p) => sum + p.amount, 0)
  const pendingCount = payments.filter((p) => p.status === 'pending').length

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Giao dịch thanh toán</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Duyệt và kiểm tra lịch sử nâng cấp gói dịch vụ.</p>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Tổng doanh thu</p>
          <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
            {totalRevenue.toLocaleString('vi-VN')}đ
          </p>
          <p className="text-xs text-emerald-500 mt-1">{successPayments.length} giao dịch thành công</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Đang chờ duyệt</p>
          <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">{pendingCount}</p>
          <p className="text-xs text-amber-500 mt-1">Cần xử lý ngay</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Giao dịch thất bại</p>
          <p className="text-2xl font-extrabold text-red-700 dark:text-red-300 mt-1">
            {payments.filter((p) => p.status === 'failed').length}
          </p>
          <p className="text-xs text-red-400 mt-1">Tổng số lỗi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
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
        <div className="flex gap-2">
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
              {st === 'all' ? 'Tất cả' : st === 'pending' ? '⏳ Chờ duyệt' : st === 'success' ? '✓ Thành công' : '✗ Thất bại'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="p-4 text-xs font-mono font-bold text-slate-600 dark:text-slate-300">{p.id}</td>
                  <td className="p-4">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{p.user_name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{p.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="badge-premium text-xs px-2 py-0.5 rounded-full font-medium">{p.plan}</span>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">
                    {p.amount.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="p-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span>{METHOD_ICON[p.method] || '💰'}</span>
                      {p.method}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400 whitespace-nowrap">{p.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_MAP[p.status]?.cls}`}>
                      {STATUS_MAP[p.status]?.label}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {p.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          id={`reject-payment-${p.id}`}
                          onClick={() => setRejectTarget(p.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 cursor-pointer transition-colors"
                        >
                          Từ chối
                        </button>
                        <button
                          type="button"
                          id={`approve-payment-${p.id}`}
                          onClick={() => setApproveTarget(p.id)}
                          className="btn-primary-custom py-1 px-3 text-xs"
                        >
                          Duyệt
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-xs text-slate-400 italic">Không tìm thấy giao dịch nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
          Hiển thị {filtered.length} / {payments.length} giao dịch
        </div>
      </div>

      {/* Confirm approve */}
      <ConfirmModal
        isOpen={approveTarget !== null}
        onClose={() => setApproveTarget(null)}
        onConfirm={() => handleApprove(approveTarget)}
        title="Duyệt giao dịch"
        message="Xác nhận rằng người dùng đã thanh toán đủ tiền nâng cấp gói."
        variant="info"
        confirmText="Xác nhận duyệt"
        cancelText="Hủy"
      />

      {/* Confirm reject */}
      <ConfirmModal
        isOpen={rejectTarget !== null}
        onClose={() => setRejectTarget(null)}
        onConfirm={() => handleReject(rejectTarget)}
        title="Từ chối giao dịch"
        message="Đánh dấu giao dịch này là thất bại. Người dùng sẽ không được nâng cấp."
        variant="danger"
        confirmText="Xác nhận từ chối"
        cancelText="Hủy"
      />
    </div>
  )
}
