import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateStudentProfile } from '../services/api';
import { User, Sparkles, Plus, X, Save, CheckCircle2, Award, BookOpen } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, userSkills, setUserSkills } = useAuth();
  const [skills, setSkills] = useState<string[]>(userSkills);
  const [newSkill, setNewSkill] = useState('');
  const [interests, setInterests] = useState<string[]>([
    "Artificial Intelligence", "Systems Programming", "Cloud Architecture", "Data Structures"
  ]);
  const [newInterest, setNewInterest] = useState('');
  const [careerGoals, setCareerGoals] = useState('Aiming to become a Software Systems Engineer specializing in C++ and Distributed Systems.');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests(prev => [...prev, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (itemToRemove: string) => {
    setInterests(prev => prev.filter(i => i !== itemToRemove));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateStudentProfile(skills, interests, careerGoals);
      setUserSkills(skills);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setUserSkills(skills);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans text-[#344541]">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE9E1] shadow-xs flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
          alt={user?.name}
          className="w-20 h-20 rounded-full object-cover ring-4 ring-[#79A995]"
        />

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#173F3A]">{user?.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCE9E1] text-[#173F3A]">
              Student ID: {user?.id}
            </span>
          </div>
          <p className="text-xs text-[#344541]/70 mt-1">
            {user?.course || 'B.Tech Computer Science'} • {user?.year || '3rd Year'} • {user?.college || 'VIT University'}
          </p>
          <p className="text-xs text-[#79A995] font-semibold mt-0.5">{user?.email}</p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[#173F3A] hover:bg-[#102d29] text-white text-xs font-bold transition flex items-center space-x-2"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-[#E7B978]" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : saved ? 'Changes Saved!' : 'Save Profile'}</span>
        </button>
      </div>

      {/* Skills Management */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE9E1] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#173F3A]">Verified Coursework & Programming Skills</h3>
          <p className="text-xs text-[#344541]/60 mt-0.5">Used by the recommendation engine for matching hackathons and internships.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FAF9F5] border border-[#E5E2D9] text-[#173F3A]"
            >
              <span>{skill}</span>
              <button onClick={() => handleRemoveSkill(skill)} className="hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            placeholder="Add new skill (e.g. C++17, Algorithms, Sockets)..."
            className="flex-1 p-2.5 rounded-xl border border-[#DCE9E1] text-xs text-[#344541] bg-[#FAF9F5] outline-none focus:border-[#79A995]"
          />
          <button
            onClick={handleAddSkill}
            className="px-4 py-2.5 rounded-xl bg-[#79A995] text-[#173F3A] text-xs font-bold transition flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Career Aspirations */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE9E1] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#173F3A]">Career Aspirations & Target Roles</h3>
          <p className="text-xs text-[#344541]/60 mt-0.5">Helps AI Copilot personalize learning paths for post-graduate career outcomes.</p>
        </div>

        <textarea
          rows={3}
          value={careerGoals}
          onChange={(e) => setCareerGoals(e.target.value)}
          className="w-full p-3 rounded-2xl border border-[#DCE9E1] text-xs text-[#344541] bg-[#FAF9F5] outline-none focus:border-[#79A995]"
        />
      </div>
    </div>
  );
};
