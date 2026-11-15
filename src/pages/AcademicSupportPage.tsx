import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTeacherAnalytics } from '../services/api';
import { TeacherAnalyticsData } from '../types';
import { ShieldAlert, AlertTriangle, CheckCircle2, User, Mail, Calendar, Info, Sparkles, BookOpen } from 'lucide-react';

export const AcademicSupportPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<TeacherAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTeacherAnalytics(user?.id)
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading academic support data:", err);
        setLoading(false);
      });
  }, [user?.id]);

  const supportIndicators = analytics?.support_indicators || [];

  return (
    <div className="space-y-6 pb-12 font-sans text-[#344541]">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#DCE9E1]/80 via-[#F5F3ED] to-[#DCE9E1]/50 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#173F3A]/10 text-[#173F3A] text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-[#E7B978]" />
            <span>Proactive Mentorship & Academic Support</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Academic Support Indicators
          </h2>
          <p className="text-sm text-[#344541]/75 mt-1 font-medium">
            Evidence-based indicators for students enrolled in {user?.name}'s assigned courses who may benefit from extra guidance.
          </p>
        </div>
      </div>

      {/* Ethical Guidance Disclaimer Box */}
      <div className="p-4 bg-white rounded-2xl border border-[#DCE9E1] flex items-start space-x-3 text-xs text-[#344541]/80 shadow-2xs">
        <Info className="w-5 h-5 text-[#79A995] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#173F3A]">Academic Guidance Principle:</strong> StudentConnector uses non-stigmatizing support indicators (Moderate / Additional Guidance Recommended) grounded in actual assessment records. These indicators support teacher intervention, not automatic labeling of students.
        </div>
      </div>

      {/* Support Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#344541]/60 bg-white rounded-3xl border border-[#DCE9E1]">
          Loading authorized student support indicators...
        </div>
      ) : supportIndicators.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#DCE9E1] space-y-2">
          <CheckCircle2 className="w-8 h-8 text-[#79A995] mx-auto" />
          <h4 className="text-sm font-bold text-[#173F3A]">All Enrolled Students Performing Well</h4>
          <p className="text-xs text-[#344541]/70">No students currently fall below the academic support threshold in your authorized classes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportIndicators.map((s, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white border border-[#E7B978]/60 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#173F3A] text-base">{s.student_name}</h4>
                  <p className="text-[11px] text-[#344541]/60 font-mono">ID: {s.student_id}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E7B978]/30 text-[#173F3A] border border-[#E7B978]">
                  {s.level} Support Indicator
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9]">
                <span className="text-[10px] text-[#344541]/60 uppercase font-bold tracking-wider">Authorized Average Score</span>
                <p className="text-xl font-extrabold text-[#173F3A]">{s.average_score}%</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#173F3A]">Observed Verification Evidence:</span>
                <ul className="space-y-1">
                  {s.evidence.map((ev, i) => (
                    <li key={i} className="text-xs text-[#344541]/80 flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E7B978] mt-1.5 flex-shrink-0" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-2xl bg-[#DCE9E1]/40 border border-[#DCE9E1] text-xs text-[#173F3A]">
                <strong className="block text-[11px] font-bold text-[#173F3A] mb-0.5">Faculty Action Recommendation:</strong>
                {s.recommendation}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
