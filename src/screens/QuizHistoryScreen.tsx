import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';
import { useProgress } from '../context/ProgressContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { getCourseById } from '../services/contentService';

type QuizHistoryNavProp = NativeStackNavigationProp<MainStackParamList, 'QuizHistory'>;

const QuizHistoryScreen: React.FC = () => {
  const navigation = useNavigation<QuizHistoryNavProp>();
  const { quizLogs } = useProgress();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleSessionPress = (sessionId: string) => {
    navigation.navigate('QuizHistoryDetail', { sessionId });
  };

  if (!quizLogs || quizLogs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>完了済みのクイズ履歴がありません。</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>クイズ履歴（完了分のみ）</Title>
      {quizLogs
        .filter((log) => log.status === 'completed')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((log) => {
          const course = getCourseById(log.courseId);
          const courseTitle = course ? course.title : '不明なコース';
          const correctRatio = (log.correctCount / log.totalCount) * 100;
          const dateString = formatDate(new Date(log.date));

          return (
            <TouchableOpacity
              key={log.sessionId}
              activeOpacity={0.8}
              onPress={() => handleSessionPress(log.sessionId)}
            >
              <Card style={styles.card}>
                <Card.Content>
                  <Text style={styles.dateText}>{dateString}</Text>
                  <Title style={styles.courseTitle}>{courseTitle}</Title>

                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>
                      スコア: {log.correctCount}/{log.totalCount}
                    </Text>
                    <Text
                      style={[
                        styles.percentageText,
                        {
                          color:
                            correctRatio >= 80
                              ? '#4CAF50'
                              : correctRatio >= 60
                              ? '#FF9800'
                              : '#F44336',
                        },
                      ]}
                    >
                      {correctRatio.toFixed(1)}%
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
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
    borderRadius: 8,
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
    marginTop: 4,
  },
  scoreText: {
    fontSize: 16,
  },
  percentageText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default QuizHistoryScreen;
