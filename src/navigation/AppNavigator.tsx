import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LessonDetailScreen from '../screens/LessonDetailScreen';
import PhraseLearningScreen from '../screens/PhraseLearningScreen';
import QuizScreen from '../screens/QuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';

export type RootStackParamList = {
  Home: undefined;
  LessonDetail: { lessonId: string };
  PhraseLearning: { lessonId: string; phraseId?: string };
  Quiz: { lessonId?: string } | undefined;
  QuizResult: { correctCount: number; totalCount: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'ホーム', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name="LessonDetail"
        component={LessonDetailScreen}
        options={{ title: 'レッスン詳細', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name="PhraseLearning"
        component={PhraseLearningScreen}
        options={{ title: 'フレーズ学習', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ title: 'クイズ', headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name="QuizResult"
        component={QuizResultScreen}
        options={{ title: '結果', headerTitleAlign: 'center' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
