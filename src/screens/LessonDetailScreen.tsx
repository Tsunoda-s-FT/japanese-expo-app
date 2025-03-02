import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { Lesson } from '../types/contentTypes';
import { getLessonById } from '../services/contentService';
import { useImprovedLanguage } from '../context/ImprovedLanguageContext';
import UnifiedHeader from '../components/UnifiedHeader';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';

// 画像のマッピング
const lessonImages: { [key: string]: any } = {
  'ojigi_aisatsu_business_woman.png': require('../../assets/images/lessons/ojigi_aisatsu_business_woman.png'),
  // 他の画像もここに追加
};

// 画像のパスから画像ソースを取得する関数
const getImageSource = (path: string) => {
  if (!path) return null;
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
  const { language, t } = useImprovedLanguage();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getLessonById(lessonId, language);
        setLesson(data || null);
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [lessonId, language]);

  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <UnifiedHeader 
          title={t('common.loading', 'Loading...')}
          showBack={true}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.container}>
        <UnifiedHeader 
          title={t('lessonDetail.notFound', 'Lesson Not Found')}
          showBack={true}
        />
        <View style={styles.errorContainer}>
          <Paragraph style={styles.errorText}>
            {t('lessonDetail.notFoundMessage', 'The requested lesson could not be found.')}
          </Paragraph>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UnifiedHeader 
        title={lesson.title}
        subtitle={lesson.category}
        showBack={true}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {lesson.thumbnail && (
          <View style={styles.imageContainer}>
            <Image
              source={getImageSource(lesson.thumbnail) || { uri: 'https://placehold.co/600x400/png' }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          </View>
        )}
        
        <View style={styles.content}>
          <Card style={styles.mainCard}>
            <Card.Content>
              <Paragraph style={styles.description}>{lesson.description}</Paragraph>
              
              <View style={styles.metaInfo}>
                <View style={styles.metaItem}>
                  <Title style={styles.metaLabel}>
                    {t('common.category', 'Category')}
                  </Title>
                  <Paragraph style={styles.metaValue}>{lesson.category}</Paragraph>
                </View>
                
                <View style={styles.metaItem}>
                  <Title style={styles.metaLabel}>
                    {t('common.estimatedTime', 'Estimated Time')}
                  </Title>
                  <Paragraph style={styles.metaValue}>{lesson.totalEstimatedTime}</Paragraph>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.coursesCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>
                {t('lessonDetail.availableCourses', 'Available Courses')}
              </Title>
              
              {lesson.courses.map((course) => (
                <Card
                  key={course.id}
                  style={styles.courseCard}
                  onPress={() => handleCoursePress(course.id)}
                >
                  <Card.Content>
                    <Title style={styles.courseTitle}>{course.title}</Title>
                    <Paragraph style={styles.courseDescription}>
                      {course.description}
                    </Paragraph>
                    
                    <View style={styles.courseMetaContainer}>
                      <Paragraph style={styles.courseMeta}>
                        {t('common.level', 'Level')}: {course.level}
                      </Paragraph>
                      <Paragraph style={styles.courseMeta}>
                        {t('common.estimatedTime', 'Estimated Time')}: {course.estimatedTime}
                      </Paragraph>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  mainCard: {
    margin: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: spacing.md,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  metaValue: {
    fontSize: 16,
    color: colors.text,
  },
  coursesCard: {
    margin: spacing.md,
    marginTop: 0,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.text,
  },
  courseCard: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  courseTitle: {
    fontSize: 18,
    marginBottom: spacing.xs,
  },
  courseDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  courseMetaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  courseMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default LessonDetailScreen;
