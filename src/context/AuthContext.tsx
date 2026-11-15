import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  loginAsRole: (role: UserRole) => void;
  switchStudentAccount: (studentId: 'std-001' | 'std-002') => void;
  logout: () => void;
  savedOpportunityIds: string[];
  toggleSaveOpportunity: (id: string) => void;
  notificationsCount: number;
  markNotificationsAsRead: () => void;
  userSkills: string[];
  setUserSkills: (skills: string[]) => void;
}

export const studentAtharva: User = {
  id: 'std-001',
  name: 'Atharva Pagarwal',
  email: 'atharva@studentconnector.edu',
  role: 'STUDENT',
  college: 'VIT University',
  course: 'B.Tech Computer Science',
  year: '3rd Year',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

export const studentRiya: User = {
  id: 'std-002',
  name: 'Riya Sharma',
  email: 'riya@studentconnector.edu',
  role: 'STUDENT',
  college: 'VIT University',
  course: 'B.Tech Computer Science',
  year: '3rd Year',
  avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
};

export const defaultTeacher: User = {
  id: 'tch-001',
  name: 'Prof. Rajesh Sharma',
  email: 'sharma@studentconnector.edu',
  role: 'TEACHER',
  college: 'VIT University',
  course: 'School of Computer Science & Eng.',
  year: 'Senior Faculty',
  avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
};

export const defaultAdmin: User = {
  id: 'adm-001',
  name: 'Dr. Sunita Deshmukh',
  email: 'admin@studentconnector.edu',
  role: 'ADMIN',
  college: 'VIT University',
  course: 'Academic Affairs & Analytics',
  year: 'Dean Office',
  avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem('auth_user_id');
    if (savedId === 'std-002') return studentRiya;
    if (savedId === 'tch-001') return defaultTeacher;
    if (savedId === 'adm-001') return defaultAdmin;
    return studentAtharva;
  });

  const [role, setRoleState] = useState<UserRole>(() => {
    return user?.role || 'STUDENT';
  });

  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(['opp-001']);
  const [notificationsCount, setNotificationsCount] = useState<number>(3);
  const [userSkills, setUserSkills] = useState<string[]>(["C++", "Data Structures", "Python", "SQL"]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_token', 'jwt-token-' + user.id);
      localStorage.setItem('auth_user_id', user.id);
      localStorage.setItem('auth_user_role', user.role);
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user_id');
      localStorage.removeItem('auth_user_role');
    }
  }, [user]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'STUDENT') {
      setUser(studentAtharva);
    } else if (newRole === 'TEACHER') {
      setUser(defaultTeacher);
    } else if (newRole === 'ADMIN') {
      setUser(defaultAdmin);
    }
  };

  const loginAsRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  const switchStudentAccount = (studentId: 'std-001' | 'std-002') => {
    setRoleState('STUDENT');
    if (studentId === 'std-002') {
      setUser(studentRiya);
      setUserSkills(["React", "TypeScript", "Node.js", "Python"]);
    } else {
      setUser(studentAtharva);
      setUserSkills(["C++", "Data Structures", "Python", "SQL"]);
    }
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
      switchStudentAccount,
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
