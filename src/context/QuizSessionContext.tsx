import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizSessionLog } from '../types/QuizSessionLog';

// 状態の型定義
interface QuizSessionState {
  sessions: QuizSessionLog[];
  activeSessionId: string | null;
  isLoading: boolean;
  error: Error | null;
}

// アクション定義
type QuizSessionAction =
  | { type: 'LOAD_SESSIONS_START' }
  | { type: 'LOAD_SESSIONS_SUCCESS'; payload: QuizSessionLog[] }
  | { type: 'LOAD_SESSIONS_ERROR'; payload: Error }
  | { type: 'CREATE_SESSION'; payload: QuizSessionLog }
  | { type: 'ADD_ANSWER'; payload: { sessionId: string; questionId: string; selectedOptionIndex: number; isCorrect: boolean } }
  | { type: 'FINALIZE_SESSION'; payload: string }
  | { type: 'ABORT_SESSION'; payload: { sessionId: string; currentIndex: number } };

const initialState: QuizSessionState = {
  sessions: [],
  activeSessionId: null,
  isLoading: true,
  error: null
};

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
      
      return {
        ...state,
        sessions: state.sessions.map(session => 
          session.sessionId === sessionId
            ? {
                ...session,
                answers: [
                  ...session.answers,
                  { questionId, selectedOptionIndex, isCorrect }
                ]
              }
            : session
        )
      };
    }
    
    case 'FINALIZE_SESSION': {
      const sessionId = action.payload;
      
      return {
        ...state,
        sessions: state.sessions.map(session => {
          if (session.sessionId === sessionId) {
            const totalCount = session.answers.length;
            const correctCount = session.answers.filter(ans => ans.isCorrect).length;
            
            return {
              ...session,
              status: 'completed',
              totalCount,
              correctCount
            };
          }
          return session;
        }),
        activeSessionId: null
      };
    }
    
    case 'ABORT_SESSION': {
      const { sessionId, currentIndex } = action.payload;
      
      return {
        ...state,
        sessions: state.sessions.map(session => 
          session.sessionId === sessionId
            ? {
                ...session,
                status: 'aborted',
                stoppedAtQuestionIndex: currentIndex
              }
            : session
        ),
        activeSessionId: null
      };
    }
    
    default:
      return state;
  }
}

// ストレージキー
const QUIZ_SESSIONS_STORAGE_KEY = '@japanese_app_quiz_sessions';

// コンテキスト型定義
interface QuizSessionContextType {
  state: QuizSessionState;
  createNewSession: (courseId: string) => string;
  addAnswer: (sessionId: string, questionId: string, selectedOptionIndex: number, isCorrect: boolean) => void;
  finalizeSession: (sessionId: string) => Promise<void>;
  abortSession: (sessionId: string, currentIndex: number) => void;
  getSessionById: (sessionId: string) => QuizSessionLog | undefined;
  clearAllSessions: () => Promise<void>;
}

const QuizSessionContext = createContext<QuizSessionContextType | undefined>(undefined);

export const QuizSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quizSessionReducer, initialState);
  
  // 初期化時にAsyncStorageからセッションデータを読み込む
  useEffect(() => {
    loadSessionsData();
  }, []);
  
  // 状態変更時にAsyncStorageに保存
  useEffect(() => {
    if (!state.isLoading) {
      saveSessionsData();
    }
  }, [state.sessions]);
  
  const loadSessionsData = async () => {
    dispatch({ type: 'LOAD_SESSIONS_START' });
    try {
      const sessionsJSON = await AsyncStorage.getItem(QUIZ_SESSIONS_STORAGE_KEY);
      if (sessionsJSON) {
        const sessions = JSON.parse(sessionsJSON) as QuizSessionLog[];
        dispatch({ type: 'LOAD_SESSIONS_SUCCESS', payload: sessions });
      } else {
        dispatch({ type: 'LOAD_SESSIONS_SUCCESS', payload: [] });
      }
    } catch (error) {
      dispatch({ type: 'LOAD_SESSIONS_ERROR', payload: error as Error });
    }
  };
  
  const saveSessionsData = async () => {
    try {
      await AsyncStorage.setItem(QUIZ_SESSIONS_STORAGE_KEY, JSON.stringify(state.sessions));
    } catch (error) {
      console.error('Failed to save quiz sessions:', error);
    }
  };
  
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
    
    return sessionId;
  };
  
  const addAnswer = (
    sessionId: string,
    questionId: string,
    selectedOptionIndex: number,
    isCorrect: boolean
  ) => {
    dispatch({
      type: 'ADD_ANSWER',
      payload: { sessionId, questionId, selectedOptionIndex, isCorrect }
    });
  };
  
  const finalizeSession = async (sessionId: string) => {
    dispatch({ type: 'FINALIZE_SESSION', payload: sessionId });
  };
  
  const abortSession = (sessionId: string, currentIndex: number) => {
    dispatch({
      type: 'ABORT_SESSION',
      payload: { sessionId, currentIndex }
    });
  };
  
  const getSessionById = (sessionId: string): QuizSessionLog | undefined => {
    return state.sessions.find(session => session.sessionId === sessionId);
  };
  
  const clearAllSessions = async () => {
    try {
      await AsyncStorage.removeItem(QUIZ_SESSIONS_STORAGE_KEY);
      dispatch({ type: 'LOAD_SESSIONS_SUCCESS', payload: [] });
    } catch (error) {
      dispatch({ type: 'LOAD_SESSIONS_ERROR', payload: error as Error });
    }
  };
  
  const value: QuizSessionContextType = {
    state,
    createNewSession,
    addAnswer,
    finalizeSession,
    abortSession,
    getSessionById,
    clearAllSessions
  };
  
  return (
    <QuizSessionContext.Provider value={value}>
      {children}
    </QuizSessionContext.Provider>
  );
};

export const useQuizSession = () => {
  const context = useContext(QuizSessionContext);
  if (!context) {
    throw new Error('useQuizSession must be used within a QuizSessionProvider');
  }
  return context;
};
