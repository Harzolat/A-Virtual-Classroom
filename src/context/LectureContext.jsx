import React, { createContext, useContext, useState } from 'react';
import { MOCK_LECTURES, MOCK_COURSES } from '../data/mockData';

const LectureContext = createContext(null);

export function LectureProvider({ children }) {
  const [lectures, setLectures] = useState(MOCK_LECTURES);

  const addLecture = (newLectureData) => {
    const matchedCourse = MOCK_COURSES.find(c => c.code === newLectureData.courseCode) || MOCK_COURSES[0];
    const safeCode = (newLectureData.courseCode || 'com221').toLowerCase().replace(/[^a-z0-9]/g, '');
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const meetingId = `room-${safeCode}-${timestamp}-${randomSuffix}`;
    const rawDate = newLectureData.date || new Date().toISOString().split('T')[0];

    // Format date string for display (e.g., "Thu, Aug 20, 2026")
    let formattedDate = rawDate;
    try {
      if (rawDate) {
        const parsedDate = new Date(rawDate + 'T00:00:00');
        if (!isNaN(parsedDate.getTime())) {
          formattedDate = parsedDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        }
      }
    } catch (err) {
      formattedDate = rawDate;
    }

    // Format 12-hour time helper (e.g. "10:00" -> "10:00 AM", "14:30" -> "2:30 PM")
    const formatTime12h = (timeStr, defaultFallback) => {
      if (!timeStr) return defaultFallback;
      if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
        return timeStr;
      }
      const parts = timeStr.split(':');
      if (parts.length < 2) return timeStr;
      let h = parseInt(parts[0], 10);
      if (isNaN(h)) return timeStr;
      const m = parts[1].slice(0, 2);
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      return `${h}:${m} ${ampm}`;
    };

    const formattedStartTime = formatTime12h(newLectureData.startTime, '10:00 AM');
    const formattedEndTime = formatTime12h(newLectureData.endTime, '12:00 PM');

    const newLecture = {
      id: `lec-created-${timestamp}-${randomSuffix}`,
      courseId: matchedCourse?.id || 'com-221',
      courseCode: newLectureData.courseCode || matchedCourse?.code || 'COM 221',
      courseTitle: matchedCourse?.title || 'Data Structures & Algorithms',
      title: newLectureData.title ? newLectureData.title.trim() : 'Untitled Session',
      description: newLectureData.description ? newLectureData.description.trim() : '',
      lecturer: newLectureData.lecturer || matchedCourse?.lecturer || 'Engr. Dr. K. A. Adeleke',
      lecturerId: newLectureData.lecturerId || matchedCourse?.lecturerId || 'lec-1',
      lecturerAvatar: newLectureData.lecturerAvatar || matchedCourse?.lecturerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      date: rawDate,
      dateFormatted: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      duration: '120 mins',
      type: newLectureData.type === 'Voice' ? 'Voice' : 'Video',
      status: 'Scheduled',
      meetingId: meetingId,
      attendeesCount: 0,
      maxCapacity: 150,
      roomPasscode: newLectureData.roomPasscode || `${safeCode.toUpperCase()}-ROOM`,
      allowStudentScreenShare: true,
      recordSession: true,
      autoAttendance: true,
      resources: [],
      ...newLectureData
    };

    // Ensure formatted values override raw inputs
    newLecture.id = `lec-created-${timestamp}-${randomSuffix}`;
    newLecture.meetingId = meetingId;
    newLecture.dateFormatted = formattedDate;
    newLecture.startTime = formattedStartTime;
    newLecture.endTime = formattedEndTime;
    newLecture.status = 'Scheduled';

    setLectures((prev) => [newLecture, ...prev]);
    return newLecture;
  };

  return (
    <LectureContext.Provider value={{ lectures, addLecture }}>
      {children}
    </LectureContext.Provider>
  );
}

export function useLectures() {
  const context = useContext(LectureContext);
  if (!context) {
    throw new Error('useLectures must be used within a LectureProvider');
  }
  return context;
}
