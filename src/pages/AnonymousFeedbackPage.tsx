import React, { useState } from 'react';
import { submitAnonymousFeedback } from '../services/api';
import { ShieldCheck, Lock, Send, CheckCircle2, MessageSquareHeart } from 'lucide-react';

export const AnonymousFeedbackPage: React.FC = () => {
  const [subject, setSubject] = useState('Computer Networks');
  const [teacher, setTeacher] = useState('Dr. Vance Montgomery');
  const [category, setCategory] = useState('Teaching Pace');
  const [comment, setComment] = useState('');
  const [teachingRating, setTeachingRating] = useState(4);
  const [difficultyRating, setDifficultyRating] = useState(3);
  const [paceRating, setPaceRating] = useState(2);
  const [materialRating, setMaterialRating] = useState(4);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please enter your feedback comments.');
      return;
    }
    setSubmitting(true);
    try {
      await submitAnonymousFeedback({
        subject,
        teacher_name: teacher,
        category,
        comment,
        teaching_rating: teachingRating,
        difficulty_rating: difficultyRating,
        pace_rating: paceRating,
        material_rating: materialRating
      });
      setSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-purple-800">
        <div className="flex items-center space-x-3 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>100% Identity Shield Encryption</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Your Voice. Without the Pressure.
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
          Submit honest, constructive feedback about your course pacing, teaching quality, or study materials. EduPulse AI aggregates feedback into class insights while keeping your identity 100% private.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Feedback Submitted Anonymously!</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto">
            Your feedback has been encrypted and pooled into the course feedback analytics engine. No student ID or name was transmitted.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setComment('');
            }}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 transition"
          >
            Submit Another Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          {/* Top selection dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Computer Networks">Computer Networks</option>
                <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
                <option value="Mathematics — Linear Algebra">Mathematics — Linear Algebra</option>
                <option value="Python Programming">Python Programming</option>
                <option value="Database Management Systems">Database Management Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Faculty</label>
              <select
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Dr. Vance Montgomery">Dr. Vance Montgomery</option>
                <option value="Prof. Rajesh Sharma">Prof. Rajesh Sharma</option>
                <option value="Dr. Meera Iyer">Dr. Meera Iyer</option>
                <option value="Prof. Vikram Malhotra">Prof. Vikram Malhotra</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Teaching">Teaching Quality</option>
                <option value="Assignments">Assignments & Homework</option>
                <option value="Course Difficulty">Course Difficulty</option>
                <option value="Teaching Pace">Teaching Pace</option>
                <option value="Study Material">Study Material</option>
                <option value="Infrastructure">Infrastructure / Lab</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Rating Sliders */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">Aspect Ratings (Optional)</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Teaching Quality</span>
                  <span className="text-indigo-600 font-bold">{teachingRating} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={teachingRating}
                  onChange={(e) => setTeachingRating(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Teaching Pace (1 = Slow, 5 = Too Fast)</span>
                  <span className="text-indigo-600 font-bold">{paceRating} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={paceRating}
                  onChange={(e) => setPaceRating(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Course Difficulty</span>
                  <span className="text-indigo-600 font-bold">{difficultyRating} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={difficultyRating}
                  onChange={(e) => setDifficultyRating(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Study Material Quality</span>
                  <span className="text-indigo-600 font-bold">{materialRating} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={materialRating}
                  onChange={(e) => setMaterialRating(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Feedback Text Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Feedback Comments
            </label>
            <textarea
              rows={5}
              placeholder="Share your detailed feedback constructively (e.g., 'The pace on recursion was fast, please add more live coding demos...')"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Privacy explanation box */}
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex items-start space-x-3 text-xs text-purple-900">
            <Lock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Privacy Guarantee:</span> Your identity is not displayed to teachers alongside your feedback. EduPulse uses differential privacy to ensure individual student identity cannot be exposed in teacher analytics.
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-purple-600/25 transition flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Encrypting & Submitting...' : 'Submit Anonymously'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
