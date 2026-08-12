import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <DashboardLayout title="System Administration Settings">
      <div className="space-y-6 max-w-4xl">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs">
          <Badge variant="primary" size="sm" className="mb-1">
            System Policies
          </Badge>
          <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
            Institutional Policy & Attendance Thresholds
          </h2>
          <p className="text-xs text-[#7a7a6e] mt-1">
            Configure NBTE minimum lecture attendance requirements and semester timetable rules.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold">
            ✓ System settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Thresholds & Exam Eligibility</CardTitle>
            </CardHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="att-threshold"
                  label="Minimum Examination Attendance (%)"
                  type="number"
                  defaultValue="75"
                  helperText="NBTE Standard accreditation baseline"
                />
                <Input
                  id="grace-period"
                  label="Classroom Join Grace Period (Minutes)"
                  type="number"
                  defaultValue="15"
                  helperText="Time allowed before a student is flagged late"
                />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Session Configurations</CardTitle>
            </CardHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="session-name"
                label="Current Academic Session"
                defaultValue="2024/2025"
              />
              <Input
                id="semester-name"
                label="Current Semester"
                defaultValue="Second Semester"
              />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
            >
              Save Configuration
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
