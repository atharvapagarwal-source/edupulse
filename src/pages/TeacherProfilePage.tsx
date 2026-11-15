import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Sparkles, BookOpen, Clock, Mail, Building, Award, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

export const TeacherProfilePage: React.FC = () => {
  const { user } = useAuth();

  const isMontgomery = user?.id === 'tch-002';

  const [officeHours, setOfficeHours] = useState(
    isMontgomery ? 'Tuesday & Thursday: 04:00 PM - 05:30 PM (Room 412, Networking Lab Block)' : 'Monday & Wednesday: 02:00 PM - 04:00 PM (Room 204, CSE Faculty Wing)'
  );
  const [researchInterests, setResearchInterests] = useState<string[]>(
    isMontgomery
      ? ['Computer Networks', 'Distributed Systems', 'Packet Routing Algorithms', 'Network Security']
      : ['Data Structures', 'Object-Oriented Architecture', 'C++ System Design', 'High-Performance Computing']
  );
  const [newInterest, setNewInterest] = useState('');
  const [bio, setBio] = useState(
    isMontgomery
      ? 'Professor in Computer Science & Engineering specializing in Computer Networks, protocol analysis, and distributed socket architectures.'
      : 'Senior Associate Professor in Computer Science & Engineering dedicated to teaching Data Structures, C++ systems programming, and algorithmic design.'
  );
  const [saved, setSaved] = useState(false);

  const handleAddInterest = () => {
    if (newInterest.trim() && !researchInterests.includes(newInterest.trim())) {
      setResearchInterests(prev => [...prev, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (item: string) => {
    setResearchInterests(prev => prev.filter(i => i !== item));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans text-[#344541]">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE9E1] shadow-xs flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
          alt={user?.name}
          className="w-20 h-20 rounded-full object-cover ring-4 ring-[#79A995]"
        />

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#173F3A]">{user?.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCE9E1] text-[#173F3A]">
              Faculty ID: {user?.id}
            </span>
          </div>
          <p className="text-xs text-[#344541]/70 mt-1 flex items-center justify-center sm:justify-start gap-1">
            <Building className="w-3.5 h-3.5 text-[#79A995]" />
            <span>School of Computer Science & Engineering</span>
            <span>•</span>
            <span className="font-semibold text-[#173F3A]">
              {isMontgomery ? 'Professor' : 'Senior Associate Professor'}
            </span>
          </p>
          <p className="text-xs text-[#79A995] font-semibold mt-0.5 flex items-center justify-center sm:justify-start gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span>{user?.email || (isMontgomery ? 'vance@studentconnector.edu' : 'sharma@studentconnector.edu')}</span>
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-[#173F3A] hover:bg-[#102d29] text-white text-xs font-bold transition flex items-center space-x-2 shadow-2xs cursor-pointer"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-[#E7B978]" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Changes Saved!' : 'Save Profile'}</span>
        </button>
      </div>

      {/* Academic Specialization & Assigned Courses */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE9E1] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#173F3A]">Authorized Academic Courses</h3>
            <p className="text-xs text-[#344541]/60 mt-0.5">Classes and subjects assigned under your faculty profile.</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#DCE9E1] text-[#173F3A]">
            Active Semester
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {isMontgomery ? (
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#173F3A]">Computer Networks</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#79A995]/20 text-[#173F3A]">CS302</span>
              </div>
              <p className="text-xs text-[#344541]/70">Tue & Thu 02:00 PM - 03:30 PM • 3 Credits</p>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#173F3A]">Data Structures & Algorithms</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#79A995]/20 text-[#173F3A]">CS201</span>
                </div>
                <p className="text-xs text-[#344541]/70">Mon & Wed 10:00 AM - 11:30 AM • 4 Credits</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E5E2D9] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#173F3A]">OOPS in C++</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#79A995]/20 text-[#173F3A]">CS203</span>
                </div>
                <p className="text-xs text-[#344541]/70">Mon & Fri 12:00 PM - 01:30 PM • 4 Credits</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Office Hours & Consultation */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE9E1] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#173F3A]">Office Hours & Student Consultation</h3>
          <p className="text-xs text-[#344541]/60 mt-0.5">Slots when students may approach for doubts, mentorship, and project guidance.</p>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-[#79A995] flex-shrink-0" />
          <input
            type="text"
            value={officeHours}
            onChange={(e) => setOfficeHours(e.target.value)}
            className="flex-1 p-3 rounded-xl border border-[#DCE9E1] text-xs text-[#344541] bg-[#FAF9F5] outline-none focus:border-[#79A995]"
          />
        </div>
      </div>

      {/* Faculty Bio & Research Domains */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE9E1] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#173F3A]">Academic Biography & Teaching Focus</h3>
          <p className="text-xs text-[#344541]/60 mt-0.5">Faculty biography displayed across syllabus catalogues and portal directories.</p>
        </div>

        <textarea
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-3 rounded-xl border border-[#DCE9E1] text-xs text-[#344541] bg-[#FAF9F5] outline-none focus:border-[#79A995] resize-none"
        />

        <div className="pt-2">
          <h4 className="text-xs font-bold text-[#173F3A] mb-2">Research & Teaching Specializations</h4>
          <div className="flex flex-wrap gap-2">
            {researchInterests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FAF9F5] border border-[#E5E2D9] text-[#173F3A]"
              >
                <span>{interest}</span>
                <button
                  onClick={() => handleRemoveInterest(interest)}
                  className="hover:text-rose-500 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-2 pt-3">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
              placeholder="Add specialization domain (e.g. Memory Optimization, Concurrency)..."
              className="flex-1 p-2.5 rounded-xl border border-[#DCE9E1] text-xs text-[#344541] bg-[#FAF9F5] outline-none focus:border-[#79A995]"
            />
            <button
              onClick={handleAddInterest}
              className="px-4 py-2.5 rounded-xl bg-[#79A995] hover:bg-[#608b79] text-[#173F3A] text-xs font-bold transition cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
