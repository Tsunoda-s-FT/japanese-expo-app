// src/utils/layoutUtils.ts
// レスポンシブデザインやレイアウト計算のためのユーティリティ

import { Dimensions, PixelRatio, Platform, ScaledSize } from 'react-native';

// 画面サイズの取得
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ピクセル密度
export const PIXEL_DENSITY = PixelRatio.get();

// デザイン基準サイズ（デザインが作成された基準サイズ）
const BASE_WIDTH = 375; // iPhoneの標準的な幅

/**
 * サイズをレスポンシブに変換する
 * @param size 基準サイズ
 * @returns スクリーンサイズに応じたサイズ
 */
export function responsive(size: number): number {
  return Math.round((SCREEN_WIDTH / BASE_WIDTH) * size);
}

/**
 * 画面の向きを取得する
 * @param dimensions 画面サイズ
 * @returns 'portrait' または 'landscape'
 */
export function getOrientation(dimensions = Dimensions.get('window')): 'portrait' | 'landscape' {
  return dimensions.width < dimensions.height ? 'portrait' : 'landscape';
}

/**
 * デバイスがタブレットかどうか判定する
 * @returns タブレットならtrue
 */
export function isTablet(): boolean {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = height / width;
  
  // タブレット判定の基準値
  return (
    // 画面サイズが大きい
    (width >= 768) &&
    // アスペクト比がタブレット的
    (aspectRatio > 1.0 && aspectRatio < 1.5)
  );
}

/**
 * 現在のデバイスに適したスタイル修飾子を返す
 */
export function getPlatformModifier(): 'ios' | 'android' | 'tablet' {
  if (isTablet()) return 'tablet';
  return Platform.OS as 'ios' | 'android';
}

/**
 * 画面サイズ変更イベントのリスナー設定用ヘルパー
 * @param callback 画面サイズ変更時のコールバック
 * @returns イベントリスナーの解除関数
 */
export function addDimensionListener(
  callback: (dimensions: ScaledSize) => void
): () => void {
  const subscription = Dimensions.addEventListener('change', ({ window }) => {
    callback(window);
  });
  
  // 解除関数を返す
  return () => subscription.remove();
} 