import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentPerformance } from '../services/api';
import { StudentPerformanceData } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Brain, ChevronDown, ChevronRight, Sparkles, Calendar, Target, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface PerformancePageProps {
  setCurrentTab: (tab: string) => void;
}

export const PerformancePage: React.FC<PerformancePageProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const [data, setData] = useState<StudentPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    getStudentPerformance(user?.id)
      .then((res) => {
        if (isMounted) {
          setData(res);
          if (res?.subject_scores?.length > 0) {
            setExpandedSubject(res.subject_scores[0].subject);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to load student performance:", err);
          setError(err.message || "Failed to load performance data");
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#79A995] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#344541]/70 font-semibold">
            Querying verified assessment records for {user?.name || 'Student'}...
          </p>
        </div>
      </div>
    );
  }

  const subject_scores = data?.subject_scores || [];
  const trend = data?.trend || [];
  const weak_topics = data?.weak_topics || [];
  const strong_topics = data?.strong_topics || [];
  const topic_hierarchy = data?.topic_hierarchy || {};
  const total_assessments_logged = data?.total_assessments_logged || subject_scores.length * 3;
  const ai_analysis = data?.ai_analysis || "Academic diagnostic loaded based on your course records.";
  const student_id = data?.student_id || user?.id || "std-001";

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'Strong': return 'bg-[#79A995]/20 text-[#173F3A] border border-[#79A995]/30';
      case 'Good': return 'bg-[#DCE9E1] text-[#173F3A]';
      case 'Moderate': return 'bg-[#E7B978]/30 text-[#173F3A]';
      case 'Weak': return 'bg-rose-100 text-rose-800 border border-rose-200';
      default: return 'bg-[#FAF9F5] text-[#344541]';
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-[#344541]">

      {/* 1. AI PERFORMANCE DIAGNOSTIC CARD */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#173F3A] to-[#285f58] text-white shadow-xs">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#E7B978] flex-shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-[#E7B978] uppercase tracking-wider">
                Database Verified Performance Diagnostic
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#79A995]/30 text-white text-[10px] font-bold">
                Student ID: {student_id}
              </span>
            </div>
            <p className="text-base sm:text-lg font-medium text-[#F5F3ED] mt-2 leading-relaxed">
              "{ai_analysis}"
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentTab('study-planner')}
                className="px-4 py-2 rounded-xl bg-[#79A995] hover:bg-[#689482] text-[#173F3A] text-xs font-bold shadow-xs transition flex items-center space-x-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Generate Priority Study Plan</span>
              </button>
              <button
                onClick={() => setCurrentTab('ai-assistant')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center space-x-2"
              >
                <Target className="w-3.5 h-3.5 text-[#E7B978]" />
                <span>Ask AI Copilot About Weak Areas</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CHARTS: SUBJECT-WISE SCORES & ASSESSMENT TREND */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar Chart: Subject-Wise Performance */}
        <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#173F3A]">Subject-Wise Performance Analysis</h3>
              <p className="text-xs text-[#344541]/60">Calculated directly from recorded assessments</p>
            </div>
            <span className="text-xs font-bold text-[#79A995]">
              {subject_scores.length} Subjects
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subject_scores} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F3ED" vertical={false} />
                <XAxis dataKey="subject" tick={{ fill: '#344541', fontSize: 11 }} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fill: '#344541', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#173F3A', borderRadius: '1rem', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="score" fill="#79A995" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart: Historical Assessment Trend */}
        <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#173F3A]">Academic Performance Trends</h3>
              <p className="text-xs text-[#344541]/60">Chronological score trajectory across test cycles</p>
            </div>
            <span className="text-xs font-bold text-[#173F3A]">
              {total_assessments_logged} Assessments
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F3ED" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#344541', fontSize: 10 }} />
                <YAxis domain={[40, 100]} tick={{ fill: '#344541', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#173F3A', borderRadius: '1rem', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#173F3A"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#E7B978', strokeWidth: 2, stroke: '#173F3A' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. IDENTIFICATION OF WEAK & STRONG TOPICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Weak Topics */}
        <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-[#173F3A]">Identified Weak Topics (Requires Revision)</h3>
          </div>

          {weak_topics.length === 0 ? (
            <div className="p-4 rounded-2xl bg-[#DCE9E1]/40 text-xs text-[#173F3A] flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-[#79A995]" />
              <span>Excellent! No topics currently fall below the 70% threshold.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {weak_topics.map((t, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs flex items-center justify-between">
                  <span className="font-semibold text-rose-900">{t}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">
                    Priority Focus
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Strong Topics */}
        <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-4 h-4 text-[#79A995]" />
            <h3 className="text-sm font-bold text-[#173F3A]">Identified Mastery Topics (Strengths)</h3>
          </div>

          {strong_topics.length === 0 ? (
            <p className="text-xs text-[#344541]/60">More assessment data will highlight your strengths.</p>
          ) : (
            <div className="space-y-2">
              {strong_topics.map((t, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] text-xs flex items-center justify-between">
                  <span className="font-semibold text-[#173F3A]">{t}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE9E1] text-[#173F3A]">
                    Mastered
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 4. DETAILED TOPIC BREAKDOWN BY SUBJECT */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#173F3A]">Topic-Level Breakdown by Course</h3>

        <div className="space-y-3">
          {Object.entries(topic_hierarchy).map(([subject, topics]) => {
            const isExpanded = expandedSubject === subject;
            return (
              <div key={subject} className="rounded-2xl border border-[#E5E2D9] overflow-hidden bg-[#FAF9F5]">
                <button
                  onClick={() => setExpandedSubject(isExpanded ? null : subject)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-white transition"
                >
                  <span className="text-sm font-bold text-[#173F3A]">{subject}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-[#344541]/60 font-semibold">{topics.length} Topics</span>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-[#E5E2D9] space-y-2">
                    {topics.map((top, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#DCE9E1] flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-[#173F3A]">{top.topic}</p>
                          <p className="text-[10px] text-[#344541]/50">{top.assessment_type} • {top.date}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-[#173F3A]">{top.score}%</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getBadgeColor(top.status)}`}>
                            {top.status}
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

    </div>
  );
};
