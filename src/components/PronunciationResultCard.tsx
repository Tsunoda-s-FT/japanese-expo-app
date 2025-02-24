import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { PronunciationEvaluationResult } from '../services/speechService';

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

  return (
    <View style={styles.container}>
      {/* 総合スコア */}
      <Text style={styles.totalScoreLabel}>総合スコア</Text>
      <View style={styles.totalScoreContainer}>
        <Text style={styles.totalScore}>{pronScore}</Text>
        <Text style={styles.maxScore}>/ 100</Text>
      </View>

      {/* 正確さ */}
      <View style={styles.scoreItem}>
        <Text style={styles.label}>正確さ</Text>
        <ProgressBar progress={accuracyScore / 100} style={styles.progress} />
        <Text style={styles.value}>{accuracyScore} / 100</Text>
      </View>
      {/* なめらかさ */}
      <View style={styles.scoreItem}>
        <Text style={styles.label}>なめらかさ</Text>
        <ProgressBar progress={fluencyScore / 100} style={styles.progress} />
        <Text style={styles.value}>{fluencyScore} / 100</Text>
      </View>
      {/* 言い切り度 */}
      <View style={styles.scoreItem}>
        <Text style={styles.label}>言い切り度</Text>
        <ProgressBar progress={completenessScore / 100} style={styles.progress} />
        <Text style={styles.value}>{completenessScore} / 100</Text>
      </View>
      {/* 抑揚 */}
      <View style={styles.scoreItem}>
        <Text style={styles.label}>抑揚</Text>
        <ProgressBar progress={prosodyScore / 100} style={styles.progress} />
        <Text style={styles.value}>{prosodyScore} / 100</Text>
      </View>

      {/* エラー集計 */}
      <Text style={styles.errorSummary}>
        誤った発音: {mispronunciationCount}{'  '}
        省略: {omissionCount}{'  '}
        挿入: {insertionCount}
      </Text>

      {/* 一言フィードバック */}
      <Text style={styles.feedbackText}>
        {feedback}
      </Text>
    </View>
  );
};

export default PronunciationResultCard;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: '100%',
  },
  totalScoreLabel: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  totalScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  totalScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3F51B5',
  },
  maxScore: {
    fontSize: 18,
    marginLeft: 4,
    color: '#666',
  },
  scoreItem: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  progress: {
    height: 6,
    borderRadius: 3,
  },
  value: {
    fontSize: 14,
    textAlign: 'right',
    marginTop: 2,
    color: '#444',
  },
  errorSummary: {
    marginTop: 16,
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
  },
  feedbackText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
});
