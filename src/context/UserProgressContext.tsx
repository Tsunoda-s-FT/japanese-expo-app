import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContent } from './ContentContext';
import { Content, Course, Lesson } from '../types/contentTypes';
import { QuizSessionLog } from '../types/QuizSessionLog';
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
 * 進捗状態の型定義
 */
interface ProgressState {
  courseProgressMap: Map<string, CourseProgress>;
  quizLogs: QuizSessionLog[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * 進捗アクション定義
 */
type ProgressAction = 
  | { type: 'LOAD_PROGRESS_START' }
  | { type: 'LOAD_PROGRESS_SUCCESS'; payload: { progressMap: Map<string, CourseProgress>; quizLogs: QuizSessionLog[] } }
  | { type: 'LOAD_PROGRESS_ERROR'; payload: Error }
  | { type: 'MARK_PHRASE_COMPLETED'; payload: { courseId: string; phraseId: string } }
  | { type: 'MARK_QUIZ_COMPLETED'; payload: { courseId: string; quizId: string } }
  | { type: 'CREATE_QUIZ_SESSION'; payload: { sessionId: string; courseId: string } }
  | { type: 'ADD_QUIZ_ANSWER'; payload: { sessionId: string; questionId: string; selectedOptionIndex: number; isCorrect: boolean } }
  | { type: 'FINALIZE_QUIZ_SESSION'; payload: { sessionId: string } }
  | { type: 'ABORT_QUIZ_SESSION'; payload: { sessionId: string; currentIndex: number } };

/**
 * 初期状態
 */
const initialState: ProgressState = {
  courseProgressMap: new Map(),
  quizLogs: [],
  isLoading: true,
  error: null
};

// ストレージキー
const QUIZ_LOGS_KEY = '@AppQuizLogs';

/**
 * 進捗リデューサー
 */
function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case 'LOAD_PROGRESS_START':
      return { ...state, isLoading: true };
      
    case 'LOAD_PROGRESS_SUCCESS':
      return { 
        ...state, 
        courseProgressMap: action.payload.progressMap,
        quizLogs: action.payload.quizLogs,
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
    
    case 'CREATE_QUIZ_SESSION': {
      const { sessionId, courseId } = action.payload;
      const newSession: QuizSessionLog = {
        sessionId,
        courseId,
        date: new Date().toISOString(),
        status: 'ongoing',
        answers: [],
        correctCount: 0,
        totalCount: 0
      };
      
      return {
        ...state,
        quizLogs: [...state.quizLogs, newSession]
      };
    }
    
    case 'ADD_QUIZ_ANSWER': {
      const { sessionId, questionId, selectedOptionIndex, isCorrect } = action.payload;
      
      return {
        ...state,
        quizLogs: state.quizLogs.map(session => {
          if (session.sessionId === sessionId) {
            return {
              ...session,
              answers: [
                ...session.answers,
                { questionId, selectedOptionIndex, isCorrect }
              ]
            };
          }
          return session;
        })
      };
    }
    
    case 'FINALIZE_QUIZ_SESSION': {
      const { sessionId } = action.payload;
      
      return {
        ...state,
        quizLogs: state.quizLogs.map(session => {
          if (session.sessionId === sessionId) {
            const totalCount = session.answers.length;
            const correctCount = session.answers.filter(ans => ans.isCorrect).length;
            return {
              ...session,
              totalCount,
              correctCount,
              status: 'completed'
            };
          }
          return session;
        })
      };
    }
    
    case 'ABORT_QUIZ_SESSION': {
      const { sessionId, currentIndex } = action.payload;
      
      return {
        ...state,
        quizLogs: state.quizLogs.map(session => {
          if (session.sessionId === sessionId) {
            return {
              ...session,
              status: 'aborted',
              stoppedAtQuestionIndex: currentIndex
            };
          }
          return session;
        })
      };
    }
    
    default:
      return state;
  }
}

/**
 * 進捗コンテキスト型定義
 */
interface ProgressContextType {
  // ===== 状態 =====
  courseProgressMap: Map<string, CourseProgress>;
  quizLogs: QuizSessionLog[];
  isLoading: boolean;
  error: Error | null;
  
  // ===== 進捗マーキング =====
  markPhraseCompleted: (courseId: string, phraseId: string) => Promise<void>;
  markQuizCompleted: (courseId: string, quizId: string) => Promise<void>;
  
  // ===== 進捗取得 =====
  getProgressForCourse: (courseId: string) => CourseProgress | undefined;
  getCourseProgressRatio: (courseId: string) => number;
  getCourseQuizProgressRatio: (courseId: string) => number;
  
  // ===== クイズセッション管理 =====
  createNewQuizSession: (courseId: string) => string;
  addAnswerToQuizSession: (
    sessionId: string,
    questionId: string,
    selectedOptionIndex: number,
    isCorrect: boolean
  ) => void;
  finalizeQuizSession: (sessionId: string) => Promise<void>;
  abortQuizSession: (sessionId: string, currentIndex: number) => void;
  getQuizSessionById: (sessionId: string) => QuizSessionLog | undefined;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

/**
 * 進捗プロバイダーコンポーネント
 */
export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(progressReducer, initialState);
  const contentContext = useContent();
  
  // 初期化時に進捗データを読み込む
  useEffect(() => {
    loadProgressData();
  }, []);
  
  // quizLogsが変更されたら保存
  useEffect(() => {
    saveQuizLogs();
  }, [state.quizLogs]);
  
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
      
      // クイズログを読み込む
      let quizLogs: QuizSessionLog[] = [];
      const logsJSON = await AsyncStorage.getItem(QUIZ_LOGS_KEY);
      if (logsJSON) {
        quizLogs = JSON.parse(logsJSON);
      }
      
      dispatch({ 
        type: 'LOAD_PROGRESS_SUCCESS', 
        payload: { 
          progressMap, 
          quizLogs 
        } 
      });
    } catch (error) {
      dispatch({ type: 'LOAD_PROGRESS_ERROR', payload: error as Error });
    }
  };
  
  /**
   * クイズログを保存
   */
  const saveQuizLogs = async () => {
    try {
      await AsyncStorage.setItem(QUIZ_LOGS_KEY, JSON.stringify(state.quizLogs));
    } catch (error) {
      console.error('Failed to save quiz logs:', error);
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
   * コース内のフレーズ学習進捗率を取得
   * @param courseId コースID
   * @returns 進捗率（0-1）
   */
  const getCourseProgressRatio = (courseId: string): number => {
    const courseProgress = state.courseProgressMap.get(courseId);
    if (!courseProgress) return 0;
    
    const course = contentContext.state.content?.lessons
      .flatMap((lesson: Lesson) => lesson.courses)
      .find((c: Course) => c.id === courseId);
    
    if (!course || course.phrases.length === 0) return 0;
    
    return courseProgress.learnedPhraseIds.size / course.phrases.length;
  };
  
  /**
   * コース内のクイズ完了進捗率を取得
   * @param courseId コースID
   * @returns 進捗率（0-1）
   */
  const getCourseQuizProgressRatio = (courseId: string): number => {
    const courseProgress = state.courseProgressMap.get(courseId);
    if (!courseProgress) return 0;
    
    const course = contentContext.state.content?.lessons
      .flatMap((lesson: Lesson) => lesson.courses)
      .find((c: Course) => c.id === courseId);
    
    if (!course || course.quizQuestions.length === 0) return 0;
    
    return courseProgress.completedQuizIds.size / course.quizQuestions.length;
  };
  
  /**
   * 新規クイズセッションを作成
   * @param courseId コースID
   * @returns セッションID
   */
  const createNewQuizSession = (courseId: string): string => {
    const sessionId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    dispatch({ type: 'CREATE_QUIZ_SESSION', payload: { sessionId, courseId } });
    return sessionId;
  };
  
  /**
   * クイズセッションに回答を追加
   * @param sessionId セッションID
   * @param questionId 問題ID
   * @param selectedOptionIndex 選択肢インデックス
   * @param isCorrect 正解かどうか
   */
  const addAnswerToQuizSession = (
    sessionId: string,
    questionId: string,
    selectedOptionIndex: number,
    isCorrect: boolean
  ) => {
    dispatch({ 
      type: 'ADD_QUIZ_ANSWER', 
      payload: { 
        sessionId, 
        questionId, 
        selectedOptionIndex, 
        isCorrect 
      } 
    });
  };
  
  /**
   * クイズセッションを完了としてマーク
   * @param sessionId セッションID
   */
  const finalizeQuizSession = async (sessionId: string) => {
    dispatch({ type: 'FINALIZE_QUIZ_SESSION', payload: { sessionId } });
  };
  
  /**
   * クイズセッションを中断としてマーク
   * @param sessionId セッションID
   * @param currentIndex 現在の問題インデックス
   */
  const abortQuizSession = (sessionId: string, currentIndex: number) => {
    dispatch({ type: 'ABORT_QUIZ_SESSION', payload: { sessionId, currentIndex } });
  };
  
  /**
   * 特定IDのクイズセッションを取得
   * @param sessionId セッションID
   * @returns クイズセッション
   */
  const getQuizSessionById = (sessionId: string): QuizSessionLog | undefined => {
    return state.quizLogs.find(log => log.sessionId === sessionId);
  };
  
  return (
    <ProgressContext.Provider value={{
      // 状態
      courseProgressMap: state.courseProgressMap,
      quizLogs: state.quizLogs,
      isLoading: state.isLoading,
      error: state.error,
      
      // 進捗マーキング
      markPhraseCompleted,
      markQuizCompleted,
      
      // 進捗取得
      getProgressForCourse,
      getCourseProgressRatio,
      getCourseQuizProgressRatio,
      
      // クイズセッション管理
      createNewQuizSession,
      addAnswerToQuizSession,
      finalizeQuizSession,
      abortQuizSession,
      getQuizSessionById
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

/**
 * 進捗コンテキストを使用するためのフック
 */
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
