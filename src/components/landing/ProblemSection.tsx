import React from 'react';
import { AlertCircle, UserX, GraduationCap, Building2 } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="py-24 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider mb-3">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>The Academic Reality</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Academic Data Exists.{' '}
            <span className="text-indigo-600">Actionable Insight Doesn't.</span>
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Traditional learning management systems store marks, but fail to tell students how to improve or teachers where the class is falling behind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Students Problem Card */}
          <div className="bg-slate-50/80 rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 font-bold text-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Students</h3>
            <p className="text-slate-600 text-sm mb-4 font-medium">Students often don't know:</p>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 mr-2.5 flex-shrink-0" />
                <span>What specific topics they are weak at until exams arrive</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 mr-2.5 flex-shrink-0" />
                <span>Why their grade performance is declining over time</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 mr-2.5 flex-shrink-0" />
                <span>What they should study next to optimize revision time</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 mr-2.5 flex-shrink-0" />
                <span>Which hackathons or internships match their real skills</span>
              </li>
            </ul>
          </div>

          {/* Teachers Problem Card */}
          <div className="bg-slate-50/80 rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 font-bold text-xl">
              <UserX className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Teachers</h3>
            <p className="text-slate-600 text-sm mb-4 font-medium">Teachers struggle to:</p>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 mr-2.5 flex-shrink-0" />
                <span>Understand class-wide learning gaps before finals</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 mr-2.5 flex-shrink-0" />
                <span>Process large volumes of student course feedback</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 mr-2.5 flex-shrink-0" />
                <span>Track assignment submission quality automatically</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 mr-2.5 flex-shrink-0" />
                <span>Identify students requiring academic intervention early</span>
              </li>
            </ul>
          </div>

          {/* Institutions Problem Card */}
          <div className="bg-slate-50/80 rounded-2xl p-8 border border-slate-200/80 shadow-xs hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-6 font-bold text-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Institutions</h3>
            <p className="text-slate-600 text-sm mb-4 font-medium">Institutions need:</p>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 mr-2.5 flex-shrink-0" />
                <span>Better unified academic analytics across departments</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 mr-2.5 flex-shrink-0" />
                <span>Centralized, secure academic records and feedback data</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 mr-2.5 flex-shrink-0" />
                <span>Student engagement and course satisfaction metrics</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 mr-2.5 flex-shrink-0" />
                <span>Data-driven decision making for curriculum planning</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
