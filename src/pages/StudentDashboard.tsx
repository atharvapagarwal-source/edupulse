import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentDashboard } from '../services/api';
import {
  TrendingUp, Award, Calendar, BookOpen, Brain, Sparkles,
  ArrowRight, CheckCircle2, Clock, MapPin, ChevronRight, Zap
} from 'lucide-react';

interface StudentDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentDashboard('std-001').then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>AI Learning Intelligence Active</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Good Morning, {user?.name.split(' ')[0] || 'Atharva'} 👋
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
              You are currently on track for your 3rd Year Computer Science requirements. Your overall performance has improved by <span className="text-emerald-400 font-semibold">+8.4%</span> over recent assessments.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('ai-assistant')}
            className="self-start md:self-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition flex items-center space-x-2 flex-shrink-0"
          >
            <Zap className="w-4 h-4 text-cyan-300" />
            <span>Ask EduPulse AI Copilot</span>
          </button>
        </div>
      </div>

      {/* ACADEMIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CGPA */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CGPA</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{data?.cgpa || 8.2}</p>
          <div className="flex items-center text-xs text-emerald-600 font-semibold mt-2">
            <span>↑ Top 10% in Department</span>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{data?.attendance || 87}%</p>
          <div className="flex items-center text-xs text-emerald-600 font-semibold mt-2">
            <span>Above 75% Requirement</span>
          </div>
        </div>

        {/* Assignments */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assignments</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">8 / 10</p>
          <div className="flex items-center text-xs text-indigo-600 font-semibold mt-2">
            <span>2 Pending Submissions</span>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Performance</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 mt-3 flex items-center">
            ↑ Improving
          </p>
          <div className="flex items-center text-xs text-slate-500 mt-2">
            <span>+8.4% over last 4 quizzes</span>
          </div>
        </div>
      </div>

      {/* AI INSIGHT CARD */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-800/60 shadow-lg relative overflow-hidden">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center flex-shrink-0 text-cyan-300">
            <Brain className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">EduPulse AI Learning Insight</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <p className="text-base sm:text-lg font-medium text-slate-100 mt-2 leading-relaxed">
              "{data?.ai_insight?.message || 'Your strongest area is Python. Your recent performance indicates that Computer Networks — particularly TCP/IP — needs additional practice.'}"
            </p>
            
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentTab('study-planner')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md hover:opacity-95 transition flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>View Study Plan</span>
              </button>
              <button
                onClick={() => setCurrentTab('performance')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
              >
                Practice Weak Topics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: UPCOMING ASSIGNMENTS & EXAMS */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                Upcoming Deadlines
              </h3>
              <button onClick={() => setCurrentTab('assignments')} className="text-xs text-indigo-600 font-semibold hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {data?.upcoming?.map((item: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-indigo-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                      {item.type}
                    </span>
                    <span className="text-xs font-semibold text-rose-600 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {item.deadline}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.subject}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECOMMENDED OPPORTUNITIES */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                  Recommended Opportunities
                </h3>
                <p className="text-xs text-slate-500">AI-matched to your Python & ML profile skills</p>
              </div>
              <button onClick={() => setCurrentTab('opportunities')} className="text-xs text-indigo-600 font-semibold hover:underline">
                Explore All
              </button>
            </div>

            <div className="space-y-4">
              {data?.recommended_opportunities?.map((opp: any) => (
                <div key={opp.id} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-300 transition group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                          {opp.type}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> {opp.match_score}% Skill Match
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition">
                        {opp.title}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium">{opp.organization}</p>
                      <p className="text-xs text-slate-500 italic mt-1">"{opp.recommendation_reason}"</p>
                    </div>

                    <button
                      onClick={() => setCurrentTab('opportunities')}
                      className="self-start sm:self-center px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-semibold text-xs hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition shadow-xs flex items-center space-x-1 flex-shrink-0"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
