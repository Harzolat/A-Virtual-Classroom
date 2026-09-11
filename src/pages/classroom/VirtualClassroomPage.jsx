import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import { recordAttendance, leaveAttendance, joinSession, leaveSession } from '../../services/api';
import VideoTile from '../../components/classroom/VideoTile';
import MeetingControls from '../../components/classroom/MeetingControls';
import ParticipantList from '../../components/classroom/ParticipantList';
import ChatPanel from '../../components/classroom/ChatPanel';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import {
  Radio,
  Clock,
  Users,
  MessageSquare,
  LayoutGrid,
  Maximize2,
  Info,
  PenTool,
  ChevronLeft,
  ChevronRight,
  Share2,
  Lock,
  Download,
  BookOpen
} from 'lucide-react';

export default function VirtualClassroomPage() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();
  const {
    activeLecture,
    sessionTimeElapsed,
    isChatOpen,
    setIsChatOpen,
    isParticipantsOpen,
    setIsParticipantsOpen,
    isWhiteboardOpen,
    setIsWhiteboardOpen,
    participants,
    layoutMode,
    setLayoutMode
  } = useClassroom();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showRoomInfoModal, setShowRoomInfoModal] = useState(false);
  const [attendanceRecordId, setAttendanceRecordId] = useState(null);

  // Auto-record attendance and join session when student enters classroom
  useEffect(() => {
    if (role !== 'student' || !currentUser?.id) return;
    let isSubscribed = true;

    async function recordEntry() {
      try {
        const identifier = meetingId || activeLecture?._id || activeLecture?.id;
        if (identifier) {
          // Attempt Phase 1I Session Join
          try {
            const res = await joinSession('lecture', String(identifier));
            if (isSubscribed && res?.data?._id) {
              setAttendanceRecordId(res.data._id);
              return;
            }
          } catch (sessionErr) {
            console.debug('Session join engine status:', sessionErr);
          }

          // Fallback to direct attendance record if needed
          const lectureId = activeLecture?._id || activeLecture?.id;
          if (lectureId) {
            const res = await recordAttendance({
              lectureId: String(lectureId),
              studentId: currentUser.id,
              timeJoined: new Date(),
            });
            if (isSubscribed && res?._id) {
              setAttendanceRecordId(res._id);
            }
          }
        }
      } catch (err) {
        // Attendance might already have been recorded for this session, which is fine
        console.debug('Attendance record status:', err);
      }
    }

    recordEntry();

    return () => {
      isSubscribed = false;
    };
  }, [role, currentUser?.id, activeLecture?._id, activeLecture?.id, meetingId]);

  const slides = [
    {
      title: 'Binary Search Trees (BST) - Definition & Properties',
      subtitle: 'Department of Computer Science • COM 221 Module 4',
      diagram: 'tree_concept',
      bullets: [
        'Each node has at most two children (left child and right child).',
        'Left subtree keys are strictly less than the parent root key: Key(Left) < Key(Root).',
        'Right subtree keys are strictly greater than the parent root key: Key(Right) > Key(Root).',
        'In-order Traversal (L -> Root -> R) always outputs values in strictly sorted ascending order.'
      ]
    },
    {
      title: 'BST In-Order, Pre-Order & Post-Order Traversals',
      subtitle: 'Depth-First Search (DFS) Algorithmic Complexity',
      diagram: 'traversal_code',
      bullets: [
        'Pre-Order (Root -> Left -> Right): Useful for cloning and serializing trees.',
        'In-Order (Left -> Root -> Right): Outputs non-decreasing sequence of elements.',
        'Post-Order (Left -> Right -> Root): Used for bottom-up node deletion and freeing memory.',
        'Time Complexity: O(n) visiting all n nodes. Space Complexity: O(h) call stack height.'
      ]
    },
    {
      title: 'Tree Balancing: AVL Rotations & Edge Case Deletion',
      subtitle: 'Solving Worst-Case O(n) Degenerate Skewed Trees',
      diagram: 'avl_rotations',
      bullets: [
        'Balance Factor = Height(Left Subtree) - Height(Right Subtree) ∈ {-1, 0, +1}.',
        'Left-Left (LL) & Right-Right (RR) single rotations.',
        'Left-Right (LR) & Right-Left (RL) double composite rotations.',
        'Guaranteed search time complexity: O(log n).'
      ]
    }
  ];

  const handleLeave = async () => {
    const identifier = meetingId || activeLecture?._id || activeLecture?.id;
    if (identifier && role === 'student') {
      try {
        await leaveSession('lecture', String(identifier), {
          timeLeft: new Date(),
        });
      } catch (err) {
        console.warn('Session leave call status:', err);
      }
    }

    if (attendanceRecordId) {
      try {
        await leaveAttendance(attendanceRecordId, {
          timeLeft: new Date(),
        });
      } catch (err) {
        console.warn('Error recording leave attendance:', err);
      }
    }
    navigate(`/${role || 'student'}/dashboard`);
  };

  const lecturerParticipant = participants.find(p => p.isHost) || participants[0];
  const studentParticipants = participants.filter(p => !p.isHost);

  return (
    <div className="h-screen w-screen bg-[#141410] text-[#eaeae0] flex flex-col overflow-hidden font-sans select-none">
      {/* Top Header Bar */}
      <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-[#2d2d24] bg-[#1c1c16]/90 backdrop-blur-md shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLeave}
            className="p-2 rounded-xl text-[#a8a896] hover:text-white hover:bg-[#2d2d24] transition-colors"
            title="Back to Portal"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>{activeLecture?.courseCode || 'COM 221'}: {activeLecture?.title || 'Data Structures & Algorithms'}</span>
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#5A5A40] text-white text-[10px] font-bold uppercase">
                {role === 'lecturer' ? 'Host View' : 'Student View'}
              </span>
            </div>
            <p className="text-[11px] text-[#8e8e7a] hidden md:block">
              {activeLecture?.lecturer || 'Engr. Dr. K. A. Adeleke'} • ND2 Computer Science
            </p>
          </div>
        </div>

        {/* Center/Right Metadata */}
        <div className="flex items-center gap-3">
          {/* Live Indicator */}
          <div className="flex items-center gap-2 bg-rose-950/80 text-rose-300 border border-rose-800/80 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            <span>LIVE • {sessionTimeElapsed}</span>
          </div>

          {/* Recording pill */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#26261f] border border-[#3a3a30] text-[#c4c4b2] px-2.5 py-1 rounded-full text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Recording (Cloud)</span>
          </div>

          {/* Layout switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-[#26261f] p-1 rounded-xl border border-[#3a3a30]">
            <button
              type="button"
              onClick={() => setLayoutMode('presentation')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                layoutMode === 'presentation'
                  ? 'bg-[#5A5A40] text-white'
                  : 'text-[#8e8e7a] hover:text-white'
              }`}
            >
              Presentation
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('grid')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                layoutMode === 'grid'
                  ? 'bg-[#5A5A40] text-white'
                  : 'text-[#8e8e7a] hover:text-white'
              }`}
            >
              Grid View
            </button>
          </div>

          {/* Room info info button */}
          <button
            type="button"
            onClick={() => setShowRoomInfoModal(true)}
            className="p-2 rounded-xl text-[#8e8e7a] hover:text-white hover:bg-[#26261f] border border-[#3a3a30] transition-colors"
            title="Classroom Details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Classroom Arena */}
      <div className="flex-1 flex overflow-hidden p-3 md:p-6 gap-4 relative">
        {/* Main Stage */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden min-w-0">
          {/* Stage Viewport (Presentation vs Grid) */}
          <div className="flex-1 relative rounded-3xl overflow-hidden bg-[#181814] border-2 border-[#2d2d24] shadow-2xl flex flex-col">
            {layoutMode === 'presentation' ? (
              /* Presentation Mode: Lecture Slide Deck / Diagram Presentation */
              <div className="w-full h-full flex flex-col justify-between p-6 md:p-8 bg-[#1f1f19] relative">
                {/* Slide Header */}
                <div className="flex items-start justify-between gap-4 border-b border-[#333328] pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#A67C52]">
                      Slide {currentSlideIndex + 1} of {slides.length} • {slides[currentSlideIndex].subtitle}
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-white mt-1">
                      {slides[currentSlideIndex].title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={currentSlideIndex === 0}
                      onClick={() => setCurrentSlideIndex(prev => prev - 1)}
                      className="p-2 rounded-xl bg-[#2b2b22] hover:bg-[#38382d] text-white disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-[#8e8e7a]">
                      {currentSlideIndex + 1}/{slides.length}
                    </span>
                    <button
                      type="button"
                      disabled={currentSlideIndex === slides.length - 1}
                      onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                      className="p-2 rounded-xl bg-[#2b2b22] hover:bg-[#38382d] text-white disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Slide Body: Academic Content & Diagram Representation */}
                <div className="flex-1 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4">
                    <ul className="space-y-3 text-sm md:text-base text-[#d4d4c4] leading-relaxed">
                      {slides[currentSlideIndex].bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-[#A67C52] mt-2 shrink-0"></span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Academic Diagram Canvas */}
                  <div className="bg-[#141410] rounded-2xl border border-[#333328] p-6 flex flex-col items-center justify-center relative min-h-[220px]">
                    <div className="text-center space-y-3">
                      {/* Tree diagram visualization */}
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-[#5A5A40] text-white font-bold flex items-center justify-center border-2 border-white/30 text-lg shadow-lg">
                          50
                        </div>
                        <div className="flex items-center gap-12 sm:gap-20">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="w-9 h-9 rounded-full bg-[#A67C52] text-white font-bold flex items-center justify-center text-sm shadow-md">
                              30
                            </div>
                            <div className="flex gap-4">
                              <span className="w-7 h-7 rounded-full bg-[#2d2d24] text-[#c4c4b2] text-xs font-bold flex items-center justify-center">20</span>
                              <span className="w-7 h-7 rounded-full bg-[#2d2d24] text-[#c4c4b2] text-xs font-bold flex items-center justify-center">40</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center space-y-2">
                            <div className="w-9 h-9 rounded-full bg-[#A67C52] text-white font-bold flex items-center justify-center text-sm shadow-md">
                              70
                            </div>
                            <div className="flex gap-4">
                              <span className="w-7 h-7 rounded-full bg-[#2d2d24] text-[#c4c4b2] text-xs font-bold flex items-center justify-center">60</span>
                              <span className="w-7 h-7 rounded-full bg-[#2d2d24] text-[#c4c4b2] text-xs font-bold flex items-center justify-center">80</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#8e8e7a] font-mono pt-2">
                        Figure: Balanced Binary Search Tree (Root: 50, Height: 3)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overlaid PiP: Lecturer Camera Feed */}
                <div className="absolute bottom-6 right-6 z-20 w-48 sm:w-56 aspect-video rounded-2xl overflow-hidden border-2 border-[#5A5A40] shadow-2xl bg-black">
                  <VideoTile
                    participant={lecturerParticipant}
                    isMain={false}
                    className="w-full h-full"
                  />
                </div>
              </div>
            ) : (
              /* Grid Mode: Multi-Video Tiles */
              <div className="w-full h-full p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                <VideoTile
                  participant={lecturerParticipant}
                  isMain={false}
                  isCurrentSpeaker={true}
                />
                {studentParticipants.map((participant) => (
                  <VideoTile
                    key={participant.id}
                    participant={participant}
                    isMain={false}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bottom Horizontal Student Reel (in presentation mode) */}
          {layoutMode === 'presentation' && (
            <div className="h-28 flex gap-3 overflow-x-auto pb-1 shrink-0">
              {studentParticipants.map((participant) => (
                <div key={participant.id} className="w-44 shrink-0 h-full">
                  <VideoTile
                    participant={participant}
                    isMain={false}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Bottom Meeting Controls Bar */}
          <MeetingControls onLeave={handleLeave} className="shrink-0" />
        </div>

        {/* Side Panels: Chat or Participants */}
        {isChatOpen && (
          <aside className="shrink-0 h-full">
            <ChatPanel onClose={() => setIsChatOpen(false)} />
          </aside>
        )}

        {isParticipantsOpen && (
          <aside className="shrink-0 h-full">
            <ParticipantList onClose={() => setIsParticipantsOpen(false)} />
          </aside>
        )}
      </div>

      {/* Classroom Info Modal */}
      <Modal
        isOpen={showRoomInfoModal}
        onClose={() => setShowRoomInfoModal(false)}
        title="Classroom Information & Security"
        subtitle="National Diploma II Virtual Lecture Room"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-[#f7f6f0] rounded-xl border border-[#e0e0d6] space-y-2">
            <div className="flex justify-between py-1 border-b border-[#ecece2]">
              <span className="text-[#8e8e7a]">Course:</span>
              <span className="font-bold text-[#2d2d2d]">{activeLecture?.courseCode} - {activeLecture?.courseTitle}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#ecece2]">
              <span className="text-[#8e8e7a]">Lecturer:</span>
              <span className="font-bold text-[#2d2d2d]">{activeLecture?.lecturer}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#ecece2]">
              <span className="text-[#8e8e7a]">Room Passcode:</span>
              <span className="font-mono font-bold text-[#5A5A40]">{activeLecture?.roomPasscode || 'COM221-ND2'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#8e8e7a]">Attendance Auto-Tracking:</span>
              <Badge variant="success" size="sm">Active (Polytechnic Standard)</Badge>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowRoomInfoModal(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
