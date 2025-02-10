import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
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
    const loadData = () => {
      try {
        console.log('Loading course data for ID:', courseId);
        const courseData = getCourseById(courseId);
        if (!courseData) {
          console.error('Course not found:', courseId);
          setLoading(false);
          return;
        }

        console.log('Course data loaded:', courseData);
        setCourse(courseData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading course data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [courseId]);

  const handleNext = () => {
    if (!course) return;

    // 最後のフレーズを学習し終わったらセッション完了ダイアログを出す
    if (currentPhraseIndex >= course.phrases.length - 1) {
      Alert.alert(
        'コース学習完了',
        '学習おつかれさまでした！クイズを受けますか？',
        [
          {
            text: 'クイズを受ける',
            onPress: () => {
              navigation.navigate('Session', {
                screen: 'CourseQuiz',
                params: { courseId }
              });
            },
          },
          {
            text: 'あとで',
            onPress: () => {
              navigation.navigate('Main', {
                screen: 'CourseDetail',
                params: { courseId }
              });
            },
            style: 'cancel',
          },
        ],
        { cancelable: false }
      );
    } else {
      // 次のフレーズへ移動
      setCurrentPhraseIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex(prev => prev - 1);
    } else {
      navigation.navigate('Main', {
        screen: 'CourseDetail',
        params: { courseId }
      });
    }
  };

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
