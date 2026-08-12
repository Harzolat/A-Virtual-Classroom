import React, { createContext, useContext, useState } from 'react';
import { MOCK_CLASSROOM_PARTICIPANTS, MOCK_CLASSROOM_CHAT, MOCK_LECTURES } from '../data/mockData';
import { useAuth } from './AuthContext';

const ClassroomContext = createContext(null);

export function ClassroomProvider({ children }) {
  const { currentUser, role } = useAuth();
  const isLecturer = role === 'lecturer' || role === 'admin';

  // Room metadata
  const [activeLecture, setActiveLecture] = useState(MOCK_LECTURES[0]);
  const [isClassActive, setIsClassActive] = useState(true);
  const [sessionTimeElapsed, setSessionTimeElapsed] = useState('00:34:12');

  // Media Controls State
  const [isMicMuted, setIsMicMuted] = useState(isLecturer ? false : true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(isLecturer ? true : false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [layoutMode, setLayoutMode] = useState('presentation'); // 'grid' | 'speaker' | 'presentation'

  // Panels State
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Participants & Chat State
  const [participants, setParticipants] = useState(MOCK_CLASSROOM_PARTICIPANTS);
  const [chatMessages, setChatMessages] = useState(MOCK_CLASSROOM_CHAT);
  const [pinnedAnnouncement, setPinnedAnnouncement] = useState(
    'Please keep microphones muted unless called upon to ask a question.'
  );

  // Toggle user audio
  const toggleMic = () => {
    setIsMicMuted(prev => !prev);
  };

  // Toggle user video
  const toggleVideo = () => {
    setIsVideoOn(prev => !prev);
  };

  // Toggle screen share
  const toggleScreenShare = () => {
    setIsScreenSharing(prev => !prev);
    if (!isScreenSharing) {
      setLayoutMode('presentation');
    }
  };

  // Toggle hand raise
  const toggleHandRaise = () => {
    const nextState = !isHandRaised;
    setIsHandRaised(nextState);
    
    // update participant list for current user
    setParticipants(prev =>
      prev.map(p => {
        if (p.id === 'part-1' || p.name.includes('(You)')) {
          return { ...p, hasHandRaised: nextState };
        }
        return p;
      })
    );
  };

  // Send message
  const sendMessage = (text) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || 'part-you',
      senderName: currentUser?.name || 'User',
      senderRole: role === 'lecturer' ? 'Lecturer' : role === 'admin' ? 'Admin' : 'Student',
      senderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      text: text.trim(),
      time: timeString
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  // Lecturer host actions
  const muteAllStudents = () => {
    setParticipants(prev =>
      prev.map(p => (p.isHost ? p : { ...p, isMuted: true }))
    );
  };

  const lowerAllHands = () => {
    setIsHandRaised(false);
    setParticipants(prev =>
      prev.map(p => ({ ...p, hasHandRaised: false }))
    );
  };

  const lowerStudentHand = (participantId) => {
    setParticipants(prev =>
      prev.map(p => (p.id === participantId ? { ...p, hasHandRaised: false } : p))
    );
    if (participantId === 'part-1') {
      setIsHandRaised(false);
    }
  };

  const toggleParticipantMic = (participantId) => {
    setParticipants(prev =>
      prev.map(p => (p.id === participantId ? { ...p, isMuted: !p.isMuted } : p))
    );
  };

  const endLecture = () => {
    setIsClassActive(false);
  };

  return (
    <ClassroomContext.Provider
      value={{
        activeLecture,
        setActiveLecture,
        isClassActive,
        sessionTimeElapsed,
        isMicMuted,
        isVideoOn,
        isScreenSharing,
        isHandRaised,
        layoutMode,
        setLayoutMode,
        isChatOpen,
        setIsChatOpen,
        isParticipantsOpen,
        setIsParticipantsOpen,
        isWhiteboardOpen,
        setIsWhiteboardOpen,
        isNotesOpen,
        setIsNotesOpen,
        participants,
        chatMessages,
        pinnedAnnouncement,
        setPinnedAnnouncement,
        toggleMic,
        toggleVideo,
        toggleScreenShare,
        toggleHandRaise,
        sendMessage,
        muteAllStudents,
        lowerAllHands,
        lowerStudentHand,
        toggleParticipantMic,
        endLecture
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
}

export function useClassroom() {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error('useClassroom must be used within a ClassroomProvider');
  }
  return context;
}
