import { Content, Course, Lesson, Phrase, QuizQuestion } from '../types/contentTypes';
import rawData from '../../assets/data/content.json';

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
          jpText: ex.jp_text,
          reading: ex.reading,
          translations: ex.translations,
          audio: ex.audio
        }));
        return {
          id: p.id,
          jpText: p.jpText,
          reading: p.reading,
          translations: p.translations,
          audio: p.audio,
          exampleSentences: transformedExamples,
          words: p.words || []
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

/** 全レッスンを返す */
export function getAllLessons(): Lesson[] {
  return content.lessons;
}

/** lessonId からレッスンを取得 */
export function getLessonById(lessonId: string): Lesson | undefined {
  return content.lessons.find((l) => l.id === lessonId);
}

/** すべてのコースをフラットに取得 */
export function getAllCourses(): Course[] {
  return content.lessons.flatMap((lesson) => lesson.courses);
}

/** コースIDからコースを探す */
export function getCourseById(courseId: string): Course | undefined {
  for (const lesson of content.lessons) {
    const found = lesson.courses.find((c) => c.id === courseId);
    if (found) return found;
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
