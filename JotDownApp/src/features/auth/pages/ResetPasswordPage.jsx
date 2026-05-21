import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import AuthHeader from '../components/AuthHeader'
import AuthInput from '../components/AuthInput'
import AuthButton from '../components/AuthButton'

function SuccessCard({ onGoLogin }) {
  return (
    <AuthLayout>
      <div className="text-center">
        <div className="mb-6 mx-auto w-16 h-16 bg-emerald-400/15 text-emerald-300 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Đặt lại mật khẩu thành công</h2>
        <p className="auth-muted-text mt-4 text-slate-600 dark:text-slate-400">
          Mật khẩu của bạn đã được cập nhật. Bạn có thể sử dụng mật khẩu mới để đăng nhập ngay bây giờ.
        </p>
        <div className="mt-8">
          <AuthButton type="button" onClick={onGoLogin}>Quay lại Đăng nhập</AuthButton>
        </div>
      </div>
    </AuthLayout>
  )
}

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }
    console.log('Đặt lại mật khẩu thành công với OTP:', otp)
    setSuccess(true)
  }

  if (success) {
    return <SuccessCard onGoLogin={() => navigate('/login')} />
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="Tạo mật khẩu mới"
        subtitle="Nhập mã OTP đã nhận và mật khẩu mới của bạn."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="reset-otp"
          label="Mã OTP"
          type="text"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="123456"
          maxLength={6}
          style={{ textAlign: 'center', letterSpacing: '0.2em', fontFamily: 'monospace', fontSize: '1.125rem' }}
        />

        <AuthInput
          id="reset-password"
          label="Mật khẩu mới"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <AuthInput
          id="reset-confirm-password"
          label="Xác nhận mật khẩu mới"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <AuthButton type="submit">Cập nhật mật khẩu</AuthButton>
      </form>
    </AuthLayout>
  )
}

export default ResetPasswordPage
