import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Lesson } from '../types/contentTypes';
import { getAllLessons } from '../services/contentService';

type LessonListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LessonList'>;

const LessonListScreen: React.FC = () => {
  const navigation = useNavigation<LessonListNavigationProp>();
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getAllLessons();
      setLessons(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleLessonPress = (lessonId: string) => {
    navigation.navigate('LessonDetail', { lessonId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Paragraph>レッスン情報がありません。</Paragraph>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>レッスン一覧</Title>
      {lessons.map((lesson) => (
        <Card
          key={lesson.id}
          style={styles.card}
          onPress={() => handleLessonPress(lesson.id)}
        >
          {lesson.thumbnail && (
            <Card.Cover source={{ uri: lesson.thumbnail }} />
          )}
          <Card.Content>
            <Title>{lesson.title}</Title>
            <Paragraph style={styles.description}>{lesson.description}</Paragraph>
            <Paragraph style={styles.meta}>
              所要時間: {lesson.totalEstimatedTime} • コース数: {lesson.courses.length}
            </Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  description: {
    marginTop: 8,
    color: '#666',
  },
  meta: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
  },
});

export default LessonListScreen;
