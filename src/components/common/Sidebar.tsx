import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, BarChart3, BookOpen, Calendar,
  Sparkles, MessageSquareHeart, Award, Bot,
  Bell, User, GraduationCap, LogOut, ChevronRight,
  AlertTriangle, CheckSquare, Megaphone, FileText
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, isOpen, setIsOpen }) => {
  const { role, user, logout, notificationsCount } = useAuth();

  // EXACT SPECIFICATION FOR STUDENT SIDEBAR
  const studentNav = [
    { id: 'student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'performance', label: 'My Progress', icon: BarChart3 },
    { id: 'student-reports', label: 'My Progress Reports', icon: FileText },
    { id: 'assignments', label: 'Classes & Tasks', icon: BookOpen },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'study-planner', label: 'Study Planner', icon: Sparkles },
    { id: 'anonymous-feedback', label: 'Feedback', icon: MessageSquareHeart },
    { id: 'opportunities', label: 'Opportunities', icon: Award },
    { id: 'ai-assistant', label: 'AI Copilot', icon: Bot },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notificationsCount > 0 ? notificationsCount : undefined },
    { id: 'profile', label: 'Profile & Skills', icon: User },
  ];

  // EXACT SPECIFICATION FOR TEACHER SIDEBAR
  const teacherNav = [
    { id: 'teacher-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'teacher-classes', label: 'My Classes', icon: BookOpen },
    { id: 'teacher-analytics', label: 'Student Analytics', icon: BarChart3 },
    { id: 'teacher-student-reports', label: 'Student Progress Reports', icon: FileText },
    { id: 'teacher-class-reports', label: 'Class Progress Reports', icon: GraduationCap },
    { id: 'teacher-assignments', label: 'Assignments', icon: FileText },
    { id: 'teacher-evaluations', label: 'Submissions & Evaluation', icon: CheckSquare },
    { id: 'teacher-feedback', label: 'Feedback Insights', icon: MessageSquareHeart },
    { id: 'teacher-schedule', label: 'Schedule', icon: Calendar },
    { id: 'teacher-announcements', label: 'Announcements', icon: Megaphone },
    { id: 'teacher-ai', label: 'AI Copilot', icon: Bot },
    { id: 'teacher-notifications', label: 'Notifications', icon: Bell, badge: notificationsCount > 0 ? notificationsCount : undefined },
    { id: 'teacher-profile', label: 'Profile', icon: User },
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
          className="fixed inset-0 bg-[#173F3A]/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#173F3A] text-[#F5F3ED] flex flex-col transition-transform duration-300 ease-in-out border-r border-[#102d29] shadow-xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#79A995]/20">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('landing')}>
            <div className="w-9 h-9 rounded-xl bg-[#79A995] flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-[#173F3A]" />
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">StudentConnector</span>
              <span className="block text-[10px] text-[#E7B978] font-medium tracking-wide uppercase">Academic Hub</span>
            </div>
          </div>
        </div>

        {/* Authenticated Student Profile Card */}
        <div className="p-4">
          <div className="bg-[#102d29]/70 rounded-2xl p-3 border border-[#79A995]/20 flex items-center space-x-3">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#79A995]"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-[#E7B978] font-medium truncate">
                {user?.role === 'STUDENT' ? `Student (${user.id})` : user?.role === 'TEACHER' ? 'Faculty' : 'Administrator'}
              </p>
            </div>
          </div>
        </div>

        {/* 10 Navigation Items */}
        <div className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
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
                  w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-[#79A995] text-[#173F3A] font-semibold shadow-xs'
                    : 'text-[#DCE9E1] hover:bg-[#102d29] hover:text-white'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#173F3A]' : 'text-[#79A995]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#E7B978] text-[#173F3A]">
                    {item.badge}
                  </span>
                ) : isActive ? (
                  <ChevronRight className="w-3.5 h-3.5 text-[#173F3A]" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* 11. Sign Out */}
        <div className="p-4 border-t border-[#79A995]/20">
          <button
            onClick={() => {
              logout();
              setCurrentTab('auth');
            }}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#DCE9E1] hover:bg-[#102d29] hover:text-[#E7B978] transition"
          >
            <LogOut className="w-4 h-4 text-[#E7B978]" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
