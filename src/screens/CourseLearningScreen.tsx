import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, BackHandler } from 'react-native';
import { Card, Title, Button, useTheme, Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SessionStackParamList } from '../navigation/SessionNavigator';
import { getCourseById } from '../services/contentService';
import { useProgress } from '../context/ProgressContext';
import { Course } from '../types/contentTypes';
import { playAudio } from '../utils/audioUtils';

type CourseLearningScreenRouteProp = RouteProp<SessionStackParamList, 'CourseLearning'>;
type SessionNavProp = NativeStackNavigationProp<SessionStackParamList, 'CourseLearning'>;

export default function CourseLearningScreen() {
  const theme = useTheme();
  const navigation = useNavigation<SessionNavProp>();
  const route = useRoute<CourseLearningScreenRouteProp>();
  const { courseId } = route.params;
  const { courseProgressMap, markPhraseCompleted } = useProgress();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
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

  const handleNext = () => {
    if (!course) return;
    const currentPhrase = course.phrases[currentPhraseIndex];
    if (!currentPhrase) return;

    if (currentPhraseIndex < course.phrases.length - 1) {
      // 次のフレーズへ
      if (courseId) {
        markPhraseCompleted(courseId, currentPhrase.id);
      }
      setCurrentPhraseIndex(currentPhraseIndex + 1);
    } else {
      // 最後のフレーズを学習した
      if (courseId) {
        markPhraseCompleted(courseId, currentPhrase.id);
      }
      // 学習完了画面へ遷移
      navigation.navigate('CourseLearningComplete', { courseId });
    }
  };

  const handlePrev = () => {
    if (!course) return;
    if (currentPhraseIndex > 0) {
      // 前のフレーズに戻る
      setCurrentPhraseIndex(currentPhraseIndex - 1);
    } else {
      // 先頭フレーズで"前へ"は「学習中断」扱い
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

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      showExitConfirmation();
      return true;
    });
    return () => backHandler.remove();
  }, [navigation]);

  if (loading || !course) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const currentPhrase = course.phrases[currentPhraseIndex];
  if (!currentPhrase) {
    return (
      <View style={styles.loadingContainer}>
        <Text>フレーズが見つかりませんでした。</Text>
      </View>
    );
  }

  const handlePlayAudio = (audioPath: string | undefined) => {
    if (audioPath) {
      playAudio(audioPath);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.phraseText}>{currentPhrase.jpText}</Title>
            <Text style={styles.reading}>{currentPhrase.reading}</Text>
            <Text style={styles.translation}>{currentPhrase.translations.en}</Text>

            {currentPhrase.audio && (
              <Button
                mode="outlined"
                onPress={() => handlePlayAudio(currentPhrase.audio)}
                style={styles.audioButton}
              >
                音声を再生
              </Button>
            )}

            {currentPhrase.exampleSentences && currentPhrase.exampleSentences.length > 0 && (
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>例文:</Text>
                {currentPhrase.exampleSentences.map((example, index) => (
                  <Card key={index} style={styles.exampleCard}>
                    <Card.Content>
                      <Text style={styles.exampleJp}>{example.jpText}</Text>
                      <Text style={styles.exampleReading}>{example.reading}</Text>
                      <Text style={styles.exampleTranslation}>{example.translations.en}</Text>
                      {example.audio && (
                        <Button
                          mode="text"
                          onPress={() => handlePlayAudio(example.audio)}
                          style={styles.exampleAudioButton}
                        >
                          例文の音声
                        </Button>
                      )}
                    </Card.Content>
                  </Card>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={showExitConfirmation}
          style={styles.exitButton}
        >
          学習を中断
        </Button>

        <Text style={styles.progress}>
          {currentPhraseIndex + 1} / {course.phrases.length}
        </Text>

        <View style={styles.buttonContainer}>
          {currentPhraseIndex > 0 && (
            <Button
              mode="outlined"
              onPress={handlePrev}
              style={[styles.navigationButton, styles.backButton]}
            >
              前へ
            </Button>
          )}
          <Button
            mode="contained"
            onPress={handleNext}
            style={[styles.navigationButton, styles.nextButton]}
          >
            {currentPhraseIndex < course.phrases.length - 1 ? '次へ' : '学習完了'}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  phraseText: {
    fontSize: 24,
    marginBottom: 8,
  },
  reading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  translation: {
    fontSize: 18,
    marginBottom: 16,
  },
  audioButton: {
    marginBottom: 16,
  },
  examplesContainer: {
    marginTop: 16,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exampleCard: {
    marginBottom: 8,
  },
  exampleJp: {
    fontSize: 16,
    marginBottom: 4,
  },
  exampleReading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  exampleTranslation: {
    fontSize: 14,
    color: '#444',
  },
  exampleAudioButton: {
    marginTop: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  exitButton: {
    marginBottom: 8,
    borderColor: '#666',
  },
  progress: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navigationButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  backButton: {
    borderColor: '#666',
  },
  nextButton: {
    marginLeft: 8,
  },
});
