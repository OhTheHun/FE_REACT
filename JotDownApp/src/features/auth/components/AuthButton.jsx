function AuthButton({ children, variant = 'primary', ...props }) {
  const variantClass =
    variant === 'ghost'
      ? 'auth-secondary-btn btn btn-ghost w-full text-base text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
      : 'auth-primary-btn btn btn-primary w-full text-base'

  return (
    <button className={variantClass} {...props}>
      {children}
    </button>
  )
}

export default AuthButton
