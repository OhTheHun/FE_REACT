import { Link } from 'react-router-dom'
import './AuthLayout.css'

function AuthLayout({ children, formPosition = 'right' }) {
  const pageClassName = formPosition === 'left' ? 'auth-page auth-page--form-left' : 'auth-page'

  return (
    <div className={pageClassName}>
      <section className="auth-brand-panel">
        <Link to="/landing" className="auth-brand-link" aria-label="Về trang chính JotDown">
          <span className="auth-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" role="img">
              <path d="M34.2 4.6 43.4 13.8 18.9 38.3 7.1 41.1 9.9 29.3 34.2 4.6Z" fill="currentColor" />
              <path d="M31.3 7.6 40.4 16.7" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              <path d="M10.4 36.7 6.2 42.8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
          <span>JotDown</span>
        </Link>

        <div className="auth-brand-copy">
          <h1>
            Ghi lại hôm nay
            <span>mở lối ngày mai</span>
          </h1>
          <p>Không gian ghi chú gọn gàng để ý tưởng luôn có nơi trở về.</p>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">{children}</div>
      </section>
    </div>
  )
}

export default AuthLayout
