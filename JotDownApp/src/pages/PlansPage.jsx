import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/common/Toast'
import { useAuth } from '../features/auth'
import { apiFetch } from '../services/api'

const PLANS_PER_PAGE = 4
const PAYMENT_METHODS = [
  {
    value: 'vnpay',
    label: 'VNPay',
    description: 'Thanh toán nội địa qua cổng VNPay.',
    action: 'Thanh toán VNPay',
  },
  {
    value: 'paypal',
    label: 'PayPal',
    description: 'Thanh toán quốc tế qua PayPal Sandbox.',
    action: 'Thanh toán PayPal',
  },
]

const getPlanId = (plan) => plan?.id ?? plan?.Id

const toNumber = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

const isUnlimited = (value) => value === null || value === undefined || value === ''

const buildPlanFeatures = (plan) => {
  const maxNotes = plan.max_notes
  const maxWorkspaces = plan.max_workspaces
  const attachmentSize = toNumber(plan.max_attachment_size)
  const canExport = Boolean(plan.can_export)

  return [
    {
      text: isUnlimited(maxNotes) ? 'Không giới hạn ghi chú' : `${Number(maxNotes).toLocaleString('vi-VN')} ghi chú`,
      ok: true,
    },
    {
      text: isUnlimited(maxWorkspaces) ? 'Không giới hạn workspace' : `${Number(maxWorkspaces).toLocaleString('vi-VN')} workspace`,
      ok: true,
    },
    {
      text: attachmentSize > 0 ? `Tệp đính kèm (${attachmentSize.toLocaleString('vi-VN')}MB)` : 'Tệp đính kèm',
      ok: attachmentSize > 0,
    },
    {
      text: 'Xuất PDF/Markdown',
      ok: canExport,
    },
  ]
}

const mapApiPlan = (plan, index) => {
  const price = toNumber(plan.price)
  const isPaid = price > 0

  return {
    ...plan,
    id: getPlanId(plan),
    price,
    period: isPaid ? '/tháng' : 'mãi mãi',
    description: isPaid
      ? 'Đầy đủ tính năng cho người dùng có nhu cầu cao.'
      : 'Dành cho cá nhân muốn bắt đầu.',
    color: isPaid ? 'border-primary-400 dark:border-primary-500' : 'border-slate-200 dark:border-slate-700',
    badge: isPaid && index === 1 ? 'Phổ biến nhất' : null,
    features: buildPlanFeatures(plan),
    cta: 'Nâng cấp ngay',
    ctaDisabled: false,
  }
}

function PaginationControls({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        Trước
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onPageChange(item)}
          className={`w-8 h-8 text-xs font-bold rounded-lg transition-colors
            ${item === page
              ? 'bg-primary-500 text-white'
              : 'border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        Sau
      </button>
    </div>
  )
}

function PlanCard({ plan, currentPlanId, onUpgrade }) {
  const normalizedCurrentPlanId = currentPlanId == null ? null : String(currentPlanId)
  const isActive = normalizedCurrentPlanId ? String(plan.id) === normalizedCurrentPlanId : false
  const isPremium = plan.price > 0

  return (
    <div
      className={`relative flex flex-col rounded-3xl border-2 p-7 transition-all duration-200
        ${isPremium ? 'border-primary-400 dark:border-primary-500 shadow-lg shadow-primary-500/10' : 'border-slate-200 dark:border-slate-700'}
        bg-white dark:bg-slate-900`}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-primary-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
          {isActive && (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium badge-active">Hiện tại</span>
          )}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {plan.price === 0 ? 'Miễn phí' : `${plan.price.toLocaleString('vi-VN')}đ`}
          </span>
          {plan.price > 0 && (
            <span className="text-sm text-slate-500">{plan.period}</span>
          )}
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 flex-1 mb-7">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm">
            {f.ok ? (
              <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={f.ok ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500 line-through'}>{f.text}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        type="button"
        id={`plan-${plan.id}-btn`}
        onClick={() => !isActive && onUpgrade(plan)}
        disabled={plan.ctaDisabled || isActive}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
          ${!isActive
            ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md hover:shadow-primary-500/20'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
          }`}
      >
        {isActive ? '✓ Đang sử dụng' : plan.cta}
      </button>
    </div>
  )
}

function PaymentModal({ plan, onClose, onConfirm }) {
  const [method, setMethod] = useState('vnpay')
  const METHODS = [
    { value: 'vnpay', label: 'VNPay' },
    { value: 'momo', label: 'MoMo' },
    { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng' },
  ]

  if (!plan) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-modal p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Xác nhận thanh toán</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Order summary */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/50 p-4 mb-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Gói dịch vụ</span>
            <span className="font-semibold text-slate-900 dark:text-white">{plan.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Thời hạn</span>
            <span className="font-semibold text-slate-900 dark:text-white">1 tháng</span>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-600 my-2" />
          <div className="flex justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Tổng cộng</span>
            <span className="text-xl font-extrabold text-primary-600 dark:text-primary-400">
              {plan.price.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        {/* Payment method */}
        <div className="mb-5">
          <label className="form-label">Phương thức thanh toán</label>
          <div className="space-y-2 mt-2">
            {METHODS.map((m) => (
              <label
                key={m.value}
                id={`payment-method-${m.value}`}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors
                  ${method === m.value ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'}`}
              >
                <input type="radio" name="payment" value={m.value} checked={method === m.value} onChange={() => setMethod(m.value)} className="sr-only" />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${method === m.value ? 'border-primary-500' : 'border-slate-300'}`}>
                  {method === m.value && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{m.label}</span>
              </label>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 text-center">
          Gói sẽ được kích hoạt sau khi cổng thanh toán xác nhận giao dịch thành công.
        </p>

        <p className="hidden">
          Đây là giao dịch mô phỏng. Không có tiền thật được xử lý.
        </p>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="btn-secondary-custom flex-1 justify-center">Hủy</button>
          <button type="button" id="confirm-payment-btn" onClick={() => onConfirm(method)} className="btn-primary-custom flex-1 justify-center">
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  )
}

function PaymentGatewayModal({ plan, onClose, onConfirm, submitting }) {
  const [method, setMethod] = useState('vnpay')

  if (!plan) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-modal p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Xác nhận thanh toán</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/50 p-4 mb-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Gói dịch vụ</span>
            <span className="font-semibold text-slate-900 dark:text-white">{plan.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Thời hạn</span>
            <span className="font-semibold text-slate-900 dark:text-white">1 tháng</span>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-600 my-2" />
          <div className="flex justify-between">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Tổng cộng</span>
            <span className="text-xl font-extrabold text-primary-600 dark:text-primary-400">
              {plan.price.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        <div className="mb-5">
          <label className="form-label">Phương thức thanh toán</label>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {PAYMENT_METHODS.map((item) => (
              <label
                key={item.value}
                id={`payment-method-${item.value}`}
                className={`flex cursor-pointer flex-col gap-1 rounded-2xl border-2 p-3 transition-colors ${
                  method === item.value
                    ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-600 dark:hover:border-slate-500'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value={item.value}
                  checked={method === item.value}
                  onChange={() => setMethod(item.value)}
                  disabled={submitting}
                  className="sr-only"
                />
                <span className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</span>
                <span className="text-xs leading-5 text-slate-500 dark:text-slate-400">{item.description}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="hidden">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Thanh toán qua VNPay</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Sau khi xác nhận, bạn sẽ được chuyển sang cổng thanh toán VNPay.
          </p>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4 text-center">
          Gói sẽ được kích hoạt sau khi cổng thanh toán xác nhận giao dịch thành công.
        </p>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} disabled={submitting} className="btn-secondary-custom flex-1 justify-center disabled:opacity-60">
            Hủy
          </button>
          <button type="button" id="confirm-payment-btn" onClick={() => onConfirm(method)} disabled={submitting} className="btn-primary-custom flex-1 justify-center">
            {submitting ? 'Đang tạo thanh toán...' : PAYMENT_METHODS.find((item) => item.value === method)?.action}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PlansPage() {
  const navigate = useNavigate()
  const { show } = useToast()
  const { user, isAuthenticated } = useAuth()
  const [plans, setPlans] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [planPage, setPlanPage] = useState(1)
  const [payingPlan, setPayingPlan] = useState(null)
  const [creatingPayment, setCreatingPayment] = useState(false)
  const currentPlanId = user?.plan_id ?? user?.planId ?? user?.PlanId ?? user?.plan?.id ?? user?.plan?.Id
  const totalPlanPages = Math.max(1, Math.ceil(plans.length / PLANS_PER_PAGE))
  const paginatedPlans = plans.slice((planPage - 1) * PLANS_PER_PAGE, planPage * PLANS_PER_PAGE)

  useEffect(() => {
    let isMounted = true

    const fetchPlans = async () => {
      try {
        setLoadingPlans(true)
        const response = await apiFetch('/api/admin/plans')
        const rawPlans = Array.isArray(response) ? response : response.data || []
        const activePlans = rawPlans
          .filter((plan) => plan.status !== false && plan.status !== 0 && plan.status !== '0')
          .sort((a, b) => toNumber(a.price) - toNumber(b.price))
          .map(mapApiPlan)

        if (isMounted) {
          setPlans(activePlans)
          setPlanPage(1)
        }
      } catch (err) {
        console.error(err)
        if (isMounted) {
          show({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách gói dịch vụ.' })
        }
      } finally {
        if (isMounted) {
          setLoadingPlans(false)
        }
      }
    }

    fetchPlans()

    return () => {
      isMounted = false
    }
  }, [show])

  const handleUpgrade = (plan) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/plans' } } })
      return
    }

    setPayingPlan(plan)
  }

  const handleConfirmPayment = async (method = 'vnpay') => {
    if (!payingPlan) return

    if (payingPlan.price <= 0) {
      show({ type: 'info', title: 'Gói miễn phí', message: 'Gói Free không cần thanh toán.' })
      setPayingPlan(null)
      return
    }

    setCreatingPayment(true)
    try {
      const endpoint = method === 'paypal' ? '/api/paypal/create' : '/api/vnpay/create'
      const response = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ plan_id: payingPlan.id }),
      })
      const redirectUrl = method === 'paypal' ? response.approval_url : response.payment_url

      if (!redirectUrl) {
        throw new Error(method === 'paypal' ? 'Backend chưa trả về approval_url.' : 'Backend chưa trả về payment_url.')
      }

      window.location.href = redirectUrl
    } catch (err) {
      show({ type: 'error', title: 'Không thể tạo thanh toán', message: err.message || 'Vui lòng thử lại sau.' })
      setCreatingPayment(false)
    }
  }

  const handlePlanPageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPlanPages || nextPage === planPage) return
    setPlanPage(nextPage)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <span className="inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          Gói dịch vụ
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Chọn gói phù hợp với bạn</h1>
        <p className="mt-3 text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Bắt đầu miễn phí, nâng cấp khi bạn cần thêm sức mạnh.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loadingPlans ? (
          <div className="md:col-span-2 flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : plans.length > 0 ? (
          paginatedPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentPlanId={currentPlanId}
              onUpgrade={handleUpgrade}
            />
          ))
        ) : (
          <div className="md:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Chưa có gói dịch vụ khả dụng.
          </div>
        )}
      </div>

      {!loadingPlans && plans.length > PLANS_PER_PAGE && (
        <PaginationControls
          page={planPage}
          totalPages={totalPlanPages}
          onPageChange={handlePlanPageChange}
        />
      )}

      {/* FAQ */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Câu hỏi thường gặp</h2>
        <div className="space-y-4">
          {[
            { q: 'Tôi có thể hủy gói Premium không?', a: 'Có, bạn có thể hủy bất cứ lúc nào. Tài khoản sẽ về Free vào kỳ gia hạn tiếp theo.' },
            { q: 'Dữ liệu của tôi có được an toàn không?', a: 'Tất cả dữ liệu được mã hóa và lưu trữ an toàn trên máy chủ của chúng tôi.' },
            { q: 'Gói Premium có thể dùng thử không?', a: 'Hiện tại chưa có thử nghiệm, nhưng bạn có thể dùng gói Free không giới hạn thời gian.' },
          ].map((item, i) => (
            <div key={i} className="pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.q}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment modal */}
      {payingPlan && (
        <PaymentGatewayModal
          plan={payingPlan}
          onClose={() => {
            if (!creatingPayment) setPayingPlan(null)
          }}
          onConfirm={handleConfirmPayment}
          submitting={creatingPayment}
        />
      )}
    </div>
  )
}
