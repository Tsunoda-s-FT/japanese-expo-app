import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 型定義
export type ThemeType = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';

export interface Settings {
  theme: ThemeType;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoPlayAudio: boolean;
  furiganaEnabled: boolean;
  fontSize: FontSize;
}

// 状態の型定義
interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  error: Error | null;
}

// アクション定義
type SettingsAction = 
  | { type: 'LOAD_SETTINGS_START' }
  | { type: 'LOAD_SETTINGS_SUCCESS'; payload: Settings }
  | { type: 'LOAD_SETTINGS_ERROR'; payload: Error }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> }
  | { type: 'RESET_SETTINGS' };

// デフォルト設定
export const defaultSettings: Settings = {
  theme: 'light',
  soundEnabled: true,
  notificationsEnabled: true,
  autoPlayAudio: false,
  furiganaEnabled: true,
  fontSize: 'medium'
};

const initialState: SettingsState = {
  settings: defaultSettings,
  isLoading: true,
  error: null
};

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'LOAD_SETTINGS_START':
      return { ...state, isLoading: true };
      
    case 'LOAD_SETTINGS_SUCCESS':
      return { 
        ...state, 
        settings: action.payload,
        isLoading: false,
        error: null
      };
      
    case 'LOAD_SETTINGS_ERROR':
      return { ...state, error: action.payload, isLoading: false };
      
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
      
    case 'RESET_SETTINGS':
      return {
        ...state,
        settings: defaultSettings
      };
      
    default:
      return state;
  }
}

// ストレージキー
const SETTINGS_STORAGE_KEY = 'app_settings';

// コンテキスト型定義
interface SettingsContextType {
  settings: Settings;
  isLoading: boolean;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  
  // 初期化時にAsyncStorageから設定を読み込む
  useEffect(() => {
    loadSettings();
  }, []);
  
  // 状態変更時にAsyncStorageに保存
  useEffect(() => {
    if (!state.isLoading) {
      saveSettings();
    }
  }, [state.settings]);
  
  const loadSettings = async () => {
    dispatch({ type: 'LOAD_SETTINGS_START' });
    try {
      const settingsJSON = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      
      if (settingsJSON) {
        const savedSettings = JSON.parse(settingsJSON);
        dispatch({ 
          type: 'LOAD_SETTINGS_SUCCESS', 
          payload: { ...defaultSettings, ...savedSettings } 
        });
      } else {
        dispatch({ type: 'LOAD_SETTINGS_SUCCESS', payload: defaultSettings });
      }
    } catch (error) {
      dispatch({ type: 'LOAD_SETTINGS_ERROR', payload: error as Error });
    }
  };
  
  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state.settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };
  
  const updateSettings = async (newSettings: Partial<Settings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  };
  
  const resetSettings = async () => {
    try {
      await AsyncStorage.removeItem(SETTINGS_STORAGE_KEY);
      dispatch({ type: 'RESET_SETTINGS' });
    } catch (error) {
      dispatch({ type: 'LOAD_SETTINGS_ERROR', payload: error as Error });
    }
  };
  
  const value: SettingsContextType = {
    settings: state.settings,
    isLoading: state.isLoading,
    updateSettings,
    resetSettings
  };
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};