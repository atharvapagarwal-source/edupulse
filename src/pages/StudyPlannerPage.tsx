import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateStudyPlan, getStudentDashboard } from '../services/api';
import { StudyPlan, StudentDashboardData } from '../types';
import { Calendar, Clock, CheckCircle2, Circle, Sparkles, BookOpen, AlertTriangle, ArrowRight, Target } from 'lucide-react';

export const StudyPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLoading(true);
    Promise.all([generateStudyPlan(7), getStudentDashboard()])
      .then(([planRes, dashRes]) => {
        setPlan(planRes);
        setDashboardData(dashRes);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading study plan:", err);
        setLoading(false);
      });
  }, [user?.id]);

  const toggleTask = (key: string) => {
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const totalScheduleItems = plan?.schedule?.length || 0;
  const progressPct = totalScheduleItems > 0 ? Math.round((completedCount / totalScheduleItems) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 font-sans text-[#344541]">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#DCE9E1]/80 via-[#F5F3ED] to-[#DCE9E1]/50 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#173F3A]/10 text-[#173F3A] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#E7B978]" />
            <span>AI Record-Backed Study Prioritization</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Personalized Study Planner
          </h2>
          <p className="text-sm text-[#344541]/75 mt-1 font-medium">
            Schedules and priority topics tailored to your verified academic records in {user?.name}'s account.
          </p>
        </div>

        {/* Progress Tracker Pill */}
        <div className="bg-white rounded-2xl p-4 border border-[#DCE9E1] text-center shadow-xs self-start md:self-auto min-w-[160px]">
          <span className="text-[11px] font-bold text-[#344541]/70 block">Weekly Completion</span>
          <span className="text-2xl font-black text-[#173F3A]">{progressPct}%</span>
          <div className="w-full h-1.5 rounded-full bg-[#FAF9F5] border border-[#DCE9E1] mt-1.5 overflow-hidden">
            <div className="h-full bg-[#79A995] rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Study Schedule Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#173F3A]">Recommended Study Schedule</h3>
            <span className="text-xs text-[#79A995] font-bold">
              {plan?.duration_days || 7} Days Generated
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-[#344541]/60 bg-white rounded-3xl border border-[#DCE9E1]">
              Generating plan based on assessment data...
            </div>
          ) : !plan || plan.schedule.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#344541]/60 bg-white rounded-3xl border border-[#DCE9E1]">
              No study plan available.
            </div>
          ) : (
            <div className="space-y-3">
              {plan.schedule.map((item, idx) => {
                const isDone = !!completedTasks[`task-${idx}`];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleTask(`task-${idx}`)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isDone
                        ? 'bg-[#DCE9E1]/40 border-[#79A995]/40 opacity-75'
                        : 'bg-white border-[#DCE9E1] hover:border-[#79A995] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <button className="text-[#173F3A]">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-[#79A995]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#DCE9E1]" />
                        )}
                      </button>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#173F3A] text-white">
                            Day {item.day}
                          </span>
                          {item.priority && (
                            <span className="text-[10px] font-bold text-[#E7B978]">
                              {item.priority}
                            </span>
                          )}
                        </div>
                        <h4 className={`text-sm font-bold mt-1 ${isDone ? 'line-through text-[#344541]/60' : 'text-[#173F3A]'}`}>
                          {item.topic}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-[#173F3A]">
                        {item.hours} Hours
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Priorities & Deadlines Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Recommended Priorities */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-[#79A995]" />
              <h3 className="text-sm font-bold text-[#173F3A]">Study Priorities</h3>
            </div>
            <p className="text-xs text-[#344541]/75 leading-relaxed">
              {plan?.verified_recommendation || "Prioritize practice sets on topics scoring below average."}
            </p>
          </div>

          {/* Upcoming Assignment Deadlines */}
          <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#E7B978]" />
              <h3 className="text-sm font-bold text-[#173F3A]">Coursework Deadlines</h3>
            </div>

            <div className="space-y-2">
              {dashboardData?.upcoming_assignments?.slice(0, 3).map((asg) => (
                <div key={asg.id} className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] text-xs">
                  <span className="text-[10px] font-bold text-[#79A995]">{asg.subject}</span>
                  <p className="font-bold text-[#173F3A] mt-0.5">{asg.title}</p>
                  <p className="text-[10px] text-rose-600 font-semibold mt-1">Due: {asg.deadline}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
