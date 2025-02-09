import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, ActivityIndicator, ProgressBar, Card, RadioButton } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getCourseById } from '../services/contentService';
import { Course, QuizQuestion } from '../types/contentTypes';
import { useProgress } from '../context/ProgressContext';
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

  const { courseProgressMap, markQuizCompleted } = useProgress();

  useEffect(() => {
    setLoading(true);
    const foundCourse = getCourseById(courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      setQuestions(foundCourse.quizQuestions);
    }
    setLoading(false);
  }, [courseId]);

  const handleSubmit = () => {
    if (selectedOption === null || !course) return;

    const currentQuestion = questions[currentIndex];
    setShowExplanation(true);

    if (selectedOption === currentQuestion.answerIndex) {
      setCorrectCount(prev => prev + 1);
      markQuizCompleted(courseId, currentQuestion.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // クイズ完了、結果画面へ
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
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>クイズが見つかりません。</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;
  const cp = courseProgressMap.get(courseId);
  const isQuizCompleted = cp?.completedQuizIds.has(currentQuestion.id) ?? false;

  return (
    <ScrollView style={styles.container}>
      <ProgressBar progress={progress} style={styles.progressBar} />
      <Text style={styles.progressText}>{currentIndex + 1} / {questions.length}</Text>

      <Card style={styles.questionCard}>
        <Card.Content>
          <Text style={styles.question}>{currentQuestion.question}</Text>

          <RadioButton.Group
            onValueChange={(val) => setSelectedOption(Number(val))}
            value={selectedOption?.toString() || ''}
          >
            {currentQuestion.options.map((opt, idx) => (
              <RadioButton.Item
                key={idx}
                label={opt}
                value={idx.toString()}
                disabled={showExplanation}
                style={styles.radioItem}
              />
            ))}
          </RadioButton.Group>

          {showExplanation && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationTitle}>解説:</Text>
              <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
              <Text style={styles.resultText}>
                {selectedOption === currentQuestion.answerIndex ? '正解！' : '不正解'}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {!showExplanation ? (
        <Button
          mode="contained"
          onPress={handleSubmit}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  },
  progressBar: {
    marginBottom: 8
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666'
  },
  questionCard: {
    marginBottom: 16
  },
  question: {
    fontSize: 18,
    marginBottom: 16
  },
  radioItem: {
    marginVertical: 4
  },
  explanationBox: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginTop: 16,
    borderRadius: 8
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  explanationText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    color: '#2196F3'
  },
  button: {
    marginTop: 16
  }
});

export default CourseQuizScreen;
