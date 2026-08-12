import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import CourseCard from '../../components/common/CourseCard';
import LectureCard from '../../components/common/LectureCard';
import NotificationItem from '../../components/common/NotificationItem';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import {
  BookOpen,
  Calendar,
  FileCheck,
  Radio,
  ArrowRight,
  Clock,
  Download,
  Bell,
  ShieldCheck,
  CheckCircle2,
  Video,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  MOCK_COURSES,
  MOCK_LECTURES,
  MOCK_ATTENDANCE,
  MOCK_NOTIFICATIONS,
  MOCK_MATERIALS
} from '../../data/mockData';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [lectureFilter, setLectureFilter] = useState('all'); // 'all' | 'live-upcoming' | 'completed'

  // Dynamic calculations from mock data
  const liveLecture = MOCK_LECTURES.find((l) => l.status === 'Live Now');
  const upcomingLectures = MOCK_LECTURES.filter((l) => l.status === 'Scheduled');
  const completedLectures = MOCK_LECTURES.filter((l) => l.status === 'Completed');
  const registeredCourses = MOCK_COURSES;
  const recentNotifications = MOCK_NOTIFICATIONS.slice(0, 3);
  const latestMaterial = MOCK_MATERIALS?.[0];

  // Dynamic Overall Attendance Calculation
  const totalAttendanceSum = Array.isArray(MOCK_ATTENDANCE)
    ? MOCK_ATTENDANCE.reduce((acc, curr) => acc + (Number(curr.percentage) || 0), 0)
    : 0;
  const overallAttendance = (
    Array.isArray(MOCK_ATTENDANCE) && MOCK_ATTENDANCE.length > 0
      ? totalAttendanceSum / MOCK_ATTENDANCE.length
      : 91.5
  ).toFixed(1);

  // Total Credit Units calculation
  const totalCreditUnits = registeredCourses.reduce(
    (acc, curr) => acc + (Number(curr.creditUnit) || 0),
    0
  );

  // Filtered lectures for schedule display
  const displayedLectures = MOCK_LECTURES.filter((lecture) => {
    if (lectureFilter === 'live-upcoming') {
      return lecture.status === 'Live Now' || lecture.status === 'Scheduled';
    }
    if (lectureFilter === 'completed') {
      return lecture.status === 'Completed';
    }
    return true; // 'all'
  });

  return (
    <DashboardLayout title="Student Academic Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-[#5A5A40] text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
          {/* Subtle decorative shapes */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-[#A67C52]/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#f5f5f0] text-xs font-semibold backdrop-blur-xs">
                <span>{currentUser?.department || 'Computer Science'}</span>
                <span>•</span>
                <span>{currentUser?.level || 'ND II'}</span>
                <span>•</span>
                <span>{currentUser?.semester || '2nd Semester 2024/2025'}</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                Welcome back, {currentUser?.name || 'Adebayo Oluwaseun'}
              </h2>

              <p className="text-xs md:text-sm text-[#d4d4c4] max-w-xl">
                Matric No:{' '}
                <span className="font-mono font-semibold text-white">
                  {currentUser?.matricNo || currentUser?.studentId || 'ND2/CS/2024/0142'}
                </span>
                {' • '}
                {liveLecture ? (
                  <span className="text-rose-200 font-medium">
                    1 virtual lecture is currently LIVE and broadcasting.
                  </span>
                ) : (
                  <span>
                    No active lecture broadcasting right now. Next session at{' '}
                    <span className="text-white font-medium">
                      {upcomingLectures[0]?.startTime || 'Tomorrow 10:00 AM'}
                    </span>
                    .
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {liveLecture ? (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate(`/meeting/${liveLecture.meetingId}`)}
                  icon={Radio}
                  className="shadow-lg animate-pulse"
                >
                  Join Live Class
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => navigate('/student/lectures')}
                  icon={Calendar}
                  className="shadow-md"
                >
                  View Timetable
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Active Lecture Alert Banner OR Quiet State */}
        {liveLecture ? (
          <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center animate-pulse shrink-0">
                <Radio className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="live" size="sm" dot pulse>
                    LIVE NOW
                  </Badge>
                  <Badge variant="primary" size="sm">
                    {liveLecture.courseCode}
                  </Badge>
                  <span className="text-xs font-semibold text-rose-900 font-mono">
                    Room: {liveLecture.meetingId}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base md:text-lg text-rose-950">
                  {liveLecture.title}
                </h4>
                <p className="text-xs text-rose-800">
                  Lecturer: <span className="font-medium">{liveLecture.lecturer}</span> • Started at{' '}
                  <span className="font-medium">{liveLecture.startTime}</span> ({liveLecture.duration})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="danger"
                size="md"
                onClick={() => navigate(`/meeting/${liveLecture.meetingId}`)}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full md:w-auto shadow-md"
              >
                Join Virtual Classroom
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-[#faf9f4] border border-[#e0e0d6] rounded-3xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#555544]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#eaeae0] text-[#5A5A40] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-[#2d2d2d] block sm:inline mr-2">
                  No Live Class In Session
                </span>
                <span className="text-[#7a7a6e]">
                  All active virtual classroom rooms are currently on standby.
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/lectures')}
              icon={Calendar}
            >
              Lecture Schedule
            </Button>
          </div>
        )}

        {/* Top Metric Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Registered Courses"
            value={`${registeredCourses.length} Courses`}
            subtitle={`${totalCreditUnits} Total Credit Units`}
            icon={BookOpen}
            variant="olive"
          />

          <StatCard
            title="Overall Attendance"
            value={`${overallAttendance}%`}
            subtitle="NBTE ≥75% Exam Threshold Met"
            icon={FileCheck}
            variant="clay"
            trend="+2.4% this month"
            trendPositive={true}
          />

          <StatCard
            title="Upcoming Lectures"
            value={`${upcomingLectures.length} Scheduled`}
            subtitle={`${completedLectures.length} Completed • ${liveLecture ? '1 Live' : '0 Live'}`}
            icon={Calendar}
            variant="neutral"
          />

          <StatCard
            title="Active Lecture Status"
            value={liveLecture ? '1 Session Live' : 'Standby Mode'}
            subtitle={liveLecture ? `${liveLecture.courseCode} broadcasting` : 'No lecture in progress'}
            icon={Radio}
            variant={liveLecture ? 'olive' : 'neutral'}
          />
        </div>

        {/* Main 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Lecture Schedule */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2d2d2d] flex items-center gap-2">
                  <span>Lecture Schedule & Timetable</span>
                  <Badge variant="primary" size="sm">
                    {displayedLectures.length} Sessions
                  </Badge>
                </h3>
                <p className="text-xs text-[#7a7a6e]">
                  Filter by status to find live broadcasts, upcoming classes, or archives
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#eaeae0] p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setLectureFilter('all')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    lectureFilter === 'all'
                      ? 'bg-[#5A5A40] text-white shadow-xs'
                      : 'text-[#555544] hover:text-[#2d2d2d]'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setLectureFilter('live-upcoming')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    lectureFilter === 'live-upcoming'
                      ? 'bg-[#5A5A40] text-white shadow-xs'
                      : 'text-[#555544] hover:text-[#2d2d2d]'
                  }`}
                >
                  Live & Upcoming
                </button>
                <button
                  type="button"
                  onClick={() => setLectureFilter('completed')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    lectureFilter === 'completed'
                      ? 'bg-[#5A5A40] text-white shadow-xs'
                      : 'text-[#555544] hover:text-[#2d2d2d]'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Lecture Cards List */}
            <div className="space-y-3">
              {displayedLectures.length > 0 ? (
                displayedLectures.slice(0, 4).map((lecture) => (
                  <LectureCard
                    key={lecture.id}
                    lecture={lecture}
                    role="student"
                    onJoin={() => navigate(`/meeting/${lecture.meetingId}`)}
                  />
                ))
              ) : (
                <div className="p-8 bg-[#fafaf6] border border-[#e8e8dc] rounded-2xl text-center space-y-2">
                  <p className="text-sm font-semibold text-[#2d2d2d]">No lectures found</p>
                  <p className="text-xs text-[#7a7a6e]">
                    There are no sessions matching the selected filter right now.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-1 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/student/lectures')}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                View Complete Lecture Timetable ({MOCK_LECTURES.length} Total)
              </Button>
            </div>
          </div>

          {/* Right Column (5 cols): Attendance Breakdown & Recent Notifications */}
          <div className="lg:col-span-5 space-y-6">
            {/* Attendance Compliance Overview Card */}
            <Card>
              <CardHeader className="mb-3">
                <div>
                  <CardTitle>Attendance Compliance</CardTitle>
                  <p className="text-xs text-[#7a7a6e]">NBTE 75% Examination Threshold</p>
                </div>
                <Badge variant="success" size="sm">
                  Exam Eligible
                </Badge>
              </CardHeader>

              <div className="space-y-3">
                {Array.isArray(MOCK_ATTENDANCE) &&
                  MOCK_ATTENDANCE.slice(0, 4).map((item) => {
                    const isPassing = (item.percentage || 0) >= 75;
                    return (
                      <div key={item.courseCode} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <div>
                            <span className="font-bold text-[#2d2d2d] mr-1.5">
                              {item.courseCode}
                            </span>
                            <span className="text-[11px] text-[#7a7a6e] hidden sm:inline">
                              {item.courseTitle?.slice(0, 24)}...
                            </span>
                          </div>
                          <span
                            className={`font-bold ${
                              isPassing ? 'text-[#5A5A40]' : 'text-rose-600'
                            }`}
                          >
                            {item.percentage}% ({item.attended}/{item.totalLectures || 14})
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#eaeae0] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.percentage >= 80
                                ? 'bg-[#5A5A40]'
                                : item.percentage >= 75
                                ? 'bg-[#A67C52]'
                                : 'bg-rose-600'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="mt-4 pt-3 border-t border-[#ecece2] flex items-center justify-between">
                <span className="text-xs text-[#7a7a6e]">Average: {overallAttendance}%</span>
                <button
                  type="button"
                  onClick={() => navigate('/student/attendance')}
                  className="text-xs font-bold text-[#5A5A40] hover:underline flex items-center gap-1"
                >
                  Full Attendance Register <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </Card>

            {/* Recent Notifications Widget */}
            <Card>
              <CardHeader className="mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#5A5A40] text-white flex items-center justify-center">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <CardTitle>Recent Notifications</CardTitle>
                    <p className="text-xs text-[#7a7a6e]">Directives & academic alerts</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/student/notifications')}
                  className="text-xs px-2"
                >
                  View All
                </Button>
              </CardHeader>

              <div className="space-y-2.5">
                {recentNotifications.map((notif) => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    className="p-3"
                  />
                ))}
              </div>
            </Card>

            {/* Quick Course Material Notice */}
            {latestMaterial && (
              <Card className="bg-[#fcfaf5] border-[#e2d5c6]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#A67C52] text-white flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#A67C52] uppercase font-mono">
                        {latestMaterial.courseCode} • {latestMaterial.category}
                      </span>
                      <span className="text-[11px] text-[#8e8e7a]">{latestMaterial.size}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#2d2d2d] leading-tight">
                      {latestMaterial.title}
                    </h4>
                    <p className="text-xs text-[#7a7a6e] line-clamp-2">
                      {latestMaterial.description}
                    </p>
                    <Button
                      variant="clay"
                      size="sm"
                      onClick={() => navigate('/student/materials')}
                      className="mt-2 text-xs"
                      icon={Download}
                    >
                      Access Course Materials
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Current Enrolled Courses Section */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2d2d2d] flex items-center gap-2">
                <span>My Registered Courses</span>
                <Badge variant="primary" size="sm">
                  {registeredCourses.length} Enrolled
                </Badge>
              </h3>
              <p className="text-xs text-[#7a7a6e]">
                National Diploma II (ND2) • Second Semester Syllabus & Courseware
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/courses')}
              icon={ArrowRight}
              iconPosition="right"
            >
              All Course Outlines
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {registeredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                role="student"
                onView={() => navigate(`/student/courses/${course.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

