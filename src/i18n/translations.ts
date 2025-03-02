// src/i18n/translations.ts
// 翻訳ファイルの管理と読み込みを担当

import { LanguageCode } from './index';

// 基本的な翻訳テンプレート
// 実際のプロダクションでは外部ファイルから読み込むべきですが
// ここではシンプルにするために直接定義します
const translations: Record<LanguageCode, Record<string, string>> = {
  'en': {
    appTitle: 'Japanese Learning App',
    lessons: 'Lessons',
    settings: 'Settings',
    language: 'Language',
    start: 'Start',
    next: 'Next',
    back: 'Back',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    submit: 'Submit',
    selectLanguage: 'Select Language',
    quickMenu: 'Quick Menu',
    speedQuiz: 'Speed Quiz',
    randomQuizDescription: 'Random questions from all lessons',
    lessonList: 'Lessons',
    courseList: 'Courses',
    lessonDetail: 'Lesson Details',
    courseDetail: 'Course Details',
    quizMode: 'Quiz Mode',
    learningMode: 'Learning Mode',
    quizResult: 'Quiz Results',
    loading: 'Loading...',
    noLessonsFound: 'No lessons found',
    noCoursesFound: 'No courses found',
    level: 'Level',
    estimatedTime: 'Estimated Time',
    category: 'Category',
    progress: 'Progress',
    totalCourses: 'Total Courses',
    startLearning: 'Start Learning',
    startQuiz: 'Start Quiz',
    courseProgress: 'Course Progress',
    phraseProgress: 'Phrase Progress',
    quizProgress: 'Quiz Progress',
    recordAudio: 'Record Audio',
    playAudio: 'Play Audio',
    answer: 'Answer',
    showResult: 'Show Result',
    exitSession: 'Exit Session',
    tryAgain: 'Try Again',
    congratulations: 'Congratulations!',
    goodJob: 'Good Job!',
    needMorePractice: 'Need More Practice',
    examples: 'Examples',
    pronunciation: 'Pronunciation',
    explanation: 'Explanation',
    quizHistory: 'Quiz History',
    historyDetail: 'History Detail',
    score: 'Score',
    date: 'Date',
    noHistory: 'No History',
    questionNumber: 'Question',

    // レッスン翻訳
    'lesson_greetings': 'Greetings',
    'lesson_greetings_description': 'Basic greeting expressions for N5 level',
    'lesson_business': 'Business Manners',
    'lesson_business_description': 'Honorific expressions and interactions for N4 level',
    'lesson_restaurant': 'Restaurant',
    'lesson_restaurant_description': 'Learn basic expressions used in restaurants and deepen your understanding with quizzes',
    
    // コース翻訳
    'course_greetings_new': 'Greetings (Redesigned)',
    'course_greetings_new_description': 'Learn basic greetings and confirm their meanings with quizzes',
    'course_business_new': 'Business Expressions (Redesigned)',
    'course_business_new_description': 'Honorific phrases and quizzes commonly used in the workplace',
    'course_restaurant_expressions': 'Restaurant Expressions',
    'course_restaurant_expressions_description': 'Learn phrases needed for conversations in restaurants and confirm with quizzes'
  },
  'ja': {
    appTitle: '日本語学習アプリ',
    lessons: 'レッスン',
    settings: '設定',
    language: '言語',
    start: '開始',
    next: '次へ',
    back: '戻る',
    correct: '正解です！',
    incorrect: '不正解です',
    submit: '回答',
    selectLanguage: '言語を選択',
    quickMenu: 'クイックメニュー',
    speedQuiz: 'スピードクイズ',
    randomQuizDescription: '全レッスンからランダム出題',
    lessonList: 'レッスン一覧',
    courseList: 'コース一覧',
    lessonDetail: 'レッスン詳細',
    courseDetail: 'コース詳細',
    quizMode: 'クイズモード',
    learningMode: '学習モード',
    quizResult: 'クイズ結果',
    loading: '読み込み中...',
    noLessonsFound: 'レッスンが見つかりません',
    noCoursesFound: 'コースが見つかりません',
    level: 'レベル',
    estimatedTime: '所要時間',
    category: 'カテゴリー',
    progress: '進捗',
    totalCourses: '合計コース数',
    startLearning: '学習を開始',
    startQuiz: 'クイズを開始',
    courseProgress: 'コース進捗',
    phraseProgress: 'フレーズ進捗',
    quizProgress: 'クイズ進捗',
    recordAudio: '音声を録音',
    playAudio: '音声を再生',
    answer: '回答する',
    showResult: '結果を見る',
    exitSession: 'セッションを終了',
    tryAgain: 'もう一度挑戦',
    congratulations: 'おめでとうございます！',
    goodJob: 'よく頑張りました！',
    needMorePractice: 'もう少し練習しましょう',
    examples: '例文',
    pronunciation: '発音',
    explanation: '解説',
    quizHistory: 'クイズ履歴',
    historyDetail: '履歴詳細',
    score: 'スコア',
    date: '日付',
    noHistory: '履歴がありません',
    questionNumber: '問題',

    // レッスン翻訳 - 日本語の場合はオリジナルのまま使用
    'lesson_greetings': '挨拶',
    'lesson_greetings_description': 'N5レベルの基本的な挨拶表現',
    'lesson_business': 'ビジネスマナー',
    'lesson_business_description': 'N4レベルの敬語表現とやり取り',
    'lesson_restaurant': 'レストラン',
    'lesson_restaurant_description': 'レストランで使う基本表現を学び、クイズで理解を深めます',
    
    // コース翻訳 - 日本語の場合はオリジナルのまま使用
    'course_greetings_new': '挨拶（リニューアル）',
    'course_greetings_new_description': '基本的な挨拶を学び、クイズでその意味を確認します',
    'course_business_new': 'ビジネス表現（リニューアル）',
    'course_business_new_description': '職場でよく使われる敬語とクイズ',
    'course_restaurant_expressions': 'レストラン表現',
    'course_restaurant_expressions_description': 'レストランでの会話に必要なフレーズを学び、クイズで確認します'
  },
  'zh': {
    appTitle: '日语学习应用',
    lessons: '课程',
    settings: '设置',
    language: '语言',
    start: '开始',
    next: '下一个',
    back: '返回',
    correct: '正确！',
    incorrect: '不正确',
    submit: '提交',
    selectLanguage: '选择语言',
    quickMenu: '快速菜单',
    speedQuiz: '快速测验',
    randomQuizDescription: '来自所有课程的随机问题',
    lessonList: '课程列表',
    courseList: '学习路径',
    lessonDetail: '课程详情',
    courseDetail: '学习路径详情',
    quizMode: '测验模式',
    learningMode: '学习模式',
    quizResult: '测验结果',
    loading: '加载中...',
    noLessonsFound: '未找到课程',
    noCoursesFound: '未找到学习路径',
    level: '级别',
    estimatedTime: '预计时间',
    category: '类别',
    progress: '进度',
    totalCourses: '总课程数',
    startLearning: '开始学习',
    startQuiz: '开始测验',
    courseProgress: '课程进度',
    phraseProgress: '短语进度',
    quizProgress: '测验进度',
    recordAudio: '录制音频',
    playAudio: '播放音频',
    answer: '回答',
    showResult: '显示结果',
    exitSession: '退出会话',
    tryAgain: '再试一次',
    congratulations: '恭喜！',
    goodJob: '做得好！',
    needMorePractice: '需要更多练习',
    examples: '例子',
    pronunciation: '发音',
    explanation: '解释',
    quizHistory: '测验历史',
    historyDetail: '历史详情',
    score: '分数',
    date: '日期',
    noHistory: '没有历史记录',
    questionNumber: '问题',

    // レッスン翻訳
    'lesson_greetings': '问候',
    'lesson_greetings_description': 'N5级别的基本问候表达',
    'lesson_business': '商务礼仪',
    'lesson_business_description': 'N4级别的敬语表达和互动',
    'lesson_restaurant': '餐厅',
    'lesson_restaurant_description': '学习在餐厅中使用的基本表达，并通过测验加深理解',
    
    // コース翻訳
    'course_greetings_new': '问候（重新设计）',
    'course_greetings_new_description': '学习基本问候并通过测验确认其含义',
    'course_business_new': '商务表达（重新设计）',
    'course_business_new_description': '工作场所常用的敬语短语和测验',
    'course_restaurant_expressions': '餐厅表达',
    'course_restaurant_expressions_description': '学习在餐厅对话中需要的短语，并通过测验确认'
  }
};

// 翻訳を読み込む関数
export function loadTranslations(language: LanguageCode): Record<string, string> {
  try {
    // 翻訳がある場合はそれを使用
    if (translations[language]) {
      return translations[language];
    }
    
    // 翻訳がない場合はデフォルト言語（英語）の翻訳を使用
    console.warn(`No translations available for ${language}, falling back to English`);
    return translations['en'];
  } catch (error) {
    console.error('Failed to load translations:', error);
    // エラーが発生した場合は空のオブジェクトを返す
    return {};
  }
}

// パラメータ付き翻訳のヘルパー関数
export function formatTranslation(
  text: string,
  params?: Record<string, string | number>
): string {
  if (!params) return text;
  
  let formattedText = text;
  Object.entries(params).forEach(([key, value]) => {
    formattedText = formattedText.replace(
      new RegExp(`{{${key}}}`, 'g'), 
      String(value)
    );
  });
  
  return formattedText;
} 