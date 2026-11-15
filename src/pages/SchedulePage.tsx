import React, { useState, useEffect } from 'react';
import { getClasses } from '../services/api';
import { EnrolledClass } from '../types';
import { Calendar, Clock, BookOpen, MapPin, Video, CheckCircle, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export const SchedulePage: React.FC = () => {
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');

  useEffect(() => {
    getClasses()
      .then(res => {
        setClasses(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading schedule:", err);
        setLoading(false);
      });
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const examReminders = [
    { title: 'Data Structures Trees Quiz', date: 'Oct 07, 2026', time: '10:00 AM', room: 'Hall 302' },
    { title: 'Computer Networks TCP/IP Midterm', date: 'Oct 14, 2026', time: '02:00 PM', room: 'Lab 105' },
    { title: 'Linear Algebra Vector Spaces Test', date: 'Oct 21, 2026', time: '09:00 AM', room: 'Hall 201' },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans text-[#344541]">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#DCE9E1]/80 via-[#F5F3ED] to-[#DCE9E1]/50 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#173F3A]/10 text-[#173F3A] text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-[#79A995]" />
            <span>Weekly Academic Timetable</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Class & Session Schedule
          </h2>
          <p className="text-sm text-[#344541]/75 mt-1 font-medium">
            View your enrolled semester courses, lecture halls, and upcoming examination dates.
          </p>
        </div>
      </div>

      {/* Days Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
              selectedDay === day
                ? 'bg-[#173F3A] text-white shadow-xs'
                : 'bg-white text-[#344541]/70 hover:bg-[#DCE9E1]/60 border border-[#DCE9E1]'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Classes List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-bold text-[#173F3A]">
            Enrolled Course Sessions ({selectedDay})
          </h3>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#344541]/60 bg-white rounded-3xl border border-[#DCE9E1]">
              Loading schedule from database...
            </div>
          ) : classes.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#344541]/60 bg-white rounded-3xl border border-[#DCE9E1]">
              No scheduled classes found for this day.
            </div>
          ) : (
            classes.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs hover:border-[#79A995] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCE9E1] text-[#173F3A]">
                      {c.code}
                    </span>
                    <span className="text-[11px] font-semibold text-[#79A995]">
                      {c.credits} Credits
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-[#173F3A]">{c.name}</h4>
                  <p className="text-xs text-[#344541]/70">{c.description}</p>
                  <p className="text-xs font-semibold text-[#173F3A]">Faculty: {c.teacher_name}</p>
                </div>

                <div className="sm:text-right space-y-1.5 flex-shrink-0">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-xs font-bold text-[#173F3A]">
                    <Clock className="w-3.5 h-3.5 text-[#E7B978]" />
                    <span>{c.schedule}</span>
                  </div>
                  <div className="text-[11px] text-[#344541]/60 font-medium">
                    Campus Lecture Hall • VIT Campus
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Exam Reminders (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-[#173F3A]">Upcoming Examinations</h3>
          <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs space-y-4">
            {examReminders.map((exam, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-1">
                <p className="text-xs font-bold text-[#173F3A]">{exam.title}</p>
                <div className="flex items-center justify-between text-[11px] text-[#344541]/70">
                  <span>{exam.date} • {exam.time}</span>
                  <span className="font-semibold text-[#79A995]">{exam.room}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
