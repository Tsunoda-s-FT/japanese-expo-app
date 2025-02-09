import contentJson from '../../assets/data/content.json';
import { QuizQuestion } from '../types/contentTypes';

const data = contentJson as {
  courses: {
    id: string;
    title: string;
    description: string;
    phrases: any[];
    quizQuestions: QuizQuestion[];
  }[];
};

export async function generateQuizQuestions(courseId?: string | null): Promise<QuizQuestion[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!courseId) {
    // コースIDが指定されていない場合は、全コースからランダムに問題を選択
    const allQuestions = data.courses.flatMap(course => course.quizQuestions);
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }

  // 指定されたコースの問題を取得
  const course = data.courses.find(c => c.id === courseId);
  if (!course || course.quizQuestions.length === 0) {
    return [];
  }

  return course.quizQuestions;
}
