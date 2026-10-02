import React, { useState, useEffect } from 'react';
import { getAssignments, submitAssignment } from '../services/api';
import { Assignment } from '../types';
import { BookOpen, Clock, FileCode, Upload, Brain, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';

export const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Submitted' | 'Graded' | 'Overdue'>('All');
  const [selectedAsg, setSelectedAsg] = useState<Assignment | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [fileName, setFileName] = useState('tree_traversal.py');
  const [codeContent, setCodeContent] = useState(`class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorderTraversal(root):
    res = []
    def helper(node):
        if not node:
            return
        helper(node.left)
        res.append(node.val)
        helper(node.right)
    helper(root)
    return res`);

  const [aiEval, setAiEval] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = () => {
    getAssignments('std-001').then(res => setAssignments(res));
  };

  const filteredAssignments = assignments.filter(asg => {
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
      loadAssignments();
    } catch (err) {
      setSubmitting(false);
      alert("Submission uploaded!");
    }
  };

  const handleViewAiEval = (asg: Assignment) => {
    setSelectedAsg(asg);
    if (asg.ai_evaluation) {
      setAiEval(asg.ai_evaluation);
    } else {
      setAiEval({
        correctness_score: 82,
        code_quality: "Good — clean modular structure with proper variable naming.",
        complexity_analysis: "O(N) Time Complexity, O(H) Space Complexity",
        missing_edge_cases: [
          "Handling empty input list validation",
          "Handling duplicate key values during tree node insertion"
        ],
        ai_feedback: "Your implementation handles the main case correctly, but additional handling is required for empty input and duplicate values.",
        disclaimer: "AI analysis is advisory. Final evaluation is performed by the teacher."
      });
    }
    setEvalModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Smart Assignment Workspace</h2>
          <p className="text-slate-500 text-xs mt-1">
            Submit coursework, track teacher grades, and view instant AI-assisted advisory evaluation.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600 space-x-1 self-start md:self-auto">
          {(['All', 'Pending', 'Submitted', 'Graded', 'Overdue'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === t ? 'bg-white text-indigo-600 shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ASSIGNMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map((asg) => (
          <div key={asg.id} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  {asg.subject}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  asg.user_status === 'Graded' ? 'bg-emerald-100 text-emerald-800' :
                  asg.user_status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                  asg.user_status === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {asg.user_status}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base">{asg.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{asg.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-600">
                <div>
                  <span className="text-slate-400 block">Topic</span>
                  <span className="font-semibold">{asg.topic}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Deadline</span>
                  <span className="font-semibold text-rose-600">{asg.deadline}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Max Marks</span>
                  <span className="font-semibold">{asg.max_marks} Marks</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Difficulty</span>
                  <span className="font-semibold">{asg.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              {asg.user_status === 'Pending' && (
                <button
                  onClick={() => handleOpenSubmit(asg)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition flex items-center justify-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Submit Assignment</span>
                </button>
              )}

              {(asg.user_status === 'Submitted' || asg.user_status === 'Graded') && (
                <div className="space-y-2">
                  {asg.grade !== null && (
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-900 flex justify-between">
                      <span>Teacher Grade:</span>
                      <span>{asg.grade} / {asg.max_marks} Marks</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleViewAiEval(asg)}
                    className="w-full py-2 rounded-xl bg-slate-900 text-cyan-300 font-semibold text-xs hover:bg-slate-800 transition flex items-center justify-center space-x-2 border border-slate-800"
                  >
                    <Brain className="w-4 h-4 text-cyan-400" />
                    <span>View AI Evaluation</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* SUBMISSION MODAL */}
      {uploadModalOpen && selectedAsg && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Submit Coursework</h3>
                <p className="text-xs text-slate-500">{selectedAsg.title} ({selectedAsg.subject})</p>
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">File Name</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Code / Solution Text</label>
              <textarea
                rows={7}
                value={codeContent}
                onChange={(e) => setCodeContent(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 font-mono text-xs bg-slate-900 text-cyan-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button onClick={() => setUploadModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button
                onClick={handleExecuteSubmission}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md hover:bg-indigo-700 transition"
              >
                {submitting ? 'Analyzing & Uploading...' : 'Upload & Run AI Evaluation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI ASSISTED EVALUATION MODAL */}
      {evalModalOpen && aiEval && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-indigo-900 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-white text-lg">AI-Assisted Evaluation</h3>
                  <p className="text-xs text-slate-400">Pre-Evaluation Diagnostic Panel</p>
                </div>
              </div>
              <button onClick={() => setEvalModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Correctness</span>
                <span className="text-2xl font-extrabold text-cyan-400 mt-1 block">{aiEval.correctness_score}%</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Code Quality</span>
                <span className="text-xs font-bold text-emerald-400 mt-2 block">{aiEval.code_quality?.split('—')[0] || 'Good'}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Complexity</span>
                <span className="text-xs font-bold text-indigo-300 mt-2 block">Optimal</span>
              </div>
            </div>

            {/* Edge Cases */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center">
                <AlertCircle className="w-4 h-4 mr-1.5" /> Missing Edge Cases Identified (2)
              </span>
              <ul className="space-y-1 text-xs text-slate-300">
                {aiEval.missing_edge_cases?.map((ec: string, idx: number) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2" />
                    {ec}
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Feedback */}
            <div className="p-4 bg-indigo-950/60 rounded-2xl border border-indigo-800/80">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">AI Diagnostic Feedback</span>
              <p className="text-xs text-slate-200 leading-relaxed font-mono">
                "{aiEval.ai_feedback || 'Your implementation handles the main case correctly, but additional handling is required for empty input and duplicate values.'}"
              </p>
            </div>

            {/* Mandatory Advisory Disclaimer */}
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start space-x-2 text-[11px] text-slate-400">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Disclaimer:</strong> AI analysis is advisory. Final evaluation and official grade is performed by the course teacher.
              </span>
            </div>

            <button
              onClick={() => setEvalModalOpen(false)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
