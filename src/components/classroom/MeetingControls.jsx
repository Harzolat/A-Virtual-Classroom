import React from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Hand,
  MessageSquare,
  Users,
  PhoneOff,
  SlidersHorizontal,
  FileText,
  Radio,
  PenTool
} from 'lucide-react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';

export default function MeetingControls({ onLeave, className = '' }) {
  const { role } = useAuth();
  const {
    isMicMuted,
    isVideoOn,
    isScreenSharing,
    isHandRaised,
    isChatOpen,
    setIsChatOpen,
    isParticipantsOpen,
    setIsParticipantsOpen,
    isWhiteboardOpen,
    setIsWhiteboardOpen,
    toggleMic,
    toggleVideo,
    toggleScreenShare,
    toggleHandRaise,
    participants,
    endLecture
  } = useClassroom();

  const isLecturer = role === 'lecturer' || role === 'admin';
  const handRaisedCount = participants.filter(p => p.hasHandRaised).length;

  return (
    <div
      className={`h-20 bg-white/95 backdrop-blur-md rounded-3xl border border-[#e0e0d6] px-4 md:px-8 flex items-center justify-between shadow-lg ${className}`}
    >
      {/* Left controls: Audio & Video */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mic toggle */}
        <button
          type="button"
          onClick={toggleMic}
          className={`p-3 sm:p-3.5 rounded-2xl transition-all flex items-center gap-2 ${
            isMicMuted
              ? 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
              : 'bg-[#f5f5f0] text-[#5A5A40] hover:bg-[#eaeae0] border border-[#e0e0d6]'
          }`}
          title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-[#5A5A40]" />}
          <span className="text-xs font-semibold hidden md:inline">
            {isMicMuted ? 'Muted' : 'Mute'}
          </span>
        </button>

        {/* Camera toggle */}
        <button
          type="button"
          onClick={toggleVideo}
          className={`p-3 sm:p-3.5 rounded-2xl transition-all flex items-center gap-2 ${
            !isVideoOn
              ? 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
              : 'bg-[#f5f5f0] text-[#5A5A40] hover:bg-[#eaeae0] border border-[#e0e0d6]'
          }`}
          title={isVideoOn ? 'Turn Off Video' : 'Turn On Video'}
        >
          {!isVideoOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5 text-[#5A5A40]" />}
          <span className="text-xs font-semibold hidden md:inline">
            {!isVideoOn ? 'Camera Off' : 'Stop Video'}
          </span>
        </button>
      </div>

      {/* Center controls: Screen Share, Whiteboard, Hand Raise */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Screen Share */}
        <button
          type="button"
          onClick={toggleScreenShare}
          className={`p-3 sm:p-3.5 rounded-2xl transition-all flex items-center gap-2 ${
            isScreenSharing
              ? 'bg-[#5A5A40] text-white shadow-md'
              : 'bg-[#f5f5f0] text-[#5A5A40] hover:bg-[#eaeae0] border border-[#e0e0d6]'
          }`}
          title="Share Screen"
        >
          <Monitor className="w-5 h-5" />
          <span className="text-xs font-semibold hidden lg:inline">
            {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          </span>
        </button>

        {/* Whiteboard / Presentation View */}
        <button
          type="button"
          onClick={() => setIsWhiteboardOpen(!isWhiteboardOpen)}
          className={`p-3 sm:p-3.5 rounded-2xl transition-all flex items-center gap-2 ${
            isWhiteboardOpen
              ? 'bg-[#A67C52] text-white shadow-md'
              : 'bg-[#f5f5f0] text-[#5A5A40] hover:bg-[#eaeae0] border border-[#e0e0d6]'
          }`}
          title="Lecture Slides / Whiteboard"
        >
          <PenTool className="w-5 h-5" />
          <span className="text-xs font-semibold hidden lg:inline">
            Class Slides
          </span>
        </button>

        {/* Raise Hand (for students & indicator for lecturer) */}
        <button
          type="button"
          onClick={toggleHandRaise}
          className={`p-3 sm:p-3.5 rounded-2xl transition-all flex items-center gap-2 relative ${
            isHandRaised
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-[#f5f5f0] text-[#5A5A40] hover:bg-[#eaeae0] border border-[#e0e0d6]'
          }`}
          title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
        >
          <Hand className="w-5 h-5" />
          <span className="text-xs font-semibold hidden sm:inline">
            {isHandRaised ? 'Hand Raised' : 'Raise Hand'}
          </span>
          {isLecturer && handRaisedCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
              {handRaisedCount}
            </span>
          )}
        </button>
      </div>

      {/* Right controls: Participants, Chat, Leave/End */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Participants toggle */}
        <button
          type="button"
          onClick={() => {
            setIsParticipantsOpen(!isParticipantsOpen);
            if (!isParticipantsOpen) setIsChatOpen(false);
          }}
          className={`p-3 sm:p-3.5 rounded-2xl transition-all flex items-center gap-2 relative ${
            isParticipantsOpen
              ? 'bg-[#5A5A40] text-white shadow-md'
              : 'bg-[#f5f5f0] text-[#5A5A40] hover:bg-[#eaeae0] border border-[#e0e0d6]'
          }`}
          title="Participants"
        >
          <Users className="w-5 h-5" />
          <span className="text-xs font-semibold hidden md:inline">
            {participants.length}
          </span>
        </button>

        {/* Chat toggle */}
        <button
          type="button"
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            if (!isChatOpen) setIsParticipantsOpen(false);
          }}
          className={`p-3 sm:p-3.5 rounded-2xl transition-all flex items-center gap-2 ${
            isChatOpen
              ? 'bg-[#5A5A40] text-white shadow-md'
              : 'bg-[#f5f5f0] text-[#5A5A40] hover:bg-[#eaeae0] border border-[#e0e0d6]'
          }`}
          title="Live Chat"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs font-semibold hidden md:inline">Chat</span>
        </button>

        {/* Leave or End Lecture */}
        {isLecturer ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to end this lecture for all attendees?')) {
                endLecture();
                onLeave();
              }
            }}
            className="px-4 py-3 bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">End Lecture</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onLeave}
            className="px-4 py-3 bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">Leave Class</span>
          </button>
        )}
      </div>
    </div>
  );
}
