import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Calendar, Radio, Video, Mic, ArrowRight } from 'lucide-react';
import { useLectures } from '../../context/LectureContext';

export default function AdminLectures() {
  const navigate = useNavigate();
  const { lectures } = useLectures();

  const columns = [
    {
      header: 'Course Code & Title',
      key: 'courseCode',
      render: (val, row) => (
        <div>
          <Badge variant="primary" size="sm">{row.courseCode}</Badge>
          <span className="text-xs font-bold text-[#2d2d2d] block mt-0.5">{row.courseTitle}</span>
        </div>
      )
    },
    {
      header: 'Lecture Topic',
      key: 'title',
      render: (val) => <span className="text-xs text-[#2d2d2d] font-medium">{val}</span>
    },
    {
      header: 'Faculty Lecturer',
      key: 'lecturer',
      render: (val) => <span className="text-xs text-[#555544]">{val}</span>
    },
    {
      header: 'Session Time',
      key: 'startTime',
      render: (val, row) => (
        <span className="text-xs font-mono text-[#7a7a6e]">{row.date} ({val} - {row.endTime})</span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => (
        <Badge
          variant={val === 'Live Now' ? 'live' : val === 'Scheduled' ? 'clay' : 'neutral'}
          size="sm"
          dot={val === 'Live Now'}
          pulse={val === 'Live Now'}
        >
          {val}
        </Badge>
      )
    },
    {
      header: 'Action',
      key: 'action',
      render: (val, row) => (
        <Button
          variant={row.status === 'Live Now' ? 'danger' : 'outline'}
          size="sm"
          onClick={() => navigate(`/meeting/${row.meetingId}`)}
        >
          {row.status === 'Live Now' ? 'Observe Class' : 'View Details'}
        </Button>
      )
    }
  ];

  return (
    <DashboardLayout title="Institutional Lecture Timetable & Sessions">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" size="sm" className="mb-1">
              Lecture Operations
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Master Timetable & Classroom Sessions
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Track active, scheduled, and concluded lecture sessions across the academic department.
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
