import React from 'react';

export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon: Icon,
  rightElement,
  disabled = false,
  required = false,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-[#5A5A40] mb-1.5">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8e7a]">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`block w-full rounded-xl text-sm transition-colors border ${
            error
              ? 'border-rose-400 text-rose-950 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-rose-50/30'
              : 'border-[#e0e0d6] text-[#2d2d2d] placeholder-[#9e9e8f] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:border-[#5A5A40] bg-[#fdfcfb]'
          } ${Icon ? 'pl-10' : 'pl-4'} ${rightElement ? 'pr-11' : 'pr-4'} py-2.5 disabled:bg-[#f0f0ea] disabled:text-[#8e8e7a] disabled:cursor-not-allowed ${inputClassName}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-[#8e8e7a]">{helperText}</p>
      ) : null}
    </div>
  );
}
