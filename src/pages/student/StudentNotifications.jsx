import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import NotificationItem from '../../components/common/NotificationItem';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <DashboardLayout title="Academic Notifications">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" size="sm" className="mb-1">
              Live Notices
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Notifications & Lecture Announcements
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Class cancellations, upcoming test deadlines, and live virtual lecture calls.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
          >
            Mark All as Read
          </Button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onMarkRead={handleMarkRead}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
