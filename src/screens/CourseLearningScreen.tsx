// src/screens/CourseLearningScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, BackHandler } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SessionStackParamList } from '../navigation/SessionNavigator';
import { getCourseById } from '../services/contentService';
import { useProgress } from '../context/ProgressContext';
import { Course, Phrase } from '../types/contentTypes';
import SegmentedText from '../components/learning/SegmentedText';
import AudioButton from '../components/learning/AudioButton';
import RecordingButton from '../components/learning/RecordingButton';
import PronunciationResultCard from '../components/learning/PronunciationResultCard';
import { PronunciationEvaluationResult } from '../utils/audio';
import { AppButton, AppProgressBar, AppLoading } from '../components';
import { colors, spacing } from '../theme/theme';

type CourseLearningScreenRouteProp = RouteProp<SessionStackParamList, 'CourseLearning'>;
type SessionNavProp = NativeStackNavigationProp<SessionStackParamList>;

export default function CourseLearningScreen() {
  const navigation = useNavigation<SessionNavProp>();
  const route = useRoute<CourseLearningScreenRouteProp>();
  const { courseId } = route.params;
  const { markPhraseCompleted } = useProgress();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [evaluationResult, setEvaluationResult] = useState<PronunciationEvaluationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!courseId) return;
      try {
        const data = await getCourseById(courseId);
        setCourse(data ?? null);
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      showExitConfirmation();
      return true;
    });
    return () => backHandler.remove();
  }, [navigation]);

  const showExitConfirmation = () => {
    Alert.alert(
      '学習を終了しますか？',
      '学習を中断して呼び出し元の画面に戻ります',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '終了する',
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
      // 最後のフレーズが終わったらクイズへ
      navigation.navigate('CourseQuiz', { courseId });
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
    return <AppLoading message="コースを読み込んでいます..." />;
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Text>コースが見つかりませんでした。</Text>
      </View>
    );
  }

  // 進捗計算
  const totalPhrases = course.phrases.length;
  const progress = (currentIndex + 1) / totalPhrases;
  const currentPhrase = course.phrases[currentIndex];

  return (
    <View style={styles.container}>
      {/* Header with progress */}
      <View style={styles.headerContainer}>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {totalPhrases}
        </Text>
        <AppProgressBar 
          progress={progress} 
          height={6}
        />
      </View>

      {/* Main content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Phrase Card */}
        <Card style={styles.phraseCard}>
          <Card.Content>
            {/* Main phrase */}
            <View style={styles.phraseContainer}>
              <SegmentedText
                segments={currentPhrase.segments ?? []}
                style={styles.phraseText}
              />
              <Text style={styles.translation}>{currentPhrase.translations.en}</Text>
            </View>

            {/* Audio and Recording buttons */}
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

            {/* Example sentences */}
            {currentPhrase.exampleSentences && currentPhrase.exampleSentences.length > 0 && (
              <View style={styles.examplesContainer}>
                <Title style={styles.examplesTitle}>例文</Title>
                {currentPhrase.exampleSentences.map((example, index) => (
                  <View key={index} style={styles.exampleItem}>
                    <SegmentedText
                      segments={example.segments ?? []}
                      style={styles.exampleText}
                      furiganaStyle={styles.furigana}
                    />
                    <Text style={styles.exampleTranslation}>{example.translations.en}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Pronunciation evaluation result */}
        {showResult && evaluationResult && (
          <Card style={styles.evaluationContainer}>
            <Card.Content>
              <Title style={styles.evaluationTitle}>発音評価結果</Title>
              <PronunciationResultCard result={evaluationResult} />
              <AppButton
                label="結果を閉じる"
                onPress={() => setShowResult(false)}
                variant="outline"
                style={styles.closeButton}
              />
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.navigationContainer}>
        <AppButton
          label="戻る"
          onPress={handlePrevious}
          variant="outline"
          icon="arrow-left"
          style={styles.navButton}
        />
        <AppButton
          label="次へ"
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
  },
  phraseCard: {
    marginBottom: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  phraseContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  phraseText: {
    marginBottom: spacing.md,
  },
  translation: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.sm,
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
  examplesContainer: {
    marginTop: spacing.md,
    backgroundColor: '#f9f9f9',
    padding: spacing.md,
    borderRadius: 8,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
    color: colors.text,
  },
  exampleItem: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    backgroundColor: colors.surface,
  },
  exampleText: {
    marginBottom: spacing.sm,
  },
  furigana: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  exampleTranslation: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  evaluationContainer: {
    marginTop: spacing.md,
    borderRadius: 8,
    elevation: 2,
  },
  evaluationTitle: {
    fontSize: 18,
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
