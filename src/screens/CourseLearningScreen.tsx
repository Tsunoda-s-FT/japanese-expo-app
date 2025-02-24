// src/screens/CourseLearningScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, BackHandler } from 'react-native';
import { Card, Title, Button, Text, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SessionStackParamList } from '../navigation/SessionNavigator';
import { getCourseById } from '../services/contentService';
import { useProgress } from '../context/ProgressContext';
import { Course, Phrase, ExampleSentence } from '../types/contentTypes';
import SegmentedText from '../components/SegmentedText';
import AudioButton from '../components/AudioButton';
import RecordingButton from '../components/RecordingButton';
import { useTheme } from 'react-native-paper';
import PronunciationResultCard from '../components/PronunciationResultCard';
import { PronunciationEvaluationResult } from '../services/speechService';

type CourseLearningScreenRouteProp = RouteProp<SessionStackParamList, 'CourseLearning'>;
type SessionNavProp = NativeStackNavigationProp<SessionStackParamList>;

export default function CourseLearningScreen() {
  const theme = useTheme();
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
        console.log('[CourseLearningScreen] getCourseById result:', JSON.stringify(data, null, 2));
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
    if (!navigation) return;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      showExitConfirmation();
      return true;
    });
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    if (!course || currentIndex < 0 || currentIndex >= course.phrases.length) return;
    const currentPhrase = course.phrases[currentIndex];
    if (currentPhrase?.segments) {
      console.log('[CourseLearningScreen] segments length=', currentPhrase.segments.length);
    } else {
      console.log('[CourseLearningScreen] segments is undefined or null');
    }
  }, [course, currentIndex]);

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
    } else {
      // 最後のフレーズが終わったらクイズへ
      navigation.navigate('CourseQuiz', { courseId });
    }
  };

  const handlePrevious = () => {
    if (!course) return;
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      showExitConfirmation();
    }
  };

  const renderCurrentPhrase = () => {
    if (!course || !course.phrases[currentIndex]) return null;
    const currentPhrase = course.phrases[currentIndex];

    return (
      <Card style={styles.phraseCard}>
        <Card.Content>
          <SegmentedText
            segments={currentPhrase.segments ?? []}
            style={styles.phraseText}
          />
          <Text style={styles.translation}>{currentPhrase.translations?.en}</Text>

          {/* 音声・録音ボタン行 */}
          <View style={styles.audioButtonsContainer}>
            <AudioButton audioPath={currentPhrase.audio ?? ''} style={styles.audioButton} />
            <RecordingButton
              phraseId={currentPhrase.id}
              style={styles.recordButton}
              onEvaluationComplete={(result) => {
                console.log('受け取った評価結果:', result);
                setEvaluationResult(result);
                setShowResult(true);
              }}
            />
          </View>

          {/* 例文 */}
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
                  <Text style={styles.exampleTranslation}>{example.translations?.en}</Text>
                </View>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  const renderResultArea = () => {
    if (!showResult || !evaluationResult) return null;
    return (
      <View style={styles.evaluationContainer}>
        <Title style={styles.evaluationTitle}>発音評価結果</Title>
        <PronunciationResultCard result={evaluationResult} />
        {/* 閉じる/非表示ボタン */}
        <Button onPress={() => setShowResult(false)}>閉じる</Button>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
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

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {totalPhrases}
        </Text>
        <ProgressBar
          progress={progress}
          color={theme.colors.primary}
          style={styles.progressBar}
        />
      </View>

      {/* Main content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderCurrentPhrase()}
        {renderResultArea()}
      </ScrollView>

      {/* 下部のナビゲーションボタン */}
      <View style={styles.navigationContainer}>
        <Button
          mode="outlined"
          onPress={handlePrevious}
          style={styles.navButton}
          labelStyle={styles.navButtonLabel}
        >
          戻る
        </Button>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.navButton}
          labelStyle={styles.navButtonLabel}
        >
          次へ
        </Button>
      </View>
    </View>
  );
}

// スタイル定義
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  phraseCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  phraseText: {
    marginBottom: 12,
  },
  furigana: {
    fontSize: 12,
    color: '#666',
  },
  translation: {
    fontSize: 18,
    textAlign: 'center',
    color: '#444',
    marginTop: 8,
  },
  audioButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 16,
  },
  audioButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  recordButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  examplesContainer: {
    marginTop: 16,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  exampleItem: {
    marginBottom: 16,
  },
  exampleText: {
    marginBottom: 8,
  },
  exampleTranslation: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  navButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  evaluationContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  evaluationTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
});
