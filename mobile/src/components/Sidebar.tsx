import React from 'react';
import { NavLink } from 'react-router-dom';
import { sfx } from '../utils/sfx';

interface NavItemConfig {
  to: string;
  icon: string;
  label: string;
  badge?: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { to: '/', icon: '🏠', label: 'मुख्य पृष्ठ (Dashboard)' },
  { to: '/translate', icon: '🎙️', label: 'लाइव अनुवाद (ᱥᱟᱱᱛᱟᱲᱤ ᱨᱚᱲ)', badge: '< 1ms' },
  { to: '/practice', icon: '🎮', label: 'बच्चों का खेल (ᱜᱤᱫᱽᱨᱟᱹ ᱠᱷᱮᱞᱚᱸᱰ)', badge: 'खेल' },
  { to: '/pronounce', icon: '🗣️', label: 'उच्चारण अभ्यास (ᱨᱚᱲ ᱥᱮᱪᱮᱫ)', badge: 'आवाज़' },
  { to: '/govt-portal', icon: '🏛️', label: 'सरकारी पोर्टल (Govt Portal)', badge: 'Supabase' },
  { to: '/contribute', icon: '🤝', label: 'सामुदायिक योगदान (ᱜᱚᱲᱚ)', badge: 'योगदान' },
  { to: '/student-view', icon: '📡', label: 'छात्र प्राप्तकर्ता (ᱥᱴᱩᱰᱮᱱᱴ)', badge: 'LAN P2P' },
  { to: '/flashcards', icon: '🃏', label: 'चित्र कार्ड (ᱪᱤᱛᱟᱹᱨ ᱠᱟᱨᱰ)', badge: '30+ कार्ड' },
  { to: '/lessons', icon: '📚', label: 'पाठशाला (ᱯᱟᱲᱦᱟᱣ ᱯᱚᱛᱷᱤ)', badge: 'NIPUN' },
  { to: '/worksheets', icon: '📝', label: 'अभ्यास पत्र (ᱠᱟᱹᱢᱤ ᱥᱟᱠᱟᱢ)', badge: 'प्रिंट' },
  { to: '/books', icon: '📖', label: 'पाठ्य पुस्तक (ᱡᱮᱥᱤᱤᱟᱨᱴᱤ)', badge: 'द्विभाषी' },
  { to: '/settings', icon: '⚙️', label: 'सेटिंग्स (ᱥᱮᱴᱤᱝᱥ)' },
  { to: '/report', icon: '🚩', label: 'रिपोर्ट / प्रतिक्रिया', badge: 'ऑफ़लाइन' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
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
                  Bhasha Gyan
                </div>
                <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 500 }}>
                  भाषा ज्ञान • ᱥᱟᱱᱛᱟᱲᱤ ᱚᱞ ᱪᱤᱠᱤ
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
            {NAV_ITEMS.map((item) => (
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
                  <span>{item.label}</span>
                </div>
                {item.badge && (
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
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Offline Badge */}
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#48bb78', boxShadow: '0 0 8px #48bb78' }} />
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
            <div style={{ fontWeight: 600, color: '#ffffff' }}>100% बिना इंटरनेट (Offline)</div>
            <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>संताली (Ol Chiki • ᱚᱞ ᱪᱤᱠᱤ)</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
