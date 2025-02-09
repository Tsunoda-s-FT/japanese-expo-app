import AsyncStorage from '@react-native-async-storage/async-storage';
import { LessonProgress, CourseProgress } from '../types/contentTypes';

const PROGRESS_PREFIX = '@japanese_app_progress:';

export async function getLessonProgress(lessonId: string): Promise<LessonProgress | null> {
  try {
    console.log('Getting progress for lesson:', lessonId);
    const key = `${PROGRESS_PREFIX}lesson_${lessonId}`;
    const data = await AsyncStorage.getItem(key);
    console.log('Raw progress data:', data);
    
    if (!data) {
      console.log('No progress data found, returning default');
      return {
        completedCourseIds: new Set<string>(),
        lastAccessedDate: new Date()
      };
    }

    const parsed = JSON.parse(data);
    console.log('Parsed progress data:', parsed);
    
    return {
      completedCourseIds: new Set(parsed.completedCourseIds),
      lastAccessedDate: new Date(parsed.lastAccessedDate)
    };
  } catch (error) {
    console.error('Error getting lesson progress:', error);
    return {
      completedCourseIds: new Set<string>(),
      lastAccessedDate: new Date()
    };
  }
}

export async function saveLessonProgress(lessonId: string, progress: LessonProgress): Promise<void> {
  try {
    console.log('Saving progress for lesson:', lessonId, progress);
    const key = `${PROGRESS_PREFIX}lesson_${lessonId}`;
    const data = {
      completedCourseIds: Array.from(progress.completedCourseIds),
      lastAccessedDate: progress.lastAccessedDate.toISOString()
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log('Progress saved successfully');
  } catch (error) {
    console.error('Error saving lesson progress:', error);
  }
}

export async function getCourseProgress(courseId: string): Promise<CourseProgress | null> {
  try {
    console.log('Getting progress for course:', courseId);
    const key = `${PROGRESS_PREFIX}course_${courseId}`;
    const data = await AsyncStorage.getItem(key);
    console.log('Raw course progress data:', data);
    
    if (!data) {
      console.log('No course progress data found, returning default');
      return {
        learnedPhraseIds: new Set<string>(),
        completedQuizIds: new Set<string>(),
        lastAccessedDate: new Date()
      };
    }

    const parsed = JSON.parse(data);
    console.log('Parsed course progress data:', parsed);
    
    return {
      learnedPhraseIds: new Set(parsed.learnedPhraseIds),
      completedQuizIds: new Set(parsed.completedQuizIds),
      lastAccessedDate: new Date(parsed.lastAccessedDate)
    };
  } catch (error) {
    console.error('Error getting course progress:', error);
    return {
      learnedPhraseIds: new Set<string>(),
      completedQuizIds: new Set<string>(),
      lastAccessedDate: new Date()
    };
  }
}

export async function saveCourseProgress(courseId: string, progress: CourseProgress): Promise<void> {
  try {
    console.log('Saving progress for course:', courseId, progress);
    const key = `${PROGRESS_PREFIX}course_${courseId}`;
    const data = {
      learnedPhraseIds: Array.from(progress.learnedPhraseIds),
      completedQuizIds: Array.from(progress.completedQuizIds),
      lastAccessedDate: progress.lastAccessedDate.toISOString()
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log('Course progress saved successfully');
  } catch (error) {
    console.error('Error saving course progress:', error);
  }
}

// フレーズを学習済みとしてマーク
export async function markPhraseAsLearned(courseId: string, phraseId: string): Promise<void> {
  const progress = await getCourseProgress(courseId) || {
    learnedPhraseIds: new Set<string>(),
    completedQuizIds: new Set<string>(),
    lastAccessedDate: new Date()
  };

  progress.learnedPhraseIds.add(phraseId);
  progress.lastAccessedDate = new Date();
  
  await saveCourseProgress(courseId, progress);
}

// クイズを完了済みとしてマーク
export async function markQuizAsCompleted(courseId: string, quizId: string): Promise<void> {
  const progress = await getCourseProgress(courseId) || {
    learnedPhraseIds: new Set<string>(),
    completedQuizIds: new Set<string>(),
    lastAccessedDate: new Date()
  };

  progress.completedQuizIds.add(quizId);
  progress.lastAccessedDate = new Date();
  
  await saveCourseProgress(courseId, progress);
}

// コースを完了済みとしてマーク
export async function markCourseAsCompleted(lessonId: string, courseId: string): Promise<void> {
  const progress = await getLessonProgress(lessonId) || {
    completedCourseIds: new Set<string>(),
    lastAccessedDate: new Date()
  };

  progress.completedCourseIds.add(courseId);
  progress.lastAccessedDate = new Date();
  
  await saveLessonProgress(lessonId, progress);
}

// フレーズが学習済みかどうかを確認
export async function isPhraseCompleted(courseId: string, phraseId: string): Promise<boolean> {
  const progress = await getCourseProgress(courseId);
  return progress?.learnedPhraseIds.has(phraseId) || false;
}

// クイズが完了済みかどうかを確認
export async function isQuizCompleted(courseId: string, quizId: string): Promise<boolean> {
  const progress = await getCourseProgress(courseId);
  return progress?.completedQuizIds.has(quizId) || false;
}

// コースが完了済みかどうかを確認
export async function isCourseCompleted(lessonId: string, courseId: string): Promise<boolean> {
  const progress = await getLessonProgress(lessonId);
  return progress?.completedCourseIds.has(courseId) || false;
}
