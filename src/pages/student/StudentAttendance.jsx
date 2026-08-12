import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { FileCheck, AlertTriangle, CheckCircle2, Download, Printer, ShieldCheck } from 'lucide-react';
import { MOCK_ATTENDANCE } from '../../data/mockData';

export default function StudentAttendance() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const attendanceLogColumns = [
    {
      header: 'Date & Time',
      key: 'date',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-[#2d2d2d] block">{row.date}</span>
          <span className="text-[11px] text-[#8e8e7a]">{row.timeJoined || '10:00 AM'}</span>
        </div>
      )
    },
    {
      header: 'Course',
      key: 'courseCode',
      render: (val, row) => (
        <div>
          <Badge variant="primary" size="sm">{row.courseCode}</Badge>
          <span className="text-xs text-[#555544] ml-2 font-medium">{row.courseTitle}</span>
        </div>
      )
    },
    {
      header: 'Lecture Topic',
      key: 'lecture',
      render: (val) => <span className="text-xs text-[#2d2d2d]">{val}</span>
    },
    {
      header: 'Session Duration',
      key: 'duration',
      render: (val) => (
        <span className="text-xs font-mono text-[#555544]">{val}</span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => (
        <Badge
          variant={val === 'Present' ? 'success' : val === 'Excused' ? 'warning' : 'danger'}
          size="sm"
        >
          {val}
        </Badge>
      )
    }
  ];

  // Flatten histories for recent log table
  const allLogs = MOCK_ATTENDANCE.flatMap((c) =>
    (c.history || []).map((h, idx) => ({
      id: `${c.courseId}-${idx}`,
      courseCode: c.courseCode,
      courseTitle: c.courseTitle,
      ...h
    }))
  );

  return (
    <DashboardLayout title="Academic Attendance Records">
      <div className="space-y-6">
        {/* Compliance Header Banner */}
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="success" size="md">
                NBTE 75% Rule Compliant
              </Badge>
              <Badge variant="clay" size="md">
                Distinction Candidate
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2d2d2d]">
              Overall Attendance: 91.5%
            </h2>
            <p className="text-xs text-[#7a7a6e] max-w-xl leading-relaxed">
              You are eligible to sit for all registered 2nd semester examinations. All virtual lecture attendances are timestamped and digitally signed by the course lecturer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => window.print()}
              icon={Printer}
            >
              Print Slip
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => alert('Generating verified attendance transcript PDF...')}
              icon={Download}
            >
              Export Transcript
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Lecture Hours"
            value="48 Hours"
            subtitle="44 Hours Attended"
            icon={FileCheck}
            variant="olive"
          />
          <StatCard
            title="Eligible Courses"
            value="6 / 6 Courses"
            subtitle="All > 75% threshold"
            icon={ShieldCheck}
            variant="clay"
          />
          <StatCard
            title="Excused Sessions"
            value="2 Sessions"
            subtitle="Approved by Head of Dept"
            icon={CheckCircle2}
            variant="neutral"
          />
        </div>

        {/* Course Breakdown Table */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Course-by-Course Attendance Breakdown</CardTitle>
              <p className="text-xs text-[#7a7a6e]">NBTE Minimum Requirement: 75% for exam docket issuance</p>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_ATTENDANCE.map((item) => {
              const isEligible = item.percentage >= 75;
              return (
                <div
                  key={item.courseCode}
                  className="p-4 rounded-2xl bg-[#fafaf6] border border-[#e8e8dc] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#2d2d2d] block">{item.courseCode}</span>
                      <span className="text-[11px] text-[#8e8e7a] line-clamp-1">{item.courseTitle}</span>
                    </div>
                    <Badge variant={isEligible ? 'success' : 'danger'} size="sm">
                      {isEligible ? 'Eligible' : 'At Risk'}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#555544]">Attended {item.attended} of {item.totalLectures || 14}</span>
                      <span className="text-[#5A5A40]">{item.percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#eaeae0] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.percentage >= 80 ? 'bg-[#5A5A40]' : item.percentage >= 75 ? 'bg-[#A67C52]' : 'bg-rose-600'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Detailed Attendance Log */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Live Virtual Lecture Attendance Logs</CardTitle>
              <p className="text-xs text-[#7a7a6e]">Verified timestamps and session duration tracking</p>
            </div>
          </CardHeader>

          <Table
            columns={attendanceLogColumns}
            data={allLogs}
            keyField="id"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
