import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import {
  GraduationCap,
  Video,
  Radio,
  BookOpen,
  FileCheck,
  FolderOpen,
  ArrowRight,
  Shield,
  Clock,
  Award,
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleQuickRole = (roleKey) => {
    login(roleKey);
    navigate(`/${roleKey}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#2d2d2d] flex flex-col font-sans selection:bg-[#5A5A40] selection:text-white">
      {/* Top Academic Navigation */}
      <header className="border-b border-[#e0e0d6] bg-[#fdfcfb]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#5A5A40] flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-[#5A5A40] tracking-tight">
                ND2 Virtual Classroom
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-[#8e8e7a]">
                Polytechnic Academic Platform
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#555544]">
            <a href="#features" className="hover:text-[#5A5A40] transition-colors">Features</a>
            <a href="#curriculum" className="hover:text-[#5A5A40] transition-colors">ND2 Curriculum</a>
            <a href="#about" className="hover:text-[#5A5A40] transition-colors">About</a>
            <button
              type="button"
              onClick={() => navigate('/about')}
              className="hover:text-[#5A5A40] transition-colors"
            >
              Requirements
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/register')}
            >
              Portal Registration
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eaeae0] border border-[#d8d8c8] text-[#5A5A40] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#5A5A40] animate-pulse"></span>
              <span>2nd Semester 2024/2025 Academic Session</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#2d2d2d] leading-[1.15] tracking-tight">
              Virtual Lectures & Real-Time Classroom for <span className="text-[#5A5A40] italic">ND2 Students</span>
            </h2>

            <p className="text-base md:text-lg text-[#666655] leading-relaxed max-w-2xl">
              A comprehensive academic ecosystem connecting National Diploma Year 2 students with faculty lecturers. Live video classrooms, interactive slide presentations, real-time attendance compliance tracking, and course repository access.
            </p>

            {/* Quick Demo Role Cards */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#8e8e7a] mb-3">
                Select a role to test the prototype:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickRole('student')}
                  className="p-4 rounded-2xl bg-[#fdfcfb] hover:bg-[#eaeae0] border border-[#e0e0d6] text-left transition-all group shadow-xs hover:border-[#5A5A40]"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#eaeae0] group-hover:bg-[#5A5A40] group-hover:text-white flex items-center justify-center text-[#5A5A40] mb-2 transition-colors">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-[#2d2d2d]">Student Portal</h4>
                  <p className="text-[11px] text-[#7a7a6e] mt-0.5">Adebayo Oluwaseun (CS)</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickRole('lecturer')}
                  className="p-4 rounded-2xl bg-[#fdfcfb] hover:bg-[#f4ebd0] border border-[#e0e0d6] text-left transition-all group shadow-xs hover:border-[#A67C52]"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#f4ebe1] group-hover:bg-[#A67C52] group-hover:text-white flex items-center justify-center text-[#A67C52] mb-2 transition-colors">
                    <Video className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-[#2d2d2d]">Lecturer Portal</h4>
                  <p className="text-[11px] text-[#7a7a6e] mt-0.5">Engr. Dr. K. Adeleke</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickRole('admin')}
                  className="p-4 rounded-2xl bg-[#fdfcfb] hover:bg-[#eaeae0] border border-[#e0e0d6] text-left transition-all group shadow-xs hover:border-[#5A5A40]"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#eaeae0] group-hover:bg-[#5A5A40] group-hover:text-white flex items-center justify-center text-[#5A5A40] mb-2 transition-colors">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-[#2d2d2d]">Admin Console</h4>
                  <p className="text-[11px] text-[#7a7a6e] mt-0.5">Academic Planning</p>
                </button>
              </div>
            </div>

            {/* Direct Classroom CTA */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/meeting/room-com221-live')}
                icon={Radio}
                className="shadow-md"
              >
                Join Live Lecture (COM 221)
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
              >
                Sign In to Dashboard
              </Button>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Outer decorative border */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#5A5A40]/20 to-[#A67C52]/20 rounded-3xl blur-sm -z-10"></div>

              <div className="bg-[#fdfcfb] border-2 border-[#e0e0d6] rounded-3xl p-6 shadow-xl space-y-5">
                {/* Live Lecture Card Preview */}
                <div className="flex items-center justify-between pb-4 border-b border-[#ecece2]">
                  <div className="flex items-center gap-2">
                    <Badge variant="live" size="sm" dot pulse>
                      ACTIVE LECTURE
                    </Badge>
                    <span className="text-xs text-[#8e8e7a] font-mono">COM 221</span>
                  </div>
                  <span className="text-xs font-bold text-[#5A5A40]">42 Students Present</span>
                </div>

                <div className="rounded-2xl overflow-hidden bg-[#1a1a15] aspect-video relative flex items-center justify-center p-4 border border-[#38382e]">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-full bg-[#A67C52] text-white font-serif font-bold text-xl flex items-center justify-center mx-auto border-2 border-white/20">
                      KA
                    </div>
                    <p className="text-white text-xs font-semibold">Engr. Dr. K. A. Adeleke</p>
                    <p className="text-white/60 text-[10px]">Binary Search Trees & Traversal Algorithms</p>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px]">
                    🎤 Audio: Active
                  </div>
                </div>

                {/* Quick stats mini grid */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-3 bg-[#f5f5ee] rounded-xl border border-[#e8e8dc]">
                    <p className="text-xs font-bold text-[#5A5A40]">91.5%</p>
                    <p className="text-[10px] text-[#8e8e7a]">Attendance</p>
                  </div>
                  <div className="p-3 bg-[#f5f5ee] rounded-xl border border-[#e8e8dc]">
                    <p className="text-xs font-bold text-[#5A5A40]">6 Courses</p>
                    <p className="text-[10px] text-[#8e8e7a]">Registered</p>
                  </div>
                  <div className="p-3 bg-[#f5f5ee] rounded-xl border border-[#e8e8dc]">
                    <p className="text-xs font-bold text-[#A67C52]">3.68</p>
                    <p className="text-[10px] text-[#8e8e7a]">Current CGPA</p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/meeting/room-com221-live')}
                  className="w-full"
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Enter Virtual Classroom Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Modules Section */}
      <section id="features" className="py-16 bg-[#eaeae0]/50 border-t border-[#e0e0d6]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="clay" size="md" className="mb-3">
              Polytechnic Standards
            </Badge>
            <h3 className="text-3xl font-serif font-bold text-[#2d2d2d] tracking-tight">
              Designed for Higher Technical Education
            </h3>
            <p className="text-xs md:text-sm text-[#7a7a6e] mt-2 leading-relaxed">
              Every feature aligns with National Board for Technical Education (NBTE) guidelines for National Diploma curriculum delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#2d2d2d]">Virtual Video & Voice Lecture Room</h4>
              <p className="text-xs text-[#7a7a6e] leading-relaxed">
                High-definition live video feeds with presentation slides, student hand-raising, in-session moderated text chat, and screen sharing.
              </p>
            </Card>

            <Card className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#A67C52] text-white flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#2d2d2d]">75% Attendance Compliance</h4>
              <p className="text-xs text-[#7a7a6e] leading-relaxed">
                Automated session tracking logs join time and duration for every lecture, computing eligibility thresholds for semester exams.
              </p>
            </Card>

            <Card className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center">
                <FolderOpen className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#2d2d2d]">Courseware & Lab Manuals</h4>
              <p className="text-xs text-[#7a7a6e] leading-relaxed">
                Download verified lecture slides, C/C++ lab manuals, hardware troubleshooting flowcharts, and SQL normalization notes.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#fdfcfb] border-t border-[#e0e0d6] py-10 px-4 md:px-8 text-xs text-[#7a7a6e]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#5A5A40]" />
            <span className="font-serif font-bold text-sm text-[#5A5A40]">ND2 Virtual Classroom</span>
          </div>
          <p>© 2026 Directorate of Academic Planning & ICT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
