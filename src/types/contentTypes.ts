import { Content, Lesson, Course, Phrase, QuizQuestion, ExampleSentence } from '../types/contentTypes';
import { LanguageCode } from '../i18n/i18n';

// 新しいコンテンツ構造のデータを静的に読み込む
// ※Expo環境ではdynamic importができないため静的インポートに限定しています
import indexJson from '../../assets/contents/index.json';

// レッスン毎のメタデータとコンテンツ
import greetingsMetadata from '../../assets/contents/lesson_greetings/metadata.json';
import greetingsContent from '../../assets/contents/lesson_greetings/content.json';
import businessMetadata from '../../assets/contents/lesson_business/metadata.json';
import businessContent from '../../assets/contents/lesson_business/content.json';
import restaurantMetadata from '../../assets/contents/lesson_restaurant/metadata.json';
import restaurantContent from '../../assets/contents/lesson_restaurant/content.json';

// タグデータ
import learningLevelTags from '../../assets/contents/tags/learningLevel.json';
import partOfSpeechTags from '../../assets/contents/tags/partOfSpeech.json';
import politenessLevelTags from '../../assets/contents/tags/politenessLevel.json';
import segmentTypeTags from '../../assets/contents/tags/segmentType.json';
import sentenceTypeTags from '../../assets/contents/tags/sentenceType.json';

// コースメタデータの型定義
interface CourseMetadata {
  id: string;
  title: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  level: string;
  estimatedTime: string;
  tags: string[];
}

// レッスンIDごとのデータマッピング
const lessonData: { [key: string]: { metadata: any; content: any } } = {
  'lesson_greetings': {
    metadata: greetingsMetadata,
    content: greetingsContent
  },
  'lesson_business': {
    metadata: businessMetadata,
    content: businessContent
  },
  'lesson_restaurant': {
    metadata: restaurantMetadata,
    content: restaurantContent
  }
};

/**
 * 新しいコンテンツ構造からコンテンツを読み込む
 * @param language 言語コード
 * @returns Content オブジェクト
 */
export function loadNewContent(language: LanguageCode = 'ja'): Content {
  try {
    // 指定された言語のレッスン情報を変換
    const lessons: Lesson[] = indexJson.availableLessons.map(lessonIndex => {
      const lessonId = lessonIndex.id;
      
      // レッスンデータを取得
      const lessonInfo = lessonData[lessonId];
      if (!lessonInfo) {
        throw new Error(`Lesson data not found for ID: ${lessonId}`);
      }
      
      const { metadata, content } = lessonInfo;
      
      // 言語に応じたタイトルと説明を取得
      const title = metadata.title[language] || metadata.title.ja;
      const description = metadata.description[language] || metadata.description.ja;
      
      // コースを変換
      const courses: Course[] = metadata.courses.map((courseMetadata: CourseMetadata) => {
        const courseId = courseMetadata.id;
        
        // コースコンテンツを取得
        const courseContent = content.courses.find((c: any) => c.id === courseId);
        if (!courseContent) {
          throw new Error(`Course content not found for ID: ${courseId}`);
        }
        
        // 言語に応じたコースのタイトルと説明
        const courseTitle = courseMetadata.title[language] || courseMetadata.title.ja;
        const courseDescription = courseMetadata.description[language] || courseMetadata.description.ja;
        
        // フレーズを変換
        const phrases: Phrase[] = courseContent.phrases.map((phrase: any) => {
          return transformPhrase(phrase, lessonId, language);
        });
        
        // クイズ問題を変換
        const quizQuestions: QuizQuestion[] = courseContent.quizQuestions
          ? courseContent.quizQuestions.map((quiz: any) => transformQuizQuestion(quiz, language))
          : [];
        
        // コースオブジェクトを作成
        return {
          id: courseId,
          title: courseTitle,
          description: courseDescription,
          level: courseMetadata.level,
          estimatedTime: courseMetadata.estimatedTime,
          tags: courseMetadata.tags,
          phrases: phrases,
          quizQuestions: quizQuestions
        };
      });
      
      // レッスンオブジェクトを作成
      return {
        id: lessonId,
        title: title,
        description: description,
        category: metadata.category,
        thumbnail: `assets/contents/${lessonId}/${metadata.thumbnailPath}`,
        totalEstimatedTime: metadata.totalEstimatedTime,
        courses: courses
      };
    });
    
    return { lessons };
  } catch (error) {
    console.error('Error in loadNewContent:', error);
    throw error;
  }
}

/**
 * フレーズデータを変換するヘルパー関数
 */
function transformPhrase(phrase: any, lessonId: string, language: LanguageCode): Phrase {
  // オーディオパスを調整（相対パスを絶対パスに変換）
  const audioPath = phrase.audioPath 
    ? `assets/contents/${lessonId}/${phrase.audioPath}` 
    : undefined;
  
  // 例文を変換
  const exampleSentences: ExampleSentence[] = (phrase.examples || []).map((example: any) => {
    return {
      id: example.id,
      jpText: example.jpText,
      reading: example.reading,
      translations: example.translations,
      audio: example.audioPath ? `assets/contents/${lessonId}/${example.audioPath}` : undefined,
      segments: example.segments || []
    };
  });
  
  // フレーズオブジェクトを作成
  return {
    id: phrase.id,
    jpText: phrase.jpText,
    reading: phrase.reading,
    translations: phrase.translations,
    audio: audioPath,
    segments: phrase.segments || [],
    exampleSentences: exampleSentences,
    words: phrase.words || []
  };
}

/**
 * クイズ問題データを変換するヘルパー関数
 */
function transformQuizQuestion(quiz: any, language: LanguageCode): QuizQuestion {
  return {
    id: quiz.id,
    linkedPhraseId: quiz.linkedPhraseId,
    questionSuffixJp: quiz.questionText?.ja || quiz.questionSuffixJp,
    options: quiz.options.map((opt: any) => typeof opt === 'string' ? opt : opt[language] || opt.ja),
    answerIndex: quiz.answerIndex,
    explanation: quiz.explanation?.ja || quiz.explanation
  };
}