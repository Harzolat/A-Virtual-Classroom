import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import Avatar from './Avatar';
import { Video, Mic, Calendar, Clock, Users, ArrowRight, Radio, Info, Layers } from 'lucide-react';

export default function SessionCard({
  session,
  role = 'student',
  onJoin,
  onViewDetails,
  className = ''
}) {
  const navigate = useNavigate();

  if (!session) return null;

  const isLive = session.status === 'live' || session.status === 'Live Now';
  const isPast = session.status === 'completed' || session.status === 'Completed';

  const handleJoin = () => {
    if (onJoin) {
      onJoin(session);
    } else if (session.meetingId) {
      navigate(`/meeting/${session.meetingId}`);
    } else {
      navigate('/meeting/room-general');
    }
  };

  const isVoiceOnly = session.mode === 'voice' || session.type === 'Voice';

  return (
    <Card
      className={`border-2 transition-all hover:shadow-md ${
        isLive
          ? 'border-amber-500/80 bg-[#fffdfa] shadow-xs'
          : 'border-[#e0e0d6] bg-[#fdfcfb]'
      } ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left info column */}
        <div className="space-y-2.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category badge */}
            <Badge variant="clay" size="sm" className="font-semibold">
              <Layers className="w-3 h-3" />
              {session.category || 'General Session'}
            </Badge>

            {/* Communication Mode badge */}
            {isVoiceOnly ? (
              <Badge variant="warning" size="sm" className="gap-1 bg-amber-100 text-amber-900 border-amber-200">
                <Mic className="w-3 h-3 text-amber-800" /> 🎙️ Voice Only
              </Badge>
            ) : (
              <Badge variant="info" size="sm" className="gap-1 bg-sky-100 text-sky-900 border-sky-200">
                <Video className="w-3 h-3 text-sky-800" /> 🎥 Video Session
              </Badge>
            )}

            {/* Status indicator */}
            {isLive ? (
              <Badge variant="live" size="sm" dot pulse className="bg-rose-600 text-white border-rose-400 font-bold px-2.5">
                LIVE NOW
              </Badge>
            ) : isPast ? (
              <Badge variant="neutral" size="sm">
                Completed
              </Badge>
            ) : (
              <Badge variant="secondary" size="sm" className="bg-[#efefe5] text-[#555544]">
                Scheduled
              </Badge>
            )}
          </div>

          <div>
            <h4
              onClick={() => onViewDetails && onViewDetails(session)}
              className={`font-serif text-lg font-bold text-[#2d2d2d] leading-snug ${
                onViewDetails ? 'cursor-pointer hover:text-[#5A5A40] transition-colors' : ''
              }`}
            >
              {session.title}
            </h4>
            {session.description && (
              <p className="text-xs text-[#7a7a6e] line-clamp-2 mt-1 leading-relaxed">
                {session.description}
              </p>
            )}
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#606052] pt-1">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>{session.dateFormatted || session.date}</span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>
                {session.startTime} - {session.endTime || ''} ({session.duration || '60 mins'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Avatar
                src={session.lecturerAvatar}
                name={session.lecturer || 'Host'}
                size="xs"
                role="lecturer"
              />
              <span className="font-medium text-[#2d2d2d]">{session.lecturer || 'Faculty Member'}</span>
            </div>

            {typeof session.attendeesCount === 'number' && (
              <div className="flex items-center gap-1 text-[#8e8e7a]">
                <Users className="w-3.5 h-3.5" />
                <span>
                  {isLive
                    ? `${session.attendeesCount} Attending`
                    : isPast
                    ? `${session.attendeesCount} Attended`
                    : `Max ${session.maxCapacity || 50}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Action column */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#ecece2]">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(session)}
              icon={Info}
            >
              {isPast ? 'View Summary' : 'View Details'}
            </Button>
          )}

          {isLive ? (
            <Button
              variant="danger"
              size="md"
              onClick={handleJoin}
              icon={Radio}
              className="animate-pulse shadow-sm bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              {role === 'lecturer' ? 'Enter Virtual Classroom' : 'Join Virtual Session'}
            </Button>
          ) : isPast ? (
            !onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Session record completed.')}
              >
                View Summary
              </Button>
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
