import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import { Search, Plus, Briefcase, Mail } from 'lucide-react';
import { MOCK_LECTURERS } from '../../data/mockData';

export default function AdminLecturers() {
  const [lecturers, setLecturers] = useState(MOCK_LECTURERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newLecturer, setNewLecturer] = useState({
    name: '',
    staffId: '',
    email: '',
    department: 'Computer Science',
    title: 'Senior Lecturer',
    assignedCourses: ['COM 221']
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newLecturer.name) return;

    setLecturers([
      {
        id: `lec-${Date.now()}`,
        ...newLecturer,
        status: 'Active',
        totalLectures: 0
      },
      ...lecturers
    ]);
    setIsAddModalOpen(false);
  };

  const columns = [
    {
      header: 'Lecturer',
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <Avatar src={row.avatar} name={row.name} size="sm" role="lecturer" />
          <div>
            <span className="font-bold text-xs text-[#2d2d2d] block">{row.name}</span>
            <span className="text-[11px] text-[#8e8e7a]">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Staff ID',
      key: 'staffId',
      render: (val) => <span className="font-mono text-xs font-bold text-[#5A5A40]">{val}</span>
    },
    {
      header: 'Department / Title',
      key: 'department',
      render: (val, row) => (
        <div>
          <span className="text-xs text-[#2d2d2d] font-medium block">{val}</span>
          <span className="text-[10px] text-[#8e8e7a]">{row.title}</span>
        </div>
      )
    },
    {
      header: 'Assigned Courses',
      key: 'assignedCourses',
      render: (val) => (
        <div className="flex flex-wrap gap-1">
          {val?.map((c) => (
            <Badge key={c} variant="primary" size="sm">{c}</Badge>
          ))}
        </div>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <Badge variant="success" size="sm">{val}</Badge>
    }
  ];

  return (
    <DashboardLayout title="Faculty & Lecturer Directory">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="clay" size="sm" className="mb-1">
              Faculty Directory
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Accredited Teaching Staff
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Faculty course assignments, staff IDs, and lecture delivery permissions.
            </p>
          </div>

          <Button
            variant="clay"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            icon={Plus}
          >
            Add Faculty Staff
          </Button>
        </div>

        <Card>
          <Table
            columns={columns}
            data={lecturers}
            keyField="id"
          />
        </Card>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Faculty Lecturer"
        subtitle="Provision academic staff access to ND2 virtual classrooms"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            id="l-name"
            label="Lecturer Full Name"
            placeholder="e.g. Dr. A. O. Balogun"
            value={newLecturer.name}
            onChange={(e) => setNewLecturer({ ...newLecturer, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="l-staff"
              label="Staff ID"
              placeholder="STF/CS/2022/012"
              value={newLecturer.staffId}
              onChange={(e) => setNewLecturer({ ...newLecturer, staffId: e.target.value })}
              required
            />
            <Input
              id="l-email"
              label="Institutional Email"
              type="email"
              placeholder="balogun.a@polytechnic.edu.ng"
              value={newLecturer.email}
              onChange={(e) => setNewLecturer({ ...newLecturer, email: e.target.value })}
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
              Provision Account
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
