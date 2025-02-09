import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, useTheme, Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { getCourse } from '../services/contentService';
import { useProgress } from '../contexts/ProgressContext';
import { Course, Phrase, CourseProgress } from '../types/contentTypes';
import { playAudio } from '../utils/audioUtils';

type CourseLearningScreenRouteProp = RouteProp<RootStackParamList, 'CourseLearning'>;
type CourseLearningScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CourseLearningScreen() {
  const theme = useTheme();
  const navigation = useNavigation<CourseLearningScreenNavigationProp>();
  const route = useRoute<CourseLearningScreenRouteProp>();
  const { courseId } = route.params;
  const { getCourseProgress, saveCourseProgress } = useProgress();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading course data for ID:', courseId);
        const courseData = getCourse(courseId);
        if (!courseData) {
          console.error('Course not found:', courseId);
          setLoading(false);
          return;
        }

        console.log('Course data loaded:', courseData);
        setCourse(courseData);

        const progressData = await getCourseProgress(courseId);
        console.log('Course progress loaded:', progressData);
        
        if (progressData) {
          setProgress(progressData);
        } else {
          const defaultProgress: CourseProgress = {
            learnedPhraseIds: new Set<string>(),
            completedQuizIds: new Set<string>(),
            lastAccessedDate: new Date()
          };
          console.log('Setting default progress:', defaultProgress);
          setProgress(defaultProgress);
        }
      } catch (error) {
        console.error('Error loading course data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId, getCourseProgress]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!course || !progress) {
    return (
      <View style={styles.container}>
        <Text>コースが見つかりません。</Text>
      </View>
    );
  }

  const currentPhrase = course.phrases[currentPhraseIndex];
  if (!currentPhrase) {
    return (
      <View style={styles.container}>
        <Text>フレーズが見つかりません。</Text>
      </View>
    );
  }

  const handleNext = async () => {
    try {
      console.log('Marking phrase as completed:', currentPhrase.id);
      const updatedProgress = {
        ...progress,
        learnedPhraseIds: new Set([...progress.learnedPhraseIds, currentPhrase.id])
      };
      await saveCourseProgress(courseId, updatedProgress);
      console.log('Progress saved successfully');
      setProgress(updatedProgress);

      if (currentPhraseIndex < course.phrases.length - 1) {
        setCurrentPhraseIndex(prev => prev + 1);
      } else {
        console.log('Course completed, navigating to quiz');
        navigation.navigate('CourseQuiz', { courseId });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handlePlayAudio = async () => {
    if (!currentPhrase.audio) {
      console.log('No audio available for phrase:', currentPhrase.id);
      return;
    }

    try {
      console.log('Playing audio for phrase:', currentPhrase.id);
      await playAudio(currentPhrase.audio);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.phraseTitle}>
            フレーズ {currentPhraseIndex + 1}/{course.phrases.length}
          </Title>
          
          <View style={styles.phraseContainer}>
            <Text style={styles.japanese}>{currentPhrase.jpText}</Text>
            <Text style={styles.reading}>{currentPhrase.reading}</Text>
            <Text style={styles.english}>{currentPhrase.translations.en}</Text>
          </View>

          {currentPhrase.audio && (
            <Button
              mode="contained"
              onPress={handlePlayAudio}
              style={styles.audioButton}
              icon="volume-high"
            >
              音声を再生
            </Button>
          )}

          {currentPhrase.exampleSentences && currentPhrase.exampleSentences.length > 0 && (
            <View style={styles.exampleContainer}>
              <Title style={styles.exampleTitle}>例文</Title>
              {currentPhrase.exampleSentences.map((example, index) => (
                <View key={example.id || index} style={styles.example}>
                  <Text style={styles.japanese}>{example.jpText}</Text>
                  <Text style={styles.reading}>{example.reading}</Text>
                  <Text style={styles.english}>{example.translations.en}</Text>
                </View>
              ))}
            </View>
          )}

          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.nextButton}
          >
            {currentPhraseIndex < course.phrases.length - 1 ? '次へ' : 'クイズを始める'}
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
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
  card: {
    margin: 16,
    elevation: 4,
  },
  phraseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  phraseContainer: {
    marginBottom: 24,
  },
  japanese: {
    fontSize: 24,
    marginBottom: 8,
  },
  reading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  english: {
    fontSize: 16,
    color: '#333',
  },
  audioButton: {
    marginBottom: 24,
  },
  exampleContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  exampleTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  example: {
    marginBottom: 16,
  },
  nextButton: {
    marginTop: 8,
  },
});
