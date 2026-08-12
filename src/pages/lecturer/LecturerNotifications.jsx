import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import NotificationItem from '../../components/common/NotificationItem';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';

export default function LecturerNotifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  return (
    <DashboardLayout title="Faculty Communications">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="clay" size="sm" className="mb-1">
              Department Notices
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Academic Planning Communications
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Lecture scheduling verifications, departmental memos, and student inquiries.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
