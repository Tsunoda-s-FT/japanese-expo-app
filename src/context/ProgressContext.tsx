import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseProgress } from '../types/contentTypes';
import { QuizSessionLog } from '../types/QuizSessionLog';
import { getCourseById } from '../services/contentService';

export interface ProgressContextValue {
  courseProgressMap: Map<string, CourseProgress>;
  quizLogs: QuizSessionLog[];
  markCourseStarted: (courseId: string) => void;
  markPhraseLearned: (courseId: string, phraseId: string) => void;
  markPhraseCompleted: (courseId: string, phraseId: string) => void;
  markQuizCompleted: (courseId: string, questionId: string) => void;
  getCourseProgressRatio: (courseId: string) => number;
  getCourseQuizProgressRatio: (courseId: string) => number;
  createNewQuizSession: (courseId: string) => string;
  addAnswerToQuizSession: (sessionId: string, questionId: string, selectedOptionIndex: number, isCorrect: boolean) => void;
  finalizeQuizSession: (sessionId: string) => void;
  abortQuizSession: (sessionId: string, currentIndex: number) => void;
  getQuizSessionById: (sessionId: string) => QuizSessionLog | undefined;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

const STORAGE_KEY = '@AppCourseProgress';
const QUIZ_LOGS_KEY = '@AppQuizLogs';

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courseProgressMap, setCourseProgressMap] = useState<Map<string, CourseProgress>>(new Map());
  const [quizLogs, setQuizLogs] = useState<QuizSessionLog[]>([]);

  useEffect(() => {
    (async () => {
      try {
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

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(QUIZ_LOGS_KEY, JSON.stringify(quizLogs));
      } catch (err) {
        console.error('Error saving quiz logs:', err);
      }
    })();
  }, [quizLogs]);

  const markCourseStarted = (courseId: string) => {
    setCourseProgressMap((prev) => {
      const newMap = new Map(prev);
      const progress = newMap.get(courseId) || {
        learnedPhraseIds: new Set<string>(),
        completedQuizIds: new Set<string>(),
        lastAccessedDate: new Date(),
      };
      progress.lastAccessedDate = new Date();
      newMap.set(courseId, progress);
      return newMap;
    });
  };

  const markPhraseLearned = (courseId: string, phraseId: string) => {
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

  const getCourseProgressRatio = (courseId: string): number => {
    const progress = courseProgressMap.get(courseId);
    if (!progress) return 0;

    const course = getCourseById(courseId);
    if (!course) return 0;

    return progress.learnedPhraseIds.size / course.phrases.length;
  };

  const getCourseQuizProgressRatio = (courseId: string): number => {
    const progress = courseProgressMap.get(courseId);
    if (!progress) return 0;

    const course = getCourseById(courseId);
    if (!course) return 0;

    return progress.completedQuizIds.size / course.quizQuestions.length;
  };

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

  const addAnswerToQuizSession = (
    sessionId: string,
    questionId: string,
    selectedOptionIndex: number,
    isCorrect: boolean
  ) => {
    setQuizLogs((prev) => {
      return prev.map((session) => {
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
      });
    });
  };

  const finalizeQuizSession = (sessionId: string) => {
    setQuizLogs((prev) => {
      return prev.map((session) => {
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
      });
    });
  };

  const abortQuizSession = (sessionId: string, currentIndex: number) => {
    setQuizLogs((prev) => {
      return prev.map((session) => {
        if (session.sessionId === sessionId) {
          return {
            ...session,
            status: 'aborted',
            stoppedAtQuestionIndex: currentIndex,
          };
        }
        return session;
      });
    });
  };

  const getQuizSessionById = (sessionId: string) => {
    return quizLogs.find((log) => log.sessionId === sessionId);
  };

  return (
    <ProgressContext.Provider
      value={{
        courseProgressMap,
        quizLogs,
        markCourseStarted,
        markPhraseLearned,
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
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
