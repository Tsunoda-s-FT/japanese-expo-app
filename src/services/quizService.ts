/**
 * クイズサービス
 * クイズ問題の生成と管理を担当します
 */
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
 * クイズ問題を生成する
 * @param courseId コースID（省略可）
 * @param count 問題数（省略時はコース全問題、またはランダム5問）
 * @returns クイズ問題の配列
 * @throws エラー - クイズ生成に失敗した場合
 */
export async function generateQuizQuestions(
  courseId?: string | null,
  count: number = 5
): Promise<QuizQuestion[]> {
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
}

/**
 * 全コースからランダムにクイズ問題を生成する
 * @param count 問題数
 * @returns クイズ問題の配列
 * @throws エラー - 問題が存在しない場合
 */
function generateRandomQuizQuestions(count: number): QuizQuestion[] {
  const allQuestions = data.lessons.flatMap(lesson => 
    lesson.courses.flatMap(course => course.quizQuestions)
  );
  
  if (allQuestions.length === 0) {
    throw new Error('No quiz questions available');
  }
  
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * 特定のコースのクイズ問題を生成する
 * @param courseId コースID
 * @returns クイズ問題の配列
 * @throws エラー - コースが見つからない場合、または問題が存在しない場合
 */
function generateCourseQuizQuestions(courseId: string): QuizQuestion[] {
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
}
