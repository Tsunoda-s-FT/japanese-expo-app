import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Course } from '../types/contentTypes';
import { getAllCourses } from '../services/contentService';
import { useProgress } from '../context/ProgressContext';

type CourseListScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'CourseList'>;

const CourseListScreen: React.FC = () => {
  const navigation = useNavigation<CourseListScreenNavProp>();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { courseProgressMap, getCourseProgressRatio } = useProgress();

  useEffect(() => {
    const data = getAllCourses();
    setCourses(data);
    setLoading(false);
  }, []);

  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!courses) {
    return (
      <View style={styles.errorContainer}>
        <Paragraph style={styles.errorText}>コース情報を取得できませんでした。</Paragraph>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>日本語学習コース</Title>
      {courses.map((course) => {
        const progress = getCourseProgressRatio(course.id);
        const cp = courseProgressMap.get(course.id);
        const learnedPhrases = cp?.learnedPhraseIds.size ?? 0;
        const completedQuizzes = cp?.completedQuizIds.size ?? 0;
        const totalPhrases = course.phrases.length;
        const totalQuizzes = course.quizQuestions.length;

        return (
          <Card
            key={course.id}
            style={styles.card}
            onPress={() => handleCoursePress(course.id)}
          >
            <Card.Content>
              <Title>{course.title}</Title>
              <Paragraph style={styles.description}>{course.description}</Paragraph>
              <View style={styles.progressContainer}>
                <ProgressBar progress={progress} style={styles.progressBar} />
                <Paragraph style={styles.progressText}>
                  進捗: {(progress * 100).toFixed(1)}%
                </Paragraph>
                <Paragraph style={styles.statsText}>
                  フレーズ: {learnedPhrases}/{totalPhrases}
                  {' | '}
                  クイズ: {completedQuizzes}/{totalQuizzes}
                </Paragraph>
              </View>
            </Card.Content>
          </Card>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  header: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center'
  },
  card: {
    marginBottom: 16
  },
  description: {
    marginVertical: 8,
    color: '#666'
  },
  progressContainer: {
    marginTop: 8
  },
  progressBar: {
    marginBottom: 4
  },
  progressText: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666'
  },
  statsText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  }
});

export default CourseListScreen;
