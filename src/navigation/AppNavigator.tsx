import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CourseListScreen from '../screens/CourseListScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import CourseLearningScreen from '../screens/CourseLearningScreen';
import CourseQuizScreen from '../screens/CourseQuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';

export type RootStackParamList = {
  CourseList: undefined;
  CourseDetail: { courseId: string };
  CourseLearning: { courseId: string };
  CourseQuiz: { courseId: string };
  QuizResult: { correctCount: number; totalCount: number; courseId?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="CourseList"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#f8f8f8'
        },
        headerTintColor: '#333'
      }}
    >
      <Stack.Screen
        name="CourseList"
        component={CourseListScreen}
        options={{ title: '日本語学習コース' }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{ title: 'コース詳細' }}
      />
      <Stack.Screen
        name="CourseLearning"
        component={CourseLearningScreen}
        options={{ title: 'コース学習' }}
      />
      <Stack.Screen
        name="CourseQuiz"
        component={CourseQuizScreen}
        options={{ title: 'コースクイズ' }}
      />
      <Stack.Screen
        name="QuizResult"
        component={QuizResultScreen}
        options={{ title: '結果' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
