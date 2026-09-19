import React, { useState, useEffect } from 'react';
import { broadcastService, BroadcastCaptionEvent } from '../services/broadcastService';
import { speakText as playSantaliTTS } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';

export const StudentBroadcastView: React.FC = () => {
  const [currentCaption, setCurrentCaption] = useState<BroadcastCaptionEvent | null>(null);
  const [history, setHistory] = useState<BroadcastCaptionEvent[]>([]);
  const [isAudioAutoPlay, setIsAudioAutoPlay] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = broadcastService.subscribe((event) => {
      setCurrentCaption(event);
      setHistory((prev) => [event, ...prev.slice(0, 15)]);

      if (isAudioAutoPlay && event.targetSantaliOlChiki) {
        playSantaliTTS(event.targetSantaliOlChiki, { rate: 0.85 });
      }
    });

    return () => unsubscribe();
  }, [isAudioAutoPlay]);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          borderRadius: '20px',
          padding: '1.75rem',
          color: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(6,182,212,0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
            📡
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
              Student Classroom Receiver (ᱥᱴᱩᱰᱮᱱᱴ ᱵᱷᱤᱭᱩ)
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
              Live real-time captions broadcasted from the teacher's tablet over classroom LAN.
            </p>
          </div>
        </div>

        {/* Auto Play Toggle */}
        <button
          onClick={() => { sfx.playTap(); setIsAudioAutoPlay(!isAudioAutoPlay); }}
          style={{
            backgroundColor: isAudioAutoPlay ? '#ffffff' : 'rgba(255,255,255,0.2)',
            color: isAudioAutoPlay ? '#0891b2' : '#ffffff',
            border: 'none',
            padding: '8px 14px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{isAudioAutoPlay ? '🔊 Auto Audio ON' : '🔇 Auto Audio OFF'}</span>
        </button>
      </div>

      {/* Main High-Contrast Active Caption Container */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: '24px',
          padding: '2.5rem',
          border: '2px solid #06b6d4',
          boxShadow: '0 12px 30px rgba(6,182,212,0.15)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          minHeight: '260px',
          justifyContent: 'center',
        }}
      >
        {currentCaption ? (
          <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <div style={{ fontSize: '0.85rem', color: '#0891b2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              📡 Live Teacher Caption from {currentCaption.teacherName}
            </div>

            {/* Giant Ol Chiki Script */}
            <div
              style={{
                fontSize: '3.5rem',
                fontWeight: 800,
                color: '#0891b2',
                letterSpacing: '1px',
                lineHeight: 1.2,
              }}
            >
              {currentCaption.targetSantaliOlChiki}
            </div>

            {/* Phonetic Devanagari & Original Hindi */}
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>
              "{currentCaption.targetSantaliPhoneticHi}"
            </div>
            <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Hindi Meaning: {currentCaption.sourceHindi}
            </div>

            {/* Manual Play Audio Button */}
            <button
              onClick={() => playSantaliTTS(currentCaption.targetSantaliOlChiki, { rate: 0.85 })}
              style={{
                alignSelf: 'center',
                backgroundColor: '#06b6d4',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '0.5rem',
                boxShadow: '0 4px 12px rgba(6,182,212,0.3)',
              }}
            >
              <span>🔊 Tap to Hear Santali Pronunciation</span>
            </button>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📡</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Waiting for Live Teacher Broadcast...
            </div>
            <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>
              Ensure teacher tablet has "Start Classroom Broadcast" enabled in Live Voice.
            </div>
          </div>
        )}
      </div>

      {/* Caption History */}
      {history.length > 0 && (
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            📜 Recent Session Captions History
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {history.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0891b2' }}>
                    {item.targetSantaliOlChiki}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    {item.targetSantaliPhoneticHi} — ({item.sourceHindi})
                  </div>
                </div>

                <button
                  onClick={() => playSantaliTTS(item.targetSantaliOlChiki, { rate: 0.85 })}
                  style={{
                    backgroundColor: 'var(--surface-bg)',
                    border: '1px solid var(--border-subtle)',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🔊 Listen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentBroadcastView;
