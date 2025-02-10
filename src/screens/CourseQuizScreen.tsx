import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, BackHandler } from 'react-native';
import { Card, Title, Button, Text, ActivityIndicator, ProgressBar, RadioButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SessionStackParamList } from '../navigation/SessionNavigator';
import { getCourseById } from '../services/contentService';
import { useProgress } from '../context/ProgressContext';
import { Course, QuizQuestion } from '../types/contentTypes';

type CourseQuizScreenRouteProp = RouteProp<SessionStackParamList, 'CourseQuiz'>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

const CourseQuizScreen: React.FC = () => {
  const navigation = useNavigation<RootNavProp>();
  const route = useRoute<CourseQuizScreenRouteProp>();
  const { courseId } = route.params;
  const { 
    markQuizCompleted,
    createNewQuizSession,
    addAnswerToQuizSession,
    finalizeQuizSession,
    abortQuizSession,
    getQuizSessionById,
  } = useProgress();

  // コース情報 & 問題リスト
  const [course, setCourse] = useState<Course | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ユーザーが選んだオプション
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // スコア計算用
  const [correctCount, setCorrectCount] = useState(0);

  // ローディング中かどうか
  const [loading, setLoading] = useState(true);

  // クイズセッション管理
  const [sessionId, setSessionId] = useState<string | null>(null);

  const showExitConfirmation = () => {
    Alert.alert(
      'クイズを中断しますか？',
      'クイズを中断して呼び出し元の画面に戻ります',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '中断する',
          style: 'destructive',
          onPress: () => {
            if (sessionId) {
              abortQuizSession(sessionId, currentIndex);
            }
            // モーダル全体を閉じるために親ナビゲーションのgoBackを呼び出す
            navigation.getParent()?.goBack();
          },
        },
      ]
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const courseData = await getCourseById(courseId);
        if (!courseData) {
          console.error('Course not found:', courseId);
          setLoading(false);
          return;
        }

        setCourse(courseData);
        setQuestions(courseData.quizQuestions);
        setLoading(false);

        // 新しいクイズセッションを作成
        const newSessionId = await createNewQuizSession(courseId);
        setSessionId(newSessionId);
      } catch (error) {
        console.error('Error loading course data:', error);
        setLoading(false);
      }
    };

    loadData();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      showExitConfirmation();
      return true;
    });

    return () => backHandler.remove();
  }, [courseId, navigation, sessionId, currentIndex]);

  /**
   * 回答ボタンを押すと実行
   */
  const handleAnswer = async () => {
    if (!questions[currentIndex] || !sessionId || selectedOption === null) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.answerIndex;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    // 回答を記録
    await addAnswerToQuizSession(
      sessionId,
      currentQuestion.id,
      selectedOption,
      isCorrect
    );

    // 最後の問題だった場合
    if (currentIndex >= questions.length - 1) {
      const finalCorrectCount = isCorrect ? correctCount + 1 : correctCount;
      await finalizeQuizSession(sessionId);
      
      navigation.navigate('Session', {
        screen: 'QuizResult',
        params: {
          correctCount: finalCorrectCount,
          totalCount: questions.length,
          courseId,
        }
      });
    } else {
      // 次の問題へ
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
    }
  };

  // ロード中の表示
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 問題が無い場合の表示
  if (!course || questions.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>クイズが見つかりません。</Text>
      </View>
    );
  }

  // 現在の問題
  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;

  return (
    <View style={styles.container}>
      {/* プログレスバー */}
      <ProgressBar progress={progress} style={styles.progressBar} />
      <Text style={styles.progressText}>
        {currentIndex + 1} / {questions.length}
      </Text>

      {/* 問題カード */}
      <Card style={styles.questionCard}>
        <Card.Content>
          <Text style={styles.question}>{currentQuestion.question}</Text>

          {/* 選択肢 (RadioButton) */}
          <RadioButton.Group
            onValueChange={(val) => setSelectedOption(Number(val))}
            value={selectedOption?.toString() || ''}
          >
            {currentQuestion.options.map((opt, idx) => (
              <RadioButton.Item
                key={idx}
                label={opt}
                value={idx.toString()}
                style={styles.radioItem}
              />
            ))}
          </RadioButton.Group>

          {/* 回答 or 次へ ボタン */}
          <Button
            mode="contained"
            onPress={handleAnswer}
            disabled={selectedOption === null}
            style={styles.button}
          >
            回答する
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default CourseQuizScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  progressBar: {
    marginBottom: 8,
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  questionCard: {
    marginBottom: 16,
  },
  question: {
    fontSize: 18,
    marginBottom: 16,
  },
  radioItem: {
    marginVertical: 4,
  },
  button: {
    marginTop: 16,
  },
});
