import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Layers, Download, CheckCircle2 } from 'lucide-react';
import { MOCK_STUDENTS, MOCK_COURSES } from '../../data/mockData';

export default function AdminEnrollments() {
  const enrollmentData = MOCK_STUDENTS.map((student, idx) => ({
    id: `enr-${idx}`,
    studentName: student.name,
    matricNo: student.matricNo,
    department: student.department,
    coursesCount: 6,
    creditLoad: 18,
    status: 'Verified (ICT Cleared)',
    date: '2024-11-10'
  }));

  const columns = [
    {
      header: 'Matriculation No',
      key: 'matricNo',
      render: (val) => <span className="font-mono text-xs font-bold text-[#5A5A40]">{val}</span>
    },
    {
      header: 'Student Name',
      key: 'studentName',
      render: (val) => <span className="text-xs font-bold text-[#2d2d2d]">{val}</span>
    },
    {
      header: 'Enrolled Courses',
      key: 'coursesCount',
      render: (val) => <span className="text-xs font-semibold text-[#2d2d2d]">{val} Courses</span>
    },
    {
      header: 'Total Credit Load',
      key: 'creditLoad',
      render: (val) => <Badge variant="primary" size="sm">{val} Units</Badge>
    },
    {
      header: 'Verification Status',
      key: 'status',
      render: (val) => <Badge variant="success" size="sm">{val}</Badge>
    }
  ];

  return (
    <DashboardLayout title="Course Enrollment Rosters">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="clay" size="sm" className="mb-1">
              Enrollment Records
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Course Registration Verifications
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Audit registered credit units and student eligibility for 2nd semester courses.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            onClick={() => alert('Exporting master enrollment registry to CSV/Excel...')}
            icon={Download}
          >
            Export Master Roster
          </Button>
        </div>

        <Card>
          <Table
            columns={columns}
            data={enrollmentData}
            keyField="id"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
