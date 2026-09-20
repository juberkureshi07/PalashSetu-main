import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage, TRANSLATIONS, TranslationKey, SUPPORTED_LANGUAGES, LanguageOption } from '../utils/translations';
import { speakText } from '../utils/santaliSpeech';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: TranslationKey) => string;
  currentLanguageOption: LanguageOption;
  supportedLanguages: LanguageOption[];
  isLanguageModalOpen: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
  speakInAppLanguage: (text: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'santali',
  setLanguage: () => {},
  t: (key) => TRANSLATIONS['santali'][key] || key,
  currentLanguageOption: SUPPORTED_LANGUAGES[0],
  supportedLanguages: SUPPORTED_LANGUAGES,
  isLanguageModalOpen: false,
  openLanguageModal: () => {},
  closeLanguageModal: () => {},
  speakInAppLanguage: () => {},
});

const STORAGE_KEY = 'bhashagyan_app_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as AppLanguage;
    if (saved && TRANSLATIONS[saved]) {
      return saved;
    }
    return 'santali';
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const setLanguage = (lang: AppLanguage) => {
    if (TRANSLATIONS[lang]) {
      setLanguageState(lang);
    }
  };

  const t = (key: TranslationKey): string => {
    const activeDict = TRANSLATIONS[language] || TRANSLATIONS['santali'];
    return activeDict[key] || TRANSLATIONS['santali'][key] || key;
  };

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((item) => item.code === language) || SUPPORTED_LANGUAGES[0];

  const openLanguageModal = () => setIsLanguageModalOpen(true);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);

  const speakInAppLanguage = (text: string) => {
    if (!text) return;
    const isHindiOrDevanagari = language === 'hindi' || language === 'ho' || language === 'kurukh' || language === 'mundari';
    speakText(text, {
      lang: isHindiOrDevanagari ? 'hi-IN' : undefined,
      rate: 0.85,
    });
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLanguageOption,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isLanguageModalOpen,
        openLanguageModal,
        closeLanguageModal,
        speakInAppLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
