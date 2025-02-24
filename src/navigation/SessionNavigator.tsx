import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CourseLearningScreen from '../screens/CourseLearningScreen';
import CourseQuizScreen from '../screens/CourseQuizScreen';
import QuizResultScreen from '../screens/QuizResultScreen';
import CourseLearningCompleteScreen from '../screens/CourseLearningCompleteScreen';
import { useLanguage } from '../context/LanguageContext';

export type SessionStackParamList = {
  CourseLearning: { courseId: string };
  CourseQuiz: { courseId: string };
  QuizResult: { correctCount: number; totalCount: number; courseId?: string };
  CourseLearningComplete: { courseId: string };
};

const SessionStack = createNativeStackNavigator<SessionStackParamList>();

const SessionNavigator: React.FC = () => {
  const { language } = useLanguage();

  const screenTitles = {
    learningMode: language === 'ja' ? '学習モード' : 'Learning Mode',
    quizMode: language === 'ja' ? 'クイズモード' : 'Quiz Mode',
    quizResult: language === 'ja' ? 'クイズ結果' : 'Quiz Results',
    learningComplete: language === 'ja' ? '学習完了' : 'Learning Complete',
  };

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
        options={{ title: screenTitles.learningMode }}
      />
      <SessionStack.Screen
        name="CourseQuiz"
        component={CourseQuizScreen}
        options={{ title: screenTitles.quizMode }}
      />
      <SessionStack.Screen
        name="QuizResult"
        component={QuizResultScreen}
        options={{ title: screenTitles.quizResult }}
      />
      <SessionStack.Screen
        name="CourseLearningComplete"
        component={CourseLearningCompleteScreen}
        options={{ title: screenTitles.learningComplete }}
      />
    </SessionStack.Navigator>
  );
};

export default SessionNavigator;
