import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type QuizResultRouteProp = RouteProp<RootStackParamList, 'QuizResult'>;
type QuizResultNavProp = NativeStackNavigationProp<RootStackParamList, 'QuizResult'>;

const QuizResultScreen: React.FC = () => {
  const route = useRoute<QuizResultRouteProp>();
  const navigation = useNavigation<QuizResultNavProp>();
  const { correctCount, totalCount, courseId } = route.params;

  const scorePercent = ((correctCount / totalCount) * 100).toFixed(0);
  const getScoreMessage = (percent: number): string => {
    if (percent === 100) return '完璧です！おめでとうございます！';
    if (percent >= 80) return '素晴らしい成績です！';
    if (percent >= 60) return 'よく頑張りました！';
    return 'もう一度チャレンジしてみましょう！';
  };

  return (
    <View style={styles.container}>
      <Card style={styles.resultCard}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.scoreText}>
            {totalCount}問中 {correctCount}問正解！
          </Text>
          <Text variant="titleLarge" style={styles.percentText}>
            正答率: {scorePercent}%
          </Text>
          <Text variant="titleMedium" style={styles.messageText}>
            {getScoreMessage(Number(scorePercent))}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        {courseId ? (
          <>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => navigation.navigate('CourseDetail', { courseId })}
            >
              コース詳細に戻る
            </Button>
            <Button
              mode="outlined"
              style={styles.button}
              onPress={() => navigation.navigate('CourseQuiz', { courseId })}
            >
              もう一度チャレンジ
            </Button>
          </>
        ) : (
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('CourseList')}
          >
            コース一覧に戻る
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
    backgroundColor: '#f5f5f5'
  },
  resultCard: {
    marginVertical: 16,
    elevation: 4,
    borderRadius: 8
  },
  scoreText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#2196F3'
  },
  percentText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#4CAF50'
  },
  messageText: {
    textAlign: 'center',
    color: '#666'
  },
  buttonContainer: {
    marginTop: 24
  },
  button: {
    marginBottom: 12
  }
});

export default QuizResultScreen;
