import { LessonData, Lesson } from '../types/contentTypes';
import contentJson from '../../assets/data/content.json';

const data = contentJson as LessonData;

export async function getAllLessons(): Promise<Lesson[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return data.lessons;
}

export async function getLessonById(lessonId: string): Promise<Lesson | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const found = data.lessons.find((l) => l.id === lessonId);
  return found || null;
}

export function getRawData() {
  return data;
}
