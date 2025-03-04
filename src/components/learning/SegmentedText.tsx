import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme/theme';

// Segmentの型定義
export interface Segment {
  jpText: string;
  reading?: string;
  partOfSpeech?: string;
  segmentType?: string;  // ここが重要: segmentTypeをサポート
}

// コンポーネント用のProps
export interface SegmentedTextProps {
  segments: Segment[];
  style?: StyleProp<ViewStyle>;
  furiganaStyle?: StyleProp<TextStyle>;
  showPartOfSpeech?: boolean;
  colorBySegmentType?: boolean;  // 追加: 文節タイプで色分けするかどうか
}

/**
 * 日本語テキストを分かち書きして、各単語にふりがなを表示するコンポーネント
 */
const SegmentedText: React.FC<SegmentedTextProps> = ({
  segments,
  style,
  furiganaStyle,
  showPartOfSpeech = false,
  colorBySegmentType = true,  // デフォルトで文節タイプによる色分け
}) => {
  return (
    <View style={[styles.container, style]}>
      {segments.map((segment, index) => (
        <View 
          key={index} 
          style={[
            styles.segment,
            // 色分けのロジック: 文節タイプか品詞に基づく
            colorBySegmentType && segment.segmentType 
              ? getStyleBySegmentType(segment.segmentType)
              : getStyleByPartOfSpeech(segment.partOfSpeech)
          ]}
        >
          {segment.reading && (
            <Text style={[styles.furigana, furiganaStyle]}>
              {segment.reading}
            </Text>
          )}
          <Text style={styles.mainText}>
            {segment.jpText}
          </Text>
          {showPartOfSpeech && segment.partOfSpeech && (
            <Text style={styles.partOfSpeech}>
              {segment.partOfSpeech}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

// 品詞によってスタイルを変える（既存関数）
function getStyleByPartOfSpeech(pos?: string) {
  switch (pos) {
    case '名詞':
    case 'noun':
      return styles.noun;
    case '動詞':
    case 'verb':
      return styles.verb;
    case '形容詞':
    case 'adjective':
      return styles.adjective;
    case '助詞':
    case 'particle':
      return styles.particle;
    case '助動詞':
    case 'auxiliary':
      return styles.auxiliary;
    case '副詞':
    case 'adverb':
      return styles.adverb;
    case '接続詞':
    case 'conjunction':
      return styles.conjunction;
    case '代名詞':
    case 'pronoun':
      return styles.pronoun;
    case '表現':
    case 'expression':
      return styles.expression;
    default:
      return {};
  }
}

// 新しい関数: 文節タイプによってスタイルを変える
function getStyleBySegmentType(type?: string) {
  switch (type) {
    case 'base':
      return styles.baseSegment;
    case 'polite_suffix':
      return styles.politeSuffix;
    case 'honorific_prefix':
      return styles.honorificPrefix;
    case 'honorific_form':
      return styles.honorificForm;
    case 'humble_form':
      return styles.humbleForm;
    case 'negative_form':
      return styles.negativeForm;
    case 'past_form':
      return styles.pastForm;
    case 'te_form':
      return styles.teForm;
    case 'fixed_expression':
      return styles.fixedExpression;
    default:
      return {};
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  segment: {
    marginHorizontal: 2,
    marginBottom: 8,
    alignItems: 'center',
    padding: 4,
    borderRadius: 4,
  },
  furigana: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    height: 14,
  },
  mainText: {
    fontSize: 20,
    color: colors.text,
  },
  partOfSpeech: {
    fontSize: 8,
    color: colors.textSecondary,
    marginTop: 2,
  },
  
  // 品詞別スタイル（既存）
  noun: {
    backgroundColor: 'rgba(144, 202, 249, 0.2)', // 薄い青
  },
  verb: {
    backgroundColor: 'rgba(129, 199, 132, 0.2)', // 薄い緑
  },
  adjective: {
    backgroundColor: 'rgba(255, 183, 77, 0.2)', // 薄いオレンジ
  },
  particle: {
    backgroundColor: 'rgba(224, 224, 224, 0.5)', // 薄いグレー
  },
  auxiliary: {
    backgroundColor: 'rgba(186, 104, 200, 0.2)', // 薄い紫
  },
  adverb: {
    backgroundColor: 'rgba(255, 138, 128, 0.2)', // 薄い赤
  },
  conjunction: {
    backgroundColor: 'rgba(255, 213, 79, 0.2)', // 薄い黄色
  },
  pronoun: {
    backgroundColor: 'rgba(77, 208, 225, 0.2)', // 薄い水色
  },
  expression: {
    backgroundColor: 'rgba(139, 195, 74, 0.2)', // 薄い緑
  },
  
  // 新しい文節タイプ別スタイル
  baseSegment: {
    backgroundColor: 'rgba(33, 150, 243, 0.15)', // 青
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(33, 150, 243, 0.6)',
  },
  politeSuffix: {
    backgroundColor: 'rgba(156, 39, 176, 0.15)', // 紫
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(156, 39, 176, 0.6)',
  },
  honorificPrefix: {
    backgroundColor: 'rgba(233, 30, 99, 0.15)', // ピンク
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(233, 30, 99, 0.6)',
  },
  honorificForm: {
    backgroundColor: 'rgba(233, 30, 99, 0.15)', // ピンク
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(233, 30, 99, 0.6)',
  },
  humbleForm: {
    backgroundColor: 'rgba(0, 188, 212, 0.15)', // シアン
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0, 188, 212, 0.6)',
  },
  negativeForm: {
    backgroundColor: 'rgba(244, 67, 54, 0.15)', // 赤
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(244, 67, 54, 0.6)',
  },
  pastForm: {
    backgroundColor: 'rgba(121, 85, 72, 0.15)', // 茶
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(121, 85, 72, 0.6)',
  },
  teForm: {
    backgroundColor: 'rgba(255, 152, 0, 0.15)', // オレンジ
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 152, 0, 0.6)',
  },
  fixedExpression: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)', // 緑
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(76, 175, 80, 0.6)',
  }
});

export default SegmentedText;