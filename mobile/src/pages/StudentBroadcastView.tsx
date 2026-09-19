import React, { useState, useEffect } from 'react';
import { broadcastService, BroadcastCaptionEvent } from '../services/broadcastService';
import { webrtcP2PService } from '../services/webrtcP2PService';
import { speakText as playSantaliTTS } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';

export const StudentBroadcastView: React.FC = () => {
  const [currentCaption, setCurrentCaption] = useState<BroadcastCaptionEvent | null>(null);
  const [history, setHistory] = useState<BroadcastCaptionEvent[]>([]);
  const [isAudioAutoPlay, setIsAudioAutoPlay] = useState<boolean>(true);

  // Connection State
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<{ state: string; peerCount: number; sessionCode: string }>({
    state: 'disconnected',
    peerCount: 0,
    sessionCode: '',
  });

  useEffect(() => {
    // 1. Subscribe to WebRTC P2P status updates
    const unsubscribeStatus = broadcastService.onStatusChanged((status) => {
      setConnectionStatus(status);
    });

    // 2. Subscribe to incoming captions over WebRTC DataChannel
    const unsubscribeCaption = broadcastService.subscribe((event) => {
      setCurrentCaption(event);
      setHistory((prev) => [event, ...prev.slice(0, 15)]);

      if (isAudioAutoPlay && event.targetSantaliOlChiki) {
        playSantaliTTS(event.targetSantaliOlChiki, { rate: 0.85 });
      }
    });

    // 3. Auto-load latest broadcast if present locally
    const saved = localStorage.getItem('bhashagyan_latest_lan_caption');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentCaption(parsed);
      } catch (e) {
        console.error('Failed to parse saved caption', e);
      }
    }

    return () => {
      unsubscribeStatus();
      unsubscribeCaption();
    };
  }, [isAudioAutoPlay]);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    sfx.playTap();
    const success = webrtcP2PService.joinSession(joinCodeInput.trim());
    if (success) {
      sfx.playSuccess();
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Localized Header Banner: Hindi + Santali */}
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
              छात्र प्राप्तकर्ता (ᱥᱴᱩᱰᱮᱱᱴ ᱵᱷᱤᱭᱩ)
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
              शिक्षिका के टैबलेट से लाइव अनुवाद प्राप्त करें (LAN P2P direct sync)
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
          <span>{isAudioAutoPlay ? '🔊 स्वचालित आवाज़ चालू (ON)' : '🔇 आवाज़ बंद (OFF)'}</span>
        </button>
      </div>

      {/* Pairing & Network Connection Box */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Status Indicator Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: connectionStatus.state === 'connected' ? '#10b981' : connectionStatus.state === 'connecting' ? '#f59e0b' : '#ef4444',
              boxShadow: connectionStatus.state === 'connected' ? '0 0 10px #10b981' : 'none',
            }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              {connectionStatus.state === 'connected'
                ? `🟢 जुड़ा हुआ है (P2P connected)`
                : connectionStatus.state === 'connecting'
                ? `🟡 जुड़ रहा है... (Connecting)`
                : `🔴 डिस्कनेक्टेड (Disconnected)`}
            </div>
            {connectionStatus.sessionCode && (
              <div style={{ fontSize: '0.8rem', color: '#0891b2', fontWeight: 700 }}>
                कक्षा कोड (Class Code): {connectionStatus.sessionCode}
              </div>
            )}
          </div>
        </div>

        {/* Enter Code Form */}
        <form onSubmit={handleConnect} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="6-अंक का कोड दर्ज करें"
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--surface-bg)',
              color: 'var(--text-main)',
              fontSize: '0.95rem',
              fontWeight: 700,
              width: '180px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#06b6d4',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            🔗 जोड़ें (Pair)
          </button>
        </form>
      </div>

      {/* Main High-Contrast Active Caption Display */}
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
              📡 शिक्षिका का सीधा प्रसारण (Live Teacher Caption)
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
              हिंदी अर्थ: {currentCaption.sourceHindi}
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
              <span>🔊 संताली उच्चारण सुनें (Listen)</span>
            </button>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📡</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              शिक्षिका के प्रसारण की प्रतीक्षा कर रहे हैं...
            </div>
            <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>
              शिक्षिका के टैबलेट पर "LAN प्रसारण चालू करें" दबाएं और ऊपर दिया गया 6-अंक का कोड दर्ज करें।
            </div>
          </div>
        )}
      </div>

      {/* Caption History */}
      {history.length > 0 && (
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            📜 पिछला सत्र इतिहास (Recent Captions)
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
                  🔊 सुनें
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
