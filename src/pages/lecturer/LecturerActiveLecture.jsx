import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import { Radio, Users, Video, Mic, Share2, Shield, PhoneOff, ArrowRight } from 'lucide-react';
import { MOCK_CLASSROOM_PARTICIPANTS } from '../../data/mockData';

export default function LecturerActiveLecture() {
  const navigate = useNavigate();
  const participants = MOCK_CLASSROOM_PARTICIPANTS;

  return (
    <DashboardLayout title="Active Classroom Control Room">
      <div className="space-y-6">
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="live" size="md" dot pulse>
                LIVE HOST SESSION
              </Badge>
              <Badge variant="primary" size="md">
                COM 221
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-rose-950">
              Binary Search Trees & Tree Traversal Algorithms
            </h2>
            <p className="text-xs md:text-sm text-rose-800">
              42 ND2 Students Currently Connected • Elapsed Time: 34 mins • Cloud Archival Running
            </p>
          </div>

          <Button
            variant="danger"
            size="lg"
            onClick={() => navigate('/meeting/room-com221-live')}
            icon={ArrowRight}
            iconPosition="right"
            className="shadow-lg"
          >
            Launch Virtual Classroom Arena
          </Button>
        </div>

        {/* Live Metrics & Participant Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#2d2d2d]">Attendance Real-Time</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#5A5A40]">42</span>
              <span className="text-xs text-[#8e8e7a]">/ 45 Enrolled Students (93.3%)</span>
            </div>
            <p className="text-xs text-emerald-700 font-semibold">✓ Compliant with NBTE Roster</p>
          </Card>

          <Card className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#2d2d2d]">Engagement Signals</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#A67C52]">2</span>
              <span className="text-xs text-[#8e8e7a]">Students with Hand Raised</span>
            </div>
            <p className="text-xs text-[#7a7a6e]">Ibrahim Musa, Chukwuemeka Eze</p>
          </Card>

          <Card className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#2d2d2d]">Network Stream Status</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-emerald-700">1080p</span>
              <span className="text-xs text-[#8e8e7a]">30 FPS HD WebRTC</span>
            </div>
            <p className="text-xs text-[#7a7a6e]">Bandwidth: 1.8 Mbps stable</p>
          </Card>
        </div>

        {/* Live Student Grid Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Active Connected Classmates</CardTitle>
          </CardHeader>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {participants.map((p) => (
              <div
                key={p.id}
                className="p-3 bg-[#fafaf6] rounded-2xl border border-[#e8e8dc] text-center flex flex-col items-center space-y-1.5"
              >
                <Avatar
                  src={p.avatar}
                  name={p.name}
                  size="md"
                  role={p.role?.toLowerCase()}
                />
                <p className="text-xs font-bold text-[#2d2d2d] truncate w-full">{p.name}</p>
                <p className="text-[10px] font-mono text-[#8e8e7a] truncate w-full">{p.matricNo || p.role}</p>
                {p.hasHandRaised && (
                  <Badge variant="warning" size="sm">Hand Up</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
