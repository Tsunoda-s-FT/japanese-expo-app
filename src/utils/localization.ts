// src/utils/localization.ts

import { LanguageCode } from '../i18n/i18n';
import learningLevelTags from '../../assets/contents/tags/learningLevel.json';
import partOfSpeechTags from '../../assets/contents/tags/partOfSpeech.json';
import politenessLevelTags from '../../assets/contents/tags/politenessLevel.json';
import segmentTypeTags from '../../assets/contents/tags/segmentType.json';
import sentenceTypeTags from '../../assets/contents/tags/sentenceType.json';

/**
 * 各種タグの多言語テキストを取得する
 */
export function getLocalizedTagText(
  tagType: 'learningLevel' | 'partOfSpeech' | 'politenessLevel' | 'segmentType' | 'sentenceType',
  tagId: string,
  language: LanguageCode = 'ja'
): string {
  let tagList;
  
  switch (tagType) {
    case 'learningLevel':
      tagList = learningLevelTags;
      break;
    case 'partOfSpeech':
      tagList = partOfSpeechTags;
      break;
    case 'politenessLevel':
      tagList = politenessLevelTags;
      break;
    case 'segmentType':
      tagList = segmentTypeTags;
      break;
    case 'sentenceType':
      tagList = sentenceTypeTags;
      break;
    default:
      return tagId;
  }
  
  const tag = tagList.find((t: any) => t.id === tagId);
  if (!tag || !tag.labels) return tagId;
  
  return tag.labels[language] || tag.labels.ja || tagId;
}