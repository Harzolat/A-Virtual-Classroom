import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { BookOpen, Plus, Search } from 'lucide-react';
import { MOCK_COURSES } from '../../data/mockData';

export default function AdminCourses() {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    creditUnit: '3',
    department: 'Computer Science',
    lecturer: 'Engr. Dr. K. A. Adeleke'
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.title) return;

    setCourses([
      ...courses,
      {
        id: `c-${Date.now()}`,
        ...newCourse,
        creditUnit: parseInt(newCourse.creditUnit),
        description: 'Approved NBTE curriculum standard course module.',
        progress: 0,
        enrolledStudents: 42
      }
    ]);
    setIsAddModalOpen(false);
  };

  const columns = [
    {
      header: 'Course Code',
      key: 'code',
      render: (val) => <Badge variant="primary" size="md">{val}</Badge>
    },
    {
      header: 'Course Title',
      key: 'title',
      render: (val) => <span className="text-xs font-bold text-[#2d2d2d]">{val}</span>
    },
    {
      header: 'Credit Units',
      key: 'creditUnit',
      render: (val) => <span className="text-xs font-mono font-bold text-[#5A5A40]">{val} CU</span>
    },
    {
      header: 'Assigned Lecturer',
      key: 'lecturer',
      render: (val) => <span className="text-xs text-[#555544] font-medium">{val}</span>
    },
    {
      header: 'Enrolled Students',
      key: 'enrolledStudents',
      render: (val) => <span className="text-xs font-bold text-[#2d2d2d]">{val || 42} Students</span>
    },
    {
      header: 'Syllabus Progress',
      key: 'progress',
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-[#eaeae0] rounded-full overflow-hidden">
            <div className="h-full bg-[#5A5A40]" style={{ width: `${val || 0}%` }} />
          </div>
          <span className="text-xs font-bold text-[#5A5A40]">{val || 0}%</span>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout title="Academic Curriculum & Courses">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" size="sm" className="mb-1">
              Curriculum Database
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Approved ND2 Courses
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              NBTE course codes, credit allocations, and faculty assignment mapping.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            icon={Plus}
          >
            Add New Course
          </Button>
        </div>

        <Card>
          <Table
            columns={columns}
            data={courses}
            keyField="id"
          />
        </Card>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Curriculum Course"
        subtitle="Register new course module under ND2 Computer Science"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="c-code"
              label="Course Code"
              placeholder="e.g. COM 225"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
              required
            />
            <Input
              id="c-unit"
              label="Credit Units"
              type="number"
              value={newCourse.creditUnit}
              onChange={(e) => setNewCourse({ ...newCourse, creditUnit: e.target.value })}
              required
            />
          </div>

          <Input
            id="c-title"
            label="Course Title"
            placeholder="e.g. Mobile Application Development"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            required
          />

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
              Save Course
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
