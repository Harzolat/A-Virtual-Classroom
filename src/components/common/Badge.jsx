import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  pulse = false,
  className = ''
}) {
  const variantStyles = {
    neutral: 'bg-[#efefe8] text-[#555544] border-[#dedecf]',
    primary: 'bg-[#eaeae0] text-[#5A5A40] border-[#d4d4c4]',
    olive: 'bg-[#5A5A40] text-white border-[#484832]',
    clay: 'bg-[#f4ebe1] text-[#A67C52] border-[#e8d7c5]',
    success: 'bg-[#ebf4ec] text-[#2e6b36] border-[#cbe3cf]',
    warning: 'bg-[#fbf4e4] text-[#916212] border-[#f0deae]',
    danger: 'bg-[#faecec] text-[#a82d2d] border-[#f2cdcd]',
    info: 'bg-[#ebf3f7] text-[#29658a] border-[#cfe2ee]',
    live: 'bg-[#c53030] text-white border-[#9b2424] font-semibold'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded-md',
    md: 'text-xs px-2.5 py-1 font-medium rounded-full',
    lg: 'text-sm px-3.5 py-1.5 font-medium rounded-full'
  };

  const dotColors = {
    neutral: 'bg-[#8e8e7a]',
    primary: 'bg-[#5A5A40]',
    olive: 'bg-white',
    clay: 'bg-[#A67C52]',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    danger: 'bg-rose-600',
    info: 'bg-sky-600',
    live: 'bg-white'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border whitespace-nowrap ${variantStyles[variant] || variantStyles.neutral} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant] || 'bg-[#5A5A40]'}`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant] || 'bg-[#5A5A40]'}`}
          />
        </span>
      )}
      {children}
    </span>
  );
}
