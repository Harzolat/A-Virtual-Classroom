import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from './Badge';
import Button from './Button';
import { Radio, BookOpen, Bell, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export default function NotificationItem({
  notification,
  onMarkRead,
  className = ''
}) {
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case 'live':
        return <Radio className="w-4 h-4 text-rose-600 animate-pulse" />;
      case 'lecture':
        return <BookOpen className="w-4 h-4 text-[#5A5A40]" />;
      case 'material':
        return <FileText className="w-4 h-4 text-[#A67C52]" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#5A5A40]" />;
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case 'live':
        return 'live';
      case 'warning':
        return 'warning';
      case 'material':
        return 'clay';
      default:
        return 'primary';
    }
  };

  const handleAction = () => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        notification.read
          ? 'bg-[#fdfcfb] border-[#e0e0d6] opacity-85'
          : 'bg-[#faf9f4] border-[#d4d4c4] shadow-xs'
      } ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-[#efefe5] border border-[#e0e0d6] flex items-center justify-center shrink-0 mt-0.5">
          {getIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <Badge variant={getBadgeVariant(notification.type)} size="sm">
                {notification.type?.toUpperCase()}
              </Badge>
              <h5 className="text-sm font-bold text-[#2d2d2d] leading-snug">
                {notification.title}
              </h5>
            </div>
            <span className="text-xs text-[#8e8e7a] whitespace-nowrap">
              {notification.timestamp}
            </span>
          </div>

          <p className="text-xs text-[#666655] leading-relaxed mb-3">
            {notification.message}
          </p>

          <div className="flex items-center gap-3">
            {notification.actionUrl && (
              <Button
                variant={notification.type === 'live' ? 'danger' : 'outline'}
                size="sm"
                onClick={handleAction}
              >
                {notification.actionText || 'View Details'}
              </Button>
            )}

            {!notification.read && onMarkRead && (
              <button
                type="button"
                onClick={() => onMarkRead(notification.id)}
                className="text-xs text-[#7a7a6e] hover:text-[#5A5A40] font-medium flex items-center gap-1 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
