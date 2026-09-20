import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TeacherProfile } from '../services/authService';
import { sfx } from '../utils/sfx';
import { OfflineVoiceModal } from '../components/OfflineVoiceModal';
import { useLanguage } from '../context/LanguageContext';
import AudioSpeakerButton from '../components/AudioSpeakerButton';

interface DashboardProps {
  activeTeacher?: TeacherProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ activeTeacher }) => {
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const { t, currentLanguageOption } = useLanguage();

  // Read saved user profile from localStorage
  const savedProfileStr = localStorage.getItem('bhashagyan_user_profile');
  let userRole: 'teacher' | 'student' = 'teacher';
  let displayName = activeTeacher?.name || t('teacherRole');
  let schoolName = 'Govt. Primary School';
  let district = activeTeacher?.district || 'झारखंड';
  let gradeOrId = activeTeacher?.assignedGrade || '';

  if (savedProfileStr) {
    try {
      const p = JSON.parse(savedProfileStr);
      userRole = p.role || 'teacher';
      displayName = p.name || displayName;
      schoolName = p.schoolName || schoolName;
      district = p.district || district;
      gradeOrId = userRole === 'student' ? (p.grade || 'Grade 1') : (p.teacherId || 'T-101');
    } catch {}
  }

  const isTeacher = userRole === 'teacher';

  const STUDENT_ACTIONS = [
    {
      to: '/translate',
      icon: '🎙️',
      title: t('dashActionVoiceTitle'),
      desc: t('dashActionVoiceDesc'),
      badge: t('badgeVoice'),
      color: '#ed8936',
    },
    {
      to: '/flashcards',
      icon: '🃏',
      title: t('dashActionCardsTitle'),
      desc: t('dashActionCardsDesc'),
      badge: t('badgeFlashcards'),
      color: '#38a169',
    },
    {
      to: '/practice',
      icon: '🎮',
      title: t('dashActionPracticeTitle'),
      desc: t('dashActionPracticeDesc'),
      badge: t('badgePractice'),
      color: '#ec4899',
    },
    {
      to: '/worksheets',
      icon: '📝',
      title: t('dashActionWorksheetsTitle'),
      desc: t('dashActionWorksheetsDesc'),
      badge: t('badgeWorksheets'),
      color: '#805ad5',
    },
    {
      to: '/books',
      icon: '📖',
      title: t('dashActionBooksTitle'),
      desc: t('dashActionBooksDesc'),
      badge: t('badgeBooks'),
      color: '#0d9488',
    },
    {
      to: '/student-view',
      icon: '📡',
      title: t('dashActionStudentViewTitle'),
      desc: t('dashActionStudentViewDesc'),
      badge: t('badgeLan'),
      color: '#06b6d4',
    },
  ];

  const TEACHER_ACTIONS = [
    {
      to: '/translate',
      icon: '🎙️',
      title: t('dashActionVoiceTitle'),
      desc: t('dashActionVoiceDesc'),
      badge: t('badgeVoice'),
      color: '#ed8936',
    },
    {
      to: '/worksheets',
      icon: '📝',
      title: t('dashActionWorksheetsTitle'),
      desc: t('dashActionWorksheetsDesc'),
      badge: t('badgeWorksheets'),
      color: '#805ad5',
    },
    {
      to: '/flashcards',
      icon: '🃏',
      title: t('dashActionCardsTitle'),
      desc: t('dashActionCardsDesc'),
      badge: t('badgeFlashcards'),
      color: '#38a169',
    },
    {
      to: '/pronounce',
      icon: '🗣️',
      title: t('dashActionPronounceTitle'),
      desc: t('dashActionPronounceDesc'),
      badge: t('badgeCoach'),
      color: '#8b5cf6',
    },
    {
      to: '/books',
      icon: '📖',
      title: t('dashActionBooksTitle'),
      desc: t('dashActionBooksDesc'),
      badge: t('badgeBooks'),
      color: '#0d9488',
    },
    {
      to: '/student-view',
      icon: '📡',
      title: t('dashActionStudentViewTitle'),
      desc: t('dashActionStudentViewDesc'),
      badge: t('badgeLan'),
      color: '#06b6d4',
    },
  ];

  const actions = isTeacher ? TEACHER_ACTIONS : STUDENT_ACTIONS;

  const handleResetProfile = () => {
    sfx.playTap();
    localStorage.removeItem('bhashagyan_user_profile');
    window.location.reload();
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Hero Banner */}
      <div
        style={{
          background: isTeacher 
            ? 'linear-gradient(135deg, #0f2744 0%, #1a365d 60%, #2b4c7e 100%)'
            : 'linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #075985 100%)',
          borderRadius: '20px',
          padding: '2.25rem 2rem',
          color: '#ffffff',
          boxShadow: '0 12px 30px -6px rgba(15, 39, 68, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, color: '#fcd34d', marginBottom: '0.75rem' }}>
              <span>{currentLanguageOption.flag} {currentLanguageOption.nativeName}</span>
              <span>•</span>
              <span>{isTeacher ? t('teacherRole') : t('studentRole')}</span>
              <span>•</span>
              <span>{district}</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.5rem', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span>{t('welcomeTitle')} {displayName}!</span>
              <AudioSpeakerButton textToSpeak={`${t('welcomeTitle')} ${displayName}`} size="lg" />
            </h1>
            <p style={{ color: '#e0f2fe', fontSize: '0.95rem', margin: 0, maxWidth: '600px' }}>
              {t('welcomeSub')}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '10px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f6ad55' }}>7,500+</div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 500 }}>{t('badgeVoice')}</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '10px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#68d391' }}>100%</div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 500 }}>{t('offlineBadge')}</div>
              </div>
            </div>

            <button
              onClick={handleResetProfile}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🔄 Switch Role ({isTeacher ? 'Switch to Student' : 'Switch to Teacher'})
            </button>
          </div>
        </div>
      </div>

      {/* Offline Setup Banner */}
      <div
        onClick={() => {
          sfx.playTap();
          setShowOfflineModal(true);
        }}
        style={{
          backgroundColor: '#fffaf0',
          border: '1px solid #feebc8',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(237,137,54,0.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#fbd38d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
            ⚡
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#9c4221', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>1-ٹैप ऑफ़लाइन आवाज सेट-अप (Offline Voice Pack)</span>
              <span style={{ fontSize: '0.7rem', backgroundColor: '#ed8936', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>{t('offlineBadge')}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#c05621', marginTop: '2px' }}>
              झारखंड के ग्रामीण स्कूलों के लिए बिना इंटरनेट माइक और आवाज़ डाउनलोड करें
            </div>
          </div>
        </div>
        <button
          style={{
            backgroundColor: '#ed8936',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 14px',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          सेट-अप करें ➔
        </button>
      </div>

      {/* Main Feature Cards Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{t('quickStart')}</span>
            </h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {actions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              onClick={() => sfx.playTap()}
              style={{
                textDecoration: 'none',
                backgroundColor: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = action.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: `${action.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                  }}
                >
                  {action.icon}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AudioSpeakerButton
                    textToSpeak={`${action.title}. ${action.desc}`}
                    size="sm"
                  />
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--surface-bg)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {action.badge}
                  </span>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>
                  {action.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                  {action.desc}
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 800, color: action.color }}>
                <span>{t('btnPlay')}</span>
                <span>➔</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <OfflineVoiceModal
        isOpen={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
      />
    </div>
  );
};

export default Dashboard;
