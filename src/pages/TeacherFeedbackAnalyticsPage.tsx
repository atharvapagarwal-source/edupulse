import React, { useState, useEffect } from 'react';
import { getFeedbackAnalytics } from '../services/api';
import { ShieldCheck, Brain, MessageSquare, ThumbsUp, ThumbsDown, Filter, Lock } from 'lucide-react';

export const TeacherFeedbackAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getFeedbackAnalytics().then(res => setData(res));
  }, []);

  const analysis = data?.analysis || {
    teaching_quality: 82,
    course_difficulty: 68,
    study_material: 74,
    teaching_pace: 59,
    sentiment: { positive: 61, neutral: 25, negative: 14 },
    common_topics: ["Course pace", "Assignment difficulty", "Study material", "Practical examples"],
    ai_summary: "Students generally find the course informative, but multiple responses indicate that recursion is being taught faster than students can comfortably follow."
  };

  const responses = data?.recent_responses || [
    {
      id: 'fb-001',
      subject: 'Computer Networks',
      category: 'Teaching Pace',
      comment: 'The lecture pace on TCP congestion control was a bit fast. Would appreciate more practical packet trace examples.',
      date: '2026-09-28'
    },
    {
      id: 'fb-002',
      subject: 'Data Structures & Algorithms',
      category: 'Course Difficulty',
      comment: 'Trees and Graph algorithms are being covered very quickly. A supplementary review session on recursion would help immensely.',
      date: '2026-09-29'
    },
    {
      id: 'fb-003',
      subject: 'Mathematics — Linear Algebra',
      category: 'Study Material',
      comment: 'The linear transformation notes are very clear, but we need more solved practice problems before the midterms.',
      date: '2026-09-30'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-purple-800 shadow-xl">
        <div className="flex items-center space-x-2 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Differential Privacy Shield Active</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Anonymous Feedback Intelligence
        </h2>
        <p className="text-slate-300 text-sm mt-2 max-w-xl">
          Aggregated sentiment analytics, category scores, and AI summaries compiled from student responses without compromising individual identity.
        </p>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teaching Quality</span>
          <p className="text-3xl font-extrabold text-indigo-600 mt-2">{analysis.teaching_quality}%</p>
          <span className="text-xs text-slate-500 mt-1 block">Satisfactory Rating</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course Difficulty</span>
          <p className="text-3xl font-extrabold text-purple-600 mt-2">{analysis.course_difficulty}%</p>
          <span className="text-xs text-slate-500 mt-1 block">Moderate Complexity</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Study Material</span>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">{analysis.study_material}%</p>
          <span className="text-xs text-slate-500 mt-1 block">Positive Resource Index</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teaching Pace</span>
          <p className="text-3xl font-extrabold text-rose-600 mt-2">{analysis.teaching_pace}%</p>
          <span className="text-xs text-rose-600 font-semibold mt-1 block">Requires Slowdown</span>
        </div>
      </div>

      {/* AI SUMMARY CARD & SENTIMENT BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI SUMMARY */}
        <div className="lg:col-span-2 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-800 shadow-xl flex items-start space-x-4">
          <Brain className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">AI Sentiment Summary</span>
            <p className="text-base sm:text-lg font-medium text-slate-100 mt-2 leading-relaxed">
              "{analysis.ai_summary}"
            </p>

            <div className="mt-4 pt-4 border-t border-indigo-800/80 flex flex-wrap gap-2">
              <span className="text-xs text-slate-400 font-medium">Common Topic Clusters:</span>
              {analysis.common_topics?.map((topic: string, i: number) => (
                <span key={i} className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold border border-indigo-500/30">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SENTIMENT DISTRIBUTION */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Class Sentiment Breakdown</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Positive Sentiment</span>
                <span className="text-emerald-600">{analysis.sentiment?.positive || 61}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${analysis.sentiment?.positive || 61}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Neutral Sentiment</span>
                <span className="text-indigo-600">{analysis.sentiment?.neutral || 25}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${analysis.sentiment?.neutral || 25}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Constructive / Needs Improvement</span>
                <span className="text-rose-600">{analysis.sentiment?.negative || 14}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${analysis.sentiment?.negative || 14}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED RESPONSES LIST (IDENTITY HIDDEN) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg">Anonymized Student Feedback Feed</h3>
          <span className="text-xs text-slate-500 font-mono flex items-center">
            <Lock className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Identities Protected
          </span>
        </div>

        <div className="space-y-3">
          {responses.map((item: any) => (
            <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{item.date}</span>
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">"{item.comment}"</p>
              <span className="text-[11px] text-slate-500 italic block">Course: {item.subject}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
