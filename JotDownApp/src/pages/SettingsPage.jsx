import { useEffect, useState } from 'react'
import { useToast } from '../components/common/Toast'
import { useAuth } from '../features/auth'
import { apiFetch } from '../services/api'

const NOTE_COLORS = [
  { hex: '#ffffff', label: 'Trắng', cls: 'bg-white border-slate-300' },
  { hex: '#FEF3C7', label: 'Vàng', cls: 'bg-amber-100' },
  { hex: '#D1FAE5', label: 'Xanh lá', cls: 'bg-emerald-100' },
  { hex: '#DBEAFE', label: 'Xanh dương', cls: 'bg-blue-100' },
  { hex: '#FCE7F3', label: 'Hồng', cls: 'bg-pink-100' },
  { hex: '#FFEDD5', label: 'Cam', cls: 'bg-orange-100' },
  { hex: '#EDE9FE', label: 'Tím nhạt', cls: 'bg-violet-100' },
]

const FONT_SIZE_MAP = { small: '14px', medium: '16px', large: '18px' }

function SettingSection({ title, description, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-card">
      <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
        {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function SettingsContent({ user, updateUser }) {
  const { show } = useToast()
  const userId = user?.id
  const [theme, setTheme] = useState(user?.theme || 'light')
  const [fontSize, setFontSize] = useState(user?.font_size || 'medium')
  const [noteColor, setNoteColor] = useState(user?.default_note_color || '#ffffff')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [savingAppearance, setSavingAppearance] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', theme === 'dark' || (theme === 'system' && prefersDark))
  }, [theme])

  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SIZE_MAP[fontSize] || FONT_SIZE_MAP.medium
  }, [fontSize])

  const handleSaveAppearance = async () => {
    if (!userId) return

    setSavingAppearance(true)
    try {
      const payload = await apiFetch(`/api/users/${userId}/settings/appearance`, {
        method: 'PATCH',
        body: JSON.stringify({
          theme,
          font_size: fontSize,
          default_note_color: noteColor,
        }),
      })
      const nextSettings = payload.settings || { theme, font_size: fontSize, default_note_color: noteColor }
      updateUser(nextSettings)
      show({ type: 'success', title: 'Đã lưu', message: payload.message || 'Tùy chỉnh giao diện đã được áp dụng.' })
    } catch (err) {
      show({ type: 'error', title: 'Lỗi', message: err.message || 'Không thể lưu cài đặt giao diện.' })
    } finally {
      setSavingAppearance(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    if (!userId) return
    if (!currentPassword) return show({ type: 'error', title: 'Lỗi', message: 'Vui lòng nhập mật khẩu hiện tại.' })
    if (newPassword.length < 8) return show({ type: 'error', title: 'Lỗi', message: 'Mật khẩu mới phải có ít nhất 8 ký tự.' })
    if (newPassword !== confirmNewPassword) return show({ type: 'error', title: 'Lỗi', message: 'Mật khẩu mới không khớp.' })

    setSavingPassword(true)
    try {
      const payload = await apiFetch(`/api/users/${userId}/password`, {
        method: 'PATCH',
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
        }),
      })
      show({ type: 'success', title: 'Cập nhật thành công', message: payload.message || 'Mật khẩu đã được thay đổi.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err) {
      show({ type: 'error', title: 'Lỗi', message: err.message || 'Không thể đổi mật khẩu.' })
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cài đặt</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tùy chỉnh giao diện và bảo mật tài khoản của bạn.</p>
      </div>

      <SettingSection title="Giao diện" description="Tùy chỉnh cách JotDown hiển thị với bạn.">
        <div className="space-y-6">
          <div>
            <label className="form-label">Chủ đề màu sắc</label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { value: 'light', label: 'Sáng' },
                { value: 'dark', label: 'Tối' },
                { value: 'system', label: 'Hệ thống' },
              ].map((t) => (
                <button
                  key={t.value}
                  type="button"
                  id={`theme-${t.value}-option`}
                  onClick={() => setTheme(t.value)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-sm font-medium
                    ${theme === t.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Cỡ chữ ghi chú</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { value: 'small', label: 'Nhỏ', preview: 'Aa' },
                { value: 'medium', label: 'Vừa', preview: 'Aa' },
                { value: 'large', label: 'Lớn', preview: 'Aa' },
              ].map((f) => (
                <button
                  key={f.value}
                  type="button"
                  id={`font-${f.value}-btn`}
                  onClick={() => setFontSize(f.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all
                    ${fontSize === f.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                >
                  <span className={`font-bold leading-none ${f.value === 'small' ? 'text-base' : f.value === 'medium' ? 'text-xl' : 'text-2xl'}`}>{f.preview}</span>
                  <span className="text-xs font-medium">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Màu ghi chú mặc định</label>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  id={`note-color-${c.hex.replace('#', '')}-btn`}
                  title={c.label}
                  onClick={() => setNoteColor(c.hex)}
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${c.cls}
                    ${noteColor === c.hex ? 'border-primary-500 ring-2 ring-primary-500/30 ring-offset-2 dark:ring-offset-slate-900' : 'border-transparent'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" id="save-appearance-btn" onClick={handleSaveAppearance} disabled={savingAppearance} className="btn-primary-custom disabled:opacity-60">
              {savingAppearance ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </div>
        </div>
      </SettingSection>

      <SettingSection title="Bảo mật" description="Thay đổi mật khẩu để bảo vệ tài khoản của bạn.">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="current-password-input" className="form-label">Mật khẩu hiện tại</label>
            <input
              id="current-password-input"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label htmlFor="new-password-input" className="form-label">Mật khẩu mới</label>
            <input
              id="new-password-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
              minLength={8}
            />
            <p className="text-xs text-slate-400 mt-1">Tối thiểu 8 ký tự.</p>
          </div>
          <div>
            <label htmlFor="confirm-password-input" className="form-label">Xác nhận mật khẩu mới</label>
            <input
              id="confirm-password-input"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              id="change-password-btn"
              disabled={savingPassword}
              className="btn-primary-custom disabled:opacity-60"
            >
              {savingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </button>
          </div>
        </form>
      </SettingSection>
    </div>
  )
}

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const settingsKey = `${user?.id || 'guest'}-${user?.theme || 'light'}-${user?.font_size || 'medium'}-${user?.default_note_color || '#ffffff'}`

  return <SettingsContent key={settingsKey} user={user} updateUser={updateUser} />
}
