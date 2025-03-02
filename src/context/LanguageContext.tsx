import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { I18nManager } from 'react-native';
import { LanguageCode, getLanguageInfo, getStoredLanguage, storeLanguage, applyRTL } from '../i18n';
import { loadTranslations, formatTranslation } from '../i18n/translations';
import { getTypography, TypographyConfig } from '../theme/typography';

// 型定義
export type Language = 'en' | 'ja';

interface TranslationData {
  [key: string]: string;
}

// 状態の型定義
interface LanguageState {
  language: LanguageCode;
  translations: Record<string, string>;
  isRTL: boolean;
  isLoading: boolean;
  error: Error | null;
  typography: TypographyConfig;
}

// アクション定義
type LanguageAction = 
  | { type: 'LOAD_LANGUAGE_START' }
  | { type: 'LOAD_LANGUAGE_SUCCESS'; payload: { language: LanguageCode; translations: Record<string, string> } }
  | { type: 'LOAD_LANGUAGE_ERROR'; payload: Error }
  | { type: 'SET_LANGUAGE'; payload: { language: LanguageCode; translations: Record<string, string> } };

// 翻訳データ
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
    showResult: 'Show Result',
    exitSession: 'Exit Session',
    tryAgain: 'Try Again',
    congratulations: 'Congratulations!',
    goodJob: 'Good Job!',
    needMorePractice: 'Need More Practice',
    examples: 'Examples',
    pronunciation: 'Pronunciation',
    explanation: 'Explanation',
    quizHistory: 'Quiz History',
    historyDetail: 'History Detail',
    score: 'Score',
    date: 'Date',
    noHistory: 'No History',
    questionNumber: 'Question',
  }
};

const initialState: LanguageState = {
  language: 'en',
  translations: {},
  isRTL: false,
  isLoading: true,
  error: null,
  typography: getTypography('en')
};

function languageReducer(state: LanguageState, action: LanguageAction): LanguageState {
  switch (action.type) {
    case 'LOAD_LANGUAGE_START':
      return { ...state, isLoading: true };
      
    case 'LOAD_LANGUAGE_SUCCESS':
      return { 
        ...state, 
        language: action.payload.language,
        translations: action.payload.translations,
        isRTL: getLanguageInfo(action.payload.language).rtl,
        isLoading: false,
        error: null,
        typography: getTypography(action.payload.language)
      };
      
    case 'LOAD_LANGUAGE_ERROR':
      return { ...state, error: action.payload, isLoading: false };
      
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload.language,
        translations: action.payload.translations,
        isRTL: getLanguageInfo(action.payload.language).rtl,
        typography: getTypography(action.payload.language)
      };
      
    default:
      return state;
  }
}

// ストレージキー
const LANGUAGE_STORAGE_KEY = 'user_language';

// コンテキスト型定義
interface LanguageContextType {
  language: LanguageCode;
  translations: Record<string, string>;
  isRTL: boolean;
  isLoading: boolean;
  typography: TypographyConfig;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  t: (key: string, defaultValue?: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);
  
  // 初期化時に言語設定を読み込む
  useEffect(() => {
    loadLanguage();
  }, []);
  
  const loadLanguage = async () => {
    dispatch({ type: 'LOAD_LANGUAGE_START' });
    try {
      const language = await getStoredLanguage();
      const translations = loadTranslations(language);
      
      // RTL設定を適用
      applyRTL(language);
      
      dispatch({ 
        type: 'LOAD_LANGUAGE_SUCCESS', 
        payload: { language, translations } 
      });
    } catch (error) {
      dispatch({ type: 'LOAD_LANGUAGE_ERROR', payload: error as Error });
    }
  };
  
  // 言語を切り替える
  const setLanguage = async (lang: LanguageCode) => {
    try {
      await storeLanguage(lang);
      const translations = loadTranslations(lang);
      
      // RTL設定を適用
      applyRTL(lang);
      
      dispatch({ 
        type: 'SET_LANGUAGE', 
        payload: { language: lang, translations } 
      });
    } catch (error) {
      console.error('Failed to set language:', error);
    }
  };
  
  // パラメータ付き翻訳
  const t = (
    key: string, 
    defaultValue?: string,
    params?: Record<string, string | number>
  ): string => {
    const text = state.translations[key] || defaultValue || key;
    return params ? formatTranslation(text, params) : text;
  };
  
  const value: LanguageContextType = {
    language: state.language,
    translations: state.translations,
    isRTL: state.isRTL,
    isLoading: state.isLoading,
    typography: state.typography,
    setLanguage,
    t
  };
  
  return (
    <LanguageContext.Provider value={value}>
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
