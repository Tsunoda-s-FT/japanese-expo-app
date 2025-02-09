import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, useTheme, Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getCourse } from '../services/contentService';
import { useProgress } from '../context/ProgressContext';
import { Course, Phrase, CourseProgress } from '../types/contentTypes';
import { playAudio } from '../utils/audioUtils';

type CourseLearningScreenRouteProp = RouteProp<RootStackParamList, 'CourseLearning'>;
type CourseLearningScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CourseLearningScreen() {
  const theme = useTheme();
  const navigation = useNavigation<CourseLearningScreenNavigationProp>();
  const route = useRoute<CourseLearningScreenRouteProp>();
  const { courseId } = route.params;
  const { courseProgress, markPhraseLearned } = useProgress();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
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

    const currentPhrase = course.phrases[currentPhraseIndex];
    markPhraseLearned(courseId, currentPhrase.id);

    if (currentPhraseIndex < course.phrases.length - 1) {
      setCurrentPhraseIndex(prev => prev + 1);
    } else {
      navigation.navigate('CourseDetail', { courseId });
    }
  };

  const handlePlayAudio = (audio?: string) => {
    if (audio) {
      playAudio(audio);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>コースが見つかりません。</Text>
      </View>
    );
  }

  const currentPhrase = course.phrases[currentPhraseIndex];
  const progress = courseProgress.get(courseId);
  const isPhraseLearned = progress?.learnedPhraseIds.has(currentPhrase.id);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.phraseJp}>{currentPhrase.jpText}</Title>
            <Text style={styles.phraseReading}>{currentPhrase.reading}</Text>
            <Text style={styles.phraseEn}>{currentPhrase.translations.en}</Text>

            {currentPhrase.exampleSentences && (
              <View style={styles.examplesContainer}>
                <Title style={styles.examplesTitle}>例文</Title>
                {currentPhrase.exampleSentences.map((example, index) => (
                  <View key={index} style={styles.exampleItem}>
                    <Text style={styles.exampleJp}>{example.jpText}</Text>
                    <Text style={styles.exampleReading}>{example.reading}</Text>
                    <Text style={styles.exampleEn}>{example.translations.en}</Text>
                    {example.audio && (
                      <Button
                        mode="text"
                        onPress={() => handlePlayAudio(example.audio)}
                        style={styles.audioButton}
                      >
                        音声を再生
                      </Button>
                    )}
                  </View>
                ))}
              </View>
            )}

            {currentPhrase.audio && (
              <Button
                mode="contained"
                onPress={() => handlePlayAudio(currentPhrase.audio)}
                style={styles.mainAudioButton}
              >
                フレーズの音声を再生
              </Button>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.nextButton}
          disabled={isPhraseLearned}
        >
          {isPhraseLearned ? '学習済み' : '次へ'}
        </Button>
        <Text style={styles.progress}>
          {currentPhraseIndex + 1} / {course.phrases.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  phraseJp: {
    fontSize: 24,
    marginBottom: 8,
  },
  phraseReading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  phraseEn: {
    fontSize: 16,
    color: '#333',
  },
  examplesContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  examplesTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  exampleItem: {
    marginBottom: 16,
  },
  exampleJp: {
    fontSize: 18,
    marginBottom: 8,
  },
  exampleReading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  exampleEn: {
    fontSize: 16,
    color: '#333',
  },
  audioButton: {
    marginTop: 8,
  },
  mainAudioButton: {
    marginTop: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  nextButton: {
    marginBottom: 8,
  },
  progress: {
    fontSize: 16,
    color: '#666',
  },
});
