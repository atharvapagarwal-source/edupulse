import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, BarChart3, BookOpen, MessageSquareHeart,
  Calendar, Sparkles, Bot, Bell, User, Users, AlertTriangle,
  GraduationCap, LogOut, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, isOpen, setIsOpen }) => {
  const { role, user, logout, notificationsCount } = useAuth();

  const studentNav = [
    { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'performance', label: 'My Performance', icon: BarChart3 },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'anonymous-feedback', label: 'Feedback', icon: MessageSquareHeart },
    { id: 'study-planner', label: 'Study Planner', icon: Calendar },
    { id: 'opportunities', label: 'Opportunities', icon: Sparkles },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notificationsCount > 0 ? notificationsCount : undefined },
    { id: 'profile', label: 'Profile & Skills', icon: User },
  ];

  const teacherNav = [
    { id: 'teacher-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'academic-support', label: 'Academic Support', icon: AlertTriangle, highlight: true },
    { id: 'teacher-feedback', label: 'Anonymous Feedback', icon: MessageSquareHeart },
    { id: 'teacher-assignments', label: 'Assignments & Grading', icon: BookOpen },
    { id: 'ai-assistant', label: 'AI Class Assistant', icon: Bot },
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: 'Admin Overview', icon: LayoutDashboard },
    { id: 'opportunities', label: 'Opportunities Portal', icon: Sparkles },
  ];

  const navItems = role === 'STUDENT' ? studentNav : role === 'TEACHER' ? teacherNav : adminNav;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('landing')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">EduPulse</span>
              <span className="block text-[10px] text-indigo-400 font-medium tracking-wide uppercase">AI Platform</span>
            </div>
          </div>
        </div>

        {/* User Role Badge */}
        <div className="p-4">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50 flex items-center space-x-3">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-indigo-400 font-medium">{role === 'STUDENT' ? 'Student' : role === 'TEACHER' ? 'Faculty' : 'Administrator'}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }
                  ${item.highlight ? 'border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20' : ''}
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500 text-white shadow-sm">
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />}
              </button>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={() => setCurrentTab('landing')}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Switch Role / Exit</span>
          </button>
        </div>
      </aside>
    </>
  );
};
