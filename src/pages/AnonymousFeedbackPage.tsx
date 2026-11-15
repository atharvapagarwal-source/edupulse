import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitAnonymousFeedback, getStudentFeedbackHistory } from '../services/api';
import { FeedbackItem } from '../types';
import { MessageSquareHeart, Shield, Send, CheckCircle2, Star, Lock, History } from 'lucide-react';

export const AnonymousFeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('Data Structures & Algorithms');
  const [teacherName, setTeacherName] = useState('Prof. Rajesh Sharma');
  const [category, setCategory] = useState('Teaching Pace');
  const [comment, setComment] = useState('');
  const [teachingRating, setTeachingRating] = useState(4);
  const [difficultyRating, setDifficultyRating] = useState(3);
  const [paceRating, setPaceRating] = useState(3);
  const [materialRating, setMaterialRating] = useState(4);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<FeedbackItem[]>([]);
  const [activeTab, setActiveTab] = useState<'Submit' | 'History'>('Submit');

  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  const loadHistory = () => {
    getStudentFeedbackHistory()
      .then(res => setHistory(res))
      .catch(err => console.error("Error loading feedback history:", err));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert("Please enter constructive feedback comments.");
      return;
    }
    setSubmitting(true);
    try {
      await submitAnonymousFeedback({
        subject,
        teacher_name: teacherName,
        category,
        comment,
        teaching_rating: teachingRating,
        difficulty_rating: difficultyRating,
        pace_rating: paceRating,
        material_rating: materialRating
      });
      setSubmitting(false);
      setSubmitted(true);
      loadHistory();
    } catch (err: any) {
      setSubmitting(false);
      alert(err.message || "Failed to submit feedback.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans text-[#344541]">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#DCE9E1]/80 via-[#F5F3ED] to-[#DCE9E1]/50 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#173F3A]/10 text-[#173F3A] text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5 text-[#79A995]" />
            <span>100% Identity Shield Encryption</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Anonymous Course Feedback
          </h2>
          <p className="text-sm text-[#344541]/75 mt-1 font-medium">
            Your honest constructive feedback helps faculty adjust pacing and materials without student pressure.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-white border border-[#DCE9E1] p-1 rounded-xl text-xs font-bold text-[#344541]/70 space-x-1 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('Submit')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'Submit' ? 'bg-[#173F3A] text-white' : 'hover:bg-[#FAF9F5]'
            }`}
          >
            Submit Feedback
          </button>
          <button
            onClick={() => setActiveTab('History')}
            className={`px-4 py-2 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'History' ? 'bg-[#173F3A] text-white' : 'hover:bg-[#FAF9F5]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>My Submissions ({history.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'Submit' ? (
        submitted ? (
          <div className="bg-white rounded-3xl p-8 border border-[#DCE9E1] text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#DCE9E1] text-[#173F3A] flex items-center justify-center mx-auto text-2xl">
              <CheckCircle2 className="w-8 h-8 text-[#79A995]" />
            </div>
            <h3 className="text-xl font-bold text-[#173F3A]">Feedback Recorded Anonymously!</h3>
            <p className="text-xs text-[#344541]/70 max-w-md mx-auto">
              Your feedback is aggregated into high-level course analytics without revealing your name or ID to faculty.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setComment('');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#173F3A] text-white text-xs font-bold"
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE9E1] shadow-xs space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#173F3A] block mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DCE9E1] text-xs text-[#344541] bg-white outline-none"
                >
                  <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="OOPS in C++">OOPS in C++</option>
                  <option value="Mathematics — Linear Algebra">Mathematics — Linear Algebra</option>
                  <option value="Database Management Systems">Database Management Systems</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#173F3A] block mb-1">Faculty Instructor</label>
                <select
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DCE9E1] text-xs text-[#344541] bg-white outline-none"
                >
                  <option value="Prof. Rajesh Sharma">Prof. Rajesh Sharma</option>
                  <option value="Dr. Vance Montgomery">Dr. Vance Montgomery</option>
                  <option value="Dr. Meera Iyer">Dr. Meera Iyer</option>
                  <option value="Prof. Vikram Malhotra">Prof. Vikram Malhotra</option>
                </select>
              </div>
            </div>

            {/* Ratings Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9]">
                <div className="flex justify-between text-xs font-bold text-[#173F3A] mb-1">
                  <span>Teaching Quality</span>
                  <span className="text-[#79A995]">{teachingRating} / 5</span>
                </div>
                <input
                  type="range" min="1" max="5" value={teachingRating}
                  onChange={(e) => setTeachingRating(Number(e.target.value))}
                  className="w-full accent-[#173F3A]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9]">
                <div className="flex justify-between text-xs font-bold text-[#173F3A] mb-1">
                  <span>Lecture Pace</span>
                  <span className="text-[#79A995]">{paceRating} / 5</span>
                </div>
                <input
                  type="range" min="1" max="5" value={paceRating}
                  onChange={(e) => setPaceRating(Number(e.target.value))}
                  className="w-full accent-[#173F3A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#173F3A] block mb-1">Constructive Feedback Comment</label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on lecture clarity, speed, assignment difficulty..."
                className="w-full p-3 rounded-2xl border border-[#DCE9E1] text-xs text-[#344541] bg-[#FAF9F5] outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#DCE9E1]/40 border border-[#DCE9E1] text-xs text-[#173F3A]">
              <strong>Privacy Assurance:</strong> Your feedback is stored in your personal tracking log, but faculty reports are anonymized and mathematically aggregate student inputs.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-[#173F3A] hover:bg-[#102d29] text-white text-xs font-bold transition flex items-center justify-center space-x-2"
            >
              <Send className="w-3.5 h-3.5 text-[#E7B978]" />
              <span>{submitting ? 'Submitting Anonymously...' : 'Submit Anonymous Feedback'}</span>
            </button>
          </form>
        )
      ) : (
        /* History View */
        <div className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#173F3A]">
            Your Submitted Feedback History ({history.length})
          </h3>
          {history.length === 0 ? (
            <p className="text-xs text-[#344541]/60 py-6 text-center">No feedback submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#173F3A]">{item.subject} • {item.teacher_name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCE9E1] text-[#173F3A]">
                      {item.status || 'Submitted'}
                    </span>
                  </div>
                  <p className="text-xs text-[#344541]/80 italic">"{item.comment}"</p>
                  <div className="flex items-center justify-between text-[10px] text-[#344541]/50">
                    <span>Category: {item.category}</span>
                    <span>Date: {item.created_at}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
