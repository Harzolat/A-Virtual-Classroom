import React, { useState } from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Search, Mic, MicOff, Video, VideoOff, Hand, VolumeX, HandMetal, ShieldCheck, X } from 'lucide-react';

export default function ParticipantList({ onClose }) {
  const { role } = useAuth();
  const {
    participants,
    muteAllStudents,
    lowerAllHands,
    lowerStudentHand,
    toggleParticipantMic
  } = useClassroom();

  const [searchQuery, setSearchQuery] = useState('');
  const isLecturer = role === 'lecturer' || role === 'admin';

  const filteredParticipants = participants.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.matricNo && p.matricNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handsCount = participants.filter(p => p.hasHandRaised).length;

  return (
    <div className="w-80 sm:w-88 h-full bg-[#fdfcfb] rounded-3xl border border-[#e0e0d6] flex flex-col shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#ecece2] flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-base text-[#2d2d2d] flex items-center gap-2">
            <span>Participants</span>
            <Badge variant="primary" size="sm">
              {participants.length} Active
            </Badge>
          </h3>
          <p className="text-[11px] text-[#8e8e7a] mt-0.5">
            ND2 Class Roster • Live Session
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8e8e7a] hover:bg-[#efefe5] rounded-xl"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Lecturer Moderation Tools */}
      {isLecturer && (
        <div className="p-3 bg-[#f7f6f0] border-b border-[#ecece2] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={muteAllStudents}
              className="flex-1 text-xs py-1.5 bg-white"
              icon={VolumeX}
            >
              Mute All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={lowerAllHands}
              disabled={handsCount === 0}
              className="flex-1 text-xs py-1.5 bg-white"
              icon={HandMetal}
            >
              Lower Hands ({handsCount})
            </Button>
          </div>
        </div>
      )}

      {/* Search Filter */}
      <div className="p-3 border-b border-[#ecece2]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8e8e7a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or matric..."
            className="w-full bg-[#f5f5f0] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#2d2d2d] placeholder-[#8e8e7a] focus:outline-none focus:ring-1 focus:ring-[#5A5A40] border border-transparent focus:border-[#5A5A40]"
          />
        </div>
      </div>

      {/* Participant List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredParticipants.map((p) => (
          <div
            key={p.id}
            className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
              p.isHost
                ? 'bg-[#f4efe8] border-[#e2d5c6]'
                : p.hasHandRaised
                ? 'bg-amber-50/80 border-amber-200'
                : 'bg-white border-[#ecece2] hover:bg-[#fafaf6]'
            }`}
          >
            {/* Avatar & Name */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <Avatar
                src={p.avatar}
                name={p.name}
                size="sm"
                role={p.role?.toLowerCase()}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-[#2d2d2d] truncate">
                    {p.name}
                  </p>
                  {p.isHost && (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-[#8e8e7a] truncate font-mono">
                  {p.matricNo || p.role}
                </p>
              </div>
            </div>

            {/* Hand Raised & Media Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              {p.hasHandRaised && (
                <button
                  type="button"
                  onClick={() => isLecturer && lowerStudentHand(p.id)}
                  className="p-1 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors animate-pulse"
                  title={isLecturer ? 'Click to lower hand' : 'Hand Raised'}
                >
                  <Hand className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Mic Status */}
              <button
                type="button"
                onClick={() => isLecturer && !p.isHost && toggleParticipantMic(p.id)}
                disabled={!isLecturer || p.isHost}
                className={`p-1.5 rounded-lg text-xs ${
                  p.isMuted
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-[#efefe5] text-[#5A5A40]'
                }`}
                title={p.isMuted ? 'Muted' : 'Microphone Active'}
              >
                {p.isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
              </button>

              {/* Video Status */}
              <div
                className={`p-1.5 rounded-lg text-xs ${
                  !p.isVideoOn
                    ? 'bg-[#efefe5] text-[#8e8e7a]'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {!p.isVideoOn ? <VideoOff className="w-3 h-3" /> : <Video className="w-3 h-3" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
