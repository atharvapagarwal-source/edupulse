import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getStudentProgressAnalytics,
  downloadStudentReportPdf,
  downloadStudentReportCsv,
  getTeacherClasses,
  postTeacherRemark
} from '../services/api';
import {
  StudentProgressReportData,
  ReportPeriodType,
  EnrolledClass
} from '../types';
import {
  UserCheck, Download, Calendar, Search, Filter,
  TrendingUp, Clock, CheckSquare, AlertTriangle,
  BookOpen, Sparkles, FileSpreadsheet, Bot,
  MessageSquare, Save, CheckCircle2, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from 'recharts';

export const TeacherStudentReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-001');

  // Enrolled students roster (in teacher's classes)
  const roster = [
    { id: 'std-001', name: 'Atharva Pagarwal', course: 'B.Tech CS (3rd Year)', email: 'atharva@studentconnector.edu' },
    { id: 'std-002', name: 'Riya Sharma', course: 'B.Tech CS (3rd Year)', email: 'riya@studentconnector.edu' }
  ];

  const [periodType, setPeriodType] = useState<ReportPeriodType>('monthly');
  const [startDate, setStartDate] = useState<string>('2026-09-01');
  const [endDate, setEndDate] = useState<string>('2026-09-30');
  const [reportData, setReportData] = useState<StudentProgressReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);
  const [downloadingCsv, setDownloadingCsv] = useState<boolean>(false);

  // Teacher remark state
  const [newRemark, setNewRemark] = useState<string>('');
  const [remarkSubject, setRemarkSubject] = useState<string>('');
  const [savingRemark, setSavingRemark] = useState<boolean>(false);
  const [remarkSuccess, setRemarkSuccess] = useState<boolean>(false);

  useEffect(() => {
    getTeacherClasses(user?.id).then((cls) => {
      setClasses(cls);
      if (cls.length > 0) {
        setRemarkSubject(cls[0].name);
      }
    });
  }, [user?.id]);

  const fetchStudentReport = async () => {
    setLoading(true);
    try {
      const data = await getStudentProgressAnalytics(periodType, startDate, endDate, selectedStudentId);
      setReportData(data);
    } catch (err) {
      console.error('Error fetching student report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentReport();
  }, [selectedStudentId, periodType, startDate, endDate]);

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      await downloadStudentReportPdf(periodType, startDate, endDate, selectedStudentId);
    } catch (err) {
      alert('Failed to download student PDF report.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadCsv = async () => {
    setDownloadingCsv(true);
    try {
      await downloadStudentReportCsv(periodType, startDate, endDate, selectedStudentId);
    } catch (err) {
      alert('Failed to download student CSV report.');
    } finally {
      setDownloadingCsv(false);
    }
  };

  const handleSaveRemark = async () => {
    if (!newRemark.trim() || !remarkSubject) return;
    setSavingRemark(true);
    try {
      await postTeacherRemark(selectedStudentId, remarkSubject, newRemark.trim());
      setRemarkSuccess(true);
      setNewRemark('');
      setTimeout(() => setRemarkSuccess(false), 3000);
      fetchStudentReport();
    } catch (err) {
      alert('Failed to record teacher remark.');
    } finally {
      setSavingRemark(false);
    }
  };

  const filteredStudents = roster.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-16 font-sans text-[#344541]">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#DCE9E1]/80 via-[#F5F3ED] to-[#DCE9E1]/50 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#173F3A]/10 text-[#173F3A] text-xs font-semibold mb-2">
            <UserCheck className="w-3.5 h-3.5 text-[#E7B978]" />
            <span>Faculty Student Evaluation & Progress Reports</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Individual Student Reports
          </h2>
          <p className="text-sm text-[#344541]/75 mt-1 font-medium">
            Authorized progress analytics, assessment performance, and print-ready reports for students in {user?.name}'s assigned classes.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf || loading}
            className="px-4 py-2.5 rounded-xl bg-[#173F3A] hover:bg-[#102d29] text-white text-xs font-bold transition flex items-center space-x-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#E7B978]" />
            <span>{downloadingPdf ? 'Generating PDF...' : 'Download Student PDF'}</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            disabled={downloadingCsv || loading}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#DCE9E1] text-[#173F3A] text-xs font-bold transition flex items-center space-x-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#79A995]" />
            <span>{downloadingCsv ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Student Selection & Search Header */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#173F3A]">Select Enrolled Student</h3>
            <p className="text-xs text-[#344541]/60">Select an authorized student to inspect individual performance.</p>
          </div>

          {/* Search Box */}
          <div className="flex items-center space-x-2 bg-[#FAF9F5] border border-[#DCE9E1] rounded-xl px-3 py-1.5 w-full sm:w-64">
            <Search className="w-4 h-4 text-[#344541]/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or ID..."
              className="bg-transparent border-none outline-none text-xs text-[#344541] w-full"
            />
          </div>
        </div>

        {/* Student Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {filteredStudents.map((s) => {
            const isSelected = selectedStudentId === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedStudentId(s.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#DCE9E1]/60 border-[#173F3A] ring-2 ring-[#173F3A]/20 shadow-xs'
                    : 'bg-[#FAF9F5] border-[#E5E2D9] hover:bg-white hover:border-[#79A995]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-[#173F3A] text-white' : 'bg-[#79A995] text-[#173F3A]'
                  }`}>
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#173F3A] text-sm">{s.name}</h4>
                    <p className="text-[11px] text-[#344541]/60 font-mono">{s.id} • {s.course}</p>
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-[#173F3A]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reporting Period Selector Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#DCE9E1] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Period Selector */}
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
          <p className="text-sm font-semibold text-[#173F3A]">Compiling student performance report...</p>
        </div>
      ) : !reportData ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#DCE9E1]">
          <p className="text-sm text-[#344541]/70">No report records found for this student and period.</p>
        </div>
      ) : (
        <>
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#DCE9E1] shadow-xs space-y-1">
              <span className="text-xs text-[#344541]/60 font-semibold uppercase tracking-wider block">Average Score</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#173F3A]">{reportData.summary_metrics.average_score}%</p>
              <span className="text-[11px] text-[#79A995] font-semibold">{reportData.summary_metrics.eval_count} Assessments Evaluated</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#DCE9E1] shadow-xs space-y-1">
              <span className="text-xs text-[#344541]/60 font-semibold uppercase tracking-wider block">Attendance Rate</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#173F3A]">{reportData.attendance_summary.attendance_pct}%</p>
              <span className="text-[11px] text-[#344541]/70">{reportData.attendance_summary.present_sessions} of {reportData.attendance_summary.total_sessions} Sessions Attended</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#DCE9E1] shadow-xs space-y-1">
              <span className="text-xs text-[#344541]/60 font-semibold uppercase tracking-wider block">Coursework Completion</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#173F3A]">{reportData.assignment_summary.completion_pct}%</p>
              <span className="text-[11px] text-[#344541]/70">{reportData.assignment_summary.submitted_count} Tasks Submitted</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#DCE9E1] shadow-xs space-y-1">
              <span className="text-xs text-[#344541]/60 font-semibold uppercase tracking-wider block">Period Trajectory</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#173F3A]">{reportData.comparison.delta_str}</p>
              <span className="text-[11px] text-[#344541]/70">{reportData.comparison.label}</span>
            </div>
          </div>

          {/* Subject Performance & Assessment Marks Log */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#173F3A]">Subject-Wise Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#DCE9E1] text-[#173F3A] font-bold">
                      <th className="pb-3 px-2">Subject</th>
                      <th className="pb-3 px-2">Avg</th>
                      <th className="pb-3 px-2">Max</th>
                      <th className="pb-3 px-2">Standing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2D9]">
                    {reportData.subject_performance.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-[#FAF9F5]">
                        <td className="py-2.5 px-2 font-bold text-[#173F3A]">{sub.subject}</td>
                        <td className="py-2.5 px-2 font-bold text-[#173F3A]">{sub.average_score}%</td>
                        <td className="py-2.5 px-2">{sub.max_score}%</td>
                        <td className="py-2.5 px-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCE9E1] text-[#173F3A]">
                            {sub.standing}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assessment Records Log */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#173F3A]">Assessment-Wise Records</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {reportData.assessment_records.map((a, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#173F3A] block">{a.topic}</span>
                      <span className="text-[10px] text-[#344541]/60">{a.subject} • {a.assessment_type} ({a.assessment_date})</span>
                    </div>
                    <span className="font-extrabold text-[#173F3A] bg-white border border-[#DCE9E1] px-2.5 py-1 rounded-lg">
                      {a.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Teacher Instructional Remark Input Box */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#173F3A] uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-[#79A995]" />
              <span>Record Official Faculty Remark for {reportData.student.name}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="text-xs font-bold text-[#173F3A] block mb-1">Course Subject:</label>
                <select
                  value={remarkSubject}
                  onChange={(e) => setRemarkSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DCE9E1] text-xs text-[#344541] bg-[#FAF9F5] outline-none"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-[#173F3A] block mb-1">Instructional Remark / Feedback:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                    placeholder="Enter instructional feedback (e.g. Focus on graph algorithms recursion before mid-term)..."
                    className="flex-1 p-2.5 rounded-xl border border-[#DCE9E1] text-xs text-[#344541] bg-[#FAF9F5] outline-none"
                  />
                  <button
                    onClick={handleSaveRemark}
                    disabled={savingRemark || !newRemark.trim()}
                    className="px-4 py-2.5 bg-[#173F3A] hover:bg-[#102d29] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingRemark ? 'Saving...' : 'Save Remark'}</span>
                  </button>
                </div>
              </div>
            </div>

            {remarkSuccess && (
              <div className="p-3 rounded-xl bg-[#DCE9E1] text-[#173F3A] text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#79A995]" />
                <span>Remark successfully logged and stamped on official progress records!</span>
              </div>
            )}
          </div>

          {/* AI-Supported Recommendations & Priority Focus Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Areas Requiring Attention (< 70%) */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#173F3A] uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-[#E7B978]" />
                <span>Observed Academic Support Indicators</span>
              </div>
              <p className="text-xs text-[#344541]/70">Evidence-based indicators for topics scoring below 70%.</p>

              {reportData.support_topics.length > 0 ? (
                <div className="space-y-2">
                  {reportData.support_topics.map((t, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#173F3A] block">{t.topic}</span>
                        <span className="text-[10px] text-[#344541]/60">{t.subject} • Assessment score below benchmark</span>
                      </div>
                      <span className="font-bold text-amber-800 bg-[#E7B978]/30 px-2.5 py-1 rounded-lg">
                        {t.score}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-[#FAF9F5] rounded-2xl border border-[#E5E2D9]">
                  <p className="text-xs text-[#344541]/60">Student is performing proficiently across all evaluated topics (&gt;70%).</p>
                </div>
              )}
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-3xl p-6 border border-[#E7B978]/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#173F3A]">
                  <Bot className="w-4 h-4 text-[#E7B978]" />
                  <span className="uppercase tracking-wider">AI Copilot Pedagogical Insights</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7B978]/30 text-[#173F3A]">
                  AI-Assisted
                </span>
              </div>

              <div className="space-y-2">
                {reportData.ai_recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-1 text-xs">
                    <span className="font-bold text-[#173F3A] block">{rec.title}</span>
                    <p className="text-[#344541]/75 leading-relaxed">{rec.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
