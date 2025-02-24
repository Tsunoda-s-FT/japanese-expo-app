// src/components/AudioButton.tsx

import React, { useState } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { playAudio } from '../utils/audioUtils';
import { colors, borderRadius } from '../theme/theme';

// Propsに audio (string) と style を受け取り、再生処理を行う
export interface AudioButtonProps {
  audioPath?: string;                     // 音声ファイルのパス等
  style?: StyleProp<ViewStyle>;           // 外部からのスタイル上書き用
}

const AudioButton: React.FC<AudioButtonProps> = ({ audioPath, style }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePress = async () => {
    if (isPlaying || !audioPath) return;
    
    setIsPlaying(true);
    
    try {
      await playAudio(audioPath);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <Button
      mode="contained"
      icon={isPlaying ? 'volume-high' : 'play-circle'}
      onPress={handlePress}
      style={[styles.button, style]}
      labelStyle={styles.label}
      loading={isPlaying}
      disabled={isPlaying || !audioPath}
    >
      {isPlaying ? '再生中...' : '音声'}
    </Button>
  );
};

export default AudioButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    paddingVertical: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
});
