import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LectureCard from '../../components/common/LectureCard';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import { Search, Calendar, Filter } from 'lucide-react';
import { MOCK_LECTURES } from '../../data/mockData';

export default function StudentLectures() {
  const navigate = useNavigate();
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLectures = MOCK_LECTURES.filter((lec) => {
    const matchesSearch =
      lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.lecturer.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterTab === 'live') return matchesSearch && lec.status === 'Live Now';
    if (filterTab === 'upcoming') return matchesSearch && lec.status === 'Scheduled';
    if (filterTab === 'past') return matchesSearch && lec.status === 'Completed';
    return matchesSearch;
  });

  return (
    <DashboardLayout title="Upcoming Lectures & Timetable">
      <div className="space-y-6">
        {/* Header banner */}
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" size="sm" className="mb-1">
              Lecture Timetable
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Virtual Lecture Schedule
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Interactive video and voice classes for ND2 Computer Science. Join with one click.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'all'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-[#f5f5f0] text-[#555544] hover:bg-[#eaeae0]'
              }`}
            >
              All Sessions
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('live')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'live'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-[#f5f5f0] text-[#555544] hover:bg-[#eaeae0]'
              }`}
            >
              Live Now (1)
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('upcoming')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'upcoming'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-[#f5f5f0] text-[#555544] hover:bg-[#eaeae0]'
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('past')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterTab === 'past'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-[#f5f5f0] text-[#555544] hover:bg-[#eaeae0]'
              }`}
            >
              Past / Recordings
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <Input
            id="lecture-search"
            placeholder="Search by topic, course code, lecturer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>

        {/* Lectures List */}
        <div className="space-y-4">
          {filteredLectures.map((lecture) => (
            <LectureCard
              key={lecture.id}
              lecture={lecture}
              role="student"
              onJoin={() => navigate(`/meeting/${lecture.meetingId}`)}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
