import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, ActivityIndicator, Text } from 'react-native-paper';
import { evaluatePronunciationMock, PronunciationEvaluationResult } from '../../utils/audio';
import { colors, spacing, borderRadius } from '../../theme/theme';

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
  // 状態管理
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // 録音開始/停止の切り替え
  const handleToggleRecording = async () => {
    if (isRecording) {
      // 録音停止処理
      stopRecording();
    } else {
      // 録音開始処理
      startRecording();
    }
  };

  // 録音開始
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // タイマー開始
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    setTimer(interval);
    
    // ここで実際の録音開始処理を行う
    console.log('録音開始');
  };

  // 録音停止
  const stopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // タイマー停止
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    
    // ここで実際の録音停止処理を行う
    console.log('録音停止');
    
    try {
      // 発音評価処理（モック）
      const result = await evaluatePronunciationMock(phraseId || '', {});
      
      // 結果をコールバックで返す
      if (onEvaluationComplete) {
        onEvaluationComplete(result);
      }
    } catch (error) {
      console.error('発音評価エラー:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 録音時間のフォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, style]}>
      {isProcessing ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.processingText}>発音を分析中...</Text>
        </View>
      ) : (
        <Button
          mode="contained"
          icon={isRecording ? "stop" : "microphone"}
          onPress={handleToggleRecording}
          style={[
            styles.button,
            isRecording && styles.recordingButton
          ]}
          labelStyle={styles.buttonLabel}
        >
          {isRecording ? '録音停止' : '発音を録音'}
        </Button>
      )}
      
      {isRecording && (
        <Text style={styles.timerText}>
          {formatTime(recordingTime)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
  },
  recordingButton: {
    backgroundColor: colors.error,
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
  timerText: {
    marginTop: spacing.sm,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.error,
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  processingText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
  }
});

export default RecordingButton; 