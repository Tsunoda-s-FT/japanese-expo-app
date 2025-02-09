import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar, useTheme, Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getLesson } from '../services/contentService';
import { getLessonProgress } from '../services/progressService';
import { Course, Lesson, LessonProgress } from '../types/contentTypes';
import { RootStackParamList } from '../../App';

type LessonDetailScreenRouteProp = RouteProp<RootStackParamList, 'LessonDetail'>;
type LessonDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LessonDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation<LessonDetailScreenNavigationProp>();
  const route = useRoute<LessonDetailScreenRouteProp>();
  const { lessonId } = route.params;
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading lesson data for ID:', lessonId);
        const lessonData = await getLesson(lessonId);
        console.log('Lesson data:', lessonData);
        
        if (!lessonData) {
          console.log('No lesson found for ID:', lessonId);
          setLoading(false);
          return;
        }
        
        setLesson(lessonData);

        const progressData = await getLessonProgress(lessonId);
        console.log('Progress data:', progressData);
        
        if (progressData) {
          setProgress(progressData);
        } else {
          setProgress({
            completedCourseIds: new Set<string>(),
            lastAccessedDate: new Date()
          });
        }
      } catch (error) {
        console.error('Error loading lesson data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [lessonId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.container}>
        <Text>レッスンが見つかりません。</Text>
      </View>
    );
  }

  const calculateCourseProgress = (courseId: string): number => {
    return progress?.completedCourseIds?.has(courseId) ? 1 : 0;
  };

  const handleStartCourse = (courseId: string) => {
    console.log('Starting course:', courseId);
    navigation.navigate('CourseLearning', { courseId });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.title}>{lesson.title}</Title>
          <Paragraph style={styles.description}>{lesson.description}</Paragraph>
          <View style={styles.lessonInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>コース数</Text>
              <Text style={styles.infoValue}>{lesson.courses.length}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>所要時間</Text>
              <Text style={styles.infoValue}>{lesson.totalEstimatedTime}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.coursesSection}>
        <Title style={styles.sectionTitle}>コース一覧</Title>
        {lesson.courses.map((course: Course) => (
          <Card key={course.id} style={styles.courseCard}>
            <Card.Content>
              <View style={styles.courseHeader}>
                <View>
                  <Title>{course.title}</Title>
                  <Paragraph>{course.description}</Paragraph>
                </View>
                <View style={[
                  styles.levelBadge,
                  { backgroundColor: course.level === 'beginner' ? '#4CAF50' : course.level === 'intermediate' ? '#FFC107' : '#F44336' }
                ]}>
                  <Text style={styles.levelText}>
                    {course.level === 'beginner' ? '初級' : course.level === 'intermediate' ? '中級' : '上級'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.courseInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>フレーズ数</Text>
                  <Text style={styles.infoValue}>{course.phrases.length}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>クイズ数</Text>
                  <Text style={styles.infoValue}>{course.quizQuestions.length}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>所要時間</Text>
                  <Text style={styles.infoValue}>{course.estimatedTime}</Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <Text style={styles.progressLabel}>進捗状況</Text>
                <ProgressBar
                  progress={calculateCourseProgress(course.id)}
                  color={theme.colors.primary}
                  style={styles.progressBar}
                />
              </View>

              <Button
                mode="contained"
                onPress={() => handleStartCourse(course.id)}
                style={styles.startButton}
              >
                学習を始める
              </Button>
            </Card.Content>
          </Card>
        ))}
      </View>
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
  headerCard: {
    margin: 0,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  lessonInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  coursesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  courseCard: {
    marginBottom: 16,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  courseInfo: {
    marginTop: 16,
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressSection: {
    marginTop: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  startButton: {
    marginTop: 16,
  },
});
