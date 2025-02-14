import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

const RecordingButton: React.FC = () => {
  const theme = useTheme();
  const [isRecording, setIsRecording] = useState(false);

  const handleToggleRecording = () => {
    if (!isRecording) {
      // 録音開始（将来的にAPI開始）
      console.log('Start recording...');
    } else {
      // 録音停止＆評価（将来的にAPI送信）
      console.log('Stop recording. Evaluate...');
    }
    setIsRecording((prev) => !prev);
  };

  return (
    <Button
      mode="contained"
      icon={isRecording ? 'stop-circle' : 'microphone'}
      onPress={handleToggleRecording}
      style={[
        styles.button,
        isRecording && styles.recordingMode,
      ]}
      labelStyle={styles.label}
      accessibilityLabel={isRecording ? '録音を停止' : '録音を開始'}
    >
      {isRecording ? '録音中...' : '録音開始'}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    marginVertical: 8,
    backgroundColor: '#2196F3',  // 通常時の色
  },
  recordingMode: {
    backgroundColor: '#e53935',  // 録音中は赤系に
  },
  label: {
    fontSize: 16,
  },
});

export default RecordingButton;
