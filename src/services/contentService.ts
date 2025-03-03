/**
 * コンテンツサービス
 * アプリケーションのコンテンツデータを管理します
 */
import { Content, Course, Lesson, Phrase, QuizQuestion } from '../types/contentTypes';
import rawData from '../../assets/data/content.json';
import { LanguageCode } from '../i18n/i18n';

/**
 * content.jsonの構造に合わせてデータを変換します
 * @param data 生のJSONデータ
 * @returns 変換されたContentオブジェクト
 */
function transformContent(data: any): Content {
  try {
    // lessons 配列を走査
    const lessons: Lesson[] = data.lessons.map((lesson: any) => {
      const transformedCourses: Course[] = lesson.courses.map((course: any) => {
        // phrases 配列
        const transformedPhrases: Phrase[] = course.phrases.map((p: any) => {
          // exampleSentences を変換
          const transformedExamples = (p.exampleSentences || []).map((ex: any) => ({
            id: ex.id || `example_${p.id}_${Math.random().toString(36).substr(2, 9)}`,
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
  } catch (error) {
    console.error('Error transforming content data:', error);
    throw new Error('Failed to transform content data');
  }
}

// 変換後のデータをメモリに保持
const content: Content = transformContent(rawData);

/**
 * コンテンツの翻訳情報
 * 日本語は原文を使用するため、jaプロパティは含まない
 */
const contentTranslations: Record<string, Partial<Record<LanguageCode, { title: string; description: string }>>> = {
  // レッスン翻訳
  'lesson_greetings': {
    'en': {
      title: 'Greetings',
      description: 'Basic greeting expressions for N5 level'
    },
    'zh': {
      title: '问候语',
      description: 'N5级别的基本问候表达'
    },
    'ko': {
      title: '인사',
      description: 'N5 레벨의 기본 인사 표현'
    },
    'es': {
      title: 'Saludos',
      description: 'Expresiones básicas de saludo para el nivel N5'
    }
  },
  'lesson_business': {
    'en': {
      title: 'Business Manners',
      description: 'Honorific expressions and interactions for N4 level'
    },
    'zh': {
      title: '商务礼仪',
      description: 'N4级别的敬语表达和互动'
    },
    'ko': {
      title: '비즈니스 매너',
      description: 'N4 레벨의 존경 표현과 상호작용'
    },
    'es': {
      title: 'Modales de Negocios',
      description: 'Expresiones honoríficas e interacciones para el nivel N4'
    }
  },
  // コース翻訳
  'course_business_expressions': {
    'en': {
      title: 'Business Expressions (Redesigned)',
      description: 'Honorific phrases and quizzes commonly used in the workplace'
    },
    'zh': {
      title: '商务表达 (重新设计)',
      description: '工作场所常用的敬语短语和测验'
    },
    'ko': {
      title: '비즈니스 표현 (재설계)',
      description: '직장에서 흔히 사용되는 존경 표현과 퀴즈'
    },
    'es': {
      title: 'Expresiones de Negocios (Rediseñado)',
      description: 'Frases honoríficas y cuestionarios comúnmente utilizados en el lugar de trabajo'
    }
  },
  'course_restaurant_expressions': {
    'en': {
      title: 'Restaurant Expressions',
      description: 'Learn phrases needed for conversations in restaurants and confirm with quizzes'
    },
    'zh': {
      title: '餐厅表达',
      description: '学习在餐厅对话所需的短语，并通过测验确认'
    },
    'ko': {
      title: '레스토랑 표현',
      description: '레스토랑에서의 대화에 필요한 문구를 배우고 퀴즈로 확인하세요'
    },
    'es': {
      title: 'Expresiones de Restaurante',
      description: 'Aprenda frases necesarias para conversaciones en restaurantes y confirme con cuestionarios'
    }
  }
};

/**
 * 現在の言語に基づいてタイトルとディスクリプションを取得する関数
 * @param id コンテンツID
 * @param language 言語コード
 * @returns 翻訳されたタイトルとディスクリプション、または null
 */
function getLocalizedContent(id: string, language: LanguageCode): { title: string; description: string } | null {
  // 日本語はオリジナルのまま使用
  if (language === 'ja') return null;
  
  // 翻訳が存在しない場合
  if (!contentTranslations[id]) return null;
  
  // 指定された言語の翻訳がない場合は英語をフォールバックとして使用
  return contentTranslations[id][language] || contentTranslations[id]['en'] || null;
}

/** 
 * 全レッスンを返す (言語対応版) 
 * @param language 言語コード
 * @returns レッスンの配列
 */
export function getAllLessons(language: LanguageCode = 'ja'): Lesson[] {
  if (language === 'ja') {
    return content.lessons;
  }
  
  // 翻訳されたタイトルとディスクリプションを使用
  return content.lessons.map(lesson => {
    const localizedContent = getLocalizedContent(lesson.id, language);
    if (!localizedContent) {
      return lesson;
    }
    return {
      ...lesson,
      title: localizedContent.title,
      description: localizedContent.description
    };
  });
}

/** 
 * lessonId からレッスンを取得 (言語対応版) 
 * @param lessonId レッスンID
 * @param language 言語コード
 * @returns レッスン、または undefined
 */
export function getLessonById(lessonId: string, language: LanguageCode = 'ja'): Lesson | undefined {
  const lesson = content.lessons.find((l) => l.id === lessonId);
  if (!lesson) return undefined;
  
  if (language === 'ja') {
    return lesson;
  }
  
  // 翻訳されたタイトルとディスクリプションを使用
  const localizedLesson = getLocalizedContent(lessonId, language);
  if (!localizedLesson) {
    return lesson;
  }
  
  // レッスン自体とコースも翻訳
  const translatedCourses = lesson.courses.map(course => {
    const localizedCourse = getLocalizedContent(course.id, language);
    if (!localizedCourse) {
      return course;
    }
    return {
      ...course,
      title: localizedCourse.title,
      description: localizedCourse.description
    };
  });
  
  return {
    ...lesson,
    title: localizedLesson.title,
    description: localizedLesson.description,
    courses: translatedCourses
  };
}

/** 
 * courseId からコースを取得 (言語対応版) 
 * @param courseId コースID
 * @param language 言語コード
 * @returns コース、または undefined
 */
export function getCourseById(courseId: string, language: LanguageCode = 'ja'): Course | undefined {
  for (const lesson of content.lessons) {
    const found = lesson.courses.find((c) => c.id === courseId);
    if (found) {
      if (language === 'ja') {
        return found;
      }
      
      // 翻訳されたタイトルとディスクリプションを使用
      const localizedContent = getLocalizedContent(courseId, language);
      if (!localizedContent) {
        return found;
      }
      return {
        ...found,
        title: localizedContent.title,
        description: localizedContent.description
      };
    }
  }
  return undefined;
}

/** 
 * コースIDからそのレッスンを探す 
 * @param courseId コースID
 * @returns レッスン、または undefined
 */
export function getLessonForCourse(courseId: string): Lesson | undefined {
  return content.lessons.find((l) => l.courses.some((c) => c.id === courseId));
}

/** 
 * 次のフレーズを取得 
 * @param courseId コースID
 * @param currentPhraseId 現在のフレーズID
 * @returns 次のフレーズ、または undefined
 */
export function getNextPhrase(courseId: string, currentPhraseId: string): Phrase | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;

  const currentIndex = course.phrases.findIndex((p) => p.id === currentPhraseId);
  if (currentIndex === -1 || currentIndex === course.phrases.length - 1) return undefined;
  return course.phrases[currentIndex + 1];
}

/** 
 * 次のクイズ問題を取得 
 * @param courseId コースID
 * @param currentQuestionId 現在の問題ID
 * @returns 次のクイズ問題、または undefined
 */
export function getNextQuizQuestion(courseId: string, currentQuestionId: string): QuizQuestion | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;

  const currentIndex = course.quizQuestions.findIndex((q) => q.id === currentQuestionId);
  if (currentIndex === -1 || currentIndex === course.quizQuestions.length - 1) return undefined;
  return course.quizQuestions[currentIndex + 1];
}

/**
 * フレーズIDからフレーズを取得
 * @param phraseId フレーズID
 * @returns フレーズ、または undefined
 */
export function getPhraseById(phraseId: string): Phrase | undefined {
  for (const lesson of content.lessons) {
    for (const course of lesson.courses) {
      const phrase = course.phrases.find((p) => p.id === phraseId);
      if (phrase) return phrase;
    }
  }
  return undefined;
}

/**
 * クイズ問題IDからクイズ問題を取得
 * @param questionId クイズ問題ID
 * @returns クイズ問題、または undefined
 */
export function getQuizQuestionById(questionId: string): QuizQuestion | undefined {
  for (const lesson of content.lessons) {
    for (const course of lesson.courses) {
      const question = course.quizQuestions.find((q) => q.id === questionId);
      if (question) return question;
    }
  }
  return undefined;
}

/**
 * コースのフレーズ数を取得
 * @param courseId コースID
 * @returns フレーズ数、またはコースが見つからない場合は0
 */
export function getPhrasesCountForCourse(courseId: string): number {
  const course = getCourseById(courseId);
  return course ? course.phrases.length : 0;
}

/**
 * コースのクイズ問題数を取得
 * @param courseId コースID
 * @returns クイズ問題数、またはコースが見つからない場合は0
 */
export function getQuizQuestionsCountForCourse(courseId: string): number {
  const course = getCourseById(courseId);
  return course ? course.quizQuestions.length : 0;
}

/** 
 * 全コースを返す (言語対応版) 
 * @param language 言語コード
 * @returns コースの配列
 */
export function getAllCourses(language: LanguageCode = 'ja'): Course[] {
  const allCourses = content.lessons.flatMap(l => l.courses);
  
  if (language === 'ja') {
    return allCourses;
  }
  
  // 翻訳されたタイトルとディスクリプションを使用
  return allCourses.map(course => {
    const localizedContent = getLocalizedContent(course.id, language);
    if (!localizedContent) {
      return course;
    }
    return {
      ...course,
      title: localizedContent.title,
      description: localizedContent.description
    };
  });
}
