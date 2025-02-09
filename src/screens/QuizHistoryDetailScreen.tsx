import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProgress } from '../context/ProgressContext';
import { getCourseById } from '../services/contentService';
import { QuizQuestion } from '../types/contentTypes';

type QuizHistoryDetailRouteProp = RouteProp<RootStackParamList, 'QuizHistoryDetail'>;

const QuizHistoryDetailScreen: React.FC = () => {
  const route = useRoute<QuizHistoryDetailRouteProp>();
  const { sessionId } = route.params;
  const { getQuizSessionById } = useProgress();

  const session = getQuizSessionById(sessionId);
  if (!session) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>履歴が見つかりませんでした。</Text>
      </View>
    );
  }

  // 対応するコースと問題一覧を取得
  const course = getCourseById(session.courseId);
  const courseTitle = course?.title || '不明なコース';
  const scorePercent = session.totalCount ? Math.round((session.correctCount / session.totalCount) * 100) : 0;
  const dateLabel = new Date(session.date).toLocaleString('ja-JP');

  return (
    <ScrollView style={styles.container}>
      {/* 履歴全体の情報 */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>履歴詳細</Title>
          <Text style={styles.date}>{dateLabel}</Text>
          <Paragraph style={styles.course}>コース: {courseTitle}</Paragraph>
          <Paragraph style={styles.score}>
            スコア: {session.correctCount}/{session.totalCount} ({scorePercent}%)
          </Paragraph>
        </Card.Content>
      </Card>

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
        const questionText = questionData?.question || '問題文が見つかりません';
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
          <Card key={idx} style={styles.answerCard}>
            <Card.Content>
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
            </Card.Content>
          </Card>
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notFoundText: {
    color: '#666',
    fontSize: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    marginBottom: 6,
  },
  date: {
    color: '#999',
    marginBottom: 8,
  },
  course: {
    marginBottom: 4,
    color: '#444',
  },
  score: {
    marginBottom: 8,
    color: '#444',
  },
  divider: {
    marginVertical: 16,
  },
  answersHeader: {
    fontSize: 18,
    marginBottom: 8,
  },
  answerCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  answerHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 12,
  },
  answerResult: {
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 15,
  },
  correct: {
    color: '#4CAF50',
  },
  incorrect: {
    color: '#F44336',
  },
  optionsContainer: {
    marginBottom: 12,
  },
  optionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  selectedOption: {
    backgroundColor: '#FFF3E0',
    borderRadius: 4,
  },
  correctOption: {
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
  },
  explanationContainer: {
    marginTop: 8,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 4,
  },
  explanationHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#666',
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
  },
});

export default QuizHistoryDetailScreen;
