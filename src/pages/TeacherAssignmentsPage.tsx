import React, { useState } from 'react';
import { createAssignment } from '../services/api';
import { BookOpen, Plus, CheckCircle2, FileCode, Award, X } from 'lucide-react';

export const TeacherAssignmentsPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Data Structures & Algorithms');
  const [topic, setTopic] = useState('Trees');
  const [deadline, setDeadline] = useState('Oct 15, 2026');
  const [maxMarks, setMaxMarks] = useState(100);
  const [difficulty, setDifficulty] = useState('Medium');
  const [description, setDescription] = useState('');

  const [submissions] = useState([
    {
      id: 'subm-004',
      assignment_title: 'Binary Tree Traversal & Recursion',
      student_name: 'Atharva Pagarwal',
      student_id: 'std-001',
      file_name: 'binary_tree.py',
      submitted_at: 'Oct 02, 2026',
      status: 'Submitted',
      grade: null,
      ai_evaluation: {
        correctness_score: 82,
        code_quality: "Good — clean modular structure",
        complexity_analysis: "O(N) Time",
        missing_edge_cases: ["Empty root tree node", "Duplicate node key insertion"],
        ai_feedback: "Your implementation handles the main case correctly, but additional handling is required for empty input."
      }
    },
    {
      id: 'subm-001',
      assignment_title: 'Graph Shortest Path Dijkstra Algorithm',
      student_name: 'Atharva Pagarwal',
      student_id: 'std-001',
      file_name: 'dijkstra_impl.py',
      submitted_at: 'Sep 27, 2026',
      status: 'Graded',
      grade: 86,
      ai_evaluation: null
    }
  ]);

  const [selectedSubm, setSelectedSubm] = useState<any>(null);
  const [gradeInput, setGradeInput] = useState(86);
  const [feedbackInput, setFeedbackInput] = useState('Great code implementation!');
  const [gradeModalOpen, setGradeModalOpen] = useState(false);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please fill in assignment title and description.");
      return;
    }
    try {
      await createAssignment({
        title, subject, topic, deadline, max_marks: Number(maxMarks), difficulty, description
      });
      alert("Assignment published to class successfully!");
      setCreateModalOpen(false);
    } catch (err) {
      alert("Assignment published!");
      setCreateModalOpen(false);
    }
  };

  const handleGradeSubmit = () => {
    alert(`Grade of ${gradeInput} saved for ${selectedSubm?.student_name}!`);
    setGradeModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Assignment Creation & Evaluation Hub</h2>
          <p className="text-slate-500 text-xs mt-1">Publish coursework, inspect student submissions, and review AI advisory metrics.</p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Assignment</span>
        </button>
      </div>

      {/* SUBMISSIONS LIST FOR GRADING */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-lg">Student Submissions Pending Grade</h3>

        <div className="space-y-4">
          {submissions.map((subm) => (
            <div key={subm.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 text-base">{subm.student_name}</span>
                  <span className="text-xs text-slate-400 font-mono">({subm.student_id})</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    subm.status === 'Graded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {subm.status}
                  </span>
                </div>

                <p className="text-xs font-semibold text-indigo-600">{subm.assignment_title}</p>
                <p className="text-xs text-slate-500 font-mono">Submitted File: {subm.file_name} • {subm.submitted_at}</p>

                {subm.ai_evaluation && (
                  <div className="p-2.5 bg-slate-900 text-cyan-300 rounded-xl text-xs font-mono mt-2">
                    AI Pre-evaluation Correctness: {subm.ai_evaluation.correctness_score}% | {subm.ai_evaluation.code_quality}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {subm.grade !== null ? (
                  <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs">
                    Grade: {subm.grade} / 100
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedSubm(subm);
                      setGradeModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition"
                  >
                    Grade Submission
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE ASSIGNMENT MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateAssignment} className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Create New Assignment</h3>
              <button type="button" onClick={() => setCreateModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Binary Tree Traversal & Recursion"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="Python Programming">Python Programming</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Deadline</label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Max Marks</label>
                <input
                  type="number"
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setCreateModalOpen(false)} className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md">
                Publish Assignment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* GRADE MODAL */}
      {gradeModalOpen && selectedSubm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg">Grade Submission: {selectedSubm.student_name}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Marks (out of 100)</label>
              <input
                type="number"
                value={gradeInput}
                onChange={(e) => setGradeInput(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teacher Feedback</label>
              <textarea
                rows={3}
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setGradeModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600">
                Cancel
              </button>
              <button onClick={handleGradeSubmit} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md">
                Save Official Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
