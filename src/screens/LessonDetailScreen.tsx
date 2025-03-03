import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/MainNavigator';
import { Lesson } from '../types/contentTypes';
import { getLessonById } from '../services/contentService';
import { useLanguage } from '../context/LanguageContext';
import { AppHeader } from '../components';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';
import { getImageSource, isValidImage } from '../utils/image';
import { getLocalizedTagText } from '../utils/localization';

// LessonDetailScreenタイプ定義
type LessonDetailScreenNavigationProp = NativeStackNavigationProp<
  MainStackParamList,
  'LessonDetail'
>;

type LessonDetailScreenRouteProp = RouteProp<MainStackParamList, 'LessonDetail'>;

/**
 * レッスン詳細画面コンポーネント
 */
const LessonDetailScreen: React.FC = () => {
  const route = useRoute<LessonDetailScreenRouteProp>();
  const navigation = useNavigation<LessonDetailScreenNavigationProp>();
  const { lessonId } = route.params;
  const { language, t } = useLanguage();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 言語パラメータを渡して、現在の言語設定に応じたコンテンツを取得
        const data = await getLessonById(lessonId, language);
        setLesson(data || null);
      } catch (error) {
        console.error('Error loading lesson:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [lessonId, language]); // language を依存配列に含めて、言語変更時に再読み込み

  const handleCoursePress = (courseId: string) => {
    navigation.navigate('CourseDetail', { courseId });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader 
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
        <AppHeader 
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
      <AppHeader 
        title={lesson.title}
        showBack={true}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* サムネイル画像 - 常にプレースホルダー画像または実際の画像を表示 */}
        {lesson.thumbnail && (
          <View style={styles.imageContainer}>
            <Image
              source={getImageSource(lesson.thumbnail)}
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
                    {t('common.category', 'カテゴリー')}
                  </Title>
                  <Paragraph style={styles.metaValue}>{lesson.category}</Paragraph>
                </View>
                
                <View style={styles.metaItem}>
                  <Title style={styles.metaLabel}>
                    {t('common.estimatedTime', '推定時間')}
                  </Title>
                  <Paragraph style={styles.metaValue}>{lesson.totalEstimatedTime}</Paragraph>
                </View>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.coursesCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>
                {t('lessonDetail.availableCourses', '利用可能なコース')}
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
                        {t('common.level', 'レベル')}: {getLocalizedTagText('learningLevel', course.level, language)}
                      </Paragraph>
                      <Paragraph style={styles.courseMeta}>
                        {t('common.estimatedTime', '推定時間')}: {course.estimatedTime}
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
