import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getTeacherClasses,
  getTeacherClassReportAnalytics,
  downloadClassReportPdf,
  downloadClassReportCsv,
  downloadClassReportZip
} from '../services/api';
import {
  ClassProgressReportData,
  ReportPeriodType,
  EnrolledClass
} from '../types';
import {
  GraduationCap, Download, Calendar, Users, BarChart3,
  TrendingUp, Clock, CheckSquare, AlertTriangle, BookOpen,
  Archive, FileSpreadsheet, FileText, CheckCircle2,
  RefreshCw, ChevronRight, ShieldCheck
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

interface TeacherClassReportsPageProps {
  setCurrentTab?: (tab: string) => void;
}

export const TeacherClassReportsPage: React.FC<TeacherClassReportsPageProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [periodType, setPeriodType] = useState<ReportPeriodType>('monthly');
  const [startDate, setStartDate] = useState<string>('2026-09-01');
  const [endDate, setEndDate] = useState<string>('2026-09-30');
  const [reportData, setReportData] = useState<ClassProgressReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);
  const [downloadingCsv, setDownloadingCsv] = useState<boolean>(false);
  const [downloadingZip, setDownloadingZip] = useState<boolean>(false);

  useEffect(() => {
    getTeacherClasses(user?.id).then((cls) => {
      setClasses(cls);
      if (cls.length > 0 && !selectedClassId) {
        setSelectedClassId(cls[0].id);
      }
    });
  }, [user?.id]);

  const fetchClassReport = async () => {
    if (!selectedClassId) return;
    setLoading(true);
    try {
      const data = await getTeacherClassReportAnalytics(selectedClassId, periodType, startDate, endDate);
      setReportData(data);
    } catch (err) {
      console.error('Error fetching class report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClassId) {
      fetchClassReport();
    }
  }, [selectedClassId, periodType, startDate, endDate]);

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      await downloadClassReportPdf(selectedClassId, periodType, startDate, endDate);
    } catch (err) {
      alert('Failed to download class PDF report.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadCsv = async () => {
    setDownloadingCsv(true);
    try {
      await downloadClassReportCsv(selectedClassId, periodType, startDate, endDate);
    } catch (err) {
      alert('Failed to download class CSV report.');
    } finally {
      setDownloadingCsv(false);
    }
  };

  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      await downloadClassReportZip(selectedClassId, periodType, startDate, endDate);
    } catch (err) {
      alert('Failed to generate and download class ZIP archive.');
    } finally {
      setDownloadingZip(false);
    }
  };

  const COLORS = ['#173F3A', '#79A995', '#E7B978', '#DCE9E1', '#E5E2D9'];

  return (
    <div className="space-y-6 pb-16 font-sans text-[#344541]">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#DCE9E1]/80 via-[#F5F3ED] to-[#DCE9E1]/50 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#173F3A]/10 text-[#173F3A] text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-[#E7B978]" />
            <span>Faculty Consolidated Cohort Evaluation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Class Progress Reports
          </h2>
          <p className="text-sm text-[#344541]/75 mt-1 font-medium">
            Cohort-wide performance distributions, attendance metrics, assessment benchmarks, and multi-format exports for {user?.name}.
          </p>
        </div>

        {/* 3 Download Options */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf || loading}
            className="px-3.5 py-2.5 rounded-xl bg-[#173F3A] hover:bg-[#102d29] text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            title="Download consolidated class report as PDF"
          >
            <Download className="w-4 h-4 text-[#E7B978]" />
            <span>{downloadingPdf ? 'PDF...' : 'Class PDF'}</span>
          </button>

          {/* 2. CSV */}
          <button
            onClick={handleDownloadCsv}
            disabled={downloadingCsv || loading}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#DCE9E1] text-[#173F3A] text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            title="Export class roster data as CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#79A995]" />
            <span>{downloadingCsv ? 'CSV...' : 'Class CSV'}</span>
          </button>

          {/* 3. ZIP Archive */}
          <button
            onClick={handleDownloadZip}
            disabled={downloadingZip || loading}
            className="px-3.5 py-2.5 rounded-xl bg-[#E7B978] hover:bg-[#d6a560] text-[#173F3A] text-xs font-extrabold transition flex items-center space-x-1.5 shadow-xs cursor-pointer disabled:opacity-50"
            title="Download Class PDF, CSV, and All Individual Student PDFs bundled in a single ZIP"
          >
            <Archive className="w-4 h-4" />
            <span>{downloadingZip ? 'Bundling ZIP...' : 'Download Class ZIP'}</span>
          </button>
        </div>
      </div>

      {/* Class Selector Tabs (Restricted to Authorized Subjects) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {classes.map((cls) => {
          const isSelected = selectedClassId === cls.id;
          return (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center space-x-2.5 whitespace-nowrap border ${
                isSelected
                  ? 'bg-[#173F3A] text-white border-[#173F3A] shadow-xs'
                  : 'bg-white border-[#DCE9E1] text-[#344541] hover:bg-[#FAF9F5]'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${isSelected ? 'text-[#E7B978]' : 'text-[#79A995]'}`} />
              <span>{cls.name}</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] ${
                isSelected ? 'bg-white/20 text-[#DCE9E1]' : 'bg-[#FAF9F5] text-[#344541]/70'
              }`}>
                {cls.code}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reporting Period Selector Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#DCE9E1] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Segmented Period Tabs */}
        <div className="flex items-center space-x-1 bg-[#FAF9F5] p-1 rounded-xl border border-[#E5E2D9]">
          {(['daily', 'weekly', 'monthly', 'custom'] as ReportPeriodType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                setPeriodType(type);
                if (type === 'daily') { setStartDate('2026-09-28'); setEndDate('2026-09-28'); }
                else if (type === 'weekly') { setStartDate('2026-09-21'); setEndDate('2026-09-27'); }
                else if (type === 'monthly') { setStartDate('2026-09-01'); setEndDate('2026-09-30'); }
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                periodType === type
                  ? 'bg-[#173F3A] text-white shadow-2xs'
                  : 'text-[#344541]/70 hover:text-[#173F3A] hover:bg-white/60'
              }`}
            >
              {type === 'daily' ? 'Daily' : type === 'weekly' ? 'Weekly' : type === 'monthly' ? 'Monthly' : 'Custom'}
            </button>
          ))}
        </div>

        {/* Date Inputs */}
        <div className="flex items-center space-x-2 text-xs">
          <Calendar className="w-4 h-4 text-[#79A995]" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-[#DCE9E1] bg-[#FAF9F5] text-xs text-[#344541] outline-none"
          />
          <span className="text-[#344541]/60">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-[#DCE9E1] bg-[#FAF9F5] text-xs text-[#344541] outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#DCE9E1] space-y-3">
          <RefreshCw className="w-8 h-8 text-[#79A995] animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#173F3A]">Synthesizing consolidated class report...</p>
        </div>
      ) : !reportData ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#DCE9E1]">
          <p className="text-sm text-[#344541]/70">No class progress data found.</p>
        </div>
      ) : (
        <>
          {/* 4 Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#DCE9E1] shadow-xs space-y-1">
              <span className="text-xs text-[#344541]/60 font-semibold uppercase tracking-wider block">Cohort Average</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#173F3A]">{reportData.metrics.class_average}%</p>
              <span className="text-[11px] text-[#79A995] font-semibold">{reportData.metrics.assessment_count} Recorded Marks</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#DCE9E1] shadow-xs space-y-1">
              <span className="text-xs text-[#344541]/60 font-semibold uppercase tracking-wider block">Average Attendance</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#173F3A]">{reportData.metrics.attendance_rate}%</p>
              <span className="text-[11px] text-[#344541]/70">Across {reportData.metrics.session_count} Sessions</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#DCE9E1] shadow-xs space-y-1">
              <span className="text-xs text-[#344541]/60 font-semibold uppercase tracking-wider block">Assignment Rate</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#173F3A]">{reportData.metrics.assignment_completion}%</p>
              <span className="text-[11px] text-[#344541]/70">{reportData.metrics.submission_count} Submissions Recorded</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#DCE9E1] shadow-xs space-y-1">
              <span className="text-xs text-[#344541]/60 font-semibold uppercase tracking-wider block">Support Identified</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#173F3A]">{reportData.support_candidates.length}</p>
              <span className="text-[11px] text-[#344541]/70">Candidates for Mentorship</span>
            </div>
          </div>

          {/* Grade Distribution & Assessment Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Distribution Bar Chart */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#173F3A]">Cohort Grade Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.distributions} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DCE9E1" vertical={false} />
                    <XAxis dataKey="range" stroke="#344541" fontSize={10} tickLine={false} />
                    <YAxis allowDecimals={false} stroke="#344541" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#173F3A', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                      formatter={(val: any) => [`${val} Students`, 'Count']}
                    />
                    <Bar dataKey="count" fill="#79A995" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Assessment-Wise Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#173F3A]">Assessment-Wise Class Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#DCE9E1] text-[#173F3A] font-bold">
                      <th className="pb-3 px-2">Assessment</th>
                      <th className="pb-3 px-2">Average</th>
                      <th className="pb-3 px-2">High</th>
                      <th className="pb-3 px-2">Low</th>
                      <th className="pb-3 px-2">Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2D9]">
                    {reportData.assessments.map((a, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF9F5]">
                        <td className="py-2.5 px-2 font-bold text-[#173F3A]">{a.assessment}</td>
                        <td className="py-2.5 px-2 font-bold text-[#173F3A]">{a.average}%</td>
                        <td className="py-2.5 px-2 text-emerald-700 font-semibold">{a.highest}%</td>
                        <td className="py-2.5 px-2 text-rose-600 font-semibold">{a.lowest}%</td>
                        <td className="py-2.5 px-2 text-[#344541]/70">{a.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Student Performance Roster Table */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#173F3A]">Enrolled Student Performance Summary</h3>
                <p className="text-xs text-[#344541]/60">Student-by-student attendance, task completion, and subject score.</p>
              </div>
              <span className="text-xs font-bold text-[#173F3A] bg-[#DCE9E1] px-2.5 py-0.5 rounded-full">
                {reportData.students.length} Students
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#DCE9E1] text-[#173F3A] font-bold">
                    <th className="pb-3 px-3">Student Name</th>
                    <th className="pb-3 px-3">Student ID</th>
                    <th className="pb-3 px-3">Attendance</th>
                    <th className="pb-3 px-3">Assignments Done</th>
                    <th className="pb-3 px-3">Subject Score</th>
                    <th className="pb-3 px-3">Standing</th>
                    <th className="pb-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2D9]">
                  {reportData.students.map((s, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF9F5] transition">
                      <td className="py-3 px-3 font-bold text-[#173F3A]">{s.name}</td>
                      <td className="py-3 px-3 font-mono text-[#344541]/70">{s.id}</td>
                      <td className="py-3 px-3">{s.attendance_pct}%</td>
                      <td className="py-3 px-3">{s.assignments_completed} / {s.assignments_total}</td>
                      <td className="py-3 px-3 font-bold text-[#173F3A]">{s.average_score}%</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'High Distinction'
                            ? 'bg-[#DCE9E1] text-[#173F3A]'
                            : s.status === 'Good Standing'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-[#E7B978]/30 text-[#173F3A]'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            if (setCurrentTab) setCurrentTab('teacher-student-reports');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF9F5] hover:bg-[#DCE9E1] border border-[#DCE9E1] text-[#173F3A] text-[11px] font-bold transition cursor-pointer"
                        >
                          View Individual
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Academic Support Candidates with Verification Evidence */}
          <div className="bg-white rounded-3xl p-6 border border-[#E7B978]/70 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#173F3A] uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-[#E7B978]" />
                <span>Students Requiring Academic Support (Evidence-Based)</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7B978]/30 text-[#173F3A]">
                Proactive Guidance
              </span>
            </div>

            {reportData.support_candidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportData.support_candidates.map((c, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#173F3A] text-sm">{c.name} ({c.id})</span>
                      <span className="font-bold text-amber-800 bg-[#E7B978]/30 px-2.5 py-0.5 rounded-lg">
                        {c.score}% Avg
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#173F3A]">Observed Evidence:</span>
                      <ul className="space-y-0.5">
                        {c.evidence.map((ev, i) => (
                          <li key={i} className="text-[#344541]/80 text-[11px] flex items-center space-x-1.5">
                            <span className="w-1 h-1 rounded-full bg-amber-500" />
                            <span>{ev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-[11px] text-[#173F3A] bg-[#DCE9E1]/50 p-2 rounded-xl">
                      <strong>Recommended Action:</strong> {c.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-[#FAF9F5] rounded-2xl border border-[#E5E2D9]">
                <CheckCircle2 className="w-6 h-6 text-[#79A995] mx-auto mb-1" />
                <p className="text-xs font-bold text-[#173F3A]">No Academic Interventions Required</p>
                <p className="text-[11px] text-[#344541]/60">All enrolled students meet the proficiency benchmarks in this reporting window.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
