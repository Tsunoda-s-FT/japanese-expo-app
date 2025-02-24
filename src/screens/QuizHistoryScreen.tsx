import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Text } from 'react-native-paper';
import { useProgress } from '../context/ProgressContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { getCourseById } from '../services/contentService';
import AppCard from '../components/ui/AppCard';
import { colors, spacing, shadows } from '../theme/theme';
import { commonStyles } from '../theme/styles';
import { formatJapaneseDate } from '../utils/formatUtils';

type QuizHistoryNavProp = NativeStackNavigationProp<MainStackParamList, 'QuizHistory'>;

const QuizHistoryScreen: React.FC = () => {
  const navigation = useNavigation<QuizHistoryNavProp>();
  const { quizLogs } = useProgress();

  const handleSessionPress = (sessionId: string) => {
    navigation.navigate('QuizHistoryDetail', { sessionId });
  };

  // スコアに基づいて色を決定する関数
  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return colors.success;
    if (percentage >= 60) return colors.accent;
    return colors.error;
  };

  if (!quizLogs || quizLogs.length === 0) {
    return (
      <View style={[commonStyles.centeredContent, styles.emptyContainer]}>
        <Text style={styles.emptyText}>完了済みのクイズ履歴がありません。</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[commonStyles.container, styles.container]}>
      <Title style={styles.header}>クイズ履歴（完了分のみ）</Title>
      {quizLogs
        .filter((log) => log.status === 'completed')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((log) => {
          const course = getCourseById(log.courseId);
          const courseTitle = course ? course.title : '不明なコース';
          const correctRatio = (log.correctCount / log.totalCount) * 100;

          return (
            <AppCard
              key={log.sessionId}
              onPress={() => handleSessionPress(log.sessionId)}
              style={styles.card}
            >
              <Text style={styles.dateText}>
                {formatJapaneseDate(new Date(log.date), true)}
              </Text>
              <Title style={styles.courseTitle}>{courseTitle}</Title>

              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>
                  スコア: {log.correctCount}/{log.totalCount}
                </Text>
                <Text
                  style={[
                    styles.percentageText,
                    { color: getScoreColor(correctRatio) }
                  ]}
                >
                  {correctRatio.toFixed(1)}%
                </Text>
              </View>
            </AppCard>
          );
        })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  emptyContainer: {
    padding: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: spacing.md,
    textAlign: 'center',
    color: colors.text,
  },
  card: {
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  dateText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  courseTitle: {
    fontSize: 18,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  scoreText: {
    fontSize: 16,
    color: colors.text,
  },
  percentageText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default QuizHistoryScreen;
