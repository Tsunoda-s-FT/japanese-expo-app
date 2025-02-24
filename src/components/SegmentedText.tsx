// src/components/SegmentedText.tsx

import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, Animated } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/theme';

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

const SegmentedText: React.FC<SegmentedTextProps> = ({
  segments,
  style,
  furiganaStyle,
  showPartOfSpeech = false,
}) => {
  if (!segments || segments.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {segments.map((seg, index) => (
        <View 
          key={index} 
          style={[
            styles.segmentBox, 
            getStyleByPartOfSpeech(seg.partOfSpeech),
            animations.fadeIn(index * 150) // アニメーション追加
          ]}
        >
          {seg.reading && (
            <Text style={[styles.reading, furiganaStyle]}>{seg.reading}</Text>
          )}
          <Text style={styles.jpText}>{seg.jpText}</Text>
          {showPartOfSpeech && seg.partOfSpeech && (
            <Text style={styles.partOfSpeech}>{seg.partOfSpeech}</Text>
          )}
        </View>
      ))}
    </View>
  );
};

// パートオブスピーチによって色分けする関数
function getStyleByPartOfSpeech(pos?: string) {
  switch (pos) {
    case 'expression':
      return { 
        backgroundColor: '#E8F5E9',
        borderLeftWidth: 3,
        borderLeftColor: '#4CAF50'
      }; // 薄い緑
    case 'verb':
      return { 
        backgroundColor: '#FFF3E0',
        borderLeftWidth: 3,
        borderLeftColor: '#FF9800'
      }; // 薄いオレンジ
    case 'noun':
      return { 
        backgroundColor: '#E3F2FD',
        borderLeftWidth: 3,
        borderLeftColor: '#2196F3'
      }; // 薄い青
    case 'adverb':
      return { 
        backgroundColor: '#FFFDE7',
        borderLeftWidth: 3,
        borderLeftColor: '#FFC107'
      }; // 薄い黄色
    case 'particle':
      return { 
        backgroundColor: '#E0F7FA',
        borderLeftWidth: 3,
        borderLeftColor: '#00BCD4'
      }; // 薄い水色
    case 'politeSuffix':
      return { 
        backgroundColor: '#F3E5F5',
        borderLeftWidth: 3,
        borderLeftColor: '#9C27B0'
      }; // 薄い紫
    default:
      return { 
        backgroundColor: '#F5F5F5',
        borderLeftWidth: 3,
        borderLeftColor: '#9E9E9E'
      }; // デフォルトはグレー
  }
}

// アニメーションユーティリティ
const animations = {
  fadeIn: (delay: number) => ({
    opacity: 1,
    transform: [{ translateY: 0 }],
    // アニメーションのスタイルなど（実際の実装は React Native Animated を使う）
  })
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  segmentBox: {
    margin: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  reading: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  jpText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text,
  },
  partOfSpeech: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default SegmentedText;
