import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CourseLearningScreen from '../screens/CourseLearningScreen';
import CourseQuizScreen from '../screens/CourseQuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';

export type SessionStackParamList = {
  CourseLearning: { courseId: string };
  CourseQuiz: { courseId: string };
  QuizResult: { correctCount: number; totalCount: number; courseId?: string };
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
    </SessionStack.Navigator>
  );
};

export default SessionNavigator;
