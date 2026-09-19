import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TeacherProfile } from '../services/authService';
import { sfx } from '../utils/sfx';
import { OfflineVoiceModal } from '../components/OfflineVoiceModal';

interface DashboardProps {
  activeTeacher?: TeacherProfile | null;
}

const STUDENT_ACTIONS = [
  {
    to: '/practice',
    icon: '🎮',
    title: 'बच्चों का खेल अभ्यास',
    santali: 'ᱜᱤᱫᱽᱨᱟᱹ ᱠᱷᱮᱞᱚᱸᱰ',
    desc: 'कक्षा 1–3 के बच्चों के लिए ऑडियो और चित्रों पर आधारित शिक्षण खेल।',
    badge: 'ऑडियो खेल',
    color: '#ec4899',
  },
  {
    to: '/student-view',
    icon: '📡',
    title: 'शिक्षिका कक्षा से जुड़ें',
    santali: 'ᱥᱴᱩᱰᱮᱱᱴ ᱵᱷᱤᱭᱩ',
    desc: 'शिक्षिका के टैबलेट से 6-अंक के PIN या QR से सीधे लाइव अनुवाद प्राप्त करें।',
    badge: 'LAN P2P',
    color: '#06b6d4',
  },
  {
    to: '/flashcards',
    icon: '🃏',
    title: 'चित्र फ्लैशकार्ड',
    santali: 'ᱪᱤᱛᱟᱹᱨ ᱠᱟᱨᱰ',
    desc: '30+ 3D चित्र कार्ड: जानवर, फल, सब्जियां, और आकार।',
    badge: '30+ कार्ड',
    color: '#38a169',
  },
  {
    to: '/books',
    icon: '📖',
    title: 'JCERT द्विभाषी पुस्तकें',
    santali: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱯᱩᱛᱷᱤ',
    desc: 'राज्य प्राथमिक गणित और भाषा की पुस्तकें संताली ऑडियो के साथ।',
    badge: 'पुस्तकें',
    color: '#0d9488',
  },
  {
    to: '/lessons',
    icon: '📚',
    title: 'पाठशाला (पाठ योजना)',
    santali: 'ᱯᱟᱲᱦᱟᱣ ᱯᱚᱛᱷᱤ',
    desc: 'NIPUN भारत 5-चरणीय द्विभाषी पाठ योजना।',
    badge: 'पाठ योजना',
    color: '#3182ce',
  },
  {
    to: '/worksheets',
    icon: '📝',
    title: 'अभ्यास पत्र',
    santali: 'ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ',
    desc: 'गणित और अक्षरों के अभ्यास पत्र।',
    badge: 'प्रिंट A4',
    color: '#805ad5',
  },
  {
    to: '/contribute',
    icon: '🤝',
    title: 'सामुदायिक योगदान',
    santali: 'ᱜᱚᱲᱚ ᱥᱟᱠᱟᱢ',
    desc: 'नए संताली शब्द जोड़ें।',
    badge: 'योगदान',
    color: '#10b981',
  },
];

const TEACHER_ACTIONS = [
  {
    to: '/translate',
    icon: '🎙️',
    title: 'लाइव आवाज प्रसारण',
    santali: 'ᱥᱟᱱᱛᱟᱲᱤ ᱨᱚᱲ',
    desc: 'हिंदी और संताली (ᱚᱞ ᱪᱤᱠᱤ) का तात्कालिक ऑन-डिवाइस अनुवाद एवं कक्षा प्रसारण।',
    badge: '100% ऑफ़लाइन',
    color: '#ed8936',
  },
  {
    to: '/pronounce',
    icon: '🗣️',
    title: 'शिक्षिका उच्चारण अभ्यास',
    santali: 'ᱨᱚᱲ ᱥᱮᱪᱮᱫ',
    desc: 'शिक्षिका के आवाज की लय और स्वर का संताली उच्चारण से मिलान।',
    badge: 'उच्चारण',
    color: '#8b5cf6',
  },
  {
    to: '/student-view',
    icon: '📡',
    title: 'कक्षा छात्र मॉनिटर',
    santali: 'ᱥᱴᱩᱰᱮᱱᱴ ᱵᱷᱤᱭᱩ',
    desc: 'कक्षा के कनेक्टेड छात्रों की संख्या और PIN/QR प्रसारण स्थिति देखें।',
    badge: 'LAN P2P',
    color: '#06b6d4',
  },
  {
    to: '/contribute/review',
    icon: '🛡️',
    title: 'योगदान समीक्षा द्वार',
    santali: 'ᱜᱚᱲᱚ ᱥᱟᱠᱟᱢ ᱥᱟᱯᱲᱟᱣ',
    desc: 'सामुदायिक योगदानकर्ताओं द्वारा भेजे गए नए शब्दों को सत्यापित कर लाइव dictionary में जोड़ें।',
    badge: 'सत्यापन',
    color: '#10b981',
  },
  {
    to: '/lessons',
    icon: '📚',
    title: 'पाठशाला (पाठ योजना)',
    santali: 'ᱯᱟᱲᱦᱟᱣ ᱯᱚᱛᱷᱤ',
    desc: 'NIPUN भारत 5-चरणीय द्विभाषी पाठ योजना।',
    badge: 'पाठ योजना',
    color: '#3182ce',
  },
  {
    to: '/worksheets',
    icon: '📝',
    title: 'अभ्यास पत्र जनरेटर',
    santali: 'ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ',
    desc: 'गणित और अक्षरों के अनगिनत प्रिंट करने योग्य अभ्यास पत्र।',
    badge: 'प्रिंट A4',
    color: '#805ad5',
  },
  {
    to: '/flashcards',
    icon: '🃏',
    title: 'चित्र फ्लैशकार्ड',
    santali: 'ᱪᱤᱛᱟᱹᱨ ᱠᱟᱨᱰ',
    desc: '30+ 3D चित्र कार्ड: जानवर, फल, सब्जियां, और आकार।',
    badge: '30+ कार्ड',
    color: '#38a169',
  },
  {
    to: '/books',
    icon: '📖',
    title: 'JCERT द्विभाषी पुस्तकें',
    santali: 'ᱡᱮᱥᱤᱤᱟᱨᱴᱤ ᱯᱩᱛᱷᱤ',
    desc: 'राज्य प्राथमिक गणित और भाषा की पुस्तकें संताली ऑडियो के साथ।',
    badge: 'पुस्तकें',
    color: '#0d9488',
  },
];

const Dashboard: React.FC<DashboardProps> = ({ activeTeacher }) => {
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  // Read saved user profile from localStorage
  const savedProfileStr = localStorage.getItem('bhashagyan_user_profile');
  let userRole: 'teacher' | 'student' = 'teacher';
  let displayName = activeTeacher?.name || 'शिक्षिका';
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
              <span>{isTeacher ? '👩‍🏫 Teacher Panel (शिक्षिका कक्ष)' : '👧 Student Panel (छात्र कक्ष)'}</span>
              <span>•</span>
              <span>{district}</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 0.5rem', letterSpacing: '-0.5px' }}>
              ᱡᱚᱦᱟᱨ, {displayName}!
            </h1>
            <p style={{ color: '#e0f2fe', fontSize: '0.95rem', margin: 0, maxWidth: '600px' }}>
              <strong>{schoolName}</strong> ({district}) • {isTeacher ? `Teacher ID: ${gradeOrId}` : `Grade: ${gradeOrId}`} • 100% ऑन-डिवाइस मातृभाषा संताली (Ol Chiki • ᱚᱞ ᱪᱤᱠᱤ) मंच।
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '10px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f6ad55' }}>7,500+</div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 500 }}>संताली शब्द</div>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '10px 14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#68d391' }}>100%</div>
                <div style={{ fontSize: '0.7rem', color: '#cbd5e1', fontWeight: 500 }}>ऑफ़लाइन</div>
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
              <span>1-टैप ऑफ़लाइन आवाज सेट-अप</span>
              <span style={{ fontSize: '0.7rem', backgroundColor: '#ed8936', color: '#fff', padding: '2px 8px', borderRadius: '10px' }}>ऑफ़लाइन पैक</span>
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
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {isTeacher ? '👩‍🏫 शिक्षिका उपकरण (Teacher Classroom Tools)' : '👧 छात्र उपकरण (Student Learning Games & Tools)'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              {isTeacher ? 'लाइव प्रसारण, उच्चारण कोचिंग और शिक्षण उपकरण चुनें।' : 'खेल, फ्लैशकार्ड, पुस्तकें और लाइव कक्षा प्रसारण से जुड़ें।'}
            </p>
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

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    {action.title}
                  </h3>
                </div>
                <div style={{ fontSize: '0.9rem', color: action.color, fontWeight: 700, marginBottom: '6px' }}>
                  {action.santali}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                  {action.desc}
                </p>
              </div>

              <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700, color: action.color }}>
                <span>उपकरण खोलें</span>
                <span>→</span>
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
