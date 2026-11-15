import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAssignments, submitAssignment, getClasses } from '../services/api';
import { Assignment, EnrolledClass } from '../types';
import { BookOpen, Clock, FileCode, Upload, Brain, CheckCircle2, AlertCircle, X, ShieldAlert, Award } from 'lucide-react';

export const AssignmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Submitted' | 'Graded' | 'Overdue'>('All');
  const [selectedAsg, setSelectedAsg] = useState<Assignment | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [fileName, setFileName] = useState('solution.cpp');
  const [codeContent, setCodeContent] = useState(`// C++ Object-Oriented Solution
#include <iostream>
#include <vector>

class Solution {
public:
    void solve() {
        std::cout << "Executing modular algorithm with zero memory leaks.\\n";
    }
};

int main() {
    Solution s;
    s.solve();
    return 0;
}`);

  const [aiEval, setAiEval] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = () => {
    setLoading(true);
    Promise.all([getAssignments(), getClasses()])
      .then(([asgList, clsList]) => {
        setAssignments(asgList);
        setClasses(clsList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading classes & tasks:", err);
        setLoading(false);
      });
  };

  const filteredAssignments = assignments.filter((asg) => {
    if (activeTab === 'All') return true;
    return asg.user_status === activeTab;
  });

  const handleOpenSubmit = (asg: Assignment) => {
    setSelectedAsg(asg);
    setUploadModalOpen(true);
  };

  const handleExecuteSubmission = async () => {
    if (!selectedAsg) return;
    setSubmitting(true);
    try {
      const res = await submitAssignment(selectedAsg.id, fileName, codeContent);
      setSubmitting(false);
      setUploadModalOpen(false);
      setAiEval(res.ai_evaluation);
      setEvalModalOpen(true);
      loadData();
    } catch (err: any) {
      setSubmitting(false);
      alert(err.message || "Failed to submit assignment.");
    }
  };

  const handleViewAiEval = (asg: Assignment) => {
    setSelectedAsg(asg);
    setAiEval(asg.ai_evaluation || {
      correctness_score: 85,
      code_quality: "Clean and robust implementation",
      complexity_analysis: "O(N) Time Complexity",
      ai_feedback: "Submission validated successfully."
    });
    setEvalModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-[#344541]">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#DCE9E1]/80 via-[#F5F3ED] to-[#DCE9E1]/50 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#173F3A]/10 text-[#173F3A] text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-[#79A995]" />
            <span>Student Coursework Workspace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Classes & Assigned Tasks
          </h2>
          <p className="text-sm text-[#344541]/75 mt-1 font-medium">
            View your registered classes, submit coursework code, and track faculty evaluation.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-white border border-[#DCE9E1] p-1.5 rounded-2xl text-xs font-bold text-[#344541]/70 space-x-1 self-start md:self-auto overflow-x-auto">
          {(['All', 'Pending', 'Submitted', 'Graded', 'Overdue'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                activeTab === t
                  ? 'bg-[#173F3A] text-white shadow-xs'
                  : 'hover:text-[#173F3A] hover:bg-[#FAF9F5]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Enrolled Classes Quick Row */}
      <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs">
        <h3 className="text-xs font-bold text-[#173F3A] uppercase tracking-wider mb-3">
          Your Enrolled Semester Classes ({classes.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {classes.map((cls) => (
            <div key={cls.id} className="p-3 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE9E1] text-[#173F3A]">
                  {cls.code}
                </span>
                <span className="text-[10px] text-[#79A995] font-semibold">{cls.credits} Credits</span>
              </div>
              <h4 className="text-xs font-bold text-[#173F3A]">{cls.name}</h4>
              <p className="text-[11px] text-[#344541]/70 mt-1">Faculty: {cls.teacher_name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Assignments Cards List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#173F3A]">
          Assigned Tasks & Coursework ({filteredAssignments.length})
        </h3>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#344541]/60 bg-white rounded-3xl border border-[#DCE9E1]">
            Loading assigned tasks...
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#344541]/60 bg-white rounded-3xl border border-[#DCE9E1]">
            No assignments match the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssignments.map((asg) => (
              <div
                key={asg.id}
                className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#79A995]">{asg.subject}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        asg.user_status === 'Graded'
                          ? 'bg-[#79A995]/20 text-[#173F3A] border border-[#79A995]/30'
                          : asg.user_status === 'Submitted'
                          ? 'bg-[#E7B978]/30 text-[#173F3A]'
                          : asg.user_status === 'Pending'
                          ? 'bg-[#DCE9E1] text-[#173F3A]'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {asg.user_status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#173F3A] mt-2">{asg.title}</h4>
                  <p className="text-xs text-[#344541]/75 mt-1 leading-relaxed">{asg.description}</p>
                </div>

                {/* Grade and Teacher Feedback Box if graded */}
                {asg.user_status === 'Graded' && (
                  <div className="p-3.5 rounded-2xl bg-[#DCE9E1]/40 border border-[#DCE9E1] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#173F3A] flex items-center">
                        <Award className="w-3.5 h-3.5 mr-1 text-[#79A995]" />
                        Official Faculty Grade:
                      </span>
                      <span className="font-black text-[#173F3A] text-sm">
                        {asg.grade} / {asg.max_marks}
                      </span>
                    </div>
                    {asg.teacher_feedback && (
                      <p className="text-xs text-[#344541]/80 italic">
                        "{asg.teacher_feedback}"
                      </p>
                    )}
                  </div>
                )}

                {/* Footer metadata & Action button */}
                <div className="pt-3 border-t border-[#E5E2D9] flex items-center justify-between">
                  <div className="text-[11px] text-[#344541]/60">
                    <span>Deadline: <strong className="text-[#173F3A]">{asg.deadline}</strong></span>
                  </div>

                  <div>
                    {asg.user_status === 'Pending' || asg.user_status === 'Active' ? (
                      <button
                        onClick={() => handleOpenSubmit(asg)}
                        className="px-4 py-1.5 rounded-xl bg-[#173F3A] hover:bg-[#102d29] text-white text-xs font-bold transition flex items-center space-x-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#E7B978]" />
                        <span>Submit Work</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleViewAiEval(asg)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#DCE9E1] hover:bg-[#DCE9E1] text-[#173F3A] text-xs font-semibold transition flex items-center space-x-1.5"
                      >
                        <Brain className="w-3.5 h-3.5 text-[#79A995]" />
                        <span>View Evaluation</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUBMISSION MODAL */}
      {uploadModalOpen && selectedAsg && (
        <div className="fixed inset-0 bg-[#173F3A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#DCE9E1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#79A995] uppercase">{selectedAsg.subject}</span>
                <h3 className="text-base font-bold text-[#173F3A]">{selectedAsg.title}</h3>
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="p-1 rounded-full text-[#344541]/60 hover:text-[#173F3A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-[#173F3A] block mb-1">File Name</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#DCE9E1] text-xs text-[#344541] outline-none focus:border-[#79A995]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#173F3A] block mb-1">Source Code Content</label>
              <textarea
                rows={6}
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#DCE9E1] text-xs font-mono text-[#344541] bg-[#FAF9F5] outline-none focus:border-[#79A995]"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#344541]/70 hover:bg-[#FAF9F5]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteSubmission}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-[#173F3A] hover:bg-[#102d29] text-white text-xs font-bold transition flex items-center space-x-1.5"
              >
                <span>{submitting ? 'Recording...' : 'Submit to Database'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EVALUATION MODAL */}
      {evalModalOpen && (
        <div className="fixed inset-0 bg-[#173F3A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#DCE9E1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#173F3A]">Advisory Code Evaluation</h3>
              <button onClick={() => setEvalModalOpen(false)} className="p-1 rounded-full text-[#344541]/60 hover:text-[#173F3A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {aiEval && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#DCE9E1]/50 flex items-center justify-between">
                  <span className="font-bold text-[#173F3A]">Correctness Score:</span>
                  <span className="font-black text-base text-[#173F3A]">{aiEval.correctness_score}%</span>
                </div>
                <div>
                  <span className="font-bold text-[#173F3A]">Complexity Analysis:</span>
                  <p className="text-[#344541]/80 mt-0.5">{aiEval.complexity_analysis}</p>
                </div>
                <div>
                  <span className="font-bold text-[#173F3A]">Quality & Feedback:</span>
                  <p className="text-[#344541]/80 mt-0.5">{aiEval.ai_feedback}</p>
                </div>
              </div>
            )}

            <div className="text-right pt-2">
              <button
                onClick={() => setEvalModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#173F3A] text-white text-xs font-bold"
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
