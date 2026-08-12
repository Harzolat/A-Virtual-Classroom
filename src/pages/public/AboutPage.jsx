import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { GraduationCap, ShieldCheck, CheckCircle2, Award, Cpu, BookOpen, ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#2d2d2d] py-12 px-4 md:px-8 font-sans selection:bg-[#5A5A40] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            icon={ArrowLeft}
          >
            Back to Home
          </Button>

          <Badge variant="primary" size="md">
            NBTE Standard Compliant
          </Badge>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#2d2d2d]">
            About ND2 Virtual Classroom Platform
          </h1>
          <p className="text-sm text-[#7a7a6e] leading-relaxed">
            The ND2 Virtual Classroom is a specialized academic learning management and real-time lecture communication system engineered specifically for National Diploma II students and lecturers in polytechnics and technical colleges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2d2d2d]">Institutional Objectives</h3>
            <p className="text-xs text-[#7a7a6e] leading-relaxed">
              Bridge the physical classroom barrier, allowing students to access continuous curriculum lectures, submit laboratory reports, track mandatory 75% examination attendance requirements, and interact directly with accredited faculty.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#A67C52] text-white flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#2d2d2d]">Technical Architecture</h3>
            <p className="text-xs text-[#7a7a6e] leading-relaxed">
              Constructed with a modern React SPA client with responsive grid layouts, WebSocket/WebRTC communication structures, and modular role-based permission tiers (Student, Lecturer, Academic Administrator).
            </p>
          </Card>
        </div>

        <Card className="p-8 space-y-4">
          <h3 className="font-serif font-bold text-xl text-[#2d2d2d]">System Requirements & Guidelines</h3>
          <ul className="space-y-2.5 text-xs text-[#555544]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
              <span>Recommended Browser: Google Chrome, Mozilla Firefox, or Microsoft Edge (WebRTC enabled).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
              <span>Minimum Attendance Requirement: Students must maintain ≥75% lecture participation to qualify for semester examinations.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
              <span>Identity Verification: Valid polytechnic matriculation number and institutional domain email are required for all accounts.</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
