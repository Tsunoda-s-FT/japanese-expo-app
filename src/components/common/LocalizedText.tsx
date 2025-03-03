import React, { useMemo } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../i18n';

// 言語ごとのテキストスケール係数
// 日本語や中国語は英語より表示スペースが必要なことが多いため、
// 言語によって自動的にフォントサイズを調整する
const languageScaleFactor: Record<LanguageCode, number> = {
  en: 1.0,   // 基準
  ja: 0.95,  // 日本語は少し小さく
  zh: 0.95,  // 中国語も少し小さく
  ko: 0.95,  // 韓国語も少し小さく
  es: 0.97   // スペイン語は英語より若干小さく
};

// 標準のテキストサイズ定義
export const textSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32
};

// テキストの重み定義
export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const
};

// テキストの色定義
export const textColors = {
  primary: '#333333',
  secondary: '#666666',
  tertiary: '#999999',
  inverse: '#FFFFFF',
  accent: '#3498db',
  error: '#e74c3c',
  success: '#2ecc71',
  warning: '#f39c12'
};

export interface LocalizedTextProps extends TextProps {
  children: string | React.ReactNode;
  size?: keyof typeof textSizes;
  weight?: keyof typeof fontWeights;
  color?: keyof typeof textColors | string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  adjustsFontSizeToFit?: boolean;
  numberOfLines?: number;
  style?: TextProps['style'];
}

export const LocalizedText: React.FC<LocalizedTextProps> = ({
  children,
  size = 'md',
  weight = 'normal',
  color = 'primary',
  align = 'auto',
  adjustsFontSizeToFit = false,
  numberOfLines,
  style,
  ...props
}) => {
  const { language } = useLanguage();
  
  // 言語に応じたフォントサイズの調整
  const scaledFontSize = useMemo(() => {
    const baseSize = textSizes[size];
    return baseSize * (languageScaleFactor[language] || 1);
  }, [size, language]);
  
  // テキストカラーの解決
  const resolvedColor = textColors[color as keyof typeof textColors] || color;
  
  const textStyle = useMemo(() => {
    return {
      fontSize: scaledFontSize,
      fontWeight: fontWeights[weight],
      color: resolvedColor,
      textAlign: align,
    };
  }, [scaledFontSize, weight, resolvedColor, align]);
  
  return (
    <Text
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      numberOfLines={numberOfLines}
      style={[textStyle, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default LocalizedText; 