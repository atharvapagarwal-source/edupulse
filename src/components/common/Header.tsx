import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Sparkles, Search, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, currentTab, setCurrentTab }) => {
  const { user, notificationsCount, markNotificationsAsRead } = useAuth();

  const getTitle = () => {
    switch (currentTab) {
      case 'student-dashboard': return 'Student Academic Dashboard';
      case 'performance': return 'Performance & Subject Analytics';
      case 'assignments': return 'Smart Assignment Workspace';
      case 'anonymous-feedback': return 'Anonymous Course Feedback';
      case 'study-planner': return 'AI Personalized Study Planner';
      case 'opportunities': return 'AI Opportunity Recommendations';
      case 'ai-assistant': return 'EduPulse AI Academic Copilot';
      case 'notifications': return 'Notifications & Alerts';
      case 'profile': return 'Student Profile & Skills Index';
      case 'teacher-dashboard': return 'Faculty Academic Overview';
      case 'academic-support': return 'Students Requiring Academic Support';
      case 'teacher-feedback': return 'Class Anonymous Feedback Analytics';
      case 'teacher-assignments': return 'Course Assignment & Evaluation';
      case 'admin-dashboard': return 'Institutional Intelligence Center';
      default: return 'EduPulse Platform';
    }
  };

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{getTitle()}</h1>
          <p className="hidden sm:block text-xs text-slate-500 font-medium">
            Understand. Improve. Achieve.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Quick Search */}
        <div className="hidden md:flex items-center bg-slate-100/80 text-slate-500 rounded-full px-3.5 py-1.5 text-xs border border-slate-200 w-48 focus-within:w-64 focus-within:bg-white focus-within:border-indigo-500 transition-all">
          <Search className="w-3.5 h-3.5 mr-2 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics, assignments..."
            className="bg-transparent border-none outline-none w-full text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* AI Copilot Quick Launcher */}
        <button
          onClick={() => setCurrentTab('ai-assistant')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm hover:opacity-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">EduPulse AI</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => {
            setCurrentTab('notifications');
            markNotificationsAsRead();
          }}
          className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 transition"
        >
          <Bell className="w-5 h-5" />
          {notificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => setCurrentTab('profile')}
          className="flex items-center space-x-2 pl-2 border-l border-slate-200 hover:opacity-80 transition"
        >
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="User"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
        </button>
      </div>
    </header>
  );
};
