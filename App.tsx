import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { ProgressProvider } from './src/contexts/ProgressContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import LessonListScreen from './src/screens/LessonListScreen';
import LessonDetailScreen from './src/screens/LessonDetailScreen';
import CourseLearningScreen from './src/screens/CourseLearningScreen';
import CourseQuizScreen from './src/screens/CourseQuizScreen';

export type RootStackParamList = {
  LessonList: undefined;
  LessonDetail: { lessonId: string };
  CourseLearning: { courseId: string };
  CourseQuiz: { courseId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF5722',
    secondary: '#FFC107',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <ProgressProvider>
        <LanguageProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="LessonList"
              screenOptions={{
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen
                name="LessonList"
                component={LessonListScreen}
                options={{ title: '日本語学習' }}
              />
              <Stack.Screen
                name="LessonDetail"
                component={LessonDetailScreen}
                options={{ title: 'レッスン詳細' }}
              />
              <Stack.Screen
                name="CourseLearning"
                component={CourseLearningScreen}
                options={{ title: 'フレーズ学習' }}
              />
              <Stack.Screen
                name="CourseQuiz"
                component={CourseQuizScreen}
                options={{ title: 'クイズ' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </LanguageProvider>
      </ProgressProvider>
    </PaperProvider>
  );
}
