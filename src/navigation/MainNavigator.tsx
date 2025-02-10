import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LessonListScreen from '../screens/LessonListScreen';
import LessonDetailScreen from '../screens/LessonDetailScreen';
import CourseListScreen from '../screens/CourseListScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import QuizHistoryScreen from '../screens/QuizHistoryScreen';
import QuizHistoryDetailScreen from '../screens/QuizHistoryDetailScreen';

export type MainStackParamList = {
  LessonList: undefined;
  LessonDetail: { lessonId: string };
  CourseList: undefined;
  CourseDetail: { courseId: string };
  QuizHistory: undefined;
  QuizHistoryDetail: { sessionId: string };
};

const MainStack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator: React.FC = () => {
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
        options={{ title: 'レッスン一覧' }}
      />
      <MainStack.Screen
        name="LessonDetail"
        component={LessonDetailScreen}
        options={{ title: 'レッスン詳細' }}
      />
      <MainStack.Screen
        name="CourseList"
        component={CourseListScreen}
        options={{ title: 'コース一覧' }}
      />
      <MainStack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{ title: 'コース詳細' }}
      />
      <MainStack.Screen
        name="QuizHistory"
        component={QuizHistoryScreen}
        options={{ title: 'クイズ履歴' }}
      />
      <MainStack.Screen
        name="QuizHistoryDetail"
        component={QuizHistoryDetailScreen}
        options={{ title: '履歴詳細' }}
      />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
