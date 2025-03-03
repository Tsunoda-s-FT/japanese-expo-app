import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useContent } from './ContentContext';
import { Content, Course, Lesson } from '../types/contentTypes';
import { 
  getCourseProgress, 
  saveCourseProgress, 
  getLessonProgress, 
  saveLessonProgress 
} from '../services/progressManager';

/**
 * コース進捗の型定義
 */
export interface CourseProgress {
  courseId: string;
  learnedPhraseIds: Set<string>;
  completedQuizIds: Set<string>;
  lastAccessedDate: Date;
}

/**
 * ユーザー進捗状態の型定義
 */
interface UserProgressState {
  courseProgressMap: Map<string, CourseProgress>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * ユーザー進捗アクション定義
 */
type UserProgressAction = 
  | { type: 'LOAD_PROGRESS_START' }
  | { type: 'LOAD_PROGRESS_SUCCESS'; payload: Map<string, CourseProgress> }
  | { type: 'LOAD_PROGRESS_ERROR'; payload: Error }
  | { type: 'MARK_PHRASE_COMPLETED'; payload: { courseId: string; phraseId: string } }
  | { type: 'MARK_QUIZ_COMPLETED'; payload: { courseId: string; quizId: string } };

/**
 * 初期状態
 */
const initialState: UserProgressState = {
  courseProgressMap: new Map(),
  isLoading: true,
  error: null
};

/**
 * ユーザー進捗リデューサー
 */
function userProgressReducer(state: UserProgressState, action: UserProgressAction): UserProgressState {
  switch (action.type) {
    case 'LOAD_PROGRESS_START':
      return { ...state, isLoading: true };
      
    case 'LOAD_PROGRESS_SUCCESS':
      return { 
        ...state, 
        courseProgressMap: action.payload,
        isLoading: false,
        error: null
      };
      
    case 'LOAD_PROGRESS_ERROR':
      return { ...state, error: action.payload, isLoading: false };
      
    case 'MARK_PHRASE_COMPLETED': {
      const { courseId, phraseId } = action.payload;
      const newMap = new Map(state.courseProgressMap);
      
      // コースの進捗を取得または初期化
      let courseProgress = newMap.get(courseId);
      if (!courseProgress) {
        courseProgress = {
          courseId,
          learnedPhraseIds: new Set<string>(),
          completedQuizIds: new Set<string>(),
          lastAccessedDate: new Date()
        };
      }
      
      // 新しいSetを作成して変更を適用
      const newLearnedPhraseIds = new Set(courseProgress.learnedPhraseIds);
      newLearnedPhraseIds.add(phraseId);
      
      // 更新された進捗オブジェクトを作成
      const updatedProgress = {
        ...courseProgress,
        learnedPhraseIds: newLearnedPhraseIds,
        lastAccessedDate: new Date()
      };
      
      // マップを更新
      newMap.set(courseId, updatedProgress);
      
      return {
        ...state,
        courseProgressMap: newMap
      };
    }
    
    case 'MARK_QUIZ_COMPLETED': {
      const { courseId, quizId } = action.payload;
      const newMap = new Map(state.courseProgressMap);
      
      // コースの進捗を取得または初期化
      let courseProgress = newMap.get(courseId);
      if (!courseProgress) {
        courseProgress = {
          courseId,
          learnedPhraseIds: new Set<string>(),
          completedQuizIds: new Set<string>(),
          lastAccessedDate: new Date()
        };
      }
      
      // 新しいSetを作成して変更を適用
      const newCompletedQuizIds = new Set(courseProgress.completedQuizIds);
      newCompletedQuizIds.add(quizId);
      
      // 更新された進捗オブジェクトを作成
      const updatedProgress = {
        ...courseProgress,
        completedQuizIds: newCompletedQuizIds,
        lastAccessedDate: new Date()
      };
      
      // マップを更新
      newMap.set(courseId, updatedProgress);
      
      return {
        ...state,
        courseProgressMap: newMap
      };
    }
    
    default:
      return state;
  }
}

/**
 * ユーザー進捗コンテキスト型定義
 */
interface UserProgressContextType {
  courseProgressMap: Map<string, CourseProgress>;
  isLoading: boolean;
  error: Error | null;
  markPhraseCompleted: (courseId: string, phraseId: string) => void;
  markQuizCompleted: (courseId: string, quizId: string) => void;
  getProgressForCourse: (courseId: string) => CourseProgress | undefined;
  getPhraseCompletionPercentage: (courseId: string) => number;
  getQuizCompletionPercentage: (courseId: string) => number;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

/**
 * ユーザー進捗プロバイダーコンポーネント
 */
export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userProgressReducer, initialState);
  const contentContext = useContent();
  
  // 初期化時に進捗データを読み込む
  useEffect(() => {
    loadProgressData();
  }, []);
  
  /**
   * 進捗データの読み込み
   */
  const loadProgressData = async () => {
    dispatch({ type: 'LOAD_PROGRESS_START' });
    try {
      const progressMap = new Map<string, CourseProgress>();
      
      // すべてのコースの進捗を読み込む
      if (contentContext.state.content && contentContext.state.content.lessons) {
        for (const lesson of contentContext.state.content.lessons) {
          for (const course of lesson.courses) {
            const progress = await getCourseProgress(course.id);
            if (progress) {
              progressMap.set(course.id, progress);
            }
          }
        }
      }
      
      dispatch({ type: 'LOAD_PROGRESS_SUCCESS', payload: progressMap });
    } catch (error) {
      dispatch({ type: 'LOAD_PROGRESS_ERROR', payload: error as Error });
    }
  };
  
  /**
   * フレーズ完了をマーク
   * @param courseId コースID
   * @param phraseId フレーズID
   */
  const markPhraseCompleted = async (courseId: string, phraseId: string) => {
    dispatch({ type: 'MARK_PHRASE_COMPLETED', payload: { courseId, phraseId } });
    
    // 進捗を保存
    const updatedProgress = state.courseProgressMap.get(courseId);
    if (updatedProgress) {
      await saveCourseProgress(courseId, updatedProgress);
    }
  };
  
  /**
   * クイズ完了をマーク
   * @param courseId コースID
   * @param quizId クイズID
   */
  const markQuizCompleted = async (courseId: string, quizId: string) => {
    dispatch({ type: 'MARK_QUIZ_COMPLETED', payload: { courseId, quizId } });
    
    // 進捗を保存
    const updatedProgress = state.courseProgressMap.get(courseId);
    if (updatedProgress) {
      await saveCourseProgress(courseId, updatedProgress);
    }
  };
  
  /**
   * コースの進捗を取得
   * @param courseId コースID
   * @returns コース進捗
   */
  const getProgressForCourse = (courseId: string): CourseProgress | undefined => {
    return state.courseProgressMap.get(courseId);
  };
  
  /**
   * フレーズ完了率を計算
   * @param courseId コースID
   * @returns 完了率（%）
   */
  const getPhraseCompletionPercentage = (courseId: string): number => {
    const courseProgress = state.courseProgressMap.get(courseId);
    if (!courseProgress) return 0;
    
    const course = contentContext.state.content?.lessons
      .flatMap((lesson: Lesson) => lesson.courses)
      .find((c: Course) => c.id === courseId);
    
    if (!course || course.phrases.length === 0) return 0;
    
    return (courseProgress.learnedPhraseIds.size / course.phrases.length) * 100;
  };
  
  /**
   * クイズ完了率を計算
   * @param courseId コースID
   * @returns 完了率（%）
   */
  const getQuizCompletionPercentage = (courseId: string): number => {
    const courseProgress = state.courseProgressMap.get(courseId);
    if (!courseProgress) return 0;
    
    const course = contentContext.state.content?.lessons
      .flatMap((lesson: Lesson) => lesson.courses)
      .find((c: Course) => c.id === courseId);
    
    if (!course || course.quizQuestions.length === 0) return 0;
    
    return (courseProgress.completedQuizIds.size / course.quizQuestions.length) * 100;
  };
  
  return (
    <UserProgressContext.Provider value={{
      ...state,
      markPhraseCompleted,
      markQuizCompleted,
      getProgressForCourse,
      getPhraseCompletionPercentage,
      getQuizCompletionPercentage
    }}>
      {children}
    </UserProgressContext.Provider>
  );
};

/**
 * ユーザー進捗コンテキストを使用するためのフック
 */
export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (!context) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};
