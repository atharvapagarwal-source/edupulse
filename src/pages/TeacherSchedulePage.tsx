import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTeacherSchedule } from '../services/api';
import { Calendar, Clock, MapPin, Users, BookOpen, ChevronRight, ShieldCheck } from 'lucide-react';

export const TeacherSchedulePage: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getTeacherSchedule(user?.id)
      .then((res) => {
        if (isMounted) {
          setClasses(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Schedule load error:", err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#79A995] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#344541]/70 font-semibold">Loading teaching timetable...</p>
        </div>
      </div>
    );
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-6 pb-12 font-sans text-[#344541]">

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#173F3A]/10 text-[#173F3A] text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#79A995]" />
            <span>Faculty Academic Timetable</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Teaching Schedule & Lecture Slots
          </h2>
          <p className="text-xs sm:text-sm text-[#344541]/70 mt-1 max-w-xl">
            Weekly timetable, classroom allocations, and lab examination slots for your assigned courses.
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-[#173F3A]">{classes.length}</span>
          <span className="text-xs font-semibold text-[#344541]/60 block">Active Slot Allocations</span>
        </div>
      </div>

      {/* WEEKLY TIMETABLE CARDS */}
      <div className="space-y-4">
        {classes.map((cls, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#173F3A] text-white">
                  {cls.code}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE9E1] text-[#173F3A]">
                  {cls.credits} Academic Credits
                </span>
              </div>
              <h3 className="text-base font-bold text-[#173F3A] mt-1">{cls.course_name || cls.name}</h3>
              <p className="text-xs text-[#344541]/75 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#79A995]" />
                <span>Turing Lecture Hall & Software Lab 3</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-[#FAF9F5] p-4 rounded-2xl border border-[#E5E2D9]">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#173F3A]">
                <Clock className="w-4 h-4 text-[#E7B978]" />
                <span>{cls.schedule}</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-white border border-[#DCE9E1] text-[#79A995] text-center">
                Confirmed Weekly
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* UPCOMING ACADEMIC EVENTS */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#173F3A]">Upcoming Departmental & Academic Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-1">
            <span className="text-[10px] font-bold text-[#E7B978] block">Oct 18, 2026 • 04:00 PM</span>
            <h4 className="font-bold text-[#173F3A]">Curriculum Board Meeting</h4>
            <p className="text-[#344541]/75">Discussion on C++20 standard adoption in undergraduate coursework.</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-1">
            <span className="text-[10px] font-bold text-[#79A995] block">Oct 24, 2026 • 10:00 AM</span>
            <h4 className="font-bold text-[#173F3A]">Mid-Semester Lab Evaluations</h4>
            <p className="text-[#344541]/75">Practical hands-on evaluation of student repository submissions.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
