import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Brain, ChevronDown, ChevronRight, Sparkles, Calendar, Target, AlertTriangle } from 'lucide-react';

interface PerformancePageProps {
  setCurrentTab: (tab: string) => void;
}

export const PerformancePage: React.FC<PerformancePageProps> = ({ setCurrentTab }) => {
  const [expandedSubject, setExpandedSubject] = useState<string | null>('Data Structures & Algorithms');

  const subjectData = [
    { subject: 'Python', score: 86, color: '#2563eb' },
    { subject: 'DBMS', score: 80, color: '#3b82f6' },
    { subject: 'Data Structures', score: 78, color: '#6366f1' },
    { subject: 'Networks', score: 72, color: '#8b5cf6' },
    { subject: 'Maths', score: 61, color: '#ec4899' },
  ];

  const trendData = [
    { assessment: 'Quiz 1', score: 68 },
    { assessment: 'Test 1', score: 72 },
    { assessment: 'Assignment 1', score: 76 },
    { assessment: 'Midterm', score: 74 },
    { assessment: 'Quiz 2', score: 82 },
    { assessment: 'Assignment 2', score: 79 }
  ];

  const topicHierarchy: Record<string, { topic: string; score: number; status: string }[]> = {
    'Data Structures & Algorithms': [
      { topic: 'Arrays & Dynamic Arrays', score: 84, status: 'Strong' },
      { topic: 'Linked Lists & Doubly Linked', score: 78, status: 'Good' },
      { topic: 'Stacks & Queues', score: 72, status: 'Moderate' },
      { topic: 'Trees & BST', score: 61, status: 'Weak' },
      { topic: 'Graphs & Dijkstra Algorithm', score: 55, status: 'Weak' }
    ],
    'Computer Networks': [
      { topic: 'OSI 7-Layer Reference Model', score: 88, status: 'Strong' },
      { topic: 'Socket Programming', score: 76, status: 'Good' },
      { topic: 'Subnetting & CIDR Notation', score: 72, status: 'Moderate' },
      { topic: 'TCP/IP Protocol Stack & Headers', score: 62, status: 'Weak' }
    ],
    'Mathematics — Linear Algebra': [
      { topic: 'Matrix Multiplication & Operations', score: 75, status: 'Good' },
      { topic: 'Vector Spaces & Subspaces', score: 68, status: 'Moderate' },
      { topic: 'Linear Transformations & Eigenvalues', score: 58, status: 'Weak' }
    ]
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'Strong': return 'bg-emerald-100 text-emerald-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Moderate': return 'bg-amber-100 text-amber-800';
      case 'Weak': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* AI ANALYSIS CARD */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-800 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">AI Performance Diagnostic</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">↑ +8% Overall Trend</span>
            </div>
            <p className="text-base sm:text-lg font-medium text-slate-100 mt-2">
              "Your performance has improved by 8% over the last four assessments. However, your performance in Trees (61%), Graphs (55%), and Linear Transformations (58%) remains below your overall average of 78.5%."
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentTab('study-planner')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-md hover:opacity-95 transition flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Generate Study Plan</span>
              </button>
              <button
                onClick={() => setCurrentTab('ai-assistant')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition flex items-center space-x-2"
              >
                <Target className="w-4 h-4 text-cyan-400" />
                <span>Practice Weak Topics</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TOP ROW: BAR CHART & TREND LINE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SUBJECT PERFORMANCE BAR CHART */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="font-bold text-slate-900 text-lg mb-2">Subject Performance Overview</h3>
          <p className="text-xs text-slate-500 mb-6">Average score breakdown across enrolled subjects</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val) => [`${val}%`, 'Score']} />
                <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PERFORMANCE TREND LINE CHART */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="font-bold text-slate-900 text-lg mb-2">Performance Trend Over Time</h3>
          <p className="text-xs text-slate-500 mb-6">Historical marks progression across recent assessments</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="assessment" tick={{ fontSize: 12 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(val) => [`${val}%`, 'Score']} />
                <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5, fill: '#06b6d4' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: TOPIC PERFORMANCE HIERARCHY & LEARNING GAPS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TOPIC HIERARCHY EXPANDABLE */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="font-bold text-slate-900 text-lg mb-2">Topic-Level Performance Hierarchy</h3>
          <p className="text-xs text-slate-500 mb-6">Click any subject to inspect granular topic mastery</p>

          <div className="space-y-4">
            {Object.keys(topicHierarchy).map((subjectKey) => {
              const isExpanded = expandedSubject === subjectKey;
              const topics = topicHierarchy[subjectKey];

              return (
                <div key={subjectKey} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedSubject(isExpanded ? null : subjectKey)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-left font-bold text-slate-800 text-sm"
                  >
                    <span>{subjectKey}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 font-medium">{topics.length} Topics</span>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white space-y-3 border-t border-slate-200">
                      {topics.map((t, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <div>
                            <span className="font-medium text-slate-900 text-sm">{t.topic}</span>
                            <div className="w-36 bg-slate-200 h-2 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className={`h-full ${t.score >= 75 ? 'bg-emerald-500' : t.score >= 65 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                style={{ width: `${t.score}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-extrabold text-sm text-slate-900">{t.score}%</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getBadgeColor(t.status)}`}>
                              {t.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* LEARNING GAPS BREAKDOWN */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-rose-500" />
              Identified Learning Gaps
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">High Priority Gaps</span>
                <ul className="mt-2 space-y-1 text-sm font-semibold text-rose-900">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-2" />
                    Linear Transformations (58%)
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-2" />
                    TCP/IP Protocol Stack (62%)
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-2" />
                    Graphs & Dijkstra (55%)
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Medium Priority Gaps</span>
                <ul className="mt-2 space-y-1 text-sm font-semibold text-amber-900">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-2" />
                    Binary Search Trees (61%)
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-2" />
                    Dynamic Programming (68%)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
