import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, ActivityIndicator, Divider, Card } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MainStackParamList } from '../navigation/MainNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getCourseById, getLessonForCourse } from '../services/contentService';
import { Course, Lesson } from '../types/contentTypes';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';
import { AppHeader } from '../components';
import { colors, spacing, borderRadius, shadows } from '../theme/theme';
import { formatJapaneseDate } from '../utils/format';
import { getLocalizedTagText } from '../utils/localization';

type CourseDetailRouteProp = RouteProp<MainStackParamList, 'CourseDetail'>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList>;

const CourseDetailScreen: React.FC = () => {
  const route = useRoute<CourseDetailRouteProp>();
  const navigation = useNavigation<RootNavProp>();
  const { courseId } = route.params;
  const { language, t } = useLanguage();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonId, setLessonId] = useState<string | null>(null);

  const { getCourseProgressRatio, getCourseQuizProgressRatio, quizLogs, isCourseCompleted } = useProgress();

  useEffect(() => {
    const loadData = async () => {
      try {
        // 言語パラメータを渡す
        const data = await getCourseById(courseId, language);
        setCourse(data || null);
        
        // コースが所属するレッスンIDを見つける
        if (data) {
          // getLessonForCourseは非同期関数なのでawaitを使用
          const lesson = await getLessonForCourse(courseId);
          if (lesson) {
            setLessonId(lesson.id);
          }
        }
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [courseId, language]); // language を依存配列に追加して、言語変更時に再読み込み
  
  const handleStartLearning = () => {
    if (!course) return;
    navigation.navigate('Session', {
      screen: 'CourseLearning',
      params: { courseId },
    });
  };

  const handleStartQuiz = () => {
    if (!course) return;
    navigation.navigate('Session', {
      screen: 'CourseQuiz',
      params: { courseId },
    });
  };

  const handleViewQuizHistory = (sessionId: string) => {
    navigation.navigate('Main', {
      screen: 'QuizHistoryDetail',
      params: { sessionId },
    });
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

  if (!course) {
    return (
      <View style={styles.container}>
        <AppHeader 
          title={t('courseDetail.notFound', 'Course Not Found')}
          showBack={true}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {t('courseDetail.notFoundMessage', 'The requested course could not be found.')}
          </Text>
        </View>
    </View>
    );
  }

  // 進捗状況の計算
  const phraseProgress = getCourseProgressRatio(courseId);
  const quizProgress = getCourseQuizProgressRatio(courseId);
  const totalProgress = (phraseProgress + quizProgress) / 2;

  // このコース用のクイズ履歴を抽出
  const courseQuizLogs = quizLogs
    .filter(log => log.courseId === courseId && log.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <View style={styles.container}>
      <AppHeader 
        title={course.title}
        subtitle={getLocalizedTagText('learningLevel', course.level, language)}
        showBack={true}
        progress={totalProgress}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Card style={styles.mainCard}>
          <Card.Content>
            {lessonId && isCourseCompleted(lessonId, courseId) && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>{t('common.completed', '完了')}</Text>
              </View>
            )}
            <Text style={styles.description}>{course.description}</Text>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>{t('common.level', 'レベル')}</Text>
                <Text style={styles.metaValue}>{getLocalizedTagText('learningLevel', course.level, language)}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>{t('common.estimatedTime', '推定時間')}</Text>
                <Text style={styles.metaValue}>{course.estimatedTime}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>{t('common.phrases', 'フレーズ')}</Text>
                <Text style={styles.metaValue}>{course.phrases.length}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>{t('common.quizzes', 'クイズ')}</Text>
                <Text style={styles.metaValue}>{course.quizQuestions.length}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.progressCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              {t('courseDetail.progress', '進捗状況')}
            </Text>
            
            <View style={styles.progressItem}>
              <View style={styles.progressLabelContainer}>
                <Text style={styles.progressLabel}>
                  {t('courseDetail.learningProgress', '学習')}
                </Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(phraseProgress * 100)}%
                </Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${Math.round(phraseProgress * 100)}%`,
                      backgroundColor: colors.primary 
                    }
                  ]} 
                />
              </View>
            </View>
            
            <View style={styles.progressItem}>
              <View style={styles.progressLabelContainer}>
                <Text style={styles.progressLabel}>
                  {t('courseDetail.quizProgress', 'クイズ')}
                </Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(quizProgress * 100)}%
                </Text>
              </View>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { 
                      width: `${Math.round(quizProgress * 100)}%`,
                      backgroundColor: colors.accent 
                    }
                  ]} 
                />
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <View style={styles.actionButtonsContainer}>
          <Button
            mode="contained"
            onPress={handleStartLearning}
            style={styles.actionButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon="book-open-variant"
          >
            {t('courseDetail.startLearning', '学習を開始')}
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleStartQuiz}
            style={styles.actionButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.outlineButtonLabel}
            icon="clipboard-list"
            disabled={course.quizQuestions.length === 0}
          >
            {t('courseDetail.takeQuiz', 'クイズを受ける')}
          </Button>
        </View>
        
        <Card style={styles.historyCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              {t('courseDetail.quizHistory', 'クイズ履歴')}
            </Text>
            
            {courseQuizLogs.length === 0 ? (
              <Text style={styles.noHistoryText}>
                {t('courseDetail.noHistory', 'クイズ履歴はありません。')}
              </Text>
            ) : (
              courseQuizLogs.slice(0, 5).map((log) => {
                const dateObj = new Date(log.date);
                const scorePercent = Math.round((log.correctCount / log.totalCount) * 100);
                
                return (
                  <TouchableOpacity
                    key={log.sessionId}
                    style={styles.historyItem}
                    onPress={() => handleViewQuizHistory(log.sessionId)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.historyContent}>
                      <Text style={styles.historyDate}>
                        {formatJapaneseDate(dateObj, true)}
                      </Text>
                      <View style={styles.scoreContainer}>
                        <Text style={[
                          styles.score, 
                          getScoreStyle(scorePercent)
                        ]}>
                          {log.correctCount}/{log.totalCount}
                        </Text>
                        <Text style={[
                          styles.scorePercentage,
                          getScoreStyle(scorePercent)
                        ]}>
                          {scorePercent}%
                        </Text>
                      </View>
                    </View>
                    
                    <Divider style={styles.historyDivider} />
                  </TouchableOpacity>
                );
              })
            )}
            
            {courseQuizLogs.length > 5 && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('Main', { screen: 'QuizHistory' })}
              >
                <Text style={styles.viewAllText}>
                  {t('courseDetail.viewAllHistory', 'すべての履歴を表示')}
                </Text>
              </TouchableOpacity>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

// スコアのスタイルを決定するヘルパー関数
const getScoreStyle = (score: number) => {
  if (score >= 80) return { color: colors.success };
  if (score >= 60) return { color: colors.accent };
  return { color: colors.error };
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
  mainCard: {
    margin: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.md,
    color: colors.text,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  metaItem: {
    width: '50%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  progressCard: {
    margin: spacing.md,
    marginTop: 0,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.text,
  },
  progressItem: {
    marginBottom: spacing.sm,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.text,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: spacing.md,
    marginTop: 0,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  historyCard: {
    margin: spacing.md,
    marginTop: 0,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  noHistoryText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: spacing.md,
  },
  historyItem: {
    paddingVertical: spacing.sm,
  },
  historyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: spacing.sm,
  },
  scorePercentage: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyDivider: {
    marginTop: spacing.sm,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  viewAllText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  completedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  completedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CourseDetailScreen;
