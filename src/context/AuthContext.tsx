import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  savedOpportunityIds: string[];
  toggleSaveOpportunity: (id: string) => void;
  notificationsCount: number;
  markNotificationsAsRead: () => void;
  userSkills: string[];
  setUserSkills: (skills: string[]) => void;
}

const defaultStudent: User = {
  id: 'std-001',
  name: 'Atharva Pagarwal',
  email: 'atharva@edupulse.edu',
  role: 'STUDENT',
  college: 'VIT University',
  course: 'B.Tech Computer Science',
  year: '3rd Year',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

const defaultTeacher: User = {
  id: 'tch-001',
  name: 'Prof. Rajesh Sharma',
  email: 'sharma@edupulse.edu',
  role: 'TEACHER',
  college: 'VIT University',
  course: 'School of Computer Science & Eng.',
  year: 'Senior Faculty',
  avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
};

const defaultAdmin: User = {
  id: 'adm-001',
  name: 'Dr. Sunita Deshmukh',
  email: 'admin@edupulse.edu',
  role: 'ADMIN',
  college: 'VIT University',
  course: 'Academic Affairs & Analytics',
  year: 'Dean Office',
  avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultStudent);
  const [role, setRoleState] = useState<UserRole>('STUDENT');
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(['opp-001']);
  const [notificationsCount, setNotificationsCount] = useState<number>(3);
  const [userSkills, setUserSkills] = useState<string[]>(["Python", "Machine Learning", "Web Development", "Data Structures", "SQL"]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'STUDENT') setUser(defaultStudent);
    else if (newRole === 'TEACHER') setUser(defaultTeacher);
    else if (newRole === 'ADMIN') setUser(defaultAdmin);
  };

  const loginAsRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleSaveOpportunity = (id: string) => {
    setSavedOpportunityIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const markNotificationsAsRead = () => {
    setNotificationsCount(0);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      setRole,
      loginAsRole,
      logout,
      savedOpportunityIds,
      toggleSaveOpportunity,
      notificationsCount,
      markNotificationsAsRead,
      userSkills,
      setUserSkills
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
