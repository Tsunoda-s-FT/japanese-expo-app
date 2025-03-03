import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContent } from './ContentContext';
import { Content, Course, Lesson, QuizSessionLog } from '../types/contentTypes';

// ストレージキー - progressManager.tsと統一
const PROGRESS_STORAGE_KEY = '@japanese_app_progress';
const QUIZ_LOGS_KEY = '@japanese_app_quiz_sessions';

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
 * レッスン進捗の型定義
 */
export interface LessonProgress {
  completedCourseIds: Set<string>;
  lastAccessedDate: Date;
}

/**
 * 進捗状態の型定義
 */
interface ProgressState {
  courseProgressMap: Map<string, CourseProgress>;
  lessonProgressMap: Map<string, LessonProgress>; // レッスン進捗を追加
  quizLogs: QuizSessionLog[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * 進捗アクション定義
 */
type ProgressAction = 
  | { type: 'LOAD_PROGRESS_START' }
  | { type: 'LOAD_PROGRESS_SUCCESS'; payload: { 
      courseProgressMap: Map<string, CourseProgress>; 
      lessonProgressMap: Map<string, LessonProgress>;
      quizLogs: QuizSessionLog[] 
    } }
  | { type: 'LOAD_PROGRESS_ERROR'; payload: Error }
  | { type: 'MARK_PHRASE_COMPLETED'; payload: { courseId: string; phraseId: string } }
  | { type: 'MARK_QUIZ_COMPLETED'; payload: { courseId: string; quizId: string } }
  | { type: 'MARK_COURSE_COMPLETED'; payload: { lessonId: string; courseId: string } }
  | { type: 'CREATE_QUIZ_SESSION'; payload: { sessionId: string; courseId: string } }
  | { type: 'ADD_QUIZ_ANSWER'; payload: { sessionId: string; questionId: string; selectedOptionIndex: number; isCorrect: boolean } }
  | { type: 'FINALIZE_QUIZ_SESSION'; payload: { sessionId: string } }
  | { type: 'ABORT_QUIZ_SESSION'; payload: { sessionId: string; currentIndex: number } };

/**
 * 初期状態
 */
const initialState: ProgressState = {
  courseProgressMap: new Map(),
  lessonProgressMap: new Map(),
  quizLogs: [],
  isLoading: true,
  error: null
};

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
        courseProgressMap: action.payload.courseProgressMap,
        lessonProgressMap: action.payload.lessonProgressMap,
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

    case 'MARK_COURSE_COMPLETED': {
      const { lessonId, courseId } = action.payload;
      const newMap = new Map(state.lessonProgressMap);
      
      // レッスンの進捗を取得または初期化
      let lessonProgress = newMap.get(lessonId);
      if (!lessonProgress) {
        lessonProgress = {
          completedCourseIds: new Set<string>(),
          lastAccessedDate: new Date()
        };
      }
      
      // 新しいSetを作成して変更を適用
      const newCompletedCourseIds = new Set(lessonProgress.completedCourseIds);
      newCompletedCourseIds.add(courseId);
      
      // 更新された進捗オブジェクトを作成
      const updatedProgress = {
        ...lessonProgress,
        completedCourseIds: newCompletedCourseIds,
        lastAccessedDate: new Date()
      };
      
      // マップを更新
      newMap.set(lessonId, updatedProgress);
      
      return {
        ...state,
        lessonProgressMap: newMap
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
  lessonProgressMap: Map<string, LessonProgress>;
  quizLogs: QuizSessionLog[];
  isLoading: boolean;
  error: Error | null;
  
  // ===== 進捗マーキング =====
  markPhraseCompleted: (courseId: string, phraseId: string) => Promise<void>;
  markQuizCompleted: (courseId: string, quizId: string) => Promise<void>;
  markCourseAsCompleted: (lessonId: string, courseId: string) => Promise<void>;
  
  // ===== 進捗取得 =====
  getProgressForCourse: (courseId: string) => CourseProgress | undefined;
  getLessonProgress: (lessonId: string) => LessonProgress | undefined;
  getCourseProgressRatio: (courseId: string) => number;
  getCourseQuizProgressRatio: (courseId: string) => number;
  
  // ===== 進捗確認 =====
  isPhraseCompleted: (courseId: string, phraseId: string) => boolean;
  isQuizCompleted: (courseId: string, quizId: string) => boolean;
  isCourseCompleted: (lessonId: string, courseId: string) => boolean;
  
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
  clearAllQuizSessions: () => Promise<void>;
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

  // courseProgressMapが変更されたら保存
  useEffect(() => {
    saveCourseProgressMap();
  }, [state.courseProgressMap]);

  // lessonProgressMapが変更されたら保存
  useEffect(() => {
    saveLessonProgressMap();
  }, [state.lessonProgressMap]);
  
  /**
   * 進捗データの読み込み
   */
  const loadProgressData = async () => {
    dispatch({ type: 'LOAD_PROGRESS_START' });
    try {
      // コース進捗マップの読み込み
      const courseProgressMap = await loadCourseProgressMap();
      
      // レッスン進捗マップの読み込み
      const lessonProgressMap = await loadLessonProgressMap();
      
      // クイズログを読み込む
      const quizLogs = await loadQuizLogs();
      
      dispatch({ 
        type: 'LOAD_PROGRESS_SUCCESS', 
        payload: { 
          courseProgressMap, 
          lessonProgressMap,
          quizLogs 
        } 
      });
    } catch (error) {
      dispatch({ type: 'LOAD_PROGRESS_ERROR', payload: error as Error });
    }
  };

  /**
   * コース進捗マップの読み込み
   */
  const loadCourseProgressMap = async (): Promise<Map<string, CourseProgress>> => {
    const progressMap = new Map<string, CourseProgress>();
    
    try {
      // すべてのコースIDを取得
      if (contentContext.state.content && contentContext.state.content.lessons) {
        for (const lesson of contentContext.state.content.lessons) {
          for (const course of lesson.courses) {
            const courseId = course.id;
            const progress = await getCourseProgressFromStorage(courseId);
            if (progress) {
              progressMap.set(courseId, progress);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load course progress map:', error);
    }
    
    return progressMap;
  };

  /**
   * レッスン進捗マップの読み込み
   */
  const loadLessonProgressMap = async (): Promise<Map<string, LessonProgress>> => {
    const progressMap = new Map<string, LessonProgress>();
    
    try {
      // すべてのレッスンIDを取得
      if (contentContext.state.content && contentContext.state.content.lessons) {
        for (const lesson of contentContext.state.content.lessons) {
          const lessonId = lesson.id;
          const progress = await getLessonProgressFromStorage(lessonId);
          if (progress) {
            progressMap.set(lessonId, progress);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load lesson progress map:', error);
    }
    
    return progressMap;
  };

  /**
   * AsyncStorageからコース進捗を取得
   */
  const getCourseProgressFromStorage = async (courseId: string): Promise<CourseProgress | null> => {
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
      console.error(`Failed to get course progress for ${courseId}:`, error);
      return null;
    }
  };

  /**
   * AsyncStorageからレッスン進捗を取得
   */
  const getLessonProgressFromStorage = async (lessonId: string): Promise<LessonProgress | null> => {
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
      console.error(`Failed to get lesson progress for ${lessonId}:`, error);
      return null;
    }
  };
  
  /**
   * クイズログを読み込む
   */
  const loadQuizLogs = async (): Promise<QuizSessionLog[]> => {
    try {
      const logsJSON = await AsyncStorage.getItem(QUIZ_LOGS_KEY);
      if (logsJSON) {
        return JSON.parse(logsJSON);
      }
      return [];
    } catch (error) {
      console.error('Failed to load quiz logs:', error);
      return [];
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
   * コース進捗マップを保存
   */
  const saveCourseProgressMap = async () => {
    try {
      for (const [courseId, progress] of state.courseProgressMap.entries()) {
        await saveCourseProgressToStorage(courseId, progress);
      }
    } catch (error) {
      console.error('Failed to save course progress map:', error);
    }
  };

  /**
   * レッスン進捗マップを保存
   */
  const saveLessonProgressMap = async () => {
    try {
      for (const [lessonId, progress] of state.lessonProgressMap.entries()) {
        await saveLessonProgressToStorage(lessonId, progress);
      }
    } catch (error) {
      console.error('Failed to save lesson progress map:', error);
    }
  };

  /**
   * コース進捗をAsyncStorageに保存
   */
  const saveCourseProgressToStorage = async (courseId: string, progress: CourseProgress): Promise<void> => {
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
      console.error(`Failed to save course progress for ${courseId}:`, error);
    }
  };

  /**
   * レッスン進捗をAsyncStorageに保存
   */
  const saveLessonProgressToStorage = async (lessonId: string, progress: LessonProgress): Promise<void> => {
    try {
      const key = `${PROGRESS_STORAGE_KEY}:lesson_${lessonId}`;
      const data = {
        completedCourseIds: Array.from(progress.completedCourseIds),
        lastAccessedDate: progress.lastAccessedDate.toISOString()
      };
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save lesson progress for ${lessonId}:`, error);
    }
  };
  
  /**
   * フレーズ完了をマーク
   * @param courseId コースID
   * @param phraseId フレーズID
   */
  const markPhraseCompleted = async (courseId: string, phraseId: string) => {
    dispatch({ type: 'MARK_PHRASE_COMPLETED', payload: { courseId, phraseId } });
  };
  
  /**
   * クイズ完了をマーク
   * @param courseId コースID
   * @param quizId クイズID
   */
  const markQuizCompleted = async (courseId: string, quizId: string) => {
    dispatch({ type: 'MARK_QUIZ_COMPLETED', payload: { courseId, quizId } });
  };

  /**
   * コース完了をマーク
   * @param lessonId レッスンID
   * @param courseId コースID
   */
  const markCourseAsCompleted = async (lessonId: string, courseId: string) => {
    dispatch({ type: 'MARK_COURSE_COMPLETED', payload: { lessonId, courseId } });
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
   * レッスンの進捗を取得
   * @param lessonId レッスンID
   * @returns レッスン進捗
   */
  const getLessonProgress = (lessonId: string): LessonProgress | undefined => {
    return state.lessonProgressMap.get(lessonId);
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
   * フレーズが学習済みかどうかを確認
   * @param courseId コースID
   * @param phraseId フレーズID
   * @returns 学習済みかどうか
   */
  const isPhraseCompleted = (courseId: string, phraseId: string): boolean => {
    const progress = state.courseProgressMap.get(courseId);
    return progress?.learnedPhraseIds.has(phraseId) || false;
  };

  /**
   * クイズが完了済みかどうかを確認
   * @param courseId コースID
   * @param quizId クイズID
   * @returns 完了済みかどうか
   */
  const isQuizCompleted = (courseId: string, quizId: string): boolean => {
    const progress = state.courseProgressMap.get(courseId);
    return progress?.completedQuizIds.has(quizId) || false;
  };

  /**
   * コースが完了済みかどうかを確認
   * @param lessonId レッスンID
   * @param courseId コースID
   * @returns 完了済みかどうか
   */
  const isCourseCompleted = (lessonId: string, courseId: string): boolean => {
    const progress = state.lessonProgressMap.get(lessonId);
    return progress?.completedCourseIds.has(courseId) || false;
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
  
  /**
   * すべてのクイズセッションをクリア
   */
  const clearAllQuizSessions = async () => {
    try {
      await AsyncStorage.setItem(QUIZ_LOGS_KEY, JSON.stringify([]));
      dispatch({ 
        type: 'LOAD_PROGRESS_SUCCESS', 
        payload: { 
          courseProgressMap: state.courseProgressMap, 
          lessonProgressMap: state.lessonProgressMap,
          quizLogs: [] 
        } 
      });
    } catch (error) {
      console.error('Failed to clear quiz sessions:', error);
    }
  };
  
  const value: ProgressContextType = {
    // 状態
    courseProgressMap: state.courseProgressMap,
    lessonProgressMap: state.lessonProgressMap,
    quizLogs: state.quizLogs,
    isLoading: state.isLoading,
    error: state.error,
    
    // 進捗マーキング
    markPhraseCompleted,
    markQuizCompleted,
    markCourseAsCompleted,
    
    // 進捗取得
    getProgressForCourse,
    getLessonProgress,
    getCourseProgressRatio,
    getCourseQuizProgressRatio,
    
    // 進捗確認
    isPhraseCompleted,
    isQuizCompleted,
    isCourseCompleted,
    
    // クイズセッション管理
    createNewQuizSession,
    addAnswerToQuizSession,
    finalizeQuizSession,
    abortQuizSession,
    getQuizSessionById,
    clearAllQuizSessions
  };
  
  return (
    <ProgressContext.Provider value={value}>
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