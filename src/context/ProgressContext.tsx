import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseProgress } from '../types/contentTypes';

interface ProgressContextValue {
  learnedPhrases: Set<string>;
  courseProgress: Map<string, CourseProgress>;
  markPhraseLearned: (courseId: string, phraseId: string) => void;
  markQuizCompleted: (courseId: string, quizId: string) => void;
  initializeCourseProgress: (courseId: string, totalPhrases: number) => void;
  getCourseProgress: (courseId: string) => number;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  LEARNED_PHRASES: 'LEARNED_PHRASES',
  COURSE_PROGRESS: 'COURSE_PROGRESS'
} as const;

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [learnedPhrases, setLearnedPhrases] = useState<Set<string>>(new Set());
  const [courseProgress, setCourseProgress] = useState<Map<string, CourseProgress>>(new Map());

  // 起動時にAsyncStorageから進捗データを読み込む
  useEffect(() => {
    (async () => {
      try {
        // 学習済みフレーズの読み込み
        const savedPhrases = await AsyncStorage.getItem(STORAGE_KEYS.LEARNED_PHRASES);
        if (savedPhrases) {
          const phraseArray = JSON.parse(savedPhrases) as string[];
          setLearnedPhrases(new Set(phraseArray));
        }

        // コース進捗の読み込み
        const savedProgress = await AsyncStorage.getItem(STORAGE_KEYS.COURSE_PROGRESS);
        if (savedProgress) {
          const progressArray = JSON.parse(savedProgress) as CourseProgress[];
          setCourseProgress(new Map(progressArray.map(p => [p.courseId, p])));
        }
      } catch (error) {
        console.error('Failed to load progress data:', error);
      }
    })();
  }, []);

  // learnedPhrases が変化したら保存
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.LEARNED_PHRASES,
          JSON.stringify(Array.from(learnedPhrases))
        );
      } catch (error) {
        console.error('Failed to save learned phrases:', error);
      }
    })();
  }, [learnedPhrases]);

  // courseProgress が変化したら保存
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.COURSE_PROGRESS,
          JSON.stringify(Array.from(courseProgress.values()))
        );
      } catch (error) {
        console.error('Failed to save course progress:', error);
      }
    })();
  }, [courseProgress]);

  // フレーズを学習済みにする
  const markPhraseLearned = (courseId: string, phraseId: string) => {
    // フレーズを学習済みに追加
    setLearnedPhrases(prev => new Set(prev).add(phraseId));

    // コース進捗を更新
    setCourseProgress(prev => {
      const progress = prev.get(courseId) || {
        courseId,
        learnedPhraseIds: [],
        completedQuizIds: [],
        lastAccessedAt: Date.now()
      };

      if (!progress.learnedPhraseIds.includes(phraseId)) {
        progress.learnedPhraseIds.push(phraseId);
        progress.lastAccessedAt = Date.now();
      }

      return new Map(prev).set(courseId, progress);
    });
  };

  // クイズを完了済みにする
  const markQuizCompleted = (courseId: string, quizId: string) => {
    setCourseProgress(prev => {
      const progress = prev.get(courseId) || {
        courseId,
        learnedPhraseIds: [],
        completedQuizIds: [],
        lastAccessedAt: Date.now()
      };

      if (!progress.completedQuizIds.includes(quizId)) {
        progress.completedQuizIds.push(quizId);
        progress.lastAccessedAt = Date.now();
      }

      return new Map(prev).set(courseId, progress);
    });
  };

  // コースの進捗を初期化
  const initializeCourseProgress = (courseId: string, totalPhrases: number) => {
    if (!courseProgress.has(courseId)) {
      setCourseProgress(prev => new Map(prev).set(courseId, {
        courseId,
        learnedPhraseIds: [],
        completedQuizIds: [],
        lastAccessedAt: Date.now()
      }));
    }
  };

  // コースの進捗率を計算（0-1の値を返す）
  const getCourseProgress = (courseId: string): number => {
    const progress = courseProgress.get(courseId);
    if (!progress) return 0;

    const uniqueLearnedPhrases = new Set(progress.learnedPhraseIds);
    return uniqueLearnedPhrases.size / (progress.learnedPhraseIds.length || 1);
  };

  return (
    <ProgressContext.Provider
      value={{
        learnedPhrases,
        courseProgress,
        markPhraseLearned,
        markQuizCompleted,
        initializeCourseProgress,
        getCourseProgress
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return ctx;
};
