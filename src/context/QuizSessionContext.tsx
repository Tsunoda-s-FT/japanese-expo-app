import React, { createContext, useContext } from 'react';
import { QuizSessionLog } from '../types/contentTypes';
import { useProgress } from './ProgressContext';
import contentJson from '../../assets/data/content.json';
import { QuizQuestion, Content } from '../types/contentTypes';

/**
 * JSONデータをContent型に変換するヘルパー関数
 * @param data JSONデータ
 * @returns 変換されたContentオブジェクト
 */
function transformContent(data: any): Content {
  try {
    return {
      lessons: data.lessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        category: lesson.category || '',
        thumbnail: lesson.thumbnail || '',
        totalEstimatedTime: lesson.totalEstimatedTime || '',
        courses: lesson.courses.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          level: course.level || 'beginner',
          estimatedTime: course.estimatedTime || '',
          tags: course.tags || [],
          phrases: (course.phrases || []).map((phrase: any) => ({
            id: phrase.id,
            jpText: phrase.jpText,
            reading: phrase.reading,
            translations: phrase.translations,
            audio: phrase.audio,
            words: phrase.words || [],
            exampleSentences: (phrase.exampleSentences || []).map((ex: any) => ({
              id: ex.id || `${phrase.id}_ex_${Math.random().toString(36).substring(2, 9)}`,
              jpText: ex.jpText,
              reading: ex.reading,
              translations: ex.translations,
              audio: ex.audio,
              segments: ex.segments || []
            })),
            segments: phrase.segments || []
          })),
          quizQuestions: course.quizQuestions || []
        }))
      }))
    };
  } catch (error) {
    console.error('Error transforming content data:', error);
    throw new Error('Failed to transform content data');
  }
}

// データを一度だけ変換して保持
const data = transformContent(contentJson);

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

  // ===== クイズ生成 =====
  generateQuizQuestions: (courseId?: string | null, count?: number) => Promise<QuizQuestion[]>;
  generateRandomQuizQuestions: (count: number) => QuizQuestion[];
  generateCourseQuizQuestions: (courseId: string) => QuizQuestion[];
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

  /**
   * クイズ問題を生成する
   * @param courseId コースID（省略可）
   * @param count 問題数（省略時はコース全問題、またはランダム5問）
   * @returns クイズ問題の配列
   * @throws エラー - クイズ生成に失敗した場合
   */
  const generateQuizQuestions = async (
    courseId?: string | null,
    count: number = 5
  ): Promise<QuizQuestion[]> => {
    try {
      // 開発用の遅延（本番では削除検討）
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!courseId) {
        // ランダムクイズ生成（コースID指定なし）
        return generateRandomQuizQuestions(count);
      }

      // 特定コースのクイズ生成
      return generateCourseQuizQuestions(courseId);
    } catch (error) {
      console.error('Quiz generation error:', error);
      throw new Error(`Failed to generate quiz questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  /**
   * 全コースからランダムにクイズ問題を生成する
   * @param count 問題数
   * @returns クイズ問題の配列
   * @throws エラー - 問題が存在しない場合
   */
  const generateRandomQuizQuestions = (count: number): QuizQuestion[] => {
    const allQuestions = data.lessons.flatMap(lesson => 
      lesson.courses.flatMap(course => course.quizQuestions)
    );
    
    if (allQuestions.length === 0) {
      throw new Error('No quiz questions available');
    }
    
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  };

  /**
   * 特定のコースのクイズ問題を生成する
   * @param courseId コースID
   * @returns クイズ問題の配列
   * @throws エラー - コースが見つからない場合、または問題が存在しない場合
   */
  const generateCourseQuizQuestions = (courseId: string): QuizQuestion[] => {
    const course = data.lessons
      .flatMap(lesson => lesson.courses)
      .find(course => course.id === courseId);

    if (!course) {
      throw new Error(`Course not found: ${courseId}`);
    }

    if (!course.quizQuestions || course.quizQuestions.length === 0) {
      throw new Error(`No quiz questions available for course: ${courseId}`);
    }

    return [...course.quizQuestions].sort(() => 0.5 - Math.random());
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
      clearAllSessions,
      generateQuizQuestions,
      generateRandomQuizQuestions,
      generateCourseQuizQuestions
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
