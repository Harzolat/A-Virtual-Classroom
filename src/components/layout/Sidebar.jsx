import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Radio,
  FileCheck,
  FolderOpen,
  Bell,
  User,
  Settings,
  LogOut,
  Users,
  Briefcase,
  Layers,
  GraduationCap,
  PlusCircle,
  History,
  Shield,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { role, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (role === 'student') {
      return [
        { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { name: 'My Courses', path: '/student/courses', icon: BookOpen },
        { name: 'Upcoming Lectures', path: '/student/lectures', icon: Calendar },
        { name: 'Virtual Sessions', path: '/student/sessions', icon: Layers },
        { name: 'Active Classroom', path: '/meeting/room-com221-live', icon: Radio, highlight: true, badge: 'Live' },
        { name: 'Attendance', path: '/student/attendance', icon: FileCheck },
        { name: 'Materials', path: '/student/materials', icon: FolderOpen },
        { name: 'Notifications', path: '/student/notifications', icon: Bell, badge: '2' },
        { name: 'Profile', path: '/student/profile', icon: User },
        { name: 'Settings', path: '/student/settings', icon: Settings },
      ];
    } else if (role === 'lecturer') {
      return [
        { name: 'Dashboard', path: '/lecturer/dashboard', icon: LayoutDashboard },
        { name: 'My Courses', path: '/lecturer/courses', icon: BookOpen },
        { name: 'Schedule Lecture', path: '/lecturer/lectures/create', icon: PlusCircle },
        { name: 'General Sessions', path: '/lecturer/sessions', icon: Layers },
        { name: 'Active Lecture', path: '/lecturer/lectures/active', icon: Radio, highlight: true, badge: 'Live' },
        { name: 'Previous Lectures', path: '/lecturer/lectures', icon: History },
        { name: 'Attendance', path: '/lecturer/attendance', icon: FileCheck },
        { name: 'Materials', path: '/lecturer/materials', icon: FolderOpen },
        { name: 'Notifications', path: '/lecturer/notifications', icon: Bell },
        { name: 'Profile', path: '/lecturer/profile', icon: User },
        { name: 'Settings', path: '/lecturer/settings', icon: Settings },
      ];
    } else {
      // Admin
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Students', path: '/admin/students', icon: GraduationCap },
        { name: 'Lecturers', path: '/admin/lecturers', icon: Briefcase },
        { name: 'Courses', path: '/admin/courses', icon: BookOpen },
        { name: 'Enrollments', path: '/admin/enrollments', icon: Layers },
        { name: 'Lecture Sessions', path: '/admin/lectures', icon: Calendar },
        { name: 'Attendance', path: '/admin/attendance', icon: FileCheck },
        { name: 'Notifications', path: '/admin/notifications', icon: Bell },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#fdfcfb] border-r border-[#e0e0d6] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="p-6 border-b border-[#ecece2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5A5A40] flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-[#5A5A40] tracking-tight">
                ND2 Virtual
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-[#8e8e7a]">
                Academic Classroom
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#8e8e7a] hover:bg-[#efefe5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Badge Indicator */}
        <div className="px-6 py-2.5 bg-[#f7f6f0] border-b border-[#ecece2] flex items-center justify-between text-xs">
          <span className="text-[#8e8e7a] font-medium">Logged in as:</span>
          <Badge
            variant={role === 'lecturer' ? 'clay' : role === 'admin' ? 'olive' : 'primary'}
            size="sm"
          >
            {role ? role.toUpperCase() : 'STUDENT'}
          </Badge>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isItemActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                    item.highlight && !isActive
                      ? 'bg-rose-50/70 text-rose-800 border border-rose-200/80 hover:bg-rose-100/70'
                      : isActive
                      ? 'bg-[#5A5A40] text-white shadow-sm font-semibold'
                      : 'text-[#606052] hover:bg-[#efefe5] hover:text-[#2d2d2d]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isItemActive
                        ? 'bg-white/20 text-white'
                        : item.badge === 'Live'
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-[#A67C52] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 mt-auto border-t border-[#ecece2] bg-[#fafaf6]">
          <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-[#e0e0d6] mb-2 shadow-2xs">
            <Avatar
              src={currentUser?.avatar}
              name={currentUser?.name || 'User'}
              size="md"
              role={role}
              status="online"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#2d2d2d] truncate">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-[11px] text-[#8e8e7a] truncate font-mono">
                {currentUser?.matricNo || currentUser?.staffId || currentUser?.email || 'ID: 2026-ND2'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
