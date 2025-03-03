/**
 * メインコンポーネントバレルファイル
 * アプリケーション全体で使用されるコンポーネントをエクスポートします
 */

// 共通コンポーネント
// export * from './common'; // チケット1で削除済み

// UIコンポーネント
export { default as AppButton } from './ui/AppButton';
export { default as AppCard } from './ui/AppCard';
export { default as AppHeader } from './ui/AppHeader';
export { default as AppLoading } from './ui/AppLoading';
export { default as AppProgressBar } from './ui/AppProgressBar';
export { default as SimpleProgressBar } from './ui/SimpleProgressBar';
export { LocalizedText } from './ui/LocalizedText';

// 学習関連コンポーネント
export { default as AudioButton } from './learning/AudioButton';
export { default as PhraseCard } from './learning/PhraseCard';
export { default as QuizOption } from './learning/QuizOption';
export { default as RecordingButton } from './learning/RecordingButton';
export { default as SegmentedText } from './learning/SegmentedText';
export { default as PronunciationResultCard } from './learning/PronunciationResultCard';

// 言語関連コンポーネント
export { LanguageSelector } from './language/LanguageSelector';
export { LanguageChangeToast } from './language/LanguageChangeToast';

// アニメーションコンポーネント
export { AnimatedView } from './animations/AnimatedView';
// 後方互換性のためのエイリアス
export { FadeInView, SlideInView } from './animations/compatibilityAliases';

// 初期化コンポーネント
export { default as AppInitialization } from './AppInitialization'; 