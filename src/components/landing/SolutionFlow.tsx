import React from 'react';
import { Database, Cpu, Lightbulb, Compass, Award, ArrowRight } from 'lucide-react';

export const SolutionFlow: React.FC = () => {
  const steps = [
    { title: 'Student Activity', desc: 'Assignments, quizzes, marks & feedback', icon: Database, color: 'from-blue-500 to-indigo-600' },
    { title: 'Data Collection', desc: 'Centralized secure academic repository', icon: Database, color: 'from-indigo-600 to-purple-600' },
    { title: 'AI Analysis', desc: 'NLP, gap detector & sentiment models', icon: Cpu, color: 'from-purple-600 to-cyan-500' },
    { title: 'Learning Insights', desc: 'Topic-level mastery & sentiment trends', icon: Lightbulb, color: 'from-cyan-500 to-blue-600' },
    { title: 'Personalized Recommendations', desc: 'Targeted study plans & matched opps', icon: Compass, color: 'from-blue-600 to-indigo-500' },
    { title: 'Improved Learning', desc: 'Better grades, retention & career outcomes', icon: Award, color: 'from-indigo-500 to-emerald-500' }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            The EduPulse Core Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
            One Platform. The Complete Academic Intelligence Loop.
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Data → AI Analysis → Insight → Personalized Action
          </p>
        </div>

        {/* Visual Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-indigo-500/50 transition-all duration-300 h-full flex flex-col justify-between text-center relative z-10 backdrop-blur-md">
                  <div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} mx-auto flex items-center justify-center shadow-lg text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block mb-1">
                      Step 0{index + 1}
                    </span>
                    <h3 className="font-bold text-white text-sm leading-snug">{step.title}</h3>
                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">{step.desc}</p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                      <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 shadow-md">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
