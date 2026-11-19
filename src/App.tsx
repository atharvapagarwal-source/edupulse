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
import { SchedulePage } from './pages/SchedulePage';
import { AnonymousFeedbackPage } from './pages/AnonymousFeedbackPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { StudentReportsPage } from './pages/StudentReportsPage';

import { TeacherDashboard } from './pages/TeacherDashboard';
import { TeacherClassesPage } from './pages/TeacherClassesPage';
import { TeacherStudentAnalyticsPage } from './pages/TeacherStudentAnalyticsPage';
import { TeacherStudentReportsPage } from './pages/TeacherStudentReportsPage';
import { TeacherClassReportsPage } from './pages/TeacherClassReportsPage';
import { TeacherAssignmentsPage } from './pages/TeacherAssignmentsPage';
import { TeacherEvaluationsPage } from './pages/TeacherEvaluationsPage';
import { TeacherFeedbackAnalyticsPage } from './pages/TeacherFeedbackAnalyticsPage';
import { TeacherSchedulePage } from './pages/TeacherSchedulePage';
import { TeacherAnnouncementsPage } from './pages/TeacherAnnouncementsPage';
import { TeacherAICopilotPage } from './pages/TeacherAICopilotPage';
import { TeacherNotificationsPage } from './pages/TeacherNotificationsPage';
import { TeacherProfilePage } from './pages/TeacherProfilePage';
import { AcademicSupportPage } from './pages/AcademicSupportPage';

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
      case 'student-reports':
        return <StudentReportsPage />;
      case 'assignments':
        return <AssignmentsPage />;
      case 'schedule':
        return <SchedulePage />;
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
      case 'teacher-classes':
        return <TeacherClassesPage />;
      case 'teacher-analytics':
        return <TeacherStudentAnalyticsPage />;
      case 'teacher-student-reports':
        return <TeacherStudentReportsPage />;
      case 'teacher-class-reports':
        return <TeacherClassReportsPage setCurrentTab={setCurrentTab} />;
      case 'teacher-assignments':
        return <TeacherAssignmentsPage />;
      case 'teacher-evaluations':
        return <TeacherEvaluationsPage />;
      case 'teacher-feedback':
        return <TeacherFeedbackAnalyticsPage />;
      case 'teacher-schedule':
        return <TeacherSchedulePage />;
      case 'teacher-announcements':
        return <TeacherAnnouncementsPage />;
      case 'teacher-ai':
        return <TeacherAICopilotPage />;
      case 'teacher-notifications':
        return <TeacherNotificationsPage />;
      case 'teacher-profile':
        return <TeacherProfilePage />;
      case 'academic-support':
        return <AcademicSupportPage />;

      // Admin views
      case 'admin-dashboard':
        return <AdminDashboard />;

      default:
        return <StudentDashboard setCurrentTab={setCurrentTab} />;
    }
  };

  const isFullWidthView = currentTab === 'landing' || currentTab === 'auth';

  return (
    <div className="min-h-screen bg-[#F5F3ED] text-[#344541] flex flex-col">
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
