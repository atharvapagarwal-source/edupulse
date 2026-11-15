import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTeacherAnalytics, getTeacherClasses } from '../services/api';
import { TeacherAnalyticsData, EnrolledClass } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import {
  Brain, Users, Filter, AlertTriangle, CheckCircle, ChevronDown,
  X, Award, ArrowUpRight, Search, BookOpen, Clock
} from 'lucide-react';

export const TeacherStudentAnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<TeacherAnalyticsData | null>(null);
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const filter = selectedSubject === 'All' ? undefined : selectedSubject;
    Promise.all([
      getTeacherAnalytics(user?.id, filter),
      getTeacherClasses(user?.id)
    ]).then(([ana, cls]) => {
      if (isMounted) {
        setAnalytics(ana);
        setClasses(cls);
        setLoading(false);
      }
    }).catch(err => {
      console.warn("Analytics fetch error:", err);
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [user?.id, selectedSubject]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#79A995] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#344541]/70 font-semibold">Computing authorized cohort performance diagnostics...</p>
        </div>
      </div>
    );
  }

  const distributions = analytics?.class_distributions || [];
  const subjectAverages = analytics?.subject_averages || [];
  const assessmentPerformance = analytics?.assessment_performance || [];
  const students = analytics?.students || [];
  const supportIndicators = analytics?.support_indicators || [];

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans text-[#344541]">

      {/* Header Banner with Filter Dropdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-[#79A995] uppercase tracking-wider">
            Verified Cohort Analytics
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight mt-1">
            Student Analytics & Performance Trends
          </h2>
          <p className="text-xs sm:text-sm text-[#344541]/70 mt-1 max-w-xl">
            Real performance distributions, assessment metrics, and individual drill-down records for your authorized courses.
          </p>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <Filter className="w-4 h-4 text-[#79A995]" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2.5 rounded-2xl bg-[#FAF9F5] border border-[#DCE9E1] text-xs font-bold text-[#173F3A] focus:outline-none"
          >
            <option value="All">All Assigned Modules</option>
            {classes.map(c => (
              <option key={c.id} value={c.name}>{c.code}: {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. CHARTS GRID: DISTRIBUTION & ASSESSMENT AVERAGES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart A: Class-Wise Grade Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#173F3A]">Class Performance Distribution</h3>
              <p className="text-xs text-[#344541]/60">Student frequency across standard grading tiers</p>
            </div>
            <span className="text-xs font-bold text-[#79A995]">Grade Buckets</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributions} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F3ED" vertical={false} />
                <XAxis dataKey="grade_range" tick={{ fill: '#344541', fontSize: 10 }} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fill: '#344541', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#173F3A', borderRadius: '1rem', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#173F3A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Assessment-Wise Performance */}
        <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#173F3A]">Assessment-Wise Performance</h3>
              <p className="text-xs text-[#344541]/60">Average score across quizzes, midterms & assignments</p>
            </div>
            <span className="text-xs font-bold text-[#173F3A]">{assessmentPerformance.length} Tests</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={assessmentPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F3ED" vertical={false} />
                <XAxis dataKey="assessment" tick={{ fill: '#344541', fontSize: 10 }} angle={-15} textAnchor="end" />
                <YAxis domain={[40, 100]} tick={{ fill: '#344541', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#173F3A', borderRadius: '1rem', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#79A995"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#E7B978', strokeWidth: 2, stroke: '#173F3A' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 2. SUBJECT-WISE AVERAGE METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {subjectAverages.map((sub, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCE9E1] text-[#173F3A]">
                Course Metric
              </span>
              <span className="text-xs text-[#344541]/60">{sub.count} Records</span>
            </div>
            <h4 className="text-sm font-bold text-[#173F3A] truncate">{sub.subject}</h4>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-3xl font-black text-[#173F3A]">{sub.average_score}%</span>
              <span className="text-xs text-[#79A995] font-semibold">Cohort Mean</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#344541]/70 mt-3 pt-3 border-t border-[#E5E2D9]">
              <span>Lowest: <strong>{sub.lowest_score}%</strong></span>
              <span>Highest: <strong>{sub.highest_score}%</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. INDIVIDUAL STUDENT DRILL-DOWN TABLE */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#173F3A]">Student Academic Progress</h3>
            <p className="text-xs text-[#344541]/60">Click any student to view authorized academic records and drill-down history</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-[#344541]/50 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by student name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-2xl bg-[#FAF9F5] border border-[#DCE9E1] text-xs text-[#344541] focus:outline-none w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E5E2D9] text-[#344541]/60 font-semibold">
                <th className="pb-3">Student Name</th>
                <th className="pb-3">Student ID</th>
                <th className="pb-3">Module Average</th>
                <th className="pb-3">Assessments</th>
                <th className="pb-3">Guidance Indicator</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E2D9]">
              {filteredStudents.map((std) => (
                <tr
                  key={std.id}
                  onClick={() => setSelectedStudent(std)}
                  className="hover:bg-[#FAF9F5] transition cursor-pointer"
                >
                  <td className="py-3.5 font-bold text-[#173F3A] flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#173F3A]/10 text-[#173F3A] flex items-center justify-center font-bold text-[11px]">
                      {std.name.charAt(0)}
                    </div>
                    <span>{std.name}</span>
                  </td>
                  <td className="py-3.5 font-mono text-[#344541]/70">{std.id}</td>
                  <td className="py-3.5 font-black text-[#173F3A] text-sm">{std.average_score}%</td>
                  <td className="py-3.5 text-[#344541]/80">{std.assessments_count} Completed</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      std.support_status === 'On Track'
                        ? 'bg-[#DCE9E1] text-[#173F3A]'
                        : std.support_status === 'Moderate Support'
                        ? 'bg-[#E7B978]/30 text-[#173F3A]'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {std.support_status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="text-xs font-semibold text-[#79A995] hover:text-[#173F3A] inline-flex items-center">
                      Drill Down <ChevronDown className="w-3.5 h-3.5 ml-0.5 -rotate-90" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ACADEMIC SUPPORT INDICATORS (WITH EVIDENCE) */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-[#E7B978]" />
          <div>
            <h3 className="text-base font-bold text-[#173F3A]">Students Flagged for Academic Guidance</h3>
            <p className="text-xs text-[#344541]/60">Verifiable indicators identified from recorded scores to support timely faculty intervention</p>
          </div>
        </div>

        {supportIndicators.length === 0 ? (
          <div className="p-6 text-center bg-[#DCE9E1]/30 rounded-2xl text-xs text-[#173F3A] flex items-center justify-center space-x-2">
            <CheckCircle className="w-4 h-4 text-[#79A995]" />
            <span>All students in your assigned courses are currently performing above threshold!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportIndicators.map((sup, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#173F3A]">{sup.student_name}</h4>
                    <span className="text-[10px] font-mono text-[#344541]/60">{sup.student_id}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    sup.level === 'Higher' ? 'bg-rose-100 text-rose-800' : 'bg-[#E7B978]/30 text-[#173F3A]'
                  }`}>
                    {sup.level} Support Indicator
                  </span>
                </div>

                <div className="space-y-1 text-[11px] text-[#344541]/80">
                  <p className="font-semibold text-[#173F3A]">Verified Diagnostic Evidence:</p>
                  {sup.evidence.map((ev, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-rose-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-[#344541]/70 bg-white p-2.5 rounded-xl border border-[#DCE9E1]">
                  <strong>Intervention Recommendation:</strong> {sup.recommendation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DRILL-DOWN MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-[#173F3A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#DCE9E1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#173F3A] text-white flex items-center justify-center font-bold text-sm">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#173F3A]">{selectedStudent.name}</h3>
                  <p className="text-xs font-mono text-[#344541]/70">Authorized Student ID: {selectedStudent.id}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full bg-[#FAF9F5] hover:bg-[#E5E2D9] flex items-center justify-center text-[#344541]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9]">
                <span className="text-[10px] text-[#344541]/60 block">Module Average Score</span>
                <span className="text-xl font-black text-[#173F3A]">{selectedStudent.average_score}%</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9]">
                <span className="text-[10px] text-[#344541]/60 block">Assessments Evaluated</span>
                <span className="text-xl font-black text-[#173F3A]">{selectedStudent.assessments_count}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#DCE9E1]/30 border border-[#DCE9E1] text-xs space-y-1.5">
              <span className="font-bold text-[#173F3A]">Academic Guidance Status:</span>
              <p className="text-[#344541]/80">
                {selectedStudent.support_status === 'On Track'
                  ? 'The student is demonstrating consistent performance across evaluated topics in this module.'
                  : 'Targeted support is advised on mid-term review topics. Consider assigning supplementary practice problems.'}
              </p>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 rounded-xl bg-[#173F3A] text-white font-bold text-xs"
            >
              Close Record View
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
