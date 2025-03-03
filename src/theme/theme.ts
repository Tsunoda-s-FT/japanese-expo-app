import { MD3LightTheme } from 'react-native-paper';
import { DefaultTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

// カラーパレット
export const colors = {
  // メインカラーをより鮮やかで学習アプリに合う配色に
  primary: '#006e51', // 日本を象徴する緑
  primaryDark: '#00523c',
  primaryLight: '#3e9e7e',
  
  // アクセントカラーを明るくして学習モチベーションを高める
  accent: '#FF5722', // 明るい赤
  
  // 機能色はそのままでコントラストを改善
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
  
  // 背景と表面色をより柔らかくする
  surface: '#FFFFFF',
  background: '#F8F9FA',
  card: '#FFFFFF',
  
  // テキスト色のコントラストを改善
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#9E9E9E',
  
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
  xxl: 48,
};

// 角丸サイズ
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  round: 9999,
};

// シャドウ
export const shadows = {
  none: {},
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
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

// 共通スタイル (styles.tsから統合)
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  card: {
    ...shadows.medium,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  paragraph: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
}); 