import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import NotificationItem from '../../components/common/NotificationItem';
import { Megaphone, Send, CheckCircle2 } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('All');
  const [success, setSuccess] = useState(false);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    const newNotif = {
      id: `notif-${Date.now()}`,
      title: broadcastTitle,
      message: broadcastMessage,
      timestamp: 'Just now',
      type: 'warning',
      read: false
    };

    setNotifications([newNotif, ...notifications]);
    setBroadcastTitle('');
    setBroadcastMessage('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <DashboardLayout title="Academic Broadcasts & Notices">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs">
          <Badge variant="primary" size="sm" className="mb-1">
            Institutional Broadcasts
          </Badge>
          <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
            Campus-Wide Notices & Emergency Alerts
          </h2>
          <p className="text-xs text-[#7a7a6e] mt-1">
            Dispatch announcements directly to all ND2 students and faculty lecture boards.
          </p>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Broadcast notice dispatched successfully across student and lecturer portals!</span>
          </div>
        )}

        {/* Create Broadcast Form */}
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Compose Official Notice</CardTitle>
          </CardHeader>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  id="b-title"
                  label="Notice Heading"
                  placeholder="e.g. Mid-Semester Test Timetable Published"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  required
                />
              </div>

              <Select
                id="b-target"
                label="Target Audience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                options={['All Students & Faculty', 'ND2 Students Only', 'Faculty Lecturers Only']}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5A40] mb-1.5">
                Notice Content
              </label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-[#e0e0d6] bg-[#fdfcfb] p-3 text-xs text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                placeholder="Type official notice details..."
                required
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Megaphone}
              >
                Send Broadcast
              </Button>
            </div>
          </form>
        </Card>

        {/* Existing Notices */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-base text-[#2d2d2d]">Dispatched Notices</h3>
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
