import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import Avatar from './Avatar';
import { BookOpen, User, Video, FileText, ArrowRight } from 'lucide-react';

export default function CourseCard({
  course,
  role = 'student',
  onView,
  className = ''
}) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (onView) {
      onView(course);
    } else {
      const targetRole = role === 'lecturer' ? 'lecturer' : role === 'admin' ? 'admin' : 'student';
      navigate(`/${targetRole}/courses/${course.id}`);
    }
  };

  return (
    <Card hoverEffect className={`flex flex-col justify-between ${className}`}>
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <Badge variant="primary" size="md">
              {course.code}
            </Badge>
            <span className="text-xs text-[#8e8e7a] ml-2 font-medium">
              {course.creditUnit} Credit Units
            </span>
          </div>
          {course.nextLecture?.status === 'Live Now' && (
            <Badge variant="live" size="sm" dot pulse>
              Live Class
            </Badge>
          )}
        </div>

        {/* Title */}
        <h4 className="font-serif text-lg font-bold text-[#2d2d2d] leading-snug line-clamp-2 mb-2">
          {course.title}
        </h4>

        <p className="text-xs text-[#7a7a6e] line-clamp-2 mb-4 leading-relaxed">
          {course.description}
        </p>

        {/* Lecturer Info */}
        <div className="flex items-center gap-2.5 py-2.5 px-3 bg-[#f5f5ee] rounded-xl border border-[#e8e8dc] mb-4">
          <Avatar
            src={course.lecturerAvatar}
            name={course.lecturer}
            size="sm"
            role="lecturer"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#2d2d2d] truncate">{course.lecturer}</p>
            <p className="text-[11px] text-[#8e8e7a] truncate">{course.department}</p>
          </div>
        </div>

        {/* Progress Bar (for students) */}
        {role === 'student' && typeof course.progress === 'number' && (
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-[#8e8e7a]">Syllabus Progress</span>
              <span className="text-[#5A5A40] font-bold">{course.progress}%</span>
            </div>
            <div className="w-full h-2 bg-[#e8e8dc] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5A5A40] rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs text-[#7a7a6e] pt-2 border-t border-[#ecece2] mb-4">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>{course.totalLectures || 12} Lectures</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#A67C52]" />
            <span>{course.materialsCount || 6} Materials</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2">
        <Button
          variant="outline"
          size="md"
          className="w-full justify-between group"
          onClick={handleNavigate}
          icon={ArrowRight}
          iconPosition="right"
        >
          View Course Details
        </Button>
      </div>
    </Card>
  );
}
