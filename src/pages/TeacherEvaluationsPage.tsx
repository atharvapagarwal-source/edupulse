import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTeacherSubmissions, evaluateTeacherSubmission, getTeacherClasses } from '../services/api';
import { TeacherSubmissionItem, EnrolledClass } from '../types';
import {
  CheckSquare, FileCode, Award, Clock, CheckCircle2,
  X, Filter, Brain, MessageSquare, ShieldCheck, UserCheck
} from 'lucide-react';

export const TeacherEvaluationsPage: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<TeacherSubmissionItem[]>([]);
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Evaluation modal
  const [evalModalSubm, setEvalModalSubm] = useState<TeacherSubmissionItem | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(85);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [submittingGrade, setSubmittingGrade] = useState(false);

  const loadSubmissions = () => {
    setLoading(true);
    Promise.all([
      getTeacherSubmissions(user?.id),
      getTeacherClasses(user?.id)
    ]).then(([subs, cls]) => {
      setSubmissions(subs);
      setClasses(cls);
      setLoading(false);
    }).catch(err => {
      console.warn("Error loading submissions:", err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadSubmissions();
  }, [user?.id]);

  const openEvalModal = (subm: TeacherSubmissionItem) => {
    setEvalModalSubm(subm);
    setGradeInput(subm.marks !== null ? subm.marks : 85);
    setFeedbackInput(subm.teacher_feedback || 'Clean modular implementation with proper error handling.');
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalModalSubm) return;
    setSubmittingGrade(true);
    try {
      await evaluateTeacherSubmission(evalModalSubm.id, Number(gradeInput), feedbackInput);
      alert(`Grade (${gradeInput}/${evalModalSubm.max_marks}) and feedback saved for ${evalModalSubm.student_name}! Student has been notified.`);
      setEvalModalSubm(null);
      loadSubmissions();
    } catch (err: any) {
      alert(err.message || "Failed to submit grade");
    } finally {
      setSubmittingGrade(false);
    }
  };

  const filtered = submissions.filter(s => {
    if (selectedStatus === 'Pending') return s.status !== 'Graded';
    if (selectedStatus === 'Graded') return s.status === 'Graded';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#79A995] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#344541]/70 font-semibold">Loading student submissions for grading...</p>
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
            <span>Authorized Coursework Evaluation Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Submissions & Evaluation
          </h2>
          <p className="text-xs sm:text-sm text-[#344541]/70 mt-1 max-w-xl">
            Inspect student source code files, review AI pre-evaluation diagnostics, assign official marks, and provide qualitative faculty guidance.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <Filter className="w-4 h-4 text-[#79A995]" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2.5 rounded-2xl bg-[#FAF9F5] border border-[#DCE9E1] text-xs font-bold text-[#173F3A] focus:outline-none"
          >
            <option value="All">All Submissions ({submissions.length})</option>
            <option value="Pending">Pending Grading ({submissions.filter(s => s.status !== 'Graded').length})</option>
            <option value="Graded">Graded ({submissions.filter(s => s.status === 'Graded').length})</option>
          </select>
        </div>
      </div>

      {/* SUBMISSIONS LIST */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#DCE9E1] shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-[#79A995] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#173F3A]">No submissions match the filter</p>
          </div>
        ) : (
          filtered.map((subm) => (
            <div key={subm.id} className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE9E1] text-[#173F3A]">
                    {subm.subject}
                  </span>
                  <span className="text-xs font-bold text-[#173F3A]">{subm.assignment_title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    subm.status === 'Graded' ? 'bg-[#DCE9E1] text-[#173F3A]' : 'bg-[#E7B978]/30 text-[#173F3A]'
                  }`}>
                    {subm.status}
                  </span>
                </div>

                <p className="text-xs text-[#344541]/80">
                  Student: <strong>{subm.student_name}</strong> ({subm.student_id}) • Submitted {subm.submitted_at}
                </p>

                <div className="flex items-center space-x-2 text-[11px] text-[#344541]/70 font-mono">
                  <FileCode className="w-3.5 h-3.5 text-[#79A995]" />
                  <span>{subm.file_name}</span>
                </div>

                {subm.ai_evaluation && (
                  <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E5E2D9] text-[11px] text-[#344541]/80 flex items-start space-x-2">
                    <Brain className="w-3.5 h-3.5 text-[#79A995] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#173F3A]">AI Advisory: </span>
                      <span>Score: {subm.ai_evaluation.correctness_score}% • {subm.ai_evaluation.complexity_analysis} • {subm.ai_evaluation.ai_feedback}</span>
                    </div>
                  </div>
                )}

                {subm.teacher_feedback && (
                  <p className="text-[11px] text-[#173F3A] bg-[#DCE9E1]/20 p-2 rounded-xl border border-[#DCE9E1]/50">
                    <strong>Recorded Feedback:</strong> "{subm.teacher_feedback}"
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="text-right">
                  <span className="text-lg font-black text-[#173F3A]">
                    {subm.marks !== null ? `${subm.marks} / ${subm.max_marks}` : `Max ${subm.max_marks}`}
                  </span>
                  <span className="text-[10px] text-[#344541]/60 block font-semibold">
                    {subm.status === 'Graded' ? 'Grade Released' : 'Pending Evaluation'}
                  </span>
                </div>

                <button
                  onClick={() => openEvalModal(subm)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs whitespace-nowrap ${
                    subm.status === 'Graded'
                      ? 'bg-[#FAF9F5] hover:bg-[#E5E2D9] text-[#173F3A] border border-[#DCE9E1]'
                      : 'bg-[#173F3A] hover:bg-[#102d29] text-white'
                  }`}
                >
                  {subm.status === 'Graded' ? 'Update Grade' : 'Grade Submission'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EVALUATION MODAL */}
      {evalModalSubm && (
        <div className="fixed inset-0 bg-[#173F3A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#DCE9E1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#173F3A]">Evaluate Student Submission</h3>
                <p className="text-[11px] text-[#344541]/60">
                  {evalModalSubm.assignment_title} • {evalModalSubm.student_name}
                </p>
              </div>
              <button
                onClick={() => setEvalModalSubm(null)}
                className="w-8 h-8 rounded-full bg-[#FAF9F5] hover:bg-[#E5E2D9] flex items-center justify-center text-[#344541]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-[#173F3A]">
                <span>Source File: {evalModalSubm.file_name}</span>
                <span className="font-mono text-[10px]">Max Marks: {evalModalSubm.max_marks}</span>
              </div>
              {evalModalSubm.ai_evaluation && (
                <p className="text-[11px] text-[#79A995] font-semibold pt-1 border-t border-[#E5E2D9]">
                  AI Advisory Suggestion: {evalModalSubm.ai_evaluation.correctness_score} pts ({evalModalSubm.ai_evaluation.code_quality})
                </p>
              )}
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#173F3A] block mb-1">
                  Assigned Score (Out of {evalModalSubm.max_marks}) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={evalModalSubm.max_marks}
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#DCE9E1] text-[#173F3A] text-sm font-black focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#173F3A] block mb-1">
                  Faculty Qualitative Feedback & Recommendations *
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide specific feedback on code efficiency, memory management, and correctness..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF9F5] border border-[#DCE9E1] text-[#344541] focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEvalModalSubm(null)}
                  className="w-1/2 py-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#E5E2D9] text-[#344541] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingGrade}
                  className="w-1/2 py-2.5 rounded-xl bg-[#173F3A] hover:bg-[#102d29] text-white font-bold shadow-xs transition"
                >
                  {submittingGrade ? 'Publishing...' : 'Save Grade & Notify Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
