import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import AuthLayout from '../components/AuthLayout'
import AuthHeader from '../components/AuthHeader'
import AuthInput from '../components/AuthInput'
import AuthButton from '../components/AuthButton'

function LoginPage() {
  const { login, authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    login({ email, password })
  }

  return (
    <AuthLayout>
      <AuthHeader title="Chào mừng bạn" subtitle="Vui lòng nhập thông tin" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          id="login-email"
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
        />

        <AuthInput
          id="login-password"
          label="Mật khẩu"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <div className="-mt-3 text-right">
          <Link to="/forgot-password" className="auth-accent-link text-sm">
            Quên mật khẩu?
          </Link>
        </div>

        {authError && <p className="text-sm text-red-400 text-center">{authError}</p>}

        <AuthButton type="submit">Đăng nhập</AuthButton>
      </form>

      <p className="auth-muted-text mt-10 text-center text-sm text-slate-600 dark:text-slate-400">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="auth-accent-link font-semibold text-primary hover:underline">
          Tạo ngay
        </Link>
      </p>
    </AuthLayout>
  )
}

export default LoginPage
