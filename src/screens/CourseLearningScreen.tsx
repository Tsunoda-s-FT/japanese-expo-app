import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, BackHandler } from 'react-native';
import { Card, Title, Button, useTheme, Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SessionStackParamList } from '../navigation/SessionNavigator';
import { getCourseById } from '../services/contentService';
import { useProgress } from '../context/ProgressContext';
import { Course, Phrase } from '../types/contentTypes';
import { playAudio } from '../utils/audioUtils';

type CourseLearningScreenRouteProp = RouteProp<SessionStackParamList, 'CourseLearning'>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

export default function CourseLearningScreen() {
  const theme = useTheme();
  const navigation = useNavigation<RootNavProp>();
  const route = useRoute<CourseLearningScreenRouteProp>();
  const { courseId } = route.params;
  const { courseProgressMap, markPhraseCompleted } = useProgress();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const courseData = await getCourseById(courseId);
        if (!courseData) {
          setLoading(false);
          return;
        }

        setCourse(courseData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId]);

  const handleNext = () => {
    if (!course) {
      return;
    }

    if (currentPhraseIndex < course.phrases.length - 1) {
      const currentPhrase = course.phrases[currentPhraseIndex];
      markPhraseCompleted(courseId, currentPhrase.id);
      setCurrentPhraseIndex(currentPhraseIndex + 1);
    } else {
      // 最後のフレーズの場合も完了を記録
      const currentPhrase = course.phrases[currentPhraseIndex];
      markPhraseCompleted(courseId, currentPhrase.id);
      navigation.navigate('Session', {
        screen: 'CourseQuiz',
        params: { courseId },
      });
    }
  };

  const handleBack = () => {
    if (!course) {
      return;
    }

    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex(currentPhraseIndex - 1);
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        '学習を中断しますか？',
        '進捗は保存されますが、最初から始める必要があります。',
        [
          {
            text: 'キャンセル',
            style: 'cancel',
          },
          {
            text: '中断する',
            style: 'destructive',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
      return true;
    });

    return () => backHandler.remove();
  }, [navigation]);

  const handlePlayAudio = (audio?: string) => {
    if (audio) {
      playAudio(audio);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>コースが見つかりません。</Text>
      </View>
    );
  }

  const currentPhrase = course.phrases[currentPhraseIndex];
  const cp = courseProgressMap.get(courseId);
  const isPhraseLearned = cp?.learnedPhraseIds.has(currentPhrase.id) ?? false;

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
        <Text style={styles.progress}>
          {currentPhraseIndex + 1} / {course.phrases.length}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={handleBack}
            style={[styles.navigationButton, styles.backButton]}
          >
            {currentPhraseIndex === 0 ? 'コース詳細に戻る' : '前へ'}
          </Button>
          <Button
            mode="contained"
            onPress={handleNext}
            style={[styles.navigationButton, styles.nextButton]}
          >
            {currentPhraseIndex < course.phrases.length - 1 ? '次へ' : '完了'}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  },
  scrollView: {
    flex: 1,
    padding: 16
  },
  card: {
    marginBottom: 16
  },
  phraseText: {
    fontSize: 24,
    marginBottom: 8
  },
  reading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8
  },
  translation: {
    fontSize: 18,
    marginBottom: 16
  },
  audioButton: {
    marginBottom: 16
  },
  examplesContainer: {
    marginTop: 16
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  exampleCard: {
    marginBottom: 8
  },
  exampleJp: {
    fontSize: 16,
    marginBottom: 4
  },
  exampleReading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  exampleTranslation: {
    fontSize: 14,
    color: '#444'
  },
  exampleAudioButton: {
    marginTop: 4
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  progress: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#666'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
