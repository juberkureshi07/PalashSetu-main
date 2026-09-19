import React, { useState, useEffect } from 'react';
import { sfx } from '../utils/sfx';
import { qrP2PService, ConnectedStudent } from '../services/qrP2PService';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'teacher' | 'student';
  userName?: string;
  userGrade?: string;
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, role, userName = 'Student', userGrade = 'Grade 1' }) => {
  const [sessionData, setSessionData] = useState<{ pin: string; qrDataUrl: string } | null>(null);
  const [connectedList, setConnectedList] = useState<ConnectedStudent[]>([]);
  const [inputPin, setInputPin] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (role === 'teacher') {
        const data = qrP2PService.startTeacherSession();
        setSessionData(data);
        setConnectedList(qrP2PService.getConnectedStudents());
      }
    }
  }, [isOpen, role]);

  useEffect(() => {
    if (isOpen && role === 'teacher') {
      const unsubscribe = qrP2PService.subscribe((students) => {
        setConnectedList(students);
      });
      return unsubscribe;
    }
  }, [isOpen, role]);

  if (!isOpen) return null;

  const handleJoinPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin.length !== 6) return;

    sfx.playSuccess();
    const success = qrP2PService.joinStudentSession(inputPin, userName, userGrade);
    if (success) {
      setJoinSuccess(true);
      setTimeout(() => {
        onClose();
        setJoinSuccess(false);
      }, 1500);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="fade-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: 'var(--card-bg, #ffffff)',
          borderRadius: '24px',
          padding: '2rem',
          color: 'var(--text-main, #0f172a)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          position: 'relative',
        }}
      >
        <button
          onClick={() => { sfx.playTap(); onClose(); }}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#64748b',
          }}
        >
          ✕
        </button>

        {role === 'teacher' ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 4px', color: '#0f172a' }}>
                📡 Classroom Session QR & PIN
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Share this 6-digit PIN or QR Code with students to pair offline.
              </p>
            </div>

            {/* Big 6-Digit PIN Card */}
            <div
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                border: '2px dashed #3b82f6',
                borderRadius: '16px',
                padding: '1rem',
                textAlign: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                6-Digit Offline Session PIN
              </div>
              <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#1e40af', letterSpacing: '6px', margin: '4px 0' }}>
                {sessionData?.pin || '849201'}
              </div>
            </div>

            {/* QR Code Graphic Container */}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <img
                src={sessionData?.qrDataUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BHASHAGYAN_SESSION'}
                alt="Classroom Session QR Code"
                style={{ width: '160px', height: '160px', borderRadius: '12px', border: '1px solid #cbd5e1' }}
              />
            </div>

            {/* Live Connected Students List */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '1rem',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                  👧 Connected Students List ({connectedList.length})
                </span>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                  🟢 Live Local LAN
                </span>
              </div>

              {connectedList.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '12px 0' }}>
                  Waiting for students to enter PIN or scan QR code...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                  {connectedList.map((st) => (
                    <div
                      key={st.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#ffffff',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div>
                        <strong>{st.name}</strong> • <span style={{ color: '#6b21a8' }}>{st.grade}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{st.connectedAt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 4px', color: '#0f172a' }}>
                👧 Connect to Teacher Class
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Enter the 6-digit PIN shown on your teacher's screen.
              </p>
            </div>

            <form onSubmit={handleJoinPin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                  placeholder="Enter 6-Digit PIN e.g. 849201"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    border: '2px solid #3b82f6',
                    fontSize: '1.8rem',
                    fontWeight: 900,
                    textAlign: 'center',
                    letterSpacing: '4px',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
                }}
              >
                🚀 Connect Now
              </button>

              {joinSuccess && (
                <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '10px', borderRadius: '10px', textAlign: 'center', fontWeight: 800 }}>
                  ✅ Connected to Teacher Session Successfully!
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRModal;
