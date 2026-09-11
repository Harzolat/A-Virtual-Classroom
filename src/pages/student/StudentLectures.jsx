import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LectureCard from '../../components/common/LectureCard';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import {
  Search,
  Calendar,
  Clock,
  Filter,
  Video,
  Mic,
  Users,
  Radio,
  ArrowRight,
  Bell,
  Check,
  Download,
  FileText,
  BookOpen,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  X,
  Info
} from 'lucide-react';
import { MOCK_COURSES } from '../../data/mockData';
import { useLectures } from '../../context/LectureContext';
import { useAuth } from '../../context/AuthContext';
import { fetchMaterials, fetchStudentAttendanceStats, joinSession } from '../../services/api';

export default function StudentLectures() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { lectures } = useLectures();
  const [materials, setMaterials] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinLecture = async (lecture) => {
    if (!lecture) return;
    const identifier = lecture.id || lecture._id || lecture.meetingId || 'room-com221-live';
    setIsJoining(true);
    try {
      await joinSession('lecture', identifier);
      navigate(`/meeting/${lecture.meetingId || identifier}`);
    } catch (err) {
      showToast(err.message || 'Could not join lecture session');
      // If live now, allow entry
      if (lecture.status === 'Live Now') {
        navigate(`/meeting/${lecture.meetingId || identifier}`);
      }
    } finally {
      setIsJoining(false);
    }
  };

  useEffect(() => {
    fetchMaterials()
      .then((data) => setMaterials(data || []))
      .catch((err) => console.error('Failed to load materials in StudentLectures:', err));

    if (currentUser?.id) {
      fetchStudentAttendanceStats(currentUser.id)
        .then((stats) => setAttendanceStats(stats))
        .catch((err) => console.error('Failed to load attendance stats in StudentLectures:', err));
    }
  }, [currentUser?.id]);

  // Filter States
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'live', 'upcoming', 'past'
  const [courseFilter, setCourseFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive UI States
  const [remindedIds, setRemindedIds] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);

  // Auto-dismiss toast notification
  const showToast = (message) => {
    setToastNotification(message);
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  // Derive active Live Lecture if one exists
  const liveLecture = useMemo(() => {
    return lectures.find((lec) => lec.status === 'Live Now') || null;
  }, [lectures]);

  // Dynamically derive course filter options from MOCK_COURSES and lectures
  const courseOptions = useMemo(() => {
    const courseMap = new Map();
    MOCK_COURSES.forEach((c) => {
      if (c.code) {
        courseMap.set(c.code, `${c.code} - ${c.title || 'Course'}`);
      }
    });
    lectures.forEach((l) => {
      if (l.courseCode && !courseMap.has(l.courseCode)) {
        courseMap.set(l.courseCode, `${l.courseCode} - ${l.courseTitle || 'Course'}`);
      }
    });

    const options = [{ value: 'all', label: 'All Courses' }];
    courseMap.forEach((label, value) => {
      options.push({ value, label });
    });
    return options;
  }, [lectures]);

  // Filter lectures using all combined conditions
  const filteredLectures = useMemo(() => {
    return lectures.filter((lec) => {
      // 1. Search filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        (lec.title && lec.title.toLowerCase().includes(query)) ||
        (lec.courseCode && lec.courseCode.toLowerCase().includes(query)) ||
        (lec.courseTitle && lec.courseTitle.toLowerCase().includes(query)) ||
        (lec.lecturer && lec.lecturer.toLowerCase().includes(query)) ||
        (lec.description && lec.description.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // 2. Status tab filter
      if (filterTab === 'live' && lec.status !== 'Live Now') return false;
      if (filterTab === 'upcoming' && lec.status !== 'Scheduled') return false;
      if (filterTab === 'past' && lec.status !== 'Completed') return false;

      // 3. Course filter
      if (courseFilter !== 'all') {
        if (lec.courseCode !== courseFilter && lec.courseId !== courseFilter) {
          return false;
        }
      }

      // 4. Date filter
      if (dateFilter === 'today') {
        const isToday =
          lec.date === '2026-08-12' ||
          (lec.dateFormatted && lec.dateFormatted.toLowerCase().includes('today'));
        if (!isToday) return false;
      } else if (dateFilter === 'upcoming') {
        const isUpcoming =
          lec.status === 'Scheduled' ||
          (lec.date >= '2026-08-12' && lec.status !== 'Completed');
        if (!isUpcoming) return false;
      } else if (dateFilter === 'past') {
        const isPast = lec.status === 'Completed' || lec.date < '2026-08-12';
        if (!isPast) return false;
      }

      return true;
    });
  }, [searchQuery, filterTab, courseFilter, dateFilter, lectures]);

  // Handle Toggle Reminder
  const handleToggleReminder = (lecture) => {
    const lectureId = lecture.id;
    const isAlreadyReminded = remindedIds.includes(lectureId);

    if (isAlreadyReminded) {
      setRemindedIds((prev) => prev.filter((id) => id !== lectureId));
      showToast(`Reminder removed for ${lecture.courseCode} (${lecture.title})`);
    } else {
      setRemindedIds((prev) => [...prev, lectureId]);
      showToast(`Reminder set for ${lecture.courseCode} (${lecture.dateFormatted || lecture.date} at ${lecture.startTime})`);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilterTab('all');
    setCourseFilter('all');
    setDateFilter('all');
    setSearchQuery('');
  };

  // Counts for tabs
  const tabCounts = useMemo(() => {
    return {
      all: lectures.length,
      live: lectures.filter((l) => l.status === 'Live Now').length,
      upcoming: lectures.filter((l) => l.status === 'Scheduled').length,
      past: lectures.filter((l) => l.status === 'Completed').length
    };
  }, [lectures]);

  // Derive materials related to selected lecture modal
  const selectedLectureMaterials = useMemo(() => {
    if (!selectedLecture) return [];
    const courseCode = selectedLecture.courseCode;
    const courseId = selectedLecture.courseId || selectedLecture.course?._id;

    return materials.filter(
      (m) => (m.course?.code || m.courseCode) === courseCode || (m.course?._id || m.courseId) === courseId
    );
  }, [selectedLecture, materials]);

  // Derive attendance record related to selected lecture course from live stats
  const selectedLectureAttendance = useMemo(() => {
    if (!selectedLecture || !attendanceStats?.courses) return null;
    const lectureCourseCode = selectedLecture.courseCode || selectedLecture.course?.code;
    const lectureCourseId = selectedLecture.courseId || selectedLecture.course?._id || selectedLecture.course;
    return (
      attendanceStats.courses.find(
        (a) =>
          (lectureCourseCode && a.courseCode === lectureCourseCode) ||
          (lectureCourseId && (a.courseId === String(lectureCourseId) || a.courseId === lectureCourseId))
      ) || null
    );
  }, [selectedLecture, attendanceStats]);

  return (
    <DashboardLayout title="Lecture Schedule">
      {/* Toast Notification Popup */}
      {toastNotification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-[#2d2d2d] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-xl border border-[#444] flex items-center gap-2.5 max-w-md">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastNotification}</span>
            <button
              onClick={() => setToastNotification(null)}
              className="ml-auto text-[#aaa] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header banner */}
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge variant="primary" size="sm">
                ND2 Computer Science
              </Badge>
              <span className="text-[11px] font-semibold text-[#8e8e7a] uppercase tracking-wider">
                2025/2026 Academic Session • 2nd Semester
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Lecture Schedule
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1 max-w-2xl leading-relaxed">
              Interactive virtual classroom schedule, live stream broadcasts, practical lab sessions, and recorded lecture archives for ND2 Computer Science students.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#f5f5f0] p-1.5 rounded-2xl border border-[#ecece2] shrink-0 self-start md:self-auto">
            <span className="text-xs font-bold text-[#5A5A40] px-3 py-1 bg-white rounded-xl shadow-xs border border-[#e0e0d6]">
              {filteredLectures.length} {filteredLectures.length === 1 ? 'Session' : 'Sessions'}
            </span>
          </div>
        </div>

        {/* PROMINENT LIVE LECTURE HERO SECTION */}
        {liveLecture && (
          <div className="relative overflow-hidden bg-gradient-to-r from-[#2c1d11] via-[#3a2818] to-[#2a1e18] text-white rounded-3xl p-6 md:p-7 shadow-lg border border-[#523d2b] transition-all hover:shadow-xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="live" size="md" dot pulse className="bg-rose-600 text-white border-rose-400 font-bold px-3">
                    LIVE NOW
                  </Badge>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-white/10 text-amber-200 border border-white/15">
                    {liveLecture.courseCode} — {liveLecture.courseTitle}
                  </span>
                  {liveLecture.roomPasscode && (
                    <span className="text-[11px] text-[#d4c5b9] bg-black/20 px-2 py-0.5 rounded-md font-mono">
                      Passkey: {liveLecture.roomPasscode}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-white leading-tight">
                    {liveLecture.title}
                  </h3>
                  <p className="text-xs text-[#d4c5b9] line-clamp-2 mt-1 leading-relaxed">
                    {liveLecture.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-xs text-[#ebdcd0] pt-1">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={liveLecture.lecturerAvatar}
                      name={liveLecture.lecturer}
                      size="xs"
                      role="lecturer"
                    />
                    <span className="font-semibold text-white">{liveLecture.lecturer}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-200 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{liveLecture.startTime} - {liveLecture.endTime} ({liveLecture.duration})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    <span>{liveLecture.attendeesCount || 42} / {liveLecture.maxCapacity || 150} Students Joined</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 pt-2 lg:pt-0">
                <Button
                  variant="danger"
                  size="lg"
                  disabled={isJoining}
                  onClick={() => handleJoinLecture(liveLecture)}
                  icon={Radio}
                  className="animate-pulse shadow-xl bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-6 text-sm"
                >
                  {isJoining ? 'Connecting...' : 'Join Virtual Classroom'}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setSelectedLecture(liveLecture)}
                  icon={Info}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs"
                >
                  View Session Overview
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* FILTER BAR: Status Tabs, Course Dropdown, Date Dropdown, Search */}
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-2xl p-4 shadow-xs space-y-4">
          {/* Top Row: Status Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ecece2] pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'all'
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'bg-[#f5f5f0] text-[#555544] hover:bg-[#eaeae0]'
                }`}
              >
                All ({tabCounts.all})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('live')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  filterTab === 'live'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-[#f5f5f0] text-rose-800 hover:bg-rose-100/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Live Now ({tabCounts.live})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('upcoming')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'upcoming'
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'bg-[#f5f5f0] text-[#555544] hover:bg-[#eaeae0]'
                }`}
              >
                Upcoming ({tabCounts.upcoming})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('past')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'past'
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'bg-[#f5f5f0] text-[#555544] hover:bg-[#eaeae0]'
                }`}
              >
                Completed / Recordings ({tabCounts.past})
              </button>
            </div>

            {(courseFilter !== 'all' || dateFilter !== 'all' || searchQuery.trim() !== '' || filterTab !== 'all') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline flex items-center gap-1 ml-auto"
              >
                <X className="w-3.5 h-3.5" /> Reset Filters
              </button>
            )}
          </div>

          {/* Bottom Row: Course Select, Date Select, Search Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
            <div className="lg:col-span-4">
              <Select
                id="course-filter-select"
                label="Course"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                options={courseOptions}
                placeholder=""
                selectClassName="py-2 text-xs"
              />
            </div>

            <div className="lg:col-span-3">
              <Select
                id="date-filter-select"
                label="Date Range"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Dates' },
                  { value: 'today', label: 'Today (Aug 12)' },
                  { value: 'upcoming', label: 'Upcoming Dates' },
                  { value: 'past', label: 'Past / Previous Dates' }
                ]}
                placeholder=""
                selectClassName="py-2 text-xs"
              />
            </div>

            <div className="lg:col-span-5">
              <Input
                id="lecture-search-input"
                label="Search"
                placeholder="Search topic, course code, lecturer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                inputClassName="py-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* LECTURE LISTINGS */}
        <div className="space-y-4">
          {filteredLectures.length > 0 ? (
            filteredLectures.map((lecture) => (
              <LectureCard
                key={lecture.id}
                lecture={lecture}
                role="student"
                onJoin={(lec) => handleJoinLecture(lec || lecture)}
                onViewDetails={(lec) => setSelectedLecture(lec)}
                onToggleReminder={handleToggleReminder}
                isReminded={remindedIds.includes(lecture.id)}
              />
            ))
          ) : (
            <EmptyState
              title="No lectures found"
              description="No lectures match your selected course, date, or status filters. Try adjusting or resetting your filter criteria."
              icon={Calendar}
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>

      {/* LECTURE DETAILS MODAL */}
      {selectedLecture && (
        <Modal
          isOpen={Boolean(selectedLecture)}
          onClose={() => setSelectedLecture(null)}
          title={`${selectedLecture.courseCode} — Lecture Details`}
          subtitle={selectedLecture.courseTitle}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 text-[#2d2d2d]">
            {/* Topic & Status Header */}
            <div className="p-4 rounded-2xl bg-[#fafaf6] border border-[#ecece2] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="primary" size="sm">
                  {selectedLecture.courseCode}
                </Badge>

                <div className="flex items-center gap-2">
                  {selectedLecture.status === 'Live Now' ? (
                    <Badge variant="live" size="sm" dot pulse>
                      LIVE NOW
                    </Badge>
                  ) : selectedLecture.status === 'Completed' ? (
                    <Badge variant="neutral" size="sm">
                      Completed
                    </Badge>
                  ) : (
                    <Badge variant="clay" size="sm">
                      Scheduled
                    </Badge>
                  )}

                  <Badge variant="info" size="sm" className="gap-1">
                    {selectedLecture.type === 'Video' ? (
                      <>
                        <Video className="w-3 h-3" /> Video Lecture
                      </>
                    ) : selectedLecture.type === 'Voice' ? (
                      <>
                        <Mic className="w-3 h-3" /> Voice Session
                      </>
                    ) : (
                      <>
                        <Users className="w-3 h-3" /> Physical / Practical
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              <h3 className="font-serif text-xl font-bold text-[#2d2d2d] leading-snug pt-1">
                {selectedLecture.title}
              </h3>

              <p className="text-xs text-[#555544] leading-relaxed pt-1">
                {selectedLecture.description || 'No detailed abstract specified for this session.'}
              </p>

              {selectedLecture.courseId && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLecture(null);
                      navigate(`/student/courses/${selectedLecture.courseId}`);
                    }}
                    className="text-xs font-bold text-[#5A5A40] hover:text-[#2d2d2d] underline flex items-center gap-1"
                  >
                    View Full Course Syllabus & Curriculum <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Lecturer & Schedule Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Lecturer Info */}
              <div className="p-3.5 rounded-2xl border border-[#e0e0d6] bg-[#fdfcfb] space-y-2">
                <span className="text-[11px] font-bold text-[#8e8e7a] uppercase tracking-wider block">
                  Assigned Lecturer
                </span>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={selectedLecture.lecturerAvatar}
                    name={selectedLecture.lecturer || 'Lecturer'}
                    size="md"
                    role="lecturer"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-[#2d2d2d]">
                      {selectedLecture.lecturer || 'Faculty Member'}
                    </h5>
                    <p className="text-[11px] text-[#7a7a6e]">Department of Computer Science</p>
                  </div>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="p-3.5 rounded-2xl border border-[#e0e0d6] bg-[#fdfcfb] space-y-1.5">
                <span className="text-[11px] font-bold text-[#8e8e7a] uppercase tracking-wider block">
                  Session Timetable
                </span>
                <div className="text-xs space-y-1 text-[#444]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span className="font-medium">{selectedLecture.dateFormatted || selectedLecture.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>{selectedLecture.startTime} - {selectedLecture.endTime} ({selectedLecture.duration})</span>
                  </div>
                  {selectedLecture.roomPasscode && (
                    <div className="flex items-center gap-2 text-[11px] text-[#7a7a6e]">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Room Passcode: <strong className="font-mono text-[#2d2d2d]">{selectedLecture.roomPasscode}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Related Courseware Materials */}
            <div className="space-y-2.5">
              <h4 className="font-serif text-sm font-bold text-[#2d2d2d] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#5A5A40]" /> Related Course Materials ({selectedLectureMaterials.length})
              </h4>

              {selectedLectureMaterials.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedLectureMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-3 rounded-xl border border-[#ecece2] bg-[#fafaf6] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-[#efefe5] flex items-center justify-center text-[#5A5A40] shrink-0 font-bold text-[10px]">
                          {mat.format || 'PDF'}
                        </div>
                        <div className="truncate">
                          <h5 className="font-bold text-[#2d2d2d] truncate">{mat.title}</h5>
                          <p className="text-[11px] text-[#7a7a6e]">
                            {mat.category || 'Handout'} • {mat.size || '1.5 MB'} • Uploaded {mat.uploadedDate || 'Recent'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => showToast(`Downloading ${mat.title}...`)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-[#d8d8cc] hover:bg-[#efefe5] text-[#2d2d2d] font-semibold text-[11px] flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5 text-[#5A5A40]" /> Download
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#8e8e7a] italic p-3 rounded-xl bg-[#fafaf6] border border-[#ecece2]">
                  No specific downloadable attachments listed for this individual lecture. Access full courseware in the Course Details hub.
                </p>
              )}
            </div>

            {/* Attendance & Standing Information */}
            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#5c422a] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" /> Attendance Compliance
                </span>
                {selectedLectureAttendance && (
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Your Standing: {selectedLectureAttendance.percentage}% ({selectedLectureAttendance.status})
                  </span>
                )}
              </div>
              <p className="text-[#70563e] text-[11px] leading-relaxed pt-0.5">
                Attendance for virtual lectures is automatically logged upon joining the virtual classroom. NBTE regulation requires at least 75% attendance for semester examination eligibility.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#ecece2] flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedLecture(null)}
              >
                Close
              </Button>

              <div className="flex items-center gap-2">
                {selectedLecture.status !== 'Completed' && (
                  <Button
                    variant={remindedIds.includes(selectedLecture.id) ? 'secondary' : 'clay'}
                    size="md"
                    onClick={() => handleToggleReminder(selectedLecture)}
                    icon={remindedIds.includes(selectedLecture.id) ? Check : Bell}
                  >
                    {remindedIds.includes(selectedLecture.id) ? 'Reminder Set' : 'Add Reminder'}
                  </Button>
                )}

                {selectedLecture.status === 'Live Now' ? (
                  <Button
                    variant="danger"
                    size="md"
                    disabled={isJoining}
                    onClick={() => {
                      const lec = selectedLecture;
                      setSelectedLecture(null);
                      handleJoinLecture(lec);
                    }}
                    icon={Radio}
                    className="animate-pulse shadow-md"
                  >
                    {isJoining ? 'Connecting...' : 'Join Virtual Classroom'}
                  </Button>
                ) : selectedLecture.status === 'Scheduled' ? (
                  <Button
                    variant="primary"
                    size="md"
                    disabled={isJoining}
                    onClick={() => {
                      const lec = selectedLecture;
                      setSelectedLecture(null);
                      handleJoinLecture(lec);
                    }}
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Join Classroom
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
