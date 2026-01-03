/**
 * Language Context for managing multi-language support
 */

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import { translations } from "../i18n/translations";
import type { Language, Translations } from "../i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Get initial language from localStorage or default to English
  const getInitialLanguage = (): Language => {
    const stored = localStorage.getItem("agri_language");
    if (stored && ["en", "hi", "mr", "pa", "ta"].includes(stored)) {
      return stored as Language;
    }

    // Auto-detect from browser if Hindi
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("hi")) return "hi";
    if (browserLang.startsWith("mr")) return "mr";
    if (browserLang.startsWith("pa")) return "pa";
    if (browserLang.startsWith("ta")) return "ta";

    return "en";
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("agri_language", lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export default LanguageContext;
