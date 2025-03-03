import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Content, Lesson, Course } from '../types/contentTypes';
import rawData from '../../assets/data/content.json';
import { useLanguage } from './LanguageContext';
import { LanguageCode } from '../i18n/i18n';

// 状態の型定義
interface ContentState {
  content: Content | null;
  isLoading: boolean;
  error: Error | null;
}

// アクション定義
type ContentAction = 
  | { type: 'LOAD_CONTENT_START' }
  | { type: 'LOAD_CONTENT_SUCCESS'; payload: Content }
  | { type: 'LOAD_CONTENT_ERROR'; payload: Error };

const initialState: ContentState = {
  content: null,
  isLoading: true,
  error: null
};

function contentReducer(state: ContentState, action: ContentAction): ContentState {
  switch (action.type) {
    case 'LOAD_CONTENT_START':
      return { ...state, isLoading: true };
    case 'LOAD_CONTENT_SUCCESS':
      return { ...state, content: action.payload, isLoading: false, error: null };
    case 'LOAD_CONTENT_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

interface ContentContextType {
  state: ContentState;
  getAllLessons: (language?: LanguageCode) => Lesson[];
  getLessonById: (lessonId: string, language?: LanguageCode) => Lesson | undefined;
  getAllCourses: (language?: LanguageCode) => Course[];
  getCourseById: (courseId: string, language?: LanguageCode) => Course | undefined;
  getPhraseCount: (courseId: string) => number;
  getQuizQuestionCount: (courseId: string) => number;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// 英語翻訳タイトルとディスクリプションのマッピング
// 本来はcontent.jsonに直接組み込むべきですが、工数削減のため、ハードコーディングします
const contentTranslations: Record<string, { title: string; description: string }> = {
  // レッスン翻訳
  'lesson_greetings': {
    title: 'Greetings',
    description: 'Basic greeting expressions for N5 level'
  },
  'lesson_business': {
    title: 'Business Manners',
    description: 'Honorific expressions and interactions for N4 level'
  },
  'lesson_restaurant': {
    title: 'Restaurant',
    description: 'Learn basic expressions used in restaurants and deepen your understanding with quizzes'
  },
  
  // コース翻訳
  'course_greetings_new': {
    title: 'Greetings (Redesigned)',
    description: 'Learn basic greetings and confirm their meanings with quizzes'
  },
  'course_business_new': {
    title: 'Business Expressions (Redesigned)',
    description: 'Honorific phrases and quizzes commonly used in the workplace'
  },
  'course_restaurant_expressions': {
    title: 'Restaurant Expressions',
    description: 'Learn phrases needed for conversations in restaurants and confirm with quizzes'
  }
};

// 現在の言語に基づいてタイトルとディスクリプションを取得する関数
function getLocalizedContent(id: string, language: string): { title: string; description: string } | null {
  if (language === 'ja' || !contentTranslations[id]) {
    return null; // 日本語はオリジナルのまま使用
  }
  return contentTranslations[id];
}

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(contentReducer, initialState);
  const { t } = useLanguage();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    dispatch({ type: 'LOAD_CONTENT_START' });
    try {
      // 本番環境では外部APIからデータを取得することも考慮
      const content = transformContent(rawData);
      dispatch({ type: 'LOAD_CONTENT_SUCCESS', payload: content });
    } catch (error) {
      dispatch({ type: 'LOAD_CONTENT_ERROR', payload: error as Error });
    }
  };

  // コンテンツデータの変換関数
  const transformContent = (data: any): Content => {
    // lessons 配列を走査
    const lessons: Lesson[] = data.lessons.map((lesson: any) => {
      const transformedCourses: Course[] = lesson.courses.map((course: any) => {
        // phrases 配列
        const transformedPhrases = course.phrases.map((p: any) => {
          // exampleSentences (snake_case -> camelCase) を変換
          const transformedExamples = (p.exampleSentences || []).map((ex: any) => ({
            id: ex.id || `example_${p.id}_${Math.random().toString(36).substring(2, 9)}`,
            jpText: ex.jpText,
            reading: ex.reading,
            translations: ex.translations,
            audio: ex.audio,
            segments: ex.segments || []
          }));
          return {
            id: p.id,
            jpText: p.jpText,
            reading: p.reading,
            translations: p.translations,
            audio: p.audio,
            exampleSentences: transformedExamples,
            words: p.words || [],
            segments: p.segments || []
          };
        });

        return {
          id: course.id,
          title: course.title,
          description: course.description,
          level: course.level || 'beginner',
          estimatedTime: course.estimatedTime || '',
          tags: course.tags || [],
          phrases: transformedPhrases,
          quizQuestions: course.quizQuestions || []
        };
      });

      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        category: lesson.category || '',
        thumbnail: lesson.thumbnail || '',
        totalEstimatedTime: lesson.totalEstimatedTime || '',
        courses: transformedCourses
      };
    });

    return { lessons };
  };

  // インターフェースメソッドの実装
  const getAllLessons = (language: LanguageCode = 'ja'): Lesson[] => {
    if (!state.content) return [];
    
    return state.content.lessons.map(lesson => {
      return {
        ...lesson,
        title: t(`lesson_${lesson.id}`, lesson.title),
        description: t(`lesson_${lesson.id}_description`, lesson.description),
        courses: lesson.courses.map(course => ({
          ...course,
          title: t(`course_${course.id}`, course.title),
          description: t(`course_${course.id}_description`, course.description)
        }))
      };
    });
  };

  const getLessonById = (lessonId: string, language: LanguageCode = 'ja'): Lesson | undefined => {
    if (!state.content) return undefined;
    
    const lesson = state.content.lessons.find(l => l.id === lessonId);
    if (!lesson) return undefined;
    
    return {
      ...lesson,
      title: t(`lesson_${lesson.id}`, lesson.title),
      description: t(`lesson_${lesson.id}_description`, lesson.description),
      courses: lesson.courses.map(course => ({
        ...course,
        title: t(`course_${course.id}`, course.title),
        description: t(`course_${course.id}_description`, course.description)
      }))
    };
  };

  const getAllCourses = (language: LanguageCode = 'ja'): Course[] => {
    if (!state.content) return [];
    
    const allCourses = state.content.lessons.flatMap(l => l.courses);
    
    return allCourses.map(course => ({
      ...course,
      title: t(`course_${course.id}`, course.title),
      description: t(`course_${course.id}_description`, course.description)
    }));
  };

  const getCourseById = (courseId: string, language: LanguageCode = 'ja'): Course | undefined => {
    if (!state.content) return undefined;
    
    const course = state.content.lessons
      .flatMap(l => l.courses)
      .find(c => c.id === courseId);
      
    if (!course) return undefined;
    
    return {
      ...course,
      title: t(`course_${course.id}`, course.title),
      description: t(`course_${course.id}_description`, course.description)
    };
  };

  const getPhraseCount = (courseId: string): number => {
    const course = getCourseById(courseId);
    return course?.phrases.length || 0;
  };

  const getQuizQuestionCount = (courseId: string): number => {
    const course = getCourseById(courseId);
    return course?.quizQuestions.length || 0;
  };

  const value: ContentContextType = {
    state,
    getAllLessons,
    getLessonById,
    getAllCourses,
    getCourseById,
    getPhraseCount,
    getQuizQuestionCount,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
