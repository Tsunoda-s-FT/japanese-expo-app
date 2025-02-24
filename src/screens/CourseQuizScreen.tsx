import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, BackHandler, ScrollView } from 'react-native';
import { Text, Card, RadioButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SessionStackParamList } from '../navigation/SessionNavigator';
import { getCourseById } from '../services/contentService';
import { useProgress } from '../context/ProgressContext';
import { Course, QuizQuestion } from '../types/contentTypes';
import SegmentedText from '../components/SegmentedText';
import AppButton from '../components/ui/AppButton';
import AppProgressBar from '../components/ui/AppProgressBar';
import AppLoading from '../components/ui/AppLoading';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';

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
  }, [courseId]);

  const handleAnswer = async () => {
    if (!questions[currentIndex] || !sessionId || selectedOption === null) {
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
    await addAnswerToQuizSession(
      sessionId,
      currentQuestion.id,
      selectedOption,
      correct
    );
  };

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

  if (loading) {
    return <AppLoading message="クイズを準備中..." />;
  }

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
      {/* Header with progress */}
      <View style={styles.headerContainer}>
        <Text style={styles.questionCounter}>
          質問 {currentIndex + 1} / {questions.length}
        </Text>
        <AppProgressBar progress={progress} height={8} />
      </View>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            {/* Question text and linked phrase */}
            {course && currentQuestion && (
              <View style={styles.questionContainer}>
                {/* Linked phrase */}
                {(() => {
                  const linkedPhrase = course.phrases.find(p => p.id === currentQuestion.linkedPhraseId);
                  if (!linkedPhrase) return null;

                  return (
                    <View style={styles.phraseContainer}>
                      {linkedPhrase.segments && linkedPhrase.segments.length > 0 ? (
                        <SegmentedText segments={linkedPhrase.segments} style={{}} />
                      ) : (
                        <Text style={styles.phraseText}>{linkedPhrase.jpText}</Text>
                      )}
                    </View>
                  );
                })()}

                {/* Question text */}
                <Text style={styles.questionText}>{currentQuestion.questionSuffixJp}</Text>

                {/* Options */}
                <RadioButton.Group
                  onValueChange={(value) => setSelectedOption(Number(value))}
                  value={selectedOption?.toString() || ''}
                >
                  {currentQuestion.options.map((option, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.radioItem,
                        isSubmitted && index === currentQuestion.answerIndex && styles.correctAnswer,
                        isSubmitted && selectedOption === index && selectedOption !== currentQuestion.answerIndex && styles.wrongAnswer
                      ]}
                    >
                      <RadioButton.Item
                        label={option}
                        value={index.toString()}
                        disabled={isSubmitted}
                        labelStyle={[
                          styles.radioLabel,
                          isSubmitted && index === currentQuestion.answerIndex && styles.correctAnswerText,
                          isSubmitted && selectedOption === index && selectedOption !== currentQuestion.answerIndex && styles.wrongAnswerText
                        ]}
                      />
                    </View>
                  ))}
                </RadioButton.Group>

                {/* Answer / Next button */}
                {!isSubmitted ? (
                  <AppButton
                    label="回答する"
                    onPress={handleAnswer}
                    disabled={selectedOption === null}
                    variant="primary"
                    style={styles.actionButton}
                  />
                ) : (
                  <>
                    {/* Explanation */}
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
                    <AppButton
                      label={currentIndex < questions.length - 1 ? '次へ' : '結果を見る'}
                      onPress={handleNext}
                      variant="primary"
                      icon="arrow-right"
                      style={styles.actionButton}
                    />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  questionCounter: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  scrollView: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
    ...shadows.medium,
  },
  questionContainer: {
    padding: spacing.sm,
  },
  phraseContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  phraseText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  questionText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  radioItem: {
    marginVertical: 4,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  radioLabel: {
    fontSize: 16,
    color: colors.text,
  },
  correctAnswer: {
    backgroundColor: '#E8F5E9',
    borderColor: colors.success,
  },
  wrongAnswer: {
    backgroundColor: '#FFEBEE',
    borderColor: colors.error,
  },
  correctAnswerText: {
    color: colors.success,
  },
  wrongAnswerText: {
    color: colors.error,
  },
  actionButton: {
    marginTop: spacing.lg,
  },
  explanationContainer: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  correctText: {
    color: colors.success,
  },
  incorrectText: {
    color: colors.error,
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
  },
});

export default CourseQuizScreen;
