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
  level: string;
  estimatedTime: string; // e.g., "10分"
  phrases: Phrase[];
  quizQuestions: QuizQuestion[];
  tags: string[]; // e.g., ["greeting", "daily", "formal"]
}

// 文節の構造を定義
export interface Segment {
  jpText: string;
  reading?: string;
  partOfSpeech?: string;
}

// 翻訳の構造を定義
export interface Translations {
  en: string;
  // 他の言語のサポートを追加する場合はここに
}

// 例文の構造を定義
export interface ExampleSentence {
  id: string;
  jpText: string;
  segments?: Segment[];
  translations: Translations;
  audio?: string;
}

// フレーズの構造を定義
export interface Phrase {
  id: string;
  jpText: string;
  segments?: Segment[];
  translations: Translations;
  audio?: string;
  exampleSentences?: ExampleSentence[];
  notes?: string; // オプショナルなメモフィールド
  words?: string[];
}

// クイズ問題の構造を定義
export interface QuizQuestion {
  id: string;
  linkedPhraseId: string;      // フレーズIDへの参照
  questionSuffixJp: string;    // 問題文のサフィックス（例：「の意味は？」）
  options: string[];
  answerIndex: number;
  explanation: string;
}

// 進捗管理用の型定義
export interface QuizResult {
  sessionId: string;
  courseId: string;
  startTime: string;
  endTime?: string;
  answers: QuizAnswer[];
  status: 'in-progress' | 'completed' | 'aborted';
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timestamp: string;
}

export interface CourseProgress {
  courseId: string;
  completedPhrases: string[];
  quizResults: QuizResult[];
}

export interface LessonProgress {
  completedCourseIds: Set<string>;
  lastAccessedDate: Date;
}

// コンテンツ全体の型定義
export interface Content {
  lessons: Lesson[];
}
