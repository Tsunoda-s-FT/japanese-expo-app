import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { PronunciationEvaluationResult } from '../services/speechService';
import AppProgressBar from './ui/AppProgressBar';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';

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
      {/* 総合スコア - より視覚的なデザインに */}
      <View style={styles.totalScoreSection}>
        <Text style={styles.totalScoreLabel}>総合スコア</Text>
        <View style={styles.scoreCircleContainer}>
          <View style={[
            styles.scoreCircle, 
            { borderColor: getScoreColor(pronScore) }
          ]}>
            <Text style={[
              styles.totalScore, 
              { color: getScoreColor(pronScore) }
            ]}>
              {pronScore}
            </Text>
            <Text style={styles.maxScore}>/ 100</Text>
          </View>
        </View>
      </View>

      {/* 評価項目のスコア - より視覚的にわかりやすく */}
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

      {/* エラー集計 - アイコンと数値でよりビジュアルに */}
      <View style={styles.errorSummaryContainer}>
        <Text style={styles.errorSummaryTitle}>発音エラー</Text>
        <View style={styles.errorItemsRow}>
          <View style={styles.errorItem}>
            <Icon name="close-circle" size={24} color={colors.error} />
            <Text style={styles.errorValue}>{mispronunciationCount}</Text>
            <Text style={styles.errorLabel}>誤った発音</Text>
          </View>
          <View style={styles.errorItem}>
            <Icon name="minus-circle" size={24} color={colors.warning} />
            <Text style={styles.errorValue}>{omissionCount}</Text>
            <Text style={styles.errorLabel}>省略</Text>
          </View>
          <View style={styles.errorItem}>
            <Icon name="plus-circle" size={24} color={colors.info} />
            <Text style={styles.errorValue}>{insertionCount}</Text>
            <Text style={styles.errorLabel}>挿入</Text>
          </View>
        </View>
      </View>

      {/* 一言フィードバック - より目立つデザインに */}
      <View style={styles.feedbackContainer}>
        <Icon name="lightbulb" size={20} color={colors.accent} style={styles.feedbackIcon} />
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
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.medium,
  },
  totalScoreSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  totalScoreLabel: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  scoreCircleContainer: {
    marginTop: 10,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    ...shadows.small,
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
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  errorSummaryTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontWeight: '500',
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
    marginTop: spacing.xs,
    marginBottom: spacing.xs / 2,
    color: colors.text,
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
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  feedbackIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  feedbackText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    flex: 1,
  },
});

export default PronunciationResultCard;
