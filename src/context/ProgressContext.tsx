import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseProgress } from '../types/contentTypes';
import { getCourse } from '../services/contentService';

interface ProgressContextValue {
  learnedPhrases: Set<string>;
  courseProgress: Map<string, CourseProgress>;
  markPhraseLearned: (courseId: string, phraseId: string) => void;
  markQuizCompleted: (courseId: string, quizId: string) => void;
  initializeCourseProgress: (courseId: string) => void;
  getCourseProgress: (courseId: string) => number;
  saveCourseProgress: (courseId: string, progress: CourseProgress) => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  LEARNED_PHRASES: 'LEARNED_PHRASES',
  COURSE_PROGRESS: 'COURSE_PROGRESS'
} as const;

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [learnedPhrases, setLearnedPhrases] = useState<Set<string>>(new Set());
  const [courseProgress, setCourseProgress] = useState<Map<string, CourseProgress>>(new Map());

  useEffect(() => {
    (async () => {
      try {
        const savedPhrases = await AsyncStorage.getItem(STORAGE_KEYS.LEARNED_PHRASES);
        if (savedPhrases) {
          const phraseArray = JSON.parse(savedPhrases) as string[];
          setLearnedPhrases(new Set(phraseArray));
        }

        const savedProgress = await AsyncStorage.getItem(STORAGE_KEYS.COURSE_PROGRESS);
        if (savedProgress) {
          const progressArray = JSON.parse(savedProgress) as Array<{
            courseId: string;
            learnedPhraseIds: string[];
            completedQuizIds: string[];
            lastAccessedDate: string;
          }>;
          
          const progressMap = new Map(
            progressArray.map(p => [
              p.courseId,
              {
                learnedPhraseIds: new Set(p.learnedPhraseIds),
                completedQuizIds: new Set(p.completedQuizIds),
                lastAccessedDate: new Date(p.lastAccessedDate)
              }
            ])
          );
          setCourseProgress(progressMap);
        }
      } catch (error) {
        console.error('Failed to load progress data:', error);
      }
    })();
  }, []);

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

  useEffect(() => {
    (async () => {
      try {
        const progressArray = Array.from(courseProgress.entries()).map(([courseId, progress]) => ({
          courseId,
          learnedPhraseIds: Array.from(progress.learnedPhraseIds),
          completedQuizIds: Array.from(progress.completedQuizIds),
          lastAccessedDate: progress.lastAccessedDate.toISOString()
        }));
        await AsyncStorage.setItem(
          STORAGE_KEYS.COURSE_PROGRESS,
          JSON.stringify(progressArray)
        );
      } catch (error) {
        console.error('Failed to save course progress:', error);
      }
    })();
  }, [courseProgress]);

  const markPhraseLearned = (courseId: string, phraseId: string) => {
    setLearnedPhrases(prev => new Set(prev).add(phraseId));
    setCourseProgress(prev => {
      const progress = prev.get(courseId) || {
        learnedPhraseIds: new Set<string>(),
        completedQuizIds: new Set<string>(),
        lastAccessedDate: new Date()
      };

      progress.learnedPhraseIds.add(phraseId);
      progress.lastAccessedDate = new Date();
      return new Map(prev).set(courseId, progress);
    });
  };

  const markQuizCompleted = (courseId: string, quizId: string) => {
    setCourseProgress(prev => {
      const progress = prev.get(courseId) || {
        learnedPhraseIds: new Set<string>(),
        completedQuizIds: new Set<string>(),
        lastAccessedDate: new Date()
      };

      progress.completedQuizIds.add(quizId);
      progress.lastAccessedDate = new Date();
      return new Map(prev).set(courseId, progress);
    });
  };

  const initializeCourseProgress = (courseId: string) => {
    if (!courseProgress.has(courseId)) {
      setCourseProgress(prev => prev.set(courseId, {
        learnedPhraseIds: new Set<string>(),
        completedQuizIds: new Set<string>(),
        lastAccessedDate: new Date()
      }));
    }
  };

  const getCourseProgress = (courseId: string): number => {
    const progress = courseProgress.get(courseId);
    if (!progress) return 0;

    const course = getCourse(courseId);
    if (!course) return 0;

    const totalPhrases = course.phrases.length;
    return totalPhrases > 0 ? progress.learnedPhraseIds.size / totalPhrases : 0;
  };

  const saveCourseProgress = (courseId: string, progress: CourseProgress) => {
    setCourseProgress(prev => new Map(prev).set(courseId, progress));
  };

  return (
    <ProgressContext.Provider
      value={{
        learnedPhrases,
        courseProgress,
        markPhraseLearned,
        markQuizCompleted,
        initializeCourseProgress,
        getCourseProgress,
        saveCourseProgress
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
