import React from 'react';
import {
  Brain, ShieldCheck, BookOpenCheck, Sparkles,
  CalendarDays, Bot, LineChart, AlertTriangle
} from 'lucide-react';

export const FeaturesGrid: React.FC = () => {
  const features = [
    {
      title: 'AI Learning Insights',
      desc: 'Analyze marks, assignments, quizzes and academic activity to identify strengths and learning gaps.',
      icon: Brain,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    {
      title: 'Anonymous Feedback',
      desc: 'Students can safely submit feedback while AI analyzes sentiment, topics and recurring concerns without exposing student identity.',
      icon: ShieldCheck,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    {
      title: 'Smart Assignment Management',
      desc: 'Create, submit, evaluate and track assignments from a centralized platform with AI advisory pre-evaluation.',
      icon: BookOpenCheck,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      title: 'AI Opportunity Discovery',
      desc: 'Recommend relevant hackathons, internships, scholarships, competitions and workshops based on student profiles.',
      icon: Sparkles,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200'
    },
    {
      title: 'Personalized Study Plans',
      desc: 'Generate study plans based on weak topics, upcoming assessments and available study time.',
      icon: CalendarDays,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      title: 'AI Academic Assistant',
      desc: 'A context-aware AI copilot that understands a student’s academic information and provides personalized guidance.',
      icon: Bot,
      color: 'text-rose-600 bg-rose-50 border-rose-200'
    },
    {
      title: 'Teacher Analytics',
      desc: 'Provide teachers with class performance, topic-level weaknesses, feedback trends and academic support indicators.',
      icon: LineChart,
      color: 'text-amber-600 bg-amber-50 border-amber-200'
    },
    {
      title: 'Academic Support Detection',
      desc: 'Identify students who may benefit from additional academic support based on multiple non-stigmatizing indicators.',
      icon: AlertTriangle,
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-50/60 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            Comprehensive Feature Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Engineered For Modern Academic Excellence
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Everything students, teachers, and administrators need to transform raw academic data into measurable progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl border ${item.color} flex items-center justify-center mb-5 shadow-xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
