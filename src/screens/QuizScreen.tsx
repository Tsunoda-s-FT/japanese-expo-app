import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Text as PaperText, Button, ActivityIndicator, RadioButton } from 'react-native-paper';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { QuizQuestion } from '../types/contentTypes';
import { generateQuizQuestions } from '../services/quizService';

type QuizRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
type QuizNavProp = NativeStackNavigationProp<RootStackParamList, 'Quiz'>;

const QuizScreen: React.FC = () => {
  const route = useRoute<QuizRouteProp>();
  const navigation = useNavigation<QuizNavProp>();
  const lessonId = route.params?.lessonId ?? null;

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const generated = await generateQuizQuestions(lessonId);
      setQuestions(generated);
      setLoading(false);
    })();
  }, [lessonId]);

  const currentQuestion = questions[currentIndex];

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} />;
  }
  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text>問題がありません</Text>
      </View>
    );
  }

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setShowExplanation(true);
    if (selectedOption === currentQuestion.answerIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      navigation.replace('QuizResult', {
        correctCount,
        totalCount: questions.length
      });
    } else {
      setCurrentIndex(nextIndex);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  return (
    <View style={styles.container}>
      <PaperText style={styles.questionTitle}>
        {`Q${currentIndex + 1}. ${currentQuestion.question}`}
      </PaperText>
      <RadioButton.Group
        value={selectedOption === null ? '' : selectedOption.toString()}
        onValueChange={(value) => setSelectedOption(value === '' ? null : parseInt(value, 10))}
      >
        {currentQuestion.options.map((opt, idx) => (
          <View style={styles.optionRow} key={idx}>
            <RadioButton.Android value={idx.toString()} />
            <PaperText style={styles.optionText} onPress={() => setSelectedOption(idx)}>{opt}</PaperText>
          </View>
        ))}
      </RadioButton.Group>

      {!showExplanation ? (
        <Button
          mode="contained"
          onPress={handleSubmitAnswer}
          disabled={selectedOption === null}
          style={{ marginTop: 20 }}
        >
          回答
        </Button>
      ) : (
        <View style={styles.explanationContainer}>
          <PaperText style={{ fontWeight: 'bold' }}>
            {selectedOption === currentQuestion.answerIndex
              ? '正解です！'
              : '不正解です'}
          </PaperText>
          <PaperText style={{ marginVertical: 8 }}>{currentQuestion.explanation}</PaperText>
          <Button mode="outlined" onPress={handleNext}>
            次へ
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  questionTitle: {
    fontSize: 18,
    marginBottom: 12
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  optionText: {
    marginLeft: 8
  },
  explanationContainer: {
    backgroundColor: '#eee',
    padding: 12,
    marginTop: 16
  }
});

export default QuizScreen;
