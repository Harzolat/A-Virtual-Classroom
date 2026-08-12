import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { Menu, Bell, Search, Radio, ChevronDown, CheckCircle } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';

export default function Navbar({ onOpenSidebar, title = 'Academic Portal' }) {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  return (
    <header className="h-16 px-4 md:px-8 flex items-center justify-between border-b border-[#e0e0d6] bg-[#fdfcfb]/80 backdrop-blur-md sticky top-0 z-30">
      {/* Left side: Mobile Toggle + Page Title / Course */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-[#5A5A40] hover:bg-[#efefe5] transition-colors"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="font-serif text-base md:text-lg font-bold text-[#2d2d2d] leading-tight">
            {title}
          </h2>
          <p className="text-[11px] text-[#8e8e7a] hidden sm:block">
            ND2 Computer Science • 2nd Semester 2024/2025
          </p>
        </div>
      </div>

      {/* Right side: Search, Live Class CTA, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Active Class Pill */}
        <button
          type="button"
          onClick={() => navigate('/meeting/room-com221-live')}
          className="hidden sm:flex items-center gap-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all animate-pulse shadow-2xs"
        >
          <span className="w-2 h-2 bg-rose-600 rounded-full"></span>
          <span>COM 221 Live Now</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2.5 rounded-xl text-[#5A5A40] hover:bg-[#efefe5] transition-colors relative border border-[#e0e0d6] bg-[#fdfcfb]"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-[#e0e0d6] shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-[#ecece2] mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-sm text-[#2d2d2d]">Notifications</h4>
                  <Badge variant="clay" size="sm">{unreadCount} New</Badge>
                </div>
                <button
                  type="button"
                  onClick={() => setUnreadCount(0)}
                  className="text-[11px] text-[#5A5A40] hover:underline font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {MOCK_NOTIFICATIONS.slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setShowNotifMenu(false);
                      navigate(n.actionUrl || `/${role}/notifications`);
                    }}
                    className="p-2.5 rounded-xl bg-[#fafaf6] hover:bg-[#f2f2eb] border border-[#e8e8dc] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-bold text-[#2d2d2d] line-clamp-1">{n.title}</span>
                      <span className="text-[10px] text-[#8e8e7a] shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-[#666655] line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 mt-2 border-t border-[#ecece2] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifMenu(false);
                    navigate(`/${role}/notifications`);
                  }}
                  className="text-xs font-semibold text-[#5A5A40] hover:underline"
                >
                  View All Academic Notices →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div
          onClick={() => navigate(`/${role}/profile`)}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl bg-[#efefe5]/70 hover:bg-[#efefe5] border border-[#e0e0d6] cursor-pointer transition-colors"
        >
          <Avatar
            src={currentUser?.avatar}
            name={currentUser?.name || 'User'}
            size="sm"
            role={role}
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-[#2d2d2d] leading-none">
              {currentUser?.name?.split(' ')[0] || 'User'}
            </p>
            <p className="text-[10px] text-[#8e8e7a] capitalize mt-0.5">
              {role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
