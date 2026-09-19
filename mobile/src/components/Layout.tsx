import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { QRModal } from './QRModal';
import { CustomModelLoaderModal } from './CustomModelLoaderModal';
import { TeacherProfile } from '../services/authService';
import { sfx } from '../utils/sfx';

interface LayoutProps {
  activeTeacher?: TeacherProfile | null;
  onSwitchTeacher?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ activeTeacher, onSwitchTeacher }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCustomModelModal, setShowCustomModelModal] = useState(false);

  // Check user role from LocalStorage profile
  const profileSaved = localStorage.getItem('bhashagyan_user_profile');
  let userRole: 'teacher' | 'student' = 'teacher';
  let userName = activeTeacher?.name || 'User';
  let userGrade = 'Grade 1';

  if (profileSaved) {
    try {
      const p = JSON.parse(profileSaved);
      userRole = p.role || 'teacher';
      userName = p.name || userName;
      userGrade = p.grade || userGrade;
    } catch {}
  }

  return (
    <div className="app-container" style={{ paddingBottom: '70px' }}>
      {/* Sidebar with slide-out mobile drawer */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="main-content">
        <Header
          isOnline={true}
          activeTeacher={activeTeacher}
          onSwitchTeacher={onSwitchTeacher}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Global Toolbar Bar: Quick Action Buttons for QR PIN & Custom AI Model Engine */}
        <div
          style={{
            backgroundColor: 'var(--surface-bg, rgba(59, 130, 246, 0.08))',
            borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
            padding: '8px 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>👤 {userName}</span>
            <span style={{ backgroundColor: userRole === 'teacher' ? '#8b5cf6' : '#3b82f6', color: '#fff', padding: '2px 8px', borderRadius: '8px', fontSize: '0.72rem' }}>
              {userRole === 'teacher' ? '👨‍🏫 Teacher' : '👧 Student (' + userGrade + ')'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { sfx.playTap(); setShowQRModal(true); }}
              style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>📡 LAN QR / PIN</span>
            </button>

            <button
              onClick={() => { sfx.playTap(); setShowCustomModelModal(true); }}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>🧠 Custom AI Model Engine</span>
            </button>
          </div>
        </div>

        <div className="content-area">
          <Outlet />
        </div>

        {/* Native Mobile Sticky Bottom Tab Bar */}
        <BottomNav />
      </div>

      {/* QR Code & 6-Digit PIN Pairing Modal */}
      <QRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        role={userRole}
        userName={userName}
        userGrade={userGrade}
      />

      {/* Custom AI Model Loader & Inference Modal */}
      <CustomModelLoaderModal
        isOpen={showCustomModelModal}
        onClose={() => setShowCustomModelModal(false)}
      />
    </div>
  );
};

export default Layout;
