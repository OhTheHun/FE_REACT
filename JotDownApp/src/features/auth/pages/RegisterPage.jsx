import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import AuthLayout from '../components/AuthLayout'
import AuthHeader from '../components/AuthHeader'
import AuthInput from '../components/AuthInput'
import AuthButton from '../components/AuthButton'

function RegisterPage() {
  const navigate = useNavigate()
  const { register, authError, getRoleHomePath } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (password.length < 8) {
      setError('Mật khẩu tối thiểu 8 ký tự.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const result = await register({
        display_name: displayName,
        email,
        password,
      })
      navigate(getRoleHomePath(result.user), { replace: true })
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <AuthHeader title="Tạo tài khoản" subtitle="Bắt đầu không gian ghi chú của riêng bạn." />

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          id="register-name"
          label="Tên hiển thị"
          type="text"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Ví dụ: Nguyễn Văn A"
        />

        <AuthInput
          id="register-email"
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
        />

        <AuthInput
          id="register-password"
          label="Mật khẩu"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {(error || authError) && <p className="text-sm text-red-400 text-center">{error || authError}</p>}

        <AuthButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
        </AuthButton>
      </form>

      <p className="auth-muted-text mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        Đã có tài khoản?{' '}
        <Link to="/login" className="auth-accent-link font-semibold text-primary hover:underline">
          Đăng nhập
        </Link>
      </p>
    </AuthLayout>
  )
}

export default RegisterPage
