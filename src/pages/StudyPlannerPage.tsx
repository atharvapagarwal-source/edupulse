import React, { useState, useEffect } from 'react';
import { generateStudyPlan } from '../services/api';
import { StudyPlan } from '../types';
import { Calendar, Sparkles, CheckCircle2, Clock, BookOpen, Brain, RefreshCw } from 'lucide-react';

export const StudyPlannerPage: React.FC = () => {
  const [duration, setDuration] = useState(7);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    handleGeneratePlan(7);
  }, []);

  const handleGeneratePlan = async (days: number) => {
    setLoading(true);
    setDuration(days);
    try {
      const res = await generateStudyPlan(days);
      setPlan(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskKey: string) => {
    setCompletedTasks(prev => ({ ...prev, [taskKey]: !prev[taskKey] }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Personalized AI Revision Planner</h2>
          <p className="text-slate-500 text-xs mt-1">
            Dynamic study schedules generated automatically based on your identified weak topics & test dates.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">Duration:</span>
          {[3, 7, 14].map(d => (
            <button
              key={d}
              onClick={() => handleGeneratePlan(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                duration === d ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 text-lg">Synthesizing AI Study Plan...</h3>
          <p className="text-xs text-slate-500 mt-1">Optimizing time allocations for TCP/IP, Linear Transformations & Trees</p>
        </div>
      ) : plan ? (
        <div className="space-y-6">
          {/* AI Tip Banner */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white border border-indigo-800 flex items-start space-x-4">
            <Brain className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">AI Study Optimization Tip</span>
              <p className="text-sm font-medium text-slate-200 mt-1">"{plan.ai_tip}"</p>
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                <span className="text-slate-400">Target Weak Topics:</span>
                {plan.weak_topics?.map((wt, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 font-semibold">
                    {wt}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plan.schedule?.map((dayItem, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
                    {dayItem.day}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> {dayItem.estimated_hours} hrs
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-base">{dayItem.focus_area}</h4>
                </div>

                <div className="space-y-2 pt-1">
                  {dayItem.tasks?.map((task, tIdx) => {
                    const taskKey = `${idx}-${tIdx}`;
                    const isDone = completedTasks[taskKey];
                    return (
                      <div
                        key={tIdx}
                        onClick={() => toggleTask(taskKey)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-start space-x-3 text-xs ${
                          isDone ? 'bg-emerald-50 border-emerald-200 text-emerald-900 line-through' : 'bg-slate-50 border-slate-200/60 text-slate-700 hover:border-indigo-300'
                        }`}
                      >
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDone ? 'text-emerald-600' : 'text-slate-300'}`} />
                        <span className="font-medium leading-relaxed">{task}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
