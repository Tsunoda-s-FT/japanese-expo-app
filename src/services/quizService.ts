import contentJson from '../../assets/data/content.json';
import { QuizQuestion } from '../types/contentTypes';

const data = contentJson as {
  lessons: any[];
  outputTemplates: any[];
  quizQuestions: QuizQuestion[];
};

export async function generateQuizQuestions(lessonId?: string | null): Promise<QuizQuestion[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let allQuestions = data.quizQuestions;
  if (lessonId) {
    allQuestions = allQuestions.filter((q) => q.lessonId === lessonId);
  }
  
  if (allQuestions.length === 0) {
    const shuffled = [...data.quizQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }

  return allQuestions;
}
