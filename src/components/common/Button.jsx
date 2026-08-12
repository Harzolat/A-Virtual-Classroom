import React from 'react';

export default function Button({
  id,
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[34px] rounded-lg',
    md: 'text-sm px-4.5 py-2.5 gap-2 min-h-[42px] rounded-xl',
    lg: 'text-base px-6 py-3 gap-2.5 min-h-[48px] rounded-2xl'
  };

  const variantClasses = {
    primary: 'bg-[#5A5A40] hover:bg-[#484832] text-white focus:ring-[#5A5A40] shadow-xs',
    secondary: 'bg-[#A67C52] hover:bg-[#8f6942] text-white focus:ring-[#A67C52] shadow-xs',
    outline: 'border border-[#d8d8cb] bg-[#fdfcfb] hover:bg-[#f2f2e9] text-[#4a4a35] focus:ring-[#5A5A40]',
    ghost: 'bg-transparent hover:bg-[#efefe5] text-[#5A5A40] focus:ring-[#5A5A40]',
    danger: 'bg-rose-700 hover:bg-rose-800 text-white focus:ring-rose-600 shadow-xs',
    dangerOutline: 'border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-800 focus:ring-rose-500',
    clay: 'bg-[#A67C52] hover:bg-[#8f6942] text-white focus:ring-[#A67C52]',
    light: 'bg-[#eaeae0] hover:bg-[#e0e0d4] text-[#42422e] focus:ring-[#5A5A40]'
  };

  return (
    <button
      id={id}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>{children}</span>
        </span>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </button>
  );
}
