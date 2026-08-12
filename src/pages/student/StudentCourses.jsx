import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import CourseCard from '../../components/common/CourseCard';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import { Search, BookOpen, Filter } from 'lucide-react';
import { MOCK_COURSES } from '../../data/mockData';

export default function StudentCourses() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('all');

  const filteredCourses = MOCK_COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit =
      selectedUnit === 'all' || course.creditUnit.toString() === selectedUnit;
    return matchesSearch && matchesUnit;
  });

  return (
    <DashboardLayout title="My Registered Courses">
      <div className="space-y-6">
        {/* Header summary banner */}
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" size="sm">
                2nd Semester 2024/2025
              </Badge>
              <Badge variant="clay" size="sm">
                ND2 Computer Science
              </Badge>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Curriculum Course Roster
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Total 6 Courses Registered • 18 Total Credit Units • Department of Computer Science
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right px-4 py-2 bg-[#f5f5ee] rounded-2xl border border-[#e8e8dc]">
              <p className="text-xs text-[#8e8e7a]">Total Credit Load</p>
              <p className="text-xl font-serif font-bold text-[#5A5A40]">18 Units</p>
            </div>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              id="course-search"
              placeholder="Search course title, code, lecturer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select
              id="unit-filter"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              options={[
                { value: 'all', label: 'All Credit Units' },
                { value: '4', label: '4 Credit Units' },
                { value: '3', label: '3 Credit Units' },
                { value: '2', label: '2 Credit Units' }
              ]}
              className="w-48"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              role="student"
              onView={() => navigate(`/student/courses/${course.id}`)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
