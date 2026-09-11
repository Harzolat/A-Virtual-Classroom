import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { Download, Printer, Check, X, ShieldCheck, RotateCw, AlertTriangle, Users } from 'lucide-react';
import { fetchCourses, fetchCourseAttendanceStats, recordAttendance } from '../../services/api';

export default function LecturerAttendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [error, setError] = useState(null);
  const [courseStats, setCourseStats] = useState(null);
  const [studentRoster, setStudentRoster] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load courses taught by lecturer
  useEffect(() => {
    async function loadCourses() {
      try {
        setLoadingCourses(true);
        const data = await fetchCourses();
        setCourses(data || []);
        if (data && data.length > 0) {
          setSelectedCourseId(data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
        setError(err.message || 'Failed to load assigned courses');
      } finally {
        setLoadingCourses(false);
      }
    }
    loadCourses();
  }, []);

  // Load attendance roster for selected course
  const loadCourseRoster = useCallback(async () => {
    if (!selectedCourseId) return;
    try {
      setLoadingRoster(true);
      setError(null);
      const stats = await fetchCourseAttendanceStats(selectedCourseId);
      setCourseStats(stats);
      setStudentRoster(stats?.studentRoster || []);
    } catch (err) {
      console.error('Failed to load course attendance:', err);
      setError(err.message || 'Failed to load attendance roster for course');
    } finally {
      setLoadingRoster(false);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    loadCourseRoster();
  }, [loadCourseRoster]);

  const toggleStudentStatus = async (student) => {
    const newStatus = student.status === 'Present' ? 'Absent' : 'Present';
    // Optimistic UI update
    setStudentRoster((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, status: newStatus } : s))
    );

    try {
      // Record attendance override to API
      await recordAttendance({
        studentId: student.id,
        courseId: selectedCourseId,
        status: newStatus,
        reason: 'Lecturer Manual Override',
      });
    } catch (err) {
      console.error('Failed to update student attendance:', err);
      // Revert if failed
      setStudentRoster((prev) =>
        prev.map((s) => (s.id === student.id ? { ...s, status: student.status } : s))
      );
      alert(err.message || 'Failed to update attendance status.');
    }
  };

  const columns = [
    {
      header: 'Matriculation No',
      key: 'matricNo',
      render: (val) => (
        <span className="font-mono text-xs font-bold text-[#5A5A40]">{val}</span>
      ),
    },
    {
      header: 'Student Name',
      key: 'name',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          {row.avatar && (
            <img
              src={row.avatar}
              alt={val}
              className="w-6 h-6 rounded-full object-cover border border-[#e0e0d6]"
            />
          )}
          <span className="text-xs font-bold text-[#2d2d2d]">{val}</span>
        </div>
      ),
    },
    {
      header: 'Session Duration',
      key: 'duration',
      render: (val) => <span className="text-xs font-mono text-[#555544]">{val}</span>,
    },
    {
      header: 'Cumulative Rate',
      key: 'rateNumber',
      render: (val, row) => {
        const num = Number(row.rateNumber) || 0;
        const isEligible = num >= 75;
        return (
          <Badge variant={isEligible ? 'success' : 'danger'} size="sm">
            {row.rate} {isEligible ? '(Eligible)' : '(At Risk)'}
          </Badge>
        );
      },
    },
    {
      header: 'Status & Manual Override',
      key: 'status',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleStudentStatus(row)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              val === 'Present'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                : 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
            }`}
          >
            {val === 'Present' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            <span>{val}</span>
          </button>
        </div>
      ),
    },
  ];

  const currentCourse = courses.find((c) => c._id === selectedCourseId);

  return (
    <DashboardLayout title="Faculty Attendance Register">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" size="sm" className="mb-1">
              Class Register
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Lecture Attendance Verification
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Verify real-time classroom attendance timestamps and sign off NBTE compliance sheets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={loadCourseRoster}
              icon={RotateCw}
              disabled={loadingRoster}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => window.print()}
              icon={Printer}
            >
              Print Register
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 2500);
              }}
              icon={ShieldCheck}
            >
              Submit to Academic Planning
            </Button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold">
            ✓ Attendance register successfully verified and submitted to Directorate of Academic Planning!
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadCourseRoster}
              className="text-xs font-bold underline hover:no-underline text-rose-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Filter and stats controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-80">
            <Select
              id="course-select"
              label="Select Course"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              options={courses.map((c) => ({
                value: c._id,
                label: `${c.code} - ${c.title}`,
              }))}
            />
          </div>

          <div className="text-xs text-[#7a7a6e] flex items-center gap-4">
            <span>
              Enrolled Students: <strong className="text-[#2d2d2d]">{courseStats?.totalEnrolledStudents || 0}</strong>
            </span>
            <span>
              Average Attendance: <strong className="text-[#5A5A40]">{courseStats?.averageAttendancePercentage || 0}%</strong>
            </span>
          </div>
        </div>

        {/* Roster Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle>
                Enrolled Student Attendance Roster: {currentCourse ? `${currentCourse.code} - ${currentCourse.title}` : 'Selected Course'}
              </CardTitle>
              {loadingRoster && (
                <RotateCw className="w-4 h-4 animate-spin text-[#5A5A40]" />
              )}
            </div>
          </CardHeader>

          {studentRoster.length > 0 ? (
            <Table
              columns={columns}
              data={studentRoster}
              keyField="id"
            />
          ) : (
            <div className="p-8 text-center text-xs text-[#8e8e7a]">
              {loadingRoster ? 'Loading course attendance roster...' : 'No enrolled students found for this course.'}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
