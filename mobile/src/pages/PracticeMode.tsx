import React, { useState } from 'react';
import { playSantaliTTS } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';

// Game 1: Ol Chiki Script & Sound Matching Data
interface OlChikiGameItem {
  character: string;
  nameHi: string;
  phoneticHi: string;
  options: { id: string; label: string; icon: string; audioText: string; isCorrect: boolean }[];
}

const OL_CHIKI_GAMES: OlChikiGameItem[] = [
  {
    character: 'ᱚ',
    nameHi: 'ओ (LAAD)',
    phoneticHi: 'ओ',
    options: [
      { id: '1', label: 'ओ', icon: '🔊', audioText: 'ᱚ', isCorrect: true },
      { id: '2', label: 'आ', icon: '🎵', audioText: 'ᱟ', isCorrect: false },
      { id: '3', label: 'इ', icon: '🔔', audioText: 'ᱤ', isCorrect: false },
    ],
  },
  {
    character: 'ᱟ',
    nameHi: 'आ (AAK)',
    phoneticHi: 'आ',
    options: [
      { id: '1', label: 'उ', icon: '🔔', audioText: 'ᱩ', isCorrect: false },
      { id: '2', label: 'आ', icon: '🔊', audioText: 'ᱟ', isCorrect: true },
      { id: '3', label: 'ए', icon: '🎵', audioText: 'ᱮ', isCorrect: false },
    ],
  },
  {
    character: 'ᱤ',
    nameHi: 'इ (IS)',
    phoneticHi: 'इ',
    options: [
      { id: '1', label: 'ओ', icon: '🎵', audioText: 'ᱚ', isCorrect: false },
      { id: '2', label: 'ओ', icon: '🔔', audioText: 'ᱳ', isCorrect: false },
      { id: '3', label: 'इ', icon: '🔊', audioText: 'ᱤ', isCorrect: true },
    ],
  },
  {
    character: 'ᱩ',
    nameHi: 'उ (UCCH)',
    phoneticHi: 'उ',
    options: [
      { id: '1', label: 'उ', icon: '🔊', audioText: 'ᱩ', isCorrect: true },
      { id: '2', label: 'आ', icon: '🎵', audioText: 'ᱟ', isCorrect: false },
      { id: '3', label: 'इ', icon: '🔔', audioText: 'ᱤ', isCorrect: false },
    ],
  },
];

// Game 2: Picture-Word Audio Matching Data
interface PictureWordItem {
  id: string;
  wordSantali: string;
  wordHi: string;
  correctIcon: string;
  correctName: string;
  options: { icon: string; nameHi: string; isCorrect: boolean }[];
}

const PICTURE_WORD_GAMES: PictureWordItem[] = [
  {
    id: 'apple',
    wordSantali: 'ᱥᱮᱣ',
    wordHi: 'सेब (Apple)',
    correctIcon: '🍎',
    correctName: 'सेब',
    options: [
      { icon: '🍎', nameHi: 'सेब', isCorrect: true },
      { icon: '🐘', nameHi: 'हाथी', isCorrect: false },
      { icon: '📖', nameHi: 'किताब', isCorrect: false },
      { icon: '🚗', nameHi: 'गाड़ी', isCorrect: false },
    ],
  },
  {
    id: 'book',
    wordSantali: 'ᱯᱩᱛᱷᱤ',
    wordHi: 'किताब (Book)',
    correctIcon: '📖',
    correctName: 'किताब',
    options: [
      { icon: '🐱', nameHi: 'बिल्ली', isCorrect: false },
      { icon: '📖', nameHi: 'किताब', isCorrect: true },
      { icon: '🍌', nameHi: 'केला', isCorrect: false },
      { icon: '🖊️', nameHi: 'कलम', isCorrect: false },
    ],
  },
  {
    id: 'tree',
    wordSantali: 'ᱫᱟᱨᱮ',
    wordHi: 'पेड़ (Tree)',
    correctIcon: '🌳',
    correctName: 'पेड़',
    options: [
      { icon: '☀️', nameHi: 'सूरज', isCorrect: false },
      { icon: '🐶', nameHi: 'कुत्ता', isCorrect: false },
      { icon: '🌳', nameHi: 'पेड़', isCorrect: true },
      { icon: '🏠', nameHi: 'घर', isCorrect: false },
    ],
  },
  {
    id: 'water',
    wordSantali: 'ᱫᱟᱜ',
    wordHi: 'पानी (Water)',
    correctIcon: '💧',
    correctName: 'पानी',
    options: [
      { icon: '💧', nameHi: 'पानी', isCorrect: true },
      { icon: '🔥', nameHi: 'आग', isCorrect: false },
      { icon: '🌙', nameHi: 'चाँद', isCorrect: false },
      { icon: '🌸', nameHi: 'फूल', isCorrect: false },
    ],
  },
];

// Game 3: FLN Counting Data (1 to 10)
interface CountingItem {
  num: number;
  olChiki: string;
  santaliText: string;
  hindiText: string;
  items: string; // Emoji
}

const COUNTING_ITEMS: CountingItem[] = [
  { num: 1, olChiki: '᱑', santaliText: 'ᱢᱤᱫ', hindiText: 'एक', items: '🍎' },
  { num: 2, olChiki: '᱒', santaliText: 'ᱵᱟᱨ', hindiText: 'दो', items: '⭐' },
  { num: 3, olChiki: '᱓', santaliText: 'ᱯᱮ', hindiText: 'तीन', items: '🎈' },
  { num: 4, olChiki: '᱔', santaliText: 'ᱯᱩᱱ', hindiText: 'चार', items: '🌸' },
  { num: 5, olChiki: '᱕', santaliText: 'ᱢᱚᱬᱮ', hindiText: 'पाँच', items: '🦋' },
  { num: 6, olChiki: '᱖', santaliText: 'ᱛᱩᱨᱩᱭ', hindiText: 'छह', items: '🐥' },
  { num: 7, olChiki: '᱗', santaliText: 'ᱮᱭᱟᱭ', hindiText: 'सात', items: '🍓' },
  { num: 8, olChiki: '᱘', santaliText: 'ᱤᱨᱟᱹᱞ', hindiText: 'आठ', items: '🚗' },
  { num: 9, olChiki: '᱙', santaliText: 'ᱟᱨᱮ', hindiText: 'नौ', items: '🎁' },
  { num: 10, olChiki: '᱑᱐', santaliText: 'ᱜᱮᱞ', hindiText: 'दस', items: '🌟' },
];

export const PracticeMode: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'script' | 'picture' | 'counting'>('script');

  // Personal Progress & Streak (No comparative leaderboards)
  const [personalStreak, setPersonalStreak] = useState<number>(0);
  const [totalStars, setTotalStars] = useState<number>(0);

  // Script Game State
  const [scriptIndex, setScriptIndex] = useState(0);
  const [scriptFeedback, setScriptFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Picture Game State
  const [pictureIndex, setPictureIndex] = useState(0);
  const [pictureFeedback, setPictureFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Counting Game State
  const [countIndex, setCountIndex] = useState(0);
  const [tappedCount, setTappedCount] = useState(0);

  const currentScriptGame = OL_CHIKI_GAMES[scriptIndex];
  const currentPictureGame = PICTURE_WORD_GAMES[pictureIndex];
  const currentCountingGame = COUNTING_ITEMS[countIndex];

  // Play audio for script item
  const handlePlayScriptSound = (text: string) => {
    playSantaliTTS(text, 0.8);
  };

  const handleScriptChoice = (isCorrect: boolean, audioText: string) => {
    playSantaliTTS(audioText, 0.85);
    if (isCorrect) {
      sfx.playSuccess();
      setScriptFeedback('correct');
      setPersonalStreak((prev) => prev + 1);
      setTotalStars((prev) => prev + 1);
      setTimeout(() => {
        setScriptFeedback(null);
        setScriptIndex((prev) => (prev + 1) % OL_CHIKI_GAMES.length);
      }, 1200);
    } else {
      sfx.playTap();
      setScriptFeedback('wrong');
      setTimeout(() => setScriptFeedback(null), 1000);
    }
  };

  const handlePictureChoice = (isCorrect: boolean) => {
    if (isCorrect) {
      playSantaliTTS(currentPictureGame.wordSantali, 0.85);
      sfx.playSuccess();
      setPictureFeedback('correct');
      setPersonalStreak((prev) => prev + 1);
      setTotalStars((prev) => prev + 1);
      setTimeout(() => {
        setPictureFeedback(null);
        setPictureIndex((prev) => (prev + 1) % PICTURE_WORD_GAMES.length);
      }, 1200);
    } else {
      sfx.playTap();
      setPictureFeedback('wrong');
      setTimeout(() => setPictureFeedback(null), 1000);
    }
  };

  const handleTapCountItem = () => {
    sfx.playTap();
    const nextTap = tappedCount + 1;
    setTappedCount(nextTap);
    if (nextTap === currentCountingGame.num) {
      playSantaliTTS(currentCountingGame.santaliText, 0.8);
      sfx.playSuccess();
      setPersonalStreak((prev) => prev + 1);
      setTotalStars((prev) => prev + 1);
      setTimeout(() => {
        setTappedCount(0);
        setCountIndex((prev) => (prev + 1) % COUNTING_ITEMS.length);
      }, 1400);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Top Banner: Non-competitive personal growth indicators */}
      <div
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
          borderRadius: '20px',
          padding: '1.5rem',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 25px -5px rgba(236,72,153,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.8rem' }}>
            🎮
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
              ᱜᱤᱫᱽᱨᱟᱹ ᱠᱷᱮᱞᱚᱸᱰ (Kid Practice Hub)
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
              FLN Audio-First Learning for Grade 1–3 • Ol Chiki & Santali
            </p>
          </div>
        </div>

        {/* Personal Streak Badge (Non-competitive) */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px 14px', borderRadius: '14px', textAlign: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>🔥 {personalStreak}</span>
            <div style={{ fontSize: '0.68rem', fontWeight: 600 }}>My Streak</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px 14px', borderRadius: '14px', textAlign: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>⭐ {totalStars}</span>
            <div style={{ fontSize: '0.68rem', fontWeight: 600 }}>My Stars</div>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs (Large Icon Buttons for easy touch) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <button
          onClick={() => { sfx.playTap(); setActiveTab('script'); }}
          style={{
            padding: '14px',
            borderRadius: '16px',
            border: activeTab === 'script' ? '3px solid #ec4899' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'script' ? 'rgba(236,72,153,0.1)' : 'var(--card-bg)',
            color: activeTab === 'script' ? '#ec4899' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>🔤</span>
          <span>1. Ol Chiki Sound</span>
        </button>

        <button
          onClick={() => { sfx.playTap(); setActiveTab('picture'); }}
          style={{
            padding: '14px',
            borderRadius: '16px',
            border: activeTab === 'picture' ? '3px solid #ec4899' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'picture' ? 'rgba(236,72,153,0.1)' : 'var(--card-bg)',
            color: activeTab === 'picture' ? '#ec4899' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>🖼️</span>
          <span>2. Picture Matching</span>
        </button>

        <button
          onClick={() => { sfx.playTap(); setActiveTab('counting'); }}
          style={{
            padding: '14px',
            borderRadius: '16px',
            border: activeTab === 'counting' ? '3px solid #ec4899' : '1px solid var(--border-subtle)',
            backgroundColor: activeTab === 'counting' ? 'rgba(236,72,153,0.1)' : 'var(--card-bg)',
            color: activeTab === 'counting' ? '#ec4899' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>🔢</span>
          <span>3. FLN Counting</span>
        </button>
      </div>

      {/* GAME AREA */}

      {/* GAME 1: Ol Chiki Letter & Sound Matching */}
      {activeTab === 'script' && (
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Tap the big letter to hear it, then tap the matching sound below!
          </div>

          {/* Big Ol Chiki Letter Card */}
          <button
            onClick={() => handlePlayScriptSound(currentScriptGame.character)}
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%)',
              color: '#f6ad55',
              fontSize: '4.5rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid #ed8936',
              boxShadow: '0 12px 25px rgba(237,137,54,0.3)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            {currentScriptGame.character}
          </button>
          
          <button
            onClick={() => handlePlayScriptSound(currentScriptGame.character)}
            style={{
              backgroundColor: '#edf2f7',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#2d3748',
              cursor: 'pointer',
            }}
          >
            🔊 Tap to Listen ({currentScriptGame.nameHi})
          </button>

          {/* Options Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%', maxWidth: '500px' }}>
            {currentScriptGame.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleScriptChoice(opt.isCorrect, opt.audioText)}
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  backgroundColor: 'var(--surface-bg)',
                  border: '2px solid var(--border-subtle)',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{opt.icon}</span>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Feedback popup */}
          {scriptFeedback === 'correct' && (
            <div className="fade-in" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38a169' }}>
              🌟 ᱟᱹᱰᱤ ᱱᱟᱯᱟᱭ! Great Job! 🌟
            </div>
          )}
          {scriptFeedback === 'wrong' && (
            <div className="fade-in" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e53e3e' }}>
              Try again! Tap the top letter for a hint!
            </div>
          )}
        </div>
      )}

      {/* GAME 2: Picture-Word Audio Matching */}
      {activeTab === 'picture' && (
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Listen to the Santali word, then tap the matching picture!
          </div>

          {/* Audio Speaker Trigger */}
          <button
            onClick={() => playSantaliTTS(currentPictureGame.wordSantali, 0.8)}
            style={{
              padding: '1rem 2rem',
              borderRadius: '20px',
              backgroundColor: '#ec4899',
              color: '#ffffff',
              border: 'none',
              fontSize: '1.4rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 20px rgba(236,72,153,0.35)',
            }}
          >
            <span>🔊</span>
            <span>{currentPictureGame.wordSantali} ({currentPictureGame.wordHi})</span>
          </button>

          {/* Picture Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', width: '100%', maxWidth: '450px' }}>
            {currentPictureGame.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handlePictureChoice(opt.isCorrect)}
                style={{
                  padding: '1.5rem',
                  borderRadius: '20px',
                  backgroundColor: 'var(--surface-bg)',
                  border: '2px solid var(--border-subtle)',
                  fontSize: '3.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <span>{opt.icon}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{opt.nameHi}</span>
              </button>
            ))}
          </div>

          {pictureFeedback === 'correct' && (
            <div className="fade-in" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38a169' }}>
              🎉 ᱥᱟᱹᱨᱤ ᱜᱮᱭᱟ! Perfect Match! 🎉
            </div>
          )}
          {pictureFeedback === 'wrong' && (
            <div className="fade-in" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e53e3e' }}>
              Listen again! Tap the audio button above!
            </div>
          )}
        </div>
      )}

      {/* GAME 3: FLN Counting Practice */}
      {activeTab === 'counting' && (
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Tap each item one by one to count to {currentCountingGame.num} in Santali!
          </div>

          {/* Number & Santali Word Banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '18px',
                backgroundColor: '#3182ce',
                color: '#ffffff',
                fontSize: '2.5rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {currentCountingGame.olChiki}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3182ce' }}>
                {currentCountingGame.santaliText} ({currentCountingGame.hindiText})
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Progress: {tappedCount} / {currentCountingGame.num} tapped
              </div>
            </div>
          </div>

          {/* Items to tap */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', maxWidth: '500px', minHeight: '120px', alignItems: 'center' }}>
            {Array.from({ length: currentCountingGame.num }).map((_, idx) => (
              <button
                key={idx}
                onClick={handleTapCountItem}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: idx < tappedCount ? '#c6f6d5' : 'var(--surface-bg)',
                  border: idx < tappedCount ? '3px solid #38a169' : '2px dashed var(--border-subtle)',
                  fontSize: '2.2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  transform: idx < tappedCount ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {currentCountingGame.items}
              </button>
            ))}
          </div>

          {tappedCount === currentCountingGame.num && (
            <div className="fade-in" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38a169' }}>
              ✨ ᱞᱮᱠᱷᱟ ᱯᱩᱨᱟᱹᱣᱮᱱᱟ! Count Complete! ✨
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeMode;
