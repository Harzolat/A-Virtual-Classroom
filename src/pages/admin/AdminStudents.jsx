import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import { Search, Plus, GraduationCap, Download, Edit, Trash2 } from 'lucide-react';
import { MOCK_STUDENTS } from '../../data/mockData';

export default function AdminStudents() {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: '',
    matricNo: '',
    email: '',
    department: 'Computer Science',
    level: 'ND II',
    status: 'Active',
    attendanceRate: '90%'
  });

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.matricNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.matricNo) return;

    setStudents([
      {
        id: `stu-${Date.now()}`,
        ...newStudent,
        coursesCount: 6,
        cgpa: '3.50'
      },
      ...students
    ]);

    setIsAddModalOpen(false);
    setNewStudent({
      name: '',
      matricNo: '',
      email: '',
      department: 'Computer Science',
      level: 'ND II',
      status: 'Active',
      attendanceRate: '90%'
    });
  };

  const columns = [
    {
      header: 'Student',
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={row.name} size="sm" role="student" />
          <div>
            <span className="font-bold text-xs text-[#2d2d2d] block">{row.name}</span>
            <span className="text-[11px] text-[#8e8e7a]">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Matriculation No',
      key: 'matricNo',
      render: (val) => <span className="font-mono text-xs font-bold text-[#5A5A40]">{val}</span>
    },
    {
      header: 'Department / Level',
      key: 'department',
      render: (val, row) => (
        <div>
          <span className="text-xs text-[#2d2d2d] font-medium block">{val}</span>
          <span className="text-[10px] text-[#8e8e7a]">{row.level}</span>
        </div>
      )
    },
    {
      header: 'Attendance Rate',
      key: 'attendanceRate',
      render: (val) => {
        const num = parseInt(val);
        return (
          <Badge variant={num >= 75 ? 'success' : 'danger'} size="sm">
            {val} {num >= 75 ? '✓' : '⚠️'}
          </Badge>
        );
      }
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert(`Viewing full academic record for ${row.name} (${row.matricNo})`)}
          >
            Profile
          </Button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout title="Student Academic Registry">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" size="sm" className="mb-1">
              Registry Directory
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Matriculated ND2 Students
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Manage student enrollment status, institutional credentials, and attendance eligibility.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            icon={Plus}
          >
            Register Student
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="max-w-md w-full">
            <Input
              id="search-students"
              placeholder="Search by name, matric no, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          <span className="text-xs text-[#8e8e7a]">Total: {filteredStudents.length} Students</span>
        </div>

        <Card>
          <Table
            columns={columns}
            data={filteredStudents}
            keyField="id"
          />
        </Card>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Student"
        subtitle="Add student record to ND2 Academic Database"
      >
        <form onSubmit={handleAddStudent} className="space-y-4">
          <Input
            id="s-name"
            label="Full Name"
            placeholder="e.g. Emmanuel Chukwu"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="s-matric"
              label="Matriculation No"
              placeholder="F/HD/23/3210099"
              value={newStudent.matricNo}
              onChange={(e) => setNewStudent({ ...newStudent, matricNo: e.target.value })}
              required
            />
            <Input
              id="s-email"
              label="Institutional Email"
              type="email"
              placeholder="e.chukwu@student.polytechnic.edu.ng"
              value={newStudent.email}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
            >
              Save Student
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
