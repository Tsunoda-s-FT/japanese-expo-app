import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageCode, getLanguageInfo, getDeviceLanguage, applyRTL } from '../i18n';
import { loadTranslations, formatTranslation } from '../i18n/translations';
import { ImprovedLanguageChangeToast } from '../components/ImprovedLanguageChangeToast';
import { getTypography, TypographyConfig } from '../theme/typography';

// 状態の型定義
interface LanguageState {
  language: LanguageCode;
  translations: Record<string, string>;
  isRTL: boolean;
  isLoading: boolean;
  error: Error | null;
  typography: TypographyConfig;
  showToast: boolean;
}

// アクション定義
type LanguageAction = 
  | { type: 'LOAD_LANGUAGE_START' }
  | { type: 'LOAD_LANGUAGE_SUCCESS'; payload: { language: LanguageCode; translations: Record<string, string> } }
  | { type: 'LOAD_LANGUAGE_ERROR'; payload: Error }
  | { type: 'SET_LANGUAGE'; payload: { language: LanguageCode; translations: Record<string, string> } }
  | { type: 'HIDE_TOAST' };

const initialState: LanguageState = {
  language: 'en',
  translations: {},
  isRTL: false,
  isLoading: true,
  error: null,
  typography: getTypography('en'),
  showToast: false
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
        typography: getTypography(action.payload.language),
        showToast: true
      };
    
    case 'HIDE_TOAST':
      return { ...state, showToast: false };
      
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
  showToast: boolean;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  hideToast: () => void;
  t: (key: string, defaultValue?: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const ImprovedLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);
  
  // 初期化時に言語設定を読み込む
  useEffect(() => {
    loadLanguage();
  }, []);
  
  const loadLanguage = async () => {
    dispatch({ type: 'LOAD_LANGUAGE_START' });
    try {
      // 保存された言語設定があるかチェック
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      
      // 言語コードを決定
      let languageCode: LanguageCode;
      
      if (savedLanguage && ['en', 'ja', 'zh', 'ko', 'es'].includes(savedLanguage as LanguageCode)) {
        languageCode = savedLanguage as LanguageCode;
      } else {
        // デバイスの言語設定から最適な言語を判定
        languageCode = getDeviceLanguage();
      }
      
      // 翻訳データの読み込み
      const translations = loadTranslations(languageCode);
      
      // RTL設定を適用
      applyRTL(languageCode);
      
      dispatch({ 
        type: 'LOAD_LANGUAGE_SUCCESS', 
        payload: { language: languageCode, translations } 
      });
    } catch (error) {
      dispatch({ type: 'LOAD_LANGUAGE_ERROR', payload: error as Error });
    }
  };
  
  // 言語を切り替える
  const setLanguage = async (lang: LanguageCode): Promise<void> => {
    try {
      if (lang === state.language) return; // 同じ言語の場合は何もしない
      
      // 言語設定を保存
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      
      // 翻訳データを読み込み
      const translations = loadTranslations(lang);
      
      // RTL設定を適用
      applyRTL(lang);
      
      // 状態を更新
      dispatch({ 
        type: 'SET_LANGUAGE', 
        payload: { language: lang, translations } 
      });
    } catch (error) {
      console.error('Failed to set language:', error);
    }
  };
  
  // トーストを非表示にする
  const hideToast = () => {
    dispatch({ type: 'HIDE_TOAST' });
  };
  
  // ローカライズされたテキストを取得する関数
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
    showToast: state.showToast,
    setLanguage,
    hideToast,
    t
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
      <ImprovedLanguageChangeToast 
        visible={state.showToast}
        onDismiss={hideToast}
      />
    </LanguageContext.Provider>
  );
};

export const useImprovedLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useImprovedLanguage must be used within a ImprovedLanguageProvider');
  }
  return context;
}; 