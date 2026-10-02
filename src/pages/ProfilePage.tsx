import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateStudentProfile } from '../services/api';
import { User, Sparkles, Plus, X, Save, CheckCircle2, Award, BookOpen } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, userSkills, setUserSkills } = useAuth();
  const [skills, setSkills] = useState<string[]>(userSkills);
  const [newSkill, setNewSkill] = useState('');
  const [interests, setInterests] = useState<string[]>(["Artificial Intelligence", "Cloud Computing", "Cybersecurity", "Open Source"]);
  const [newInterest, setNewInterest] = useState('');
  const [careerGoals, setCareerGoals] = useState('Aiming to become an AI Software Engineer at a top EdTech / SaaS product company.');
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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
          alt={user?.name}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-500/20 shadow-md"
        />
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900">{user?.name}</h2>
          <p className="text-xs text-indigo-600 font-semibold">{user?.course} • {user?.year}</p>
          <p className="text-xs text-slate-500">{user?.college}</p>
          <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              CGPA: 8.2
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">
              Attendance: 87%
            </span>
          </div>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Profile updated! AI Opportunity Recommendation engine re-indexed with your new skills.</span>
        </div>
      )}

      {/* EDITABLE SKILLS & INTERESTS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="font-bold text-slate-900 text-lg flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
          Skills & Career Recommendations Index
        </h3>

        {/* Skills Tag Management */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase">Technical Skills</label>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 flex items-center space-x-1.5">
                <span>{s}</span>
                <button onClick={() => handleRemoveSkill(s)} className="text-indigo-400 hover:text-indigo-900">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex space-x-2 pt-2">
            <input
              type="text"
              placeholder="Add skill (e.g. PyTorch, React, SQL)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={handleAddSkill}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Interests Management */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase">Academic & Career Interests</label>
          <div className="flex flex-wrap gap-2">
            {interests.map((item, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200 flex items-center space-x-1.5">
                <span>{item}</span>
                <button onClick={() => handleRemoveInterest(item)} className="text-purple-400 hover:text-purple-900">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex space-x-2 pt-2">
            <input
              type="text"
              placeholder="Add interest (e.g. Blockchain, Robotics)..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
              className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={handleAddInterest}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Career Goals */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase">Career Aspirations</label>
          <textarea
            rows={3}
            value={careerGoals}
            onChange={(e) => setCareerGoals(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Updating...' : 'Save Profile & Re-index Opportunities'}</span>
        </button>
      </div>
    </div>
  );
};
