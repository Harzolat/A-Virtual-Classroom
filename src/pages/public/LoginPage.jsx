import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { GraduationCap, Mail, Lock, ArrowRight, Shield, Briefcase } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('adebayo.oluwaseun@student.polytechnic.edu.ng');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    if (roleKey === 'student') {
      setEmail('adebayo.oluwaseun@student.polytechnic.edu.ng');
    } else if (roleKey === 'lecturer') {
      setEmail('adeleke.k@polytechnic.edu.ng');
    } else {
      setEmail('admin.planning@polytechnic.edu.ng');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(selectedRole);
      setLoading(false);
      navigate(`/${selectedRole}/dashboard`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#2d2d2d] flex flex-col justify-center items-center p-4 font-sans selection:bg-[#5A5A40] selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Branding header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-[#5A5A40] flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-serif font-bold text-[#5A5A40]">
                ND2 Virtual
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-[#8e8e7a]">
                Academic Portal
              </p>
            </div>
          </Link>
          <h2 className="text-2xl font-serif font-bold text-[#2d2d2d] pt-2">
            Portal Authentication
          </h2>
          <p className="text-xs text-[#7a7a6e]">
            Select your academic role to access your virtual classroom dashboard
          </p>
        </div>

        {/* Role Quick Selector */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#efefe5] rounded-2xl border border-[#e0e0d6]">
          <button
            type="button"
            onClick={() => handleRoleSelect('student')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'student'
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'text-[#666655] hover:bg-white/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('lecturer')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'lecturer'
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'text-[#666655] hover:bg-white/60'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Lecturer</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              selectedRole === 'admin'
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'text-[#666655] hover:bg-white/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Form Card */}
        <Card className="p-6 md:p-8 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label={selectedRole === 'student' ? 'Institutional Email / Matric No' : 'Staff Email / Staff ID'}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <Input
              id="password"
              label="Password / Passcode"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#666655]">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-[#5A5A40] focus:ring-[#5A5A40]"
                />
                <span>Remember me</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please contact the ICT Helpdesk at ict@polytechnic.edu.ng to reset your institutional credentials.'); }} className="text-[#5A5A40] hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <Button
              id="btn-login"
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In as {selectedRole.toUpperCase()}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#ecece2] text-center text-xs text-[#7a7a6e]">
            <span>Don't have access to the ND2 Portal? </span>
            <Link to="/register" className="font-bold text-[#5A5A40] hover:underline">
              Student Registration
            </Link>
          </div>
        </Card>

        <div className="text-center text-[11px] text-[#8e8e7a]">
          <Link to="/" className="hover:underline">
            ← Return to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
