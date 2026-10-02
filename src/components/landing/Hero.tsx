import React, { useState } from 'react';
import { Sparkles, ArrowRight, TrendingUp, CheckCircle, Brain, BookOpen, Star, Shield, Award } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
  onExploreFeatures: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onExploreFeatures }) => {
  const [activeTab, setActiveTab] = useState<'insight' | 'assignments' | 'opportunities' | 'feedback'>('insight');

  return (
    <section className="relative overflow-hidden pt-28 pb-20 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse-subtle" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span>AI-Powered Academic Intelligence Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Turn Academic Data Into{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Better Learning.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            EduPulse connects students and teachers through AI-powered learning insights, anonymous feedback, intelligent assignment management, and personalized opportunity discovery.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreFeatures}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold border border-slate-700/80 backdrop-blur-md transition flex items-center justify-center space-x-2"
            >
              <span>Explore Features</span>
            </button>
          </div>
        </div>

        {/* HERO INTERACTIVE DASHBOARD PREVIEW */}
        <div className="mt-16 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-3xl blur-md opacity-30 group-hover:opacity-100 transition duration-1000" />
          
          <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">edupulse.ai/analytics-dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping" /> Live AI Engine Active
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <span className="text-xs text-slate-400 font-medium">CGPA</span>
                <p className="text-xl font-bold text-white mt-1">8.2 <span className="text-xs text-emerald-400 font-normal">↑ Top 10%</span></p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <span className="text-xs text-slate-400 font-medium">Attendance</span>
                <p className="text-xl font-bold text-white mt-1">87% <span className="text-xs text-emerald-400 font-normal">Consistent</span></p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <span className="text-xs text-slate-400 font-medium">Assignments</span>
                <p className="text-xl font-bold text-white mt-1">8 / 10 <span className="text-xs text-indigo-400 font-normal">Active</span></p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <span className="text-xs text-slate-400 font-medium">Performance</span>
                <p className="text-xl font-bold text-emerald-400 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> +8.4%
                </p>
              </div>
            </div>

            {/* Interactive Preview Tabs */}
            <div className="flex border-b border-slate-800 mb-4 space-x-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('insight')}
                className={`pb-2.5 transition border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'insight' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>AI Insights</span>
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className={`pb-2.5 transition border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'assignments' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Upcoming Tasks</span>
              </button>
              <button
                onClick={() => setActiveTab('opportunities')}
                className={`pb-2.5 transition border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'opportunities' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Opportunities</span>
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`pb-2.5 transition border-b-2 flex items-center space-x-1.5 ${
                  activeTab === 'feedback' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Feedback Analytics</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 min-h-[160px]">
              {activeTab === 'insight' && (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/20">
                    <Brain className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">AI Personal Learning Synthesis</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        "Your strongest area is Python (86%). Your recent performance indicates that Computer Networks — particularly TCP/IP protocol stack — needs additional practice before your upcoming midterm."
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-rose-400 font-semibold">High Priority Revision:</span>
                      <span className="block text-slate-300 mt-0.5">Linear Transformations, TCP/IP Layers</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                      <span className="text-amber-400 font-semibold">Medium Priority Revision:</span>
                      <span className="block text-slate-300 mt-0.5">Binary Trees, Dynamic Programming</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'assignments' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="font-semibold text-white">DSA Binary Tree Implementation</span>
                      <span className="text-slate-400">(Data Structures)</span>
                    </div>
                    <span className="text-amber-300 font-medium bg-amber-500/10 px-2 py-0.5 rounded">Due Oct 05</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="font-semibold text-white">Computer Networks Socket Quiz</span>
                      <span className="text-slate-400">(Computer Networks)</span>
                    </div>
                    <span className="text-blue-300 font-medium bg-blue-500/10 px-2 py-0.5 rounded">Due Oct 07</span>
                  </div>
                </div>
              )}

              {activeTab === 'opportunities' && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-900 rounded-lg border border-indigo-500/30 flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold text-[10px]">Hackathon</span>
                      <h5 className="font-bold text-white mt-1">National AI & Machine Learning Hackathon 2026</h5>
                      <p className="text-slate-400 text-[11px]">Skill Match: Python, Machine Learning (94% Match Score)</p>
                    </div>
                    <button onClick={onGetStarted} className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500">Apply</button>
                  </div>
                </div>
              )}

              {activeTab === 'feedback' && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">Anonymous Sentiment Index</span>
                      <span className="text-emerald-400 font-bold">61% Positive</span>
                    </div>
                    <p className="text-slate-300 text-[11px] mt-1">
                      AI Sentiment Summary: "Students appreciate practical code demos in class, but express concern that recursion pace is fast."
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
