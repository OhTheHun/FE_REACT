import { useState, useEffect } from 'react'
import { adminApi } from './adminApi'
import { useToast } from '../../components/common/Toast'

const SEVERITY_STYLE = {
  info:    'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  danger:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}
const SEVERITY_LABEL = { info: 'Thông tin', success: 'Thành công', warning: 'Cảnh báo', danger: 'Nguy hiểm' }

const SEVERITY_DOT = {
  info:    'bg-sky-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
}

const getSeverity = (action) => {
  const act = action.toLowerCase()
  if (act.includes('lock') || act.includes('delete') || act.includes('ban') || act.includes('reject')) return 'danger'
  if (act.includes('hide') || act.includes('report') || act.includes('toggle')) return 'warning'
  if (act.includes('payment') || act.includes('confirm') || act.includes('success') || act.includes('create') || act.includes('store') || act.includes('update')) return 'success'
  return 'info'
}

export default function AdminActivityLogs() {
  const { show } = useToast()
  const [logs, setLogs] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchLogs = async (p = 1, query = search) => {
    try {
      setLoading(true)
      const res = await adminApi.getActivityLogs({ page: p, per_page: 50, q: query })
      
      const mappedLogs = (res.data || []).map(log => {
        const isAdminAction = log.action?.startsWith('admin_') || log.user?.role === 'admin'
        return {
          ...log,
          computed_role: isAdminAction ? 'admin' : 'user',
          computed_severity: getSeverity(log.action),
        }
      })

      setLogs(mappedLogs)
      setPage(res.current_page || 1)
      setTotalPages(res.last_page || 1)
    } catch (err) {
      console.error(err)
      show({ type: 'error', message: 'Không thể tải nhật ký hoạt động' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchLogs(1, search)
    }, 500)
    return () => clearTimeout(delaySearch)
  }, [search])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchLogs(newPage, search)
    }
  }

  const filteredLogs = logs.filter((log) => {
    const matchRole = roleFilter === 'all' || log.computed_role === roleFilter
    const matchSeverity = severityFilter === 'all' || log.computed_severity === severityFilter
    return matchRole && matchSeverity
  })

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nhật ký hoạt động</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Giám sát các thao tác người dùng và hoạt động hệ thống theo thời gian thực.
        </p>
      </div>

      {/* Summary badges (based on current page) */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(SEVERITY_LABEL).map(([key, label]) => {
          const count = logs.filter((l) => l.computed_severity === key).length
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSeverityFilter(severityFilter === key ? 'all' : key)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all cursor-pointer
                ${severityFilter === key ? 'border-current scale-105 shadow' : 'border-transparent'}
                ${SEVERITY_STYLE[key]}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_DOT[key]}`} />
              {label} ({count})
            </button>
          )
        })}
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
            placeholder="Tìm theo hành động, mô tả..."
            className="form-input pl-9 text-xs"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
          {['all', 'user', 'admin'].map((r) => (
            <button
              key={r}
              type="button"
              id={`log-role-${r}`}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full cursor-pointer transition-colors
                ${roleFilter === r
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200'}`}
            >
              {r === 'all' ? 'Tất cả' : r === 'admin' ? ' Admin' : ' User'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Mã log</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Người dùng</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Hành động</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Mô tả / Tài nguyên</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Địa chỉ IP</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Mức độ</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.Id || log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">{log.Id || log.id}</td>
                  <td className="p-4">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{log.user?.email || 'System'}</div>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mt-1
                      ${log.computed_role === 'admin'
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                      {log.computed_role}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-900 dark:text-white max-w-[200px]">{log.action}</td>
                  <td className="p-4 text-xs text-slate-500 dark:text-slate-400 max-w-[250px] truncate" title={log.description}>{log.description}</td>
                  <td className="p-4 text-xs text-slate-500 dark:text-slate-400 font-mono">{log.ip_address}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${SEVERITY_STYLE[log.computed_severity]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_DOT[log.computed_severity]}`} />
                      {SEVERITY_LABEL[log.computed_severity]}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400 whitespace-nowrap">{new Date(log.created_at).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
              {!loading && filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-xs text-slate-400 italic">
                    Không có nhật ký phù hợp.
                  </td>
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
    </div>
  )
}

