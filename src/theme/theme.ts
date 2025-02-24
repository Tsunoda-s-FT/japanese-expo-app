import { MD3LightTheme } from 'react-native-paper';
import { DefaultTheme } from '@react-navigation/native';

// カラーパレット
export const colors = {
  // メインカラー（現在のオレンジから学習アプリに適した青系に変更）
  primary: '#4A6FE5',
  primaryDark: '#3257D1',
  primaryLight: '#7C95EA',
  
  // アクセントカラー
  accent: '#FF9F43',
  
  // 機能色
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
  
  // 背景色と表面色
  surface: '#FFFFFF',
  background: '#F5F7FA',
  card: '#FFFFFF',
  
  // テキスト色
  text: '#333333',
  textSecondary: '#757575',
  textLight: '#FFFFFF',
  
  // その他
  border: '#E0E0E0',
  disabled: '#BDBDBD',
};

// 余白サイズ
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// 角丸サイズ
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  round: 9999,
};

// シャドウ
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
};

// React Native Paper用テーマ
export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    text: colors.text,
  },
};

// React Navigation用テーマ
export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
  },
}; 