import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle } from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Download, FileText, Search, FolderOpen, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { fetchMaterials, fetchCourses, downloadMaterial } from '../../services/api';

export default function StudentMaterials() {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCourse, setSelectedCourse] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
    } catch (err) {
      console.error('Failed to fetch materials:', err);
      setError(err.message || 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (mat) => {
    try {
      const matId = mat._id || mat.id;
      await downloadMaterial(matId);
      // Increment local count
      setMaterials((prev) =>
        prev.map((m) =>
          (m._id || m.id) === matId ? { ...m, downloads: (m.downloads || 0) + 1 } : m
        )
      );
      if (mat.fileUrl) {
        window.open(mat.fileUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Failed to record download:', err);
    }
  };

  const filteredMaterials = materials.filter((mat) => {
    const courseCode = mat.course?.code || mat.courseCode || '';
    const uploader = mat.uploadedBy?.name || mat.uploadedByName || '';
    const title = mat.title || '';
    const category = mat.category || '';

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uploader.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse =
      selectedCourse === 'all' ||
      courseCode.toLowerCase() === selectedCourse.toLowerCase() ||
      mat.course?._id === selectedCourse;

    const matchesCategory =
      selectedCategory === 'all' || category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCourse && matchesCategory;
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

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

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

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-52">
              <Select
                id="course-filter"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                options={[
                  { value: 'all', label: 'All Courses' },
                  ...courses.map((c) => ({
                    value: c.code,
                    label: `${c.code} - ${c.title}`,
                  })),
                ]}
              />
            </div>

            <div className="w-full sm:w-44">
              <Select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'Lecture Notes', label: 'Lecture Notes' },
                  { value: 'Lab Manual', label: 'Lab Manual' },
                  { value: 'Handout', label: 'Handout' },
                  { value: 'Past Questions & Solutions', label: 'Past Questions' },
                  { value: 'Reference Guide', label: 'Reference Guide' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-12 text-[#7a7a6e] gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-medium">Loading materials repository from database...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((mat) => {
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

                      <p className="text-xs text-[#7a7a6e] line-clamp-2 mb-4">
                        {mat.description || 'Verified course handout adhering to polytechnic curriculum.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#ecece2] flex items-center justify-between">
                      <span className="text-[11px] text-[#8e8e7a]">
                        {uploadDate} • {mat.downloads || 0} downloads
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(mat)}
                        icon={Download}
                      >
                        Download File
                      </Button>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full p-8 text-center bg-[#fafaf6] rounded-2xl border border-dashed border-[#deded0]">
                <FileText className="w-8 h-8 text-[#8e8e7a] mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-[#555544]">No materials match your filter criteria.</p>
                <p className="text-[11px] text-[#8e8e7a] mt-0.5">
                  Try adjusting the search query or course filter.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
