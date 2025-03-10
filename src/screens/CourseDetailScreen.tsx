import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, ActivityIndicator, ProgressBar, Card, Title, Paragraph } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MainStackParamList } from '../navigation/MainNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getCourseById } from '../services/contentService';
import { Course } from '../types/contentTypes';
import { useProgress } from '../context/ProgressContext';
import { useLanguage } from '../context/LanguageContext';

type CourseDetailRouteProp = RouteProp<MainStackParamList, 'CourseDetail'>;
type RootNavProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const CourseDetailScreen: React.FC = () => {
  const route = useRoute<CourseDetailRouteProp>();
  const navigation = useNavigation<RootNavProp>();
  const { courseId } = route.params;
  const { language, translations } = useLanguage();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const { courseProgressMap, quizLogs } = useProgress();

  useEffect(() => {
    const foundCourse = getCourseById(courseId, language);
    setCourse(foundCourse || null);
    setLoading(false);
  }, [courseId, language]);

  const handleStartCourse = () => {
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
    return <ActivityIndicator style={styles.loading} />;
  }

  if (!course) {
    return <Text style={styles.error}>{language === 'ja' ? 'コースが見つかりません。' : 'Course not found.'}</Text>;
  }

  // 進捗状況の計算
  const totalPhrases = course.phrases.length;
  const totalQuizzes = course.quizQuestions.length;

  const cp = courseProgressMap.get(courseId);
  const learnedCount = cp ? cp.learnedPhraseIds.size : 0;
  const quizCompletedCount = cp ? cp.completedQuizIds.size : 0;

  const phraseProgressRatio = totalPhrases > 0 ? learnedCount / totalPhrases : 0;
  const quizProgressRatio = totalQuizzes > 0 ? quizCompletedCount / totalQuizzes : 0;

  // このコース用のクイズ履歴を抽出
  const courseQuizLogs = quizLogs
    .filter(log => log.courseId === courseId && log.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{course.title}</Title>
          <Paragraph>{course.description}</Paragraph>
          <View style={styles.metaInfo}>
            <Text>{language === 'ja' ? 'レベル: ' : 'Level: '}{course.level}</Text>
            <Text>{language === 'ja' ? '所要時間: ' : 'Estimated time: '}{course.estimatedTime}</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.progressContainer}>
        <Text>
          {language === 'ja' ? 'フレーズ進捗: ' : 'Phrase Progress: '}
          {(phraseProgressRatio * 100).toFixed(0)}%
        </Text>
        <ProgressBar progress={phraseProgressRatio} style={styles.progressBar} />

        <Text>
          {language === 'ja' ? 'クイズ進捗: ' : 'Quiz Progress: '}
          {(quizProgressRatio * 100).toFixed(0)}%
        </Text>
        <ProgressBar progress={quizProgressRatio} style={styles.progressBar} />
      </View>

      <Button
        mode="contained"
        style={styles.button}
        onPress={handleStartCourse}
      >
        {language === 'ja' ? 'コース学習を開始' : 'Start Learning'}
      </Button>

      <Button
        mode="outlined"
        style={styles.button}
        onPress={handleStartQuiz}
        disabled={course.quizQuestions.length === 0}
      >
        {language === 'ja' ? 'コースのクイズを受ける' : 'Take Quiz'}
      </Button>

      <View style={styles.historyContainer}>
        <Title style={styles.historyTitle}>
          {language === 'ja' ? 'このコースのクイズ履歴' : 'Quiz History for this Course'}
        </Title>

        {courseQuizLogs.length === 0 ? (
          <Paragraph style={styles.noHistoryText}>
            {language === 'ja' 
              ? 'まだクイズを完了した履歴がありません。'
              : 'No completed quiz history available yet.'}
          </Paragraph>
        ) : (
          courseQuizLogs.map((log) => {
            const dateObj = new Date(log.date);
            const dateString = dateObj.toLocaleString(language === 'ja' ? 'ja-JP' : 'en-US', {
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit',
            });
            const scorePercent = Math.round((log.correctCount / log.totalCount) * 100);
            return (
              <TouchableOpacity
                key={log.sessionId}
                activeOpacity={0.8}
                onPress={() => handleViewQuizHistory(log.sessionId)}
              >
                <Card key={log.sessionId} style={styles.historyCard}>
                  <Card.Content>
                    <Text style={styles.historyDate}>{dateString}</Text>
                    <Text>
                      {language === 'ja' ? 'スコア: ' : 'Score: '}
                      {log.correctCount}/{log.totalCount} ({scorePercent}%)
                    </Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20
  },
  card: {
    marginBottom: 16
  },
  metaInfo: {
    marginTop: 8
  },
  progressContainer: {
    marginVertical: 16
  },
  progressBar: {
    height: 8,
    marginVertical: 4
  },
  button: {
    marginTop: 8,
  },
  historyContainer: {
    marginTop: 24,
  },
  historyTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  noHistoryText: {
    color: '#666',
    marginBottom: 16,
  },
  historyCard: {
    marginVertical: 6,
  },
  historyDate: {
    color: '#999',
    marginBottom: 4,
  },
});

export default CourseDetailScreen;
