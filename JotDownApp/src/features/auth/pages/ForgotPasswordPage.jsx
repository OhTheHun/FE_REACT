import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import AuthHeader from '../components/AuthHeader'
import AuthInput from '../components/AuthInput'
import AuthButton from '../components/AuthButton'

function SuccessCard({ email, onRetry, onContinue }) {
  return (
    <AuthLayout>
      <div className="text-center">
        <div className="mb-6 mx-auto w-16 h-16 bg-emerald-400/15 text-emerald-300 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Kiểm tra email của bạn</h2>
        <p className="auth-muted-text mt-4 text-slate-600 dark:text-slate-400">
          Chúng tôi đã gửi liên kết và mã OTP đến <strong>{email}</strong> để đặt lại mật khẩu.
        </p>
        <div className="mt-8 space-y-4">
          <AuthButton type="button" onClick={onContinue}>Nhập mã OTP</AuthButton>
          <AuthButton type="button" variant="ghost" onClick={onRetry}>Thử lại email khác</AuthButton>
        </div>
      </div>
    </AuthLayout>
  )
}

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Đã gửi email khôi phục mật khẩu đến', email)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <SuccessCard
        email={email}
        onContinue={() => navigate('/reset-password')}
        onRetry={() => setIsSubmitted(false)}
      />
    )
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="Quên mật khẩu?"
        subtitle="Nhập email để nhận hướng dẫn đặt lại mật khẩu."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          id="forgot-email"
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
        />

        <AuthButton type="submit">Gửi liên kết khôi phục</AuthButton>
      </form>

      <p className="auth-muted-text mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        Nhớ mật khẩu của bạn?{' '}
        <Link to="/login" className="auth-accent-link font-semibold text-primary hover:underline">
          Quay lại Đăng nhập
        </Link>
      </p>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
