import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import { GraduationCap, Briefcase, Shield, ArrowRight } from 'lucide-react';

export default function RoleSwitcher({ className = '' }) {
  const { role, switchRole, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (targetRole) => {
    switchRole(targetRole);
    navigate(`/${targetRole}/dashboard`);
  };

  return (
    <div className={`bg-[#efefe5] border-b border-[#e0e0d6] px-4 py-2 flex flex-wrap items-center justify-between text-xs gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[#5A5A40] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
          <span className="w-2 h-2 rounded-full bg-[#5A5A40]"></span>
          ND2 Interactive Prototype:
        </span>
        <span className="text-[#7a7a6e] hidden sm:inline">
          Switch role to test tailored portal experiences:
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => handleRoleSelect('student')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            role === 'student'
              ? 'bg-[#5A5A40] text-white shadow-xs'
              : 'bg-white/80 hover:bg-white text-[#555544] border border-[#e0e0d6]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Student</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect('lecturer')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            role === 'lecturer'
              ? 'bg-[#5A5A40] text-white shadow-xs'
              : 'bg-white/80 hover:bg-white text-[#555544] border border-[#e0e0d6]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Lecturer</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleSelect('admin')}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            role === 'admin'
              ? 'bg-[#5A5A40] text-white shadow-xs'
              : 'bg-white/80 hover:bg-white text-[#555544] border border-[#e0e0d6]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      </div>
    </div>
  );
}
