// src/i18n/index.ts
// 多言語対応の中心的なモジュール

import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';

// サポートされる言語コード（ISO 639-1）
export type LanguageCode = 
  | 'en'     // 英語
  | 'ja'     // 日本語
  | 'zh';    // 中国語（簡体）

// 右から左に表示する言語コード
const RTL_LANGUAGES: LanguageCode[] = [];

// 言語情報の定義
export interface LanguageInfo {
  code: LanguageCode;
  name: string;           // 英語での言語名
  nativeName: string;     // その言語での言語名
  rtl: boolean;           // 右から左の言語かどうか
  fontFamily?: string;    // 特定のフォントが必要な場合
}

// 各言語の情報
export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', rtl: false },
];

// AsyncStorage のキー
const LANGUAGE_STORAGE_KEY = 'user_language';

// デフォルト言語
export const DEFAULT_LANGUAGE: LanguageCode = 'en';

// デバイスのロケールから最適な言語を判定
export const getDeviceLanguage = (): LanguageCode => {
  const deviceLocale = Localization.locale.split('-')[0];
  
  // サポートされている言語かどうかをチェック
  const isSupported = LANGUAGES.some(lang => lang.code === deviceLocale);
  if (isSupported) {
    return deviceLocale as LanguageCode;
  }
  
  return DEFAULT_LANGUAGE;
};

// 言語コードから言語情報を取得
export const getLanguageInfo = (code: LanguageCode): LanguageInfo => {
  const language = LANGUAGES.find(lang => lang.code === code);
  if (!language) {
    return LANGUAGES.find(lang => lang.code === DEFAULT_LANGUAGE)!;
  }
  return language;
};

// RTL設定を適用
export const applyRTL = (languageCode: LanguageCode): void => {
  const isRTL = RTL_LANGUAGES.includes(languageCode);
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
  }
};

// AsyncStorage から言語設定を取得
export const getStoredLanguage = async (): Promise<LanguageCode> => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && LANGUAGES.some(lang => lang.code === storedLanguage)) {
      return storedLanguage as LanguageCode;
    }
  } catch (error) {
    console.error('Failed to get stored language:', error);
  }
  
  // 保存された言語がなければデバイスのロケールを使用
  return getDeviceLanguage();
};

// AsyncStorage に言語設定を保存
export const storeLanguage = async (languageCode: LanguageCode): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  } catch (error) {
    console.error('Failed to store language:', error);
  }
}; 