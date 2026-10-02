import React from 'react';
import { Hero } from '../components/landing/Hero';
import { ProblemSection } from '../components/landing/ProblemSection';
import { SolutionFlow } from '../components/landing/SolutionFlow';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { HowItWorks } from '../components/landing/HowItWorks';
import { CTASection } from '../components/landing/CTASection';
import { Footer } from '../components/landing/Footer';
import { GraduationCap, ArrowRight, Sparkles, CheckCircle2, Award, BookOpen, Brain, TrendingUp, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onGetStartedClick: () => void;
  setCurrentTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onGetStartedClick, setCurrentTab }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* MARKETING NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('landing')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight">EduPulse</span>
              <span className="block text-[9px] text-cyan-400 font-semibold tracking-wider uppercase">AI Platform</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
            <a href="#hero" className="hover:text-cyan-300 transition">Home</a>
            <a href="#features" className="hover:text-cyan-300 transition">Features</a>
            <a href="#how-it-works" className="hover:text-cyan-300 transition">How It Works</a>
            <button onClick={() => setCurrentTab('student-dashboard')} className="hover:text-cyan-300 transition">For Students</button>
            <button onClick={() => setCurrentTab('teacher-dashboard')} className="hover:text-cyan-300 transition">For Teachers</button>
            <button onClick={() => setCurrentTab('opportunities')} className="hover:text-cyan-300 transition">Opportunities</button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onLoginClick}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition"
            >
              Login
            </button>
            <button
              onClick={onGetStartedClick}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-md transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div id="hero">
        <Hero
          onGetStarted={onGetStartedClick}
          onExploreFeatures={() => {
            const el = document.getElementById('features');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* PROBLEM SECTION */}
      <ProblemSection />

      {/* SOLUTION FLOW */}
      <SolutionFlow />

      {/* FEATURES GRID */}
      <FeaturesGrid />

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* STUDENT EXPERIENCE SECTION */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              Student Experience Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
              Your Personal Academic Intelligence System
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg">
              A unified command center providing students with real-time academic clarity and intelligent recommendations.
            </p>
          </div>

          {/* DASHBOARD MOCKUP PREVIEW */}
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8">
            {/* Greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-white">Good Morning, Atharva 👋</h3>
                <p className="text-xs text-slate-400 mt-1">B.Tech Computer Science • 3rd Year • VIT University</p>
              </div>
              <button
                onClick={() => setCurrentTab('student-dashboard')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-2 self-start sm:self-auto"
              >
                <span>Enter Live Workspace</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">CGPA</span>
                <p className="text-2xl font-extrabold text-white mt-1">8.2</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Attendance</span>
                <p className="text-2xl font-extrabold text-white mt-1">87%</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Assignments</span>
                <p className="text-2xl font-extrabold text-white mt-1">8 / 10</p>
              </div>
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Performance</span>
                <p className="text-2xl font-extrabold text-emerald-400 mt-1">↑ Improving</p>
              </div>
            </div>

            {/* AI Insight */}
            <div className="p-6 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl border border-indigo-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <Brain className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">AI Insight</span>
                  <p className="text-sm text-slate-200 mt-1 font-medium">
                    "Your strongest area is Python. Your recent performance indicates that Computer Networks — particularly TCP/IP — needs additional practice."
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCurrentTab('study-planner')}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition flex-shrink-0"
              >
                View Study Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <CTASection onGetStarted={onGetStartedClick} />

      {/* FOOTER */}
      <Footer onNavClick={(tab) => setCurrentTab(tab)} />
    </div>
  );
};
