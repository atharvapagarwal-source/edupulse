import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, User, Mail, Calendar, Info } from 'lucide-react';

export const AcademicSupportPage: React.FC = () => {
  const [supportStudents] = useState([
    {
      id: 'std-003',
      name: 'Aarav Patel',
      course: 'B.Tech CS (3rd Year)',
      attendance_pct: 76.0,
      assignment_completion_pct: 70.0,
      average_score: 68.0,
      support_level: 'Moderate Support Indicator',
      style: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeStyle: 'bg-amber-200 text-amber-900',
      indicators: [
        'Assessment score below class average (68.0%)',
        'Assignment submission completion at 70.0%'
      ]
    },
    {
      id: 'std-005',
      name: 'Kabir Singh',
      course: 'B.Tech CS (3rd Year)',
      attendance_pct: 65.0,
      assignment_completion_pct: 55.0,
      average_score: 58.0,
      support_level: 'Higher Support Indicator',
      style: 'bg-rose-50 border-rose-200 text-rose-900',
      badgeStyle: 'bg-rose-200 text-rose-900',
      indicators: [
        'Declining attendance trend (< 65%)',
        'Low assignment completion rate (55%)',
        'Assessment score below threshold (58.0%)'
      ]
    },
    {
      id: 'std-008',
      name: 'Priya Nair',
      course: 'B.Tech CS (3rd Year)',
      attendance_pct: 71.0,
      assignment_completion_pct: 60.0,
      average_score: 62.5,
      support_level: 'Moderate Support Indicator',
      style: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeStyle: 'bg-amber-200 text-amber-900',
      indicators: [
        'Attendance decline over past 3 weeks',
        'Multiple pending homework submissions'
      ]
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Proactive Mentorship & Intervention Module</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Students Requiring Academic Support
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl">
          Multi-metric indicator system that identifies candidates for additional faculty guidance, peer tutoring, or tailored study material.
        </p>

        {/* Ethical Disclaimer Box */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3 text-xs text-slate-600">
          <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>System Guidance:</strong> EduPulse uses non-stigmatizing support indicators (Low, Moderate, Higher Support Need). These indicators are intended solely to support proactive faculty intervention and academic guidance, not definitive predictions about student potential.
          </div>
        </div>
      </div>

      {/* STUDENT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supportStudents.map((s) => (
          <div key={s.id} className={`rounded-2xl p-6 border shadow-xs flex flex-col justify-between space-y-4 ${s.style}`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-500">ID: {s.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${s.badgeStyle}`}>
                  {s.support_level}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-lg">{s.name}</h3>
                <p className="text-xs text-slate-600 font-medium">{s.course}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-white/70 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Attendance</span>
                  <span className="font-extrabold text-slate-900">{s.attendance_pct}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Completion</span>
                  <span className="font-extrabold text-slate-900">{s.assignment_completion_pct}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Avg Score</span>
                  <span className="font-extrabold text-slate-900">{s.average_score}%</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 block">Observed Support Indicators:</span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {s.indicators.map((ind, i) => (
                    <li key={i} className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 mr-2 flex-shrink-0" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60 flex space-x-2">
              <button
                onClick={() => alert(`Mentorship invite sent to ${s.name}`)}
                className="flex-1 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center justify-center space-x-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Mentorship</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
