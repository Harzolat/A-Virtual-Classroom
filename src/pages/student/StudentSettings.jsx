import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Bell, Lock, Video, Volume2, Shield, Save } from 'lucide-react';

export default function StudentSettings() {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [liveClassAlerts, setLiveClassAlerts] = useState(true);
  const [audioInputTest, setAudioInputTest] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardLayout title="Portal & Classroom Settings">
      <div className="space-y-6 max-w-4xl">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs">
          <Badge variant="primary" size="sm" className="mb-1">
            System Preferences
          </Badge>
          <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
            Student Account & Classroom Configurations
          </h2>
          <p className="text-xs text-[#7a7a6e] mt-1">
            Configure audio/video hardware defaults, notification triggers, and password access.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold">
            ✓ Preferences saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#fafaf6] border border-[#e8e8dc] cursor-pointer">
                <div>
                  <span className="font-bold text-[#2d2d2d] block">Live Lecture Push & Audio Alerts</span>
                  <span className="text-[#7a7a6e]">Notify immediately when a lecturer starts an active lecture session.</span>
                </div>
                <input
                  type="checkbox"
                  checked={liveClassAlerts}
                  onChange={(e) => setLiveClassAlerts(e.target.checked)}
                  className="rounded text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#fafaf6] border border-[#e8e8dc] cursor-pointer">
                <div>
                  <span className="font-bold text-[#2d2d2d] block">Courseware Upload Notifications</span>
                  <span className="text-[#7a7a6e]">Receive email notifications when new lab manuals or slides are uploaded.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="rounded text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4"
                />
              </label>
            </div>
          </Card>

          {/* Virtual Classroom Hardware Testing */}
          <Card>
            <CardHeader>
              <CardTitle>Classroom Media Defaults</CardTitle>
            </CardHeader>

            <div className="space-y-4 text-xs">
              <p className="text-[#7a7a6e]">
                Default states when joining a virtual lecture room:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#fafaf6] rounded-xl border border-[#e8e8dc] flex items-center justify-between">
                  <span className="font-medium text-[#2d2d2d]">Microphone on Join</span>
                  <Badge variant="danger" size="sm">Muted (Standard)</Badge>
                </div>
                <div className="p-3 bg-[#fafaf6] rounded-xl border border-[#e8e8dc] flex items-center justify-between">
                  <span className="font-medium text-[#2d2d2d]">Camera on Join</span>
                  <Badge variant="primary" size="sm">Enabled</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Security & Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Portal Password</CardTitle>
            </CardHeader>

            <div className="space-y-3">
              <Input
                id="old-pwd"
                label="Current Password"
                type="password"
                placeholder="••••••••••••"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="new-pwd"
                  label="New Password"
                  type="password"
                  placeholder="••••••••••••"
                />
                <Input
                  id="confirm-new-pwd"
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
            >
              Save Preferences
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
