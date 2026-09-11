import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import {
  BookOpen,
  Calendar,
  Clock,
  Download,
  Video,
  FileText,
  ArrowLeft,
  Mail,
  CheckCircle2,
  Radio,
  ChevronRight,
  Sparkles,
  Layers,
  CheckCircle,
  Clock4,
  CircleDot,
  FileCode,
  FileCheck,
  Award,
  AlertCircle,
  ExternalLink,
  Share2,
  FolderDown,
  Loader2
} from 'lucide-react';
import { MOCK_COURSES } from '../../data/mockData';
import { useLectures } from '../../context/LectureContext';
import { useAuth } from '../../context/AuthContext';
import { fetchCourseById, fetchMaterialsByCourse, downloadMaterial, fetchStudentAttendanceStats } from '../../services/api';

export default function StudentCourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { lectures } = useLectures();

  const [courseData, setCourseData] = useState(null);
  const [courseMaterials, setCourseMaterials] = useState([]);
  const [attendanceRecord, setAttendanceRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  // States
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeMaterialFilter, setActiveMaterialFilter] = useState('All');
  const [downloadFeedback, setDownloadFeedback] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);
  const [reviewedModules, setReviewedModules] = useState({});

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const resolvedId = courseId || 'COM 221';
        const [cData, mData, statsData] = await Promise.all([
          fetchCourseById(resolvedId).catch(() => MOCK_COURSES.find((c) => c.id === resolvedId || c.code === resolvedId) || MOCK_COURSES[0]),
          fetchMaterialsByCourse(resolvedId).catch(() => []),
          currentUser?.id ? fetchStudentAttendanceStats(currentUser.id).catch(() => null) : Promise.resolve(null),
        ]);
        setCourseData(cData);
        setCourseMaterials(mData || []);

        if (statsData?.courses && cData) {
          const match = statsData.courses.find(
            (item) =>
              (item.courseId && String(item.courseId) === String(cData._id || cData.id)) ||
              (item.courseCode && item.courseCode === cData.code)
          );
          if (match) {
            setAttendanceRecord(match);
          }
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseId, currentUser?.id]);

  const course = courseData || MOCK_COURSES[0];
  const courseLectures = lectures.filter((l) => l.courseCode === course.code || l.courseId === course._id || l.courseId === course.id);

  // Material filters
  const materialCategories = ['All', 'Lecture Notes', 'Lab Manual', 'Handout', 'Reference Guide'];
  const filteredMaterials = activeMaterialFilter === 'All'
    ? courseMaterials
    : courseMaterials.filter((m) => m.category?.toLowerCase() === activeMaterialFilter.toLowerCase());

  // Trigger prototype download
  const handleDownload = (title, size = '2.5 MB') => {
    setDownloadFeedback(`Downloading "${title}" (${size})...`);
    setTimeout(() => {
      setDownloadFeedback('');
    }, 3500);
  };

  // Toggle reviewed status for module
  const toggleReviewed = (moduleNumber) => {
    setReviewedModules((prev) => ({
      ...prev,
      [moduleNumber]: !prev[moduleNumber]
    }));
  };

  // Calculate syllabus stats safely
  const syllabusList = Array.isArray(course?.syllabus) ? course.syllabus : [];
  const totalModules = syllabusList.length;
  const completedCount = syllabusList.filter(
    (s) => s.status === 'Completed' || (s.moduleNumber && reviewedModules[s.moduleNumber])
  ).length;
  const progressPercent = totalModules > 0
    ? Math.round((completedCount / totalModules) * 100)
    : (typeof course?.progress === 'number' && !isNaN(course.progress) ? course.progress : 0);

  // Calculate attendance percentage safely from attendanceRecord or course object
  const attendancePercentageValue = (() => {
    if (attendanceRecord) {
      if (typeof attendanceRecord.percentage === 'number' && !isNaN(attendanceRecord.percentage)) {
        return attendanceRecord.percentage;
      }
      if (
        typeof attendanceRecord.attended === 'number' &&
        typeof attendanceRecord.totalLectures === 'number' &&
        attendanceRecord.totalLectures > 0
      ) {
        return Math.round((attendanceRecord.attended / attendanceRecord.totalLectures) * 1000) / 10;
      }
    }
    if (course) {
      if (typeof course.attendanceRate === 'number' && !isNaN(course.attendanceRate)) {
        return course.attendanceRate;
      }
      if (
        typeof course.attendedLectures === 'number' &&
        typeof course.totalLectures === 'number' &&
        course.totalLectures > 0
      ) {
        return Math.round((course.attendedLectures / course.totalLectures) * 1000) / 10;
      }
    }
    return null;
  })();

  const formattedAttendance = attendancePercentageValue !== null
    ? `${typeof attendancePercentageValue === 'number' ? Number(attendancePercentageValue.toFixed(1)).toString() : attendancePercentageValue}%`
    : 'No attendance data';

  const attendanceProgressWidth = attendancePercentageValue !== null
    ? Math.min(100, Math.max(0, attendancePercentageValue))
    : 0;

  const attendanceEligibilityText = attendancePercentageValue !== null
    ? (attendancePercentageValue >= 75 ? 'Eligible for Exam' : attendancePercentageValue > 0 ? 'Attendance Warning' : '0% Recorded')
    : 'No attendance data';

  // Calculate course materials count safely
  const materialsTotalCount = courseMaterials.length > 0
    ? courseMaterials.length
    : (typeof course?.materialsCount === 'number' && !isNaN(course.materialsCount) ? course.materialsCount : 0);

  // Handle contact form submission
  const handleSendMessage = (e) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactModalOpen(false);
      setContactSubject('');
      setContactMessage('');
    }, 2000);
  };

  return (
    <DashboardLayout title={`${course.code} - Course Details`}>
      <div className="space-y-6">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/student/courses')}
            icon={ArrowLeft}
          >
            Back to Courses
          </Button>

          <div className="flex items-center gap-2 text-xs text-[#7a7a6e]">
            <span>Courses</span>
            <span>/</span>
            <span className="font-semibold text-[#2d2d2d]">{course.code}</span>
          </div>
        </div>

        {/* Feedback notification toast if downloading */}
        {downloadFeedback && (
          <div className="p-3.5 rounded-2xl bg-[#ebf4ec] border border-[#cbe3cf] text-[#2e6b36] text-xs font-medium flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{downloadFeedback}</span>
            </div>
            <span className="text-[11px] text-emerald-700">Prototype file ready</span>
          </div>
        )}

        {/* Hero Course Header */}
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="olive" size="md">
                  {course.code}
                </Badge>
                <Badge variant="clay" size="md">
                  {course.creditUnit} Credit Units
                </Badge>
                <Badge variant="primary" size="md">
                  {course.department}
                </Badge>
                <Badge variant="neutral" size="md">
                  {course.semester || 'ND II 2nd Semester'}
                </Badge>
                {course.nextLecture?.status === 'Live Now' && (
                  <Badge variant="live" size="md" dot pulse>
                    Live Lecture Active
                  </Badge>
                )}
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#2d2d2d] tracking-tight">
                  {course.title}
                </h1>
                <p className="text-xs md:text-sm text-[#666655] leading-relaxed mt-2">
                  {course.description}
                </p>
              </div>

              {/* Course Progress & Attendance Mini Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-[#fafaf6] border border-[#ecece2]">
                  <span className="text-[11px] text-[#8e8e7a] font-medium block">Syllabus Completion</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold text-[#2d2d2d]">{progressPercent}%</span>
                    <span className="text-xs text-[#7a7a6e]">
                      {totalModules > 0 ? `(${completedCount}/${totalModules} Modules)` : `(${completedCount} Modules)`}
                    </span>
                  </div>
                  <div className="w-full bg-[#e8e8dc] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#5A5A40] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#fafaf6] border border-[#ecece2]">
                  <span className="text-[11px] text-[#8e8e7a] font-medium block">Course Attendance</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold text-[#2d2d2d]">
                      {formattedAttendance}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        attendancePercentageValue !== null && attendancePercentageValue >= 75
                          ? 'text-emerald-700'
                          : attendancePercentageValue !== null && attendancePercentageValue > 0
                          ? 'text-amber-700'
                          : 'text-[#8e8e7a]'
                      }`}
                    >
                      {attendanceEligibilityText}
                    </span>
                  </div>
                  <div className="w-full bg-[#e8e8dc] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        attendancePercentageValue !== null && attendancePercentageValue >= 75
                          ? 'bg-emerald-600'
                          : attendancePercentageValue !== null && attendancePercentageValue > 0
                          ? 'bg-amber-600'
                          : 'bg-[#ccc]'
                      }`}
                      style={{
                        width: `${attendanceProgressWidth}%`
                      }}
                    />
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-[#fafaf6] border border-[#ecece2]">
                  <span className="text-[11px] text-[#8e8e7a] font-medium block">Course Materials</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold text-[#2d2d2d]">{materialsTotalCount}</span>
                    <span className="text-xs text-[#7a7a6e]">
                      {materialsTotalCount === 1 ? 'Handout / Lab' : 'Handouts & Labs'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A67C52] font-medium mt-1">
                    {materialsTotalCount > 0 ? 'Ready for download' : 'No materials uploaded'}
                  </p>
                </div>
              </div>
            </div>

            {/* Course Action & Lecturer CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:w-56">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/meeting/room-com221-live')}
                icon={Radio}
                className="w-full justify-center"
              >
                Join Virtual Class
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => setContactModalOpen(true)}
                icon={Mail}
                className="w-full justify-center"
              >
                Contact Lecturer
              </Button>
              <Button
                variant="neutral"
                size="sm"
                onClick={() => handleDownload(`${course.code}_Full_Courseware_Pack.zip`, '18.4 MB')}
                icon={FolderDown}
                className="w-full justify-center"
              >
                Download All Notes
              </Button>
            </div>
          </div>
        </div>

        {/* 2-Column Main Layout: Syllabus & Materials on Left, Lecturer & Schedule on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 Columns: Interactive Syllabus & Repository */}
          <div className="lg:col-span-8 space-y-6">
            {/* Syllabus Section */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#5A5A40]" />
                      Course Syllabus & Learning Modules
                    </CardTitle>
                    <p className="text-xs text-[#7a7a6e] mt-0.5">
                      Standard National Board for Technical Education (NBTE) ND2 Curriculum
                    </p>
                  </div>
                  <Badge variant="olive" size="sm">
                    {completedCount} / {totalModules} Modules Complete
                  </Badge>
                </div>
              </CardHeader>

              <p className="text-xs text-[#8e8e7a] -mt-2 mb-4">
                Click any module card below to view detailed learning objectives, linked lectures, and recommended study notes.
              </p>

              {/* Module List with Interactive Cards */}
              <div className="space-y-3">
                {course.syllabus && course.syllabus.length > 0 ? (
                  course.syllabus.map((item, idx) => {
                    const modNum = item.moduleNumber || idx + 1;
                    const isReviewed = reviewedModules[modNum];
                    const isCompleted = item.status === 'Completed' || isReviewed;
                    const isCurrent = item.status === 'Current' || item.status === 'In Progress';
                    const isUpcoming = item.status === 'Upcoming' && !isReviewed;

                    return (
                      <div
                        key={idx}
                        id={`module-card-${modNum}`}
                        onClick={() => setSelectedModule(item)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedModule(item)}
                        className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                          isCurrent
                            ? 'bg-[#fdfcf9] border-[#5A5A40] shadow-xs ring-1 ring-[#5A5A40]/20'
                            : isCompleted
                            ? 'bg-[#fafaf6] border-[#e2e2d5] hover:border-[#5A5A40] hover:bg-[#f6f6ef]'
                            : 'bg-[#fafaf7] border-[#e8e8dc] hover:border-[#c4c4b2] hover:bg-[#f4f4ec]'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Module Number Badge */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-bold transition-transform group-hover:scale-105 ${
                              isCurrent
                                ? 'bg-[#5A5A40] text-white shadow-xs'
                                : isCompleted
                                ? 'bg-[#ebf4ec] text-[#2e6b36] border border-[#cbe3cf]'
                                : 'bg-[#e8e8dc] text-[#555544]'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              String(modNum).padStart(2, '0')
                            )}
                          </div>

                          {/* Module Information */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#8e8e7a]">
                                  Module {modNum}
                                </span>
                                {isCurrent && (
                                  <Badge variant="live" size="sm" dot pulse>
                                    Current Topic
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    isCompleted
                                      ? 'success'
                                      : isCurrent
                                      ? 'olive'
                                      : 'neutral'
                                  }
                                  size="sm"
                                >
                                  {isCompleted ? 'Completed' : isCurrent ? 'Current / In-Progress' : 'Upcoming'}
                                </Badge>
                              </div>
                            </div>

                            <h4 className="text-sm font-bold text-[#2d2d2d] group-hover:text-[#5A5A40] transition-colors mt-1">
                              {item.title}
                            </h4>

                            <p className="text-xs text-[#666655] line-clamp-2 mt-1 leading-relaxed">
                              {item.description}
                            </p>

                            {/* Footer row with objectives summary and click hint */}
                            <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#ecece2]/70 text-[11px]">
                              <span className="text-[#8e8e7a] flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-[#A67C52]" />
                                {item.learningObjectives
                                  ? `${item.learningObjectives.length} Learning Objectives`
                                  : '3 Core Learning Objectives'}
                              </span>

                              <span className="text-[#5A5A40] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                Inspect Module <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[#8e8e7a] p-4 text-center">No syllabus modules defined for this course.</p>
                )}
              </div>
            </Card>

            {/* Courseware & Downloadable Materials */}
            <Card id="course-materials-section">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#A67C52]" />
                      Downloadable Courseware & Lab Manuals
                    </CardTitle>
                    <p className="text-xs text-[#7a7a6e] mt-0.5">
                      Official lecture slides, lab manuals, and past ND2 exam solutions
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(`${course.code}_Complete_Repository.zip`, '24.2 MB')}
                    icon={Download}
                  >
                    Batch Download
                  </Button>
                </div>
              </CardHeader>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 mb-4 pb-2 border-b border-[#ecece2]">
                {materialCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveMaterialFilter(cat)}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                      activeMaterialFilter === cat
                        ? 'bg-[#5A5A40] text-white shadow-xs'
                        : 'bg-[#f4f4ec] text-[#666655] hover:bg-[#eaeae0]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Materials List */}
              <div className="space-y-3">
                {filteredMaterials.length > 0 ? (
                  filteredMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      id={`material-${mat.id}`}
                      className="p-3.5 rounded-2xl bg-[#fafaf6] border border-[#e8e8dc] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#f5f5ec] transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-[#f4ebe1] text-[#A67C52] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 font-mono font-bold text-xs">
                          {mat.format || 'PDF'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs md:text-sm font-bold text-[#2d2d2d] truncate">
                              {mat.title}
                            </h5>
                            <Badge variant="neutral" size="sm">
                              {mat.category || 'Lecture Notes'}
                            </Badge>
                          </div>
                          <p className="text-xs text-[#666655] line-clamp-1 mt-0.5">
                            {mat.description}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-[#8e8e7a] mt-1">
                            <span>{mat.size || '3.2 MB'}</span>
                            <span>•</span>
                            <span>Uploaded {mat.uploadedDate || '2026-08-01'}</span>
                            <span>•</span>
                            <span>{mat.downloads || 140} downloads</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(mat.title, mat.size)}
                          icon={Download}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-[#fafaf6] rounded-2xl border border-dashed border-[#deded0]">
                    <FileText className="w-8 h-8 text-[#8e8e7a] mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-semibold text-[#555544]">No materials found in this category.</p>
                    <p className="text-[11px] text-[#8e8e7a] mt-0.5">
                      Try selecting "All" to view all course resources.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right 4 Columns: Assigned Lecturer, Weekly Schedule, & Attendance Compliance */}
          <div className="lg:col-span-4 space-y-6">
            {/* Lecturer Card */}
            <Card id="lecturer-card">
              <CardHeader className="mb-2">
                <CardTitle>Course Lecturer</CardTitle>
              </CardHeader>

              <div className="flex flex-col items-center text-center p-4 bg-[#f8f8f2] rounded-2xl border border-[#e8e8dc] mb-4">
                <Avatar
                  src={course.lecturerAvatar}
                  name={course.lecturer}
                  size="xl"
                  role="lecturer"
                  className="mb-3"
                />
                <h4 className="font-serif font-bold text-base text-[#2d2d2d]">{course.lecturer}</h4>
                <p className="text-xs text-[#7a7a6e]">{course.department}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Badge variant="clay" size="sm">
                    Course Director
                  </Badge>
                  <Badge variant="olive" size="sm">
                    Senior Faculty
                  </Badge>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-[#666655]">
                <div className="flex justify-between py-1.5 border-b border-[#ecece2]">
                  <span className="text-[#8e8e7a]">Office Location:</span>
                  <span className="font-medium text-[#2d2d2d]">Faculty Wing Room 204</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#ecece2]">
                  <span className="text-[#8e8e7a]">Consultation:</span>
                  <span className="font-medium text-[#2d2d2d]">Tues & Thurs (2pm - 4pm)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#ecece2]">
                  <span className="text-[#8e8e7a]">Institutional Email:</span>
                  <span className="font-medium text-[#2d2d2d] truncate max-w-[160px]">
                    {course.lecturerEmail || `${course.lecturerId || 'faculty'}@polytechnic.edu.ng`}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setContactModalOpen(true)}
                  icon={Mail}
                  className="w-full justify-center"
                >
                  Send Consultation Message
                </Button>
              </div>
            </Card>

            {/* Weekly Lecture Timetable */}
            <Card id="lecture-schedule-card">
              <CardHeader className="mb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#5A5A40]" />
                    Scheduled Sessions ({courseLectures.length})
                  </CardTitle>
                </div>
              </CardHeader>

              <div className="space-y-2.5">
                {courseLectures.length > 0 ? (
                  courseLectures.map((lec) => (
                    <div key={lec.id} className="p-3 rounded-2xl bg-[#fafaf6] border border-[#e8e8dc] flex items-center justify-between text-xs gap-2">
                      <div className="min-w-0">
                        <span className="font-bold text-[#2d2d2d] block truncate">{lec.title}</span>
                        <span className="text-[11px] text-[#8e8e7a] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 shrink-0" /> {lec.dateFormatted || lec.date} ({lec.startTime} - {lec.endTime})
                        </span>
                      </div>
                      <Badge
                        variant={lec.status === 'Live Now' ? 'live' : lec.status === 'Completed' ? 'neutral' : 'clay'}
                        size="sm"
                        className="shrink-0"
                      >
                        {lec.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-2xl bg-[#fafaf6] border border-[#e8e8dc] text-xs text-[#8e8e7a] text-center">
                    No active sessions scheduled.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#ecece2]">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const activeLec = courseLectures.find(l => l.status === 'Live Now') || courseLectures[0];
                    navigate(`/meeting/${activeLec?.meetingId || 'room-com221-live'}`);
                  }}
                  icon={Video}
                  className="w-full justify-center"
                >
                  Enter Virtual Classroom
                </Button>
              </div>
            </Card>

            {/* NBTE Attendance Compliance Notice */}
            <Card id="attendance-notice-card" className="bg-[#fafaf7]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#ebf4ec] text-[#2e6b36] flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2d2d2d]">NBTE Examination Eligibility</h4>
                  <p className="text-[11px] text-[#666655] leading-relaxed mt-1">
                    National Board for Technical Education requires a minimum of <strong className="text-[#2d2d2d]">75% attendance</strong> in all registered courses to sit for the 2nd semester examinations.
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-[#e8e8dc] flex items-center justify-between text-[11px]">
                    <span className="text-[#7a7a6e]">Your Standing:</span>
                    <span
                      className={`font-bold ${
                        attendancePercentageValue !== null && attendancePercentageValue >= 75
                          ? 'text-emerald-700'
                          : attendancePercentageValue !== null && attendancePercentageValue > 0
                          ? 'text-amber-700'
                          : 'text-[#8e8e7a]'
                      }`}
                    >
                      {attendancePercentageValue !== null
                        ? `${formattedAttendance} Compliant`
                        : 'No attendance data'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE MODULE DETAIL MODAL */}
        {/* ========================================================================= */}
        {selectedModule && (
          <Modal
            isOpen={!!selectedModule}
            onClose={() => setSelectedModule(null)}
            title={`Module ${selectedModule.moduleNumber || 1}: ${selectedModule.title}`}
            subtitle={`${course.code} • ${course.title}`}
            maxWidth="max-w-2xl"
          >
            <div className="space-y-5">
              {/* Status Header Banner */}
              <div className="p-4 rounded-2xl bg-[#fafaf6] border border-[#e8e8dc] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-mono uppercase text-[#8e8e7a] font-semibold block">
                    Curriculum Status
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        selectedModule.status === 'Completed' || reviewedModules[selectedModule.moduleNumber]
                          ? 'success'
                          : selectedModule.status === 'Current' || selectedModule.status === 'In Progress'
                          ? 'olive'
                          : 'neutral'
                      }
                      size="md"
                    >
                      {selectedModule.status === 'Completed' || reviewedModules[selectedModule.moduleNumber]
                        ? 'Completed'
                        : selectedModule.status === 'Current' || selectedModule.status === 'In Progress'
                        ? 'Current / In-Progress'
                        : 'Upcoming Module'}
                    </Badge>
                    <span className="text-xs text-[#7a7a6e]">ND II 2nd Semester</span>
                  </div>
                </div>

                <Button
                  variant={reviewedModules[selectedModule.moduleNumber] ? 'neutral' : 'outline'}
                  size="sm"
                  onClick={() => toggleReviewed(selectedModule.moduleNumber)}
                  icon={CheckCircle2}
                >
                  {reviewedModules[selectedModule.moduleNumber] ? 'Marked as Reviewed' : 'Mark as Reviewed'}
                </Button>
              </div>

              {/* Module Description */}
              <div>
                <h4 className="text-xs font-bold text-[#2d2d2d] uppercase tracking-wider mb-1.5">
                  Module Overview & Scope
                </h4>
                <p className="text-xs md:text-sm text-[#555544] leading-relaxed bg-[#fdfcf9] p-3.5 rounded-2xl border border-[#ecece2]">
                  {selectedModule.description}
                </p>
              </div>

              {/* Learning Objectives */}
              <div>
                <h4 className="text-xs font-bold text-[#2d2d2d] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#5A5A40]" />
                  Key Learning Objectives
                </h4>
                <div className="space-y-2">
                  {(selectedModule.learningObjectives && selectedModule.learningObjectives.length > 0
                    ? selectedModule.learningObjectives
                    : [
                        'Understand theoretical and practical foundations of the data abstraction model',
                        'Analyze algorithmic complexity bounds and memory layout considerations',
                        'Implement real-world polytechnic laboratory exercises adhering to standards'
                      ]
                  ).map((obj, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-[#fafaf6] border border-[#e8e8dc] flex items-start gap-2.5 text-xs text-[#444433]"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#5A5A40] text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        {i + 1}
                      </div>
                      <span className="leading-relaxed">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Virtual Lecture */}
              <div>
                <h4 className="text-xs font-bold text-[#2d2d2d] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#A67C52]" />
                  Associated Virtual Lecture
                </h4>
                <div className="p-3.5 rounded-2xl bg-[#fdfcf9] border border-[#e8e8dc] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-[#2d2d2d]">
                      {selectedModule.relatedLecture || `Module ${selectedModule.moduleNumber}: Lecture & Lab Session`}
                    </h5>
                    <p className="text-[11px] text-[#7a7a6e] mt-0.5">
                      Lecturer: {course.lecturer} • PolyLive Virtual Studio
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedModule(null);
                      navigate('/meeting/room-com221-live');
                    }}
                    icon={Radio}
                  >
                    Join Lecture Room
                  </Button>
                </div>
              </div>

              {/* Related Materials */}
              {selectedModule.materials && selectedModule.materials.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#2d2d2d] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#5A5A40]" />
                    Linked Study Notes & Code
                  </h4>
                  <div className="space-y-2">
                    {selectedModule.materials.map((matTitle, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#fafaf6] border border-[#e8e8dc] flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileCode className="w-4 h-4 text-[#A67C52] shrink-0" />
                          <span className="font-medium text-[#2d2d2d] truncate">{matTitle}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(matTitle, '3.2 MB')}
                          icon={Download}
                        >
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#ecece2]">
                <Button
                  variant="neutral"
                  size="sm"
                  onClick={() => setSelectedModule(null)}
                >
                  Close View
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    handleDownload(`Module_${selectedModule.moduleNumber}_Complete_Handout.pdf`, '4.8 MB');
                  }}
                  icon={Download}
                >
                  Download Module Packet
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* ========================================================================= */}
        {/* CONTACT LECTURER MODAL */}
        {/* ========================================================================= */}
        <Modal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          title={`Contact ${course.lecturer}`}
          subtitle={`${course.code} Course Consultation`}
          maxWidth="max-w-lg"
        >
          {contactSent ? (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ebf4ec] text-[#2e6b36] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-[#2d2d2d]">Message Dispatched</h4>
              <p className="text-xs text-[#666655]">
                Your consultation request has been routed to {course.lecturer} ({course.lecturerEmail || 'faculty@polytechnic.edu.ng'}). You will receive a copy in your student webmail.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2d2d2d] mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Question on Module 4 Binary Search Tree Rotations"
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded0] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40] bg-[#fafaf7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2d2d2d] mb-1">Message Body</label>
                <textarea
                  required
                  rows={4}
                  placeholder="State your question or request for consultation..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#deded0] text-xs focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40] bg-[#fafaf7]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#fafaf6] border border-[#e8e8dc] text-[11px] text-[#7a7a6e]">
                Consultation replies are sent to your official matric email (ND2/CS/2024/0142@polytechnic.edu.ng).
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#ecece2]">
                <Button
                  type="button"
                  variant="neutral"
                  size="sm"
                  onClick={() => setContactModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={Mail}
                >
                  Send Consultation
                </Button>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
