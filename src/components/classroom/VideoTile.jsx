import React from 'react';
import { Mic, MicOff, Video, VideoOff, Hand, Radio, Wifi } from 'lucide-react';
import Avatar from '../common/Avatar';

export default function VideoTile({
  participant,
  isMain = false,
  isCurrentSpeaker = false,
  className = ''
}) {
  const {
    name,
    role,
    isHost,
    isMuted,
    isVideoOn,
    hasHandRaised,
    avatar,
    networkQuality = 'excellent'
  } = participant;

  return (
    <div
      className={`relative rounded-2xl overflow-hidden bg-[#1a1a15] border-2 transition-all flex items-center justify-center select-none shadow-md ${
        isCurrentSpeaker
          ? 'border-[#A67C52] ring-2 ring-[#A67C52]/40'
          : hasHandRaised
          ? 'border-amber-400 ring-2 ring-amber-400/40'
          : 'border-[#38382e]'
      } ${isMain ? 'w-full h-full min-h-[360px]' : 'w-full aspect-video min-h-[140px]'} ${className}`}
    >
      {/* Video Stream simulation or Avatar fallback */}
      {isVideoOn ? (
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#26261f] via-[#1a1a15] to-[#12120e] flex items-center justify-center">
          {/* Subtle simulated classroom video feed styling */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#A67C52_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="text-center z-10 p-4">
            <div className="relative inline-block mb-3">
              <Avatar
                src={avatar}
                name={name}
                size={isMain ? '2xl' : 'lg'}
                role={role?.toLowerCase()}
                className="border-2 border-white/20 shadow-xl"
              />
              {isHost && (
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-[#5A5A40] text-white text-[9px] font-bold rounded-md uppercase">
                  Lecturer
                </span>
              )}
            </div>
            <p className="text-white/80 text-xs font-medium">
              {isHost ? 'Lecturer Live Stream Active' : 'Student Video Feed Active'}
            </p>
          </div>
        </div>
      ) : (
        /* Video Off Avatar view */
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#151512] p-4">
          <Avatar
            src={avatar}
            name={name}
            size={isMain ? 'xl' : 'md'}
            role={role?.toLowerCase()}
            className="border-2 border-white/10 mb-2"
          />
          <span className="text-[11px] text-white/50 font-medium">Camera Off</span>
        </div>
      )}

      {/* Top Left: Role / Name Tag */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
        <div className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[11px] font-medium border border-white/15 flex items-center gap-1.5 shadow-sm">
          {isHost && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
          <span className="truncate max-w-[140px]">{name}</span>
          {isHost && <span className="text-[10px] text-[#e0e0d6] font-serif italic">(Host)</span>}
        </div>
      </div>

      {/* Top Right: Hand Raised Indicator */}
      {hasHandRaised && (
        <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg animate-bounce">
          <span>✋ Hand Raised</span>
        </div>
      )}

      {/* Bottom Left: Audio Status & Network */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
        <div
          className={`p-1.5 rounded-lg backdrop-blur-md border ${
            isMuted
              ? 'bg-rose-900/80 text-rose-200 border-rose-700/50'
              : 'bg-black/60 text-white border-white/15'
          }`}
          title={isMuted ? 'Muted' : 'Microphone Active'}
        >
          {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
        </div>

        <div className="bg-black/60 backdrop-blur-md text-white/70 p-1.5 rounded-lg border border-white/15" title={`Connection: ${networkQuality}`}>
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>
    </div>
  );
}
