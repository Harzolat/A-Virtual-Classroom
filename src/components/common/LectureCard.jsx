import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import Avatar from './Avatar';
import { Video, Mic, Calendar, Clock, Users, ArrowRight, Radio, Info, Bell, Check } from 'lucide-react';

export default function LectureCard({
  lecture,
  role = 'student',
  onJoin,
  onViewDetails,
  onToggleReminder,
  isReminded = false,
  className = ''
}) {
  const navigate = useNavigate();

  const isLive = lecture.status === 'Live Now';
  const isPast = lecture.status === 'Completed';

  const handleJoin = () => {
    if (onJoin) {
      onJoin(lecture);
    } else {
      navigate(`/meeting/${lecture.meetingId || 'room-nd2'}`);
    }
  };

  return (
    <Card
      className={`border-2 transition-all hover:shadow-md ${
        isLive
          ? 'border-rose-400/80 bg-[#fffdfa] shadow-xs'
          : 'border-[#e0e0d6] bg-[#fdfcfb]'
      } ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left info */}
        <div className="space-y-2.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="sm">
              {lecture.courseCode}
            </Badge>

            {lecture.type === 'Video' ? (
              <Badge variant="info" size="sm" className="gap-1">
                <Video className="w-3 h-3" /> Video Lecture
              </Badge>
            ) : lecture.type === 'Voice' ? (
              <Badge variant="warning" size="sm" className="gap-1">
                <Mic className="w-3 h-3" /> Voice Session
              </Badge>
            ) : (
              <Badge variant="clay" size="sm" className="gap-1">
                <Users className="w-3 h-3" /> Physical / Practical
              </Badge>
            )}

            {isLive ? (
              <Badge variant="live" size="sm" dot pulse>
                LIVE NOW
              </Badge>
            ) : isPast ? (
              <Badge variant="neutral" size="sm">
                Completed
              </Badge>
            ) : (
              <Badge variant="clay" size="sm">
                Scheduled
              </Badge>
            )}
          </div>

          <div>
            <h4
              onClick={() => onViewDetails && onViewDetails(lecture)}
              className={`font-serif text-lg font-bold text-[#2d2d2d] leading-snug ${
                onViewDetails ? 'cursor-pointer hover:text-[#5A5A40] transition-colors' : ''
              }`}
            >
              {lecture.title}
            </h4>
            <p className="text-xs text-[#7a7a6e] line-clamp-1 mt-0.5 font-medium">
              {lecture.courseTitle}
            </p>
          </div>

          {/* Schedule details & Lecturer */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#555544]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span className="font-medium">{lecture.dateFormatted || lecture.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>{lecture.startTime} - {lecture.endTime} ({lecture.duration})</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar
                src={lecture.lecturerAvatar}
                name={lecture.lecturer}
                size="xs"
                role="lecturer"
              />
              <span className="font-medium text-[#2d2d2d]">{lecture.lecturer}</span>
            </div>
            {typeof lecture.attendeesCount === 'number' && (
              <div className="flex items-center gap-1 text-[#8e8e7a]">
                <Users className="w-3.5 h-3.5" />
                <span>
                  {isLive
                    ? `${lecture.attendeesCount} Joined`
                    : isPast
                    ? `${lecture.attendeesCount} Attended`
                    : `${lecture.maxCapacity || 150} Capacity`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#ecece2]">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(lecture)}
              icon={Info}
            >
              {isPast ? 'View Summary' : 'View Details'}
            </Button>
          )}

          {!isLive && !isPast && onToggleReminder && (
            <Button
              variant={isReminded ? 'secondary' : 'clay'}
              size="sm"
              onClick={() => onToggleReminder(lecture)}
              icon={isReminded ? Check : Bell}
              className={isReminded ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : ''}
            >
              {isReminded ? 'Reminder Set' : 'Add Reminder'}
            </Button>
          )}

          {isLive ? (
            <Button
              variant="danger"
              size="md"
              onClick={handleJoin}
              icon={Radio}
              className="animate-pulse shadow-md"
            >
              {role === 'lecturer' ? 'Enter Classroom (Host)' : 'Join Virtual Classroom'}
            </Button>
          ) : isPast ? (
            !onViewDetails && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Attendance recorded: ${lecture.attendanceRecorded || '92%'}`)}
                >
                  View Attendance
                </Button>
                {lecture.hasRecording && (
                  <Button
                    variant="clay"
                    size="sm"
                    onClick={() => alert('Accessing archived lecture recording...')}
                  >
                    Watch Recording
                  </Button>
                )}
              </div>
            )
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleJoin}
              icon={ArrowRight}
              iconPosition="right"
            >
              {role === 'lecturer' ? 'Start Session' : 'Ready to Join'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
