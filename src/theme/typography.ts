import { Platform } from 'react-native';
import { LanguageCode } from '../i18n/i18n';

// フォント設定の定義
export interface TypographyConfig {
  fontFamily: string;
  fontScale?: number;
  letterSpacing?: number;
}

// 言語ごとのフォントファミリーを取得
export const getFontFamily = (language: LanguageCode): string => {
  switch (language) {
    case 'ja':
      return Platform.select({
        ios: 'Hiragino Sans',
        android: 'Noto Sans JP',
        default: 'sans-serif',
      });
    case 'zh':
      return Platform.select({
        ios: 'PingFang SC',
        android: 'Noto Sans SC',
        default: 'sans-serif',
      });
    case 'ko':
      return Platform.select({
        ios: 'Apple SD Gothic Neo',
        android: 'Noto Sans KR',
        default: 'sans-serif',
      });
    case 'es':
    case 'en':
    default:
      return Platform.select({
        ios: 'System',
        android: 'Roboto',
        default: 'sans-serif',
      });
  }
};

// 言語ごとのタイポグラフィ設定を取得
export const getTypography = (language: LanguageCode): TypographyConfig => {
  const fontFamily = getFontFamily(language);
  
  switch (language) {
    case 'ja':
    case 'zh':
    case 'ko':
      // CJK言語はやや大きめのフォントサイズと文字間隔が読みやすい
      return {
        fontFamily,
        fontScale: 1.05,
        letterSpacing: 0.5,
      };
    case 'es':
      // スペイン語はアクセント記号があるため、少し余裕を持たせる
      return {
        fontFamily,
        fontScale: 1.0,
        letterSpacing: 0.3,
      };
    case 'en':
    default:
      return {
        fontFamily,
        fontScale: 1.0,
        letterSpacing: 0.25,
      };
  }
}; 