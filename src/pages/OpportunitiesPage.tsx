import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOpportunities } from '../services/api';
import { Opportunity } from '../types';
import { Sparkles, Bookmark, CheckCircle2, MapPin, Calendar, ExternalLink, Search, Filter } from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  const { savedOpportunityIds, toggleSaveOpportunity, userSkills } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  useEffect(() => {
    getOpportunities('std-001').then(res => setOpportunities(res));
  }, [userSkills]);

  const categories = [
    'All', 'Hackathon', 'Internship', 'Scholarship', 'Competition', 'Workshop', 'Certification', 'Research'
  ];

  const filteredOpps = opportunities.filter(opp => {
    const matchesCat = selectedCategory === 'All' || opp.type.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          opp.required_skills.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleApply = (id: string) => {
    setAppliedIds(prev => [...prev, id]);
    alert("Application submitted successfully through EduPulse Opportunity Portal!");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Opportunity Matcher</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            AI Opportunity Marketplace
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
            Targeted recommendations for hackathons, internships, scholarships and workshops vector-matched against your skills: <span className="text-cyan-300 font-semibold">{userSkills.slice(0, 4).join(', ')}</span>.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, skills (e.g. Python, Machine Learning)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* OPPORTUNITY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOpps.map((opp) => {
          const isSaved = savedOpportunityIds.includes(opp.id);
          const isApplied = appliedIds.includes(opp.id);

          return (
            <div key={opp.id} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                    {opp.type}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {opp.match_score || 88}% Match
                    </span>
                    <button
                      onClick={() => toggleSaveOpportunity(opp.id)}
                      className={`p-1.5 rounded-lg border transition ${
                        isSaved ? 'bg-amber-50 text-amber-600 border-amber-300' : 'text-slate-400 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{opp.title}</h3>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">{opp.organization}</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{opp.description}</p>

                {/* AI Recommendation Reason */}
                <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900">
                  <span className="font-bold block text-indigo-700">Why recommended for you:</span>
                  <span className="italic mt-0.5 block">"{opp.recommendation_reason || 'Matches your listed skills and student eligibility.'}"</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Required Skills</span>
                    <span className="font-semibold">{opp.required_skills}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Deadline</span>
                    <span className="font-semibold text-rose-600">{opp.deadline}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Location</span>
                    <span className="font-semibold">{opp.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Eligibility</span>
                    <span className="font-semibold">{opp.eligibility}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleApply(opp.id)}
                  disabled={isApplied}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-1 ${
                    isApplied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  <span>{isApplied ? 'Applied ✓' : 'Apply Now'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
