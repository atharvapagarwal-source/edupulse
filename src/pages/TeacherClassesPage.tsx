import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTeacherClasses, getTeacherAnalytics } from '../services/api';
import { EnrolledClass, TeacherAnalyticsData } from '../types';
import {
  BookOpen, Users, Clock, Award, ShieldCheck, ChevronRight,
  GraduationCap, Calendar, CheckCircle2, UserCheck, AlertCircle
} from 'lucide-react';

export const TeacherClassesPage: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [analytics, setAnalytics] = useState<TeacherAnalyticsData | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([
      getTeacherClasses(user?.id),
      getTeacherAnalytics(user?.id)
    ]).then(([cls, ana]) => {
      if (isMounted) {
        setClasses(cls);
        setAnalytics(ana);
        if (cls.length > 0) {
          setSelectedClassId(cls[0].id);
        }
        setLoading(false);
      }
    }).catch(err => {
      console.warn("Error loading teacher classes:", err);
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, [user?.id]);

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const students = analytics?.students || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#79A995] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#344541]/70 font-semibold">Loading assigned course roster...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans text-[#344541]">

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#173F3A]/10 text-[#173F3A] text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#79A995]" />
            <span>Strict Class-Level Authorization Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            My Assigned Classes
          </h2>
          <p className="text-xs sm:text-sm text-[#344541]/70 mt-1 max-w-xl">
            View course rosters, verify student enrollment, and monitor academic progress for modules under your instruction.
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-[#173F3A]">{classes.length}</span>
          <span className="text-xs font-semibold text-[#344541]/60 block">Assigned Modules</span>
        </div>
      </div>

      {/* Class Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {classes.map((c) => {
          const isActive = (selectedClass?.id === c.id);
          return (
            <button
              key={c.id}
              onClick={() => setSelectedClassId(c.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#173F3A] text-white shadow-xs'
                  : 'bg-white text-[#344541] hover:bg-[#FAF9F5] border border-[#DCE9E1]'
              }`}
            >
              <span>{c.code}</span>
              <span className="opacity-75">• {c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Class Detail Cards */}
      {selectedClass && (
        <div className="space-y-6">

          {/* Module Specs Card */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-[#DCE9E1]/80 via-[#F5F3ED] to-[#DCE9E1]/50 border border-[#DCE9E1] shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-[10px] font-bold text-[#344541]/60 uppercase tracking-wider">Course Code</span>
                <p className="text-lg font-black text-[#173F3A] mt-0.5">{selectedClass.code}</p>
                <p className="text-xs text-[#344541]/80 font-medium">{selectedClass.name}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#344541]/60 uppercase tracking-wider">Credits & Weight</span>
                <p className="text-lg font-black text-[#173F3A] mt-0.5">{selectedClass.credits} Credits</p>
                <p className="text-xs text-[#344541]/80">Core Curriculum</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#344541]/60 uppercase tracking-wider">Scheduled Lecture Slot</span>
                <p className="text-xs font-bold text-[#173F3A] mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#E7B978]" />
                  <span>{selectedClass.schedule}</span>
                </p>
                <p className="text-[11px] text-[#344541]/70 mt-0.5">Turing Lecture Hall / Hybrid</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#344541]/60 uppercase tracking-wider">Enrolled Strength</span>
                <p className="text-lg font-black text-[#173F3A] mt-0.5">{students.length} Students</p>
                <p className="text-xs text-[#79A995] font-semibold">100% Verified Enrollment</p>
              </div>
            </div>
          </div>

          {/* Enrolled Students Roster */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#173F3A]">Enrolled Students in {selectedClass.code}</h3>
                <p className="text-xs text-[#344541]/60">Authorized student academic details for your course</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#DCE9E1] text-[#173F3A] text-xs font-bold">
                {students.length} Students Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#E5E2D9] text-[#344541]/60 font-semibold">
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">Student ID</th>
                    <th className="pb-3">Module Average</th>
                    <th className="pb-3">Assessments Logged</th>
                    <th className="pb-3">Academic Status</th>
                    <th className="pb-3">Guidance Indicator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2D9]">
                  {students.map((std) => (
                    <tr key={std.id} className="hover:bg-[#FAF9F5] transition">
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
                      <td className="py-3.5 text-[#344541]/70 text-[11px]">
                        {std.support_status === 'On Track' ? 'Consistent Performance' : 'Recommended for Review Sheet'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
