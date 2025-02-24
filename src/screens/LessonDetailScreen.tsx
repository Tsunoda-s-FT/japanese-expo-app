import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { Lesson } from '../types/contentTypes';
import { getLessonById } from '../services/contentService';
import { useLanguage } from '../context/LanguageContext';

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

type LessonDetailRouteProp = RouteProp<MainStackParamList, 'LessonDetail'>;
type LessonDetailNavigationProp = NativeStackNavigationProp<MainStackParamList, 'LessonDetail'>;

const LessonDetailScreen: React.FC = () => {
  const route = useRoute<LessonDetailRouteProp>();
  const navigation = useNavigation<LessonDetailNavigationProp>();
  const { lessonId } = route.params;
  const { language, translations } = useLanguage();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const foundLesson = await getLessonById(lessonId, language);
      if (foundLesson) {
        setLesson(foundLesson);
      }
      setLoading(false);
    };
    loadData();
  }, [lessonId, language]);

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

  if (!lesson) {
    return (
      <View style={styles.errorContainer}>
        <Paragraph>{language === 'ja' ? 'レッスンが見つかりません。' : 'Lesson not found.'}</Paragraph>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {lesson.thumbnail && (
        <Image
          source={getImageSource(lesson.thumbnail) || { uri: 'https://placehold.co/600x400/png' }}
          style={styles.thumbnail}
        />
      )}
      
      <View style={styles.content}>
        <Title style={styles.header}>{lesson.title}</Title>
        <Paragraph style={styles.description}>{lesson.description}</Paragraph>
        <Paragraph style={styles.meta}>
          {language === 'ja' ? 'カテゴリー: ' : 'Category: '}{lesson.category} • 
          {language === 'ja' ? '所要時間: ' : 'Estimated time: '}{lesson.totalEstimatedTime}
        </Paragraph>

        <Title style={styles.subHeader}>
          {language === 'ja' ? 'コース一覧' : 'Courses'}
        </Title>
        {lesson.courses.map((course) => (
          <Card
            key={course.id}
            style={styles.card}
            onPress={() => handleCoursePress(course.id)}
          >
            <Card.Content>
              <Title>{course.title}</Title>
              <Paragraph style={styles.courseDescription}>
                {course.description}
              </Paragraph>
              <View style={styles.courseMeta}>
                <Paragraph style={styles.courseMetaText}>
                  {language === 'ja' ? 'レベル: ' : 'Level: '}{course.level}
                </Paragraph>
                <Paragraph style={styles.courseMetaText}>
                  {language === 'ja' ? '所要時間: ' : 'Estimated time: '}{course.estimatedTime}
                </Paragraph>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
    borderRadius: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    color: '#666',
  },
  meta: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  subHeader: {
    fontSize: 20,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  courseDescription: {
    marginTop: 4,
    color: '#666',
  },
  courseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  courseMetaText: {
    fontSize: 12,
    color: '#888',
  },
});

export default LessonDetailScreen;
