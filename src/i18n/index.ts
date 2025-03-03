/**
 * 多言語対応の中心的なモジュール
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';

/** サポートされる言語コード（ISO 639-1） */
export type LanguageCode = 'en' | 'ja' | 'zh' | 'ko' | 'es';

/** ストレージキー */
const LANGUAGE_STORAGE_KEY = 'user_language';

/** デフォルト言語 */
export const DEFAULT_LANGUAGE: LanguageCode = 'en';

/** 言語情報 */
export interface LanguageInfo {
  code: LanguageCode;
  name: string;       // 英語での言語名
  nativeName: string; // その言語での言語名
  rtl: boolean;       // 右から左の言語かどうか
}

/** サポートされている言語情報 */
export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
];

/**
 * デバイスのロケールから最適な言語を判定
 * @returns サポートされている言語コード
 */
export const getDeviceLanguage = (): LanguageCode => {
  const deviceLocale = Localization.locale.split('-')[0];
  
  // サポートされている言語かどうかをチェック
  const isSupported = LANGUAGES.some(lang => lang.code === deviceLocale);
  if (isSupported) {
    return deviceLocale as LanguageCode;
  }
  
  return DEFAULT_LANGUAGE;
};

/**
 * 言語コードから言語情報を取得
 * @param code 言語コード
 * @returns 言語情報
 */
export const getLanguageInfo = (code: LanguageCode): LanguageInfo => {
  const language = LANGUAGES.find(lang => lang.code === code);
  if (!language) {
    return LANGUAGES.find(lang => lang.code === DEFAULT_LANGUAGE)!;
  }
  return language;
};

/**
 * RTL設定を適用
 * @param languageCode 言語コード
 */
export const applyRTL = (languageCode: LanguageCode): void => {
  const isRTL = getLanguageInfo(languageCode).rtl;
  
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
  }
};

/**
 * AsyncStorage から言語設定を取得
 * @returns 保存されている言語コード、またはデバイスのデフォルト言語
 */
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

/**
 * AsyncStorage に言語設定を保存
 * @param languageCode 言語コード
 */
export const storeLanguage = async (languageCode: LanguageCode): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  } catch (error) {
    console.error('Failed to store language:', error);
  }
}; 