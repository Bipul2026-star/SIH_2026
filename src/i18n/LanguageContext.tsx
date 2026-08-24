import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../types';
import { LANGUAGES, translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  languages: typeof LANGUAGES;
  activeLanguageInfo: (typeof LANGUAGES)[0];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'crop_rakshak_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language;
    if (saved && ['bn', 'hi', 'mr', 'en'].includes(saved)) {
      return saved;
    }
    return 'bn'; // Default to Bengali as required
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to Bengali dictionary if missing in current language
    if (translations.bn && translations.bn[key]) {
      return translations.bn[key];
    }
    // Fallback to English dictionary
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  const activeLanguageInfo = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: LANGUAGES,
        activeLanguageInfo,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
