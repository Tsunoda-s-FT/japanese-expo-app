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
    randomQuizDescription: '全レッスンからランダム出題',
    lessonList: 'レッスン一覧',
    courseList: 'コース一覧',
    lessonDetail: 'レッスン詳細',
    courseDetail: 'コース詳細',
    quizMode: 'クイズモード',
    learningMode: '学習モード',
    quizResult: 'クイズ結果',
    loading: '読み込み中...',
    noLessonsFound: 'レッスンが見つかりません',
    noCoursesFound: 'コースが見つかりません',
    level: 'レベル',
    estimatedTime: '所要時間',
    category: 'カテゴリー',
    progress: '進捗',
    totalCourses: '合計コース数',
    startLearning: '学習を開始',
    startQuiz: 'クイズを開始',
    courseProgress: 'コース進捗',
    phraseProgress: 'フレーズ進捗',
    quizProgress: 'クイズ進捗',
    recordAudio: '音声を録音',
    playAudio: '音声を再生',
    answer: '回答する',
    showResult: '結果を見る',
    exitSession: 'セッションを終了',
    tryAgain: 'もう一度挑戦',
    congratulations: 'おめでとうございます！',
    goodJob: 'よく頑張りました！',
    needMorePractice: 'もう少し練習しましょう',
    examples: '例文',
    pronunciation: '発音',
    explanation: '解説',
    quizHistory: 'クイズ履歴',
    historyDetail: '履歴詳細',
    score: 'スコア',
    date: '日付',
    noHistory: '履歴がありません',
    questionNumber: '問題',
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
    randomQuizDescription: 'Random questions from all lessons',
    lessonList: 'Lessons',
    courseList: 'Courses',
    lessonDetail: 'Lesson Details',
    courseDetail: 'Course Details',
    quizMode: 'Quiz Mode',
    learningMode: 'Learning Mode',
    quizResult: 'Quiz Results',
    loading: 'Loading...',
    noLessonsFound: 'No lessons found',
    noCoursesFound: 'No courses found',
    level: 'Level',
    estimatedTime: 'Estimated Time',
    category: 'Category',
    progress: 'Progress',
    totalCourses: 'Total Courses',
    startLearning: 'Start Learning',
    startQuiz: 'Start Quiz',
    courseProgress: 'Course Progress',
    phraseProgress: 'Phrase Progress',
    quizProgress: 'Quiz Progress',
    recordAudio: 'Record Audio',
    playAudio: 'Play Audio',
    answer: 'Answer',
    showResult: 'Show Results',
    exitSession: 'Exit Session',
    tryAgain: 'Try Again',
    congratulations: 'Congratulations!',
    goodJob: 'Good job!',
    needMorePractice: 'Need more practice',
    examples: 'Examples',
    pronunciation: 'Pronunciation',
    explanation: 'Explanation',
    quizHistory: 'Quiz History',
    historyDetail: 'History Details',
    score: 'Score',
    date: 'Date',
    noHistory: 'No history found',
    questionNumber: 'Question',
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
