import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTeacherAnnouncements, createTeacherAnnouncement, getTeacherClasses } from '../services/api';
import { TeacherAnnouncement, EnrolledClass } from '../types';
import {
  Megaphone, Plus, BookOpen, Clock, CheckCircle2,
  AlertCircle, X, ShieldCheck
} from 'lucide-react';

export const TeacherAnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<TeacherAnnouncement[]>([]);
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form state
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);

  const loadAnnouncements = () => {
    setLoading(true);
    Promise.all([
      getTeacherAnnouncements(user?.id),
      getTeacherClasses(user?.id)
    ]).then(([anns, cls]) => {
      setAnnouncements(anns);
      setClasses(cls);
      if (cls.length > 0 && !subject) {
        setSubject(cls[0].name);
      }
      setLoading(false);
    }).catch(err => {
      console.warn("Announcements load error:", err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadAnnouncements();
  }, [user?.id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !subject.trim()) {
      alert("Please fill in all announcement fields.");
      return;
    }
    setPosting(true);
    try {
      await createTeacherAnnouncement(subject, title, content);
      alert(`Announcement posted successfully to ${subject}!`);
      setCreateModalOpen(false);
      setTitle('');
      setContent('');
      loadAnnouncements();
    } catch (err: any) {
      alert(err.message || "Failed to post announcement");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#79A995] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#344541]/70 font-semibold">Loading class announcements...</p>
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
            <span>Class Communication Channel</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Class Announcements & Academic Broadcasts
          </h2>
          <p className="text-xs sm:text-sm text-[#344541]/70 mt-1 max-w-xl">
            Publish syllabus updates, examination instructions, and lab schedules. Only students enrolled in your assigned classes receive these broadcasts.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-[#173F3A] hover:bg-[#102d29] text-white font-bold text-xs shadow-xs transition flex items-center space-x-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post Announcement</span>
        </button>
      </div>

      {/* ANNOUNCEMENTS LIST */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#173F3A]">Published Broadcasts ({announcements.length})</h3>

        {announcements.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#DCE9E1] shadow-xs">
            <Megaphone className="w-8 h-8 text-[#79A995] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#173F3A]">No announcements posted yet</p>
            <p className="text-xs text-[#344541]/60 mt-1">Share important updates with your enrolled students.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white rounded-3xl p-6 border border-[#DCE9E1] shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCE9E1] text-[#173F3A]">
                      {ann.subject}
                    </span>
                    <h4 className="text-sm font-bold text-[#173F3A]">{ann.title}</h4>
                  </div>
                  <span className="text-[11px] text-[#344541]/50 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{ann.created_at}</span>
                  </span>
                </div>

                <p className="text-xs text-[#344541]/80 leading-relaxed pt-1">
                  {ann.content}
                </p>

                <div className="pt-2 flex items-center justify-between text-[10px] text-[#344541]/60 border-t border-[#E5E2D9]">
                  <span>Broadcasted by: <strong>{ann.teacher_name}</strong></span>
                  <span className="text-[#79A995] font-semibold">Active in Student Feeds</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POST ANNOUNCEMENT MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-[#173F3A]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#DCE9E1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#173F3A]">Broadcast Announcement</h3>
                <p className="text-[11px] text-[#344541]/60">Select course and compose your academic update</p>
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
                <label className="font-bold text-[#173F3A] block mb-1">Target Course *</label>
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
              </div>

              <div>
                <label className="font-bold text-[#173F3A] block mb-1">Announcement Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Mid-Term Lab Exam Instructions"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#DCE9E1] text-[#344541] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#173F3A] block mb-1">Message Content *</label>
                <textarea
                  rows={4}
                  placeholder="Write clear instructions, dates, requirements, or study hints..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
                  disabled={posting}
                  className="w-1/2 py-2.5 rounded-xl bg-[#173F3A] hover:bg-[#102d29] text-white font-bold shadow-xs transition"
                >
                  {posting ? 'Broadcasting...' : 'Broadcast to Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
