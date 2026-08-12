import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Table from '../../components/common/Table';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Radio,
  FileCheck,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { MOCK_COURSES, MOCK_LECTURES, MOCK_STUDENTS } from '../../data/mockData';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Academic Administration & Planning Console">
      {/* Admin Header */}
      <div className="bg-[#5A5A40] text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#f5f5f0] text-xs font-semibold backdrop-blur-xs">
              <span>Directorate of Academic Planning & ICT</span>
              <span>•</span>
              <span>Institution Super Admin</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
              Academic Administration Overview
            </h2>
            <p className="text-xs md:text-sm text-[#d4d4c4] max-w-xl">
              2nd Semester 2024/2025 Session • Real-time monitoring of lecture delivery, student attendance compliance, and curriculum coverage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/admin/students')}
              icon={GraduationCap}
            >
              Manage Students
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/admin/courses')}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              icon={BookOpen}
            >
              Curriculum Courses
            </Button>
          </div>
        </div>
      </div>

      {/* Institutional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Enrolled ND2 Students"
          value="84 Students"
          subtitle="Computer Science Dept"
          icon={GraduationCap}
          variant="olive"
        />

        <StatCard
          title="Faculty Lecturers"
          value="8 Lecturers"
          subtitle="Accredited Academic Staff"
          icon={Briefcase}
          variant="clay"
        />

        <StatCard
          title="Active ND2 Courses"
          value="6 Courses"
          subtitle="18 Total Credit Load"
          icon={BookOpen}
          variant="neutral"
        />

        <StatCard
          title="Live Lecture Sessions"
          value="1 In Progress"
          subtitle="COM 221 (42 students connected)"
          icon={Radio}
          variant="live"
        />
      </div>

      {/* Live Classroom Monitor & Attendance Compliance Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Active Lecture Overseer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#2d2d2d] flex items-center gap-2">
              <span>Live Virtual Classroom Monitor</span>
              <Badge variant="live" size="sm" dot pulse>1 Active</Badge>
            </h3>
          </div>

          <Card className="border-2 border-rose-300 bg-[#fffdfb] space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="live" size="sm" className="mb-2">LIVE STREAMING</Badge>
                <h4 className="font-serif font-bold text-lg text-[#2d2d2d]">
                  COM 221: Data Structures & Algorithms
                </h4>
                <p className="text-xs text-[#7a7a6e]">
                  Lecturer: Engr. Dr. K. A. Adeleke • Started: 10:00 AM • 42 / 45 Students Connected
                </p>
              </div>

              <Button
                variant="danger"
                size="md"
                onClick={() => navigate('/meeting/room-com221-live')}
                icon={Radio}
              >
                Join as Observer
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#ecece2] text-center text-xs">
              <div className="p-2.5 bg-[#f5f5ee] rounded-xl border border-[#e8e8dc]">
                <span className="text-[#8e8e7a] block">Stream Quality</span>
                <span className="font-bold text-emerald-700">1080p HD (Stable)</span>
              </div>
              <div className="p-2.5 bg-[#f5f5ee] rounded-xl border border-[#e8e8dc]">
                <span className="text-[#8e8e7a] block">Attendance Rate</span>
                <span className="font-bold text-[#5A5A40]">93.3% Present</span>
              </div>
              <div className="p-2.5 bg-[#f5f5ee] rounded-xl border border-[#e8e8dc]">
                <span className="text-[#8e8e7a] block">Auto-Recording</span>
                <span className="font-bold text-[#A67C52]">Active (Cloud)</span>
              </div>
            </div>
          </Card>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card hoverEffect onClick={() => navigate('/admin/students')} className="cursor-pointer space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#2d2d2d]">Student Registry</span>
                <GraduationCap className="w-4 h-4 text-[#5A5A40]" />
              </div>
              <p className="text-xs text-[#7a7a6e]">View, filter, or register matriculated students.</p>
            </Card>

            <Card hoverEffect onClick={() => navigate('/admin/attendance')} className="cursor-pointer space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#2d2d2d]">Attendance Compliance</span>
                <FileCheck className="w-4 h-4 text-[#A67C52]" />
              </div>
              <p className="text-xs text-[#7a7a6e]">Review students meeting the 75% exam requirement.</p>
            </Card>
          </div>
        </div>

        {/* Right 5 Cols: Departmental Health & Alert Box */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-[#fcfaf5] border-[#e2d5c6] space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="font-serif font-bold text-sm text-[#2d2d2d]">
                NBTE Exam Docket Eligibility Audit
              </h4>
            </div>
            <p className="text-xs text-[#7a7a6e] leading-relaxed">
              3 students in ND2 Computer Science are currently trending below the mandatory 75% attendance threshold. Automated notices have been dispatched.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/attendance')}
              className="w-full text-xs"
            >
              View At-Risk Students List
            </Button>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Syllabus Coverage</CardTitle>
            </CardHeader>

            <div className="space-y-3">
              {MOCK_COURSES.slice(0, 4).map((c) => (
                <div key={c.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#2d2d2d]">{c.code}</span>
                    <span className="text-[#5A5A40]">{c.progress}% Covered</span>
                  </div>
                  <div className="w-full h-2 bg-[#eaeae0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5A5A40] rounded-full"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
