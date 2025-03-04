/**
 * コンテンツの型定義
 * 新旧両方の形式をサポートするために統合されたモジュール
 */

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
  segmentType?: string;  // 新規: base, polite_suffix, honorific_prefix など
}

// 多言語対応の翻訳を定義
export interface Translations {
  en: string;
  ja?: string;
  zh?: string;
  ko?: string;
  es?: string;
  [key: string]: string | undefined;
}

// 多言語対応のテキスト
export interface LocalizedText {
  ja: string;
  en?: string;
  zh?: string;
  ko?: string;
  es?: string;
  [key: string]: string | undefined;
}

// 例文の構造を定義（拡張版）
export interface ExampleSentence {
  id: string;
  jpText: string;
  reading?: string;
  segments?: Segment[];
  translations: Translations;
  audio?: string;        // 旧形式との互換性のため残す
  audioPath?: string;    // 新形式: レッスンディレクトリからの相対パス
}

// フレーズのバリエーション（新規）
export interface PhraseVariation {
  id: string;
  jpText: string;
  reading?: string;
  audio?: string;        // 旧形式との互換性のため追加
  audioPath?: string;    // 新形式: レッスンディレクトリからの相対パス
  politenessLevel?: string;
  translations: Translations;
  description?: LocalizedText;
}

// フレーズの構造を定義（拡張版）
export interface Phrase {
  id: string;
  jpText: string;
  reading?: string;
  segments?: Segment[];
  translations: Translations;
  audio?: string;        // 旧形式との互換性のため残す
  audioPath?: string;    // 新形式: レッスンディレクトリからの相対パス
  politenessLevel?: string;  // 新規: casual, polite, honorific, humble
  learningLevel?: string;    // 新規: essential, common, advanced
  sentenceType?: string;     // 新規: statement, question, request など
  description?: LocalizedText;
  usageContext?: LocalizedText;
  exampleSentences?: ExampleSentence[];  // 旧形式との互換性のため残す
  examples?: ExampleSentence[];          // 新形式: examples
  variations?: PhraseVariation[];        // 新規: バリエーション
  notes?: string;                        // オプショナルなメモフィールド
  words?: string[];
  imageRefs?: string[];                  // 新規: 画像への参照
}

// クイズ問題の構造を定義（多言語対応）
export interface QuizQuestion {
  id: string;
  linkedPhraseId: string;
  questionSuffixJp: string;  // この名前は互換性のために残すが、内容は現在の言語を反映
  options: string[];         // 言語に応じた選択肢の配列
  answerIndex: number;
  explanation: string;       // 言語に応じた説明文
  questionText?: LocalizedText;  // 元のマルチ言語データ（デバッグ用）
}

// 進捗管理用の型定義
export interface QuizSessionLog {
  sessionId: string;
  courseId: string;
  date: string;
  status: 'ongoing' | 'completed' | 'aborted';
  answers: {
    questionId: string;
    selectedOptionIndex: number;
    isCorrect: boolean;
  }[];
  correctCount: number;
  totalCount: number;
  stoppedAtQuestionIndex?: number;
}

export interface CourseProgress {
  courseId: string;
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