import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SessionCard from '../../components/common/SessionCard';
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
  Video,
  Mic,
  Users,
  Radio,
  Layers,
  X,
  Info,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { fetchGeneralSessions, joinSession } from '../../services/api';

const CATEGORY_OPTIONS = [
  { value: 'Academic Meeting', label: 'Academic Meeting' },
  { value: 'Project Discussion', label: 'Project Discussion' },
  { value: 'Department Meeting', label: 'Department Meeting' },
  { value: 'Seminar', label: 'Seminar' },
  { value: 'Student Consultation', label: 'Student Consultation' },
  { value: 'Office Hours', label: 'Office Hours' },
  { value: 'General Discussion', label: 'General Discussion' },
  { value: 'General', label: 'General' },
  { value: 'Other', label: 'Other' }
];

function normalizeSession(ses) {
  if (!ses) return null;
  const organizerName =
    typeof ses.organizer === 'object' && ses.organizer?.name
      ? ses.organizer.name
      : ses.lecturer || 'Faculty Host';

  const organizerAvatar =
    typeof ses.organizer === 'object' && ses.organizer?.avatar
      ? ses.organizer.avatar
      : ses.lecturerAvatar ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';

  const organizerDesignation =
    typeof ses.organizer === 'object' && ses.organizer?.designation
      ? ses.organizer.designation
      : 'Faculty Host';

  const organizerDepartment =
    typeof ses.organizer === 'object' && ses.organizer?.department
      ? ses.organizer.department
      : 'Computer Science';

  const formattedDate = ses.scheduledDate
    ? new Date(ses.scheduledDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ses.dateFormatted || ses.date || 'TBD';

  return {
    ...ses,
    id: ses._id || ses.id,
    lecturer: organizerName,
    lecturerAvatar: organizerAvatar,
    lecturerDesignation: organizerDesignation,
    lecturerDepartment: organizerDepartment,
    date: ses.scheduledDate
      ? new Date(ses.scheduledDate).toISOString().split('T')[0]
      : ses.date || '',
    dateFormatted: formattedDate,
    duration: ses.durationMinutes ? `${ses.durationMinutes} mins` : ses.duration || '90 mins',
    mode: ses.mode ? ses.mode.toLowerCase() : 'video',
  };
}

export default function StudentSessions() {
  const navigate = useNavigate();

  // Data State
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'scheduled', 'live', 'completed'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Session Modal
  const [selectedSession, setSelectedSession] = useState(null);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchGeneralSessions();
      const normalized = (Array.isArray(data) ? data : []).map(normalizeSession);
      setSessions(normalized);
    } catch (err) {
      console.error('Error fetching general sessions:', err);
      setError(err.message || 'Failed to load general virtual sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const [isJoining, setIsJoining] = useState(false);

  const handleJoinSession = async (session) => {
    if (!session) return;
    const identifier = session.id || session._id || session.meetingId || 'room-general';
    setIsJoining(true);
    try {
      await joinSession('general-session', identifier);
      navigate(`/meeting/${session.meetingId || identifier}`);
    } catch (err) {
      setError(err.message || 'Unable to join virtual session');
      if (session.status === 'live' || session.status === 'Live Now') {
        navigate(`/meeting/${session.meetingId || identifier}`);
      }
    } finally {
      setIsJoining(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // Filtered list
  const filteredSessions = useMemo(() => {
    return sessions.filter((ses) => {
      // 1. Search filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        (ses.title && ses.title.toLowerCase().includes(query)) ||
        (ses.category && ses.category.toLowerCase().includes(query)) ||
        (ses.lecturer && ses.lecturer.toLowerCase().includes(query)) ||
        (ses.description && ses.description.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // 2. Status filter
      if (filterTab === 'live') {
        if (ses.status !== 'live' && ses.status !== 'Live Now') return false;
      } else if (filterTab === 'scheduled') {
        if (ses.status !== 'scheduled' && ses.status !== 'Scheduled') return false;
      } else if (filterTab === 'completed') {
        if (ses.status !== 'completed' && ses.status !== 'Completed') return false;
      }

      // 3. Category filter
      if (categoryFilter !== 'all' && ses.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [sessions, searchQuery, filterTab, categoryFilter]);

  // Tab Counts
  const tabCounts = useMemo(() => {
    return {
      all: sessions.length,
      live: sessions.filter((s) => s.status === 'live' || s.status === 'Live Now').length,
      scheduled: sessions.filter((s) => s.status === 'scheduled' || s.status === 'Scheduled').length,
      completed: sessions.filter((s) => s.status === 'completed' || s.status === 'Completed').length,
    };
  }, [sessions]);

  return (
    <DashboardLayout title="Virtual Sessions">
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge variant="primary" size="sm">
                ND2 Academic Sessions
              </Badge>
              <span className="text-[11px] font-semibold text-[#8e8e7a] uppercase tracking-wider">
                Departmental Meetings & Seminars
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Virtual Sessions
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1 max-w-2xl leading-relaxed">
              Join live project defense discussions, departmental academic advisory meetings, faculty consultation hours, and tech innovation seminars for ND2 Computer Science students.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#f5f5f0] p-1.5 rounded-2xl border border-[#ecece2] shrink-0 self-start md:self-auto">
            <span className="text-xs font-bold text-[#5A5A40] px-3 py-1 bg-white rounded-xl shadow-xs border border-[#e0e0d6]">
              {filteredSessions.length} {filteredSessions.length === 1 ? 'Session' : 'Sessions'}
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-2xl p-4 shadow-xs space-y-4">
          {/* Top Row: Tabs */}
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
                All Sessions ({tabCounts.all})
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
                onClick={() => setFilterTab('scheduled')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'scheduled'
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'bg-[#f5f5f0] text-[#555544] hover:bg-[#eaeae0]'
                }`}
              >
                Upcoming ({tabCounts.scheduled})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('completed')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterTab === 'completed'
                    ? 'bg-[#5A5A40] text-white shadow-xs'
                    : 'bg-[#f5f5f0] text-[#555544] hover:bg-[#eaeae0]'
                }`}
              >
                Completed ({tabCounts.completed})
              </button>
            </div>

            {(filterTab !== 'all' || categoryFilter !== 'all' || searchQuery.trim() !== '') && (
              <button
                type="button"
                onClick={() => {
                  setFilterTab('all');
                  setCategoryFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline flex items-center gap-1 ml-auto"
              >
                <X className="w-3.5 h-3.5" /> Reset Filters
              </button>
            )}
          </div>

          {/* Bottom Row: Category Select & Search */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
            <div className="lg:col-span-4">
              <Select
                id="student-general-category-select"
                label="Category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Categories' },
                  ...CATEGORY_OPTIONS
                ]}
                placeholder=""
                selectClassName="py-2 text-xs"
              />
            </div>

            <div className="lg:col-span-8">
              <Input
                id="student-general-session-search"
                label="Search"
                placeholder="Search topic, category, organizer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                inputClassName="py-2 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-16 text-center bg-[#fdfcfb] rounded-3xl border border-[#e0e0d6] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#5A5A40] animate-spin" />
            <p className="text-sm font-medium text-[#555544]">
              Loading departmental virtual sessions...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadSessions}
              icon={RefreshCw}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Sessions List */}
        {!isLoading && !error && (
          <div className="space-y-4">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  role="student"
                  onJoin={(ses) => handleJoinSession(ses || session)}
                  onViewDetails={(ses) => setSelectedSession(ses)}
                />
              ))
            ) : (
              <EmptyState
                title="No virtual sessions found"
                description="There are currently no sessions matching your selected filters."
                icon={Layers}
                actionLabel="Reset All Filters"
                onAction={() => {
                  setFilterTab('all');
                  setCategoryFilter('all');
                  setSearchQuery('');
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* SESSION DETAILS MODAL FOR STUDENTS */}
      {selectedSession && (
        <Modal
          isOpen={Boolean(selectedSession)}
          onClose={() => setSelectedSession(null)}
          title={selectedSession.title}
          subtitle={selectedSession.category || 'General Virtual Session'}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-[#2d2d2d]">
            <div className="p-4 rounded-2xl bg-[#fafaf6] border border-[#ecece2] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="clay" size="sm" className="font-semibold">
                  {selectedSession.category}
                </Badge>

                {selectedSession.mode === 'voice' ? (
                  <Badge variant="warning" size="sm" className="gap-1">
                    <Mic className="w-3 h-3" /> 🎙️ Voice Only
                  </Badge>
                ) : (
                  <Badge variant="info" size="sm" className="gap-1">
                    <Video className="w-3 h-3" /> 🎥 Video Session
                  </Badge>
                )}
              </div>

              <h3 className="font-serif text-xl font-bold text-[#2d2d2d] pt-1">
                {selectedSession.title}
              </h3>

              <p className="text-xs text-[#555544] leading-relaxed pt-1">
                {selectedSession.description || 'No detailed meeting abstract specified.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-[#e0e0d6] bg-[#fdfcfb] space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Avatar
                  src={selectedSession.lecturerAvatar}
                  name={selectedSession.lecturer}
                  size="sm"
                  role="lecturer"
                />
                <div>
                  <h5 className="font-bold text-[#2d2d2d]">{selectedSession.lecturer}</h5>
                  <p className="text-[11px] text-[#7a7a6e]">
                    {selectedSession.lecturerDesignation || 'Host & Session Organizer'} • {selectedSession.lecturerDepartment || 'Computer Science'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#ecece2] grid grid-cols-2 gap-2 text-[#444]">
                <div>
                  <span className="text-[10px] text-[#8e8e7a] block uppercase font-bold">Date</span>
                  <span className="font-medium">{selectedSession.dateFormatted || selectedSession.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8e8e7a] block uppercase font-bold">Time</span>
                  <span className="font-medium">{selectedSession.startTime} - {selectedSession.endTime || ''}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ecece2] flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedSession(null)}
              >
                Close
              </Button>

              {(selectedSession.status === 'live' || selectedSession.status === 'Live Now') ? (
                <Button
                  variant="danger"
                  size="md"
                  disabled={isJoining}
                  onClick={() => {
                    const ses = selectedSession;
                    setSelectedSession(null);
                    handleJoinSession(ses);
                  }}
                  icon={Radio}
                  className="animate-pulse shadow-sm"
                >
                  {isJoining ? 'Connecting...' : 'Join Virtual Session'}
                </Button>
              ) : selectedSession.status === 'scheduled' || selectedSession.status === 'Scheduled' ? (
                <Button
                  variant="primary"
                  size="md"
                  disabled={isJoining}
                  onClick={() => {
                    const ses = selectedSession;
                    setSelectedSession(null);
                    handleJoinSession(ses);
                  }}
                  icon={Radio}
                >
                  {isJoining ? 'Connecting...' : 'Ready to Join'}
                </Button>
              ) : null}
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
