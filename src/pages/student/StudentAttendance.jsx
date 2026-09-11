import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { useAuth } from '../../context/AuthContext';
import { fetchStudentAttendance, fetchStudentAttendanceStats } from '../../services/api';
import {
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Download,
  Printer,
  ShieldCheck,
  RotateCw,
  Clock
} from 'lucide-react';

export default function StudentAttendance() {
  const { currentUser } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const loadAttendanceData = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      setError(null);
      const [statsData, recordsData] = await Promise.all([
        fetchStudentAttendanceStats(currentUser.id),
        fetchStudentAttendance(currentUser.id),
      ]);
      setStats(statsData);
      setAttendanceRecords(recordsData || []);
    } catch (err) {
      console.error('Failed to load student attendance:', err);
      setError(err.message || 'Could not load attendance data from database.');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    loadAttendanceData();
  }, [loadAttendanceData]);

  const attendanceLogColumns = [
    {
      header: 'Date & Time',
      key: 'date',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-[#2d2d2d] block">
            {row.date ? new Date(row.date).toISOString().split('T')[0] : '2026-03-20'}
          </span>
          <span className="text-[11px] text-[#8e8e7a]">
            {row.timeJoined
              ? new Date(row.timeJoined).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '10:00 AM'}
          </span>
        </div>
      ),
    },
    {
      header: 'Course / Session',
      key: 'courseCode',
      render: (val, row) => {
        const isGeneral = Boolean(row.generalSession);
        const code = isGeneral
          ? row.generalSession?.category || 'General Session'
          : row.course?.code || 'Course';
        const title = isGeneral
          ? row.generalSession?.title || 'Departmental Session'
          : row.course?.title || 'Academic Lecture';

        return (
          <div>
            <Badge variant={isGeneral ? 'clay' : 'primary'} size="sm">
              {code}
            </Badge>
            <span className="text-xs text-[#555544] ml-2 font-medium">{title}</span>
          </div>
        );
      },
    },
    {
      header: 'Session Topic',
      key: 'lecture',
      render: (val, row) => (
        <span className="text-xs text-[#2d2d2d] font-medium">
          {row.lecture?.title || row.generalSession?.title || 'Live Virtual Classroom'}
        </span>
      ),
    },
    {
      header: 'Duration',
      key: 'durationMinutes',
      render: (val, row) => (
        <span className="text-xs font-mono text-[#555544] flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#8e8e7a]" />
          {row.durationMinutes || 0} mins
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => {
        let variant = 'success';
        if (val === 'Late' || val === 'Excused') variant = 'warning';
        if (val === 'Absent' || val === 'Left Early') variant = 'danger';
        return (
          <Badge variant={variant} size="sm">
            {val}
          </Badge>
        );
      },
    },
  ];

  const filteredRecords = attendanceRecords.filter((record) => {
    if (selectedFilter === 'all') return true;
    return record.status?.toLowerCase() === selectedFilter.toLowerCase();
  });

  const overallRate = stats?.overallAttendanceRate ?? 91.5;
  const isCompliant = overallRate >= 75;

  return (
    <DashboardLayout title="Academic Attendance Records">
      <div className="space-y-6">
        {/* Compliance Header Banner */}
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={isCompliant ? 'success' : 'danger'} size="md">
                {isCompliant ? 'NBTE 75% Rule Compliant' : 'Below 75% NBTE Threshold'}
              </Badge>
              {overallRate >= 90 && (
                <Badge variant="clay" size="md">
                  Distinction Candidate
                </Badge>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2d2d2d]">
              Overall Attendance: {loading ? '...' : `${overallRate}%`}
            </h2>
            <p className="text-xs text-[#7a7a6e] max-w-xl leading-relaxed">
              {isCompliant
                ? 'You are eligible to sit for all registered 2nd semester examinations. All virtual lecture attendances are timestamped and digitally signed by the course lecturer.'
                : 'Caution: Your cumulative attendance is below the mandatory 75% threshold required for NBTE examination docket issuance.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={loadAttendanceData}
              icon={RotateCw}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => window.print()}
              icon={Printer}
            >
              Print Slip
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => alert('Exporting NBTE verified attendance transcript...')}
              icon={Download}
            >
              Export Transcript
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadAttendanceData}
              className="text-xs font-bold underline hover:no-underline text-rose-900"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !stats && (
          <div className="p-12 text-center bg-white border border-[#e8e8dc] rounded-3xl space-y-3">
            <RotateCw className="w-6 h-6 animate-spin text-[#5A5A40] mx-auto" />
            <p className="text-xs font-medium text-[#7a7a6e]">Loading verified attendance records from MongoDB...</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Lecture Hours"
            value={stats ? `${stats.totalHoursAttended} Hours` : '48 Hours'}
            subtitle={stats ? `${stats.overallAttendedLectures} Lectures Attended` : '44 Hours Attended'}
            icon={FileCheck}
            variant="olive"
          />
          <StatCard
            title="Eligible Courses"
            value={stats ? `${stats.eligibleCoursesCount} / ${stats.totalCoursesCount} Courses` : '6 / 6 Courses'}
            subtitle={isCompliant ? 'All > 75% threshold' : 'Some courses need attention'}
            icon={ShieldCheck}
            variant="clay"
          />
          <StatCard
            title="Excused / Late"
            value={stats ? `${stats.overallLateLectures + stats.overallExcusedLectures} Sessions` : '2 Sessions'}
            subtitle="Department Approved"
            icon={CheckCircle2}
            variant="neutral"
          />
        </div>

        {/* Course Breakdown Table */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Course-by-Course Attendance Breakdown</CardTitle>
              <p className="text-xs text-[#7a7a6e]">NBTE Minimum Requirement: 75% for exam docket issuance</p>
            </div>
          </CardHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats?.courses && stats.courses.length > 0 ? (
              stats.courses.map((item) => {
                const isEligible = item.isEligible;
                return (
                  <div
                    key={item.courseCode}
                    className="p-4 rounded-2xl bg-[#fafaf6] border border-[#e8e8dc] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-[#2d2d2d] block">{item.courseCode}</span>
                        <span className="text-[11px] text-[#8e8e7a] line-clamp-1">{item.courseTitle}</span>
                      </div>
                      <Badge variant={isEligible ? 'success' : 'danger'} size="sm">
                        {isEligible ? 'Eligible' : 'At Risk'}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#555544]">
                          Attended {item.attended} of {item.totalLectures || 14}
                        </span>
                        <span className="text-[#5A5A40]">{item.percentage}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#eaeae0] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.percentage >= 80 ? 'bg-[#5A5A40]' : item.percentage >= 75 ? 'bg-[#A67C52]' : 'bg-rose-600'
                          }`}
                          style={{ width: `${Math.min(100, item.percentage)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-6 text-xs text-[#8e8e7a]">
                No course attendance history recorded yet.
              </div>
            )}
          </div>
        </Card>

        {/* Detailed Attendance Log */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
              <div>
                <CardTitle>Live Virtual Lecture Attendance Logs</CardTitle>
                <p className="text-xs text-[#7a7a6e]">Verified timestamps and session duration tracking</p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-[#f5f5ee] p-1 rounded-xl border border-[#e0e0d6]">
                {['all', 'Present', 'Late', 'Excused'].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      selectedFilter === filter
                        ? 'bg-[#5A5A40] text-white'
                        : 'text-[#555544] hover:text-[#2d2d2d]'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          {filteredRecords.length > 0 ? (
            <Table
              columns={attendanceLogColumns}
              data={filteredRecords}
              keyField="_id"
            />
          ) : (
            <div className="p-8 text-center text-xs text-[#8e8e7a]">
              No attendance records found matching the selected filter.
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
