import React from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import { Briefcase, Mail, Hash, Phone, Award, BookOpen } from 'lucide-react';

export default function LecturerProfile() {
  const { currentUser } = useAuth();

  return (
    <DashboardLayout title="Faculty Staff Profile">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 md:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar
              src={currentUser?.avatar}
              name={currentUser?.name || 'Engr. Dr. K. A. Adeleke'}
              size="2xl"
              role="lecturer"
              className="shadow-md"
            />

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Badge variant="olive" size="md">
                  Senior Faculty Lecturer
                </Badge>
                <Badge variant="clay" size="md">
                  Computer Science Department
                </Badge>
              </div>

              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2d2d2d]">
                {currentUser?.name || 'Engr. Dr. K. A. Adeleke'}
              </h2>

              <p className="text-xs md:text-sm text-[#7a7a6e]">
                Faculty of Applied Science & Technology • School of Computing
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#555544] pt-2">
                <span className="flex items-center gap-1.5 font-mono">
                  <Hash className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Staff ID: {currentUser?.staffId || 'STF/CS/2018/042'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#5A5A40]" />
                  {currentUser?.email || 'adeleke.k@polytechnic.edu.ng'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Academic Qualifications</CardTitle>
            </CardHeader>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-[#ecece2]">
                <span className="text-[#8e8e7a]">Highest Degree:</span>
                <span className="font-bold text-[#2d2d2d]">Ph.D. Computer Engineering</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#ecece2]">
                <span className="text-[#8e8e7a]">Specialization:</span>
                <span className="font-bold text-[#2d2d2d]">Data Structures & Distributed Systems</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#8e8e7a]">Professional Affiliations:</span>
                <span className="font-bold text-[#2d2d2d]">COREN, MNCS, CPN Registered</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teaching Assignments</CardTitle>
            </CardHeader>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#fafaf6] rounded-xl border border-[#e8e8dc] flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#2d2d2d] block">COM 221 - Data Structures & Algorithms</span>
                  <span className="text-[11px] text-[#8e8e7a]">ND2 Regular • 3 Credit Units</span>
                </div>
                <Badge variant="primary" size="sm">Active</Badge>
              </div>

              <div className="p-3 bg-[#fafaf6] rounded-xl border border-[#e8e8dc] flex justify-between items-center">
                <div>
                  <span className="font-bold text-[#2d2d2d] block">COM 222 - Object Oriented Programming</span>
                  <span className="text-[11px] text-[#8e8e7a]">ND2 Regular • 3 Credit Units</span>
                </div>
                <Badge variant="primary" size="sm">Active</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
