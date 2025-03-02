import { LanguageCode } from '../i18n';

/**
 * 言語コードに基づいて適切なアイコン名を返す関数
 * @param code 言語コード
 * @returns Material Community Iconsのアイコン名
 */
export const getFlagIconForLanguage = (code: LanguageCode): string => {
  switch (code) {
    case 'en': return 'alpha-e-circle';
    case 'ja': return 'alpha-j-circle';
    case 'zh': return 'alpha-c-circle';
    case 'ko': return 'alpha-k-circle';
    case 'es': return 'alpha-s-circle';
    default: return 'translate';
  }
};

/**
 * 言語に関する簡単な説明を提供する関数（アクセシビリティ向上）
 * @param code 言語コード
 * @returns 言語に関する説明文
 */
export const getLanguageDescription = (code: LanguageCode): string => {
  switch (code) {
    case 'en': return 'English language';
    case 'ja': return 'Japanese language (日本語)';
    case 'zh': return 'Simplified Chinese language (简体中文)';
    case 'ko': return 'Korean language (한국어)';
    case 'es': return 'Spanish language (Español)';
    default: return 'Select language';
  }
}; 