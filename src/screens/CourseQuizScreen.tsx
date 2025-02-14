import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, BackHandler, ScrollView } from 'react-native';
import { Card, Title, Button, Text, ActivityIndicator, ProgressBar, RadioButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SessionStackParamList } from '../navigation/SessionNavigator';
import { getCourseById } from '../services/contentService';
import { useProgress } from '../context/ProgressContext';
import { Course, QuizQuestion } from '../types/contentTypes';
import SegmentedText from '../components/SegmentedText';
import { useTheme } from 'react-native-paper';

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
  const theme = useTheme();

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
        console.log('[CourseQuizScreen] getCourseById result:', JSON.stringify(courseData, null, 2));

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
        console.log('[CourseQuizScreen] Created new quiz session:', newSessionId);
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
  }, [courseId, navigation]);

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

  const renderQuestionText = () => {
    if (!questions[currentIndex] || !course) return null;

    const currentQuestion = questions[currentIndex];
    console.log('[CourseQuizScreen] currentQuestion:', currentQuestion);

    const linkedPhrase = course.phrases.find(p => p.id === currentQuestion.linkedPhraseId);
    console.log('[CourseQuizScreen] linkedPhrase =', JSON.stringify(linkedPhrase, null, 2));

    if (!linkedPhrase) {
      console.log('[CourseQuizScreen] No linkedPhrase found for', currentQuestion.linkedPhraseId);
      return null;
    }

    console.log('[CourseQuizScreen] linkedPhrase.segments:', linkedPhrase.segments);

    return (
      <View style={styles.questionContainer}>
        {linkedPhrase.segments && linkedPhrase.segments.length > 0 ? (
          <SegmentedText segments={linkedPhrase.segments} />
        ) : (
          <Text style={styles.phraseText}>{linkedPhrase.jpText}</Text>
        )}
        <Text style={styles.questionText}>{currentQuestion.questionSuffixJp}</Text>
      </View>
    );
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
      <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
      <Text style={styles.progressText}>
        {currentIndex + 1} / {questions.length}
      </Text>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            {/* リンクされたフレーズの文節表示 */}
            {course && currentQuestion && (
              <View style={styles.questionContainer}>
                {renderQuestionText()}
                {/* 3. 選択肢 */}
                <RadioButton.Group
                  onValueChange={(value) => setSelectedOption(Number(value))}
                  value={selectedOption?.toString() || ''}
                >
                  {currentQuestion.options.map((option, index) => (
                    <RadioButton.Item
                      key={index}
                      label={option}
                      value={index.toString()}
                      disabled={isSubmitted}
                      style={[
                        styles.radioItem,
                        isSubmitted && index === currentQuestion.answerIndex && styles.correctAnswer,
                        isSubmitted && selectedOption === index && selectedOption !== currentQuestion.answerIndex && styles.wrongAnswer
                      ]}
                      labelStyle={[
                        styles.radioLabel,
                        isSubmitted && index === currentQuestion.answerIndex && styles.correctAnswerText,
                        isSubmitted && selectedOption === index && selectedOption !== currentQuestion.answerIndex && styles.wrongAnswerText
                      ]}
                    />
                  ))}
                </RadioButton.Group>

                {/* 4. 回答/次へボタン */}
                {!isSubmitted ? (
                  <Button
                    mode="contained"
                    onPress={handleAnswer}
                    disabled={selectedOption === null}
                    style={styles.actionButton}
                  >
                    回答する
                  </Button>
                ) : (
                  <>
                    {/* 5. 解説 */}
                    <View style={styles.explanationContainer}>
                      <Text style={[
                        styles.resultText,
                        isCorrect ? styles.correctText : styles.incorrectText
                      ]}>
                        {isCorrect ? '正解！' : '不正解...'}
                      </Text>
                      <Text style={styles.explanationText}>
                        {currentQuestion.explanation}
                      </Text>
                    </View>
                    <Button
                      mode="contained"
                      onPress={handleNext}
                      style={styles.actionButton}
                    >
                      {currentIndex < questions.length - 1 ? '次へ' : '結果を見る'}
                    </Button>
                  </>
                )}
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

export default CourseQuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  progressBar: {
    marginVertical: 8,
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  questionContainer: {
    marginBottom: 16,
  },
  phraseText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  radioItem: {
    marginVertical: 4,
    borderRadius: 8,
  },
  radioLabel: {
    fontSize: 16,
  },
  correctAnswer: {
    backgroundColor: '#E8F5E9',
  },
  wrongAnswer: {
    backgroundColor: '#FFEBEE',
  },
  correctAnswerText: {
    color: '#2E7D32',
  },
  wrongAnswerText: {
    color: '#C62828',
  },
  actionButton: {
    marginTop: 24,
  },
  explanationContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  correctText: {
    color: '#2E7D32',
  },
  incorrectText: {
    color: '#C62828',
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  errorText: {
    color: '#C62828',
    textAlign: 'center',
    fontSize: 16,
  },
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
});
