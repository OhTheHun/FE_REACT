import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/common/Toast'
import { useAuth } from '../features/auth'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'mãi mãi',
    description: 'Dành cho cá nhân muốn bắt đầu.',
    color: 'border-slate-200 dark:border-slate-700',
    badge: null,
    features: [
      { text: '50 ghi chú', ok: true },
      { text: '1 workspace', ok: true },
      { text: 'Gắn nhãn cơ bản', ok: true },
      { text: 'Chia sẻ ghi chú (giới hạn)', ok: true },
      { text: 'Tệp đính kèm', ok: false },
      { text: 'Xuất PDF/Markdown', ok: false },
      { text: 'Không giới hạn workspace', ok: false },
      { text: 'Ưu tiên hỗ trợ', ok: false },
    ],
    cta: 'Đang sử dụng',
    ctaDisabled: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79000,
    period: '/tháng',
    description: 'Đầy đủ tính năng cho người dùng nghiêm túc.',
    color: 'border-primary-400 dark:border-primary-500',
    badge: 'Phổ biến nhất',
    features: [
      { text: 'Không giới hạn ghi chú', ok: true },
      { text: 'Không giới hạn workspace', ok: true },
      { text: 'Gắn nhãn nâng cao', ok: true },
      { text: 'Chia sẻ ghi chú đầy đủ', ok: true },
      { text: 'Tệp đính kèm (500MB)', ok: true },
      { text: 'Xuất PDF/Markdown', ok: true },
      { text: 'Bảo vệ ghi chú bằng mật khẩu', ok: true },
      { text: 'Ưu tiên hỗ trợ', ok: true },
    ],
    cta: 'Nâng cấp ngay',
    ctaDisabled: false,
  },
]

function PlanCard({ plan, currentPlanId, onUpgrade }) {
  const isActive = plan.id === (currentPlanId || 'free')
  const isPremium = plan.id === 'premium'

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
        onClick={() => !plan.ctaDisabled && onUpgrade(plan)}
        disabled={plan.ctaDisabled || isActive}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
          ${isPremium && !isActive
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

export default function PlansPage() {
  const navigate = useNavigate()
  const { show } = useToast()
  const { user, isAuthenticated, updateUser } = useAuth()
  const [payingPlan, setPayingPlan] = useState(null)
  const currentPlanId = user?.plan_id

  const handleUpgrade = (plan) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/plans' } } })
      return
    }

    setPayingPlan(plan)
  }

  const handleConfirmPayment = (method) => {
    if (payingPlan) {
      updateUser({ plan_id: payingPlan.id })
    }
    setPayingPlan(null)
    show({
      type: 'success',
      title: 'Thanh toán thành công!',
      message: `Tài khoản của bạn đã được nâng cấp lên ${payingPlan?.name} qua ${method.toUpperCase()}.`,
      duration: 6000,
    })
    setTimeout(() => navigate('/profile'), 1500)
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
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlanId={currentPlanId}
            onUpgrade={handleUpgrade}
          />
        ))}
      </div>

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
        <PaymentModal
          plan={payingPlan}
          onClose={() => setPayingPlan(null)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  )
}
