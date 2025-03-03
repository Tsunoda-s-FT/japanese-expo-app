import React, { createContext, useContext } from 'react';
import { QuizSessionLog } from '../types/QuizSessionLog';
import { useProgress } from './ProgressContext';

/**
 * クイズセッションコンテキスト型定義
 */
interface QuizSessionContextType {
  // ===== 状態 =====
  sessions: QuizSessionLog[];
  activeSessionId: string | null;
  isLoading: boolean;
  error: Error | null;
  
  // ===== セッション管理 =====
  createNewSession: (courseId: string) => string;
  addAnswer: (questionId: string, selectedOptionIndex: number, isCorrect: boolean) => void;
  finalizeSession: () => void;
  abortSession: (currentIndex: number) => void;
  
  // ===== セッション取得 =====
  getActiveSession: () => QuizSessionLog | undefined;
  getSessionById: (sessionId: string) => QuizSessionLog | undefined;
  clearAllSessions: () => void;
}

const QuizSessionContext = createContext<QuizSessionContextType | undefined>(undefined);

/**
 * クイズセッションプロバイダーコンポーネント
 * ProgressContextのラッパーとして機能し、クイズセッション固有の操作に特化したインターフェースを提供します
 */
export const QuizSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    quizLogs: sessions,
    isLoading,
    error,
    createNewQuizSession,
    addAnswerToQuizSession,
    finalizeQuizSession,
    abortQuizSession,
    getQuizSessionById,
    clearAllQuizSessions
  } = useProgress();
  
  // アクティブなセッションIDを追跡するための状態
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null);
  
  /**
   * 新しいセッションを作成
   * @param courseId コースID
   * @returns 新しいセッションID
   */
  const createNewSession = (courseId: string): string => {
    const sessionId = createNewQuizSession(courseId);
    setActiveSessionId(sessionId);
    return sessionId;
  };
  
  /**
   * 回答を追加
   * @param questionId 質問ID
   * @param selectedOptionIndex 選択したオプションのインデックス
   * @param isCorrect 正解かどうか
   */
  const addAnswer = (questionId: string, selectedOptionIndex: number, isCorrect: boolean) => {
    if (!activeSessionId) {
      console.error('No active quiz session');
      return;
    }
    
    addAnswerToQuizSession(
      activeSessionId,
      questionId,
      selectedOptionIndex,
      isCorrect
    );
  };
  
  /**
   * セッションを完了
   */
  const finalizeSession = async () => {
    if (!activeSessionId) {
      console.error('No active quiz session');
      return;
    }
    
    await finalizeQuizSession(activeSessionId);
    setActiveSessionId(null);
  };
  
  /**
   * セッションを中断
   * @param currentIndex 現在の質問インデックス
   */
  const abortSession = (currentIndex: number) => {
    if (!activeSessionId) {
      console.error('No active quiz session');
      return;
    }
    
    abortQuizSession(activeSessionId, currentIndex);
    setActiveSessionId(null);
  };
  
  /**
   * アクティブなセッションを取得
   * @returns アクティブなセッション
   */
  const getActiveSession = (): QuizSessionLog | undefined => {
    if (!activeSessionId) return undefined;
    return getSessionById(activeSessionId);
  };
  
  /**
   * セッションIDからセッションを取得
   * @param sessionId セッションID
   * @returns セッション
   */
  const getSessionById = (sessionId: string): QuizSessionLog | undefined => {
    return getQuizSessionById(sessionId);
  };
  
  /**
   * すべてのセッションをクリア
   */
  const clearAllSessions = async () => {
    await clearAllQuizSessions();
    setActiveSessionId(null);
  };
  
  return (
    <QuizSessionContext.Provider value={{
      sessions,
      activeSessionId,
      isLoading,
      error,
      createNewSession,
      addAnswer,
      finalizeSession,
      abortSession,
      getActiveSession,
      getSessionById,
      clearAllSessions
    }}>
      {children}
    </QuizSessionContext.Provider>
  );
};

/**
 * クイズセッションコンテキストを使用するためのフック
 */
export const useQuizSession = () => {
  const context = useContext(QuizSessionContext);
  if (!context) {
    throw new Error('useQuizSession must be used within a QuizSessionProvider');
  }
  return context;
};
