import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, BackHandler } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SessionStackParamList } from '../navigation/SessionNavigator';
import { getCourseById, getLessonForCourse } from '../services/contentService';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { Course, Phrase } from '../types/contentTypes';
import { PronunciationEvaluationResult } from '../utils/audio';
import { AppButton, AppProgressBar, AppLoading } from '../components';
import EnhancedPhraseCard from '../components/learning/EnhancedPhraseCard';
import AudioButton from '../components/learning/AudioButton';
import RecordingButton from '../components/learning/RecordingButton';
import PronunciationResultCard from '../components/learning/PronunciationResultCard';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';

type CourseLearningScreenRouteProp = RouteProp<SessionStackParamList, 'CourseLearning'>;
type SessionNavProp = NativeStackNavigationProp<SessionStackParamList>;

export default function UpdatedCourseLearningScreen() {
  const navigation = useNavigation<SessionNavProp>();
  const route = useRoute<CourseLearningScreenRouteProp>();
  const { courseId } = route.params;
  const { markPhraseCompleted, isPhraseCompleted } = useProgress();
  const { language, t } = useLanguage();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [evaluationResult, setEvaluationResult] = useState<PronunciationEvaluationResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCurrentPhraseCompleted, setIsCurrentPhraseCompleted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!courseId) return;
      try {
        const data = await getCourseById(courseId, language);
        setCourse(data ?? null);
        
        // コースが所属するレッスンIDを取得
        const lesson = await getLessonForCourse(courseId);
        if (lesson) {
          setLessonId(lesson.id);
        }
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId, language]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      showExitConfirmation();
      return true;
    });
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    // 現在のフレーズが既に完了済みかをチェック
    if (course && course.phrases[currentIndex]) {
      const currentPhraseId = course.phrases[currentIndex].id;
      setIsCurrentPhraseCompleted(isPhraseCompleted(courseId, currentPhraseId));
    }
  }, [courseId, course, currentIndex, isPhraseCompleted]);

  const showExitConfirmation = () => {
    Alert.alert(
      t('exitSessionTitle', '学習を終了しますか？'),
      t('exitSessionMessage', '学習を中断して呼び出し元の画面に戻ります'),
      [
        { text: t('cancel', 'キャンセル'), style: 'cancel' },
        {
          text: t('exit', '終了する'),
          style: 'destructive',
          onPress: () => {
            navigation.getParent()?.goBack();
          },
        },
      ]
    );
  };

  const handleNext = () => {
    if (!course) return;
    const currentPhrase = course.phrases[currentIndex];
    if (!currentPhrase) return;

    // フレーズ学習済みとしてマーク
    markPhraseCompleted(courseId, currentPhrase.id);

    if (currentIndex < course.phrases.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false); // 結果表示をリセット
    } else {
      // 最後のフレーズが終わったらコース学習完了画面へ
      navigation.navigate('CourseLearningComplete', { courseId });
    }
  };

  const handlePrevious = () => {
    if (!course) return;
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowResult(false); // 結果表示をリセット
    } else {
      showExitConfirmation();
    }
  };

  if (loading) {
    return <AppLoading message={t('loadingCourse', 'コースを読み込んでいます...')} />;
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Text>{t('courseNotFound', 'コースが見つかりませんでした。')}</Text>
      </View>
    );
  }

  // 進捗計算
  const totalPhrases = course.phrases.length;
  const progress = (currentIndex + 1) / totalPhrases;
  const currentPhrase = course.phrases[currentIndex];

  return (
    <View style={styles.container}>
      {/* ヘッダーと進捗バー */}
      <View style={styles.headerContainer}>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {totalPhrases}
        </Text>
        <AppProgressBar 
          progress={progress} 
          height={6}
        />
      </View>

      {/* メインコンテンツ */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 完了済みバッジ */}
        {isCurrentPhraseCompleted && (
          <View style={styles.completedBadgeContainer}>
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>{t('completed', '学習済み')}</Text>
            </View>
          </View>
        )}

        {/* 強化版フレーズカード */}
        {lessonId && (
          <EnhancedPhraseCard phrase={currentPhrase} lessonId={lessonId} />
        )}
        
        {/* 音声と録音ボタン */}
        <View style={styles.audioButtonsContainer}>
          <AudioButton audioPath={currentPhrase.audio ?? ''} style={styles.audioButton} />
          <RecordingButton
            phraseId={currentPhrase.id}
            style={styles.recordButton}
            onEvaluationComplete={(result) => {
              setEvaluationResult(result);
              setShowResult(true);
            }}
          />
        </View>

        {/* 発音評価結果 - 位置変更済み（例文の下・解説の上） */}
        {showResult && evaluationResult && (
          <Card style={styles.evaluationContainer}>
            <Card.Content>
              <Title style={styles.evaluationTitle}>{t('pronunciationResult', '発音評価結果')}</Title>
              <PronunciationResultCard result={evaluationResult} />
              <AppButton
                label={t('closeResult', '結果を閉じる')}
                onPress={() => setShowResult(false)}
                variant="outline"
                style={styles.closeButton}
              />
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* ナビゲーションボタン */}
      <View style={styles.navigationContainer}>
        <AppButton
          label={t('back', '戻る')}
          onPress={handlePrevious}
          variant="outline"
          icon="arrow-left"
          style={styles.navButton}
        />
        <AppButton
          label={t('next', '次へ')}
          onPress={handleNext}
          variant="primary"
          icon="arrow-right"
          style={styles.navButton}
        />
      </View>
    </View>
  );
}

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
  progressText: {
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontSize: 14,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  completedBadgeContainer: {
    alignItems: 'flex-end',
    marginBottom: -20,
    zIndex: 10,
  },
  completedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    ...shadows.small,
  },
  completedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  audioButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  audioButton: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  recordButton: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  evaluationContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  evaluationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.text,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: spacing.md,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
});