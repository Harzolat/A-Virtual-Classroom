import React, { useState, useRef, useEffect } from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { Send, Pin, Sparkles, Smile, X } from 'lucide-react';

export default function ChatPanel({ onClose }) {
  const { currentUser, role } = useAuth();
  const { chatMessages, sendMessage, pinnedAnnouncement } = useClassroom();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const quickPrompts = [
    'Sir, could you please repeat the last point?',
    'Audio and screen are clear.',
    'I have a question about the assignment.'
  ];

  return (
    <div className="w-80 sm:w-96 h-full bg-[#fdfcfb] rounded-3xl border border-[#e0e0d6] flex flex-col shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#ecece2] flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-base text-[#2d2d2d] flex items-center gap-2">
            <span>Classroom Chat</span>
            <Badge variant="clay" size="sm">
              Live Discussion
            </Badge>
          </h3>
          <p className="text-[11px] text-[#8e8e7a] mt-0.5">
            Academic Q&A & Lecture Notes
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8e8e7a] hover:bg-[#efefe5] rounded-xl"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Pinned Announcement */}
      {pinnedAnnouncement && (
        <div className="p-3 bg-[#fbf5ee] border-b border-[#ebdccd] flex items-start gap-2 text-xs">
          <Pin className="w-3.5 h-3.5 text-[#A67C52] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-[#A67C52] text-[10px] uppercase tracking-wider block">
              Lecturer Announcement
            </span>
            <p className="text-[#694d32] text-xs leading-snug">{pinnedAnnouncement}</p>
          </div>
        </div>
      )}

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.map((msg) => {
          const isLecturer = msg.senderRole === 'Lecturer';
          const isMe = msg.senderName.includes('(You)') || msg.senderId === currentUser?.id;

          return (
            <div
              key={msg.id}
              className={`p-3 rounded-2xl border transition-all ${
                isLecturer
                  ? 'bg-[#f7f6f0] border-[#d8d8c8] rounded-tl-none'
                  : isMe
                  ? 'bg-[#fafaf6] border-[#e0e0d6] rounded-tr-none ml-2'
                  : 'bg-white border-[#ecece2] rounded-tl-none mr-2'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`text-[11px] font-bold truncate ${
                      isLecturer ? 'text-[#5A5A40]' : isMe ? 'text-[#A67C52]' : 'text-[#2d2d2d]'
                    }`}
                  >
                    {msg.senderName}
                  </span>
                  {isLecturer && (
                    <span className="text-[9px] bg-[#5A5A40] text-white px-1.5 py-0.2 rounded font-semibold uppercase">
                      Lecturer
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#8e8e7a] shrink-0 font-mono">
                  {msg.time}
                </span>
              </div>

              <p className="text-xs text-[#3a3a30] leading-relaxed break-words">
                {msg.text}
              </p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-1.5 bg-[#f7f6f0] border-t border-[#ecece2] flex gap-1.5 overflow-x-auto text-[11px]">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => sendMessage(prompt)}
            className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white border border-[#e0e0d6] text-[#5A5A40] hover:bg-[#eaeae0] transition-colors truncate max-w-[200px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#ecece2]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question or response..."
            className="w-full bg-[#f5f5f0] rounded-2xl pl-4 pr-12 py-2.5 text-xs text-[#2d2d2d] placeholder-[#8e8e7a] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] border border-transparent focus:border-[#5A5A40]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-1.5 p-2 bg-[#5A5A40] hover:bg-[#484832] disabled:opacity-40 disabled:hover:bg-[#5A5A40] text-white rounded-xl transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
