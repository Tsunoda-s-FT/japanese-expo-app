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
  // 回答済みかどうか
  const [isSubmitted, setIsSubmitted] = useState(false);
  // 今の問題が正解だったかどうか
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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

        // 新しいクイズセッションを作成（1回だけ）
        const newSessionId = await createNewQuizSession(courseId);
        console.log('Created new quiz session:', newSessionId); // デバッグログ追加
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
  }, [courseId, navigation]); // sessionIdとcurrentIndexを依存配列から削除

  /**
   * 回答ボタンを押すと実行
   */
  const handleAnswer = async () => {
    if (!questions[currentIndex] || !sessionId || selectedOption === null) {
      console.log('Answer validation failed:', { // デバッグログ追加
        hasQuestion: !!questions[currentIndex],
        sessionId,
        selectedOption,
      });
      return;
    }

    const currentQuestion = questions[currentIndex];
    const correct = selectedOption === currentQuestion.answerIndex;
    
    if (correct) {
      setCorrectCount(prev => prev + 1);
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    // 回答を記録
    console.log('Recording answer:', { // デバッグログ追加
      sessionId,
      questionId: currentQuestion.id,
      selectedOption,
      correct,
    });
    await addAnswerToQuizSession(
      sessionId,
      currentQuestion.id,
      selectedOption,
      correct
    );
  };

  /**
   * 次の問題へ進むボタンを押すと実行
   */
  const handleNext = async () => {
    // 最後の問題だった場合
    if (currentIndex >= questions.length - 1) {
      if (!sessionId) {
        console.error('Cannot finalize quiz: sessionId is null');
        return;
      }
      
      await finalizeQuizSession(sessionId);
      
      navigation.navigate('Session', {
        screen: 'QuizResult',
        params: {
          correctCount,
          totalCount: questions.length,
          courseId,
        }
      });
      return;
    }

    // 次の問題へ
    setCurrentIndex(prev => prev + 1);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(null);
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
                rippleColor="transparent"
                style={styles.radioItem}
              />
            ))}
          </RadioButton.Group>

          {/* 回答後の正誤判定と解説 */}
          {isSubmitted && (
            <View style={styles.resultContainer}>
              <Text style={[styles.resultText, isCorrect ? styles.correctText : styles.incorrectText]}>
                {isCorrect ? '正解！' : '不正解...'}
              </Text>
              <Text style={styles.explanation}>
                {currentQuestion.explanation}
              </Text>
            </View>
          )}

          {/* 回答 or 次へ ボタン */}
          {!isSubmitted ? (
            <Button
              mode="contained"
              onPress={handleAnswer}
              disabled={selectedOption === null}
              style={styles.button}
            >
              回答する
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleNext}
              style={styles.button}
            >
              {currentIndex >= questions.length - 1 ? '結果を見る' : '次へ'}
            </Button>
          )}
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
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 16,
  },
  resultContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  correctText: {
    color: '#4CAF50',
  },
  incorrectText: {
    color: '#F44336',
  },
  explanation: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
});
