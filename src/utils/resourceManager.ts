// src/utils/resourceManager.ts
// 画像やオーディオなどのリソースを一元管理するユーティリティ

import { AVPlaybackStatus } from 'expo-av';
import { logError } from './errorUtils';

// 画像マッピングの型定義
interface ImageResourceMap {
  [key: string]: any;
}

// 音声ファイルマッピングの型定義
interface AudioResourceMap {
  [key: string]: any;
}

// 画像マッピング
export const ImageResources = {
  // レッスンサムネイル
  lessonImages: {
    'ojigi_aisatsu_business_woman.png': require('../../assets/images/lessons/ojigi_aisatsu_business_woman.png'),
    // 他の画像を追加
  } as ImageResourceMap,
  
  // アイコン
  icons: {
    // アイコン画像があれば追加
  } as ImageResourceMap,
  
  // その他の画像
  misc: {
    // その他の画像
  } as ImageResourceMap,
};

// 音声ファイルマッピング
export const AudioResources: AudioResourceMap = {
  'audio/ohayou_gozaimasu.mp3': require('../../assets/audio/ohayou_gozaimasu.mp3'),
  'audio/ogenki_desu_ka.mp3': require('../../assets/audio/ogenki_desu_ka.mp3'),
  'audio/arigatou_gozaimasu.mp3': require('../../assets/audio/arigatou_gozaimasu.mp3'),
  'audio/hisashiburi.mp3': require('../../assets/audio/hisashiburi.mp3'),
  'audio/ohayou.mp3': require('../../assets/audio/ohayou.mp3'),
  'audio/ohayou_business.mp3': require('../../assets/audio/ohayou_business.mp3'),
  'audio/gozaimasu.mp3': require('../../assets/audio/gozaimasu.mp3'),
  'audio/konnichiwa.mp3': require('../../assets/audio/konnichiwa.mp3'),
  'audio/desu.mp3': require('../../assets/audio/desu.mp3'),
  'audio/kyou.mp3': require('../../assets/audio/kyou.mp3'),
  'audio/watashi.mp3': require('../../assets/audio/watashi.mp3'),
  'audio/watashi_wa_tanaka.mp3': require('../../assets/audio/watashi_wa_tanaka.mp3'),
  'audio/yoroshiku.mp3': require('../../assets/audio/yoroshiku.mp3'),
  'audio/onegai_itashimasu.mp3': require('../../assets/audio/onegai_itashimasu.mp3'),
  'audio/example_morning_1.mp3': require('../../assets/audio/example_morning_1.mp3'),
  'audio/example_konnichiwa_1.mp3': require('../../assets/audio/example_konnichiwa_1.mp3'),
  'audio/example_business_1.mp3': require('../../assets/audio/example_business_1.mp3'),
  'audio/example_intro_1.mp3': require('../../assets/audio/example_intro_1.mp3'),
  'audio/irasshaimase.mp3': require('../../assets/audio/irasshaimase.mp3'),
  // 他の音声ファイルを追加
};

/**
 * 画像リソースを取得する
 * @param path 画像パス
 * @returns 画像リソース
 */
export function getImageSource(path: string): any {
  // パスからファイル名を抽出
  const fileName = path.split('/').pop();
  
  if (!fileName) {
    logError(`Invalid image path: ${path}`, 'warning');
    return null;
  }
  
  // レッスン画像から検索
  if (ImageResources.lessonImages[fileName]) {
    return ImageResources.lessonImages[fileName];
  }
  
  // アイコンから検索
  if (ImageResources.icons[fileName]) {
    return ImageResources.icons[fileName];
  }
  
  // その他の画像から検索
  if (ImageResources.misc[fileName]) {
    return ImageResources.misc[fileName];
  }
  
  // 画像が見つからない場合は警告をログに記録
  logError(`Image not found: ${path}`, 'warning');
  return null;
}

/**
 * 音声ファイルを取得する
 * @param path 音声ファイルパス
 * @returns 音声リソース
 */
export function getAudioResource(path: string): any {
  if (!path) {
    logError('No audio path provided', 'warning');
    return null;
  }
  
  const resource = AudioResources[path];
  if (!resource) {
    logError(`Audio file not found: ${path}`, 'warning');
    return null;
  }
  
  return resource;
} 