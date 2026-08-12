import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Save } from 'lucide-react';

export default function LecturerSettings() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardLayout title="Lecturer Faculty Settings">
      <div className="space-y-6 max-w-4xl">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs">
          <Badge variant="clay" size="sm" className="mb-1">
            Faculty Controls
          </Badge>
          <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
            Classroom & Teaching Defaults
          </h2>
          <p className="text-xs text-[#7a7a6e] mt-1">
            Configure automated recording defaults, attendance thresholds, and consultation schedules.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold">
            ✓ Faculty preferences saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Classroom Default Configurations</CardTitle>
            </CardHeader>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#fafaf6] border border-[#e8e8dc] cursor-pointer">
                <div>
                  <span className="font-bold text-[#2d2d2d] block">Auto-Record Virtual Lectures to Cloud</span>
                  <span className="text-[#7a7a6e]">Automatically start cloud recording when lecturer joins room.</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#fafaf6] border border-[#e8e8dc] cursor-pointer">
                <div>
                  <span className="font-bold text-[#2d2d2d] block">Mute Students on Entry</span>
                  <span className="text-[#7a7a6e]">Force all student microphones to be muted upon entering virtual room.</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4"
                />
              </label>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>

            <div className="space-y-3">
              <Input
                id="old-staff-pwd"
                label="Current Password"
                type="password"
                placeholder="••••••••••••"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="new-staff-pwd"
                  label="New Password"
                  type="password"
                  placeholder="••••••••••••"
                />
                <Input
                  id="conf-staff-pwd"
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
              Save Faculty Settings
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
