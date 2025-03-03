/**
 * 多言語対応（i18n）の統合モジュール
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';

/** サポートされる言語コード（ISO 639-1） */
export type LanguageCode = 'en' | 'ja' | 'zh' | 'ko' | 'es';

/** ストレージキー */
export const LANGUAGE_STORAGE_KEY = 'user_language';

/** デフォルト言語 */
export const DEFAULT_LANGUAGE: LanguageCode = 'en';

/** 言語情報 */
export interface LanguageInfo {
  code: LanguageCode;
  name: string;       // 英語での言語名
  nativeName: string; // その言語での言語名
  rtl: boolean;       // 右から左の言語かどうか
}

/** サポートされている言語情報 */
export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
];

/** 翻訳データの型定義 */
export type TranslationsMap = Record<string, string>;

/** 全言語の翻訳データ */
const translations: Record<LanguageCode, TranslationsMap> = {
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
    correctAnswers: 'Correct Answers',
    incorrectAnswers: 'Incorrect Answers',
    reviewAnswers: 'Review Answers',
    returnToMenu: 'Return to Menu',
    retakeQuiz: 'Retake Quiz',
    continueLesson: 'Continue Lesson',
    meaning: 'Meaning',
    notes: 'Notes',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    minutes: 'minutes',
    seconds: 'seconds',
    completed: 'Completed',
    inProgress: 'In Progress',
    notStarted: 'Not Started',
    retry: 'Retry',
    skip: 'Skip',
    continue: 'Continue',
    finish: 'Finish',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    ascending: 'Ascending',
    descending: 'Descending',
    name: 'Name',
    type: 'Type',
    status: 'Status',
    actions: 'Actions',
    details: 'Details',
    summary: 'Summary',
    overview: 'Overview',
    history: 'History',
    statistics: 'Statistics',
    performance: 'Performance',
    accuracy: 'Accuracy',
    speed: 'Speed',
    time: 'Time',
    total: 'Total',
    average: 'Average',
    best: 'Best',
    worst: 'Worst',
    current: 'Current',
    previous: 'Previous',
    nextItem: 'Next',
    first: 'First',
    last: 'Last',
    none: 'None',
    all: 'All',
    some: 'Some',
    more: 'More',
    less: 'Less',
    show: 'Show',
    hide: 'Hide',
    expand: 'Expand',
    collapse: 'Collapse',
    enable: 'Enable',
    disable: 'Disable',
    on: 'On',
    off: 'Off',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    done: 'Done',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    success: 'Success',
    failure: 'Failure',
    unknown: 'Unknown',
    notAvailable: 'Not Available',
    comingSoon: 'Coming Soon',
    beta: 'Beta',
    experimental: 'Experimental',
    deprecated: 'Deprecated',
    new: 'New',
    updated: 'Updated',
    version: 'Version',
    build: 'Build',
    release: 'Release',
    development: 'Development',
    production: 'Production',
    testing: 'Testing',
    staging: 'Staging',
    local: 'Local',
    remote: 'Remote',
    online: 'Online',
    offline: 'Offline',
    connected: 'Connected',
    disconnected: 'Disconnected',
    synchronizing: 'Synchronizing',
    synced: 'Synced',
    notSynced: 'Not Synced',
    lastSynced: 'Last Synced',
    never: 'Never',
    always: 'Always',
    sometimes: 'Sometimes',
    rarely: 'Rarely',
    frequently: 'Frequently',
    occasionally: 'Occasionally',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    now: 'Now',
    later: 'Later',
    soon: 'Soon',
    justNow: 'Just Now',
    aMinuteAgo: 'A Minute Ago',
    minutesAgo: 'Minutes Ago',
    anHourAgo: 'An Hour Ago',
    hoursAgo: 'Hours Ago',
    aDayAgo: 'A Day Ago',
    daysAgo: 'Days Ago',
    aWeekAgo: 'A Week Ago',
    weeksAgo: 'Weeks Ago',
    aMonthAgo: 'A Month Ago',
    monthsAgo: 'Months Ago',
    aYearAgo: 'A Year Ago',
    yearsAgo: 'Years Ago',
    longTimeAgo: 'Long Time Ago',
    inAMinute: 'In a Minute',
    inMinutes: 'In Minutes',
    inAnHour: 'In an Hour',
    inHours: 'In Hours',
    inADay: 'In a Day',
    inDays: 'In Days',
    inAWeek: 'In a Week',
    inWeeks: 'In Weeks',
    inAMonth: 'In a Month',
    inMonths: 'In Months',
    inAYear: 'In a Year',
    inYears: 'In Years',
    longTimeFromNow: 'Long Time From Now',
  },
  'ja': {
    appTitle: '日本語学習アプリ',
    lessons: 'レッスン',
    settings: '設定',
    language: '言語',
    start: 'スタート',
    next: '次へ',
    back: '戻る',
    correct: '正解！',
    incorrect: '不正解',
    submit: '送信',
    selectLanguage: '言語を選択',
    quickMenu: 'クイックメニュー',
    speedQuiz: 'スピードクイズ',
    randomQuizDescription: '全レッスンからランダムな問題',
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
    estimatedTime: '推定時間',
    category: 'カテゴリー',
    progress: '進捗',
    totalCourses: '合計コース数',
    startLearning: '学習を始める',
    startQuiz: 'クイズを始める',
    courseProgress: 'コース進捗',
    phraseProgress: 'フレーズ進捗',
    quizProgress: 'クイズ進捗',
    recordAudio: '音声を録音',
    playAudio: '音声を再生',
    answer: '回答',
    showResult: '結果を表示',
    exitSession: 'セッションを終了',
    tryAgain: 'もう一度',
    congratulations: 'おめでとうございます！',
    goodJob: 'よくできました！',
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
    correctAnswers: '正解数',
    incorrectAnswers: '不正解数',
    reviewAnswers: '回答を確認',
    returnToMenu: 'メニューに戻る',
    retakeQuiz: 'クイズをやり直す',
    continueLesson: 'レッスンを続ける',
    meaning: '意味',
    notes: 'メモ',
    beginner: '初級',
    intermediate: '中級',
    advanced: '上級',
    minutes: '分',
    seconds: '秒',
    completed: '完了',
    inProgress: '進行中',
    notStarted: '未開始',
    retry: 'リトライ',
    skip: 'スキップ',
    continue: '続ける',
    finish: '終了',
    cancel: 'キャンセル',
    confirm: '確認',
    save: '保存',
    delete: '削除',
    edit: '編集',
    add: '追加',
    remove: '削除',
    search: '検索',
    filter: 'フィルター',
    sort: '並べ替え',
    ascending: '昇順',
    descending: '降順',
    name: '名前',
    type: 'タイプ',
    status: 'ステータス',
    actions: 'アクション',
    details: '詳細',
    summary: '概要',
    overview: '概観',
    history: '履歴',
    statistics: '統計',
    performance: 'パフォーマンス',
    accuracy: '正確さ',
    speed: 'スピード',
    time: '時間',
    total: '合計',
    average: '平均',
    best: '最高',
    worst: '最低',
    current: '現在',
    previous: '前回',
    nextItem: '次へ',
    first: '最初',
    last: '最後',
    none: 'なし',
    all: 'すべて',
    some: '一部',
    more: 'もっと',
    less: '少なく',
    show: '表示',
    hide: '非表示',
    expand: '展開',
    collapse: '折りたたむ',
    enable: '有効化',
    disable: '無効化',
    on: 'オン',
    off: 'オフ',
    yes: 'はい',
    no: 'いいえ',
    ok: 'OK',
    done: '完了',
    error: 'エラー',
    warning: '警告',
    info: '情報',
    success: '成功',
    failure: '失敗',
    unknown: '不明',
    notAvailable: '利用不可',
    comingSoon: '近日公開',
    beta: 'ベータ版',
    experimental: '実験的',
    deprecated: '非推奨',
    new: '新規',
    updated: '更新済み',
    version: 'バージョン',
    build: 'ビルド',
    release: 'リリース',
    development: '開発',
    production: '本番',
    testing: 'テスト',
    staging: 'ステージング',
    local: 'ローカル',
    remote: 'リモート',
    online: 'オンライン',
    offline: 'オフライン',
    connected: '接続済み',
    disconnected: '切断済み',
    synchronizing: '同期中',
    synced: '同期済み',
    notSynced: '未同期',
    lastSynced: '最終同期',
    never: '一度もない',
    always: '常に',
    sometimes: '時々',
    rarely: 'めったにない',
    frequently: '頻繁に',
    occasionally: '時々',
    daily: '毎日',
    weekly: '毎週',
    monthly: '毎月',
    yearly: '毎年',
    today: '今日',
    yesterday: '昨日',
    tomorrow: '明日',
    now: '今',
    later: '後で',
    soon: 'すぐに',
    justNow: 'たった今',
    aMinuteAgo: '1分前',
    minutesAgo: '数分前',
    anHourAgo: '1時間前',
    hoursAgo: '数時間前',
    aDayAgo: '1日前',
    daysAgo: '数日前',
    aWeekAgo: '1週間前',
    weeksAgo: '数週間前',
    aMonthAgo: '1ヶ月前',
    monthsAgo: '数ヶ月前',
    aYearAgo: '1年前',
    yearsAgo: '数年前',
    longTimeAgo: '昔',
    inAMinute: '1分後',
    inMinutes: '数分後',
    inAnHour: '1時間後',
    inHours: '数時間後',
    inADay: '1日後',
    inDays: '数日後',
    inAWeek: '1週間後',
    inWeeks: '数週間後',
    inAMonth: '1ヶ月後',
    inMonths: '数ヶ月後',
    inAYear: '1年後',
    inYears: '数年後',
    longTimeFromNow: 'ずっと後',
  },
  'zh': {
    // 中国語の翻訳データ
    appTitle: '日语学习应用',
    lessons: '课程',
    settings: '设置',
    language: '语言',
    start: '开始',
    next: '下一步',
    back: '返回',
    correct: '正确！',
    incorrect: '不正确',
    submit: '提交',
    selectLanguage: '选择语言',
    // 他の翻訳エントリー
  },
  'ko': {
    // 韓国語の翻訳データ
    appTitle: '일본어 학습 앱',
    lessons: '레슨',
    settings: '설정',
    language: '언어',
    start: '시작',
    next: '다음',
    back: '뒤로',
    correct: '정답!',
    incorrect: '오답',
    submit: '제출',
    selectLanguage: '언어 선택',
    // 他の翻訳エントリー
  },
  'es': {
    // スペイン語の翻訳データ
    appTitle: 'Aplicación de Aprendizaje de Japonés',
    lessons: 'Lecciones',
    settings: 'Configuración',
    language: 'Idioma',
    start: 'Comenzar',
    next: 'Siguiente',
    back: 'Atrás',
    correct: '¡Correcto!',
    incorrect: 'Incorrecto',
    submit: 'Enviar',
    selectLanguage: 'Seleccionar Idioma',
    // 他の翻訳エントリー
  }
};

/**
 * デバイスのロケールから最適な言語を判定
 * @returns サポートされている言語コード
 */
export const getDeviceLanguage = (): LanguageCode => {
  const deviceLocale = Localization.locale.split('-')[0];
  
  // サポートされている言語かどうかをチェック
  const isSupported = LANGUAGES.some(lang => lang.code === deviceLocale);
  if (isSupported) {
    return deviceLocale as LanguageCode;
  }
  
  return DEFAULT_LANGUAGE;
};

/**
 * 言語コードから言語情報を取得
 * @param code 言語コード
 * @returns 言語情報
 */
export const getLanguageInfo = (code: LanguageCode): LanguageInfo => {
  const language = LANGUAGES.find(lang => lang.code === code);
  if (!language) {
    return LANGUAGES.find(lang => lang.code === DEFAULT_LANGUAGE)!;
  }
  return language;
};

/**
 * RTL設定を適用
 * @param languageCode 言語コード
 */
export const applyRTL = (languageCode: LanguageCode): void => {
  const isRTL = getLanguageInfo(languageCode).rtl;
  
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
  }
};

/**
 * AsyncStorage から言語設定を取得
 * @returns 保存されている言語コード、またはデバイスのデフォルト言語
 */
export const getStoredLanguage = async (): Promise<LanguageCode> => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && LANGUAGES.some(lang => lang.code === storedLanguage)) {
      return storedLanguage as LanguageCode;
    }
  } catch (error) {
    console.error('Failed to get stored language:', error);
  }
  
  // 保存された言語がなければデバイスのロケールを使用
  return getDeviceLanguage();
};

/**
 * AsyncStorage に言語設定を保存
 * @param languageCode 言語コード
 */
export const storeLanguage = async (languageCode: LanguageCode): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  } catch (error) {
    console.error('Failed to store language:', error);
  }
};

/**
 * 翻訳データを読み込み
 * @param language 言語コード
 * @returns 翻訳データ
 */
export function loadTranslations(language: LanguageCode): TranslationsMap {
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

/**
 * パラメータ付き翻訳のフォーマット
 * @param text 元のテキスト
 * @param params 置換パラメータ
 * @returns フォーマット済みテキスト
 */
export function formatTranslation(
  text: string,
  params?: Record<string, string | number>
): string {
  if (!params) return text;
  
  return Object.entries(params).reduce(
    (formatted, [key, value]) => 
      formatted.replace(new RegExp(`{{${key}}}`, 'g'), String(value)),
    text
  );
} 