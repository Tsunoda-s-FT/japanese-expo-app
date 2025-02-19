// src/components/RecordingButton.tsx

import React, { useState } from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';

export interface RecordingButtonProps {
  phraseId?: string;                      // どのフレーズに対する録音か識別したい場合
  style?: StyleProp<ViewStyle>;           // スタイル上書き用
}

const RecordingButton: React.FC<RecordingButtonProps> = ({ phraseId, style }) => {
  const [isRecording, setIsRecording] = useState(false);

  const handleToggleRecording = () => {
    if (!isRecording) {
      console.log(`Start recording for phrase: ${phraseId || '(unknown)'}`);
      // ここで録音API開始の処理など
    } else {
      console.log(`Stop recording for phrase: ${phraseId || '(unknown)'}`);
      // 録音停止→評価API送信など
    }
    setIsRecording((prev) => !prev);
  };

  return (
    <Button
      mode="contained"
      icon={isRecording ? 'stop-circle' : 'microphone'}
      onPress={handleToggleRecording}
      style={[styles.button, style, isRecording && styles.recordingState]}
      labelStyle={styles.label}
    >
      {isRecording ? '録音中...' : '録音開始'}
    </Button>
  );
};

export default RecordingButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    marginVertical: 8,
    backgroundColor: '#2196F3',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  recordingState: {
    backgroundColor: '#F44336',
  },
});
