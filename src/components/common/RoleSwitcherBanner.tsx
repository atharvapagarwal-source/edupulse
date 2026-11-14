import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, Home, GraduationCap, UserCheck, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types';

interface RoleSwitcherProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const RoleSwitcherBanner: React.FC<RoleSwitcherProps> = ({ currentTab, setCurrentTab }) => {
  const { role, setRole } = useAuth();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'STUDENT') setCurrentTab('student-dashboard');
    else if (newRole === 'TEACHER') setCurrentTab('teacher-dashboard');
    else if (newRole === 'ADMIN') setCurrentTab('admin-dashboard');
  };

  return (
    <div className="bg-[#173F3A] text-[#F5F3ED] text-xs py-2 px-4 flex flex-wrap items-center justify-between border-b border-[#102d29] shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#79A995]/20 text-[#DCE9E1] border border-[#79A995]/30">
          <Eye className="w-3 h-3 mr-1 text-[#E7B978]" /> Interactive Demo Mode
        </span>
        <span className="hidden sm:inline text-[#DCE9E1]/80">
          Click any role to switch live view:
        </span>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <button
          onClick={() => setCurrentTab('landing')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition ${
            currentTab === 'landing' ? 'bg-[#79A995] text-[#173F3A] font-semibold' : 'hover:bg-[#102d29] text-[#DCE9E1]'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Landing Page</span>
        </button>

        <span className="text-[#79A995]/40">|</span>

        <button
          onClick={() => handleRoleChange('STUDENT')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition ${
            role === 'STUDENT' && currentTab !== 'landing'
              ? 'bg-[#E7B978] text-[#173F3A] font-semibold shadow-xs'
              : 'hover:bg-[#102d29] text-[#DCE9E1]'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Student (Atharva)</span>
        </button>

        <button
          onClick={() => handleRoleChange('TEACHER')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition ${
            role === 'TEACHER' && currentTab !== 'landing'
              ? 'bg-[#79A995] text-[#173F3A] font-semibold shadow-xs'
              : 'hover:bg-[#102d29] text-[#DCE9E1]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Teacher (Prof. Sharma)</span>
        </button>

        <button
          onClick={() => handleRoleChange('ADMIN')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition ${
            role === 'ADMIN' && currentTab !== 'landing'
              ? 'bg-[#79A995] text-[#173F3A] font-semibold shadow-xs'
              : 'hover:bg-[#102d29] text-[#DCE9E1]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      </div>
    </div>
  );
};
