import React, { useMemo } from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { LanguageCode } from '../i18n';

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
  xxxl: 28
};

interface LocalizedTextProps extends TextProps {
  children: React.ReactNode;
  size?: keyof typeof textSizes | number;
  style?: any;
  numberOfLines?: number;
  testID?: string;
  adjustsFontSizeToFit?: boolean;
  minimumFontScale?: number;
}

export const LocalizedText: React.FC<LocalizedTextProps> = ({
  children,
  size = 'md',
  style,
  numberOfLines,
  testID,
  adjustsFontSizeToFit = false,
  minimumFontScale = 0.7,
  ...props
}) => {
  const { language } = useLanguage();
  
  // 言語に基づいたフォントサイズの調整
  const scaledSize = useMemo(() => {
    const baseSize = typeof size === 'string' ? textSizes[size] : size;
    return baseSize * (languageScaleFactor[language] || 1);
  }, [size, language]);
  
  // 合成スタイルの作成
  const computedStyle = useMemo(() => {
    return [
      { fontSize: scaledSize },
      style
    ];
  }, [scaledSize, style]);
  
  return (
    <Text
      style={computedStyle}
      numberOfLines={numberOfLines}
      testID={testID}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      {...props}
    >
      {children}
    </Text>
  );
};

// ヘッダータイトル用のローカライズドテキスト
export const LocalizedTitle: React.FC<Omit<LocalizedTextProps, 'size'>> = (props) => {
  return <LocalizedText size="xl" style={styles.title} {...props} />;
};

// サブタイトル用のローカライズドテキスト
export const LocalizedSubtitle: React.FC<Omit<LocalizedTextProps, 'size'>> = (props) => {
  return <LocalizedText size="lg" style={styles.subtitle} {...props} />;
};

// キャプション用のローカライズドテキスト
export const LocalizedCaption: React.FC<Omit<LocalizedTextProps, 'size'>> = (props) => {
  return <LocalizedText size="xs" style={styles.caption} {...props} />;
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  caption: {
    opacity: 0.7,
  },
}); 