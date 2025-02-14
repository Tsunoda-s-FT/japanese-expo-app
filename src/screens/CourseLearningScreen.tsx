import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, BackHandler } from 'react-native';
import { Card, Title, Button, Text, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SessionStackParamList } from '../navigation/SessionNavigator';
import { getCourseById } from '../services/contentService';
import { useProgress } from '../context/ProgressContext';
import { Course } from '../types/contentTypes';
import { playAudio } from '../utils/audioUtils';
import SegmentedText from '../components/SegmentedText';
import AudioButton from '../components/AudioButton';
import RecordingButton from '../components/RecordingButton';
import { useTheme } from 'react-native-paper';

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

  const handleNext = () => {
    if (!course) return;
    const currentPhrase = course.phrases[currentIndex];
    if (!currentPhrase) return;

    // マーク完了
    markPhraseCompleted(courseId, currentPhrase.id);

    if (currentIndex < course.phrases.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // クイズ画面へ
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

  if (loading || !course) {
    console.log('[CourseLearningScreen] course is null or undefined');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const currentPhrase = course?.phrases[currentIndex];

  const handlePlayAudio = () => {
    if (currentPhrase?.audio) {
      playAudio(currentPhrase.audio);
    } else {
      console.log('No audio path for this phrase');
    }
  };

  return (
    <View style={styles.container}>
      {/* プログレスバー */}
      <ProgressBar progress={(currentIndex + 1) / course.phrases.length} color={theme.colors.primary} style={styles.progressBar} />
      <Text style={styles.progressText}>
        {currentIndex + 1} / {course.phrases.length}
      </Text>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            {/* フレーズ */}
            <View style={styles.phraseContainer}>
              {currentPhrase?.segments && currentPhrase.segments.length > 0 ? (
                <SegmentedText segments={currentPhrase.segments} />
              ) : (
                <Title style={styles.phraseText}>{currentPhrase.jpText}</Title>
              )}
              <Text style={styles.meaningText}>{currentPhrase.translations.en}</Text>
            </View>

            <View style={styles.audioButtonContainer}>
              <AudioButton onPress={handlePlayAudio} />
              <RecordingButton />
            </View>

            {/* 例文 */}
            {currentPhrase.exampleSentences && currentPhrase.exampleSentences.length > 0 && (
              <View style={styles.examplesContainer}>
                <Text style={styles.sectionTitle}>例文</Text>
                {currentPhrase.exampleSentences.map((example, idx) => (
                  <View key={idx} style={styles.exampleItem}>
                    {example.segments && example.segments.length > 0 ? (
                      <SegmentedText segments={example.segments} />
                    ) : (
                      <Text style={styles.exampleText}>{example.jpText}</Text>
                    )}
                    <Text style={styles.exampleTranslation}>
                      {example.translations.en}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* メモ */}
            {currentPhrase.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.sectionTitle}>メモ</Text>
                <Text style={styles.noteText}>{currentPhrase.notes}</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* ナビゲーションボタン */}
      <View style={styles.navigationButtonContainer}>
        <Button
          mode="contained"
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          style={[styles.navigationButton, styles.previousButton]}
        >
          前へ
        </Button>
        <Button
          mode="contained"
          onPress={handleNext}
          style={[styles.navigationButton, styles.nextButton]}
        >
          {currentIndex >= course.phrases.length - 1 ? 'クイズへ' : '次へ'}
        </Button>
      </View>
    </View>
  );
}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  phraseContainer: {
    marginBottom: 24,
  },
  phraseText: {
    fontSize: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  meaningText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
  audioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  examplesContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  exampleItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  exampleText: {
    fontSize: 18,
    marginBottom: 8,
  },
  exampleTranslation: {
    fontSize: 16,
    color: '#666',
  },
  notesContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  noteText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  navigationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navigationButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  previousButton: {
    backgroundColor: '#9e9e9e',
  },
  nextButton: {
    backgroundColor: '#2196f3',
  },
});
