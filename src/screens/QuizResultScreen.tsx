import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SessionStackParamList } from '../navigation/SessionNavigator';
import { useProgress } from '../context/ProgressContext';

type QuizResultScreenRouteProp = RouteProp<SessionStackParamList, 'QuizResult'>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

const QuizResultScreen: React.FC = () => {
  const navigation = useNavigation<RootNavProp>();
  const route = useRoute<QuizResultScreenRouteProp>();
  const { correctCount, totalCount, courseId } = route.params;

  const percentage = Math.round((correctCount / totalCount) * 100);

  const handleRetry = () => {
    if (!courseId) {
      navigation.goBack();
      return;
    }

    navigation.navigate('Session', {
      screen: 'CourseQuiz',
      params: { courseId }
    });
  };

  const handleExit = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>クイズ結果</Title>
          <View style={styles.resultContainer}>
            <Text style={styles.score}>
              {correctCount} / {totalCount}
            </Text>
            <Text style={styles.percentage}>
              正解率: {percentage}%
            </Text>
          </View>
          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              {percentage >= 80
                ? 'おめでとうございます！素晴らしい成績です！'
                : percentage >= 60
                ? 'よく頑張りました！もう少し練習しましょう。'
                : 'もう一度復習して挑戦してみましょう。'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleExit}
          style={[styles.button, styles.exitButton]}
        >
          セッションを終了
        </Button>
        {courseId && (
          <Button
            mode="contained"
            onPress={handleRetry}
            style={[styles.button, styles.retryButton]}
          >
            もう一度挑戦
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 16,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  percentage: {
    fontSize: 20,
    color: '#666',
    marginTop: 8,
  },
  messageContainer: {
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#1976d2',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    paddingVertical: 8,
  },
  exitButton: {
    backgroundColor: '#f44336',
  },
  retryButton: {
    backgroundColor: '#2196F3',
  },
});

export default QuizResultScreen;
