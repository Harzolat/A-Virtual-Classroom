import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Download, FileText, Search, FolderOpen, ExternalLink } from 'lucide-react';
import { MOCK_MATERIALS, MOCK_COURSES } from '../../data/mockData';

export default function StudentMaterials() {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMaterials = MOCK_MATERIALS.filter((mat) => {
    const matchesSearch =
      mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || mat.courseCode === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <DashboardLayout title="Courseware & Learning Materials">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Badge variant="clay" size="sm" className="mb-1">
              Course Repository
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Lecture Handouts & Lab Manuals
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Download verified lecture slides, C/C++ lab code, and database schemas uploaded by lecturers.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              id="material-search"
              placeholder="Search by topic, document name, lecturer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>

          <div className="w-full sm:w-64">
            <Select
              id="course-filter"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              options={[
                { value: 'all', label: 'All Courses' },
                ...MOCK_COURSES.map((c) => ({ value: c.code, label: `${c.code} - ${c.title}` }))
              ]}
            />
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((mat) => (
            <Card key={mat.id} hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="primary" size="sm">
                    {mat.courseCode}
                  </Badge>
                  <span className="text-[11px] font-mono text-[#8e8e7a]">
                    {mat.size}
                  </span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f4ebe1] text-[#A67C52] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#2d2d2d] leading-snug line-clamp-2">
                      {mat.title}
                    </h4>
                    <p className="text-[11px] text-[#7a7a6e] mt-0.5">
                      Uploaded by: {mat.uploadedBy}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#7a7a6e] line-clamp-2 mb-4">
                  {mat.description || 'Verified course handout adhering to polytechnic curriculum.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#ecece2] flex items-center justify-between">
                <span className="text-[11px] text-[#8e8e7a]">
                  {mat.uploadDate}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Downloading "${mat.title}" (${mat.size})...`)}
                  icon={Download}
                >
                  Download File
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
