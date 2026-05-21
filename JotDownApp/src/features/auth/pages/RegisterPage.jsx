import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import AuthLayout from '../components/AuthLayout'
import AuthHeader from '../components/AuthHeader'
import AuthInput from '../components/AuthInput'
import AuthButton from '../components/AuthButton'

function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }
    console.log('Mô phỏng băm mật khẩu bằng bcrypt...', password)
    login({ email, password })
    navigate('/notes')
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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <AuthInput
          id="register-confirm-password"
          label="Xác nhận mật khẩu"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <AuthButton type="submit">Đăng ký</AuthButton>
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
