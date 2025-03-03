import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Title, Divider, Paragraph } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { useProgress } from '../context/ProgressContext';
import { getCourseById } from '../services/contentService';
import { QuizQuestion } from '../types/contentTypes';
import { AppCard } from '../components';
import { colors, spacing, borderRadius, shadows, commonStyles } from '../theme/theme';
import { formatJapaneseDate } from '../utils/format';

type QuizHistoryDetailRouteProp = RouteProp<MainStackParamList, 'QuizHistoryDetail'>;

const QuizHistoryDetailScreen: React.FC = () => {
  const route = useRoute<QuizHistoryDetailRouteProp>();
  const { sessionId } = route.params;
  const { getQuizSessionById } = useProgress();

  const session = getQuizSessionById(sessionId);
  if (!session) {
    return (
      <View style={[commonStyles.centeredContent, styles.notFoundContainer]}>
        <Text style={styles.notFoundText}>履歴が見つかりませんでした。</Text>
      </View>
    );
  }

  // 対応するコースと問題一覧を取得
  const course = getCourseById(session.courseId);
  const courseTitle = course?.title || '不明なコース';
  const scorePercent = session.totalCount ? Math.round((session.correctCount / session.totalCount) * 100) : 0;

  // スコアに基づいて色を決定する関数
  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return colors.success;
    if (percentage >= 60) return colors.accent;
    return colors.error;
  };

  return (
    <ScrollView style={[commonStyles.container, styles.container]}>
      {/* 履歴全体の情報 */}
      <AppCard style={styles.card}>
        <Title style={styles.title}>履歴詳細</Title>
        <Text style={styles.date}>{formatJapaneseDate(new Date(session.date), true)}</Text>
        <Paragraph style={styles.course}>コース: {courseTitle}</Paragraph>
        <Paragraph style={[styles.score, { color: getScoreColor(scorePercent) }]}>
          スコア: {session.correctCount}/{session.totalCount} ({scorePercent}%)
        </Paragraph>
      </AppCard>

      <Divider style={styles.divider} />

      <Title style={styles.answersHeader}>回答内容</Title>

      {/* session.answers[] をループ */}
      {session.answers.map((answer, idx) => {
        // 該当問題を course.quizQuestions から探す
        let questionData: QuizQuestion | undefined;
        if (course) {
          questionData = course.quizQuestions.find((q) => q.id === answer.questionId);
        }

        // questionData があれば問題文・解説等を表示
        const questionText = questionData?.questionSuffixJp || '問題文が見つかりません';
        const explanation = questionData?.explanation || '';
        const options = questionData?.options || [];
        const correctOptionIndex = questionData?.answerIndex ?? -1;

        // ユーザーが選んだ選択肢のテキスト
        const userSelectedText = answer.selectedOptionIndex !== null && options[answer.selectedOptionIndex]
          ? options[answer.selectedOptionIndex]
          : '選択肢不明';

        // 正解選択肢のテキスト
        const correctText = correctOptionIndex !== -1 && options[correctOptionIndex]
          ? options[correctOptionIndex]
          : '不明';

        return (
          <AppCard key={idx} style={styles.answerCard}>
            {/* 問題番号と正誤 */}
            <Text style={styles.answerHeader}>
              問題 {idx + 1}: {answer.isCorrect ? '○' : '×'}
            </Text>

            {/* 問題文 */}
            <Paragraph style={styles.questionText}>
              {questionText}
            </Paragraph>

            {/* 選択肢と結果 */}
            <Text style={[
              styles.answerResult,
              answer.isCorrect ? styles.correct : styles.incorrect
            ]}>
              {answer.isCorrect ? '正解' : '不正解'}
            </Text>

            {/* 選択肢一覧 */}
            <View style={styles.optionsContainer}>
              {options.map((option, optionIdx) => (
                <Text
                  key={optionIdx}
                  style={[
                    styles.optionText,
                    optionIdx === answer.selectedOptionIndex && styles.selectedOption,
                    optionIdx === correctOptionIndex && styles.correctOption,
                  ]}
                >
                  {optionIdx + 1}. {option}
                  {optionIdx === answer.selectedOptionIndex && ' ← あなたの回答'}
                  {optionIdx === correctOptionIndex && ' ★ 正解'}
                </Text>
              ))}
            </View>

            {/* 解説 */}
            {explanation && (
              <View style={styles.explanationContainer}>
                <Text style={styles.explanationHeader}>解説:</Text>
                <Paragraph style={styles.explanationText}>
                  {explanation}
                </Paragraph>
              </View>
            )}
          </AppCard>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  notFoundContainer: {
    padding: spacing.md,
  },
  notFoundText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  card: {
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  title: {
    fontSize: 20,
    marginBottom: spacing.xs,
    color: colors.text,
  },
  date: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  course: {
    marginBottom: spacing.xs,
    color: colors.text,
  },
  score: {
    marginBottom: spacing.sm,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: spacing.md,
  },
  answersHeader: {
    fontSize: 18,
    marginBottom: spacing.sm,
    color: colors.text,
  },
  answerCard: {
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  answerHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.text,
  },
  questionText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.md,
  },
  answerResult: {
    marginBottom: spacing.sm,
    fontWeight: 'bold',
    fontSize: 15,
  },
  correct: {
    color: colors.success,
  },
  incorrect: {
    color: colors.error,
  },
  optionsContainer: {
    marginBottom: spacing.md,
  },
  optionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  selectedOption: {
    backgroundColor: '#FFF3E0',
    borderRadius: borderRadius.sm,
  },
  correctOption: {
    backgroundColor: '#E8F5E9',
    borderRadius: borderRadius.sm,
  },
  explanationContainer: {
    marginTop: spacing.sm,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  explanationHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: colors.textSecondary,
  },
  explanationText: {
    fontSize: 14,
    color: colors.text,
  },
});

export default QuizHistoryDetailScreen;
