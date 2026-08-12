import React, { useState } from 'react';

export default function Avatar({
  src,
  name = 'User',
  size = 'md',
  role = '',
  status = null, // 'online' | 'busy' | 'offline'
  className = ''
}) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.replace(/^(Dr\.|Engr\.|Prof\.|Mr\.|Mrs\.|Miss)\s+/i, '').trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.substring(0, 2).toUpperCase();
  };

  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl'
  };

  const statusSize = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
    '2xl': 'w-4 h-4'
  };

  const statusColors = {
    online: 'bg-emerald-500 ring-white',
    busy: 'bg-rose-500 ring-white',
    offline: 'bg-slate-400 ring-white'
  };

  const roleBackgrounds = {
    student: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    lecturer: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    admin: 'bg-amber-100 text-amber-800 border-amber-300',
    default: 'bg-slate-100 text-slate-800 border-slate-300'
  };

  const colorClass = roleBackgrounds[role?.toLowerCase()] || roleBackgrounds.default;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className={`rounded-full object-cover border border-slate-200 ${sizeStyles[size] || sizeStyles.md}`}
        />
      ) : (
        <div
          className={`rounded-full font-semibold flex items-center justify-center border select-none ${colorClass} ${sizeStyles[size] || sizeStyles.md}`}
          title={name}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ${statusColors[status] || statusColors.online} ${statusSize[size] || statusSize.md}`}
        />
      )}
    </div>
  );
}
