import { useState } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useToast } from '../../components/common/Toast'

const MOCK_PLANS = [
  {
    id: '1', name: 'Free', price: 0, max_notes: 50, max_workspaces: 1,
    max_attachment_size: 0, can_export: false, status: true,
    subscribers: 906, revenue: 0,
    color: 'from-slate-400 to-slate-500',
  },
  {
    id: '2', name: 'Premium', price: 79000, max_notes: null, max_workspaces: null,
    max_attachment_size: 512, can_export: true, status: true,
    subscribers: 342, revenue: 79000 * 342,
    color: 'from-blue-500 to-indigo-600',
  },
]

function PlanFormModal({ plan, onClose, onSave }) {
  const [form, setForm] = useState(plan || {
    name: '', price: 0, max_notes: '', max_workspaces: '', max_attachment_size: 0, can_export: false, status: true,
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-3xl shadow-modal p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {plan ? 'Chỉnh sửa gói' : 'Thêm gói mới'}
          </h2>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="form-label">Tên gói</label>
            <input id="plan-name-input" type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className="form-input" placeholder="VD: Premium" />
          </div>
          <div>
            <label className="form-label">Giá (VNĐ/tháng)</label>
            <input id="plan-price-input" type="number" value={form.price} onChange={(e) => set('price', Number(e.target.value))} className="form-input" min={0} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Ghi chú tối đa</label>
              <input id="plan-max-notes-input" type="number" value={form.max_notes || ''} onChange={(e) => set('max_notes', e.target.value ? Number(e.target.value) : null)} className="form-input" placeholder="Không giới hạn" />
            </div>
            <div>
              <label className="form-label">Workspace tối đa</label>
              <input id="plan-max-ws-input" type="number" value={form.max_workspaces || ''} onChange={(e) => set('max_workspaces', e.target.value ? Number(e.target.value) : null)} className="form-input" placeholder="Không giới hạn" />
            </div>
          </div>
          <div>
            <label className="form-label">Dung lượng đính kèm (MB)</label>
            <input id="plan-attachment-input" type="number" value={form.max_attachment_size} onChange={(e) => set('max_attachment_size', Number(e.target.value))} className="form-input" min={0} />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <label htmlFor="plan-export-toggle" className="text-sm font-medium text-slate-700 dark:text-slate-300">Cho phép xuất file</label>
            <input id="plan-export-toggle" type="checkbox" checked={form.can_export} onChange={(e) => set('can_export', e.target.checked)} className="toggle toggle-primary toggle-sm" />
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <label htmlFor="plan-status-toggle" className="text-sm font-medium text-slate-700 dark:text-slate-300">Kích hoạt gói</label>
            <input id="plan-status-toggle" type="checkbox" checked={form.status} onChange={(e) => set('status', e.target.checked)} className="toggle toggle-primary toggle-sm" />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onClose} className="btn-secondary-custom flex-1 justify-center">Hủy</button>
          <button type="button" id="save-plan-btn" onClick={() => { onSave(form); onClose() }} className="btn-primary-custom flex-1 justify-center">
            {plan ? 'Lưu thay đổi' : 'Thêm gói'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPlans() {
  const { show } = useToast()
  const [plans, setPlans] = useState(MOCK_PLANS)
  const [editPlan, setEditPlan] = useState(null)
  const [deletePlan, setDeletePlan] = useState(null)

  const handleSave = (form) => {
    if (form.id) {
      setPlans((prev) => prev.map((p) => (p.id === form.id ? { ...p, ...form } : p)))
      show({ type: 'success', title: 'Đã cập nhật gói dịch vụ' })
    } else {
      setPlans((prev) => [...prev, { ...form, id: Date.now().toString(), subscribers: 0, revenue: 0, color: 'from-slate-400 to-slate-500', icon: '📦' }])
      show({ type: 'success', title: 'Đã thêm gói mới' })
    }
  }

  const handleDelete = () => {
    setPlans((prev) => prev.filter((p) => p.id !== deletePlan.id))
    show({ type: 'info', title: 'Đã xóa gói', message: deletePlan.name })
    setDeletePlan(null)
  }

  const handleToggleStatus = (plan) => {
    setPlans((prev) => prev.map((p) => p.id === plan.id ? { ...p, status: !p.status } : p))
    show({ type: 'info', message: `Gói "${plan.name}" ${plan.status ? 'đã bị tắt' : 'đã được bật'}` })
  }

  const totalRevenue = plans.reduce((sum, p) => sum + (p.revenue || 0), 0)
  const totalSubscribers = plans.reduce((sum, p) => sum + (p.subscribers || 0), 0)

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gói dịch vụ</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quản lý các gói Free và Premium.</p>
        </div>
        <button type="button" id="add-plan-btn" onClick={() => setEditPlan(false)} className="btn-primary-custom">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm gói
        </button>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-card">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng người dùng</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalSubscribers.toLocaleString('vi-VN')}</p>
          <p className="text-xs text-slate-400 mt-1">Trên tất cả các gói</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-card">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Doanh thu hàng tháng</p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {(totalRevenue / 1000000).toFixed(1)}M đ
          </p>
          <p className="text-xs text-slate-400 mt-1">Từ gói trả phí</p>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border-2 bg-white dark:bg-slate-800 shadow-card transition-all overflow-hidden
              ${plan.status ? 'border-slate-200 dark:border-slate-700' : 'border-dashed border-slate-300 dark:border-slate-600 opacity-60'}`}
          >
            {/* Gradient header */}
            <div className={`bg-gradient-to-r ${plan.color} p-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{plan.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-sm text-white/80 font-medium">
                    {plan.price === 0 ? 'Miễn phí' : `${plan.price.toLocaleString('vi-VN')}đ/tháng`}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${plan.status ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'}`}>
                {plan.status ? 'Hoạt động' : 'Tạm dừng'}
              </span>
            </div>

            <div className="p-5">
              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white">{(plan.subscribers || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">Người dùng</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 text-center">
                  <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {plan.revenue ? `${(plan.revenue / 1000000).toFixed(0)}M` : '0'}đ
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">Doanh thu</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-5 text-sm text-slate-600 dark:text-slate-400">
                {[
                  { label: 'Ghi chú tối đa', value: plan.max_notes ?? '∞ Không giới hạn' },
                  { label: 'Workspace tối đa', value: plan.max_workspaces ?? '∞ Không giới hạn' },
                  { label: 'Đính kèm', value: plan.max_attachment_size ? `${plan.max_attachment_size}MB` : 'Không hỗ trợ' },
                  { label: 'Xuất file', value: plan.can_export ? '✓ Có' : '✗ Không', ok: plan.can_export },
                ].map((f) => (
                  <div key={f.label} className="flex justify-between">
                    <span>{f.label}</span>
                    <span className={`font-medium ${f.ok === true ? 'text-emerald-600' : f.ok === false ? 'text-red-400' : 'text-slate-900 dark:text-white'}`}>
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  id={`edit-plan-${plan.id}`}
                  onClick={() => setEditPlan(plan)}
                  className="btn-secondary-custom flex-1 justify-center text-xs py-2"
                >
                  ✏️ Chỉnh sửa
                </button>
                <button
                  type="button"
                  id={`toggle-plan-${plan.id}`}
                  onClick={() => handleToggleStatus(plan)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-colors
                    ${plan.status
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200'
                      : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200'}`}
                >
                  {plan.status ? '⏸ Tạm dừng' : '▶ Kích hoạt'}
                </button>
                {plan.name !== 'Free' && (
                  <button
                    type="button"
                    id={`delete-plan-${plan.id}`}
                    onClick={() => setDeletePlan(plan)}
                    className="px-3 py-2 text-xs rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 cursor-pointer transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editPlan !== null && (
        <PlanFormModal plan={editPlan || null} onClose={() => setEditPlan(null)} onSave={handleSave} />
      )}

      <ConfirmModal
        isOpen={deletePlan !== null}
        onClose={() => setDeletePlan(null)}
        onConfirm={handleDelete}
        title="Xóa gói dịch vụ"
        message={`Bạn có chắc chắn muốn xóa gói "${deletePlan?.name}"? Hành động này không thể hoàn tác.`}
        variant="danger"
        confirmText="Xóa gói"
      />
    </div>
  )
}
