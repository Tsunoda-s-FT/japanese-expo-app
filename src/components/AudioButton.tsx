// src/components/AudioButton.tsx

import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { playAudio } from '../utils/audioUtils';

// Propsに audio (string) と style を受け取り、再生処理を行う
export interface AudioButtonProps {
  audioPath?: string;                     // 音声ファイルのパス等
  style?: StyleProp<ViewStyle>;           // 外部からのスタイル上書き用
}

const AudioButton: React.FC<AudioButtonProps> = ({ audioPath, style }) => {
  const handlePress = () => {
    if (audioPath) {
      playAudio(audioPath);
    } else {
      console.log('No audio path provided');
    }
  };

  return (
    <Button
      mode="contained"
      icon="play-circle"
      onPress={handlePress}
      style={[styles.button, style]}
      labelStyle={styles.label}
    >
      再生
    </Button>
  );
};

export default AudioButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    marginVertical: 8,
    backgroundColor: '#FF5722',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
