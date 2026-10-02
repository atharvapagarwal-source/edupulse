import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleSwitcherBanner } from './components/common/RoleSwitcherBanner';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { PerformancePage } from './pages/PerformancePage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { AnonymousFeedbackPage } from './pages/AnonymousFeedbackPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';

import { TeacherDashboard } from './pages/TeacherDashboard';
import { AcademicSupportPage } from './pages/AcademicSupportPage';
import { TeacherFeedbackAnalyticsPage } from './pages/TeacherFeedbackAnalyticsPage';
import { TeacherAssignmentsPage } from './pages/TeacherAssignmentsPage';

import { AdminDashboard } from './pages/AdminDashboard';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { role } = useAuth();

  const renderContent = () => {
    switch (currentTab) {
      case 'landing':
        return (
          <LandingPage
            onLoginClick={() => setCurrentTab('auth')}
            onGetStartedClick={() => setCurrentTab('student-dashboard')}
            setCurrentTab={setCurrentTab}
          />
        );

      case 'auth':
        return (
          <AuthPage
            onSuccess={(newRole) => {
              if (newRole === 'STUDENT') setCurrentTab('student-dashboard');
              else if (newRole === 'TEACHER') setCurrentTab('teacher-dashboard');
              else if (newRole === 'ADMIN') setCurrentTab('admin-dashboard');
            }}
          />
        );

      // Student views
      case 'student-dashboard':
        return <StudentDashboard setCurrentTab={setCurrentTab} />;
      case 'performance':
        return <PerformancePage setCurrentTab={setCurrentTab} />;
      case 'assignments':
        return <AssignmentsPage />;
      case 'anonymous-feedback':
        return <AnonymousFeedbackPage />;
      case 'study-planner':
        return <StudyPlannerPage />;
      case 'opportunities':
        return <OpportunitiesPage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;

      // Teacher views
      case 'teacher-dashboard':
        return <TeacherDashboard setCurrentTab={setCurrentTab} />;
      case 'academic-support':
        return <AcademicSupportPage />;
      case 'teacher-feedback':
        return <TeacherFeedbackAnalyticsPage />;
      case 'teacher-assignments':
        return <TeacherAssignmentsPage />;

      // Admin views
      case 'admin-dashboard':
        return <AdminDashboard />;

      default:
        return <StudentDashboard setCurrentTab={setCurrentTab} />;
    }
  };

  const isFullWidthView = currentTab === 'landing' || currentTab === 'auth';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Demo Role Switcher Banner */}
      <RoleSwitcherBanner currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {isFullWidthView ? (
        <main className="flex-1">{renderContent()}</main>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
          />

          {/* Main workspace content area */}
          <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
            <Header
              onMenuClick={() => setSidebarOpen(true)}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />

            <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
              <div className="max-w-7xl mx-auto">{renderContent()}</div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
