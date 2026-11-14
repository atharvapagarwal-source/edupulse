import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap, Users, Clock, ChevronLeft, ChevronRight,
  MoreVertical, ChevronDown, ChevronUp, CheckCircle, Video,
  Calendar, BookOpen, Sparkles, Award, ArrowUpRight
} from 'lucide-react';

interface StudentDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const [activeNavPill, setActiveNavPill] = useState('Dashboard');
  const [sessionTab, setSessionTab] = useState<'Today' | 'Upcoming'>('Today');
  const [peerPage, setPeerPage] = useState(1);
  const [expandedMeeting, setExpandedMeeting] = useState<number | null>(0);
  const [selectedDay, setSelectedDay] = useState('Mon 22');

  const navPills = [
    { label: 'Dashboard', tab: 'student-dashboard' },
    { label: 'Students', tab: 'performance' },
    { label: 'Classes', tab: 'assignments' },
    { label: 'Progress', tab: 'performance' },
    { label: 'Attendance', tab: 'performance' },
    { label: 'Tutors', tab: 'academic-support' },
    { label: 'Reports', tab: 'study-planner' },
  ];

  const peers = [
    {
      name: 'Rafi Pratama',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      program: 'English Intermediate',
      meetings: '6/12',
      progress: 60,
    },
    {
      name: 'Aulia Rahman',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      program: 'Math Fundamentals',
      meetings: '9/12',
      progress: 78,
    },
    {
      name: 'Devansh Joshi',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      program: 'Data Structures & C++',
      meetings: '10/12',
      progress: 88,
    },
    {
      name: 'Ananya Verma',
      role: 'Student',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      program: 'Computer Networks',
      meetings: '8/12',
      progress: 72,
    }
  ];

  const currentPeers = peers.slice((peerPage - 1) * 2, peerPage * 2);

  const meetings = [
    {
      id: 0,
      title: 'Live Session 1',
      subtitle: 'Math Basic: Introduce to Algebra',
      status: 'Done',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      ]
    },
    { id: 1, title: 'Weekly Meet', subtitle: 'Peer Discussion on C++ Classes', status: 'Pending' },
    { id: 2, title: 'Live Session 2', subtitle: 'TCP/IP Socket Programming Lab', status: 'Upcoming' },
    { id: 3, title: 'Live Consultation', subtitle: '1-on-1 Academic Support with Tutor', status: 'Upcoming' },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans text-[#344541]">

      {/* ==================================================================== */}
      {/* 1. TOP NAV PILLS BAR (Matching Screenshot) */}
      {/* ==================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F5F3ED] py-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {navPills.map((pill) => {
            const isActive = activeNavPill === pill.label;
            return (
              <button
                key={pill.label}
                onClick={() => {
                  setActiveNavPill(pill.label);
                  if (pill.tab !== 'student-dashboard') {
                    setCurrentTab(pill.tab);
                  }
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#173F3A] shadow-xs border border-[#DCE9E1]'
                    : 'text-[#344541]/70 hover:text-[#173F3A] hover:bg-white/50'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. GREETING HEADER WITH QUICK STATS */}
      {/* ==================================================================== */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#DCE9E1]/80 via-[#F5F3ED] to-[#DCE9E1]/50 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Good Morning, {user?.name || 'Atharva Pagarwal'} 👋
          </h2>
          <p className="text-sm text-[#344541]/75 mt-1 font-medium">
            Here's what's happening today in your academic journey
          </p>
        </div>

        {/* 3 Top Stat Counters (Matching Screenshot) */}
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#173F3A]/10 flex items-center justify-center text-[#173F3A]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#173F3A] leading-tight">18</p>
              <p className="text-[11px] font-semibold text-[#344541]/70">Active Students</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#79A995]/20 flex items-center justify-center text-[#173F3A]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#173F3A] leading-tight">8</p>
              <p className="text-[11px] font-semibold text-[#344541]/70">Tutors</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E7B978]/30 flex items-center justify-center text-[#173F3A]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#173F3A] leading-tight">76%</p>
              <p className="text-[11px] font-semibold text-[#344541]/70">Avg Prog</p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. MAIN DASHBOARD GRID */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ------------------------------------------------------------------ */}
        {/* LEFT / CENTER COLUMN (8 cols) */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-8 space-y-6">

          {/* TOP ROW: STUDENTS OVERVIEW & LEARNING PROGRESS DISTRIBUTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* A. STUDENTS OVERVIEW CARD */}
            <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#173F3A]">Students Overview</h3>
                <div className="flex items-center space-x-1.5 text-xs text-[#344541]/60 font-semibold">
                  <button
                    onClick={() => setPeerPage(1)}
                    disabled={peerPage === 1}
                    className="p-1 hover:text-[#173F3A] disabled:opacity-30"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span>{peerPage}/2</span>
                  <button
                    onClick={() => setPeerPage(2)}
                    disabled={peerPage === 2}
                    className="p-1 hover:text-[#173F3A] disabled:opacity-30"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Peer Cards */}
              <div className="grid grid-cols-2 gap-3">
                {currentPeers.map((peer, idx) => (
                  <div key={idx} className="bg-[#FAF9F5] rounded-2xl p-3 border border-[#E5E2D9] flex flex-col items-center text-center">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-[#DCE9E1] mb-2"
                    />
                    <h4 className="text-xs font-bold text-[#173F3A] truncate w-full">{peer.name}</h4>
                    <span className="text-[10px] text-[#79A995] font-semibold mt-0.5">{peer.role}</span>

                    <button
                      onClick={() => setCurrentTab('profile')}
                      className="mt-2 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#DCE9E1]/60 hover:bg-[#DCE9E1] text-[#173F3A] transition"
                    >
                      View Details
                    </button>

                    <div className="w-full mt-3 pt-2.5 border-t border-[#E5E2D9] text-left">
                      <p className="text-[10px] text-[#344541]/70 font-medium truncate">
                        Program: <span className="font-semibold text-[#173F3A]">{peer.program}</span>
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-[#344541]/60 mt-1">
                        <span>Meetings: {peer.meetings}</span>
                        <span className="font-bold text-[#79A995]">{peer.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* B. LEARNING PROGRESS DISTRIBUTION BAR CHART */}
            <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-[#173F3A]">Learning Progress Distribution</h3>
                <button
                  onClick={() => setCurrentTab('performance')}
                  className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-[#173F3A] text-white hover:bg-[#102d29] transition"
                >
                  View Details
                </button>
              </div>

              {/* Visual Pillar Bar Chart (Exact replica of screenshot) */}
              <div className="relative pt-6 pb-2">
                {/* Horizontal dotted guideline */}
                <div className="absolute inset-x-0 top-12 border-b border-dashed border-[#DCE9E1]" />
                <div className="absolute inset-x-0 top-24 border-b border-dashed border-[#DCE9E1]" />
                <div className="absolute inset-x-0 top-36 border-b border-dashed border-[#DCE9E1]" />

                <div className="flex items-end justify-between px-3 h-40 relative z-10">
                  {/* Bar 1: 0-25% */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 rounded-full bg-[#E7B978]/40 h-24 mb-2" />
                    <span className="text-[10px] font-bold text-[#344541]">0-25%</span>
                    <span className="text-[9px] text-[#344541]/50">Not started</span>
                  </div>

                  {/* Bar 2: 26-50% */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 rounded-full bg-[#E7B978] h-32 mb-2" />
                    <span className="text-[10px] font-bold text-[#344541]">26-50%</span>
                    <span className="text-[9px] text-[#344541]/50">In progress</span>
                  </div>

                  {/* Bar 3: 51-75% (Highlighted in vibrant green/sage) */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 rounded-full bg-[#79A995] h-38 mb-2 shadow-xs" />
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E7B978]" />
                      <span className="text-[10px] font-bold text-[#173F3A]">51-75%</span>
                    </div>
                    <span className="text-[9px] text-[#344541]/50">Almost there</span>
                  </div>

                  {/* Bar 4: 76-100% */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 rounded-full bg-[#E7B978]/60 h-26 mb-2" />
                    <span className="text-[10px] font-bold text-[#344541]">76-100%</span>
                    <span className="text-[9px] text-[#344541]/50">Completed</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM ROW: MEETINGS COMPLETION & SCHEDULE CALENDAR */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* C. MEETINGS COMPLETION ACCORDION (5 cols) */}
            <div className="md:col-span-5 bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs">
              <h3 className="text-sm font-bold text-[#173F3A] mb-3">Meetings Completion</h3>

              <div className="space-y-2">
                {meetings.map((m, idx) => {
                  const isExpanded = expandedMeeting === idx;
                  return (
                    <div key={idx} className="border border-[#E5E2D9] rounded-2xl overflow-hidden bg-[#FAF9F5]">
                      <button
                        onClick={() => setExpandedMeeting(isExpanded ? null : idx)}
                        className="w-full flex items-center justify-between p-3 text-left hover:bg-white transition"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-[#173F3A]">{m.title}</span>
                          {m.status === 'Done' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE9E1] text-[#173F3A]">
                              Done
                            </span>
                          )}
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-[#344541]/60" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-[#344541]/60" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-3 pt-0 border-t border-[#E5E2D9]/60">
                          <p className="text-[11px] text-[#344541]/80 font-medium mb-2.5">
                            {m.subtitle}
                          </p>
                          {m.avatars && (
                            <div className="flex items-center justify-between">
                              <div className="flex -space-x-2 overflow-hidden">
                                {m.avatars.map((av, avIdx) => (
                                  <img
                                    key={avIdx}
                                    src={av}
                                    alt="Attendee"
                                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                                  />
                                ))}
                              </div>
                              <MoreVertical className="w-3.5 h-3.5 text-[#344541]/40" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* D. SCHEDULE / CALENDAR TIMELINE (7 cols) */}
            <div className="md:col-span-7 bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs">
              {/* Month selector */}
              <div className="flex items-center justify-between text-xs font-bold text-[#344541]/50 mb-3 px-1">
                <span>August</span>
                <span className="text-[#173F3A] text-sm">September 2026</span>
                <span>October</span>
              </div>

              {/* Days header row */}
              <div className="grid grid-cols-6 gap-1 text-center mb-3">
                {['Mon 22', 'Tue 22', 'Wed 22', 'Thu 22', 'Fri 22', 'Sat 22'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`py-1.5 rounded-xl text-[10px] font-bold transition ${
                      selectedDay === d
                        ? 'bg-[#173F3A] text-white shadow-xs'
                        : 'text-[#344541]/70 hover:bg-[#F5F3ED]'
                    }`}
                  >
                    <div>{d.split(' ')[0]}</div>
                    <div className="text-xs">{d.split(' ')[1]}</div>
                  </button>
                ))}
              </div>

              {/* Time Slots & Event Blocks */}
              <div className="space-y-2.5 text-[11px] pt-1">
                {/* Slot 08:00 am */}
                <div className="flex items-center gap-3">
                  <span className="w-14 text-[10px] text-[#344541]/60 font-medium">08:00 am</span>
                  <div className="flex-1 bg-[#DCE9E1]/70 rounded-2xl p-2.5 border border-[#DCE9E1] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#173F3A] text-[11px]">Onboarding Session</p>
                      <p className="text-[10px] text-[#344541]/70">Introduce for New Students</p>
                    </div>
                    <div className="flex -space-x-1.5">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80" className="w-5 h-5 rounded-full ring-1 ring-white" alt="" />
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80" className="w-5 h-5 rounded-full ring-1 ring-white" alt="" />
                    </div>
                  </div>
                </div>

                {/* Slot 10:00 am */}
                <div className="flex items-center gap-3">
                  <span className="w-14 text-[10px] text-[#344541]/60 font-medium">10:00 am</span>
                  <div className="flex-1 h-px border-b border-dashed border-[#DCE9E1]" />
                </div>

                {/* Slot 12:00 pm */}
                <div className="flex items-center gap-3">
                  <span className="w-14 text-[10px] text-[#344541]/60 font-medium">12:00 pm</span>
                  <div className="flex-1 bg-[#79A995]/20 rounded-2xl p-2.5 border border-[#79A995]/30 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#173F3A] text-[11px]">Live Session 1</p>
                      <p className="text-[10px] text-[#344541]/70">Curriculum Overview & C++ OOPS</p>
                    </div>
                    <div className="flex -space-x-1.5">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80" className="w-5 h-5 rounded-full ring-1 ring-white" alt="" />
                      <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&auto=format&fit=crop&q=80" className="w-5 h-5 rounded-full ring-1 ring-white" alt="" />
                    </div>
                  </div>
                </div>

                {/* Slot 02:00 pm */}
                <div className="flex items-center gap-3">
                  <span className="w-14 text-[10px] text-[#344541]/60 font-medium">02:00 pm</span>
                  <div className="flex-1 h-px border-b border-dashed border-[#DCE9E1]" />
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* RIGHT COLUMN (4 cols) */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-4 space-y-6">

          {/* E. BATCH PROGRESS GAUGE CARD */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs flex flex-col items-center text-center">
            {/* Semi-circular gauge meter */}
            <div className="relative w-44 h-24 overflow-hidden mb-2">
              <svg viewBox="0 0 100 50" className="w-full h-full">
                {/* Background arc */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#DCE9E1"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Progress arc */}
                <path
                  d="M 10 50 A 40 40 0 0 1 45 13"
                  fill="none"
                  stroke="#79A995"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-x-0 bottom-0 text-center">
                <span className="text-xl font-black text-[#173F3A]">16%</span>
              </div>
            </div>
            <p className="text-xs font-bold text-[#173F3A]">Batch Progress</p>
            <p className="text-[10px] text-[#344541]/60">Semester Milestone Completion</p>
          </div>

          {/* F. LIVE SESSIONS CARD */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs">
            <h3 className="text-sm font-bold text-[#173F3A] mb-3">Live Sessions</h3>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => setSessionTab('Today')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  sessionTab === 'Today'
                    ? 'bg-[#E7B978] text-[#173F3A]'
                    : 'bg-[#FAF9F5] text-[#344541]/70 hover:bg-[#DCE9E1]'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setSessionTab('Upcoming')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  sessionTab === 'Upcoming'
                    ? 'bg-[#E7B978] text-[#173F3A]'
                    : 'bg-[#FAF9F5] text-[#344541]/70 hover:bg-[#DCE9E1]'
                }`}
              >
                Upcoming
              </button>
            </div>

            {/* Session Items */}
            <div className="space-y-3">
              {/* Item 1 */}
              <div className="bg-[#FAF9F5] rounded-2xl p-3 border border-[#E5E2D9]">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-[#173F3A]">Math Basic</h4>
                  <span className="text-[10px] text-[#344541]/60">Monday, 15:30-17:30</span>
                </div>
                {/* Thumbnail banner */}
                <div className="h-16 rounded-xl bg-gradient-to-r from-[#173F3A] to-[#285f58] p-2 flex items-center justify-center text-white mb-2 overflow-hidden relative">
                  <div className="text-center font-mono text-xs opacity-90">
                    {"∫ (x² + 4x) dx = x³/3 + 2x²"}
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#344541]/70 font-medium">12 Students</span>
                  <span className="font-bold text-[#173F3A]">Tutor: Adi</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-[#FAF9F5] rounded-2xl p-3 border border-[#E5E2D9]">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-[#173F3A]">English Intermediate</h4>
                  <span className="text-[10px] text-[#344541]/60">Friday, 15:30-17:30</span>
                </div>
                <div className="h-16 rounded-xl bg-gradient-to-r from-[#79A995] to-[#DCE9E1] p-2 flex items-center justify-center text-[#173F3A] mb-2 overflow-hidden font-bold text-xs tracking-wider">
                  LEARN • COMMUNICATE • GROW
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#344541]/70 font-medium">12 Students</span>
                  <span className="font-bold text-[#173F3A]">Tutor: Oriza</span>
                </div>
              </div>
            </div>
          </div>

          {/* G. ATTENDANCE OVERVIEW CARD */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs">
            <h3 className="text-sm font-bold text-[#173F3A] mb-3">Attendance Overview</h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#344541]">Present :</span>
                  <span className="font-bold text-[#173F3A]">92%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAF9F5] border border-[#E5E2D9] overflow-hidden">
                  <div className="h-full bg-[#79A995] rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#344541]">Absent :</span>
                  <span className="font-bold text-[#E7B978]">26%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAF9F5] border border-[#E5E2D9] overflow-hidden">
                  <div className="h-full bg-[#E7B978] rounded-full" style={{ width: '26%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#344541]">Permission :</span>
                  <span className="font-bold text-[#79A995]">30%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAF9F5] border border-[#E5E2D9] overflow-hidden">
                  <div className="h-full bg-[#DCE9E1] rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
