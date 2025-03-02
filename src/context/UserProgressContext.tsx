import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContent } from './ContentContext';

// 型定義
export interface CourseProgress {
  courseId: string;
  learnedPhraseIds: Set<string>;
  completedQuizIds: Set<string>;
  lastAccessedDate: Date;
}

interface UserProgressState {
  courseProgressMap: Map<string, CourseProgress>;
  isLoading: boolean;
  error: Error | null;
}

// アクション定義
type UserProgressAction = 
  | { type: 'LOAD_PROGRESS_START' }
  | { type: 'LOAD_PROGRESS_SUCCESS'; payload: Map<string, CourseProgress> }
  | { type: 'LOAD_PROGRESS_ERROR'; payload: Error }
  | { type: 'MARK_PHRASE_COMPLETED'; payload: { courseId: string; phraseId: string } }
  | { type: 'MARK_QUIZ_COMPLETED'; payload: { courseId: string; quizId: string } };

const initialState: UserProgressState = {
  courseProgressMap: new Map(),
  isLoading: true,
  error: null
};

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
      const newProgressMap = new Map(state.courseProgressMap);
      
      const existingProgress = newProgressMap.get(courseId) || {
        courseId,
        learnedPhraseIds: new Set<string>(),
        completedQuizIds: new Set<string>(),
        lastAccessedDate: new Date()
      };
      
      existingProgress.learnedPhraseIds.add(phraseId);
      existingProgress.lastAccessedDate = new Date();
      newProgressMap.set(courseId, existingProgress);
      
      return {
        ...state,
        courseProgressMap: newProgressMap
      };
    }
    
    case 'MARK_QUIZ_COMPLETED': {
      const { courseId, quizId } = action.payload;
      const newProgressMap = new Map(state.courseProgressMap);
      
      const existingProgress = newProgressMap.get(courseId) || {
        courseId,
        learnedPhraseIds: new Set<string>(),
        completedQuizIds: new Set<string>(),
        lastAccessedDate: new Date()
      };
      
      existingProgress.completedQuizIds.add(quizId);
      existingProgress.lastAccessedDate = new Date();
      newProgressMap.set(courseId, existingProgress);
      
      return {
        ...state,
        courseProgressMap: newProgressMap
      };
    }
    
    default:
      return state;
  }
}

// ストレージキー
const PROGRESS_STORAGE_KEY = '@japanese_app_course_progress';

// コンテキスト型定義
interface UserProgressContextType {
  state: UserProgressState;
  markPhraseCompleted: (courseId: string, phraseId: string) => Promise<void>;
  markQuizCompleted: (courseId: string, quizId: string) => Promise<void>;
  getCourseProgressRatio: (courseId: string) => number;
  getCourseQuizProgressRatio: (courseId: string) => number;
  resetProgress: () => Promise<void>;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const UserProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userProgressReducer, initialState);
  const { getPhraseCount, getQuizQuestionCount } = useContent();
  
  // 初期化時にAsyncStorageから進捗データを読み込む
  useEffect(() => {
    loadProgressData();
  }, []);
  
  // 状態変更時にAsyncStorageに保存
  useEffect(() => {
    if (!state.isLoading) {
      saveProgressData();
    }
  }, [state.courseProgressMap]);
  
  const loadProgressData = async () => {
    dispatch({ type: 'LOAD_PROGRESS_START' });
    try {
      const progressJSON = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
      if (progressJSON) {
        const progressObj = JSON.parse(progressJSON);
        const progressMap = new Map<string, CourseProgress>();
        
        Object.entries(progressObj).forEach(([courseId, value]) => {
          const progress = value as any;
          progressMap.set(courseId, {
            courseId,
            learnedPhraseIds: new Set(progress.learnedPhraseIds),
            completedQuizIds: new Set(progress.completedQuizIds),
            lastAccessedDate: new Date(progress.lastAccessedDate)
          });
        });
        
        dispatch({ type: 'LOAD_PROGRESS_SUCCESS', payload: progressMap });
      } else {
        dispatch({ type: 'LOAD_PROGRESS_SUCCESS', payload: new Map() });
      }
    } catch (error) {
      dispatch({ type: 'LOAD_PROGRESS_ERROR', payload: error as Error });
    }
  };
  
  const saveProgressData = async () => {
    try {
      const progressObj: Record<string, any> = {};
      
      state.courseProgressMap.forEach((progress, courseId) => {
        progressObj[courseId] = {
          learnedPhraseIds: Array.from(progress.learnedPhraseIds),
          completedQuizIds: Array.from(progress.completedQuizIds),
          lastAccessedDate: progress.lastAccessedDate.toISOString()
        };
      });
      
      await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressObj));
    } catch (error) {
      console.error('Failed to save progress data:', error);
    }
  };
  
  const markPhraseCompleted = async (courseId: string, phraseId: string) => {
    dispatch({
      type: 'MARK_PHRASE_COMPLETED',
      payload: { courseId, phraseId }
    });
  };
  
  const markQuizCompleted = async (courseId: string, quizId: string) => {
    dispatch({
      type: 'MARK_QUIZ_COMPLETED',
      payload: { courseId, quizId }
    });
  };
  
  const getCourseProgressRatio = (courseId: string): number => {
    const progress = state.courseProgressMap.get(courseId);
    if (!progress) return 0;
    
    const totalPhrases = getPhraseCount(courseId);
    if (totalPhrases === 0) return 0;
    
    return progress.learnedPhraseIds.size / totalPhrases;
  };
  
  const getCourseQuizProgressRatio = (courseId: string): number => {
    const progress = state.courseProgressMap.get(courseId);
    if (!progress) return 0;
    
    const totalQuizzes = getQuizQuestionCount(courseId);
    if (totalQuizzes === 0) return 0;
    
    return progress.completedQuizIds.size / totalQuizzes;
  };
  
  const resetProgress = async () => {
    try {
      await AsyncStorage.removeItem(PROGRESS_STORAGE_KEY);
      dispatch({ type: 'LOAD_PROGRESS_SUCCESS', payload: new Map() });
    } catch (error) {
      dispatch({ type: 'LOAD_PROGRESS_ERROR', payload: error as Error });
    }
  };
  
  const value: UserProgressContextType = {
    state,
    markPhraseCompleted,
    markQuizCompleted,
    getCourseProgressRatio,
    getCourseQuizProgressRatio,
    resetProgress
  };
  
  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (!context) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};
