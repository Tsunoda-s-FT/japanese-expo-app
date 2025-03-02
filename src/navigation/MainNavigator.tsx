import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LessonListScreen from '../screens/LessonListScreen';
import LessonDetailScreen from '../screens/LessonDetailScreen';
import CourseListScreen from '../screens/CourseListScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import QuizHistoryScreen from '../screens/QuizHistoryScreen';
import QuizHistoryDetailScreen from '../screens/QuizHistoryDetailScreen';
import LanguageSettingsScreen from '../screens/LanguageSettingsScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type MainStackParamList = {
  LessonList: undefined;
  LessonDetail: { lessonId: string };
  CourseList: undefined;
  CourseDetail: { courseId: string };
  QuizHistory: undefined;
  QuizHistoryDetail: { sessionId: string };
  LanguageSettings: undefined;
  Settings: undefined;
};

const MainStack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator: React.FC = () => {
  return (
    <MainStack.Navigator
      initialRouteName="LessonList"
      screenOptions={{
        headerShown: false
      }}
    >
      <MainStack.Screen
        name="LessonList"
        component={LessonListScreen}
      />
      <MainStack.Screen
        name="LessonDetail"
        component={LessonDetailScreen}
      />
      <MainStack.Screen
        name="CourseList"
        component={CourseListScreen}
      />
      <MainStack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
      />
      <MainStack.Screen
        name="QuizHistory"
        component={QuizHistoryScreen}
      />
      <MainStack.Screen
        name="QuizHistoryDetail"
        component={QuizHistoryDetailScreen}
      />
      <MainStack.Screen
        name="LanguageSettings"
        component={LanguageSettingsScreen}
      />
      <MainStack.Screen
        name="Settings"
        component={SettingsScreen}
      />
    </MainStack.Navigator>
  );
};

export default MainNavigator;
