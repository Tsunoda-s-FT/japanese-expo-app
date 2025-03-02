import { LanguageCode } from '../i18n';

/**
 * 言語コードに基づいて適切な国旗アイコン名を返す関数
 * MaterialCommunityIconsの国旗アイコンを使用
 * @param code 言語コード
 * @returns Material Community Iconsの国旗アイコン名
 */
export const getFlagIconForLanguage = (code: LanguageCode): string => {
  switch (code) {
    case 'en': return 'flag-usa';
    case 'ja': return 'flag-japan';
    case 'zh': return 'flag-china';
    case 'ko': return 'flag-south-korea';
    case 'es': return 'flag-spain';
    default: return 'translate';
  }
};

/**
 * 言語コードに基づいて言語のネイティブ名（その言語での表記）を返す
 * @param code 言語コード
 * @returns 言語のネイティブ名
 */
export const getNativeLanguageName = (code: LanguageCode): string => {
  switch (code) {
    case 'en': return 'English';
    case 'ja': return '日本語';
    case 'zh': return '中文';
    case 'ko': return '한국어';
    case 'es': return 'Español';
    default: return code;
  }
};

/**
 * 言語コードに基づいて言語の英語名を返す
 * @param code 言語コード
 * @returns 言語の英語名
 */
export const getEnglishLanguageName = (code: LanguageCode): string => {
  switch (code) {
    case 'en': return 'English';
    case 'ja': return 'Japanese';
    case 'zh': return 'Chinese';
    case 'ko': return 'Korean';
    case 'es': return 'Spanish';
    default: return code;
  }
};

/**
 * 言語に関する説明を提供する関数（アクセシビリティ向上）
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

/**
 * 言語変更時のフィードバックメッセージを提供する関数
 * @param code 言語コード
 * @param currentLanguage 現在の言語コード
 * @returns フィードバックメッセージ
 */
export const getLanguageChangeMessage = (code: LanguageCode, currentLanguage: LanguageCode): string => {
  const nativeName = getNativeLanguageName(code);
  
  // 現在の言語で変更メッセージを表示
  switch (currentLanguage) {
    case 'ja':
      return `言語を${nativeName}に変更しました`;
    case 'en':
      return `Language changed to ${nativeName}`;
    case 'zh':
      return `语言已更改为${nativeName}`;
    case 'ko':
      return `언어가 ${nativeName}(으)로 변경되었습니다`;
    case 'es':
      return `Idioma cambiado a ${nativeName}`;
    default:
      return `Language changed to ${nativeName}`;
  }
}; 