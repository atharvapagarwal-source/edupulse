import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTeacherAssignments, createTeacherAssignment, getTeacherClasses } from '../services/api';
import { EnrolledClass } from '../types';
import {
  FileText, Plus, BookOpen, Clock, Award, CheckCircle2,
  AlertCircle, X, ChevronRight, Filter, ShieldCheck
} from 'lucide-react';

export const TeacherAssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New assignment form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [deadline, setDeadline] = useState('2026-11-25');
  const [maxMarks, setMaxMarks] = useState(50);
  const [difficulty, setDifficulty] = useState('Medium');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      getTeacherAssignments(user?.id),
      getTeacherClasses(user?.id)
    ]).then(([asgs, cls]) => {
      setAssignments(asgs);
      setClasses(cls);
      if (cls.length > 0 && !subject) {
        setSubject(cls[0].name);
      }
      setLoading(false);
    }).catch(err => {
      console.warn("Error loading assignments:", err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !subject.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    setCreating(true);
    try {
      await createTeacherAssignment({
        title,
        subject,
        topic: topic || 'General Coursework',
        deadline,
        max_marks: Number(maxMarks),
        difficulty,
        description
      });
      alert(`Assignment '${title}' published successfully to ${subject}!`);
      setCreateModalOpen(false);
      setTitle('');
      setDescription('');
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to publish assignment");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#79A995] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#344541]/70 font-semibold">Loading coursework assignments...</p>
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
            <span>Coursework Management Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Assignments & Coursework
          </h2>
          <p className="text-xs sm:text-sm text-[#344541]/70 mt-1 max-w-xl">
            Publish programming labs and theory tasks restricted strictly to your authorized subjects. Students in enrolled classes automatically receive tasks.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-[#173F3A] hover:bg-[#102d29] text-white font-bold text-xs shadow-xs transition flex items-center space-x-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Assignment</span>
        </button>
      </div>

      {/* ASSIGNMENTS LIST */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#173F3A]">Published Coursework Tasks ({assignments.length})</h3>

        {assignments.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#DCE9E1] shadow-xs">
            <FileText className="w-8 h-8 text-[#79A995] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#173F3A]">No assignments published yet</p>
            <p className="text-xs text-[#344541]/60 mt-1">Click "Publish New Assignment" to post coursework for your classes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assignments.map((asg) => (
              <div key={asg.id} className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCE9E1] text-[#173F3A]">
                      {asg.subject}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      asg.difficulty === 'Hard' ? 'bg-rose-100 text-rose-800' : 'bg-[#E7B978]/30 text-[#173F3A]'
                    }`}>
                      {asg.difficulty}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#173F3A]">{asg.title}</h4>
                  <p className="text-xs text-[#344541]/75 mt-1 line-clamp-2 leading-relaxed">
                    {asg.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5E2D9] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#344541]/60 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#E7B978]" />
                      <span>Due {asg.deadline}</span>
                    </span>
                    <span className="font-bold text-[#173F3A]">Max: {asg.max_marks} pts</span>
                  </div>

                  {/* Submission Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-[#344541]/70 font-semibold">Grading Progress:</span>
                      <span className="font-bold text-[#173F3A]">
                        {asg.graded_count ?? 1} / {asg.submissions_count ?? 2} Evaluated
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FAF9F5] border border-[#E5E2D9] overflow-hidden">
                      <div
                        className="h-full bg-[#79A995] rounded-full"
                        style={{
                          width: `${Math.min(100, (((asg.graded_count ?? 1) / Math.max(1, asg.submissions_count ?? 2)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-[#173F3A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#DCE9E1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#173F3A]">Publish Assignment</h3>
                <p className="text-[11px] text-[#344541]/60">Assigned course students will receive immediate notification</p>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FAF9F5] hover:bg-[#E5E2D9] flex items-center justify-center text-[#344541]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#173F3A] block mb-1">Target Subject / Class *</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#DCE9E1] text-[#344541] font-semibold focus:outline-none"
                  required
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.name}>{c.code} - {c.name}</option>
                  ))}
                </select>
                <span className="text-[10px] text-[#79A995] font-semibold mt-0.5 block">
                  Only subjects assigned to your faculty profile are eligible.
                </span>
              </div>

              <div>
                <label className="font-bold text-[#173F3A] block mb-1">Assignment Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Modern C++ Virtual Functions Lab"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#DCE9E1] text-[#344541] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#173F3A] block mb-1">Specific Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Polymorphism"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#DCE9E1] text-[#344541] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#173F3A] block mb-1">Submission Deadline *</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#DCE9E1] text-[#344541] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#173F3A] block mb-1">Max Marks *</label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#DCE9E1] text-[#344541] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-[#173F3A] block mb-1">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#DCE9E1] text-[#344541] focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#173F3A] block mb-1">Description & Requirements *</label>
                <textarea
                  rows={3}
                  placeholder="Provide problem specification, memory limits, and sample test cases..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F5] border border-[#DCE9E1] text-[#344541] focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#E5E2D9] text-[#344541] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="w-1/2 py-2.5 rounded-xl bg-[#173F3A] hover:bg-[#102d29] text-white font-bold shadow-xs transition"
                >
                  {creating ? 'Publishing...' : 'Publish to Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
