import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, ShieldCheck, GraduationCap, Eye, Home } from 'lucide-react';
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
    <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 flex flex-wrap items-center justify-between border-b border-slate-800 shadow-md">
      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          <Eye className="w-3 h-3 mr-1" /> Interactive Demo Mode
        </span>
        <span className="hidden sm:inline text-slate-400">
          Click any role to switch live view:
        </span>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <button
          onClick={() => setCurrentTab('landing')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition ${
            currentTab === 'landing' ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Landing Page</span>
        </button>

        <span className="text-slate-700">|</span>

        <button
          onClick={() => handleRoleChange('STUDENT')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition ${
            role === 'STUDENT' && currentTab !== 'landing'
              ? 'bg-blue-600 text-white font-medium shadow-sm'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Student (Atharva)</span>
        </button>

        <button
          onClick={() => handleRoleChange('TEACHER')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition ${
            role === 'TEACHER' && currentTab !== 'landing'
              ? 'bg-purple-600 text-white font-medium shadow-sm'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Teacher (Prof. Sharma)</span>
        </button>

        <button
          onClick={() => handleRoleChange('ADMIN')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition ${
            role === 'ADMIN' && currentTab !== 'landing'
              ? 'bg-emerald-600 text-white font-medium shadow-sm'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin (Dean)</span>
        </button>
      </div>
    </div>
  );
};
