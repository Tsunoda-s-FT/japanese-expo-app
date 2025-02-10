import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { Course } from '../types/contentTypes';
import { getAllCourses } from '../services/contentService';
import { useProgress } from '../context/ProgressContext';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigationContext } from '../context/NavigationContext';

type CourseListScreenNavProp = NativeStackNavigationProp<MainStackParamList, 'CourseList'>;

const CourseListScreen: React.FC = () => {
  const navigation = useNavigation<CourseListScreenNavProp>();
  const { getCourseProgressRatio } = useProgress();
  const { afterSessionCourseId, setAfterSessionCourseId } = useNavigationContext();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  useFocusEffect(
    useCallback(() => {
      if (afterSessionCourseId) {
        navigation.navigate('CourseDetail', { courseId: afterSessionCourseId });
        setAfterSessionCourseId(null);
      }
    }, [afterSessionCourseId, navigation, setAfterSessionCourseId])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <View style={styles.container}>
        <Title>コースが見つかりません</Title>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>コース一覧</Title>
      {courses.map((course) => (
        <Card
          key={course.id}
          style={styles.card}
          onPress={() => handleCoursePress(course.id)}
        >
          <Card.Content>
            <Title>{course.title}</Title>
            <Paragraph style={styles.description}>{course.description}</Paragraph>
            <Paragraph style={styles.meta}>
              レベル: {course.level} • 所要時間: {course.estimatedTime}
            </Paragraph>
            <ProgressBar
              progress={getCourseProgressRatio(course.id)}
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
  },
  card: {
    marginBottom: 16,
  },
  description: {
    marginVertical: 8,
  },
  meta: {
    color: '#666',
    fontSize: 12,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

export default CourseListScreen;
