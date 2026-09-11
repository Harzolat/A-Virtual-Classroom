import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLectures } from '../../context/LectureContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import CourseCard from '../../components/common/CourseCard';
import LectureCard from '../../components/common/LectureCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import {
  BookOpen,
  Calendar,
  Users,
  PlusCircle,
  Radio,
  FileCheck,
  FolderOpen,
  ArrowRight,
  Video,
  Upload
} from 'lucide-react';
import { MOCK_COURSES, MOCK_LECTURES } from '../../data/mockData';

export default function LecturerDashboard() {
  const { currentUser } = useAuth();
  const { lectures } = useLectures();
  const navigate = useNavigate();

  const assignedCourses = MOCK_COURSES.filter((c) => c.lecturer.includes('Adeleke') || c.code === 'COM 221' || c.code === 'COM 222');
  const liveLecture = lectures.find((l) => l.status === 'Live Now');
  const nextScheduled = lectures.find((l) => l.status === 'Scheduled');

  return (
    <DashboardLayout title="Lecturer Academic Console">
      {/* Welcome & Faculty Header */}
      <div className="bg-[#5A5A40] text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#f5f5f0] text-xs font-semibold backdrop-blur-xs">
              <span>Faculty of Applied Science & Tech</span>
              <span>•</span>
              <span>Computer Science Department</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
              Welcome, {currentUser?.name || 'Engr. Dr. K. A. Adeleke'}
            </h2>
            <p className="text-xs md:text-sm text-[#d4d4c4] max-w-xl">
              Staff ID: <span className="font-mono font-semibold text-white">{currentUser?.staffId || 'STF/CS/2018/042'}</span> • You have 1 active virtual classroom session in progress.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/lecturer/lectures/create')}
              icon={PlusCircle}
            >
              Schedule Lecture
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={() => navigate('/meeting/room-com221-live')}
              icon={Radio}
              className="shadow-lg"
            >
              Enter Classroom (Host)
            </Button>
          </div>
        </div>
      </div>

      {/* Active Live Lecture Alert (Host Mode) */}
      {liveLecture && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center animate-pulse shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="live" size="sm" dot pulse>
                  ACTIVE HOST SESSION
                </Badge>
                <span className="text-xs font-bold text-rose-900 font-mono">
                  {liveLecture.courseCode}
                </span>
              </div>
              <h4 className="font-serif font-bold text-base text-rose-950 mt-0.5">
                {liveLecture.title}
              </h4>
              <p className="text-xs text-rose-800">
                42 ND2 Students Currently In Room • Recording: Cloud Storage Active
              </p>
            </div>
          </div>

          <Button
            variant="danger"
            size="md"
            onClick={() => navigate(`/meeting/${liveLecture.meetingId}`)}
            icon={ArrowRight}
            iconPosition="right"
          >
            Launch Host Controls
          </Button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Courses"
          value="2 Courses"
          subtitle="COM 221 & COM 222 (ND2)"
          icon={BookOpen}
          variant="olive"
        />

        <StatCard
          title="Enrolled Students"
          value="84 Students"
          subtitle="ND2 Computer Science"
          icon={Users}
          variant="clay"
        />

        <StatCard
          title="Average Attendance"
          value="91.5%"
          subtitle="High compliance (>75% NBTE)"
          icon={FileCheck}
          variant="olive"
          trend="4.1% vs last semester"
          trendPositive={true}
        />

        <StatCard
          title="Conducted Lectures"
          value="18 Sessions"
          subtitle="This Academic Semester"
          icon={Calendar}
          variant="neutral"
        />
      </div>

      {/* 2-Column: Upcoming Lectures & Attendance Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Lecture Schedule & Quick Start */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#2d2d2d] flex items-center gap-2">
              <span>My Teaching Timetable</span>
              <Badge variant="clay" size="sm">
                ND2 Faculty Roster
              </Badge>
            </h3>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/lecturer/lectures/create')}
              icon={PlusCircle}
            >
              Schedule New
            </Button>
          </div>

          <div className="space-y-3">
            {lectures.map((lecture) => (
              <LectureCard
                key={lecture.id}
                lecture={lecture}
                role="lecturer"
                onJoin={() => navigate(`/meeting/${lecture.meetingId}`)}
              />
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Quick Course Actions & Upload */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Upload Courseware Card */}
          <Card className="bg-[#fafaf6] border-[#e2d5c6] space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#A67C52] text-white flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-[#2d2d2d]">
                  Upload Lecture Materials
                </h4>
                <p className="text-xs text-[#7a7a6e] mt-0.5">
                  Distribute PDFs, lab manuals, and assignments to ND2 students instantly.
                </p>
              </div>
            </div>

            <Button
              variant="clay"
              size="md"
              onClick={() => navigate('/lecturer/materials')}
              className="w-full"
              icon={Upload}
            >
              Go to Materials Manager
            </Button>
          </Card>

          {/* Attendance Overview Card */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Attendance Compliance Overview</CardTitle>
                <p className="text-xs text-[#7a7a6e]">NBTE 75% Examination Docket Eligibility</p>
              </div>
            </CardHeader>

            <div className="space-y-3">
              <div className="p-3 bg-[#f5f5ee] rounded-xl border border-[#e8e8dc] flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[#2d2d2d] block">COM 221 - Data Structures</span>
                  <span className="text-[11px] text-[#8e8e7a]">42 Students registered</span>
                </div>
                <Badge variant="success" size="sm">91.7% Avg</Badge>
              </div>

              <div className="p-3 bg-[#f5f5ee] rounded-xl border border-[#e8e8dc] flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-[#2d2d2d] block">COM 222 - Object Oriented Prog</span>
                  <span className="text-[11px] text-[#8e8e7a]">42 Students registered</span>
                </div>
                <Badge variant="success" size="sm">88.9% Avg</Badge>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#ecece2] text-center">
              <button
                type="button"
                onClick={() => navigate('/lecturer/attendance')}
                className="text-xs font-bold text-[#5A5A40] hover:underline"
              >
                Open Full Attendance Register →
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Assigned Courses */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-[#2d2d2d]">
            Assigned Teaching Courses
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/lecturer/courses')}
          >
            Manage Course Repositories
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              role="lecturer"
              onView={() => navigate(`/lecturer/courses`)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
