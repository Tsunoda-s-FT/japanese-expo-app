// src/components/RecordingButton.tsx

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, ActivityIndicator, Text } from 'react-native-paper';
import { evaluatePronunciationMock, PronunciationEvaluationResult } from '../services/speechService';

export interface RecordingButtonProps {
  phraseId?: string;
  style?: any;
  // 評価完了時のコールバック
  onEvaluationComplete?: (result: PronunciationEvaluationResult) => void;
}

const RecordingButton: React.FC<RecordingButtonProps> = ({
  phraseId,
  style,
  onEvaluationComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleToggleRecording = async () => {
    if (!isRecording) {
      // ===== 録音開始 =====
      console.log('Recording started...');
      setIsRecording(true);
    } else {
      // ===== 録音停止 → 発音評価 =====
      console.log('Recording stopped. Evaluating...');
      setIsRecording(false);
      setIsEvaluating(true);
      
      try {
        const r = await evaluatePronunciationMock(phraseId || '', null);
        // 親コンポーネントに結果を渡す
        if (onEvaluationComplete) {
          onEvaluationComplete(r);
        }
      } catch (err) {
        console.error('評価中にエラーが発生しました:', err);
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        icon={isRecording ? 'stop-circle' : 'microphone'}
        onPress={handleToggleRecording}
        style={[styles.button, style, isRecording && styles.recording]}
        disabled={isEvaluating}
      >
        {isEvaluating ? '評価中...' : isRecording ? '録音停止' : '録音開始'}
      </Button>

      {isEvaluating && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" />
          <Text>発音を評価しています...</Text>
        </View>
      )}
    </View>
  );
};

export default RecordingButton;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  button: {
    borderRadius: 24,
    backgroundColor: '#2196F3',
  },
  recording: {
    backgroundColor: '#F44336',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 8,
  },
});
