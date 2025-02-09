import React, { createContext, useContext, useState, useCallback } from 'react';
import { LessonProgress, CourseProgress } from '../types/contentTypes';
import { getLessonProgress, saveLessonProgress, getCourseProgress, saveCourseProgress } from '../services/progressService';

interface ProgressContextType {
  getLessonProgress: (lessonId: string) => Promise<LessonProgress | null>;
  saveLessonProgress: (lessonId: string, progress: LessonProgress) => Promise<void>;
  getCourseProgress: (courseId: string) => Promise<CourseProgress | null>;
  saveCourseProgress: (courseId: string, progress: CourseProgress) => Promise<void>;
  markQuizCompleted: (courseId: string, quizId: string) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const getLessonProgressCallback = useCallback(async (lessonId: string) => {
    return getLessonProgress(lessonId);
  }, []);

  const saveLessonProgressCallback = useCallback(async (lessonId: string, progress: LessonProgress) => {
    await saveLessonProgress(lessonId, progress);
  }, []);

  const getCourseProgressCallback = useCallback(async (courseId: string) => {
    return getCourseProgress(courseId);
  }, []);

  const saveCourseProgressCallback = useCallback(async (courseId: string, progress: CourseProgress) => {
    await saveCourseProgress(courseId, progress);
  }, []);

  const markQuizCompletedCallback = useCallback(async (courseId: string, quizId: string) => {
    const progress = await getCourseProgress(courseId);
    if (progress) {
      progress.completedQuizIds.add(quizId);
      await saveCourseProgress(courseId, progress);
    } else {
      const newProgress: CourseProgress = {
        learnedPhraseIds: new Set(),
        completedQuizIds: new Set([quizId]),
        lastAccessedDate: new Date()
      };
      await saveCourseProgress(courseId, newProgress);
    }
  }, []);

  const value = {
    getLessonProgress: getLessonProgressCallback,
    saveLessonProgress: saveLessonProgressCallback,
    getCourseProgress: getCourseProgressCallback,
    saveCourseProgress: saveCourseProgressCallback,
    markQuizCompleted: markQuizCompletedCallback,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
