import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseProgress, LessonProgress } from '../types/contentTypes';
import { QuizSessionLog } from '../types/QuizSessionLog';

// ストレージキー
const PROGRESS_STORAGE_KEY = '@japanese_app_progress';
const QUIZ_SESSIONS_KEY = '@japanese_app_quiz_sessions';

// ==== クイズセッション管理 ====
export async function getQuizSessions(): Promise<QuizSessionLog[]> {
  try {
    const data = await AsyncStorage.getItem(QUIZ_SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load quiz sessions:', error);
    return [];
  }
}

export async function saveQuizSession(session: QuizSessionLog): Promise<void> {
  try {
    const sessions = await getQuizSessions();
    const index = sessions.findIndex(s => s.sessionId === session.sessionId);
    
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    
    await AsyncStorage.setItem(QUIZ_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save quiz session:', error);
  }
}

export async function clearQuizSessions(): Promise<void> {
  try {
    await AsyncStorage.removeItem(QUIZ_SESSIONS_KEY);
  } catch (error) {
    console.error('Failed to clear quiz sessions:', error);
  }
}

// ==== 学習進捗管理 ====
export async function getLessonProgress(lessonId: string): Promise<LessonProgress | null> {
  try {
    const key = `${PROGRESS_STORAGE_KEY}:lesson_${lessonId}`;
    const data = await AsyncStorage.getItem(key);
    
    if (!data) {
      return {
        completedCourseIds: new Set<string>(),
        lastAccessedDate: new Date()
      };
    }

    const parsed = JSON.parse(data);
    
    return {
      completedCourseIds: new Set(parsed.completedCourseIds),
      lastAccessedDate: new Date(parsed.lastAccessedDate)
    };
  } catch (error) {
    console.error('Failed to get lesson progress:', error);
    return {
      completedCourseIds: new Set<string>(),
      lastAccessedDate: new Date()
    };
  }
}

export async function saveLessonProgress(lessonId: string, progress: LessonProgress): Promise<void> {
  try {
    const key = `${PROGRESS_STORAGE_KEY}:lesson_${lessonId}`;
    const data = {
      completedCourseIds: Array.from(progress.completedCourseIds),
      lastAccessedDate: progress.lastAccessedDate.toISOString()
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save lesson progress:', error);
  }
}

export async function getCourseProgress(courseId: string): Promise<CourseProgress | null> {
  try {
    const key = `${PROGRESS_STORAGE_KEY}:course_${courseId}`;
    const data = await AsyncStorage.getItem(key);
    
    if (!data) {
      return {
        courseId,
        learnedPhraseIds: new Set<string>(),
        completedQuizIds: new Set<string>(),
        lastAccessedDate: new Date()
      };
    }

    const parsed = JSON.parse(data);
    
    return {
      courseId,
      learnedPhraseIds: new Set(parsed.learnedPhraseIds),
      completedQuizIds: new Set(parsed.completedQuizIds),
      lastAccessedDate: new Date(parsed.lastAccessedDate)
    };
  } catch (error) {
    console.error('Failed to get course progress:', error);
    return {
      courseId,
      learnedPhraseIds: new Set<string>(),
      completedQuizIds: new Set<string>(),
      lastAccessedDate: new Date()
    };
  }
}

export async function saveCourseProgress(courseId: string, progress: CourseProgress): Promise<void> {
  try {
    const key = `${PROGRESS_STORAGE_KEY}:course_${courseId}`;
    const data = {
      courseId,
      learnedPhraseIds: Array.from(progress.learnedPhraseIds),
      completedQuizIds: Array.from(progress.completedQuizIds),
      lastAccessedDate: progress.lastAccessedDate.toISOString()
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save course progress:', error);
  }
}

// ==== ヘルパー関数 ====

// フレーズを学習済みとしてマーク
export async function markPhraseAsLearned(courseId: string, phraseId: string): Promise<void> {
  const progress = await getCourseProgress(courseId) || {
    courseId,
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
    courseId,
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