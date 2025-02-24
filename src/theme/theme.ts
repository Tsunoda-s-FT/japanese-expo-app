import { MD3LightTheme } from 'react-native-paper';
import { DefaultTheme } from '@react-navigation/native';

// カラーパレット
export const colors = {
  // メインカラーをより鮮やかで学習アプリに合う配色に
  primary: '#6A5ACD', // スレートブルー
  primaryDark: '#483D8B',
  primaryLight: '#B39DDB',
  
  // アクセントカラーを明るくして学習モチベーションを高める
  accent: '#FF6B6B', // 明るい赤
  
  // 機能色はそのままでコントラストを改善
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#42A5F5',
  
  // 背景と表面色をより柔らかくする
  surface: '#FFFFFF',
  background: '#F8F9FA',
  card: '#FFFFFF',
  
  // テキスト色のコントラストを改善
  text: '#424242',
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