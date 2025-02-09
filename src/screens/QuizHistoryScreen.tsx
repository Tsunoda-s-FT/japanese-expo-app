import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Title, Divider } from 'react-native-paper';
import { useProgress } from '../context/ProgressContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getCourseById } from '../services/contentService';

type QuizHistoryNavProp = NativeStackNavigationProp<RootStackParamList, 'QuizHistory'>;

const QuizHistoryScreen: React.FC = () => {
  const { quizLogs } = useProgress();
  const navigation = useNavigation<QuizHistoryNavProp>();

  // 完了したクイズのみをフィルタリングし、日付の新しい順にソート
  const completedLogs = quizLogs
    .filter(log => log.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (completedLogs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>完了済みのクイズ履歴がありません。</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>クイズ履歴（完了分のみ）</Title>
      {completedLogs.map((log) => {
        const course = getCourseById(log.courseId);
        const scorePercentage = Math.round((log.correctCount / log.totalCount) * 100);

        return (
          <Card key={log.sessionId} style={styles.card}>
            <Card.Content>
              <Text style={styles.dateText}>{formatDate(log.date)}</Text>
              <Title style={styles.courseTitle}>
                {course?.title || 'Unknown Course'}
              </Title>

              <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>
                  スコア: {log.correctCount}/{log.totalCount}
                </Text>
                <Text style={[
                  styles.percentageText,
                  { color: scorePercentage >= 80 ? '#4CAF50' : scorePercentage >= 60 ? '#FF9800' : '#F44336' }
                ]}>
                  {scorePercentage}%
                </Text>
              </View>

              <Divider style={styles.divider} />

              <Title style={styles.answersTitle}>回答詳細</Title>
              {log.answers.map((answer: { isCorrect: boolean }, index: number) => (
                <View key={index} style={styles.answerItem}>
                  <Text style={[
                    styles.answerText,
                    { color: answer.isCorrect ? '#4CAF50' : '#F44336' }
                  ]}>
                    問題 {index + 1}: {answer.isCorrect ? '○' : '×'}
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  dateText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 16,
  },
  percentageText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  answersTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  answerItem: {
    paddingVertical: 4,
  },
  answerText: {
    fontSize: 14,
  },
});

export default QuizHistoryScreen;
