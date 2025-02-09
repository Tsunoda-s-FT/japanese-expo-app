import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator, ProgressBar, Card, Title, Paragraph } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getCourse } from '../services/contentService';
import { Course } from '../types/contentTypes';
import { useProgress } from '../context/ProgressContext';

type CourseDetailRouteProp = RouteProp<RootStackParamList, 'CourseDetail'>;
type CourseDetailNavProp = NativeStackNavigationProp<RootStackParamList, 'CourseDetail'>;

const CourseDetailScreen: React.FC = () => {
  const route = useRoute<CourseDetailRouteProp>();
  const navigation = useNavigation<CourseDetailNavProp>();
  const { courseId } = route.params;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const { getCourseProgress, courseProgress } = useProgress();

  useEffect(() => {
    (async () => {
      const foundCourse = await getCourse(courseId);
      setCourse(foundCourse || null);
      setLoading(false);
    })();
  }, [courseId]);

  const handleStartCourse = () => {
    if (!course) return;
    navigation.navigate('CourseLearning', { courseId });
  };

  const handleStartQuiz = () => {
    if (!course) return;
    navigation.navigate('CourseQuiz', { courseId });
  };

  if (loading) {
    return <ActivityIndicator style={styles.loading} />;
  }

  if (!course) {
    return <Text style={styles.error}>コースが見つかりません。</Text>;
  }

  // 進捗状況の計算
  const getProgress = () => {
    if (!course) return { phrases: 0, quizzes: 0 };
    const progress = courseProgress.get(courseId);
    if (!progress) return { phrases: 0, quizzes: 0 };

    return {
      phrases: progress.learnedPhraseIds.size / course.phrases.length,
      quizzes: progress.completedQuizIds.size / course.quizQuestions.length
    };
  };

  const progress = getProgress();

  return (
    <View style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.title}>{course.title}</Title>
          <Paragraph style={styles.description}>{course.description}</Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>学習の進捗</Text>
        <ProgressBar progress={progress.phrases} style={styles.progressBar} />
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            フレーズ学習: {progress.phrases * 100}% ({progress.phrases * course.phrases.length} / {course.phrases.length})
          </Text>
          <Text style={styles.statsText}>
            クイズ完了: {progress.quizzes * 100}% ({progress.quizzes * course.quizQuestions.length} / {course.quizQuestions.length})
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleStartCourse}
        >
          コースを開始
        </Button>

        <Button
          mode="outlined"
          style={styles.button}
          onPress={handleStartQuiz}
          disabled={course.quizQuestions.length === 0}
        >
          コースのクイズを受ける
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  headerCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 8
  },
  title: {
    fontSize: 24,
    marginBottom: 8
  },
  description: {
    fontSize: 16,
    color: '#666'
  },
  progressSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8
  },
  progressBar: {
    height: 8,
    borderRadius: 4
  },
  statsContainer: {
    marginTop: 8
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  buttonContainer: {
    marginTop: 16
  },
  button: {
    marginBottom: 8
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  error: {
    padding: 16,
    textAlign: 'center',
    color: 'red'
  }
});

export default CourseDetailScreen;
