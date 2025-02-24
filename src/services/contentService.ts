import { Content, Course, Lesson, Phrase, QuizQuestion } from '../types/contentTypes';
import rawData from '../../assets/data/content.json';
import { useLanguage } from '../context/LanguageContext';

/** content.json の構造に合わせて変換 */
function transformContent(data: any): Content {
  // lessons 配列を走査
  const lessons: Lesson[] = data.lessons.map((lesson: any) => {
    const transformedCourses: Course[] = lesson.courses.map((course: any) => {
      // phrases 配列
      const transformedPhrases: Phrase[] = course.phrases.map((p: any) => {
        // exampleSentences (snake_case -> camelCase) を変換
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
}

// 変換後のデータをメモリに保持
const content: Content = transformContent(rawData);

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

/** 全レッスンを返す (言語対応版) */
export function getAllLessons(language = 'ja'): Lesson[] {
  if (language === 'ja') {
    return content.lessons;
  }
  
  // 英語版では翻訳されたタイトルとディスクリプションを使用
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

/** lessonId からレッスンを取得 (言語対応版) */
export function getLessonById(lessonId: string, language = 'ja'): Lesson | undefined {
  const lesson = content.lessons.find((l) => l.id === lessonId);
  if (!lesson) return undefined;
  
  if (language === 'ja') {
    return lesson;
  }
  
  // 英語版では翻訳されたタイトルとディスクリプションを使用
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

/** すべてのコースをフラットに取得 (言語対応版) */
export function getAllCourses(language = 'ja'): Course[] {
  const courses = content.lessons.flatMap((lesson) => lesson.courses);
  
  if (language === 'ja') {
    return courses;
  }
  
  // 英語版では翻訳されたタイトルとディスクリプションを使用
  return courses.map(course => {
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

/** コースIDからコースを探す (言語対応版) */
export function getCourseById(courseId: string, language = 'ja'): Course | undefined {
  for (const lesson of content.lessons) {
    const found = lesson.courses.find((c) => c.id === courseId);
    if (found) {
      if (language === 'ja') {
        return found;
      }
      
      // 英語版では翻訳されたタイトルとディスクリプションを使用
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

/** コースIDからそのレッスンを探す */
export function getLessonForCourse(courseId: string): Lesson | undefined {
  return content.lessons.find((l) => l.courses.some((c) => c.id === courseId));
}

/** 次のフレーズを取得 */
export function getNextPhrase(courseId: string, currentPhraseId: string): Phrase | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;

  const currentIndex = course.phrases.findIndex((p) => p.id === currentPhraseId);
  if (currentIndex === -1 || currentIndex === course.phrases.length - 1) return undefined;
  return course.phrases[currentIndex + 1];
}

/** 次のクイズ問題を取得 */
export function getNextQuizQuestion(courseId: string, currentQuestionId: string): QuizQuestion | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;

  const currentIndex = course.quizQuestions.findIndex((q) => q.id === currentQuestionId);
  if (currentIndex === -1 || currentIndex === course.quizQuestions.length - 1) return undefined;
  return course.quizQuestions[currentIndex + 1];
}

/** コースのフレーズ総数を取得 */
export function getPhraseCount(courseId: string): number {
  const course = getCourseById(courseId);
  return course ? course.phrases.length : 0;
}

/** コースのクイズ問題総数を取得 */
export function getQuizQuestionCount(courseId: string): number {
  const course = getCourseById(courseId);
  return course ? course.quizQuestions.length : 0;
}

// コンテンツサービスを使用する際のラッパー関数
// 現在の言語コンテキストを自動的に使用
export function useContentService() {
  const { language } = useLanguage();
  
  return {
    getAllLessons: () => getAllLessons(language),
    getLessonById: (id: string) => getLessonById(id, language),
    getAllCourses: () => getAllCourses(language),
    getCourseById: (id: string) => getCourseById(id, language),
    getLessonForCourse,
    getNextPhrase,
    getNextQuizQuestion,
    getPhraseCount,
    getQuizQuestionCount
  };
}
