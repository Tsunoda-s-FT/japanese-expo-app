import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { Lesson } from '../types/contentTypes';
import { getAllLessons } from '../services/contentService';

// 画像のマッピング
const lessonImages: { [key: string]: any } = {
  'ojigi_aisatsu_business_woman.png': require('../../assets/images/lessons/ojigi_aisatsu_business_woman.png'),
  // 他の画像もここに追加
};

// 画像のパスから画像ソースを取得する関数
const getImageSource = (path: string) => {
  // パスからファイル名を抽出
  const fileName = path.split('/').pop();
  if (fileName && lessonImages[fileName]) {
    return lessonImages[fileName];
  }
  // 該当する画像が見つからない場合はデフォルト画像を返すか、nullを返す
  return null;
};

type LessonListNavigationProp = NativeStackNavigationProp<MainStackParamList, 'LessonList'>;

const LessonListScreen: React.FC = () => {
  const navigation = useNavigation<LessonListNavigationProp>();
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllLessons();
        setLessons(data);
      } catch (error) {
        console.error('Error loading lessons:', error);
      } finally {
        setLoading(false);
      }
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
            <Card.Cover 
              source={getImageSource(lesson.thumbnail) || { uri: 'https://placehold.co/600x400/png' }}
              style={styles.cardCover}
            />
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
  cardCover: {
    height: 200,
    backgroundColor: '#f8f8f8',
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
