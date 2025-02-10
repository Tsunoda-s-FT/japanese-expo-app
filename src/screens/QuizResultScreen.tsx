import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SessionStackParamList } from '../navigation/SessionNavigator';
import { useProgress } from '../context/ProgressContext';
import { useNavigation as useNavigationContext } from '../context/NavigationContext';

type QuizResultScreenRouteProp = RouteProp<SessionStackParamList, 'QuizResult'>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

const QuizResultScreen: React.FC = () => {
  const navigation = useNavigation<RootNavProp>();
  const route = useRoute<QuizResultScreenRouteProp>();
  const { correctCount, totalCount, courseId } = route.params;
  const { setAfterSessionCourseId } = useNavigationContext();

  const percentage = Math.round((correctCount / totalCount) * 100);

  const handleRetry = () => {
    if (!courseId) {
      navigation.goBack(); // モーダルを閉じる
      return;
    }

    // クイズを再チャレンジする場合は同じセッション内で遷移
    navigation.navigate('Session', {
      screen: 'CourseQuiz',
      params: { courseId }
    });
  };

  const handleBack = () => {
    if (courseId) {
      // コース詳細への遷移をセット
      setAfterSessionCourseId(courseId);
    }
    // モーダルを閉じる（MainStackに戻る）
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>クイズ結果</Title>
          <View style={styles.resultContainer}>
            <Text style={styles.score}>{percentage}%</Text>
            <Paragraph style={styles.detail}>
              {totalCount}問中{correctCount}問正解
            </Paragraph>
          </View>

          {percentage === 100 ? (
            <Text style={styles.message}>完璧です！おめでとうございます！</Text>
          ) : percentage >= 80 ? (
            <Text style={styles.message}>素晴らしい成績です！</Text>
          ) : percentage >= 60 ? (
            <Text style={styles.message}>よく頑張りました！</Text>
          ) : (
            <Text style={styles.message}>もう一度チャレンジしてみましょう！</Text>
          )}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleBack}
          style={[styles.button, styles.backButton]}
        >
          {courseId ? 'コース詳細に戻る' : 'コース一覧に戻る'}
        </Button>
        {courseId && (
          <Button
            mode="contained"
            onPress={handleRetry}
            style={[styles.button, styles.retryButton]}
          >
            もう一度挑戦する
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
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  detail: {
    fontSize: 18,
    marginTop: 8,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
    color: '#4CAF50',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  button: {
    paddingVertical: 8,
  },
  backButton: {
    backgroundColor: '#666',
  },
  retryButton: {
    backgroundColor: '#2196F3',
  },
});

export default QuizResultScreen;
