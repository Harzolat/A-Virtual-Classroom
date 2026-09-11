// API client with credentials support

export async function loginApi(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function logoutApi() {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Logout failed');
  return data;
}

export async function getMeApi() {
  const res = await fetch('/api/auth/me', {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch user profile');
  return data.user;
}

// Courses
export async function fetchCourses() {
  const res = await fetch('/api/courses', {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch courses');
  return data.data;
}

export async function fetchCourseById(courseId: string) {
  const res = await fetch(`/api/courses/${courseId}`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch course');
  return data.data;
}

// Lectures
export async function fetchLectures() {
  const res = await fetch('/api/lectures', {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch lectures');
  return data.data;
}

export async function fetchLectureById(lectureId: string) {
  const res = await fetch(`/api/lectures/${lectureId}`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch lecture');
  return data.data;
}

export async function createLectureApi(lectureData: any) {
  const res = await fetch('/api/lectures', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(lectureData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create lecture');
  return data.data;
}

export async function updateLectureStatusApi(lectureId: string, status: string) {
  const res = await fetch(`/api/lectures/${lectureId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update lecture status');
  return data.data;
}

// Materials
export async function fetchMaterials() {
  const res = await fetch('/api/materials', {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch materials');
  return data.data;
}

export async function fetchMaterialsByCourse(courseId: string) {
  const res = await fetch(`/api/materials/course/${courseId}`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch course materials');
  return data.data;
}

export async function createMaterial(materialData: {
  course: string;
  title: string;
  category: string;
  format: string;
  size: string;
  fileUrl: string;
  description?: string;
}) {
  const res = await fetch('/api/materials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(materialData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to upload material');
  return data.data;
}

export async function updateMaterial(
  materialId: string,
  materialData: {
    title?: string;
    category?: string;
    format?: string;
    size?: string;
    fileUrl?: string;
    description?: string;
  }
) {
  const res = await fetch(`/api/materials/${materialId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(materialData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update material');
  return data.data;
}

export async function deleteMaterial(materialId: string) {
  const res = await fetch(`/api/materials/${materialId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete material');
  return data;
}

export async function downloadMaterial(materialId: string) {
  const res = await fetch(`/api/materials/${materialId}/download`, {
    method: 'POST',
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to download material');
  return data.data;
}

// ----------------------------------------------------
// GENERAL VIRTUAL SESSIONS API
// ----------------------------------------------------

export async function fetchGeneralSessions() {
  const res = await fetch('/api/general-sessions', { credentials: 'include' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch general sessions');
  return data.data;
}

export async function fetchGeneralSessionById(sessionId: string) {
  const res = await fetch(`/api/general-sessions/${sessionId}`, { credentials: 'include' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch general session');
  return data.data;
}

export async function createGeneralSession(sessionData: {
  title: string;
  category: string;
  description?: string;
  scheduledDate: string | Date;
  startTime: string;
  endTime: string;
  durationMinutes?: number;
  mode: string;
  status?: string;
  meetingId?: string;
  maxCapacity?: number;
  allowStudentScreenShare?: boolean;
  recordSession?: boolean;
  autoAttendance?: boolean;
}) {
  const res = await fetch('/api/general-sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(sessionData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create general session');
  return data.data;
}

export async function updateGeneralSession(
  sessionId: string,
  sessionData: {
    title?: string;
    category?: string;
    description?: string;
    scheduledDate?: string | Date;
    startTime?: string;
    endTime?: string;
    durationMinutes?: number;
    mode?: string;
    status?: string;
    meetingId?: string;
    maxCapacity?: number;
    allowStudentScreenShare?: boolean;
    recordSession?: boolean;
    autoAttendance?: boolean;
  }
) {
  const res = await fetch(`/api/general-sessions/${sessionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(sessionData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update general session');
  return data.data;
}

export async function deleteGeneralSession(sessionId: string) {
  const res = await fetch(`/api/general-sessions/${sessionId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete general session');
  return data;
}

// Attendance APIs (Phase 1H)
export async function recordAttendance(attendanceData: {
  studentId?: string;
  courseId?: string;
  lectureId?: string;
  generalSessionId?: string;
  date?: string | Date;
  timeJoined?: string | Date;
  timeLeft?: string | Date;
  durationMinutes?: number;
  status?: string;
  reason?: string;
}) {
  const res = await fetch('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(attendanceData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to record attendance');
  return data.data;
}

export async function leaveAttendance(
  attendanceId: string,
  leaveData?: {
    timeLeft?: string | Date;
    status?: string;
    reason?: string;
  }
) {
  const res = await fetch(`/api/attendance/${attendanceId}/leave`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(leaveData || {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update leave attendance');
  return data.data;
}

export async function fetchAttendanceById(attendanceId: string) {
  const res = await fetch(`/api/attendance/${attendanceId}`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch attendance record');
  return data.data;
}

export async function fetchLectureAttendance(lectureId: string) {
  const res = await fetch(`/api/attendance/lecture/${lectureId}`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch lecture attendance');
  return data.data;
}

export async function fetchSessionAttendance(sessionId: string) {
  const res = await fetch(`/api/attendance/session/${sessionId}`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch session attendance');
  return data.data;
}

export async function fetchStudentAttendance(studentId: string, courseId?: string) {
  const url = courseId
    ? `/api/attendance/student/${studentId}?courseId=${courseId}`
    : `/api/attendance/student/${studentId}`;
  const res = await fetch(url, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch student attendance');
  return data.data;
}

export async function fetchCourseAttendance(courseId: string) {
  const res = await fetch(`/api/attendance/course/${courseId}`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch course attendance');
  return data.data;
}

export async function fetchStudentAttendanceStats(studentId: string) {
  const res = await fetch(`/api/attendance/student/${studentId}/stats`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch student attendance statistics');
  return data.data;
}

export async function fetchCourseAttendanceStats(courseId: string) {
  const res = await fetch(`/api/attendance/course/${courseId}/stats`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch course attendance statistics');
  return data.data;
}

export async function fetchAdminAttendanceAudit() {
  const res = await fetch('/api/attendance/audit', {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch attendance compliance audit');
  return data.data;
}

// ----------------------------------------------------
// PHASE 1I: VIRTUAL CLASSROOM SESSION PARTICIPATION API
// ----------------------------------------------------

export async function joinSession(
  type: 'lecture' | 'general-session' | string,
  id: string,
  payload?: { status?: string; reason?: string }
) {
  const res = await fetch(`/api/sessions/${type}/${encodeURIComponent(id)}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to join virtual classroom session');
  return data;
}

export async function leaveSession(
  type: 'lecture' | 'general-session' | string,
  id: string,
  payload?: { timeLeft?: Date | string; reason?: string }
) {
  const res = await fetch(`/api/sessions/${type}/${encodeURIComponent(id)}/leave`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to leave virtual classroom session');
  return data;
}

export async function fetchSessionParticipants(
  type: 'lecture' | 'general-session' | string,
  id: string
) {
  const res = await fetch(`/api/sessions/${type}/${encodeURIComponent(id)}/participants`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch session participants');
  return data.data;
}

export async function fetchMySessionStatus(
  type: 'lecture' | 'general-session' | string,
  id: string
) {
  const res = await fetch(`/api/sessions/${type}/${encodeURIComponent(id)}/my-status`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch participation status');
  return data.data;
}



