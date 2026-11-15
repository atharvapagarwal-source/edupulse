import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, Home, GraduationCap, UserCheck, ShieldCheck, Users } from 'lucide-react';
import { UserRole } from '../../types';

interface RoleSwitcherProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const RoleSwitcherBanner: React.FC<RoleSwitcherProps> = ({ currentTab, setCurrentTab }) => {
  const { user, role, setRole, switchStudentAccount, switchTeacherAccount } = useAuth();

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'STUDENT') setCurrentTab('student-dashboard');
    else if (newRole === 'TEACHER') setCurrentTab('teacher-dashboard');
    else if (newRole === 'ADMIN') setCurrentTab('admin-dashboard');
  };

  const handleStudentSwitch = (id: 'std-001' | 'std-002') => {
    switchStudentAccount(id);
    setCurrentTab('student-dashboard');
  };

  const handleTeacherSwitch = (id: 'tch-001' | 'tch-002') => {
    switchTeacherAccount(id);
    setCurrentTab('teacher-dashboard');
  };

  return (
    <div className="bg-[#173F3A] text-[#F5F3ED] text-xs py-2 px-4 flex flex-wrap items-center justify-between border-b border-[#102d29] shadow-sm">
      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#79A995]/20 text-[#DCE9E1] border border-[#79A995]/30">
          <Eye className="w-3 h-3 mr-1 text-[#E7B978]" /> Multi-Account Testing Mode
        </span>
        <span className="hidden sm:inline text-[#DCE9E1]/80">
          Select authenticated account to test isolation:
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
          <span>Home</span>
        </button>

        <span className="text-[#79A995]/40">|</span>

        {/* Student 1 (Atharva) */}
        <button
          onClick={() => handleStudentSwitch('std-001')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition ${
            role === 'STUDENT' && user?.id === 'std-001' && currentTab !== 'landing'
              ? 'bg-[#E7B978] text-[#173F3A] font-bold shadow-xs'
              : 'hover:bg-[#102d29] text-[#DCE9E1]'
          }`}
          title="Student 1: Atharva Pagarwal (CGPA 8.2)"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Student 1: Atharva</span>
        </button>

        {/* Student 2 (Riya) */}
        <button
          onClick={() => handleStudentSwitch('std-002')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition ${
            role === 'STUDENT' && user?.id === 'std-002' && currentTab !== 'landing'
              ? 'bg-[#E7B978] text-[#173F3A] font-bold shadow-xs'
              : 'hover:bg-[#102d29] text-[#DCE9E1]'
          }`}
          title="Student 2: Riya Sharma (CGPA 9.1)"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Student 2: Riya</span>
        </button>

        <span className="text-[#79A995]/40">|</span>

        {/* Faculty 1 (Prof. Sharma) */}
        <button
          onClick={() => handleTeacherSwitch('tch-001')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition ${
            role === 'TEACHER' && user?.id === 'tch-001' && currentTab !== 'landing'
              ? 'bg-[#E7B978] text-[#173F3A] font-bold shadow-xs'
              : 'hover:bg-[#102d29] text-[#DCE9E1]'
          }`}
          title="Faculty 1: Prof. Rajesh Sharma (Data Structures & OOPS)"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Faculty: Sharma</span>
        </button>

        {/* Faculty 2 (Dr. Montgomery) */}
        <button
          onClick={() => handleTeacherSwitch('tch-002')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition ${
            role === 'TEACHER' && user?.id === 'tch-002' && currentTab !== 'landing'
              ? 'bg-[#E7B978] text-[#173F3A] font-bold shadow-xs'
              : 'hover:bg-[#102d29] text-[#DCE9E1]'
          }`}
          title="Faculty 2: Dr. Vance Montgomery (Computer Networks)"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Faculty: Montgomery</span>
        </button>

        {/* Admin */}
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
