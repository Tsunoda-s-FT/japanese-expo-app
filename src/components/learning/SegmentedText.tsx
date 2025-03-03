import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme/theme';

// Segmentの型定義
export interface Segment {
  jpText: string;
  reading?: string;
  partOfSpeech?: string;
}

// コンポーネント用のProps
export interface SegmentedTextProps {
  segments: Segment[];
  style?: StyleProp<ViewStyle>;
  furiganaStyle?: StyleProp<TextStyle>;
  showPartOfSpeech?: boolean;
}

/**
 * 日本語テキストを分かち書きして、各単語にふりがなを表示するコンポーネント
 * 
 * @example
 * <SegmentedText
 *   segments={[
 *     { jpText: '私', reading: 'わたし', partOfSpeech: '代名詞' },
 *     { jpText: 'は', reading: 'は', partOfSpeech: '助詞' },
 *     { jpText: '日本語', reading: 'にほんご', partOfSpeech: '名詞' },
 *     { jpText: 'を', reading: 'を', partOfSpeech: '助詞' },
 *     { jpText: '勉強', reading: 'べんきょう', partOfSpeech: '名詞' },
 *     { jpText: 'して', reading: 'して', partOfSpeech: '動詞' },
 *     { jpText: 'います', reading: 'います', partOfSpeech: '助動詞' },
 *   ]}
 * />
 */
const SegmentedText: React.FC<SegmentedTextProps> = ({
  segments,
  style,
  furiganaStyle,
  showPartOfSpeech = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      {segments.map((segment, index) => (
        <View 
          key={index} 
          style={[
            styles.segment,
            showPartOfSpeech && getStyleByPartOfSpeech(segment.partOfSpeech)
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

// 品詞によってスタイルを変える
function getStyleByPartOfSpeech(pos?: string) {
  switch (pos) {
    case '名詞':
      return styles.noun;
    case '動詞':
      return styles.verb;
    case '形容詞':
      return styles.adjective;
    case '助詞':
      return styles.particle;
    case '助動詞':
      return styles.auxiliary;
    case '副詞':
      return styles.adverb;
    case '接続詞':
      return styles.conjunction;
    case '代名詞':
      return styles.pronoun;
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
  // 品詞別スタイル
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
});

export default SegmentedText; 