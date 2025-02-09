import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, BackHandler } from 'react-native';
import { Text, Button, ActivityIndicator, ProgressBar, Card, RadioButton } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getCourseById } from '../services/contentService';
import { Course, QuizQuestion } from '../types/contentTypes';
import { useProgress } from '../context/ProgressContext';

type CourseQuizRouteProp = RouteProp<RootStackParamList, 'CourseQuiz'>;
type CourseQuizNavProp = NativeStackNavigationProp<RootStackParamList, 'CourseQuiz'>;

const CourseQuizScreen: React.FC = () => {
  const route = useRoute<CourseQuizRouteProp>();
  const navigation = useNavigation<CourseQuizNavProp>();
  const { courseId } = route.params;

  // コース情報 & 問題リスト
  const [course, setCourse] = useState<Course | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ユーザーが選んだオプションや正誤表示の状態
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // スコア計算用
  const [correctCount, setCorrectCount] = useState(0);

  // ローディング中かどうか
  const [loading, setLoading] = useState(true);

  // クイズセッション管理
  const [sessionId, setSessionId] = useState<string | null>(null);
  const {
    markQuizCompleted,
    createNewQuizSession,
    addAnswerToQuizSession,
    finalizeQuizSession,
    abortQuizSession,
    getQuizSessionById,
  } = useProgress();

  /**
   * 1. コンポーネント初期マウント時にだけ「コースを読み込み & 新規セッションを生成」する
   *   - 不必要に再実行しないために、useEffectの依存配列を空配列[]にする
   */
  useEffect(() => {
    // コース取得
    const foundCourse = getCourseById(courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      setQuestions(foundCourse.quizQuestions);
    }
    setLoading(false);

    // 新しいクイズセッションを1回だけ生成
    const newSessionId = createNewQuizSession(courseId);
    setSessionId(newSessionId);

    // ナビゲーションの戻る操作を無効化 (ヘッダーバックとスワイプ戻り)
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });

    // 画面離脱(beforeRemove)で中断確認
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // セッションがまだ ongoing なら離脱をブロックして確認
      if (sessionId) {
        const session = getQuizSessionById(sessionId);
        if (session?.status === 'ongoing') {
          e.preventDefault();
          Alert.alert(
            '確認',
            'クイズを中断して他の画面に移動しますか？\n進捗は保存されません。',
            [
              { text: '続ける', style: 'cancel' },
              {
                text: '中断',
                style: 'destructive',
                onPress: () => {
                  abortQuizSession(sessionId, currentIndex);
                  navigation.dispatch(e.data.action);
                },
              },
            ]
          );
        }
      }
    });

    // Android物理バックキーを無効化
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (sessionId) {
        const session = getQuizSessionById(sessionId);
        if (session?.status === 'ongoing') {
          Alert.alert(
            '確認',
            'クイズを中断しますか？\n進捗は保存されません。',
            [
              { text: 'キャンセル', style: 'cancel' },
              {
                text: '中断する',
                style: 'destructive',
                onPress: () => {
                  abortQuizSession(sessionId, currentIndex);
                  navigation.navigate('CourseDetail', { courseId });
                },
              },
            ]
          );
          return true; // BackHandlerをキャンセル
        }
      }
      return false; // sessionがなければデフォルト動作(戻る)
    });

    // Cleanup: アンマウント時にリスナーを解除
    return () => {
      unsubscribe();
      backHandler.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  // ↑ 空配列にすることで、この処理を「1回だけ」実行

  /**
   * 2. 回答ボタンを押すと実行
   */
  const handleSubmit = () => {
    if (selectedOption === null || !course || !sessionId) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.answerIndex;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      // コース進捗にもクイズ完了をマーク
      markQuizCompleted(courseId, currentQuestion.id);
    }

    // セッションログに回答を保存
    addAnswerToQuizSession(sessionId, currentQuestion.id, selectedOption, isCorrect);

    // 解説を表示
    setShowExplanation(true);
  };

  /**
   * 3. 次へ or 最終問題なら結果画面へ
   */
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      // 次の問題
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // 最終問題に回答済み → セッションをcompletedに
      if (sessionId) {
        finalizeQuizSession(sessionId);
      }
      // 結果画面へ (戻る操作で戻れないようreplace)
      navigation.replace('QuizResult', {
        courseId,
        correctCount,
        totalCount: questions.length,
      });
    }
  };

  // ロード中の表示
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 問題が無い場合の表示
  if (!course || questions.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>クイズが見つかりません。</Text>
      </View>
    );
  }

  // 現在の問題
  const currentQuestion = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;

  return (
    <ScrollView style={styles.container}>
      {/* プログレスバー */}
      <ProgressBar progress={progress} style={styles.progressBar} />
      <Text style={styles.progressText}>
        {currentIndex + 1} / {questions.length}
      </Text>

      {/* 問題カード */}
      <Card style={styles.questionCard}>
        <Card.Content>
          <Text style={styles.question}>{currentQuestion.question}</Text>

          {/* 選択肢 (RadioButton) */}
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

          {/* 解説 */}
          {showExplanation && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationTitle}>解説:</Text>
              <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
              <Text
                style={[
                  styles.resultText,
                  {
                    color:
                      selectedOption === currentQuestion.answerIndex
                        ? '#4CAF50'
                        : '#F44336',
                  },
                ]}
              >
                {selectedOption === currentQuestion.answerIndex ? '正解！' : '不正解'}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* 回答 or 次へ ボタン */}
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
        <Button mode="contained" onPress={handleNext} style={styles.button}>
          {currentIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
        </Button>
      )}
    </ScrollView>
  );
};

export default CourseQuizScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  progressBar: {
    marginBottom: 8,
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  questionCard: {
    marginBottom: 16,
  },
  question: {
    fontSize: 18,
    marginBottom: 16,
  },
  radioItem: {
    marginVertical: 4,
  },
  explanationBox: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    marginTop: 16,
  },
});
