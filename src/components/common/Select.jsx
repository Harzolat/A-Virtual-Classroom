import React from 'react';

export default function Select({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  selectClassName = '',
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
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`block w-full rounded-xl text-sm transition-colors border appearance-none ${
            error
              ? 'border-rose-400 text-rose-950 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-rose-50/30'
              : 'border-[#e0e0d6] text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] focus:border-[#5A5A40] bg-[#fdfcfb]'
          } pl-4 pr-10 py-2.5 disabled:bg-[#f0f0ea] disabled:text-[#8e8e7a] disabled:cursor-not-allowed ${selectClassName}`}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => {
            const isObj = typeof opt === 'object' && opt !== null;
            const val = isObj ? opt.value : opt;
            const lbl = isObj ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#7a7a6e]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-[#8e8e7a]">{helperText}</p>
      ) : null}
    </div>
  );
}
