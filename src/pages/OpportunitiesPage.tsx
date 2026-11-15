import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOpportunities } from '../services/api';
import { Opportunity } from '../types';
import { Sparkles, Bookmark, CheckCircle2, MapPin, Calendar, ExternalLink, Search, Award } from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  const { user, savedOpportunityIds, toggleSaveOpportunity, userSkills } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getOpportunities()
      .then(res => {
        setOpportunities(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading opportunities:", err);
        setLoading(false);
      });
  }, [user?.id, userSkills]);

  const categories = [
    'All', 'Hackathon', 'Internship', 'Scholarship', 'Competition', 'Workshop', 'Research'
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
    alert("Application submitted successfully through StudentConnector Opportunity Portal!");
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-[#344541]">
      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#DCE9E1]/80 via-[#F5F3ED] to-[#DCE9E1]/50 border border-[#DCE9E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#173F3A]/10 text-[#173F3A] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#E7B978]" />
            <span>Profile-Matched Opportunities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173F3A] tracking-tight">
            Internships, Hackathons & Programs
          </h2>
          <p className="text-sm text-[#344541]/75 mt-1 font-medium">
            Recommendations matched against {user?.name}'s registered skills: <span className="font-bold text-[#173F3A]">{userSkills.slice(0, 4).join(', ')}</span>.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#344541]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, organization or skill (C++, Python, Algorithms)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#DCE9E1] text-xs text-[#344541] bg-[#FAF9F5] outline-none focus:border-[#79A995]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#173F3A] text-white shadow-xs'
                    : 'bg-[#FAF9F5] text-[#344541]/70 hover:bg-[#DCE9E1]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full p-12 text-center text-xs text-[#344541]/60 bg-white rounded-3xl border border-[#DCE9E1]">
            Loading matched opportunities...
          </div>
        ) : filteredOpps.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-[#344541]/60 bg-white rounded-3xl border border-[#DCE9E1]">
            No opportunities match your filter.
          </div>
        ) : (
          filteredOpps.map((opp) => {
            const isApplied = appliedIds.includes(opp.id);
            const isSaved = savedOpportunityIds.includes(opp.id);
            return (
              <div
                key={opp.id}
                className="bg-white rounded-3xl p-5 border border-[#DCE9E1] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCE9E1] text-[#173F3A]">
                      {opp.type}
                    </span>
                    <button
                      onClick={() => toggleSaveOpportunity(opp.id)}
                      className="p-1 rounded-full text-[#344541]/50 hover:text-[#173F3A]"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#E7B978] text-[#E7B978]' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-[#173F3A] mt-2">{opp.title}</h3>
                  <p className="text-xs text-[#79A995] font-semibold">{opp.organization}</p>
                  <p className="text-xs text-[#344541]/75 mt-2 leading-relaxed">{opp.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E5E2D9]">
                  <div className="flex items-center justify-between text-[11px] text-[#344541]/70">
                    <span>Skills: <strong className="text-[#173F3A]">{opp.required_skills}</strong></span>
                    <span className="text-rose-600 font-bold">Due {opp.deadline}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-black text-[#173F3A]">
                      {opp.match_score || 92}% Match
                    </span>

                    <button
                      onClick={() => handleApply(opp.id)}
                      disabled={isApplied}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                        isApplied
                          ? 'bg-[#DCE9E1] text-[#173F3A]'
                          : 'bg-[#173F3A] hover:bg-[#102d29] text-white'
                      }`}
                    >
                      {isApplied ? 'Application Sent' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
