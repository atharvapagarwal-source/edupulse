import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, Sparkles, Search, User as UserIcon, Settings } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, currentTab, setCurrentTab }) => {
  const { user, notificationsCount, markNotificationsAsRead } = useAuth();

  const getTitle = () => {
    switch (currentTab) {
      case 'student-dashboard': return 'Student Dashboard';
      case 'performance': return 'Performance & Subject Analytics';
      case 'assignments': return 'Smart Assignment Workspace';
      case 'anonymous-feedback': return 'Anonymous Course Feedback';
      case 'study-planner': return 'Personalized Study Planner';
      case 'opportunities': return 'Opportunity Recommendations';
      case 'ai-assistant': return 'StudentConnector AI Copilot';
      case 'notifications': return 'Notifications & Alerts';
      case 'profile': return 'Student Profile & Skills Index';
      case 'teacher-dashboard': return 'Faculty Academic Overview';
      case 'academic-support': return 'Students Requiring Academic Support';
      case 'teacher-feedback': return 'Class Anonymous Feedback Analytics';
      case 'teacher-assignments': return 'Course Assignment & Evaluation';
      case 'admin-dashboard': return 'Institutional Intelligence Center';
      default: return 'StudentConnector Platform';
    }
  };

  return (
    <header className="h-16 bg-[#F5F3ED]/90 backdrop-blur-md border-b border-[#DCE9E1] sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl text-[#344541] hover:text-[#173F3A] hover:bg-[#DCE9E1]/50 lg:hidden transition"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#173F3A] tracking-tight">{getTitle()}</h1>
          <p className="hidden sm:block text-xs text-[#344541]/70 font-medium">
            Connect. Learn. Achieve.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Quick Search */}
        <div className="hidden md:flex items-center bg-[#DCE9E1]/40 text-[#344541] rounded-full px-3.5 py-1.5 text-xs border border-[#DCE9E1] w-48 focus-within:w-64 focus-within:bg-white focus-within:border-[#79A995] transition-all">
          <Search className="w-3.5 h-3.5 mr-2 text-[#79A995]" />
          <input
            type="text"
            placeholder="Search classes, peers, topics..."
            className="bg-transparent border-none outline-none w-full text-[#344541] placeholder-[#344541]/50"
          />
        </div>

        {/* AI Copilot Quick Launcher */}
        <button
          onClick={() => setCurrentTab('ai-assistant')}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#173F3A] hover:bg-[#102d29] text-white shadow-xs transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E7B978]" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Settings button */}
        <button
          onClick={() => setCurrentTab('profile')}
          className="p-2 rounded-full text-[#344541] hover:bg-[#DCE9E1]/60 transition"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-[#344541]" />
        </button>

        {/* Notifications */}
        <button
          onClick={() => {
            setCurrentTab('notifications');
            markNotificationsAsRead();
          }}
          className="relative p-2 rounded-full text-[#344541] hover:bg-[#DCE9E1]/60 transition"
        >
          <Bell className="w-4 h-4 text-[#344541]" />
          {notificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#E7B978] rounded-full ring-2 ring-[#F5F3ED]" />
          )}
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => setCurrentTab('profile')}
          className="flex items-center space-x-2 pl-2 border-l border-[#DCE9E1] hover:opacity-85 transition"
        >
          <span className="hidden md:inline text-xs font-semibold text-[#173F3A]">
            {user?.name || 'Atharva Pagarwal'}
          </span>
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="User"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#79A995]"
          />
        </button>
      </div>
    </header>
  );
};
