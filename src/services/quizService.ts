import contentJson from '../../assets/data/content.json';
import { QuizQuestion, Content } from '../types/contentTypes';

// JSONデータをContent型に変換するヘルパー関数
function transformContent(data: any): Content {
  return {
    lessons: data.lessons.map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      category: lesson.category,
      thumbnail: lesson.thumbnail,
      totalEstimatedTime: lesson.totalEstimatedTime,
      courses: lesson.courses.map((course: any) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level as 'beginner' | 'intermediate' | 'advanced',
        estimatedTime: course.estimatedTime,
        tags: course.tags,
        phrases: course.phrases.map((phrase: any) => ({
          id: phrase.id,
          jpText: phrase.jpText,
          reading: phrase.reading,
          translations: phrase.translations,
          audio: phrase.audio,
          words: phrase.words,
          exampleSentences: phrase.exampleSentences.map((ex: any) => ({
            id: ex.id || `${phrase.id}_ex_${Math.random().toString(36).substr(2, 9)}`,
            jpText: ex.jp_text,
            reading: ex.reading,
            translations: ex.translations,
            audio: ex.audio
          }))
        })),
        quizQuestions: course.quizQuestions
      }))
    }))
  };
}

const data = transformContent(contentJson);

export async function generateQuizQuestions(courseId?: string | null): Promise<QuizQuestion[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!courseId) {
    // コースIDが指定されていない場合は、全コースからランダムに問題を選択
    const allQuestions = data.lessons.flatMap(lesson => 
      lesson.courses.flatMap(course => course.quizQuestions)
    );
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }

  // 指定されたコースの問題を探す
  const course = data.lessons
    .flatMap(lesson => lesson.courses)
    .find(course => course.id === courseId);

  if (!course) {
    throw new Error(`Course not found: ${courseId}`);
  }

  // コースの問題をシャッフルして返す
  return [...course.quizQuestions].sort(() => 0.5 - Math.random());
}
