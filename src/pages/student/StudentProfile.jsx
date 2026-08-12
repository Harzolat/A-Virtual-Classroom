import React from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { GraduationCap, Mail, Hash, Phone, Award, BookOpen, ShieldCheck, Download } from 'lucide-react';
import { MOCK_COURSES } from '../../data/mockData';

export default function StudentProfile() {
  const { currentUser } = useAuth();

  return (
    <DashboardLayout title="Student Academic Profile">
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar
              src={currentUser?.avatar}
              name={currentUser?.name || 'Adebayo Oluwaseun'}
              size="2xl"
              role="student"
              className="shadow-md"
            />

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Badge variant="olive" size="md">
                  ND2 Full-Time Student
                </Badge>
                <Badge variant="success" size="md">
                  Active Enrollment
                </Badge>
              </div>

              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2d2d2d]">
                {currentUser?.name || 'Adebayo Oluwaseun Emmanuel'}
              </h2>

              <p className="text-xs md:text-sm text-[#7a7a6e]">
                Department of Computer Science • School of Technology
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#555544] pt-2">
                <span className="flex items-center gap-1.5 font-mono">
                  <Hash className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Matric: {currentUser?.matricNo || 'F/HD/23/3210042'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#5A5A40]" />
                  {currentUser?.email || 'adebayo.o@student.polytechnic.edu.ng'}
                </span>
              </div>
            </div>

            <div className="shrink-0 text-center px-6 py-4 bg-[#f7f6f0] rounded-2xl border border-[#e0e0d6]">
              <p className="text-xs text-[#8e8e7a]">Cumulative GPA</p>
              <p className="text-3xl font-serif font-bold text-[#5A5A40]">{currentUser?.cgpa || '3.68'}</p>
              <Badge variant="primary" size="sm" className="mt-1">
                Upper Credit / Distinction
              </Badge>
            </div>
          </div>
        </div>

        {/* Academic Details & Semester Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Registration Details</CardTitle>
            </CardHeader>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#ecece2]">
                <span className="text-[#8e8e7a]">Programme:</span>
                <span className="font-bold text-[#2d2d2d]">National Diploma in Computer Science</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#ecece2]">
                <span className="text-[#8e8e7a]">Current Level:</span>
                <span className="font-bold text-[#2d2d2d]">ND II (Final Year)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#ecece2]">
                <span className="text-[#8e8e7a]">Academic Session:</span>
                <span className="font-bold text-[#2d2d2d]">2024/2025 Second Semester</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#ecece2]">
                <span className="text-[#8e8e7a]">Registered Credit Units:</span>
                <span className="font-bold text-[#5A5A40]">18 Units (6 Courses)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#8e8e7a]">Academic Advisor:</span>
                <span className="font-bold text-[#2d2d2d]">Dr. (Mrs.) F. O. Ogunleye</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Semester Course Registrations</CardTitle>
            </CardHeader>

            <div className="space-y-2">
              {MOCK_COURSES.map((course) => (
                <div
                  key={course.id}
                  className="p-2.5 rounded-xl bg-[#fafaf6] border border-[#e8e8dc] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#2d2d2d] mr-2">{course.code}</span>
                    <span className="text-[#7a7a6e]">{course.title}</span>
                  </div>
                  <Badge variant="primary" size="sm">
                    {course.creditUnit} CU
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
