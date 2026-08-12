import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CourseCard from '../../components/common/CourseCard';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { BookOpen, PlusCircle, Users, Upload } from 'lucide-react';
import { MOCK_COURSES } from '../../data/mockData';

export default function LecturerCourses() {
  const navigate = useNavigate();
  const lecturerCourses = MOCK_COURSES.filter(
    (c) => c.lecturer.includes('Adeleke') || c.code === 'COM 221' || c.code === 'COM 222'
  );

  return (
    <DashboardLayout title="Lecturer Course Management">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" size="sm" className="mb-1">
              Faculty Allocation
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Assigned Courses (ND2 Level)
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Manage course outlines, upload syllabus handouts, and review student performance.
            </p>
          </div>

          <Button
            variant="clay"
            size="md"
            onClick={() => navigate('/lecturer/materials')}
            icon={Upload}
          >
            Upload Materials
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lecturerCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              role="lecturer"
              onView={() => navigate(`/student/courses/${course.id}`)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
