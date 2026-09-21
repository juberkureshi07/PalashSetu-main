import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LiveTranslation from './pages/LiveTranslation';
import Lessons from './pages/Lessons';
import Worksheets from './pages/Worksheets';
import JCERTTextbooks from './pages/JCERTTextbooks';
import Flashcards from './pages/Flashcards';
import Settings from './pages/Settings';
import ReportIssue from './pages/ReportIssue';
import AuthLogin from './pages/AuthLogin';
import AuthRegister from './pages/AuthRegister';
import PracticeMode from './pages/PracticeMode';
import PronunciationCoach from './pages/PronunciationCoach';
import StudentBroadcastView from './pages/StudentBroadcastView';
import SplashScreen from './components/SplashScreen';
import OnboardingWizard, { UserProfile } from './components/OnboardingWizard';
import { authService, TeacherProfile } from './services/authService';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider } from './context/RoleContext';
import ProtectedRoute from './components/ProtectedRoute';
import PinModal from './components/PinModal';

const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [activeTeacher, setActiveTeacher] = useState<TeacherProfile | null>(null);

  useEffect(() => {
    const profile = authService.getActiveProfile();
    setActiveTeacher(profile);
  }, []);

  const handleLoginSuccess = (profile: TeacherProfile) => {
    setActiveTeacher(profile);
  };

  const handleSwitchTeacher = () => {
    authService.logout();
    setActiveTeacher(null);
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/login" element={<AuthLogin onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/register" element={<AuthRegister onRegisterSuccess={handleLoginSuccess} />} />

      <Route
        path="/"
        element={
          <Layout
            activeTeacher={activeTeacher}
            onSwitchTeacher={handleSwitchTeacher}
          />
        }
      >
        <Route index element={<Dashboard activeTeacher={activeTeacher} />} />
        <Route
          path="translate"
          element={
            <ProtectedRoute requireTeacher>
              <LiveTranslation />
            </ProtectedRoute>
          }
        />
        <Route path="practice" element={<PracticeMode />} />
        <Route
          path="pronounce"
          element={
            <ProtectedRoute requireTeacher>
              <PronunciationCoach />
            </ProtectedRoute>
          }
        />
        <Route path="student-view" element={<StudentBroadcastView />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route
          path="lessons"
          element={
            <ProtectedRoute requireTeacher>
              <Lessons />
            </ProtectedRoute>
          }
        />
        <Route
          path="worksheets"
          element={
            <ProtectedRoute requireTeacher>
              <Worksheets />
            </ProtectedRoute>
          }
        />
        <Route path="books" element={<JCERTTextbooks />} />
        <Route
          path="settings"
          element={
            <ProtectedRoute requireTeacher>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="report"
          element={
            <ProtectedRoute requireTeacher>
              <ReportIssue activeTeacher={activeTeacher} />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

import ErrorBoundary from './components/ErrorBoundary';

import { LanguageProvider } from './context/LanguageContext';
import LanguageSelectModal from './components/LanguageSelectModal';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('bhashagyan_user_profile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch {
        setShowOnboarding(true);
      }
    } else {
      setShowOnboarding(true);
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RoleProvider>
          <LanguageProvider>
            {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
            {!showSplash && showOnboarding && (
              <OnboardingWizard onComplete={handleOnboardingComplete} />
            )}
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AppRoutes />
            </BrowserRouter>
            <PinModal />
            <LanguageSelectModal />
          </LanguageProvider>
        </RoleProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
