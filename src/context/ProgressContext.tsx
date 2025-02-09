import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// コースの進捗状態
interface CourseProgress {
  learnedPhraseIds: Set<string>;
  completedQuizIds: Set<string>;
  lastAccessedDate: Date;
}

interface ProgressContextValue {
  // コース単位の進捗をMapで保持 (courseId -> CourseProgress)
  courseProgressMap: Map<string, CourseProgress>;

  markPhraseLearned: (courseId: string, phraseId: string) => void;
  markQuizCompleted: (courseId: string, quizId: string) => void;

  getCourseProgressRatio: (courseId: string) => number;
  getCourseQuizProgressRatio: (courseId: string) => number;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

const STORAGE_KEY = '@AppCourseProgress'; // AsyncStorage用キー

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courseProgressMap, setCourseProgressMap] = useState<Map<string, CourseProgress>>(new Map());

  // 起動時に読み込み
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          // 保存形式: { [courseId]: { learnedPhraseIds: string[], completedQuizIds: string[], lastAccessedDate: string } }
          const obj = JSON.parse(json);
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
              lastAccessedDate: new Date(v.lastAccessedDate)
            });
          });
          setCourseProgressMap(newMap);
        }
      } catch (e) {
        console.error('Error loading progress:', e);
      }
    })();
  }, []);

  // 変更があったら保存
  useEffect(() => {
    const save = async () => {
      const obj: any = {};
      courseProgressMap.forEach((cp, courseId) => {
        obj[courseId] = {
          learnedPhraseIds: Array.from(cp.learnedPhraseIds),
          completedQuizIds: Array.from(cp.completedQuizIds),
          lastAccessedDate: cp.lastAccessedDate.toISOString()
        };
      });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    };
    save().catch((err) => console.error(err));
  }, [courseProgressMap]);

  const markPhraseLearned = (courseId: string, phraseId: string) => {
    setCourseProgressMap((prev) => {
      const clone = new Map(prev);
      const cp = clone.get(courseId) || {
        learnedPhraseIds: new Set(),
        completedQuizIds: new Set(),
        lastAccessedDate: new Date()
      };
      cp.learnedPhraseIds.add(phraseId);
      cp.lastAccessedDate = new Date();
      clone.set(courseId, cp);
      return clone;
    });
  };

  const markQuizCompleted = (courseId: string, quizId: string) => {
    setCourseProgressMap((prev) => {
      const clone = new Map(prev);
      const cp = clone.get(courseId) || {
        learnedPhraseIds: new Set(),
        completedQuizIds: new Set(),
        lastAccessedDate: new Date()
      };
      cp.completedQuizIds.add(quizId);
      cp.lastAccessedDate = new Date();
      clone.set(courseId, cp);
      return clone;
    });
  };

  /** コース全体のフレーズ学習進捗数を返す */
  const getCourseProgressRatio = (courseId: string) => {
    const cp = courseProgressMap.get(courseId);
    return cp ? cp.learnedPhraseIds.size : 0;
  };

  /** コースクイズの完了進捗数を返す */
  const getCourseQuizProgressRatio = (courseId: string) => {
    const cp = courseProgressMap.get(courseId);
    return cp ? cp.completedQuizIds.size : 0;
  };

  return (
    <ProgressContext.Provider
      value={{
        courseProgressMap,
        markPhraseLearned,
        markQuizCompleted,
        getCourseProgressRatio,
        getCourseQuizProgressRatio
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
