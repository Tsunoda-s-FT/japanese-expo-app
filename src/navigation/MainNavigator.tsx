import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LessonListScreen from '../screens/LessonListScreen';
import LessonDetailScreen from '../screens/LessonDetailScreen';
import CourseListScreen from '../screens/CourseListScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import QuizHistoryScreen from '../screens/QuizHistoryScreen';
import QuizHistoryDetailScreen from '../screens/QuizHistoryDetailScreen';
import LanguageSettingsScreen from '../screens/LanguageSettingsScreen';
import { useLanguage } from '../context/LanguageContext';

export type MainStackParamList = {
  LessonList: undefined;
  LessonDetail: { lessonId: string };
  CourseList: undefined;
  CourseDetail: { courseId: string };
  QuizHistory: undefined;
  QuizHistoryDetail: { sessionId: string };
  LanguageSettings: undefined;
};

const MainStack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator: React.FC = () => {
  const { language } = useLanguage();

  const screenTitles = {
    lessonList: language === 'ja' ? 'レッスン一覧' : 'Lessons',
    lessonDetail: language === 'ja' ? 'レッスン詳細' : 'Lesson Details',
    courseList: language === 'ja' ? 'コース一覧' : 'Courses',
    courseDetail: language === 'ja' ? 'コース詳細' : 'Course Details',
    quizHistory: language === 'ja' ? 'クイズ履歴' : 'Quiz History',
    quizHistoryDetail: language === 'ja' ? '履歴詳細' : 'History Details',
    languageSettings: language === 'ja' ? '言語設定' : 'Language Settings',
  };

  return (
    <MainStack.Navigator
      initialRouteName="LessonList"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#f8f8f8' },
        headerTintColor: '#333',
      }}
    >
      <MainStack.Screen
        name="LessonList"
        component={LessonListScreen}
        options={{ title: screenTitles.lessonList }}
      />
      <MainStack.Screen
        name="LessonDetail"
        component={LessonDetailScreen}
        options={{ title: screenTitles.lessonDetail }}
      />
      <MainStack.Screen
        name="CourseList"
        component={CourseListScreen}
        options={{ title: screenTitles.courseList }}
      />
      <MainStack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{ title: screenTitles.courseDetail }}
      />
      <MainStack.Screen
        name="QuizHistory"
        component={QuizHistoryScreen}
        options={{ title: screenTitles.quizHistory }}
      />
      <MainStack.Screen
        name="QuizHistoryDetail"
        component={QuizHistoryDetailScreen}
        options={{ title: screenTitles.quizHistoryDetail }}
      />
      <MainStack.Screen
        name="LanguageSettings"
        component={LanguageSettingsScreen}
        options={{ title: screenTitles.languageSettings }}
      />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
