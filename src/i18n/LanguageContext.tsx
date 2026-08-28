import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved && ['bn', 'hi', 'mr', 'en'].includes(saved)) {
        return saved;
      }
    } catch {
      // Ignore localStorage access errors
    }
    return 'bn'; // Default to Bengali as required
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore
    }
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    if (['bn', 'hi', 'mr', 'en'].includes(lang)) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Ignore
      }
      setLanguageState(lang);
    }
  }, []);

  const t = useCallback((key: string, fallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dictionary if key is missing in active language
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    // Fallback to Bengali dictionary
    if (translations.bn && translations.bn[key]) {
      return translations.bn[key];
    }
    return fallback || key;
  }, [language]);

  const activeLanguageInfo = useMemo(() => {
    return LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  }, [language]);

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t,
    languages: LANGUAGES,
    activeLanguageInfo,
  }), [language, setLanguage, t, activeLanguageInfo]);

  return (
    <LanguageContext.Provider value={contextValue}>
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
