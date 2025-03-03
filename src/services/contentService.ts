/**
 * コンテンツサービス
 * アプリケーションのコンテンツデータを管理します
 */
import { Content, Course, Lesson, Phrase, QuizQuestion } from '../types/contentTypes';
import rawData from '../../assets/data/content.json';
import { LanguageCode } from '../i18n/i18n';
import { loadNewContent } from './newContentService';

// 設定フラグ - 新しいコンテンツ構造を使用するか
const USE_NEW_CONTENT_STRUCTURE = true;

// メモリキャッシュ
let cachedContent: Content | null = null;
let lastUsedLanguage: LanguageCode | null = null;

/**
 * JSONデータを変換して内部形式にする (旧方式)
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

/**
 * コンテンツを取得する (キャッシング処理を含む)
 * @param language 言語コード
 * @param forceRefresh キャッシュを強制的に更新するかどうか
 * @returns コンテンツオブジェクト
 */
async function getContent(language: LanguageCode = 'ja', forceRefresh = false): Promise<Content> {
  // キャッシュチェック
  if (!forceRefresh && cachedContent && lastUsedLanguage === language) {
    return cachedContent;
  }
  
  try {
    // 新しいコンテンツ構造を使用する場合
    if (USE_NEW_CONTENT_STRUCTURE) {
      cachedContent = loadNewContent(language);
    } else {
      // 旧コンテンツ構造を使用
      cachedContent = transformContent(rawData);
    }
    
    lastUsedLanguage = language;
    return cachedContent;
  } catch (error) {
    console.error('Error loading content:', error);
    
    // 新しい構造での読み込みに失敗した場合、旧構造にフォールバック
    if (USE_NEW_CONTENT_STRUCTURE) {
      console.warn('Falling back to old content structure');
      try {
        cachedContent = transformContent(rawData);
        lastUsedLanguage = language;
        return cachedContent;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw new Error('Failed to load content from both new and old structures');
      }
    }
    
    throw error;
  }
}

/**
 * 現在の言語に基づいてタイトルとディスクリプションを取得する関数
 * @param id コンテンツID
 * @param language 言語コード
 * @returns 翻訳されたタイトルとディスクリプション、または null
 */
function getLocalizedContent(id: string, language: LanguageCode): { title: string; description: string } | null {
  // 日本語はオリジナルのまま使用
  if (language === 'ja') return null;
  
  // 翻訳情報 (旧構造でのみ使用)
  const contentTranslations: Record<string, Partial<Record<LanguageCode, { title: string; description: string }>>> = {
    // レッスン翻訳
    'lesson_greetings': {
      'en': {
        title: 'Greetings',
        description: 'Basic greeting expressions for N5 level'
      },
      // 他の言語...
    },
    // 他のレッスン...
  };
  
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
export async function getAllLessons(language: LanguageCode = 'ja'): Promise<Lesson[]> {
  const content = await getContent(language);
  return content.lessons;
}

/** 
 * lessonId からレッスンを取得 (言語対応版) 
 * @param lessonId レッスンID
 * @param language 言語コード
 * @returns レッスン、または undefined
 */
export async function getLessonById(lessonId: string, language: LanguageCode = 'ja'): Promise<Lesson | undefined> {
  const content = await getContent(language);
  return content.lessons.find((l) => l.id === lessonId);
}

/** 
 * courseId からコースを取得 (言語対応版) 
 * @param courseId コースID
 * @param language 言語コード
 * @returns コース、または undefined
 */
export async function getCourseById(courseId: string, language: LanguageCode = 'ja'): Promise<Course | undefined> {
  const content = await getContent(language);
  
  for (const lesson of content.lessons) {
    const found = lesson.courses.find((c) => c.id === courseId);
    if (found) {
      return found;
    }
  }
  return undefined;
}

/** 
 * コースIDからそのレッスンを探す 
 * @param courseId コースID
 * @returns レッスン、または undefined
 */
export async function getLessonForCourse(courseId: string): Promise<Lesson | undefined> {
  const content = await getContent();
  return content.lessons.find((l) => l.courses.some((c) => c.id === courseId));
}

/** 
 * 次のフレーズを取得 
 * @param courseId コースID
 * @param currentPhraseId 現在のフレーズID
 * @returns 次のフレーズ、または undefined
 */
export async function getNextPhrase(courseId: string, currentPhraseId: string): Promise<Phrase | undefined> {
  const course = await getCourseById(courseId);
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
export async function getNextQuizQuestion(courseId: string, currentQuestionId: string): Promise<QuizQuestion | undefined> {
  const course = await getCourseById(courseId);
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
export async function getPhraseById(phraseId: string): Promise<Phrase | undefined> {
  const content = await getContent();
  
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
export async function getQuizQuestionById(questionId: string): Promise<QuizQuestion | undefined> {
  const content = await getContent();
  
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
export async function getPhrasesCountForCourse(courseId: string): Promise<number> {
  const course = await getCourseById(courseId);
  return course ? course.phrases.length : 0;
}

/**
 * コースのクイズ問題数を取得
 * @param courseId コースID
 * @returns クイズ問題数、またはコースが見つからない場合は0
 */
export async function getQuizQuestionsCountForCourse(courseId: string): Promise<number> {
  const course = await getCourseById(courseId);
  return course ? course.quizQuestions.length : 0;
}

/** 
 * 全コースを返す (言語対応版) 
 * @param language 言語コード
 * @returns コースの配列
 */
export async function getAllCourses(language: LanguageCode = 'ja'): Promise<Course[]> {
  const content = await getContent(language);
  return content.lessons.flatMap(l => l.courses);
}