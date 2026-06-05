import { useState } from 'react'

const MOCK_LOGS = [
  { id: 'LOG-4001', user: 'nguyenvana@example.com', role: 'user', action: 'Đăng nhập thành công', resource: 'Hệ thống Auth', ip: '192.168.1.10', date: '2026-06-05 14:50:11', severity: 'info' },
  { id: 'LOG-4002', user: 'admin@example.com', role: 'admin', action: 'Cập nhật gói Premium', resource: 'Admin Plans', ip: '113.23.4.156', date: '2026-06-05 14:48:02', severity: 'warning' },
  { id: 'LOG-4003', user: 'tranthib@example.com', role: 'user', action: 'Tạo Workspace mới', resource: 'Workspace "Dự án FE"', ip: '27.72.93.111', date: '2026-06-05 14:45:23', severity: 'info' },
  { id: 'LOG-4004', user: 'levanc@example.com', role: 'user', action: 'Thay đổi mật khẩu', resource: 'Cá nhân Settings', ip: '171.244.15.22', date: '2026-06-05 14:42:00', severity: 'info' },
  { id: 'LOG-4005', user: 'admin@example.com', role: 'admin', action: 'Khóa tài khoản người dùng', resource: 'User ID: phamthid', ip: '113.23.4.156', date: '2026-06-05 14:38:11', severity: 'danger' },
  { id: 'LOG-4006', user: 'dangvane@example.com', role: 'user', action: 'Thanh toán nâng cấp Premium', resource: 'TXN-1004', ip: '103.7.13.88', date: '2026-06-05 14:30:55', severity: 'success' },
  { id: 'LOG-4007', user: 'vuthif@example.com', role: 'user', action: 'Xuất ghi chú PDF', resource: 'Note ID: note-99', ip: '118.69.14.231', date: '2026-06-05 14:22:07', severity: 'info' },
  { id: 'LOG-4008', user: 'admin@example.com', role: 'admin', action: 'Xóa báo cáo vi phạm', resource: 'Report REP-102', ip: '113.23.4.156', date: '2026-06-05 14:10:33', severity: 'warning' },
]

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

export default function AdminActivityLogs() {
  const [logs] = useState(MOCK_LOGS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      !search ||
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || log.role === roleFilter
    const matchSeverity = severityFilter === 'all' || log.severity === severityFilter
    return matchSearch && matchRole && matchSeverity
  })

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nhật ký hoạt động</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Giám sát các thao tác người dùng và hoạt động hệ thống theo thời gian thực.
        </p>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(SEVERITY_LABEL).map(([key, label]) => {
          const count = logs.filter((l) => l.severity === key).length
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
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tài khoản, hành động, mã log..."
            className="form-input pl-9 text-xs"
          />
        </div>
        <div className="flex gap-2">
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
              {r === 'all' ? 'Tất cả' : r === 'admin' ? '🔐 Admin' : '👤 User'}
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
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Mã log</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Người dùng</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Hành động</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Tài nguyên</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Địa chỉ IP</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Mức độ</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">{log.id}</td>
                  <td className="p-4">
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{log.user}</div>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase mt-1
                      ${log.role === 'admin'
                        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-900 dark:text-white max-w-[200px]">{log.action}</td>
                  <td className="p-4 text-xs text-slate-500 dark:text-slate-400 font-mono max-w-[180px] truncate">{log.resource}</td>
                  <td className="p-4 text-xs text-slate-500 dark:text-slate-400 font-mono">{log.ip}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${SEVERITY_STYLE[log.severity]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_DOT[log.severity]}`} />
                      {SEVERITY_LABEL[log.severity]}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400 whitespace-nowrap">{log.date}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-xs text-slate-400 italic">
                    Không có nhật ký phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
          Hiển thị {filteredLogs.length} / {logs.length} bản ghi
        </div>
      </div>
    </div>
  )
}
