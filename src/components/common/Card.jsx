import React from 'react';

export default function Card({
  id,
  children,
  className = '',
  hoverEffect = false,
  padding = 'p-6',
  onClick
}) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-[#fdfcfb] border border-[#e0e0d6] rounded-2xl shadow-xs ${
        hoverEffect ? 'transition-all duration-200 hover:border-[#c8c8b8] hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''
      } ${padding} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between pb-4 border-b border-[#ecece2] mb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`font-serif text-lg font-bold text-[#2d2d2d] tracking-tight ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-xs text-[#7a7a6e] mt-1 ${className}`}>
      {children}
    </p>
  );
}
