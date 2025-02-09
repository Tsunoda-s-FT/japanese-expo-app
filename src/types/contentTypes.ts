export interface Phrase {
  id: string;
  lessonId: string;
  jpText: string;
  reading?: string;
  translations: {
    en?: string;
    [lang: string]: string | undefined;
  };
  audio?: string;
  words?: {
    jp_word: string;
    en_word: string;
    audio?: string;
  }[];
  exampleSentences?: {
    jp_text: string;
    reading: string;
    translations: {
      en?: string;
      [lang: string]: string | undefined;
    };
    audio?: string;
  }[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  phrases: Phrase[];
}

export interface OutputTemplate {
  id: string;
  description: string;
  parameters: {
    text_shown?: boolean;
    audio_shown?: boolean;
    translation_shown?: boolean;
    mask_pattern?: string | null;
    source_language_prompt?: string;
    dictionary_hints?: boolean;
  };
}

export interface QuizQuestion {
  id: string;
  lessonId?: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface LessonData {
  lessons: Lesson[];
  outputTemplates: OutputTemplate[];
  quizQuestions: QuizQuestion[];
}
