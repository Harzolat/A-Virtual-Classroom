import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Video, Download, Play, FileCheck } from 'lucide-react';
import { useLectures } from '../../context/LectureContext';

export default function LecturerPreviousLectures() {
  const navigate = useNavigate();
  const { lectures } = useLectures();

  const columns = [
    {
      header: 'Course & Code',
      key: 'courseCode',
      render: (val, row) => (
        <div>
          <Badge variant="primary" size="sm">{row.courseCode}</Badge>
          <p className="text-xs text-[#2d2d2d] font-bold mt-0.5">{row.courseTitle}</p>
        </div>
      )
    },
    {
      header: 'Lecture Topic',
      key: 'title',
      render: (val) => <span className="text-xs text-[#2d2d2d] font-medium">{val}</span>
    },
    {
      header: 'Date & Time',
      key: 'dateFormatted',
      render: (val, row) => (
        <span className="text-xs text-[#7a7a6e]">{row.dateFormatted || row.date} ({row.startTime})</span>
      )
    },
    {
      header: 'Attendance',
      key: 'attendanceRecorded',
      render: (val) => (
        <Badge variant="success" size="sm">{val || '92%'}</Badge>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert(`Downloading verified attendance register for "${row.title}"...`)}
            icon={Download}
          >
            Attendance Register
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout title="Conducted Lecture History">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="clay" size="sm" className="mb-1">
              Academic Archive
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Delivered Lecture Sessions
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Historical catalog of conducted virtual lectures, cloud recordings, and attendance logs.
            </p>
          </div>
        </div>

        <Card>
          <Table
            columns={columns}
            data={lectures}
            keyField="id"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
