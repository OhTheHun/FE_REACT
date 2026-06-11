import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import AuthHeader from '../components/AuthHeader'
import AuthInput from '../components/AuthInput'
import AuthButton from '../components/AuthButton'
import { verifyPasswordResetOtp } from '../services/authService'

function SuccessCard({ onGoLogin }) {
  return (
    <AuthLayout formPosition="left">
      <div className="text-center">
        <div className="mb-6 mx-auto w-16 h-16 bg-emerald-400/15 text-emerald-300 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Đặt lại mật khẩu thành công</h2>
        <p className="auth-muted-text mt-4 text-slate-600 dark:text-slate-400">
          Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới.
        </p>
        <div className="mt-8">
          <AuthButton type="button" onClick={onGoLogin}>Quay lại đăng nhập</AuthButton>
        </div>
      </div>
    </AuthLayout>
  )
}

function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!/^\d{6}$/.test(otp)) {
      setError('OTP phải đúng 6 chữ số.')
      return
    }

    if (password.length < 8) {
      setError('Mật khẩu tối thiểu 8 ký tự.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await verifyPasswordResetOtp({ email, otp, password })
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Không thể đặt lại mật khẩu.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return <SuccessCard onGoLogin={() => navigate('/login')} />
  }

  return (
    <AuthLayout formPosition="left">
      <AuthHeader
        title="Tạo mật khẩu mới"
        subtitle="Nhập email, mã OTP đã nhận và mật khẩu mới của bạn."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="reset-email"
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
        />

        <AuthInput
          id="reset-otp"
          label="Mã OTP"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="123456"
          maxLength={6}
          style={{ textAlign: 'left', letterSpacing: '0.2em', fontFamily: 'monospace', fontSize: '1.125rem' }}
        />

        <AuthInput
          id="reset-password"
          label="Mật khẩu mới"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <AuthButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
        </AuthButton>
      </form>
    </AuthLayout>
  )
}

export default ResetPasswordPage
