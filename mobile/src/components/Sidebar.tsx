import React from 'react';
import { NavLink } from 'react-router-dom';
import { sfx } from '../utils/sfx';
import { useLanguage } from '../context/LanguageContext';
import { TranslationKey } from '../utils/translations';
import { useRole } from '../context/RoleContext';

interface NavItemConfig {
  to: string;
  icon: string;
  labelKey: TranslationKey;
  badgeKey?: TranslationKey;
}

const STUDENT_NAV_ITEMS: NavItemConfig[] = [
  { to: '/', icon: '🏠', labelKey: 'navDashboard' },
  { to: '/practice', icon: '🎮', labelKey: 'navPractice', badgeKey: 'badgePractice' },
  { to: '/student-view', icon: '📡', labelKey: 'navStudentView', badgeKey: 'badgeLan' },
  { to: '/flashcards', icon: '🃏', labelKey: 'navFlashcards', badgeKey: 'badgeFlashcards' },
  { to: '/books', icon: '📖', labelKey: 'navBooks', badgeKey: 'badgeBooks' },
];

const TEACHER_NAV_ITEMS: NavItemConfig[] = [
  { to: '/', icon: '🏠', labelKey: 'navDashboard' },
  { to: '/translate', icon: '🎙️', labelKey: 'navVoiceTranslate', badgeKey: 'badgeVoice' },
  { to: '/worksheets', icon: '📝', labelKey: 'navWorksheets', badgeKey: 'badgeWorksheets' },
  { to: '/flashcards', icon: '🃏', labelKey: 'navFlashcards', badgeKey: 'badgeFlashcards' },
  { to: '/pronounce', icon: '🗣️', labelKey: 'navPronounce', badgeKey: 'badgeCoach' },
  { to: '/student-view', icon: '📡', labelKey: 'navStudentView', badgeKey: 'badgeLan' },
  { to: '/lessons', icon: '📚', labelKey: 'navLessons', badgeKey: 'badgeLessons' },
  { to: '/books', icon: '📖', labelKey: 'navBooks', badgeKey: 'badgeBooks' },
  { to: '/settings', icon: '⚙️', labelKey: 'navSettings', badgeKey: 'badgeSettings' },
  { to: '/report', icon: '🚩', labelKey: 'navReport', badgeKey: 'badgeReport' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  role?: 'teacher' | 'student';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { t, currentLanguageOption, openLanguageModal } = useLanguage();
  const { role, isTeacher, lockStudentMode, openTeacherPinModal } = useRole();
  const navItems = isTeacher ? TEACHER_NAV_ITEMS : STUDENT_NAV_ITEMS;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="mobile-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`app-sidebar ${isOpen ? 'mobile-open' : ''}`}
        style={{
          width: '275px',
          backgroundColor: '#0f2744',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid #1e3a5f',
          padding: '1.25rem 0.75rem',
          flexShrink: 0,
          height: '100vh',
        }}
      >
        {/* Brand Header */}
        <div>
          <div
            style={{
              padding: '0.5rem 0.75rem 1.25rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ed8936 0%, #c05621 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  boxShadow: '0 4px 10px rgba(237,137,54,0.35)',
                }}
              >
                📚
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.3px', color: '#ffffff' }}>
                  {t('appName')}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 500 }}>
                  {t('appSubtitle')}
                </div>
              </div>
            </div>

            {/* Mobile Close Button (X) */}
            <button
              onClick={onClose}
              className="mobile-close-btn"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.4rem',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  sfx.playTap();
                  if (onClose) onClose();
                }}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  backgroundColor: isActive ? 'rgba(237, 137, 54, 0.22)' : 'transparent',
                  borderLeft: isActive ? '3px solid #ed8936' : '3px solid transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  transition: 'all 0.15s ease',
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  <span>{t(item.labelKey)}</span>
                </div>
                {item.badgeKey && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#fed7aa',
                      fontWeight: 600,
                    }}
                  >
                    {t(item.badgeKey)}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Language, Role Switch & Offline Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Role Switch Action Button */}
          {isTeacher ? (
            <button
              onClick={() => {
                sfx.playTap();
                lockStudentMode();
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                borderRadius: '10px',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#fca5a5',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🔒</span>
                <span>बाल मोड चालू करें (Student Mode)</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#f87171' }}>लॉक</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sfx.playTap();
                openTeacherPinModal();
              }}
              style={{
                padding: '8px 12px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                borderRadius: '10px',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fef3c7',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🔐</span>
                <span>शिक्षक मोड (Teacher Unlock)</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>PIN</span>
            </button>
          )}

          <button
            onClick={openLanguageModal}
            style={{
              padding: '8px 12px',
              backgroundColor: 'rgba(237, 137, 54, 0.15)',
              borderRadius: '10px',
              border: '1px solid rgba(237, 137, 54, 0.4)',
              color: '#feebc8',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{currentLanguageOption.flag}</span>
              <span>{currentLanguageOption.nativeName}</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#f59e0b' }}>🌐 {t('changeLanguage')}</span>
          </button>

          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'rgba(255,255,255,0.04)',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#48bb78', boxShadow: '0 0 8px #48bb78' }} />
            <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
              <div style={{ fontWeight: 600, color: '#ffffff' }}>{t('offlineBadge')}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
