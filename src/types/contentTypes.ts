// レッスンの構造を定義
export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string; // e.g., "basic", "business", "travel"
  thumbnail: string;
  totalEstimatedTime: string; // e.g., "30分"
  courses: Course[];
}

// コース全体の構造を定義
export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string; // e.g., "10分"
  phrases: Phrase[];
  quizQuestions: QuizQuestion[];
  tags: string[]; // e.g., ["greeting", "daily", "formal"]
}

// 例文の構造を定義
export interface ExampleSentence {
  id: string;
  jpText: string;
  reading: string;
  translations: {
    en: string;
  };
  audio?: string;
}

// フレーズの構造を定義
export interface Phrase {
  id: string;
  jpText: string;
  reading: string;
  translations: {
    en: string;
  };
  audio?: string;
  exampleSentences: ExampleSentence[];
  words?: string[];
}

// クイズ問題の構造を定義
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

// 進捗管理用の型定義
export interface CourseProgress {
  learnedPhraseIds: Set<string>;
  completedQuizIds: Set<string>;
  lastAccessedDate: Date;
}

export interface LessonProgress {
  completedCourseIds: Set<string>;
  lastAccessedDate: Date;
}

// コンテンツ全体の型定義
export interface Content {
  lessons: Lesson[];
}
