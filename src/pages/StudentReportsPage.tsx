import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getStudentProgressAnalytics,
  downloadStudentReportPdf,
  downloadStudentReportCsv,
  getReportHistory
} from '../services/api';
import {
  StudentProgressReportData,
  ReportPeriodType,
  ReportHistoryItem
} from '../types';
import {
  FileText, Download, Calendar, TrendingUp, CheckCircle2,
  AlertTriangle, BookOpen, Clock, Sparkles, History,
  FileSpreadsheet, ArrowUpRight, ArrowDownRight, Minus, Filter,
  Bot, CheckSquare, X, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';

export const StudentReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [periodType, setPeriodType] = useState<ReportPeriodType>('monthly');
  const [startDate, setStartDate] = useState<string>('2026-09-01');
  const [endDate, setEndDate] = useState<string>('2026-09-30');
  const [reportData, setReportData] = useState<StudentProgressReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);
  const [downloadingCsv, setDownloadingCsv] = useState<boolean>(false);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [historyItems, setHistoryItems] = useState<ReportHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // Period presets
  const applyPreset = (type: ReportPeriodType, start: string, end: string) => {
    setPeriodType(type);
    setStartDate(start);
    setEndDate(end);
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await getStudentProgressAnalytics(periodType, startDate, endDate, user?.id);
      setReportData(data);
    } catch (err) {
      console.error('Error fetching student progress report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [user?.id, periodType, startDate, endDate]);

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      await downloadStudentReportPdf(periodType, startDate, endDate, user?.id);
    } catch (err) {
      alert('Failed to download PDF report. Please verify connection.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadCsv = async () => {
    setDownloadingCsv(true);
    try {
      await downloadStudentReportCsv(periodType, startDate, endDate, user?.id);
    } catch (err) {
      alert('Failed to download CSV report. Please verify connection.');
    } finally {
      setDownloadingCsv(false);
    }
  };

  const openHistory = async () => {
    setHistoryOpen(true);
    setLoadingHistory(true);
    try {
      const hist = await getReportHistory();
      setHistoryItems(hist);
    } catch (err) {
      console.error('Error loading report history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 font-sans text-[#344541]">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#DCE9E1]/80 via-[#F5F3ED] to-[#DCE9E1]/50 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#173F3A]/10 text-[#173F3A] text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5 text-[#E7B978]" />
            <span>Academic Performance Tracking</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            My Progress Reports
          </h2>
          <p className="text-sm text-[#344541]/75 mt-1 font-medium">
            Verified academic performance records, attendance tracking, and print-ready progress reports for {user?.name}.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf || loading}
            className="px-4 py-2.5 rounded-xl bg-[#173F3A] hover:bg-[#102d29] text-white text-xs font-bold transition flex items-center space-x-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#E7B978]" />
            <span>{downloadingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            disabled={downloadingCsv || loading}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#DCE9E1] text-[#173F3A] text-xs font-bold transition flex items-center space-x-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#79A995]" />
            <span>{downloadingCsv ? 'Exporting...' : 'Export CSV'}</span>
          </button>

          <button
            onClick={openHistory}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#DCE9E1] text-[#173F3A] text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
            title="Previously generated reports"
          >
            <History className="w-4 h-4 text-[#79A995]" />
            <span className="hidden sm:inline">Report History</span>
          </button>
        </div>
      </div>

      {/* Reporting Period Selector Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#DCE9E1] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Segmented Period Tabs */}
        <div className="flex items-center space-x-1 bg-[#FAF9F5] p-1 rounded-xl border border-[#E5E2D9]">
          {(['daily', 'weekly', 'monthly', 'custom'] as ReportPeriodType[]).map((type) => (
            <button
              key={type}
              onClick={() => {
                if (type === 'daily') applyPreset('daily', '2026-09-28', '2026-09-28');
                else if (type === 'weekly') applyPreset('weekly', '2026-09-21', '2026-09-27');
                else if (type === 'monthly') applyPreset('monthly', '2026-09-01', '2026-09-30');
                else setPeriodType('custom');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                periodType === type
                  ? 'bg-[#173F3A] text-white shadow-2xs'
                  : 'text-[#344541]/70 hover:text-[#173F3A] hover:bg-white/60'
              }`}
            >
              {type === 'daily' ? 'Daily' : type === 'weekly' ? 'Weekly' : type === 'monthly' ? 'Monthly' : 'Custom Range'}
            </button>
          ))}
        </div>

        {/* Quick Academic Presets & Date Inputs */}
        <div className="flex flex-wrap items-center gap-2">
          {periodType === 'daily' && (
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-[#344541]/60 font-medium">Session:</span>
              {[
                { label: 'Sep 28 (Graphs)', dt: '2026-09-28' },
                { label: 'Sep 29 (TCP)', dt: '2026-09-29' },
                { label: 'Oct 02 (OOPS)', dt: '2026-10-02' },
                { label: 'Oct 06 (Sockets)', dt: '2026-10-06' }
              ].map((p) => (
                <button
                  key={p.dt}
                  onClick={() => applyPreset('daily', p.dt, p.dt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    startDate === p.dt ? 'bg-[#79A995] text-[#173F3A] border-[#79A995]' : 'bg-[#FAF9F5] border-[#E5E2D9] text-[#344541] hover:bg-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {periodType === 'weekly' && (
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-[#344541]/60 font-medium">Week:</span>
              {[
                { label: 'W3 (Sep 14-20)', s: '2026-09-14', e: '2026-09-20' },
                { label: 'W4 (Sep 21-27)', s: '2026-09-21', e: '2026-09-27' },
                { label: 'W5 (Sep 28-Oct 4)', s: '2026-09-28', e: '2026-10-04' },
                { label: 'W6 (Oct 5-11)', s: '2026-10-05', e: '2026-10-11' }
              ].map((p) => (
                <button
                  key={p.s}
                  onClick={() => applyPreset('weekly', p.s, p.e)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    startDate === p.s ? 'bg-[#79A995] text-[#173F3A] border-[#79A995]' : 'bg-[#FAF9F5] border-[#E5E2D9] text-[#344541] hover:bg-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {periodType === 'monthly' && (
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-[#344541]/60 font-medium">Month:</span>
              {[
                { label: 'August 2026', s: '2026-08-24', e: '2026-08-31' },
                { label: 'September 2026', s: '2026-09-01', e: '2026-09-30' },
                { label: 'October 2026', s: '2026-10-01', e: '2026-10-15' }
              ].map((p) => (
                <button
                  key={p.s}
                  onClick={() => applyPreset('monthly', p.s, p.e)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    startDate === p.s ? 'bg-[#79A995] text-[#173F3A] border-[#79A995]' : 'bg-[#FAF9F5] border-[#E5E2D9] text-[#344541] hover:bg-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {periodType === 'custom' && (
            <div className="flex items-center space-x-2 text-xs">
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
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#DCE9E1] space-y-3">
          <RefreshCw className="w-8 h-8 text-[#79A995] animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#173F3A]">Compiling verified academic progress data...</p>
        </div>
      ) : !reportData ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#DCE9E1]">
          <p className="text-sm text-[#344541]/70">No progress report records available for this selection.</p>
        </div>
      ) : (
        <>
          {/* Executive KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Evaluated Marks */}
            <div className="p-5 rounded-3xl bg-white border border-[#DCE9E1] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-[#344541]/60 font-semibold uppercase tracking-wider">
                <span>Period Average</span>
                <TrendingUp className="w-4 h-4 text-[#79A995]" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#173F3A]">
                {reportData.summary_metrics.average_score > 0 ? `${reportData.summary_metrics.average_score}%` : 'N/A'}
              </p>
              <div className="text-[11px] text-[#344541]/75 flex items-center justify-between pt-1">
                <span>{reportData.summary_metrics.eval_count} Assessments</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#DCE9E1] text-[#173F3A]">
                  {reportData.summary_metrics.status}
                </span>
              </div>
            </div>

            {/* 2. Attendance */}
            <div className="p-5 rounded-3xl bg-white border border-[#DCE9E1] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-[#344541]/60 font-semibold uppercase tracking-wider">
                <span>Attendance Rate</span>
                <Clock className="w-4 h-4 text-[#79A995]" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#173F3A]">
                {reportData.attendance_summary.attendance_pct}%
              </p>
              <div className="text-[11px] text-[#344541]/75 flex items-center justify-between pt-1">
                <span>{reportData.attendance_summary.present_sessions} / {reportData.attendance_summary.total_sessions} Sessions</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  reportData.attendance_summary.meets_threshold ? 'bg-[#DCE9E1] text-[#173F3A]' : 'bg-[#E7B978]/30 text-[#173F3A]'
                }`}>
                  {reportData.attendance_summary.meets_threshold ? 'Compliant (≥75%)' : 'Attention (<75%)'}
                </span>
              </div>
            </div>

            {/* 3. Assignment Completion */}
            <div className="p-5 rounded-3xl bg-white border border-[#DCE9E1] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-[#344541]/60 font-semibold uppercase tracking-wider">
                <span>Coursework Done</span>
                <CheckSquare className="w-4 h-4 text-[#79A995]" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#173F3A]">
                {reportData.assignment_summary.completion_pct}%
              </p>
              <div className="text-[11px] text-[#344541]/75 flex items-center justify-between pt-1">
                <span>{reportData.assignment_summary.submitted_count} of {reportData.assignment_summary.total_assigned} Tasks</span>
                <span className="text-[10px] text-[#344541]/60">
                  {reportData.assignment_summary.pending_count} Pending
                </span>
              </div>
            </div>

            {/* 4. Comparison with Prior Period */}
            <div className="p-5 rounded-3xl bg-white border border-[#DCE9E1] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-[#344541]/60 font-semibold uppercase tracking-wider">
                <span>Period Comparison</span>
                {reportData.comparison.has_comparison ? (
                  reportData.comparison.delta > 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  ) : reportData.comparison.delta < 0 ? (
                    <ArrowDownRight className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Minus className="w-4 h-4 text-[#79A995]" />
                  )
                ) : (
                  <Sparkles className="w-4 h-4 text-[#E7B978]" />
                )}
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#173F3A]">
                {reportData.comparison.delta_str}
              </p>
              <div className="text-[11px] text-[#344541]/75 flex items-center justify-between pt-1">
                <span>{reportData.comparison.label}</span>
                <span className="text-[10px] text-[#344541]/60 truncate max-w-[100px]" title={reportData.comparison.context}>
                  {reportData.comparison.context}
                </span>
              </div>
            </div>
          </div>

          {/* Subject Performance & Trend Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject-Wise Performance Bar Chart */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#173F3A]">Subject-Wise Marks Average</h3>
                  <p className="text-xs text-[#344541]/60 mt-0.5">Average scores across verified course evaluations.</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF9F5] border border-[#E5E2D9]">
                  {reportData.subject_performance.length} Subjects
                </span>
              </div>

              {reportData.subject_performance.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={reportData.subject_performance}
                      margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#DCE9E1" vertical={false} />
                      <XAxis
                        dataKey="code"
                        stroke="#344541"
                        fontSize={11}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        stroke="#344541"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#173F3A',
                          borderRadius: '12px',
                          color: '#fff',
                          border: 'none',
                          fontSize: '12px'
                        }}
                        formatter={(val: any) => [`${val}%`, 'Average']}
                        labelFormatter={(code) => {
                          const item = reportData.subject_performance.find(s => s.code === code);
                          return item ? item.subject : code;
                        }}
                      />
                      <Bar dataKey="average_score" fill="#173F3A" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-[#344541]/60 bg-[#FAF9F5] rounded-2xl">
                  No subject evaluations recorded in this selected range.
                </div>
              )}
            </div>

            {/* Assessment Timeline / Performance Trajectory */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#173F3A]">Assessment Chronology & Trend</h3>
                  <p className="text-xs text-[#344541]/60 mt-0.5">Chronological score trajectory for the reporting period.</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF9F5] border border-[#E5E2D9]">
                  {reportData.assessment_records.length} Points
                </span>
              </div>

              {reportData.assessment_records.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={reportData.assessment_records}
                      margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#DCE9E1" vertical={false} />
                      <XAxis
                        dataKey="assessment_date"
                        stroke="#344541"
                        fontSize={10}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[40, 100]}
                        stroke="#344541"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#173F3A',
                          borderRadius: '12px',
                          color: '#fff',
                          border: 'none',
                          fontSize: '12px'
                        }}
                        formatter={(val: any) => [`${val}%`, 'Score']}
                        labelFormatter={(date) => `Date: ${date}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#79A995"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#173F3A' }}
                        activeDot={{ r: 6, fill: '#E7B978' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-[#344541]/60 bg-[#FAF9F5] rounded-2xl">
                  No individual assessment scores recorded in this selected range.
                </div>
              )}
            </div>
          </div>

          {/* Subject Performance Detailed Table */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#173F3A]">Subject-Wise Marks & Standing</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#DCE9E1] text-[#173F3A] font-bold">
                    <th className="pb-3 px-3">Subject Name</th>
                    <th className="pb-3 px-3">Course Code</th>
                    <th className="pb-3 px-3">Assessments</th>
                    <th className="pb-3 px-3">Period Average</th>
                    <th className="pb-3 px-3">Highest Mark</th>
                    <th className="pb-3 px-3">Academic Band</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2D9]">
                  {reportData.subject_performance.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF9F5] transition">
                      <td className="py-3 px-3 font-bold text-[#173F3A]">{sub.subject}</td>
                      <td className="py-3 px-3 text-[#344541]/70">{sub.code}</td>
                      <td className="py-3 px-3">{sub.count}</td>
                      <td className="py-3 px-3 font-bold text-[#173F3A]">{sub.average_score}%</td>
                      <td className="py-3 px-3 text-[#344541]/80">{sub.max_score}%</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.standing === 'Excellent'
                            ? 'bg-[#DCE9E1] text-[#173F3A]'
                            : sub.standing === 'Good'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-[#E7B978]/30 text-[#173F3A]'
                        }`}>
                          {sub.standing}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {reportData.subject_performance.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-[#344541]/60">
                        No subject evaluation marks recorded in this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Assessment-Wise Verified Marks Table */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#173F3A]">Assessment-Wise Verified Marks Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#DCE9E1] text-[#173F3A] font-bold">
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3">Subject</th>
                    <th className="pb-3 px-3">Assessment Type</th>
                    <th className="pb-3 px-3">Topic Tested</th>
                    <th className="pb-3 px-3">Score (%)</th>
                    <th className="pb-3 px-3">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2D9]">
                  {reportData.assessment_records.map((a, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF9F5] transition">
                      <td className="py-3 px-3 text-[#344541]/70">{a.assessment_date}</td>
                      <td className="py-3 px-3 font-medium text-[#173F3A]">{a.subject}</td>
                      <td className="py-3 px-3 font-bold text-[#173F3A]">{a.assessment_type}</td>
                      <td className="py-3 px-3 text-[#344541]/80">{a.topic}</td>
                      <td className="py-3 px-3 font-bold text-[#173F3A]">{a.score}%</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-[#173F3A] bg-[#DCE9E1]/60 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-[#79A995]" />
                          <span>Verified Record</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                  {reportData.assessment_records.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-[#344541]/60">
                        No individual assessments found for the selected reporting period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Sessions & Assignment Completion */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Sessions Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#173F3A]">Attendance Sessions Log</h3>
                  <p className="text-xs text-[#344541]/60 mt-0.5">Recorded lecture and lab sessions during this period.</p>
                </div>
                <span className="text-xs font-bold text-[#173F3A] bg-[#DCE9E1] px-2.5 py-0.5 rounded-full">
                  {reportData.attendance_summary.attendance_pct}% Rate
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-[#FAF9F5] rounded-2xl border border-[#E5E2D9]">
                <div>
                  <span className="text-[10px] text-[#344541]/60 uppercase font-bold block">Present</span>
                  <span className="font-extrabold text-[#173F3A] text-sm">{reportData.attendance_summary.present_sessions}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#344541]/60 uppercase font-bold block">Late</span>
                  <span className="font-extrabold text-[#E7B978] text-sm">{reportData.attendance_summary.late_sessions}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#344541]/60 uppercase font-bold block">Absent</span>
                  <span className="font-extrabold text-rose-600 text-sm">{reportData.attendance_summary.absent_sessions}</span>
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {reportData.attendance_summary.sessions.slice(0, 6).map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-xs">
                    <div>
                      <span className="font-bold text-[#173F3A] block">{s.subject}</span>
                      <span className="text-[10px] text-[#344541]/60">{s.date} • {s.session_topic}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      s.status === 'Present' ? 'bg-[#DCE9E1] text-[#173F3A]' : s.status === 'Late' ? 'bg-[#E7B978]/30 text-[#173F3A]' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assignment Completion Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#173F3A]">Assignments & Tasks Status</h3>
                  <p className="text-xs text-[#344541]/60 mt-0.5">Submitted vs pending coursework items.</p>
                </div>
                <span className="text-xs font-bold text-[#173F3A] bg-[#DCE9E1] px-2.5 py-0.5 rounded-full">
                  {reportData.assignment_summary.submitted_count} of {reportData.assignment_summary.total_assigned} Done
                </span>
              </div>

              {/* Submitted List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {reportData.assignment_summary.submitted_list.map((asg, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#173F3A]">{asg.title}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#DCE9E1] text-[#173F3A]">
                        {asg.status} {asg.marks !== null ? `(${asg.marks}/${asg.max_marks})` : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#344541]/70">{asg.subject} • Submitted: {asg.submitted_at}</p>
                  </div>
                ))}

                {reportData.assignment_summary.pending_list.map((asg, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#173F3A]">{asg.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E7B978]/30 text-[#173F3A]">
                        Pending
                      </span>
                    </div>
                    <p className="text-[11px] text-[#344541]/70">{asg.subject} • Due: {asg.deadline} • {asg.max_marks} Marks</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Teacher Remarks & Focus Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Priority Focus Areas (Grounded in <70% scores) */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#173F3A] uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-[#E7B978]" />
                <span>Verified Topics Requiring Focus</span>
              </div>
              <p className="text-xs text-[#344541]/70">
                Topics where your evaluated marks fall below the 70% proficiency threshold.
              </p>

              {reportData.support_topics.length > 0 ? (
                <div className="space-y-2">
                  {reportData.support_topics.map((t, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#173F3A] block">{t.topic}</span>
                        <span className="text-[10px] text-[#344541]/60">{t.subject} • Evaluated: {t.date}</span>
                      </div>
                      <span className="font-extrabold text-amber-700 bg-[#E7B978]/25 px-2.5 py-1 rounded-lg">
                        {t.score}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-[#FAF9F5] rounded-2xl border border-[#E5E2D9] space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-[#79A995] mx-auto" />
                  <p className="text-xs font-bold text-[#173F3A]">High Academic Proficiency</p>
                  <p className="text-[11px] text-[#344541]/60">All evaluated assessment topics in this period exceed 70%.</p>
                </div>
              )}
            </div>

            {/* Official Faculty Remarks */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#173F3A] uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#79A995]" />
                <span>Official Faculty Advisory Remarks</span>
              </div>
              <p className="text-xs text-[#344541]/70">
                Direct instructional feedback from course instructors.
              </p>

              {reportData.teacher_remarks.length > 0 ? (
                <div className="space-y-2.5">
                  {reportData.teacher_remarks.map((r, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#173F3A]">
                        <span>{r.subject}</span>
                        <span className="text-[#344541]/50 text-[10px]">{r.created_at}</span>
                      </div>
                      <p className="text-xs text-[#344541]/85 italic">"{r.remark}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-[#FAF9F5] rounded-2xl border border-[#E5E2D9]">
                  <p className="text-xs text-[#344541]/60">No official faculty remarks recorded during this period.</p>
                </div>
              )}
            </div>
          </div>

          {/* AI Academic Copilot Recommendations (Prominently distinguished) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7B978]/70 shadow-xs space-y-3 ring-1 ring-[#E7B978]/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#173F3A]">
                <Bot className="w-4 h-4 text-[#E7B978]" />
                <span className="uppercase tracking-wider">AI Copilot Academic Recommendations</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E7B978]/30 text-[#173F3A] border border-[#E7B978]">
                AI-Generated Based on Verified Records
              </span>
            </div>

            <p className="text-xs text-[#344541]/75">
              These suggestions are generated by the StudentConnector AI Engine synthesizing your actual assessment scores and attendance regularity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {reportData.ai_recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-1">
                  <h4 className="text-xs font-bold text-[#173F3A] flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E7B978] flex-shrink-0" />
                    <span>{rec.title}</span>
                  </h4>
                  <p className="text-xs text-[#344541]/80 leading-relaxed">{rec.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Report History Modal Drawer */}
      {historyOpen && (
        <div className="fixed inset-0 bg-[#173F3A]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-[#DCE9E1] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE9E1] pb-3">
              <div className="flex items-center space-x-2 text-[#173F3A]">
                <History className="w-5 h-5 text-[#79A995]" />
                <h3 className="font-extrabold text-base">Generated Report History</h3>
              </div>
              <button
                onClick={() => setHistoryOpen(false)}
                className="text-[#344541]/50 hover:text-[#173F3A] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#344541]/70">
              Previously generated academic progress report snapshots for {user?.name}.
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {loadingHistory ? (
                <div className="p-8 text-center text-xs text-[#344541]/60">Loading report history...</div>
              ) : historyItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#344541]/60 bg-[#FAF9F5] rounded-2xl">
                  No previous report snapshots recorded.
                </div>
              ) : (
                historyItems.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#173F3A] block">{item.file_name}</span>
                      <span className="text-[10px] text-[#344541]/60">
                        {item.period_type.toUpperCase()} • Generated: {item.created_at}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownloadPdf()}
                      className="px-3 py-1.5 rounded-xl bg-[#173F3A] hover:bg-[#102d29] text-white text-[11px] font-bold flex items-center space-x-1 transition"
                    >
                      <Download className="w-3.5 h-3.5 text-[#E7B978]" />
                      <span>Download</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setHistoryOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-[#173F3A] text-xs font-bold hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
