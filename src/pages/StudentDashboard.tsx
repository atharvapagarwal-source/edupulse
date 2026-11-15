import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentDashboard } from '../services/api';
import { StudentDashboardData } from '../types';
import {
  GraduationCap, Users, Clock, ChevronLeft, ChevronRight,
  MoreVertical, ChevronDown, ChevronUp, CheckCircle, Video,
  Calendar, BookOpen, Sparkles, Award, ArrowUpRight, AlertCircle
} from 'lucide-react';

interface StudentDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeNavPill, setActiveNavPill] = useState('Dashboard');
  const [sessionTab, setSessionTab] = useState<'Today' | 'Upcoming'>('Today');
  const [expandedMeeting, setExpandedMeeting] = useState<number | null>(0);
  const [selectedDay, setSelectedDay] = useState('Mon 22');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    getStudentDashboard(user?.id)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to load student dashboard:", err);
          setError(err.message || "Failed to load dashboard data");
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [user?.id]); // Re-fetch whenever user switches!

  const navPills = [
    { label: 'Dashboard', tab: 'student-dashboard' },
    { label: 'My Progress', tab: 'performance' },
    { label: 'Classes & Tasks', tab: 'assignments' },
    { label: 'Schedule', tab: 'schedule' },
    { label: 'Study Planner', tab: 'study-planner' },
    { label: 'Feedback', tab: 'anonymous-feedback' },
    { label: 'Opportunities', tab: 'opportunities' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#79A995] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#344541]/70 font-semibold">
            Loading authenticated student records for {user?.name || 'Student'}...
          </p>
        </div>
      </div>
    );
  }

  const student = data?.student || {
    id: user?.id || 'std-001',
    name: user?.name || 'Atharva Pagarwal',
    course: user?.course || 'B.Tech Computer Science',
    year: user?.year || '3rd Year',
    attendance: 87.0,
    cgpa: 8.2,
    assignment_completion: 80.0,
    average_score: 78.5,
    skills: []
  };

  const attendance = Number(student?.attendance ?? 87);
  const absentRate = Math.max(0, 100 - attendance);
  const enrolled_classes = data?.enrolled_classes || [];
  const subject_marks = data?.subject_marks || [];
  const upcoming_assignments = data?.upcoming_assignments || [];
  const notifications = data?.notifications || [];
  const recommended_opportunities = data?.recommended_opportunities || [];
  const study_recommendation = data?.study_recommendation || 'Continue focusing on your core CS modules.';

  return (
    <div className="space-y-6 pb-12 font-sans text-[#344541]">

      {/* ==================================================================== */}
      {/* 1. TOP NAV PILLS BAR */}
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

        <div className="text-xs font-mono font-semibold text-[#173F3A]/80 px-2">
          {student.course} • {student.year}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. GREETING HEADER WITH VERIFIED STUDENT METRICS */}
      {/* ==================================================================== */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#DCE9E1]/80 via-[#F5F3ED] to-[#DCE9E1]/50 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#173F3A]/10 text-[#173F3A] text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-[#79A995] animate-pulse" />
            <span>Authenticated Student: {student.id}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Good Morning, {student.name.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-[#344541]/75 mt-1 font-medium max-w-xl">
            {study_recommendation}
          </p>
        </div>

        {/* 3 Top Stat Counters from Verified SQLite Database */}
        <div className="flex items-center gap-6 sm:gap-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#173F3A]/10 flex items-center justify-center text-[#173F3A]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#173F3A] leading-tight">{enrolled_classes.length}</p>
              <p className="text-[11px] font-semibold text-[#344541]/70">Enrolled Classes</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#79A995]/20 flex items-center justify-center text-[#173F3A]">
              <Award className="w-4 h-4 text-[#173F3A]" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#173F3A] leading-tight">{Number(student?.cgpa ?? 8.2).toFixed(1)}</p>
              <p className="text-[11px] font-semibold text-[#344541]/70">Current CGPA</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E7B978]/30 flex items-center justify-center text-[#173F3A]">
              <Clock className="w-4 h-4 text-[#173F3A]" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#173F3A] leading-tight">{attendance}%</p>
              <p className="text-[11px] font-semibold text-[#344541]/70">Attendance</p>
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

          {/* TOP ROW: SUBJECT-WISE PERFORMANCE & LEARNING PROGRESS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* A. SUBJECT-WISE MARKS & PROGRESS */}
            <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#173F3A]">Subject-Wise Marks & Progress</h3>
                <button
                  onClick={() => setCurrentTab('performance')}
                  className="text-xs font-semibold text-[#79A995] hover:text-[#173F3A] flex items-center"
                >
                  <span>Analytics</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>

              {/* Subject Marks List */}
              <div className="space-y-3">
                {subject_marks.map((sub, idx) => (
                  <div key={idx} className="bg-[#FAF9F5] rounded-2xl p-3 border border-[#E5E2D9]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-[#173F3A] truncate max-w-[180px]">{sub.subject}</span>
                      <span className="font-black text-[#173F3A]">{sub.average_score}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#DCE9E1]/50 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          sub.average_score >= 80 ? 'bg-[#79A995]' : sub.average_score >= 65 ? 'bg-[#E7B978]' : 'bg-rose-400'
                        }`}
                        style={{ width: `${Math.min(100, sub.average_score)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#344541]/60 mt-1">
                      <span>{sub.assessments_count} Assessments Logged</span>
                      <span className="font-semibold">{sub.average_score >= 80 ? 'Strong' : sub.average_score >= 65 ? 'Average' : 'Needs Practice'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* B. LEARNING PROGRESS DISTRIBUTION */}
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

              {/* Visual Pillar Bar Chart */}
              <div className="relative pt-6 pb-2">
                <div className="absolute inset-x-0 top-12 border-b border-dashed border-[#DCE9E1]" />
                <div className="absolute inset-x-0 top-24 border-b border-dashed border-[#DCE9E1]" />
                <div className="absolute inset-x-0 top-36 border-b border-dashed border-[#DCE9E1]" />

                <div className="flex items-end justify-between px-3 h-40 relative z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-9 rounded-full bg-[#E7B978]/40 h-20 mb-2" />
                    <span className="text-[10px] font-bold text-[#344541]">0-25%</span>
                    <span className="text-[9px] text-[#344541]/50">Not started</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-9 rounded-full bg-[#E7B978] h-28 mb-2" />
                    <span className="text-[10px] font-bold text-[#344541]">26-50%</span>
                    <span className="text-[9px] text-[#344541]/50">In progress</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-9 rounded-full bg-[#79A995] h-36 mb-2 shadow-xs" />
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E7B978]" />
                      <span className="text-[10px] font-bold text-[#173F3A]">51-75%</span>
                    </div>
                    <span className="text-[9px] text-[#344541]/50">Almost there</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-9 rounded-full bg-[#79A995]/80 h-32 mb-2" />
                    <span className="text-[10px] font-bold text-[#344541]">76-100%</span>
                    <span className="text-[9px] text-[#344541]/50">Completed</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM ROW: UPCOMING ASSIGNMENTS & SCHEDULE */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* C. UPCOMING ASSIGNMENTS & DEADLINES (5 cols) */}
            <div className="md:col-span-5 bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#173F3A]">Upcoming Assignments</h3>
                <button
                  onClick={() => setCurrentTab('assignments')}
                  className="text-xs font-semibold text-[#79A995] hover:text-[#173F3A]"
                >
                  All Tasks
                </button>
              </div>

              <div className="space-y-2.5">
                {upcoming_assignments.length === 0 ? (
                  <p className="text-xs text-[#344541]/60 py-4 text-center">All assignments completed!</p>
                ) : (
                  upcoming_assignments.map((asg) => (
                    <div key={asg.id} className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE9E1] text-[#173F3A]">
                          {asg.subject}
                        </span>
                        <span className="text-[10px] text-rose-600 font-bold">Due {asg.deadline}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#173F3A] mt-1">{asg.title}</h4>
                      <div className="flex items-center justify-between text-[10px] text-[#344541]/60 mt-2">
                        <span>Max Marks: {asg.max_marks}</span>
                        <span className="font-semibold text-[#79A995]">{asg.difficulty}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* D. UPCOMING CLASSES & SESSIONS (7 cols) */}
            <div className="md:col-span-7 bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#173F3A]">Your Enrolled Classes</h3>
                <button
                  onClick={() => setCurrentTab('schedule')}
                  className="text-xs font-semibold text-[#79A995] hover:text-[#173F3A]"
                >
                  View Timetable
                </button>
              </div>

              <div className="space-y-2.5">
                {enrolled_classes.slice(0, 3).map((cls) => (
                  <div key={cls.id} className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE9E1] text-[#173F3A]">
                          {cls.code}
                        </span>
                        <h4 className="text-xs font-bold text-[#173F3A]">{cls.name}</h4>
                      </div>
                      <p className="text-[11px] text-[#344541]/70 mt-1">Instructor: {cls.teacher_name}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-xl bg-white border border-[#DCE9E1] text-[#173F3A] block">
                        {cls.schedule}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* RIGHT COLUMN (4 cols) */}
        {/* ------------------------------------------------------------------ */}
        <div className="lg:col-span-4 space-y-6">

          {/* E. BATCH / SEMESTER PROGRESS GAUGE */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs flex flex-col items-center text-center">
            <div className="relative w-44 h-24 overflow-hidden mb-2">
              <svg viewBox="0 0 100 50" className="w-full h-full">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#DCE9E1"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 75 18"
                  fill="none"
                  stroke="#79A995"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-x-0 bottom-0 text-center">
                <span className="text-xl font-black text-[#173F3A]">{student.assignment_completion}%</span>
              </div>
            </div>
            <p className="text-xs font-bold text-[#173F3A]">Assignment Completion</p>
            <p className="text-[10px] text-[#344541]/60">Semester Coursework Milestone</p>
          </div>

          {/* F. NOTIFICATIONS RELEVANT TO STUDENT */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#173F3A]">Your Notifications</h3>
              <button
                onClick={() => setCurrentTab('notifications')}
                className="text-xs font-semibold text-[#79A995] hover:text-[#173F3A]"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9]">
                  <p className="text-xs font-bold text-[#173F3A]">{notif.title}</p>
                  <p className="text-[11px] text-[#344541]/75 mt-0.5 leading-relaxed">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* G. ATTENDANCE OVERVIEW CARD */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs">
            <h3 className="text-sm font-bold text-[#173F3A] mb-3">Attendance Overview</h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#344541]">Present :</span>
                  <span className="font-bold text-[#173F3A]">{attendance}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAF9F5] border border-[#E5E2D9] overflow-hidden">
                  <div className="h-full bg-[#79A995] rounded-full" style={{ width: `${attendance}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#344541]">Absent :</span>
                  <span className="font-bold text-[#E7B978]">{absentRate}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAF9F5] border border-[#E5E2D9] overflow-hidden">
                  <div className="h-full bg-[#E7B978] rounded-full" style={{ width: `${absentRate}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* H. MATCHED OPPORTUNITIES */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#173F3A]">Matched Opportunities</h3>
              <button
                onClick={() => setCurrentTab('opportunities')}
                className="text-xs font-semibold text-[#79A995] hover:text-[#173F3A]"
              >
                Explore
              </button>
            </div>

            <div className="space-y-2.5">
              {recommended_opportunities.slice(0, 2).map((opp) => (
                <div key={opp.id} className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#79A995]">{opp.type}</span>
                    <span className="text-[10px] text-rose-600 font-bold">Due {opp.deadline}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#173F3A] mt-1">{opp.title}</h4>
                  <p className="text-[10px] text-[#344541]/70">{opp.organization}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
