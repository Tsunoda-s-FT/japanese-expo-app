import { Content, Course, Lesson, Phrase, QuizQuestion } from '../types/contentTypes';

// モックデータ
const mockData: Content = {
  lessons: [
    {
      id: 'lesson_greetings',
      title: 'あいさつ',
      description: '日本語の基本的なあいさつを学びます。時間帯や場面に応じた適切なあいさつ表現を身につけましょう。',
      category: 'basic',
      thumbnail: 'images/lessons/greetings.jpg',
      totalEstimatedTime: '45分',
      courses: [
        {
          id: 'course_basic_greetings',
          title: '基本のあいさつ',
          description: '朝昼晩の基本的なあいさつをまとめたコース。初対面や日常で使う基本的な挨拶表現を学習します。',
          level: 'beginner' as const,
          estimatedTime: '15分',
          tags: ['greeting', 'daily', 'formal'],
          phrases: [
            {
              id: 'phrase_ohayou',
              jpText: 'おはようございます',
              reading: 'おはようございます',
              translations: {
                en: 'Good morning'
              },
              audio: 'audio/ohayou_gozaimasu.mp3',
              exampleSentences: [
                {
                  id: 'example_ohayou_1',
                  jpText: 'おはようございます、佐藤さん。',
                  reading: 'おはようございます、さとうさん。',
                  translations: {
                    en: 'Good morning, Mr. Sato.'
                  }
                },
                {
                  id: 'example_ohayou_2',
                  jpText: 'おはよう！よく眠れた？',
                  reading: 'おはよう！よくねむれた？',
                  translations: {
                    en: 'Morning! Did you sleep well?'
                  }
                }
              ]
            },
            {
              id: 'phrase_konnichiwa',
              jpText: 'こんにちは',
              reading: 'こんにちは',
              translations: {
                en: 'Hello / Good afternoon'
              },
              audio: 'audio/konnichiwa.mp3',
              exampleSentences: [
                {
                  id: 'example_konnichiwa_1',
                  jpText: 'こんにちは、元気ですか？',
                  reading: 'こんにちは、げんきですか？',
                  translations: {
                    en: 'Hello, how are you?'
                  }
                },
                {
                  id: 'example_konnichiwa_2',
                  jpText: 'こんにちは、初めまして。',
                  reading: 'こんにちは、はじめまして。',
                  translations: {
                    en: 'Hello, nice to meet you.'
                  }
                }
              ]
            },
            {
              id: 'phrase_konbanwa',
              jpText: 'こんばんは',
              reading: 'こんばんは',
              translations: {
                en: 'Good evening'
              },
              audio: 'audio/konbanwa.mp3',
              exampleSentences: [
                {
                  id: 'example_konbanwa_1',
                  jpText: 'こんばんは、お疲れ様です。',
                  reading: 'こんばんは、おつかれさまです。',
                  translations: {
                    en: 'Good evening, thank you for your hard work.'
                  }
                }
              ]
            }
          ],
          quizQuestions: [
            {
              id: 'quiz_greetings_1',
              question: '「おはようございます」の意味はどれ？',
              options: [
                'Good night',
                'Good afternoon',
                'Good morning',
                'Hello'
              ],
              answerIndex: 2,
              explanation: '「おはようございます」は朝のあいさつで、英語の\'Good morning\'に相当します。'
            },
            {
              id: 'quiz_greetings_2',
              question: '夕方に使うあいさつはどれ？',
              options: [
                'おはようございます',
                'こんにちは',
                'こんばんは',
                'さようなら'
              ],
              answerIndex: 2,
              explanation: '「こんばんは」は夕方や夜に使うあいさつです。'
            }
          ]
        },
        {
          id: 'course_business_greetings',
          title: 'ビジネスのあいさつ',
          description: 'オフィスでよく使うあいさつや、ビジネスシーンで必要な丁寧な表現を学びます。',
          level: 'intermediate' as const,
          estimatedTime: '20分',
          tags: ['business', 'formal', 'office'],
          phrases: [
            {
              id: 'phrase_ohayou_gozaimasu',
              jpText: 'おはようございます',
              reading: 'おはようございます',
              translations: {
                en: 'Good morning (polite)'
              },
              audio: 'audio/ohayou_gozaimasu_business.mp3',
              exampleSentences: [
                {
                  id: 'example_ohayou_business_1',
                  jpText: 'おはようございます、田中部長。',
                  reading: 'おはようございます、たなかぶちょう。',
                  translations: {
                    en: 'Good morning, Director Tanaka.'
                  }
                }
              ]
            },
            {
              id: 'phrase_otsukaresama',
              jpText: 'お疲れ様です',
              reading: 'おつかれさまです',
              translations: {
                en: 'Thank you for your hard work'
              },
              audio: 'audio/otsukaresama_desu.mp3',
              exampleSentences: [
                {
                  id: 'example_otsukaresama_1',
                  jpText: 'お疲れ様です。今日の会議の資料です。',
                  reading: 'おつかれさまです。きょうのかいぎのしりょうです。',
                  translations: {
                    en: 'Hello. Here are the documents for today\'s meeting.'
                  }
                }
              ]
            }
          ],
          quizQuestions: [
            {
              id: 'quiz_business_1',
              question: 'オフィスで同僚に最初に会った時、適切なあいさつは？',
              options: [
                'こんにちは',
                'おはよう',
                'おはようございます',
                'やあ'
              ],
              answerIndex: 2,
              explanation: 'ビジネスの場面では「おはようございます」を使います。「おはよう」は略式なので避けましょう。'
            }
          ]
        }
      ]
    },
    {
      id: 'lesson_self_intro',
      title: '自己紹介',
      description: '日本語での自己紹介の仕方を学びます。場面に応じた適切な自己紹介ができるようになりましょう。',
      category: 'basic',
      thumbnail: 'images/lessons/self_introduction.jpg',
      totalEstimatedTime: '60分',
      courses: [
        {
          id: 'course_basic_self_intro',
          title: '基本の自己紹介',
          description: '名前、出身、職業など、自己紹介の基本的な表現を学びます。',
          level: 'beginner' as const,
          estimatedTime: '30分',
          tags: ['self-introduction', 'basic', 'casual'],
          phrases: [
            {
              id: 'phrase_watashi_wa',
              jpText: '私は山田です',
              reading: 'わたしはやまだです',
              translations: {
                en: 'I am Yamada'
              },
              audio: 'audio/watashi_wa_yamada_desu.mp3',
              exampleSentences: [
                {
                  id: 'example_watashi_1',
                  jpText: '私は山田です。よろしくお願いします。',
                  reading: 'わたしはやまだです。よろしくおねがいします。',
                  translations: {
                    en: 'I am Yamada. Nice to meet you.'
                  }
                }
              ]
            },
            {
              id: 'phrase_shumi',
              jpText: '趣味は読書です',
              reading: 'しゅみはどくしょです',
              translations: {
                en: 'My hobby is reading'
              },
              audio: 'audio/shumi_wa_dokusho_desu.mp3',
              exampleSentences: [
                {
                  id: 'example_shumi_1',
                  jpText: '趣味は読書と音楽です。',
                  reading: 'しゅみはどくしょとおんがくです。',
                  translations: {
                    en: 'My hobbies are reading and music.'
                  }
                }
              ]
            }
          ],
          quizQuestions: [
            {
              id: 'quiz_self_intro_1',
              question: '「私は学生です」の英訳として正しいものは？',
              options: [
                'I was a student',
                'I am a student',
                'You are a student',
                'He is a student'
              ],
              answerIndex: 1,
              explanation: '「私は学生です」は現在の状態を表す文で、英語では\'I am a student\'となります。'
            }
          ]
        }
      ]
    }
  ]
};

export const getLessons = (): Lesson[] => {
  console.log('Raw content:', JSON.stringify(mockData));
  return mockData.lessons;
};

export const getLesson = (lessonId: string): Lesson | undefined => {
  console.log('Getting lesson with ID:', lessonId);
  const lesson = mockData.lessons.find(l => l.id === lessonId);
  console.log('Found lesson:', JSON.stringify(lesson));
  return lesson;
};

export const getCourse = (courseId: string): Course | undefined => {
  console.log('Getting course with ID:', courseId);
  for (const lesson of mockData.lessons) {
    const course = lesson.courses.find(c => c.id === courseId);
    if (course) {
      console.log('Found course:', JSON.stringify(course));
      return course;
    }
  }
  console.log('Course not found');
  return undefined;
};

export const getPhrase = (courseId: string, phraseId: string): Phrase | undefined => {
  const course = getCourse(courseId);
  console.log('Getting phrase with ID:', phraseId);
  const phrase = course?.phrases.find(phrase => phrase.id === phraseId);
  console.log('Found phrase:', phrase);
  return phrase;
};

export const getQuizQuestion = (courseId: string, questionId: string): QuizQuestion | undefined => {
  const course = getCourse(courseId);
  console.log('Getting quiz question with ID:', questionId);
  const question = course?.quizQuestions.find(question => question.id === questionId);
  console.log('Found quiz question:', question);
  return question;
};

export const getLessonForCourse = (courseId: string): Lesson | undefined => {
  console.log('Getting lesson for course with ID:', courseId);
  const lesson = mockData.lessons.find(lesson => 
    lesson.courses.some(course => course.id === courseId)
  );
  console.log('Found lesson:', lesson);
  return lesson;
};

export const getNextPhrase = (courseId: string, currentPhraseId: string): Phrase | undefined => {
  const course = getCourse(courseId);
  if (!course) return undefined;

  console.log('Getting next phrase for course with ID:', courseId);
  const currentIndex = course.phrases.findIndex(phrase => phrase.id === currentPhraseId);
  if (currentIndex === -1 || currentIndex === course.phrases.length - 1) return undefined;

  const nextPhrase = course.phrases[currentIndex + 1];
  console.log('Found next phrase:', nextPhrase);
  return nextPhrase;
};

export const getNextQuizQuestion = (courseId: string, currentQuestionId: string): QuizQuestion | undefined => {
  const course = getCourse(courseId);
  if (!course) return undefined;

  console.log('Getting next quiz question for course with ID:', courseId);
  const currentIndex = course.quizQuestions.findIndex(question => question.id === currentQuestionId);
  if (currentIndex === -1 || currentIndex === course.quizQuestions.length - 1) return undefined;

  const nextQuestion = course.quizQuestions[currentIndex + 1];
  console.log('Found next quiz question:', nextQuestion);
  return nextQuestion;
};

export const getPhraseCount = (courseId: string): number => {
  const course = getCourse(courseId);
  console.log('Getting phrase count for course with ID:', courseId);
  const count = course?.phrases.length ?? 0;
  console.log('Found phrase count:', count);
  return count;
};

export const getQuizQuestionCount = (courseId: string): number => {
  const course = getCourse(courseId);
  console.log('Getting quiz question count for course with ID:', courseId);
  const count = course?.quizQuestions.length ?? 0;
  console.log('Found quiz question count:', count);
  return count;
};

export const getContent = (): Content => {
  console.log('Returning content:', JSON.stringify(mockData));
  return mockData;
};
