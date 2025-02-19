// src/components/SegmentedText.tsx

import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

// Segmentの型定義(既存の contentTypes と整合するならそちらをimportしてもOK)
export interface Segment {
  jpText: string;
  reading?: string;
  partOfSpeech?: string;
}

// コンポーネント用のPropsに style?: StyleProp<ViewStyle> を追加
export interface SegmentedTextProps {
  segments: Segment[];
  style?: StyleProp<ViewStyle>;
}

const SegmentedText: React.FC<SegmentedTextProps> = ({ segments, style }) => {
  if (!segments || segments.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {segments.map((seg, index) => (
        <View key={index} style={[styles.segmentBox, getStyleByPartOfSpeech(seg.partOfSpeech)]}>
          <Text style={styles.reading}>{seg.reading}</Text>
          <Text style={styles.jpText}>{seg.jpText}</Text>
        </View>
      ))}
    </View>
  );
};

// パートオブスピーチによって色分けする例 (必要に応じてカスタマイズ)
function getStyleByPartOfSpeech(pos?: string) {
  switch (pos) {
    case 'expression':
      return { backgroundColor: '#C8E6C9' };
    case 'verb':
      return { backgroundColor: '#FFE0B2' };
    case 'noun':
      return { backgroundColor: '#BBDEFB' };
    default:
      return { backgroundColor: '#F5F5F5' };
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  segmentBox: {
    margin: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  reading: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  jpText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});

export default SegmentedText;
