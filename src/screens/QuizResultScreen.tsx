import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Title } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SessionStackParamList } from '../navigation/SessionNavigator';
import { useProgress } from '../context/ProgressContext';
import { AppCard, AppButton } from '../components/ui';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';
import { commonStyles } from '../theme/styles';
import { FadeInView, SlideInView } from '../components/animations';

type QuizResultScreenRouteProp = RouteProp<SessionStackParamList, 'QuizResult'>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

const QuizResultScreen: React.FC = () => {
  const navigation = useNavigation<RootNavProp>();
  const route = useRoute<QuizResultScreenRouteProp>();
  const { correctCount, totalCount, courseId } = route.params;

  const percentage = Math.round((correctCount / totalCount) * 100);

  // 結果に基づいて色を決定
  const getResultColor = () => {
    if (percentage >= 80) return colors.success;
    if (percentage >= 60) return colors.accent;
    return colors.error;
  };

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
    // モーダル全体を閉じるために親ナビゲーションのgoBackを呼び出す
    navigation.getParent()?.goBack();
  };

  return (
    <View style={[commonStyles.screenContainer, styles.container]}>
      <FadeInView duration={800}>
        <AppCard style={styles.card}>
          <SlideInView direction="top" duration={600} delay={300}>
            <Title style={styles.title}>クイズ結果</Title>
          </SlideInView>
          
          <SlideInView direction="left" duration={600} delay={600}>
            <View style={styles.resultContainer}>
              <Text style={[styles.score, { color: getResultColor() }]}>
                {correctCount} / {totalCount}
              </Text>
              <Text style={styles.percentage}>
                正解率: {percentage}%
              </Text>
            </View>
          </SlideInView>
          
          <FadeInView duration={800} delay={900}>
            <View style={styles.messageContainer}>
              <Text style={[styles.message, { color: getResultColor() }]}>
                {percentage >= 80
                  ? 'おめでとうございます！素晴らしい成績です！'
                  : percentage >= 60
                  ? 'よく頑張りました！もう少し練習しましょう。'
                  : 'もう一度復習して挑戦してみましょう。'}
              </Text>
            </View>
          </FadeInView>
        </AppCard>
      </FadeInView>

      <SlideInView direction="bottom" duration={600} delay={1200}>
        <View style={styles.buttonContainer}>
          <AppButton
            label="セッションを終了"
            onPress={handleExit}
            variant="primary"
            style={styles.button}
            icon="exit-to-app"
          />
          {courseId && (
            <AppButton
              label="もう一度挑戦"
              onPress={handleRetry}
              variant="secondary"
              style={styles.button}
              icon="refresh"
            />
          )}
        </View>
      </SlideInView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  card: {
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: spacing.md,
    color: colors.text,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  percentage: {
    fontSize: 20,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  messageContainer: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    gap: spacing.md,
  },
  button: {
    marginBottom: spacing.sm,
  },
});

export default QuizResultScreen;
