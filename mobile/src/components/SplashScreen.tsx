import React, { useEffect, useState } from 'react';
import { sfx } from '../utils/sfx';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Play welcoming sound effect
    sfx.playSuccess();

    // Auto finish after 2.8 seconds
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(onFinish, 600);
    }, 2800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311b92 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        opacity: fadingOut ? 0 : 1,
        transition: 'opacity 0.6s ease-in-out',
        userSelect: 'none',
      }}
    >
      {/* Floating Animated Background Stars */}
      <div style={{ position: 'absolute', top: '15%', left: '10%', fontSize: '2rem', animation: 'bounce 2s infinite' }}>⭐</div>
      <div style={{ position: 'absolute', top: '25%', right: '12%', fontSize: '2.5rem', animation: 'bounce 2.5s infinite 0.5s' }}>✨</div>
      <div style={{ position: 'absolute', bottom: '20%', left: '15%', fontSize: '1.8rem', animation: 'bounce 1.8s infinite 0.2s' }}>🌟</div>
      <div style={{ position: 'absolute', bottom: '25%', right: '10%', fontSize: '2.2rem', animation: 'bounce 2.2s infinite 0.7s' }}>🎉</div>

      {/* Main Mascot Card */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          transform: fadingOut ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.6s ease',
        }}
      >
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '32px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4.5rem',
            boxShadow: '0 20px 40px rgba(245, 158, 11, 0.4)',
            border: '4px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          📚
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '2.8rem',
              fontWeight: 900,
              margin: 0,
              background: 'linear-gradient(90deg, #fbbf24, #f43f5e, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px',
            }}
          >
            BHASHA GYAN
          </h1>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fcd34d', marginTop: '4px' }}>
            भाषा ज्ञान • ᱥᱟᱱᱛᱟᱲᱤ ᱚᱞ ᱪᱤᱠᱤ
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '0.95rem', color: '#94a3b8', fontWeight: 600 }}>
            Offline Primary School Education Portal
          </p>
        </div>
      </div>

      {/* Loading Pulse Dots */}
      <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b', animation: 'pulse 1s infinite' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ec4899', animation: 'pulse 1s infinite 0.2s' }} />
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3b82f6', animation: 'pulse 1s infinite 0.4s' }} />
      </div>
    </div>
  );
};

export default SplashScreen;
