import { useState, useEffect } from 'react'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useToast } from '../../components/common/Toast'
import { adminApi } from './adminApi'

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
          <button type="button" id="save-plan-btn" onClick={() => { onSave(form) }} className="btn-primary-custom flex-1 justify-center">
            {plan ? 'Lưu thay đổi' : 'Thêm gói'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPlans() {
  const { show } = useToast()
  const [plans, setPlans] = useState([])
  const [stats, setStats] = useState(null)
  const [editPlan, setEditPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const res = await adminApi.getPlans()
      setPlans(res || [])
    } catch (err) {
      console.error(err)
      show({ type: 'error', message: 'Không thể tải danh sách gói' })
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
    fetchPlans()
    fetchStats()
  }, [])

  const handleSave = async (form) => {
    try {
      if (form.Id || form.id) {
        await adminApi.updatePlan(form.Id || form.id, form)
        show({ type: 'success', title: 'Đã cập nhật gói dịch vụ' })
      } else {
        await adminApi.createPlan(form)
        show({ type: 'success', title: 'Đã thêm gói mới' })
      }
      setEditPlan(null)
      fetchPlans()
    } catch (err) {
      show({ type: 'error', message: err.message || 'Lỗi khi lưu gói' })
    }
  }

  const handleToggleStatus = async (plan) => {
    try {
      await adminApi.togglePlanStatus(plan.Id || plan.id)
      show({ type: 'info', message: `Gói "${plan.name}" đã được cập nhật trạng thái` })
      fetchPlans()
    } catch (err) {
      show({ type: 'error', message: err.message || 'Lỗi cập nhật trạng thái' })
    }
  }

  const totalRevenue = stats?.revenue || 0
  const totalSubscribers = stats?.premium_users || 0

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-card">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng người dùng Premium</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{totalSubscribers.toLocaleString('vi-VN')}</p>
          <p className="text-xs text-slate-400 mt-1">Sử dụng gói trả phí</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-card">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng doanh thu</p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Từ gói trả phí</p>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : plans.map((plan, index) => {
          const colorClass = index % 2 === 0 ? 'from-slate-400 to-slate-500' : 'from-blue-500 to-indigo-600';
          return (
            <div
              key={plan.Id || plan.id}
              className={`rounded-2xl border-2 bg-white dark:bg-slate-800 shadow-card transition-all overflow-hidden
                ${plan.status ? 'border-slate-200 dark:border-slate-700' : 'border-dashed border-slate-300 dark:border-slate-600 opacity-60'}`}
            >
              {/* Gradient header */}
              <div className={`bg-gradient-to-r ${colorClass} p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-sm text-white/80 font-medium">
                      {plan.price == 0 ? 'Miễn phí' : `${Number(plan.price).toLocaleString('vi-VN')}đ/tháng`}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${plan.status ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'}`}>
                  {plan.status ? 'Hoạt động' : 'Tạm dừng'}
                </span>
              </div>

              <div className="p-5">
                {/* Features */}
                <div className="space-y-2 mb-5 text-sm text-slate-600 dark:text-slate-400">
                  {[
                    { label: 'Ghi chú tối đa', value: plan.max_notes ?? '∞ Không giới hạn' },
                    { label: 'Workspace tối đa', value: plan.max_workspaces ?? '∞ Không giới hạn' },
                    { label: 'Đính kèm', value: plan.max_attachment_size ? `${plan.max_attachment_size}MB` : 'Không hỗ trợ' },
                    { label: 'Xuất file', value: plan.can_export ? '✓ Có' : '✗ Không', ok: !!plan.can_export },
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
                    id={`edit-plan-${plan.Id || plan.id}`}
                    onClick={() => setEditPlan(plan)}
                    className="btn-secondary-custom flex-1 justify-center text-xs py-2"
                  >
                    ✏️ Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    id={`toggle-plan-${plan.Id || plan.id}`}
                    onClick={() => handleToggleStatus(plan)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-colors
                      ${plan.status
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200'
                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200'}`}
                  >
                    {plan.status ? '⏸ Tạm dừng' : '▶ Kích hoạt'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {editPlan !== null && (
        <PlanFormModal plan={editPlan || null} onClose={() => setEditPlan(null)} onSave={handleSave} />
      )}
    </div>
  )
}

