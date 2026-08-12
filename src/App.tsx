import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClassroomProvider } from './context/ClassroomContext';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AboutPage from './pages/public/AboutPage';

// Virtual Classroom
import VirtualClassroomPage from './pages/classroom/VirtualClassroomPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentCourseDetails from './pages/student/StudentCourseDetails';
import StudentLectures from './pages/student/StudentLectures';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentMaterials from './pages/student/StudentMaterials';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentProfile from './pages/student/StudentProfile';
import StudentSettings from './pages/student/StudentSettings';

// Lecturer Pages
import LecturerDashboard from './pages/lecturer/LecturerDashboard';
import LecturerCourses from './pages/lecturer/LecturerCourses';
import LecturerScheduleLecture from './pages/lecturer/LecturerScheduleLecture';
import LecturerActiveLecture from './pages/lecturer/LecturerActiveLecture';
import LecturerPreviousLectures from './pages/lecturer/LecturerPreviousLectures';
import LecturerAttendance from './pages/lecturer/LecturerAttendance';
import LecturerMaterials from './pages/lecturer/LecturerMaterials';
import LecturerNotifications from './pages/lecturer/LecturerNotifications';
import LecturerProfile from './pages/lecturer/LecturerProfile';
import LecturerSettings from './pages/lecturer/LecturerSettings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminLecturers from './pages/admin/AdminLecturers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminEnrollments from './pages/admin/AdminEnrollments';
import AdminLectures from './pages/admin/AdminLectures';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <AuthProvider>
      <ClassroomProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Virtual Classroom Route */}
            <Route path="/meeting/:meetingId" element={<VirtualClassroomPage />} />

            {/* Student Routes */}
            <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<StudentCourses />} />
            <Route path="/student/courses/:courseId" element={<StudentCourseDetails />} />
            <Route path="/student/lectures" element={<StudentLectures />} />
            <Route path="/student/attendance" element={<StudentAttendance />} />
            <Route path="/student/materials" element={<StudentMaterials />} />
            <Route path="/student/notifications" element={<StudentNotifications />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/settings" element={<StudentSettings />} />

            {/* Lecturer Routes */}
            <Route path="/lecturer" element={<Navigate to="/lecturer/dashboard" replace />} />
            <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
            <Route path="/lecturer/courses" element={<LecturerCourses />} />
            <Route path="/lecturer/lectures/create" element={<LecturerScheduleLecture />} />
            <Route path="/lecturer/lectures/active" element={<LecturerActiveLecture />} />
            <Route path="/lecturer/lectures" element={<LecturerPreviousLectures />} />
            <Route path="/lecturer/attendance" element={<LecturerAttendance />} />
            <Route path="/lecturer/materials" element={<LecturerMaterials />} />
            <Route path="/lecturer/notifications" element={<LecturerNotifications />} />
            <Route path="/lecturer/profile" element={<LecturerProfile />} />
            <Route path="/lecturer/settings" element={<LecturerSettings />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<AdminStudents />} />
            <Route path="/admin/lecturers" element={<AdminLecturers />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/enrollments" element={<AdminEnrollments />} />
            <Route path="/admin/lectures" element={<AdminLectures />} />
            <Route path="/admin/attendance" element={<AdminAttendance />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ClassroomProvider>
    </AuthProvider>
  );
}
