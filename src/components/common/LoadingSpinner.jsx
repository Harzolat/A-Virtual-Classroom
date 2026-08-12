import React from 'react';

export default function LoadingSpinner({
  size = 'md',
  message = 'Loading academic records...',
  className = ''
}) {
  const sizeStyles = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div
        className={`rounded-full animate-spin border-[#5A5A40] border-t-transparent ${sizeStyles[size] || sizeStyles.md}`}
      />
      {message && <p className="mt-4 text-xs font-medium text-[#7a7a6e]">{message}</p>}
    </div>
  );
}
