import React, { useState } from 'react';
import { speakText } from '../utils/santaliSpeech';
import { sfx } from '../utils/sfx';

interface AudioSpeakerButtonProps {
  textToSpeak: string;
  lang?: string;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  style?: React.CSSProperties;
}

export const AudioSpeakerButton: React.FC<AudioSpeakerButtonProps> = ({
  textToSpeak,
  lang,
  size = 'md',
  title = '🔊 Listen out loud',
  style,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    sfx.playTap();
    setIsPlaying(true);
    speakText(textToSpeak, {
      lang,
      rate: 0.85,
      onEnd: () => setIsPlaying(false),
    });
    // Safety reset timer in case onEnd doesn't fire
    setTimeout(() => setIsPlaying(false), 2500);
  };

  const dimensions = size === 'sm' ? '28px' : size === 'lg' ? '44px' : '36px';
  const fontSize = size === 'sm' ? '0.85rem' : size === 'lg' ? '1.3rem' : '1.05rem';

  return (
    <button
      onClick={handlePlay}
      title={title}
      style={{
        width: dimensions,
        height: dimensions,
        borderRadius: '50%',
        border: '1px solid #ed8936',
        backgroundColor: isPlaying ? '#feebc8' : '#fffaf0',
        color: '#dd6b20',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        cursor: 'pointer',
        boxShadow: isPlaying ? '0 0 8px rgba(237,137,54,0.6)' : '0 1px 3px rgba(0,0,0,0.1)',
        transform: isPlaying ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.15s ease-in-out',
        flexShrink: 0,
        ...style,
      }}
    >
      {isPlaying ? '🔊' : '🔈'}
    </button>
  );
};

export default AudioSpeakerButton;
