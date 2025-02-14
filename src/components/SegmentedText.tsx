// src/components/SegmentedText.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface Segment {
  jpText: string;
  reading?: string;
  partOfSpeech?: string;
}

interface SegmentedTextProps {
  segments: Segment[];
}

const SegmentedText: React.FC<SegmentedTextProps> = ({ segments }) => {
  // ログを追加:
  console.log('[SegmentedText] rendered with segments:', JSON.stringify(segments, null, 2));

  return (
    <View style={styles.container}>
      {segments.map((seg, index) => {
        const bgColor = getColorByPartOfSpeech(seg.partOfSpeech);
        const readingStr = seg.reading ?? '';

        // 各文節ごとにログを追加
        console.log(`[SegmentedText] segment #${index} = jpText="${seg.jpText}", reading="${seg.reading}", partOfSpeech="${seg.partOfSpeech}"`);

        return (
          <View key={index} style={[styles.segmentBox, { backgroundColor: bgColor }]}>
            <Text style={styles.furigana}>{readingStr}</Text>
            <Text style={styles.jpText}>{seg.jpText}</Text>
          </View>
        );
      })}
    </View>
  );
};

function getColorByPartOfSpeech(pos?: string): string {
  switch (pos) {
    case 'expression':
      return '#C8E6C9';
    case 'verb':
      return '#FFE0B2';
    case 'noun':
      return '#BBDEFB';
    case 'auxVerb':
    case 'copula':
    case 'politeSuffix':
      return '#F0F4C3';
    case 'adverb':
      return '#FFECB3';
    case 'question':
      return '#F8BBD0';
    default:
      return '#E0E0E0';
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  segmentBox: {
    margin: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  furigana: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  jpText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  }
});

export default SegmentedText;
