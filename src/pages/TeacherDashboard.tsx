import React, { useState, useEffect } from 'react';
import { getTeacherDashboard } from '../services/api';
import { Users, Award, BookOpenCheck, CheckCircle2, Brain, AlertTriangle, ChevronRight, TrendingUp } from 'lucide-react';

interface TeacherDashboardProps {
  setCurrentTab: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ setCurrentTab }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getTeacherDashboard().then(res => setData(res));
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Faculty Intelligence Console</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
              Welcome Back, Prof. Sharma 👋
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              Computer Science & Engineering • Data Structures & Python Programming
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('academic-support')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center space-x-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Academic Support Indicators</span>
          </button>
        </div>
      </div>

      {/* CLASS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{data?.total_students || 72} Students</p>
          <span className="text-xs text-slate-500 mt-1 block">Active across 2 sections</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class Average Score</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{data?.average_score || 74}%</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">↑ +3.2% vs previous term</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assignment Completion</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BookOpenCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{data?.assignment_completion || 81}%</p>
          <span className="text-xs text-indigo-600 font-semibold mt-1 block">High submission rate</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{data?.attendance || 87}%</p>
          <span className="text-xs text-slate-500 mt-1 block">Consistent participation</span>
        </div>
      </div>

      {/* AI CLASS INSIGHT CARD */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-800 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">AI Class Synthesis</span>
            <p className="text-base sm:text-lg font-medium text-slate-100 mt-2">
              "{data?.ai_class_insight || 'Students are performing exceptionally well in basic Python and Data Structures (Arrays 84%), but show weaker performance in graph algorithms and tree recursion.'}"
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentTab('teacher-feedback')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
              >
                View Feedback Analytics
              </button>
              <button
                onClick={() => setCurrentTab('teacher-assignments')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
              >
                Create Revision Assignment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEARNING GAPS SUMMARY */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">Class Learning Gaps Summary</h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-900 text-sm">Trees & Binary Search Trees</span>
                <span className="text-xs text-rose-700 block">Class Avg: 61%</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900 text-xs font-bold">High Gap</span>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-900 text-sm">Graph Algorithms (Dijkstra)</span>
                <span className="text-xs text-rose-700 block">Class Avg: 55%</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900 text-xs font-bold">High Gap</span>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-900 text-sm">Dynamic Programming Memoization</span>
                <span className="text-xs text-amber-700 block">Class Avg: 68%</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold">Medium Gap</span>
            </div>
          </div>
        </div>

        {/* ASSIGNMENT STATS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">Current Assignment Status</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-2xl font-extrabold text-indigo-600">58</span>
              <span className="text-xs text-slate-500 font-bold block mt-1">Submitted & Pending Grade</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-2xl font-extrabold text-emerald-600">142</span>
              <span className="text-xs text-slate-500 font-bold block mt-1">Graded</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-2xl font-extrabold text-amber-600">12</span>
              <span className="text-xs text-slate-500 font-bold block mt-1">Pending Student Uploads</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-2xl font-extrabold text-rose-600">2</span>
              <span className="text-xs text-slate-500 font-bold block mt-1">Overdue</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
