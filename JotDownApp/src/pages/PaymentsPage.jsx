import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../components/common/Toast'
import { apiFetch } from '../services/api'

const PAYMENTS_PER_PAGE = 8

const STATUS_META = {
  all: { label: 'Tất cả', cls: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  pending: { label: 'Đang chờ', cls: 'badge-pending' },
  confirmed: { label: 'Thành công', cls: 'badge-success' },
  failed: { label: 'Thất bại', cls: 'badge-failed' },
}

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount) || 0)

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'Chưa thanh toán'

export default function PaymentsPage() {
  const { show } = useToast()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchPayments = async (nextPage = 1) => {
    try {
      setLoading(true)
      const payload = await apiFetch(`/api/payments/my?per_page=${PAYMENTS_PER_PAGE}&page=${nextPage}`)
      setPayments(payload.data || [])
      setPage(payload.current_page || nextPage)
      setTotalPages(payload.last_page || 1)
    } catch (err) {
      setPayments([])
      show({ type: 'error', title: 'Không thể tải thanh toán', message: err.message || 'Vui lòng thử lại sau.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments(1)
  }, [])

  const filteredPayments = useMemo(() => {
    if (statusFilter === 'all') return payments
    return payments.filter((payment) => payment.status === statusFilter)
  }, [payments, statusFilter])

  const summary = useMemo(() => {
    const confirmed = payments.filter((payment) => payment.status === 'confirmed')
    return {
      total: payments.length,
      confirmed: confirmed.length,
      pending: payments.filter((payment) => payment.status === 'pending').length,
      spent: confirmed.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0),
    }
  }, [payments])

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return
    fetchPayments(nextPage)
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Thanh toán</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi lịch sử mua gói, trạng thái giao dịch và số tiền đã thanh toán.
          </p>
        </div>
        <Link to="/plans" className="btn-primary-custom justify-center">
          Mua gói
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tổng giao dịch</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{summary.total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">Thành công</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{summary.confirmed}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">Đang chờ</p>
          <p className="mt-2 text-3xl font-extrabold text-amber-600 dark:text-amber-400">{summary.pending}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-500">Đã thanh toán</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">{formatCurrency(summary.spent)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(STATUS_META).map(([status, meta]) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === status ? 'bg-primary-500 text-white' : meta.cls
            }`}
          >
            {meta.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
              <tr>
                <th className="p-4 text-xs font-bold uppercase text-slate-400">Mã giao dịch</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400">Gói</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400">Số tiền</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400">Phương thức</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400">Thời gian</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-400">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary-500" />
                  </td>
                </tr>
              ) : filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => {
                  const status = STATUS_META[payment.status] || STATUS_META.failed
                  return (
                    <tr key={payment.Id || payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {payment.transaction_code || payment.Id || payment.id}
                      </td>
                      <td className="p-4 text-sm font-semibold text-slate-900 dark:text-white">
                        {payment.plan?.name || 'Gói dịch vụ'}
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(payment.amount)}</td>
                      <td className="p-4 text-xs uppercase text-slate-500 dark:text-slate-400">{payment.payment_method || '-'}</td>
                      <td className="p-4 text-xs text-slate-500 dark:text-slate-400">{formatDateTime(payment.paid_at || payment.CreatedTime || payment.created_at)}</td>
                      <td className="p-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.cls}`}>{status.label}</span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    Chưa có giao dịch phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm dark:border-slate-700">
            <span className="text-slate-500">Trang {page} / {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="rounded-lg border border-slate-200 px-3 py-1 disabled:opacity-50 dark:border-slate-600"
              >
                Trước
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="rounded-lg border border-slate-200 px-3 py-1 disabled:opacity-50 dark:border-slate-600"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
