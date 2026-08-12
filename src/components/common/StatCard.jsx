import React from 'react';
import Card from './Card';
import Badge from './Badge';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  variant = 'olive', // 'olive' | 'clay' | 'neutral' | 'live'
  className = ''
}) {
  const iconVariants = {
    olive: 'bg-[#5A5A40] text-white',
    clay: 'bg-[#A67C52] text-white',
    neutral: 'bg-[#eaeae0] text-[#5A5A40]',
    live: 'bg-rose-600 text-white'
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-[#8e8e7a]">{title}</p>
          <h4 className="text-2xl lg:text-3xl font-serif font-bold text-[#2d2d2d] tracking-tight">{value}</h4>
          {subtitle && <p className="text-xs text-[#7a7a6e]">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs shrink-0 ${iconVariants[variant] || iconVariants.olive}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-[#ecece2] flex items-center justify-between text-xs">
          <span className="text-[#8e8e7a]">Compared to last semester</span>
          <span className={`font-semibold flex items-center gap-1 ${trendPositive ? 'text-emerald-700' : 'text-rose-600'}`}>
            {trendPositive ? '↑' : '↓'} {trend}
          </span>
        </div>
      )}
    </Card>
  );
}
