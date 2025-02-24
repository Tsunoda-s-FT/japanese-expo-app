import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { PronunciationEvaluationResult } from '../services/speechService';
import AppProgressBar from './ui/AppProgressBar';
import { colors, spacing, borderRadius } from '../theme/theme';

interface Props {
  result: PronunciationEvaluationResult;
}

const PronunciationResultCard: React.FC<Props> = ({ result }) => {
  const {
    accuracyScore,
    fluencyScore,
    completenessScore,
    prosodyScore,
    pronScore,
    mispronunciationCount,
    omissionCount,
    insertionCount,
    feedback,
  } = result;

  // ランクに応じた色を取得
  const getScoreColor = (score: number): string => {
    if (score >= 90) return colors.success;
    if (score >= 70) return colors.accent;
    if (score >= 50) return colors.warning;
    return colors.error;
  };

  return (
    <View style={styles.container}>
      {/* 総合スコア */}
      <Text style={styles.totalScoreLabel}>総合スコア</Text>
      <View style={styles.totalScoreContainer}>
        <Text style={[styles.totalScore, { color: getScoreColor(pronScore) }]}>
          {pronScore}
        </Text>
        <Text style={styles.maxScore}>/ 100</Text>
      </View>

      {/* 評価項目のスコア */}
      <View style={styles.scoreItemsContainer}>
        <AppProgressBar
          progress={accuracyScore / 100}
          label="正確さ"
          showPercentage={true}
          color={getScoreColor(accuracyScore)}
        />
        <AppProgressBar
          progress={fluencyScore / 100}
          label="なめらかさ"
          showPercentage={true}
          color={getScoreColor(fluencyScore)}
        />
        <AppProgressBar
          progress={completenessScore / 100}
          label="言い切り度"
          showPercentage={true}
          color={getScoreColor(completenessScore)}
        />
        <AppProgressBar
          progress={prosodyScore / 100}
          label="抑揚"
          showPercentage={true}
          color={getScoreColor(prosodyScore)}
        />
      </View>

      {/* エラー集計 */}
      <View style={styles.errorSummaryContainer}>
        <Text style={styles.errorSummaryTitle}>発音エラー</Text>
        <View style={styles.errorItemsRow}>
          <View style={styles.errorItem}>
            <Text style={styles.errorValue}>{mispronunciationCount}</Text>
            <Text style={styles.errorLabel}>誤った発音</Text>
          </View>
          <View style={styles.errorItem}>
            <Text style={styles.errorValue}>{omissionCount}</Text>
            <Text style={styles.errorLabel}>省略</Text>
          </View>
          <View style={styles.errorItem}>
            <Text style={styles.errorValue}>{insertionCount}</Text>
            <Text style={styles.errorLabel}>挿入</Text>
          </View>
        </View>
      </View>

      {/* 一言フィードバック */}
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackText}>
          {feedback}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  totalScoreLabel: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: colors.textSecondary,
  },
  totalScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: spacing.md,
  },
  totalScore: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  maxScore: {
    fontSize: 18,
    marginLeft: 4,
    color: colors.textSecondary,
  },
  scoreItemsContainer: {
    marginBottom: spacing.md,
  },
  errorSummaryContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  errorSummaryTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorItemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  errorItem: {
    alignItems: 'center',
  },
  errorValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.error,
  },
  errorLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  feedbackContainer: {
    backgroundColor: '#FFF8E1',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  feedbackText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default PronunciationResultCard;
