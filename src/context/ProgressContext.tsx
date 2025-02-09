import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseProgress } from '../types/contentTypes';
import { QuizSessionLog } from '../types/QuizSessionLog';
import { getCourseById } from '../services/contentService';

export interface ProgressContextValue {
  /** コース単位の進捗（フレーズ学習済みIDs、クイズ回答済みIDsなど） */
  courseProgressMap: Map<string, CourseProgress>;

  /** 完了済み・中断などのクイズセッションログ */
  quizLogs: QuizSessionLog[];

  // ====== フレーズやクイズ進捗をマークするメソッド ======
  markPhraseCompleted: (courseId: string, phraseId: string) => void;
  markQuizCompleted: (courseId: string, questionId: string) => void;

  // ====== 進捗率を取得するメソッド ======
  getCourseProgressRatio: (courseId: string) => number;
  getCourseQuizProgressRatio: (courseId: string) => number;

  // ====== クイズセッション管理 ======
  createNewQuizSession: (courseId: string) => string;
  addAnswerToQuizSession: (
    sessionId: string,
    questionId: string,
    selectedOptionIndex: number,
    isCorrect: boolean
  ) => void;
  finalizeQuizSession: (sessionId: string) => void;
  abortQuizSession: (sessionId: string, currentIndex: number) => void;
  getQuizSessionById: (sessionId: string) => QuizSessionLog | undefined;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

const STORAGE_KEY = '@AppCourseProgress';
const QUIZ_LOGS_KEY = '@AppQuizLogs';

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // コースごとの進捗を保持
  const [courseProgressMap, setCourseProgressMap] = useState<Map<string, CourseProgress>>(new Map());
  // クイズセッションの履歴一覧
  const [quizLogs, setQuizLogs] = useState<QuizSessionLog[]>([]);

  // ========== 起動時に AsyncStorage から読み込み ==========
  useEffect(() => {
    (async () => {
      try {
        // コース進捗
        const progressJSON = await AsyncStorage.getItem(STORAGE_KEY);
        if (progressJSON) {
          const obj = JSON.parse(progressJSON);
          const newMap = new Map<string, CourseProgress>();
          Object.entries(obj).forEach(([courseId, val]) => {
            const v = val as {
              learnedPhraseIds: string[];
              completedQuizIds: string[];
              lastAccessedDate: string;
            };
            newMap.set(courseId, {
              learnedPhraseIds: new Set(v.learnedPhraseIds),
              completedQuizIds: new Set(v.completedQuizIds),
              lastAccessedDate: new Date(v.lastAccessedDate),
            });
          });
          setCourseProgressMap(newMap);
        }

        // クイズログ
        const logsJSON = await AsyncStorage.getItem(QUIZ_LOGS_KEY);
        if (logsJSON) {
          const parsedLogs = JSON.parse(logsJSON) as QuizSessionLog[];
          setQuizLogs(parsedLogs);
        }
      } catch (e) {
        console.error('Error loading data:', e);
      }
    })();
  }, []);

  // ========== courseProgressMap が変わるたびに保存 ==========
  useEffect(() => {
    (async () => {
      try {
        const obj: any = {};
        courseProgressMap.forEach((cp, courseId) => {
          obj[courseId] = {
            learnedPhraseIds: Array.from(cp.learnedPhraseIds),
            completedQuizIds: Array.from(cp.completedQuizIds),
            lastAccessedDate: cp.lastAccessedDate.toISOString(),
          };
        });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [courseProgressMap]);

  // ========== quizLogs が変わるたびに保存 ==========
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(QUIZ_LOGS_KEY, JSON.stringify(quizLogs));
      } catch (err) {
        console.error('Error saving quiz logs:', err);
      }
    })();
  }, [quizLogs]);

  // ========== フレーズを学習済みとしてマーク ==========
  const markPhraseCompleted = (courseId: string, phraseId: string) => {
    setCourseProgressMap((prev) => {
      const newMap = new Map(prev);
      const progress = newMap.get(courseId) || {
        learnedPhraseIds: new Set<string>(),
        completedQuizIds: new Set<string>(),
        lastAccessedDate: new Date(),
      };
      progress.learnedPhraseIds.add(phraseId);
      progress.lastAccessedDate = new Date();
      newMap.set(courseId, progress);
      return newMap;
    });
  };

  // ========== クイズ問題を完了としてマーク ==========
  const markQuizCompleted = (courseId: string, questionId: string) => {
    setCourseProgressMap((prev) => {
      const newMap = new Map(prev);
      const progress = newMap.get(courseId) || {
        learnedPhraseIds: new Set<string>(),
        completedQuizIds: new Set<string>(),
        lastAccessedDate: new Date(),
      };
      progress.completedQuizIds.add(questionId);
      progress.lastAccessedDate = new Date();
      newMap.set(courseId, progress);
      return newMap;
    });
  };

  // ========== 進捗率を計算するヘルパー ==========
  const getCourseProgressRatio = (courseId: string): number => {
    const progress = courseProgressMap.get(courseId);
    if (!progress) return 0;

    const course = getCourseById(courseId);
    if (!course) return 0;

    // 「学習済みフレーズ数 / コースのフレーズ総数」
    return progress.learnedPhraseIds.size / course.phrases.length;
  };

  const getCourseQuizProgressRatio = (courseId: string): number => {
    const progress = courseProgressMap.get(courseId);
    if (!progress) return 0;

    const course = getCourseById(courseId);
    if (!course) return 0;

    // 「解答済みクイズ数 / コースのクイズ問題総数」
    return progress.completedQuizIds.size / course.quizQuestions.length;
  };

  // ========== クイズセッション管理 ==========

  /** 新規クイズセッションを作成 */
  const createNewQuizSession = (courseId: string): string => {
    const sessionId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: QuizSessionLog = {
      sessionId,
      courseId,
      date: new Date().toISOString(),
      status: 'ongoing',
      answers: [],
      correctCount: 0,
      totalCount: 0,
    };
    setQuizLogs((prev) => [...prev, newSession]);
    return sessionId;
  };

  /** ユーザーが1問解答する度に回答内容をログへ追加 */
  const addAnswerToQuizSession = (
    sessionId: string,
    questionId: string,
    selectedOptionIndex: number,
    isCorrect: boolean
  ) => {
    setQuizLogs((prev) =>
      prev.map((session) => {
        if (session.sessionId === sessionId) {
          return {
            ...session,
            answers: [
              ...session.answers,
              { questionId, selectedOptionIndex, isCorrect },
            ],
          };
        }
        return session;
      })
    );
  };

  /** クイズが最後まで完了した時に最終スコアなどを確定 */
  const finalizeQuizSession = (sessionId: string) => {
    setQuizLogs((prev) =>
      prev.map((session) => {
        if (session.sessionId === sessionId) {
          const totalCount = session.answers.length;
          const correctCount = session.answers.filter((ans: { isCorrect: boolean }) => ans.isCorrect).length;
          return {
            ...session,
            totalCount,
            correctCount,
            status: 'completed',
          };
        }
        return session;
      })
    );
  };

  /** クイズを途中で離脱(中断)した場合にステータスを aborted にする */
  const abortQuizSession = (sessionId: string, currentIndex: number) => {
    setQuizLogs((prev) =>
      prev.map((session) => {
        if (session.sessionId === sessionId) {
          return {
            ...session,
            status: 'aborted',
            stoppedAtQuestionIndex: currentIndex,
          };
        }
        return session;
      })
    );
  };

  /** sessionId からクイズログを取得する */
  const getQuizSessionById = (sessionId: string) => {
    return quizLogs.find((log) => log.sessionId === sessionId);
  };

  return (
    <ProgressContext.Provider
      value={{
        courseProgressMap,
        quizLogs,
        markPhraseCompleted,
        markQuizCompleted,
        getCourseProgressRatio,
        getCourseQuizProgressRatio,
        createNewQuizSession,
        addAnswerToQuizSession,
        finalizeQuizSession,
        abortQuizSession,
        getQuizSessionById,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used inside ProgressProvider');
  }
  return ctx;
}
