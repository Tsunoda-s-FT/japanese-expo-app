import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
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
  const { getCourseProgress } = useProgress();

  useEffect(() => {
    (async () => {
      const data = await getAllCourses();
      setCourses(data);
      setLoading(false);
    })();
  }, []);

  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  if (loading) {
    return <ActivityIndicator style={styles.loading} />;
  }

  if (!courses) {
    return <Paragraph style={styles.error}>コース情報を取得できませんでした。</Paragraph>;
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>日本語学習コース</Title>
      {courses.map((course) => {
        const progress = getCourseProgress(course.id);
        const progressText = `進捗: ${(progress * 100).toFixed(1)}%`;

        return (
          <Card
            key={course.id}
            style={styles.card}
            onPress={() => handleCoursePress(course.id)}
          >
            <Card.Content>
              <Title>{course.title}</Title>
              <Paragraph>{course.description}</Paragraph>
              <Paragraph style={styles.progressText}>{progressText}</Paragraph>
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
  header: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center'
  },
  card: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 8
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
  },
  progressText: {
    marginTop: 8,
    color: '#666'
  }
});

export default CourseListScreen;
