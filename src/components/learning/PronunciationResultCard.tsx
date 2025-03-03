import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { PronunciationEvaluationResult } from '../../utils/audio';
import AppProgressBar from '../ui/AppProgressBar';
import { colors, spacing, borderRadius, shadows } from '../../theme/theme';

interface Props {
  result: PronunciationEvaluationResult;
}

// 発音評価の詳細結果用の型定義（モックデータ用）
interface PhonemeResult {
  phoneme: string;
  score: number;
  feedback: string;
}

const PronunciationResultCard: React.FC<Props> = ({ result }) => {
  const {
    accuracyScore,
    fluencyScore,
    completenessScore,
    prosodyScore,
    pronScore,
    mispronunciationCount,
    feedback
  } = result;

  // モック用の詳細データ
  const mockDetailedFeedback = "「き」と「し」の発音に注意しましょう。";
  const mockPhonemeResults: PhonemeResult[] = [
    { phoneme: "き", score: 65, feedback: "もう少し舌の位置を高くしてください" },
    { phoneme: "し", score: 70, feedback: "もう少し息を強く出してください" }
  ];
  const mockAdvice = "発音をよくするには、ネイティブの発音をよく聞いて真似してみましょう。口の形や舌の位置に注意して練習すると効果的です。";

  // スコアに応じた色を返す
  const getScoreColor = (score: number): string => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  // スコアに応じたアイコンを返す
  const getScoreIcon = (score: number): string => {
    if (score >= 80) return "check-circle";
    if (score >= 60) return "alert-circle";
    return "close-circle";
  };

  // 総合評価のテキストを返す
  const getOverallFeedback = (): string => {
    if (pronScore >= 80) {
      return '素晴らしい発音です！';
    } else if (pronScore >= 60) {
      return '良い発音です。もう少し練習しましょう。';
    } else {
      return 'もっと練習が必要です。';
    }
  };

  return (
    <View style={styles.container}>
      {/* 総合スコア */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreTitle}>発音スコア</Text>
        <View style={styles.scoreValueContainer}>
          <Text style={[
            styles.scoreValue, 
            { color: getScoreColor(pronScore) }
          ]}>
            {pronScore}
          </Text>
          <Text style={styles.scoreMax}>/100</Text>
        </View>
        <Icon 
          name={getScoreIcon(pronScore) as any} 
          size={24} 
          color={getScoreColor(pronScore)} 
          style={styles.scoreIcon}
        />
      </View>
      
      {/* フィードバック */}
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackTitle}>フィードバック</Text>
        <Text style={styles.feedbackText}>{feedback || getOverallFeedback()}</Text>
      </View>
      
      {/* 詳細スコア */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>詳細スコア</Text>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>正確さ</Text>
          <View style={styles.progressContainer}>
            <AppProgressBar progress={accuracyScore / 100} />
            <Text style={styles.progressValue}>{accuracyScore}</Text>
          </View>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>流暢さ</Text>
          <View style={styles.progressContainer}>
            <AppProgressBar progress={fluencyScore / 100} />
            <Text style={styles.progressValue}>{fluencyScore}</Text>
          </View>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>完全性</Text>
          <View style={styles.progressContainer}>
            <AppProgressBar progress={completenessScore / 100} />
            <Text style={styles.progressValue}>{completenessScore}</Text>
          </View>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>抑揚</Text>
          <View style={styles.progressContainer}>
            <AppProgressBar progress={prosodyScore / 100} />
            <Text style={styles.progressValue}>{prosodyScore}</Text>
          </View>
        </View>
      </View>
      
      {/* 発音ミス */}
      {mispronunciationCount > 0 && (
        <View style={styles.mispronunciationContainer}>
          <Text style={styles.mispronunciationTitle}>
            発音ミス: {mispronunciationCount}箇所
          </Text>
          
          {mockDetailedFeedback && (
            <Text style={styles.mispronunciationText}>
              {mockDetailedFeedback}
            </Text>
          )}
          
          {mockPhonemeResults && mockPhonemeResults.length > 0 && (
            <View style={styles.phonemeContainer}>
              {mockPhonemeResults.map((phoneme: PhonemeResult, index: number) => (
                <View key={index} style={styles.phonemeItem}>
                  <Text style={[
                    styles.phonemeText,
                    { color: getScoreColor(phoneme.score) }
                  ]}>
                    {phoneme.phoneme}: {phoneme.score}
                  </Text>
                  <Text style={styles.phonemeFeedback}>
                    {phoneme.feedback}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
      
      {/* アドバイス */}
      <View style={styles.adviceContainer}>
        <Text style={styles.adviceTitle}>改善のヒント</Text>
        <Text style={styles.adviceText}>
          {mockAdvice}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.md,
    ...shadows.medium,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  scoreValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreMax: {
    fontSize: 18,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  scoreIcon: {
    marginTop: spacing.xs,
  },
  feedbackContainer: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  feedbackText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  detailsContainer: {
    marginBottom: spacing.md,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    width: 60,
    fontSize: 14,
    color: colors.text,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressValue: {
    width: 30,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'right',
    marginLeft: spacing.xs,
  },
  mispronunciationContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.05)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  mispronunciationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: spacing.xs,
  },
  mispronunciationText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  phonemeContainer: {
    marginTop: spacing.xs,
  },
  phonemeItem: {
    marginBottom: spacing.xs,
  },
  phonemeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  phonemeFeedback: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  adviceContainer: {
    backgroundColor: 'rgba(33, 150, 243, 0.05)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.info,
    marginBottom: spacing.xs,
  },
  adviceText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});

export default PronunciationResultCard; 