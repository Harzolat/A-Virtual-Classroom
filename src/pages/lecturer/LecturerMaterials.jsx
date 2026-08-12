import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Upload, FileText, Trash2, Plus, Download, CheckCircle2 } from 'lucide-react';
import { MOCK_MATERIALS, MOCK_COURSES } from '../../data/mockData';

export default function LecturerMaterials() {
  const [materials, setMaterials] = useState(MOCK_MATERIALS);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('COM 221');
  const [newType, setNewType] = useState('PDF');
  const [success, setSuccess] = useState(false);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const newDoc = {
      id: `mat-${Date.now()}`,
      courseCode: newCourse,
      title: newTitle,
      type: newType,
      size: '1.8 MB',
      uploadDate: 'Just now',
      uploadedBy: 'Engr. Dr. K. A. Adeleke'
    };

    setMaterials([newDoc, ...materials]);
    setNewTitle('');
    setShowUploadModal(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this course material?')) {
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  return (
    <DashboardLayout title="Faculty Courseware Repository">
      <div className="space-y-6">
        <div className="bg-[#fdfcfb] border border-[#e0e0d6] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="primary" size="sm" className="mb-1">
              Course Repository
            </Badge>
            <h2 className="font-serif text-2xl font-bold text-[#2d2d2d]">
              Manage Course Handouts & Lab Code
            </h2>
            <p className="text-xs text-[#7a7a6e] mt-1">
              Upload PDF lecture slides, syllabus documents, and laboratory source code for student download.
            </p>
          </div>

          <Button
            variant="clay"
            size="md"
            onClick={() => setShowUploadModal(true)}
            icon={Plus}
          >
            Upload New Material
          </Button>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Course material uploaded and distributed to ND2 students!</span>
          </div>
        )}

        {/* Upload Form Modal/Card */}
        {showUploadModal && (
          <Card className="p-6 border-2 border-[#A67C52]">
            <CardHeader>
              <CardTitle>Upload New Course Material</CardTitle>
            </CardHeader>

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  id="up-course"
                  label="Course"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  options={MOCK_COURSES.map(c => ({ value: c.code, label: `${c.code} - ${c.title}` }))}
                  required
                />

                <Select
                  id="up-type"
                  label="Document Type"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  options={['PDF', 'ZIP Code Archive', 'PowerPoint Slides', 'Lab Manual']}
                  required
                />
              </div>

              <Input
                id="up-title"
                label="Document Title"
                placeholder="e.g. COM 221 - Binary Search Tree Rotations Handout"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />

              <div className="border-2 border-dashed border-[#d8d8cc] rounded-2xl p-6 text-center bg-[#fafaf6]">
                <Upload className="w-8 h-8 text-[#A67C52] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#2d2d2d]">Drag and drop your academic document here, or browse files</p>
                <p className="text-[11px] text-[#8e8e7a] mt-1">Supports PDF, DOCX, PPTX, ZIP (Up to 50MB)</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                >
                  Upload & Distribute
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Existing Materials List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {materials.map((mat) => (
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
              </div>

              <div className="pt-3 border-t border-[#ecece2] flex items-center justify-between">
                <span className="text-[11px] text-[#8e8e7a]">
                  {mat.uploadDate}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert(`Downloading "${mat.title}"...`)}
                    icon={Download}
                  >
                    View
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleDelete(mat.id)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
