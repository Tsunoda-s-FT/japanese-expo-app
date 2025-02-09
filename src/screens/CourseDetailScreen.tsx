import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator, ProgressBar, Card, Title, Paragraph } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getCourseById } from '../services/contentService';
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

  const { courseProgressMap } = useProgress();

  useEffect(() => {
    const foundCourse = getCourseById(courseId);
    setCourse(foundCourse || null);
    setLoading(false);
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
  const totalPhrases = course.phrases.length;
  const totalQuizzes = course.quizQuestions.length;

  const cp = courseProgressMap.get(courseId);
  const learnedCount = cp ? cp.learnedPhraseIds.size : 0;
  const quizCompletedCount = cp ? cp.completedQuizIds.size : 0;

  const phraseProgressRatio = totalPhrases > 0 ? learnedCount / totalPhrases : 0;
  const quizProgressRatio = totalQuizzes > 0 ? quizCompletedCount / totalQuizzes : 0;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{course.title}</Title>
          <Paragraph>{course.description}</Paragraph>
          <View style={styles.metaInfo}>
            <Text>レベル: {course.level}</Text>
            <Text>所要時間: {course.estimatedTime}</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.progressContainer}>
        <Text>フレーズ進捗: {(phraseProgressRatio * 100).toFixed(0)}%</Text>
        <ProgressBar progress={phraseProgressRatio} style={styles.progressBar} />

        <Text>クイズ進捗: {(quizProgressRatio * 100).toFixed(0)}%</Text>
        <ProgressBar progress={quizProgressRatio} style={styles.progressBar} />
      </View>

      <Button
        mode="contained"
        style={styles.button}
        onPress={handleStartCourse}
      >
        コース学習を開始
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20
  },
  card: {
    marginBottom: 16
  },
  metaInfo: {
    marginTop: 8
  },
  progressContainer: {
    marginVertical: 16
  },
  progressBar: {
    height: 8,
    marginVertical: 4
  },
  button: {
    marginTop: 8
  }
});

export default CourseDetailScreen;
