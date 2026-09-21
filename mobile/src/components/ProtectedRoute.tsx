import React from 'react';
import { useRole } from '../context/RoleContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireTeacher?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireTeacher = true }) => {
  const { isTeacher, openTeacherPinModal } = useRole();
  const { isDarkMode } = useTheme();
  const location = useLocation();

  if (requireTeacher && !isTeacher) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '65vh',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '460px',
            width: '100%',
            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              margin: '0 auto 1.25rem',
            }}
          >
            🔒
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: isDarkMode ? '#f8fafc' : '#0f2744', marginBottom: '0.5rem' }}>
            शिक्षक क्षेत्र सुरक्षित है (Teacher Access Only)
          </h2>

          <p style={{ fontSize: '0.9rem', color: isDarkMode ? '#94a3b8' : '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            यह सुविधा केवल शिक्षकों के लिए है। बच्चों को सुरक्षित रखने के लिए इस अनुभाग तक पहुँचने के लिए शिक्षक PIN आवश्यक है।
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => openTeacherPinModal(location.pathname)}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#ed8936',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(237,137,54,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>🔐</span>
              <span>शिक्षक PIN दर्ज करें (Enter Teacher PIN)</span>
            </button>

            <Link
              to="/practice"
              style={{
                width: '100%',
                padding: '11px 20px',
                borderRadius: '12px',
                border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`,
                backgroundColor: 'transparent',
                color: isDarkMode ? '#94a3b8' : '#64748b',
                fontWeight: 700,
                fontSize: '0.88rem',
                textDecoration: 'none',
                display: 'inline-block',
                boxSizing: 'border-box',
              }}
            >
              🎮 बाल अभ्यास गेम पर वापस जाएँ (Back to Games)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
