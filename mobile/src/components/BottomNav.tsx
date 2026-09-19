import React from 'react';
import { NavLink } from 'react-router-dom';
import { sfx } from '../utils/sfx';

export const BottomNav: React.FC = () => {
  const tabs = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/practice', label: 'Practice', icon: '🎮' },
    { to: '/translate', label: 'Class Sync', icon: '📡' },
    { to: '/dictionary', label: 'Dict', icon: '📖' },
    { to: '/govt-portal', label: 'Govt Portal', icon: '🏛️' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'var(--card-bg, #ffffff)',
        borderTop: '1px solid var(--border-subtle, #e2e8f0)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 0',
        zIndex: 9990,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
      }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          onClick={() => sfx.playTap()}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            textDecoration: 'none',
            color: isActive ? '#3b82f6' : 'var(--text-muted, #64748b)',
            fontWeight: isActive ? 800 : 600,
            fontSize: '0.72rem',
            padding: '4px 12px',
            borderRadius: '12px',
            backgroundColor: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
            transition: 'all 0.2s ease',
          })}
        >
          <span style={{ fontSize: '1.25rem' }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;
