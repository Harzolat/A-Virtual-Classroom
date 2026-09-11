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
import { useAuth } from '../../context/AuthContext';
import {
  PlusCircle,
  Search,
  Calendar,
  Clock,
  Video,
  Mic,
  Users,
  Radio,
  Layers,
  Check,
  X,
  Info,
  ShieldCheck,
  Sparkles,
  FileText,
  Trash2,
  AlertCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import {
  fetchGeneralSessions,
  createGeneralSession,
  deleteGeneralSession
} from '../../services/api';

const CATEGORY_OPTIONS = [
  { value: 'Project Discussion', label: 'Project Discussion' },
  { value: 'Department Meeting', label: 'Department Meeting' },
  { value: 'Student Consultation', label: 'Student Consultation' },
  { value: 'Seminar', label: 'Seminar' },
  { value: 'General', label: 'General' },
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

  const organizerId =
    typeof ses.organizer === 'object' && ses.organizer?._id
      ? ses.organizer._id.toString()
      : ses.organizer || ses.lecturerId;

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
    organizerId,
    date: ses.scheduledDate
      ? new Date(ses.scheduledDate).toISOString().split('T')[0]
      : ses.date || '',
    dateFormatted: formattedDate,
    duration: ses.durationMinutes ? `${ses.durationMinutes} mins` : ses.duration || '90 mins',
    mode: ses.mode ? ses.mode.toLowerCase() : 'video',
  };
}

export default function LecturerSessions() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Data State
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter States
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'scheduled', 'live', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // UI States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSessionDetails, setSelectedSessionDetails] = useState(null);
  const [toastNotification, setToastNotification] = useState(null);

  // Form State for Create Virtual Session
  const [formData, setFormData] = useState({
    title: '',
    category: 'Project Discussion',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    mode: 'video', // 'video' | 'voice'
    maxCapacity: 50,
    allowStudentScreenShare: true,
    recordSession: true,
    autoAttendance: false,
  });

  const showToast = (msg) => {
    setToastNotification(msg);
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchGeneralSessions();
      const normalized = (Array.isArray(data) ? data : []).map(normalizeSession);
      setSessions(normalized);
    } catch (err) {
      console.error('Error fetching general sessions:', err);
      setError(err.message || 'Failed to load general sessions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // Filtered Sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter((ses) => {
      // 1. Search Query
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        (ses.title && ses.title.toLowerCase().includes(query)) ||
        (ses.category && ses.category.toLowerCase().includes(query)) ||
        (ses.lecturer && ses.lecturer.toLowerCase().includes(query)) ||
        (ses.description && ses.description.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // 2. Status Tab Filter
      if (filterTab === 'live') {
        if (ses.status !== 'live' && ses.status !== 'Live Now') return false;
      } else if (filterTab === 'scheduled') {
        if (ses.status !== 'scheduled' && ses.status !== 'Scheduled') return false;
      } else if (filterTab === 'completed') {
        if (ses.status !== 'completed' && ses.status !== 'Completed') return false;
      }

      // 3. Category Filter
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

  // Create Form Handler
  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a session title.');
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        scheduledDate: new Date(formData.date),
        startTime: formData.startTime.trim(),
        endTime: formData.endTime.trim(),
        durationMinutes: 90,
        mode: formData.mode === 'voice' ? 'Voice' : 'Video',
        status: 'Scheduled',
        maxCapacity: Number(formData.maxCapacity) || 50,
        allowStudentScreenShare: formData.allowStudentScreenShare,
        recordSession: formData.recordSession,
        autoAttendance: formData.autoAttendance,
      };

      const created = await createGeneralSession(payload);
      const normalizedCreated = normalizeSession(created);

      setSessions((prev) => [normalizedCreated, ...prev]);
      setIsCreateModalOpen(false);

      // Reset Form
      setFormData({
        title: '',
        category: 'Project Discussion',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        mode: 'video',
        maxCapacity: 50,
        allowStudentScreenShare: true,
        recordSession: true,
        autoAttendance: false,
      });

      showToast(`General Session "${normalizedCreated.title}" successfully scheduled!`);
    } catch (err) {
      console.error('Error creating general session:', err);
      alert(err.message || 'Failed to create general virtual session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSession = async (sessionId, title) => {
    if (!window.confirm(`Are you sure you want to delete session "${title}"?`)) {
      return;
    }

    try {
      await deleteGeneralSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId && s._id !== sessionId));
      if (selectedSessionDetails && (selectedSessionDetails.id === sessionId || selectedSessionDetails._id === sessionId)) {
        setSelectedSessionDetails(null);
      }
      showToast(`Session "${title}" deleted successfully`);
    } catch (err) {
      console.error('Error deleting session:', err);
      alert(err.message || 'Failed to delete session');
    }
  };

  return (
    <DashboardLayout title="General Virtual Sessions">
      {/* Toast Popup Notification */}
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
        {/* Header Banner */}
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge variant="clay" size="sm" className="font-semibold">
                Non-Course Virtual Sessions
              </Badge>
              <span className="text-[11px] font-semibold text-[#8e8e7a] uppercase tracking-wider">
                Faculty Workspace & Meetings
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              General Virtual Sessions
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1 max-w-2xl leading-relaxed">
              Create and host virtual project defenses, departmental academic meetings, student consultation hours, voice seminars, and general academic discussions without linking to a specific course code.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
            icon={PlusCircle}
            className="shrink-0 self-start md:self-auto shadow-sm"
          >
            Create Virtual Session
          </Button>
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
                Scheduled ({tabCounts.scheduled})
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
                id="general-category-select"
                label="Session Category"
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
                id="general-session-search"
                label="Search"
                placeholder="Search session title, category, lecturer..."
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
                <div key={session.id} className="relative group">
                  <SessionCard
                    session={session}
                    role="lecturer"
                    onJoin={(ses) => navigate(`/meeting/${ses.meetingId || 'room-general'}`)}
                    onViewDetails={(ses) => setSelectedSessionDetails(ses)}
                  />
                </div>
              ))
            ) : (
              <EmptyState
                title="No virtual sessions found"
                description="No general virtual sessions match your current filter selections. Create a new virtual session or adjust filters."
                icon={Layers}
                actionLabel="Create Virtual Session"
                onAction={() => setIsCreateModalOpen(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* CREATE GENERAL VIRTUAL SESSION MODAL (NO COURSE REQUIRED) */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create Virtual Session"
          subtitle="Non-course academic meetings, defenses, seminars, and consultations"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-[#2d2d2d]">
            {/* Session Title */}
            <div>
              <Input
                id="session-title-input"
                label="Session Title *"
                placeholder="e.g. ND2 Project Discussion & Software Architecture Q&A"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Category Select & Communication Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Select
                  id="session-category-input"
                  label="Category *"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={CATEGORY_OPTIONS}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2d2d2d] mb-1.5">
                  Communication Mode *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mode: 'video' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      formData.mode === 'video'
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-2xs'
                        : 'bg-[#fafaf6] text-[#555544] border-[#d8d8cc] hover:bg-[#efefe5]'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" /> 🎥 Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mode: 'voice' })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      formData.mode === 'voice'
                        ? 'bg-amber-700 text-white border-amber-700 shadow-2xs'
                        : 'bg-[#fafaf6] text-[#555544] border-[#d8d8cc] hover:bg-[#efefe5]'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" /> 🎙️ Voice Only
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#2d2d2d] mb-1">
                Description / Agenda
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary of meeting objectives, discussion agenda, or participant guidelines..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#d8d8cc] bg-white text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
              />
            </div>

            {/* Date, Start Time, End Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Input
                  id="session-date-input"
                  label="Date *"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Input
                  id="session-start-input"
                  label="Start Time *"
                  placeholder="e.g. 10:00 AM"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>

              <div>
                <Input
                  id="session-end-input"
                  label="End Time"
                  placeholder="e.g. 11:30 AM"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            {/* Max Capacity */}
            <div>
              <Input
                id="session-capacity-input"
                label="Maximum Participants Capacity"
                type="number"
                placeholder="50"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
              />
            </div>

            {/* Session Prototype Controls/Toggles */}
            <div className="p-3.5 rounded-2xl bg-[#fafaf6] border border-[#ecece2] space-y-2">
              <span className="text-[11px] font-bold text-[#8e8e7a] uppercase tracking-wider block">
                Session Control Preferences
              </span>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowStudentScreenShare}
                    onChange={(e) =>
                      setFormData({ ...formData, allowStudentScreenShare: e.target.checked })
                    }
                    className="rounded border-[#c8c8bc] text-[#5A5A40] focus:ring-[#5A5A40]"
                  />
                  <span>Allow student screen sharing during session</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.recordSession}
                    onChange={(e) => setFormData({ ...formData, recordSession: e.target.checked })}
                    className="rounded border-[#c8c8bc] text-[#5A5A40] focus:ring-[#5A5A40]"
                  />
                  <span>Cloud record video/audio session stream</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoAttendance}
                    onChange={(e) => setFormData({ ...formData, autoAttendance: e.target.checked })}
                    className="rounded border-[#c8c8bc] text-[#5A5A40] focus:ring-[#5A5A40]"
                  />
                  <span>Automatically log attendee join times</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#ecece2] flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                icon={Check}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Scheduling Session...' : 'Schedule Virtual Session'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* VIEW SESSION DETAILS MODAL */}
      {selectedSessionDetails && (
        <Modal
          isOpen={Boolean(selectedSessionDetails)}
          onClose={() => setSelectedSessionDetails(null)}
          title="Virtual Session Overview"
          subtitle={selectedSessionDetails.category || 'General Session'}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-[#2d2d2d]">
            <div className="p-4 rounded-2xl bg-[#fafaf6] border border-[#ecece2] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="clay" size="sm" className="font-semibold">
                  {selectedSessionDetails.category}
                </Badge>

                {selectedSessionDetails.mode === 'voice' ? (
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
                {selectedSessionDetails.title}
              </h3>

              <p className="text-xs text-[#555544] leading-relaxed pt-1">
                {selectedSessionDetails.description || 'No specific description provided.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border border-[#e0e0d6] bg-[#fdfcfb] space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Avatar
                  src={selectedSessionDetails.lecturerAvatar}
                  name={selectedSessionDetails.lecturer}
                  size="sm"
                  role="lecturer"
                />
                <div>
                  <h5 className="font-bold text-[#2d2d2d]">{selectedSessionDetails.lecturer}</h5>
                  <p className="text-[11px] text-[#7a7a6e]">
                    {selectedSessionDetails.lecturerDesignation || 'Host & Session Organizer'} • {selectedSessionDetails.lecturerDepartment || 'Computer Science'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#ecece2] grid grid-cols-2 gap-2 text-[#444]">
                <div>
                  <span className="text-[10px] text-[#8e8e7a] block uppercase font-bold">Date</span>
                  <span className="font-medium">{selectedSessionDetails.dateFormatted || selectedSessionDetails.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8e8e7a] block uppercase font-bold">Time</span>
                  <span className="font-medium">{selectedSessionDetails.startTime} - {selectedSessionDetails.endTime || ''}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ecece2] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setSelectedSessionDetails(null)}
                >
                  Close
                </Button>

                {/* Allow delete if user is organizer or admin */}
                {(currentUser?.role === 'admin' ||
                  selectedSessionDetails.organizerId === currentUser?.id ||
                  selectedSessionDetails.organizerId === currentUser?.userId) && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() =>
                      handleDeleteSession(selectedSessionDetails.id, selectedSessionDetails.title)
                    }
                    icon={Trash2}
                  >
                    Delete
                  </Button>
                )}
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  const meetingId = selectedSessionDetails.meetingId || 'room-general';
                  setSelectedSessionDetails(null);
                  navigate(`/meeting/${meetingId}`);
                }}
                icon={Radio}
              >
                Enter Virtual Classroom
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
