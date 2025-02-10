import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CourseLearningScreen from '../screens/CourseLearningScreen';
import CourseQuizScreen from '../screens/CourseQuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';
import CourseLearningCompleteScreen from '../screens/CourseLearningCompleteScreen';

export type SessionStackParamList = {
  CourseLearning: { courseId: string };
  CourseQuiz: { courseId: string };
  QuizResult: { correctCount: number; totalCount: number; courseId?: string };
  CourseLearningComplete: { courseId: string };
};

const SessionStack = createNativeStackNavigator<SessionStackParamList>();

const SessionNavigator: React.FC = () => {
  return (
    <SessionStack.Navigator
      screenOptions={{
        headerBackVisible: false,
        gestureEnabled: false,
      }}
    >
      <SessionStack.Screen
        name="CourseLearning"
        component={CourseLearningScreen}
        options={{ title: '学習モード' }}
      />
      <SessionStack.Screen
        name="CourseQuiz"
        component={CourseQuizScreen}
        options={{ title: 'クイズモード' }}
      />
      <SessionStack.Screen
        name="QuizResult"
        component={QuizResultScreen}
        options={{ title: 'クイズ結果' }}
      />
      <SessionStack.Screen
        name="CourseLearningComplete"
        component={CourseLearningCompleteScreen}
        options={{ title: '学習完了' }}
      />
    </SessionStack.Navigator>
  );
};

export default SessionNavigator;
