import React, { useState, useEffect } from 'react';
import { getAdminDashboard } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Users, UserCheck, BookOpen, MessageSquare, Sparkles, Building2, BarChart3
} from 'lucide-react';


export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'students' | 'teachers'>('overview');

  useEffect(() => {
    getAdminDashboard().then(res => setData(res));
  }, []);

  const deptData = data?.department_performance || [
    { dept: 'Computer Science', score: 82 },
    { dept: 'Information Tech', score: 79 },
    { dept: 'Mathematics', score: 74 },
    { dept: 'Electronics', score: 76 }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Institutional Command Center</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
              EduPulse Institutional Analytics
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              VIT University • School of Computer Science & Academic Affairs
            </p>
          </div>
          <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-semibold text-slate-300">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-3 py-1.5 rounded-lg transition ${activeSubTab === 'overview' ? 'bg-indigo-600 text-white font-bold' : ''}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSubTab('students')}
              className={`px-3 py-1.5 rounded-lg transition ${activeSubTab === 'students' ? 'bg-indigo-600 text-white font-bold' : ''}`}
            >
              Students (1,240)
            </button>
            <button
              onClick={() => setActiveSubTab('teachers')}
              className={`px-3 py-1.5 rounded-lg transition ${activeSubTab === 'teachers' ? 'bg-indigo-600 text-white font-bold' : ''}`}
            >
              Faculty (48)
            </button>
          </div>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Students</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{data?.total_students || 1240}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Total Faculty</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-2">{data?.total_teachers || 48}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Active Courses</span>
          <p className="text-2xl font-extrabold text-purple-600 mt-2">{data?.active_courses || 32}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Assignments</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-2">{data?.assignments_created || 380}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Feedback Items</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2">{data?.feedback_responses || 1120}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Opportunities</span>
          <p className="text-2xl font-extrabold text-cyan-600 mt-2">{data?.active_opportunities || 85}</p>
        </div>
      </div>

      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* DEPARTMENT PERFORMANCE CHART */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-slate-900 text-lg mb-2">Departmental Academic Benchmark</h3>
            <p className="text-xs text-slate-500 mb-6">Average student score across university engineering schools</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val) => [`${val}%`, 'Avg Score']} />
                  <Bar dataKey="score" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SYSTEM USAGE DISTRIBUTION */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Platform Usage & Engagement Index</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Student Active Weekly Retention</span>
                  <span className="text-emerald-600">92%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Teacher Assignment Evaluation Velocity</span>
                  <span className="text-indigo-600">88%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>AI Copilot & Study Plan Utilization</span>
                  <span className="text-purple-600">84%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '84%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">Enrolled Student Directory (1,240 Total)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Course / Year</th>
                  <th className="p-3">CGPA</th>
                  <th className="p-3">Attendance</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-3 font-bold text-slate-900">Atharva Pagarwal</td>
                  <td className="p-3">B.Tech CS • 3rd Year</td>
                  <td className="p-3">8.2</td>
                  <td className="p-3">87%</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">On Track</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Riya Sharma</td>
                  <td className="p-3">B.Tech CS • 3rd Year</td>
                  <td className="p-3">9.1</td>
                  <td className="p-3">94%</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Honors</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Aarav Patel</td>
                  <td className="p-3">B.Tech CS • 3rd Year</td>
                  <td className="p-3">7.4</td>
                  <td className="p-3">76%</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Moderate Support</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'teachers' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-lg">Faculty Directory (48 Total)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">Prof. Rajesh Sharma</h4>
              <p className="text-xs text-indigo-600">Computer Science & Engineering</p>
              <p className="text-xs text-slate-500 mt-1">Subjects: Data Structures & Algorithms, Python</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">Dr. Vance Montgomery</h4>
              <p className="text-xs text-indigo-600">Computer Science & Engineering</p>
              <p className="text-xs text-slate-500 mt-1">Subjects: Computer Networks, Cyber Security</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
