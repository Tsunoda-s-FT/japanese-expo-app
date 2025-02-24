// src/components/RecordingButton.tsx

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, ActivityIndicator, Text } from 'react-native-paper';
import { evaluatePronunciationMock, PronunciationEvaluationResult } from '../services/speechService';
import { colors, spacing, borderRadius } from '../theme/theme';

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
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>発音を評価しています...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  button: {
    borderRadius: borderRadius.round,
    backgroundColor: colors.info,
  },
  recording: {
    backgroundColor: colors.error,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default RecordingButton;
