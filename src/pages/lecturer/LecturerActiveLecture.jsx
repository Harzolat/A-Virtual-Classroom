import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import { Radio, Users, Video, Mic, Share2, Shield, PhoneOff, ArrowRight, RefreshCw } from 'lucide-react';
import { MOCK_CLASSROOM_PARTICIPANTS } from '../../data/mockData';
import { fetchSessionParticipants } from '../../services/api';

export default function LecturerActiveLecture() {
  const navigate = useNavigate();
  const [liveData, setLiveData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadParticipants = async () => {
    try {
      setIsLoading(true);
      const data = await fetchSessionParticipants('lecture', 'room-com221-live');
      if (data) {
        setLiveData(data);
      }
    } catch {
      // Graceful fallback for preview / offline
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  const participants = liveData?.participants && liveData.participants.length > 0
    ? liveData.participants.map(p => ({
        id: p.attendanceId || p.studentId,
        name: p.name,
        matricNo: p.matricNo,
        role: 'student',
        avatar: p.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        status: p.status,
        isActive: p.isActive,
      }))
    : MOCK_CLASSROOM_PARTICIPANTS;

  const activeCount = liveData?.activeCount ?? 42;
  const totalCount = liveData?.totalParticipants ?? 42;

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
              {activeCount} ND2 Students Currently Connected • Elapsed Time: 34 mins • Cloud Archival Running
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={loadParticipants}
              icon={RefreshCw}
              className="bg-white/80 text-rose-900 border-rose-200 hover:bg-white"
            >
              Sync Roster
            </Button>
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
        </div>

        {/* Live Metrics & Participant Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#2d2d2d]">Attendance Real-Time</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-[#5A5A40]">{activeCount}</span>
              <span className="text-xs text-[#8e8e7a]">/ 45 Enrolled Students ({((activeCount / 45) * 100).toFixed(1)}%)</span>
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
            <div className="flex items-center justify-between">
              <CardTitle>Active Connected Classmates ({participants.length})</CardTitle>
              {liveData && (
                <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Live Attendance Synchronized
                </span>
              )}
            </div>
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
                {p.status ? (
                  <Badge variant={p.status === 'Present' ? 'success' : 'warning'} size="xs">
                    {p.status}
                  </Badge>
                ) : p.hasHandRaised ? (
                  <Badge variant="warning" size="sm">Hand Up</Badge>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
