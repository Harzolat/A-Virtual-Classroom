import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Upload, FileText, Trash2, Plus, Download, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { fetchMaterials, fetchCourses, createMaterial, deleteMaterial, downloadMaterial } from '../../services/api';

export default function LecturerMaterials() {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState('');
  const [newCategory, setNewCategory] = useState('Lecture Notes');
  const [newFormat, setNewFormat] = useState('PDF');
  const [newSize, setNewSize] = useState('2.4 MB');
  const [newDescription, setNewDescription] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('https://polytechnic.edu.ng/materials/document.pdf');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [materialsData, coursesData] = await Promise.all([
        fetchMaterials(),
        fetchCourses(),
      ]);
      setMaterials(materialsData || []);
      setCourses(coursesData || []);
      if (coursesData && coursesData.length > 0) {
        setNewCourseId(coursesData[0]._id || coursesData[0].id || coursesData[0].code);
      }
    } catch (err) {
      console.error('Failed to load materials data:', err);
      setError(err.message || 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newTitle || !newCourseId) return;

    try {
      setUploading(true);
      const created = await createMaterial({
        course: newCourseId,
        title: newTitle.trim(),
        category: newCategory,
        format: newFormat,
        size: newSize || '2.5 MB',
        fileUrl: newFileUrl || 'https://polytechnic.edu.ng/materials/document.pdf',
        description: newDescription.trim(),
      });

      setMaterials([created, ...materials]);
      setNewTitle('');
      setNewDescription('');
      setShowUploadModal(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this course material from the repository?')) {
      try {
        await deleteMaterial(id);
        setMaterials(materials.filter((m) => (m._id || m.id) !== id));
      } catch (err) {
        alert(`Delete failed: ${err.message}`);
      }
    }
  };

  const handleDownload = async (mat) => {
    try {
      const matId = mat._id || mat.id;
      const res = await downloadMaterial(matId);
      // Update local download count
      setMaterials((prev) =>
        prev.map((m) =>
          (m._id || m.id) === matId ? { ...m, downloads: (m.downloads || 0) + 1 } : m
        )
      );
      if (mat.fileUrl) {
        window.open(mat.fileUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Download error:', err);
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
              Upload PDF lecture slides, syllabus documents, and laboratory source code stored directly in MongoDB.
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
            <span>Course material uploaded to database and distributed to ND2 students!</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
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
                  label="Assigned Course"
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  options={courses.map((c) => ({
                    value: c._id || c.id || c.code,
                    label: `${c.code} - ${c.title}`,
                  }))}
                  required
                />

                <Select
                  id="up-category"
                  label="Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  options={[
                    'Lecture Notes',
                    'Lab Manual',
                    'Handout',
                    'Past Questions & Solutions',
                    'Reference Guide',
                  ]}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="up-title"
                  label="Document Title"
                  placeholder="e.g. COM 221 - Binary Search Tree Rotations Handout"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />

                <Select
                  id="up-format"
                  label="Format"
                  value={newFormat}
                  onChange={(e) => setNewFormat(e.target.value)}
                  options={['PDF', 'ZIP', 'DOCX', 'PPTX']}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="up-size"
                  label="File Size"
                  placeholder="e.g. 2.4 MB"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  required
                />

                <Input
                  id="up-fileurl"
                  label="File URL"
                  placeholder="https://example.com/materials/doc.pdf"
                  value={newFileUrl}
                  onChange={(e) => setNewFileUrl(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2d2d2d] mb-1">
                  Description / Topic Scope
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-[#d8d8cc] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#A67C52] bg-[#fafaf6]"
                  placeholder="Detailed notes covering modules 1-3..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div className="border-2 border-dashed border-[#d8d8cc] rounded-2xl p-6 text-center bg-[#fafaf6]">
                <Upload className="w-8 h-8 text-[#A67C52] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#2d2d2d]">Document file verified and ready for cloud distribution</p>
                <p className="text-[11px] text-[#8e8e7a] mt-1">Supports PDF, DOCX, PPTX, ZIP (Up to 50MB)</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload & Distribute'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Existing Materials List */}
        {loading ? (
          <div className="flex items-center justify-center p-12 text-[#7a7a6e] gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-medium">Loading course materials from database...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {materials.length > 0 ? (
              materials.map((mat) => {
                const matId = mat._id || mat.id;
                const courseCode = mat.course?.code || mat.courseCode || 'COM 221';
                const uploaderName = mat.uploadedBy?.name || mat.uploadedByName || 'Faculty Member';
                const uploadDate = mat.uploadedDate ? new Date(mat.uploadedDate).toLocaleDateString() : 'Recent';

                return (
                  <Card key={matId} hoverEffect className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <Badge variant="primary" size="sm">
                          {courseCode}
                        </Badge>
                        <span className="text-[11px] font-mono text-[#8e8e7a]">
                          {mat.size || '2.0 MB'} • {mat.format || 'PDF'}
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
                            Uploaded by: {uploaderName}
                          </p>
                          <Badge variant="neutral" size="sm" className="mt-1">
                            {mat.category || 'Lecture Notes'}
                          </Badge>
                        </div>
                      </div>

                      {mat.description && (
                        <p className="text-xs text-[#7a7a6e] line-clamp-2 mb-3">
                          {mat.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#ecece2] flex items-center justify-between">
                      <span className="text-[11px] text-[#8e8e7a]">
                        {uploadDate} • {mat.downloads || 0} downloads
                      </span>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(mat)}
                          icon={Download}
                        >
                          Download
                        </Button>
                        <button
                          type="button"
                          onClick={() => handleDelete(matId)}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                          title="Delete material"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full p-8 text-center bg-[#fafaf6] rounded-2xl border border-dashed border-[#deded0]">
                <FileText className="w-8 h-8 text-[#8e8e7a] mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-[#555544]">No materials uploaded yet.</p>
                <p className="text-[11px] text-[#8e8e7a] mt-0.5">
                  Click "Upload New Material" above to upload slides, notes, or lab sheets.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
