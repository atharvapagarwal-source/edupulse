import React from 'react';
import { GraduationCap, Heart } from 'lucide-react';

interface FooterProps {
  onNavClick: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white">EduPulse</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Powered Academic Intelligence Platform. "Understand. Improve. Achieve."
            </p>
            <p className="text-[11px] text-slate-500">
              Your academic data, turned into actionable intelligence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavClick('features')} className="hover:text-indigo-400 transition">Features</button></li>
              <li><button onClick={() => onNavClick('how-it-works')} className="hover:text-indigo-400 transition">How It Works</button></li>
              <li><button onClick={() => onNavClick('student-dashboard')} className="hover:text-indigo-400 transition">Student Workspace</button></li>
              <li><button onClick={() => onNavClick('teacher-dashboard')} className="hover:text-indigo-400 transition">Faculty Workspace</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Solutions</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavClick('performance')} className="hover:text-indigo-400 transition">Learning Insights</button></li>
              <li><button onClick={() => onNavClick('anonymous-feedback')} className="hover:text-indigo-400 transition">Anonymous Feedback</button></li>
              <li><button onClick={() => onNavClick('opportunities')} className="hover:text-indigo-400 transition">Opportunity Engine</button></li>
              <li><button onClick={() => onNavClick('academic-support')} className="hover:text-indigo-400 transition">Academic Support</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Institutional</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white cursor-pointer">VIT University Portal</span></li>
              <li><span className="hover:text-white cursor-pointer">Privacy & Governance</span></li>
              <li><span className="hover:text-white cursor-pointer">Academic Ethics Policy</span></li>
              <li><span className="hover:text-white cursor-pointer">Contact Support</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 EduPulse — AI-Powered Academic Intelligence Platform. All rights reserved.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Crafted for Students & Educators
          </p>
        </div>
      </div>
    </footer>
  );
};
