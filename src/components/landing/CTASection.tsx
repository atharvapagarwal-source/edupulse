import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CTAProps {
  onGetStarted: () => void;
}

export const CTASection: React.FC<CTAProps> = ({ onGetStarted }) => {
  return (
    <section className="py-24 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 border border-indigo-500/30">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Transform Your Academic Experience</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Your Academic Journey Has Data.<br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Now Turn It Into Progress.
          </span>
        </h2>

        <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal">
          EduPulse brings feedback, performance, assignments and opportunities together into one intelligent academic platform.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white font-bold text-base shadow-xl shadow-indigo-500/30 hover:scale-[1.02] transition flex items-center justify-center space-x-2"
          >
            <span>Start Using EduPulse</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold border border-slate-700 backdrop-blur-md transition flex items-center justify-center"
          >
            Explore the Platform
          </button>
        </div>
      </div>
    </section>
  );
};
