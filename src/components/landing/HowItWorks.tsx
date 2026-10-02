import React from 'react';
import { UserPlus, BookOpen, Brain, TrendingUp } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Connect',
      desc: 'Students and teachers create profiles, connect to subjects and initialize their academic dashboard.',
      icon: UserPlus
    },
    {
      num: '02',
      title: 'Learn',
      desc: 'The platform collects academic activity, assignments, anonymous feedback and career interests.',
      icon: BookOpen
    },
    {
      num: '03',
      title: 'Analyze',
      desc: 'EduPulse AI analyzes performance trends, topic gaps, feedback sentiment and opportunity compatibility.',
      icon: Brain
    },
    {
      num: '04',
      title: 'Improve',
      desc: 'EduPulse generates actionable study plans, teacher interventions and targeted career recommendations.',
      icon: TrendingUp
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white text-slate-900 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            How EduPulse Works
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            From raw academic data to personalized learning progress in four seamless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="relative bg-slate-50 rounded-2xl p-8 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-extrabold font-mono text-indigo-600/30">{s.num}</span>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
