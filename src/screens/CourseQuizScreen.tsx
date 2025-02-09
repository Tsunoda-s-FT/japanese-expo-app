import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, ActivityIndicator, ProgressBar, Card, RadioButton } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getCourse } from '../services/contentService';
import { Course, QuizQuestion } from '../types/contentTypes';
import { useProgress } from '../contexts/ProgressContext';
import { Audio } from 'expo-av';
import { playAudio } from '../utils/audioUtils';

type CourseQuizRouteProp = RouteProp<RootStackParamList, 'CourseQuiz'>;
type CourseQuizNavProp = NativeStackNavigationProp<RootStackParamList, 'CourseQuiz'>;

const CourseQuizScreen: React.FC = () => {
  const route = useRoute<CourseQuizRouteProp>();
  const navigation = useNavigation<CourseQuizNavProp>();
  const { courseId } = route.params;

  const [course, setCourse] = useState<Course | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState<Audio.Sound>();

  const { markQuizCompleted } = useProgress();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const foundCourse = await getCourse(courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        setQuestions(foundCourse.quizQuestions);
      }
      setLoading(false);
    })();
  }, [courseId]);

  // サウンドのクリーンアップ
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleAnswer = async () => {
    if (selectedOption === null || !course) return;

    const currentQuestion = questions[currentIndex];
    if (selectedOption === currentQuestion.answerIndex) {
      setCorrectCount(prev => prev + 1);
      await markQuizCompleted(courseId, currentQuestion.id);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // クイズ終了、結果画面へ
      navigation.navigate('QuizResult', {
        courseId,
        correctCount,
        totalCount: questions.length
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!course || questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>クイズが見つかりませんでした。</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;

  return (
    <ScrollView style={styles.container}>
      <ProgressBar progress={progress} />
      <Text style={styles.progress}>
        {currentIndex + 1} / {questions.length}
      </Text>

      <Card style={styles.questionCard}>
        <Card.Content>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          <RadioButton.Group
            onValueChange={value => setSelectedOption(Number(value))}
            value={selectedOption?.toString() ?? ''}
          >
            {currentQuestion.options.map((option, index) => (
              <RadioButton.Item
                key={index}
                label={option}
                value={index.toString()}
                disabled={showExplanation}
              />
            ))}
          </RadioButton.Group>

          {showExplanation && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {!showExplanation ? (
        <Button
          mode="contained"
          onPress={handleAnswer}
          disabled={selectedOption === null}
          style={styles.button}
        >
          回答する
        </Button>
      ) : (
        <Button
          mode="contained"
          onPress={handleNext}
          style={styles.button}
        >
          {currentIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
        </Button>
      )}
    </ScrollView>
  );
};

export default CourseQuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    textAlign: 'center',
    marginVertical: 8,
  },
  questionCard: {
    marginVertical: 16,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 16,
  },
  explanationContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  explanationText: {
    fontSize: 14,
  },
  button: {
    marginTop: 16,
  },
});
