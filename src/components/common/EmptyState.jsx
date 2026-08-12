import React from 'react';
import Button from './Button';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({
  title = 'No items found',
  description = 'There is currently no data available for this section.',
  icon: Icon = FolderOpen,
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`p-8 md:p-12 text-center rounded-2xl border border-dashed border-[#d8d8cc] bg-[#fafaf6] flex flex-col items-center justify-center ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-[#efefe5] border border-[#e0e0d6] flex items-center justify-center text-[#5A5A40] mb-4 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-serif text-lg font-bold text-[#2d2d2d] mb-1">{title}</h4>
      <p className="text-xs text-[#7a7a6e] max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
