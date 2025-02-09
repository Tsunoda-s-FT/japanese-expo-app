import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Button, useTheme, Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getCourseById } from '../services/contentService';
import { useProgress } from '../context/ProgressContext';
import { Course, Phrase } from '../types/contentTypes';
import { playAudio } from '../utils/audioUtils';

type CourseLearningScreenRouteProp = RouteProp<RootStackParamList, 'CourseLearning'>;
type CourseLearningScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CourseLearningScreen() {
  const theme = useTheme();
  const navigation = useNavigation<CourseLearningScreenNavigationProp>();
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

    // 現在のフレーズを学習済みとしてマーク
    const currentPhrase = course.phrases[currentPhraseIndex];
    markPhraseCompleted(courseId, currentPhrase.id);

    // 次のフレーズへ進む
    if (currentPhraseIndex < course.phrases.length - 1) {
      setCurrentPhraseIndex(prev => prev + 1);
    } else {
      // コース完了時、クイズを受けるか確認
      Alert.alert(
        'コース学習完了',
        '学習おつかれさまでした！クイズを受けますか？',
        [
          {
            text: 'クイズを受ける',
            onPress: () => {
              navigation.navigate('CourseQuiz', { courseId });
            },
          },
          {
            text: 'あとで',
            onPress: () => {
              navigation.navigate('CourseDetail', { courseId });
            },
            style: 'cancel',
          },
        ],
        { cancelable: false }
      );
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
            onPress={() => {
              if (currentPhraseIndex > 0) {
                setCurrentPhraseIndex(prev => prev - 1);
              } else {
                // 最初のフレーズの場合はコース詳細に戻る
                navigation.navigate('CourseDetail', { courseId });
              }
            }}
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
