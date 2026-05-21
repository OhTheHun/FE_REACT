function AuthHeader({ title, subtitle }) {
  return (
    <div className="auth-header text-center mb-8">
      <h1 className="auth-title text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
      {subtitle && (
        <p className="auth-subtitle mt-2 text-slate-600 dark:text-slate-400">{subtitle}</p>
      )}
    </div>
  )
}

export default AuthHeader
