import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, BackHandler, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
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

  // アニメーション用の状態
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // 選択肢をタップした時のアニメーション
  const animateSelection = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  // 初期値にリセット
  const resetAnimation = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
  };

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

  // 選択肢がタップされた時の処理
  const handleOptionPress = (index: number) => {
    setSelectedOption(index);
    resetAnimation();
    animateSelection();
  };

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
    resetAnimation();
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
                {currentQuestion.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      selectedOption === index && styles.selectedOption,
                      isSubmitted && index === currentQuestion.answerIndex && styles.correctOption,
                      isSubmitted && selectedOption === index && selectedOption !== currentQuestion.answerIndex && styles.incorrectOption
                    ]}
                    onPress={() => handleOptionPress(index)}
                    disabled={isSubmitted}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionContent}>
                      <Text style={styles.optionLetter}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                      <Text style={[
                        styles.optionText,
                        selectedOption === index && styles.selectedOptionText,
                        isSubmitted && index === currentQuestion.answerIndex && styles.correctOptionText,
                        isSubmitted && selectedOption === index && selectedOption !== currentQuestion.answerIndex && styles.incorrectOptionText
                      ]}>
                        {option}
                      </Text>
                    </View>
                    {isSubmitted && index === currentQuestion.answerIndex && (
                      <Icon name="check-circle" size={24} color={colors.success} style={styles.resultIcon} />
                    )}
                    {isSubmitted && selectedOption === index && selectedOption !== currentQuestion.answerIndex && (
                      <Icon name="close-circle" size={24} color={colors.error} style={styles.resultIcon} />
                    )}
                  </TouchableOpacity>
                ))}

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
                    {/* Explanation with animation */}
                    <Animated.View 
                      style={[
                        styles.feedbackContainer,
                        {
                          opacity: fadeAnim,
                          transform: [{ scale: scaleAnim }]
                        }
                      ]}
                    >
                      <View style={[
                        styles.feedbackHeader,
                        isCorrect ? styles.correctFeedback : styles.incorrectFeedback
                      ]}>
                        <Icon 
                          name={isCorrect ? "check-circle" : "alert-circle"} 
                          size={28} 
                          color="#fff" 
                        />
                        <Text style={styles.feedbackTitle}>
                          {isCorrect ? '正解！' : '不正解...'}
                        </Text>
                      </View>
                      <View style={styles.explanationContainer}>
                        <Text style={styles.explanationText}>
                          {currentQuestion.explanation}
                        </Text>
                      </View>
                      <AppButton 
                        label={currentIndex < questions.length - 1 ? '次へ' : '結果を見る'} 
                        onPress={handleNext}
                        variant="primary"
                        icon={currentIndex < questions.length - 1 ? "arrow-right" : "flag-checkered"}
                        style={styles.nextButton}
                      />
                    </Animated.View>
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
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    ...shadows.small,
  },
  questionCounter: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  questionContainer: {
    paddingVertical: spacing.sm,
  },
  phraseContainer: {
    marginBottom: spacing.lg,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  phraseText: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.text,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  optionButton: {
    borderRadius: 12,
    marginVertical: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: colors.border,
    elevation: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10', // 10% opacity
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  correctOption: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
  },
  correctOptionText: {
    color: colors.success,
    fontWeight: 'bold',
  },
  incorrectOption: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  incorrectOptionText: {
    color: colors.error,
    fontWeight: 'bold',
  },
  resultIcon: {
    marginLeft: 8,
  },
  actionButton: {
    marginTop: spacing.lg,
  },
  feedbackContainer: {
    marginTop: spacing.lg,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.small,
  },
  feedbackHeader: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctFeedback: {
    backgroundColor: colors.success,
  },
  incorrectFeedback: {
    backgroundColor: colors.error,
  },
  feedbackTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
  explanationContainer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  explanationText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  nextButton: {
    margin: spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CourseQuizScreen;
