function AuthInput({ label, id, headerSlot, ...inputProps }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {headerSlot}
      </div>
      <input
        id={id}
        {...inputProps}
        className="auth-input input input-bordered w-full bg-slate-50 dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  )
}

export default AuthInput
