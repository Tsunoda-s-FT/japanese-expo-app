import React, { useState } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { playAudio } from '../../utils/audio';
import { colors, borderRadius } from '../../theme/theme';

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
    } catch (error) {
      console.error('音声再生エラー:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <Button
      mode="contained"
      icon={isPlaying ? "stop" : "play"}
      onPress={handlePress}
      loading={isPlaying}
      disabled={!audioPath}
      style={[styles.button, style]}
      labelStyle={styles.buttonLabel}
    >
      {isPlaying ? '再生中...' : '音声を聴く'}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
  },
  buttonLabel: {
    fontSize: 14,
    paddingVertical: 2,
  }
});

export default AudioButton; 