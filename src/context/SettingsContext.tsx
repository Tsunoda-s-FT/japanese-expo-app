import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError } from '../utils/errorUtils';

// テーマの種類
export type ThemeType = 'light' | 'dark' | 'system';

// 設定の型定義
interface Settings {
  theme: ThemeType;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoPlayAudio: boolean;
  furiganaEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

// コンテキストの型定義
interface SettingsContextValue {
  settings: Settings;
  isLoading: boolean;
  setTheme: (theme: ThemeType) => Promise<void>;
  setSoundEnabled: (enabled: boolean) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setAutoPlayAudio: (enabled: boolean) => Promise<void>;
  setFuriganaEnabled: (enabled: boolean) => Promise<void>;
  setFontSize: (size: 'small' | 'medium' | 'large') => Promise<void>;
  resetSettings: () => Promise<void>;
}

// デフォルト設定
const defaultSettings: Settings = {
  theme: 'light',
  soundEnabled: true,
  notificationsEnabled: true,
  autoPlayAudio: false,
  furiganaEnabled: true,
  fontSize: 'medium',
};

// AsyncStorageのキー
const SETTINGS_STORAGE_KEY = 'app_settings';

// コンテキストの作成
const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

// プロバイダーコンポーネント
export const SettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // 初期化時に設定を読み込む
  useEffect(() => {
    loadSettings();
  }, []);

  // 設定をAsyncStorageから読み込む
  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      
      if (storedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
      }
    } catch (error) {
      logError('設定の読み込みに失敗しました', 'error', { error });
    } finally {
      setIsLoading(false);
    }
  };

  // 設定をAsyncStorageに保存する
  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      logError('設定の保存に失敗しました', 'error', { error });
      throw error;
    }
  };

  // テーマを設定
  const setTheme = async (theme: ThemeType) => {
    const newSettings = { ...settings, theme };
    await saveSettings(newSettings);
  };

  // 音声を有効/無効に設定
  const setSoundEnabled = async (enabled: boolean) => {
    const newSettings = { ...settings, soundEnabled: enabled };
    await saveSettings(newSettings);
  };

  // 通知を有効/無効に設定
  const setNotificationsEnabled = async (enabled: boolean) => {
    const newSettings = { ...settings, notificationsEnabled: enabled };
    await saveSettings(newSettings);
  };

  // 音声の自動再生を有効/無効に設定
  const setAutoPlayAudio = async (enabled: boolean) => {
    const newSettings = { ...settings, autoPlayAudio: enabled };
    await saveSettings(newSettings);
  };

  // ふりがなの表示を有効/無効に設定
  const setFuriganaEnabled = async (enabled: boolean) => {
    const newSettings = { ...settings, furiganaEnabled: enabled };
    await saveSettings(newSettings);
  };

  // フォントサイズを設定
  const setFontSize = async (size: 'small' | 'medium' | 'large') => {
    const newSettings = { ...settings, fontSize: size };
    await saveSettings(newSettings);
  };

  // 設定をリセット
  const resetSettings = async () => {
    await saveSettings(defaultSettings);
  };

  // コンテキスト値
  const value: SettingsContextValue = {
    settings,
    isLoading,
    setTheme,
    setSoundEnabled,
    setNotificationsEnabled,
    setAutoPlayAudio,
    setFuriganaEnabled,
    setFontSize,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// カスタムフック
export const useSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext; 