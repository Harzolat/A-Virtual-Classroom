import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { FileCheck, Download, Printer, Check, X, ShieldCheck } from 'lucide-react';
import { MOCK_COURSES, MOCK_ATTENDANCE } from '../../data/mockData';

export default function LecturerAttendance() {
  const [selectedCourse, setSelectedCourse] = useState('COM 221');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [studentRoster, setStudentRoster] = useState([
    { id: '1', matricNo: 'F/HD/23/3210042', name: 'Adebayo Oluwaseun', status: 'Present', duration: '58 mins', rate: '92%' },
    { id: '2', matricNo: 'F/HD/23/3210043', name: 'Fatima Mohammed', status: 'Present', duration: '60 mins', rate: '95%' },
    { id: '3', matricNo: 'F/HD/23/3210044', name: 'Chukwuemeka Eze', status: 'Present', duration: '55 mins', rate: '88%' },
    { id: '4', matricNo: 'F/HD/23/3210045', name: 'Aisha Bello', status: 'Present', duration: '60 mins', rate: '96%' },
    { id: '5', matricNo: 'F/HD/23/3210046', name: 'Ibrahim Musa', status: 'Present', duration: '52 mins', rate: '85%' },
    { id: '6', matricNo: 'F/HD/23/3210047', name: 'Ngozi Okonkwo', status: 'Absent', duration: '0 mins', rate: '68%' },
    { id: '7', matricNo: 'F/HD/23/3210048', name: 'Tunde Bakare', status: 'Present', duration: '59 mins', rate: '90%' },
  ]);

  const toggleStudentStatus = (id) => {
    setStudentRoster(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: s.status === 'Present' ? 'Absent' : 'Present'
        };
      }
      return s;
    }));
  };

  const columns = [
    {
      header: 'Matriculation No',
      key: 'matricNo',
      render: (val) => <span className="font-mono text-xs font-bold text-[#5A5A40]">{val}</span>
    },
    {
      header: 'Student Name',
      key: 'name',
      render: (val) => <span className="text-xs font-bold text-[#2d2d2d]">{val}</span>
    },
    {
      header: 'Session Duration',
      key: 'duration',
      render: (val) => <span className="text-xs font-mono text-[#555544]">{val}</span>
    },
    {
      header: 'Cumulative Rate',
      key: 'rate',
      render: (val) => {
        const num = parseInt(val);
        return (
          <Badge variant={num >= 75 ? 'success' : 'danger'} size="sm">
            {val} {num >= 75 ? '(Eligible)' : '(At Risk)'}
          </Badge>
        );
      }
    },
    {
      header: 'Status & Manual Override',
      key: 'status',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleStudentStatus(row.id)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              val === 'Present'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}
          >
            {val === 'Present' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            <span>{val}</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout title="Faculty Attendance Register">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" size="sm" className="mb-1">
              Class Register
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Lecture Attendance Verification
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Verify real-time classroom attendance timestamps and sign off NBTE compliance sheets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => window.print()}
              icon={Printer}
            >
              Print Register
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 2500);
              }}
              icon={ShieldCheck}
            >
              Submit to Academic Planning
            </Button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold">
            ✓ Attendance successfully submitted to Directorate of Academic Planning!
          </div>
        )}

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-72">
            <Select
              id="course-select"
              label="Select Course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              options={MOCK_COURSES.map(c => ({ value: c.code, label: `${c.code} - ${c.title}` }))}
            />
          </div>

          <div className="text-xs text-[#7a7a6e]">
            Showing roster for: <span className="font-bold text-[#2d2d2d]">Latest Live Session (COM 221)</span>
          </div>
        </div>

        {/* Roster Table */}
        <Card>
          <CardHeader>
            <CardTitle>Enrolled Student Attendance Roster</CardTitle>
          </CardHeader>

          <Table
            columns={columns}
            data={studentRoster}
            keyField="id"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
