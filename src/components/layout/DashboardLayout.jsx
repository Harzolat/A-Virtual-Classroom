import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import RoleSwitcher from './RoleSwitcher';

export default function DashboardLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#2d2d2d] flex flex-col font-sans">
      {/* Interactive Role Switcher Banner */}
      <RoleSwitcher />

      <div className="flex-1 flex w-full relative">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area (offset by sidebar width on desktop) */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
          <Navbar onOpenSidebar={() => setSidebarOpen(true)} title={title} />

          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
