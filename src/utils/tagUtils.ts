// src/utils/tagUtils.ts
// 多言語タグ情報と関連ユーティリティ関数

import { LanguageCode } from '../i18n/i18n';
import learningLevelTags from '../../assets/contents/tags/learningLevel.json';
import partOfSpeechTags from '../../assets/contents/tags/partOfSpeech.json';
import politenessLevelTags from '../../assets/contents/tags/politenessLevel.json';
import segmentTypeTags from '../../assets/contents/tags/segmentType.json';
import sentenceTypeTags from '../../assets/contents/tags/sentenceType.json';

// タグタイプのユニオン型
export type TagType = 
  | 'learningLevel' 
  | 'partOfSpeech' 
  | 'politenessLevel' 
  | 'segmentType' 
  | 'sentenceType';

// タグ情報の型定義
export interface TagInfo {
  id: string;
  labels: Record<LanguageCode, string>;
  descriptions?: Record<LanguageCode, string>;
}

/**
 * 指定されたタグタイプの全タグリストを取得
 * @param tagType タグのタイプ
 * @returns タグ情報の配列
 */
export function getTagList(tagType: TagType): TagInfo[] {
  switch (tagType) {
    case 'learningLevel': return learningLevelTags as TagInfo[];
    case 'partOfSpeech': return partOfSpeechTags as TagInfo[];
    case 'politenessLevel': return politenessLevelTags as TagInfo[];
    case 'segmentType': return segmentTypeTags as TagInfo[];
    case 'sentenceType': return sentenceTypeTags as TagInfo[];
    default: return [];
  }
}

/**
 * タグIDからタグ情報を取得
 * @param tagType タグのタイプ
 * @param tagId タグID
 * @returns タグ情報、または未定義
 */
export function getTagById(tagType: TagType, tagId: string): TagInfo | undefined {
  const tagList = getTagList(tagType);
  return tagList.find(tag => tag.id === tagId);
}

/**
 * 各種タグの多言語テキストを取得する
 * @param tagType タグのタイプ
 * @param tagId タグID
 * @param language 言語コード
 * @returns ローカライズされたラベル
 */
export function getLocalizedTagLabel(
  tagType: TagType,
  tagId: string,
  language: LanguageCode = 'ja'
): string {
  const tag = getTagById(tagType, tagId);
  if (!tag || !tag.labels) return tagId;
  
  return tag.labels[language] || tag.labels.ja || tagId;
}

/**
 * 各種タグの多言語説明を取得する
 * @param tagType タグのタイプ
 * @param tagId タグID
 * @param language 言語コード
 * @returns ローカライズされた説明
 */
export function getLocalizedTagDescription(
  tagType: TagType,
  tagId: string,
  language: LanguageCode = 'ja'
): string | undefined {
  const tag = getTagById(tagType, tagId);
  if (!tag || !tag.descriptions) return undefined;
  
  return tag.descriptions[language] || tag.descriptions.ja;
}

/**
 * politenessLevelに基づいた色を取得
 * @param level 丁寧さレベル
 * @returns 対応する色コード
 */
export function getPolitenessLevelColor(level: string): string {
  switch(level) {
    case 'casual': return '#8BC34A'; // 薄い緑
    case 'polite': return '#2196F3'; // 青
    case 'honorific': return '#9C27B0'; // 紫
    case 'humble': return '#FF9800'; // オレンジ
    default: return '#757575'; // グレー
  }
}

/**
 * learningLevelに基づいた色を取得
 * @param level 学習レベル
 * @returns 対応する色コード
 */
export function getLearningLevelColor(level: string): string {
  switch(level) {
    case 'essential': return '#00BCD4'; // シアン
    case 'common': return '#FF9800';    // オレンジ
    case 'advanced': return '#F44336';  // 赤
    default: return '#757575';          // グレー
  }
}

/**
 * partOfSpeechに基づいた色を取得
 * @param partOfSpeech 品詞
 * @returns 対応する色コード
 */
export function getPartOfSpeechColor(partOfSpeech: string): string {
  switch(partOfSpeech) {
    case 'noun': return '#BBDEFB';        // 薄い青
    case 'verb': return '#C8E6C9';        // 薄い緑
    case 'i_adjective': return '#FFECB3'; // 薄い黄色
    case 'na_adjective': return '#FFE0B2'; // 薄いオレンジ
    case 'adverb': return '#FFCCBC';      // 薄い赤
    case 'particle': return '#E1BEE7';    // 薄い紫
    case 'auxiliary': return '#B3E5FC';   // 薄い水色
    case 'conjunction': return '#F8BBD0'; // 薄いピンク
    case 'interjection': return '#D7CCC8'; // 薄い茶色
    case 'prefix': return '#CFD8DC';      // 薄い灰色
    case 'suffix': return '#B0BEC5';      // やや濃い灰色
    case 'expression': return '#C5CAE9';  // 薄い藍色
    default: return '#EEEEEE';            // 薄いグレー
  }
}