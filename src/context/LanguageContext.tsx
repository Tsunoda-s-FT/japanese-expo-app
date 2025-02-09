import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  translations: Record<string, string>;
}

const defaultTranslations = {
  ja: {
    appTitle: '日本語学習アプリ',
    lessons: 'レッスン',
    settings: '設定',
    language: '言語',
    start: '開始',
    next: '次へ',
    back: '戻る',
    correct: '正解です！',
    incorrect: '不正解です',
    submit: '回答',
    selectLanguage: '言語を選択',
    japanese: '日本語',
    english: 'English',
    quickMenu: 'クイックメニュー',
    speedQuiz: 'スピードクイズ',
    randomQuizDescription: '全レッスンからランダム出題'
  },
  en: {
    appTitle: 'Japanese Learning App',
    lessons: 'Lessons',
    settings: 'Settings',
    language: 'Language',
    start: 'Start',
    next: 'Next',
    back: 'Back',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    submit: 'Submit',
    selectLanguage: 'Select Language',
    japanese: 'Japanese',
    english: 'English',
    quickMenu: 'Quick Menu',
    speedQuiz: 'Speed Quiz',
    randomQuizDescription: 'Random questions from all lessons'
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [translations, setTranslations] = useState(defaultTranslations.en);

  useEffect(() => {
    // Load saved language preference
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('userLanguage');
        if (savedLanguage === 'ja' || savedLanguage === 'en') {
          setLanguageState(savedLanguage);
          setTranslations(defaultTranslations[savedLanguage]);
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('userLanguage', lang);
      setLanguageState(lang);
      setTranslations(defaultTranslations[lang]);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
