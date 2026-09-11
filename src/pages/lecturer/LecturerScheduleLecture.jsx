import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Calendar, Clock, Video, Mic, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MOCK_COURSES } from '../../data/mockData';
import { useLectures } from '../../context/LectureContext';
import { useAuth } from '../../context/AuthContext';

export default function LecturerScheduleLecture() {
  const navigate = useNavigate();
  const { addLecture } = useLectures();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    courseCode: 'COM 221',
    title: 'AVL Tree Rotations & Balanced Search Trees',
    date: '2026-08-20',
    startTime: '10:00',
    endTime: '12:00',
    type: 'Video',
    roomPasscode: 'COM221-TREE',
    description: 'Detailed analysis of Left-Left, Right-Right single rotations and composite double rotations in AVL self-balancing trees.'
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!formData.title || !formData.title.trim()) {
      setErrorMsg('Please enter a valid lecture topic/title.');
      return;
    }
    if (!formData.courseCode) {
      setErrorMsg('Please select a course.');
      return;
    }
    if (!formData.date) {
      setErrorMsg('Please select a lecture date.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    addLecture({
      ...formData,
      title: formData.title.trim(),
      description: formData.description ? formData.description.trim() : '',
      lecturer: currentUser?.name || 'Engr. Dr. K. A. Adeleke',
      lecturerId: currentUser?.id || 'lec-1',
      lecturerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    });

    setSuccess(true);
    setTimeout(() => {
      navigate('/lecturer/dashboard');
    }, 1200);
  };

  return (
    <DashboardLayout title="Schedule Virtual Lecture">
      <div className="space-y-6 max-w-3xl">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs">
          <Badge variant="primary" size="sm" className="mb-1">
            Virtual Lecture Scheduler
          </Badge>
          <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
            Create New Virtual Classroom Session
          </h2>
          <p className="text-xs text-[#7a7a6e] mt-1">
            Notify enrolled students and generate a secure WebRTC classroom link with automated attendance recording.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold">
            <span>{errorMsg}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Lecture session successfully scheduled! Students have been notified. Redirecting...</span>
          </div>
        )}

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                id="courseCode"
                label="Select Course"
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                options={MOCK_COURSES.map((c) => ({ value: c.code, label: `${c.code} - ${c.title}` }))}
                required
              />

              <Select
                id="type"
                label="Lecture Session Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                options={[
                  { value: 'Video', label: 'Interactive Video Classroom (Standard)' },
                  { value: 'Voice', label: 'Audio / Voice Only Seminar' }
                ]}
                required
              />
            </div>

            <Input
              id="title"
              label="Lecture Topic / Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Binary Search Trees & Traversal Algorithms"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                id="date"
                label="Lecture Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                icon={Calendar}
                required
              />

              <Input
                id="startTime"
                label="Start Time"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                icon={Clock}
                required
              />

              <Input
                id="endTime"
                label="End Time"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                icon={Clock}
                required
              />
            </div>

            <Input
              id="roomPasscode"
              label="Room Access Passcode"
              value={formData.roomPasscode}
              onChange={(e) => setFormData({ ...formData, roomPasscode: e.target.value })}
              icon={Lock}
              helperText="Passcode required for students to join."
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A5A40] mb-1.5">
                Lecture Agenda & Objectives
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-xl border border-[#e0e0d6] bg-[#fdfcfb] p-3 text-xs text-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-[#5A5A40]"
                placeholder="Enter key concepts or preparation instructions for students..."
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/lecturer/dashboard')}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={submitting}
                icon={ArrowRight}
                iconPosition="right"
              >
                {submitting ? 'Publishing Lecture...' : 'Publish & Notify Students'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
