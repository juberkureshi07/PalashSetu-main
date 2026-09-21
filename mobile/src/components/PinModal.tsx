import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { useTheme } from '../context/ThemeContext';
import { sfx } from '../utils/sfx';

interface PinModalProps {
  onSuccess?: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ onSuccess }) => {
  const { isPinModalOpen, closePinModal, verifyAndUnlockTeacher, pendingPath } = useRole();
  const { isDarkMode } = useTheme();

  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isPinModalOpen) return null;

  const handleKeyPress = (num: string) => {
    sfx.playTap();
    if (pin.length < 4) {
      setErrorMsg(null);
      setPin((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    sfx.playTap();
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const handleClear = () => {
    sfx.playTap();
    setPin('');
    setErrorMsg(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin.length !== 4 || isSubmitting) return;

    setIsSubmitting(true);
    const success = await verifyAndUnlockTeacher(pin);
    setIsSubmitting(false);

    if (success) {
      sfx.playSuccess();
      setPin('');
      setErrorMsg(null);
      if (onSuccess) onSuccess();
    } else {
      sfx.playError();
      setErrorMsg('गलत पिन! सही शिक्षक PIN दर्ज करें। (Default: 1234)');
      setPin('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          color: isDarkMode ? '#f8fafc' : '#0f2744',
          borderRadius: '20px',
          padding: '2rem',
          maxWidth: '380px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
          textAlign: 'center',
        }}
      >
        {/* Header Icon */}
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(237, 137, 54, 0.15)',
            color: '#ed8936',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            margin: '0 auto 1rem',
          }}
        >
          🔐
        </div>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          शिक्षक एक्सेस पिन (Teacher PIN)
        </h2>
        <p style={{ fontSize: '0.82rem', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '1.25rem' }}>
          {pendingPath
            ? `शिक्षक सुविधा खोलने के लिए 4-अंकीय PIN दर्ज करें`
            : 'शिक्षक मोड (Teacher Mode) अनलॉक करने के लिए PIN दर्ज करें'}
        </p>

        {/* PIN Dots Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '1.25rem' }}>
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: pin.length > idx ? '#ed8936' : isDarkMode ? '#334155' : '#e2e8f0',
                border: `2px solid ${pin.length > idx ? '#c05621' : isDarkMode ? '#475569' : '#cbd5e1'}`,
                transition: 'all 0.15s ease',
              }}
            />
          ))}
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#991b1b',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Keypad Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            marginBottom: '1.25rem',
          }}
        >
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              style={{
                height: '52px',
                borderRadius: '12px',
                border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
                color: isDarkMode ? '#f8fafc' : '#0f2744',
                fontSize: '1.3rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            style={{
              height: '52px',
              borderRadius: '12px',
              border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
              backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            style={{
              height: '52px',
              borderRadius: '12px',
              border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
              backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
              color: isDarkMode ? '#f8fafc' : '#0f2744',
              fontSize: '1.3rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            style={{
              height: '52px',
              borderRadius: '12px',
              border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
              backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              fontSize: '1.2rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ⌫
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={closePinModal}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`,
              backgroundColor: 'transparent',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            रद्द करें (Cancel)
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={pin.length !== 4 || isSubmitting}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: pin.length === 4 ? '#ed8936' : isDarkMode ? '#334155' : '#cbd5e1',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: pin.length === 4 ? 'pointer' : 'not-allowed',
              opacity: pin.length === 4 ? 1 : 0.6,
            }}
          >
            {isSubmitting ? 'जाँच हो रही है...' : 'अनलॉक करें (Unlock)'}
          </button>
        </div>

        {/* Default PIN Hint */}
        <div style={{ marginTop: '1rem', fontSize: '0.72rem', color: isDarkMode ? '#64748b' : '#94a3b8' }}>
          💡 शुरुआती डिफ़ॉल्ट PIN: <strong style={{ color: '#ed8936' }}>1234</strong>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
