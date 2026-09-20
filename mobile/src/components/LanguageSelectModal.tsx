import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AppLanguage, SUPPORTED_LANGUAGES } from '../utils/translations';
import { sfx } from '../utils/sfx';
import AudioSpeakerButton from './AudioSpeakerButton';

export const LanguageSelectModal: React.FC = () => {
  const { language, setLanguage, isLanguageModalOpen, closeLanguageModal, t } = useLanguage();

  if (!isLanguageModalOpen) return null;

  const handleSelect = (code: AppLanguage) => {
    sfx.playSuccess();
    setLanguage(code);
    closeLanguageModal();
  };

  return (
    <div
      onClick={closeLanguageModal}
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
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f2744', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🌐 {t('selectLanguage')}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              झारखंड की क्षेत्रीय भाषाएं (Jharkhand Regional & MTB-MLE Languages)
            </p>
          </div>
          <button
            onClick={() => {
              sfx.playTap();
              closeLanguageModal();
            }}
            style={{
              backgroundColor: '#f1f5f9',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '1.1rem',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Language Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #ed8936' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#fffaf0' : '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(237,137,54,0.15)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '1.6rem' }}>{lang.flag}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f2744' }}>
                        {lang.nativeName}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                        ({lang.name})
                      </span>
                      {isSelected && (
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', backgroundColor: '#ed8936', color: '#ffffff', fontWeight: 700 }}>
                          ✓ Active
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      {lang.script} • {lang.description}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AudioSpeakerButton
                    textToSpeak={`${lang.nativeName} ${lang.name}`}
                    size="sm"
                    title={`Listen ${lang.name} name out loud`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div style={{ marginTop: '1.25rem', padding: '10px 14px', borderRadius: '10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', fontSize: '0.78rem', color: '#1e40af', textAlign: 'center' }}>
          💡 <strong>100% Offline Capability:</strong> All language fonts, UI lookups, and phonetic voice engines operate on-device without internet.
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectModal;
