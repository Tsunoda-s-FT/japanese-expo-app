import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { QuizSessionLog } from '../types/QuizSessionLog';
import { 
  getQuizSessions, 
  saveQuizSession, 
  clearQuizSessions 
} from '../services/progressManager';

/**
 * クイズセッション状態の型定義
 */
interface QuizSessionState {
  sessions: QuizSessionLog[];
  activeSessionId: string | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * クイズセッションアクション定義
 */
type QuizSessionAction =
  | { type: 'LOAD_SESSIONS_START' }
  | { type: 'LOAD_SESSIONS_SUCCESS'; payload: QuizSessionLog[] }
  | { type: 'LOAD_SESSIONS_ERROR'; payload: Error }
  | { type: 'CREATE_SESSION'; payload: QuizSessionLog }
  | { type: 'ADD_ANSWER'; payload: { sessionId: string; questionId: string; selectedOptionIndex: number; isCorrect: boolean } }
  | { type: 'FINALIZE_SESSION'; payload: string }
  | { type: 'ABORT_SESSION'; payload: { sessionId: string; currentIndex: number } }
  | { type: 'CLEAR_SESSIONS' };

/**
 * 初期状態
 */
const initialState: QuizSessionState = {
  sessions: [],
  activeSessionId: null,
  isLoading: true,
  error: null
};

/**
 * クイズセッションリデューサー
 */
function quizSessionReducer(state: QuizSessionState, action: QuizSessionAction): QuizSessionState {
  switch (action.type) {
    case 'LOAD_SESSIONS_START':
      return { ...state, isLoading: true };
      
    case 'LOAD_SESSIONS_SUCCESS':
      return { 
        ...state, 
        sessions: action.payload,
        isLoading: false,
        error: null
      };
      
    case 'LOAD_SESSIONS_ERROR':
      return { ...state, error: action.payload, isLoading: false };
      
    case 'CREATE_SESSION':
      return {
        ...state,
        sessions: [...state.sessions, action.payload],
        activeSessionId: action.payload.sessionId
      };
      
    case 'ADD_ANSWER': {
      const { sessionId, questionId, selectedOptionIndex, isCorrect } = action.payload;
      const updatedSessions = state.sessions.map(session => {
        if (session.sessionId !== sessionId) return session;
        
        const newAnswer = {
          questionId,
          selectedOptionIndex,
          isCorrect
        };
        
        const correctCount = isCorrect 
          ? session.correctCount + 1 
          : session.correctCount;
        
        return {
          ...session,
          answers: [...session.answers, newAnswer],
          correctCount,
          totalCount: session.totalCount + 1
        };
      });
      
      return {
        ...state,
        sessions: updatedSessions
      };
    }
    
    case 'FINALIZE_SESSION': {
      const sessionId = action.payload;
      const updatedSessions = state.sessions.map(session => {
        if (session.sessionId !== sessionId) return session;
        return {
          ...session,
          status: 'completed' as const,
          date: new Date().toISOString()
        };
      });
      
      return {
        ...state,
        sessions: updatedSessions,
        activeSessionId: null
      };
    }
    
    case 'ABORT_SESSION': {
      const { sessionId, currentIndex } = action.payload;
      const updatedSessions = state.sessions.map(session => {
        if (session.sessionId !== sessionId) return session;
        return {
          ...session,
          status: 'aborted' as const,
          date: new Date().toISOString(),
          totalCount: currentIndex
        };
      });
      
      return {
        ...state,
        sessions: updatedSessions,
        activeSessionId: null
      };
    }
    
    case 'CLEAR_SESSIONS':
      return {
        ...state,
        sessions: [],
        activeSessionId: null
      };
      
    default:
      return state;
  }
}

/**
 * クイズセッションコンテキスト型定義
 */
interface QuizSessionContextType {
  sessions: QuizSessionLog[];
  activeSessionId: string | null;
  isLoading: boolean;
  error: Error | null;
  createNewSession: (courseId: string) => string;
  addAnswer: (questionId: string, selectedOptionIndex: number, isCorrect: boolean) => void;
  finalizeSession: () => void;
  abortSession: (currentIndex: number) => void;
  getActiveSession: () => QuizSessionLog | undefined;
  getSessionById: (sessionId: string) => QuizSessionLog | undefined;
  clearAllSessions: () => void;
}

const QuizSessionContext = createContext<QuizSessionContextType | undefined>(undefined);

/**
 * クイズセッションプロバイダーコンポーネント
 */
export const QuizSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quizSessionReducer, initialState);
  
  // 初期化時にセッションデータを読み込む
  useEffect(() => {
    loadSessionsData();
  }, []);
  
  /**
   * セッションデータを読み込む
   */
  const loadSessionsData = async () => {
    dispatch({ type: 'LOAD_SESSIONS_START' });
    try {
      const sessions = await getQuizSessions();
      dispatch({ type: 'LOAD_SESSIONS_SUCCESS', payload: sessions });
    } catch (error) {
      dispatch({ type: 'LOAD_SESSIONS_ERROR', payload: error as Error });
    }
  };
  
  /**
   * 新しいセッションを作成
   * @param courseId コースID
   * @returns 新しいセッションID
   */
  const createNewSession = (courseId: string): string => {
    const sessionId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const newSession: QuizSessionLog = {
      sessionId,
      courseId,
      date: new Date().toISOString(),
      status: 'ongoing',
      answers: [],
      correctCount: 0,
      totalCount: 0
    };
    
    dispatch({ type: 'CREATE_SESSION', payload: newSession });
    saveQuizSession(newSession).catch(err => 
      console.error('Failed to save new quiz session:', err)
    );
    
    return sessionId;
  };
  
  /**
   * 回答を追加
   * @param questionId 質問ID
   * @param selectedOptionIndex 選択したオプションのインデックス
   * @param isCorrect 正解かどうか
   */
  const addAnswer = (questionId: string, selectedOptionIndex: number, isCorrect: boolean) => {
    if (!state.activeSessionId) {
      console.error('No active quiz session');
      return;
    }
    
    dispatch({
      type: 'ADD_ANSWER',
      payload: {
        sessionId: state.activeSessionId,
        questionId,
        selectedOptionIndex,
        isCorrect
      }
    });
    
    // セッションを保存
    const updatedSession = state.sessions.find(s => s.sessionId === state.activeSessionId);
    if (updatedSession) {
      saveQuizSession(updatedSession).catch(err => 
        console.error('Failed to save quiz session answer:', err)
      );
    }
  };
  
  /**
   * セッションを完了
   */
  const finalizeSession = () => {
    if (!state.activeSessionId) {
      console.error('No active quiz session');
      return;
    }
    
    dispatch({ type: 'FINALIZE_SESSION', payload: state.activeSessionId });
    
    // セッションを保存
    const updatedSession = state.sessions.find(s => s.sessionId === state.activeSessionId);
    if (updatedSession) {
      const finalizedSession: QuizSessionLog = {
        ...updatedSession,
        status: 'completed',
        date: new Date().toISOString()
      };
      saveQuizSession(finalizedSession).catch(err => 
        console.error('Failed to save finalized quiz session:', err)
      );
    }
  };
  
  /**
   * セッションを中断
   * @param currentIndex 現在の質問インデックス
   */
  const abortSession = (currentIndex: number) => {
    if (!state.activeSessionId) {
      console.error('No active quiz session');
      return;
    }
    
    dispatch({
      type: 'ABORT_SESSION',
      payload: {
        sessionId: state.activeSessionId,
        currentIndex
      }
    });
    
    // セッションを保存
    const updatedSession = state.sessions.find(s => s.sessionId === state.activeSessionId);
    if (updatedSession) {
      const abortedSession: QuizSessionLog = {
        ...updatedSession,
        status: 'aborted',
        date: new Date().toISOString(),
        totalCount: currentIndex
      };
      saveQuizSession(abortedSession).catch(err => 
        console.error('Failed to save aborted quiz session:', err)
      );
    }
  };
  
  /**
   * アクティブなセッションを取得
   * @returns アクティブなセッション
   */
  const getActiveSession = (): QuizSessionLog | undefined => {
    if (!state.activeSessionId) return undefined;
    return state.sessions.find(s => s.sessionId === state.activeSessionId);
  };
  
  /**
   * セッションIDからセッションを取得
   * @param sessionId セッションID
   * @returns セッション
   */
  const getSessionById = (sessionId: string): QuizSessionLog | undefined => {
    return state.sessions.find(s => s.sessionId === sessionId);
  };
  
  /**
   * すべてのセッションをクリア
   */
  const clearAllSessions = async () => {
    try {
      await clearQuizSessions();
      dispatch({ type: 'CLEAR_SESSIONS' });
    } catch (error) {
      console.error('Failed to clear quiz sessions:', error);
    }
  };
  
  return (
    <QuizSessionContext.Provider value={{
      sessions: state.sessions,
      activeSessionId: state.activeSessionId,
      isLoading: state.isLoading,
      error: state.error,
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
