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
    
    // 共通項目のキー
    'common.level': 'Level',
    'common.estimatedTime': 'Estimated Time',
    'common.category': 'Category',
    'common.phrases': 'Phrases',
    'common.quizzes': 'Quizzes',
    'common.completed': 'Completed',
    
    // レッスン詳細画面のキー
    'lessonDetail.availableCourses': 'Available Courses',
    'lessonDetail.notFound': 'Lesson Not Found',
    'lessonDetail.notFoundMessage': 'The requested lesson could not be found.',
    
    // コース詳細画面のキー
    'courseDetail.progress': 'Your Progress',
    'courseDetail.learningProgress': 'Learning',
    'courseDetail.quizProgress': 'Quizzes',
    'courseDetail.quizHistory': 'Quiz History',
    'courseDetail.startLearning': 'Start Learning',
    'courseDetail.takeQuiz': 'Take Quiz',
    'courseDetail.noHistory': 'No completed quiz history available yet.',
    'courseDetail.viewAllHistory': 'View All History',
    'courseDetail.notFound': 'Course Not Found',
    'courseDetail.notFoundMessage': 'The requested course could not be found.',
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
    
    // 共通項目のキー
    'common.level': 'レベル',
    'common.estimatedTime': '推定時間',
    'common.category': 'カテゴリー',
    'common.phrases': 'フレーズ',
    'common.quizzes': 'クイズ',
    'common.completed': '完了',
    
    // レッスン詳細画面のキー
    'lessonDetail.availableCourses': '利用可能なコース',
    'lessonDetail.notFound': 'レッスンが見つかりません',
    'lessonDetail.notFoundMessage': '要求されたレッスンが見つかりませんでした。',
    
    // コース詳細画面のキー
    'courseDetail.progress': '進捗状況',
    'courseDetail.learningProgress': '学習',
    'courseDetail.quizProgress': 'クイズ',
    'courseDetail.quizHistory': 'クイズ履歴',
    'courseDetail.startLearning': '学習を開始',
    'courseDetail.takeQuiz': 'クイズを受ける',
    'courseDetail.noHistory': 'クイズ履歴はありません。',
    'courseDetail.viewAllHistory': 'すべての履歴を表示',
    'courseDetail.notFound': 'コースが見つかりません',
    'courseDetail.notFoundMessage': '要求されたコースが見つかりませんでした。',
  },
  'zh': {
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
    japanese: '日语',
    english: '英语',
    quickMenu: '快速菜单',
    speedQuiz: '速度测验',
    randomQuizDescription: '来自所有课程的随机问题',
    lessonList: '课程列表',
    courseList: '课程系列',
    lessonDetail: '课程详情',
    courseDetail: '课程系列详情',
    quizMode: '测验模式',
    learningMode: '学习模式',
    quizResult: '测验结果',
    loading: '加载中...',
    noLessonsFound: '未找到课程',
    noCoursesFound: '未找到课程系列',
    level: '等级',
    estimatedTime: '预计时间',
    category: '类别',
    progress: '进度',
    totalCourses: '课程总数',
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
    today: '今天',
    yesterday: '昨天',
    tomorrow: '明天',
    now: '现在',
    later: '稍后',
    soon: '很快',
    justNow: '刚刚',
    aMinuteAgo: '1分钟前',
    minutesAgo: '几分钟前',
    anHourAgo: '1小时前',
    hoursAgo: '几小时前',
    aDayAgo: '1天前',
    daysAgo: '几天前',
    aWeekAgo: '1周前',
    weeksAgo: '几周前',
    aMonthAgo: '1个月前',
    monthsAgo: '几个月前',
    aYearAgo: '1年前',
    yearsAgo: '几年前',
    longTimeAgo: '很久以前',
    inAMinute: '1分钟后',
    inMinutes: '几分钟后',
    inAnHour: '1小时后',
    inHours: '几小时后',
    inADay: '1天后',
    inDays: '几天后',
    inAWeek: '1周后',
    inWeeks: '几周后',
    inAMonth: '1个月后',
    inMonths: '几个月后',
    inAYear: '1年后',
    inYears: '几年后',
    longTimeFromNow: '很久以后',
    
    // 共通項目のキー
    'common.level': '等级',
    'common.estimatedTime': '预计时间',
    'common.category': '类别',
    'common.phrases': '短语',
    'common.quizzes': '测验',
    'common.completed': '完成',
    
    // レッスン詳細画面のキー
    'lessonDetail.availableCourses': '可用课程',
    'lessonDetail.notFound': '课程未找到',
    'lessonDetail.notFoundMessage': '未找到所请求的课程。',
    
    // コース詳細画面のキー
    'courseDetail.progress': '您的进度',
    'courseDetail.learningProgress': '学习',
    'courseDetail.quizProgress': '测验',
    'courseDetail.quizHistory': '测验历史',
    'courseDetail.startLearning': '开始学习',
    'courseDetail.takeQuiz': '参加测验',
    'courseDetail.noHistory': '没有完成的测验历史。',
    'courseDetail.viewAllHistory': '查看所有历史',
    'courseDetail.notFound': '课程未找到',
    'courseDetail.notFoundMessage': '未找到所请求的课程。',
  },
  'ko': {
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
    japanese: '일본어',
    english: '영어',
    quickMenu: '빠른 메뉴',
    speedQuiz: '스피드 퀴즈',
    randomQuizDescription: '모든 레슨에서 무작위 질문',
    lessonList: '레슨 목록',
    courseList: '코스 목록',
    lessonDetail: '레슨 상세',
    courseDetail: '코스 상세',
    quizMode: '퀴즈 모드',
    learningMode: '학습 모드',
    quizResult: '퀴즈 결과',
    loading: '로딩 중...',
    noLessonsFound: '레슨을 찾을 수 없습니다',
    noCoursesFound: '코스를 찾을 수 없습니다',
    level: '레벨',
    estimatedTime: '예상 시간',
    category: '카테고리',
    progress: '진행 상황',
    totalCourses: '총 코스 수',
    startLearning: '학습 시작',
    startQuiz: '퀴즈 시작',
    courseProgress: '코스 진행 상황',
    phraseProgress: '문구 진행 상황',
    quizProgress: '퀴즈 진행 상황',
    recordAudio: '오디오 녹음',
    playAudio: '오디오 재생',
    answer: '답변',
    showResult: '결과 보기',
    exitSession: '세션 종료',
    tryAgain: '다시 시도',
    congratulations: '축하합니다!',
    goodJob: '잘 하셨습니다!',
    needMorePractice: '더 많은 연습이 필요합니다',
    examples: '예제',
    pronunciation: '발음',
    explanation: '설명',
    quizHistory: '퀴즈 기록',
    historyDetail: '기록 상세',
    score: '점수',
    date: '날짜',
    noHistory: '기록이 없습니다',
    questionNumber: '질문',
    today: '오늘',
    yesterday: '어제',
    tomorrow: '내일',
    now: '지금',
    later: '나중에',
    soon: '곧',
    justNow: '방금',
    aMinuteAgo: '1분 전',
    minutesAgo: '몇 분 전',
    anHourAgo: '1시간 전',
    hoursAgo: '몇 시간 전',
    aDayAgo: '1일 전',
    daysAgo: '며칠 전',
    aWeekAgo: '1주일 전',
    weeksAgo: '몇 주 전',
    aMonthAgo: '1개월 전',
    monthsAgo: '몇 개월 전',
    aYearAgo: '1년 전',
    yearsAgo: '몇 년 전',
    longTimeAgo: '오래 전',
    inAMinute: '1분 후',
    inMinutes: '몇 분 후',
    inAnHour: '1시간 후',
    inHours: '몇 시간 후',
    inADay: '1일 후',
    inDays: '며칠 후',
    inAWeek: '1주일 후',
    inWeeks: '몇 주 후',
    inAMonth: '1개월 후',
    inMonths: '몇 개월 후',
    inAYear: '1년 후',
    inYears: '몇 년 후',
    longTimeFromNow: '오랜 시간 후',
    
    // 共通項目のキー
    'common.level': '레벨',
    'common.estimatedTime': '예상 시간',
    'common.category': '카테고리',
    'common.phrases': '문구',
    'common.quizzes': '퀴즈',
    'common.completed': '완료',
    
    // レッスン詳細画面のキー
    'lessonDetail.availableCourses': '사용 가능한 코스',
    'lessonDetail.notFound': '레슨을 찾을 수 없습니다',
    'lessonDetail.notFoundMessage': '요청된 레슨을 찾을 수 없습니다.',
    
    // コース詳細画面のキー
    'courseDetail.progress': '진행 상황',
    'courseDetail.learningProgress': '학습',
    'courseDetail.quizProgress': '퀴즈',
    'courseDetail.quizHistory': '퀴즈 기록',
    'courseDetail.startLearning': '학습 시작',
    'courseDetail.takeQuiz': '퀴즈 시작',
    'courseDetail.noHistory': '완료된 퀴즈 기록이 없습니다.',
    'courseDetail.viewAllHistory': '모든 기록 보기',
    'courseDetail.notFound': '코스를 찾을 수 없습니다',
    'courseDetail.notFoundMessage': '요청된 코스를 찾을 수 없습니다.',
  },
  'es': {
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
    japanese: 'Japonés',
    english: 'Inglés',
    quickMenu: 'Menú Rápido',
    speedQuiz: 'Quiz Rápido',
    randomQuizDescription: 'Preguntas aleatorias de todas las lecciones',
    lessonList: 'Lista de Lecciones',
    courseList: 'Lista de Cursos',
    lessonDetail: 'Detalles de la Lección',
    courseDetail: 'Detalles del Curso',
    quizMode: 'Modo Quiz',
    learningMode: 'Modo Aprendizaje',
    quizResult: 'Resultados del Quiz',
    loading: 'Cargando...',
    noLessonsFound: 'No se encontraron lecciones',
    noCoursesFound: 'No se encontraron cursos',
    level: 'Nivel',
    estimatedTime: 'Tiempo Estimado',
    category: 'Categoría',
    progress: 'Progreso',
    totalCourses: 'Total de Cursos',
    startLearning: 'Comenzar a Aprender',
    startQuiz: 'Comenzar Quiz',
    courseProgress: 'Progreso del Curso',
    phraseProgress: 'Progreso de Frases',
    quizProgress: 'Progreso del Quiz',
    recordAudio: 'Grabar Audio',
    playAudio: 'Reproducir Audio',
    answer: 'Respuesta',
    showResult: 'Mostrar Resultado',
    exitSession: 'Salir de la Sesión',
    tryAgain: 'Intentar de Nuevo',
    congratulations: '¡Felicitaciones!',
    goodJob: '¡Buen Trabajo!',
    needMorePractice: 'Necesita Más Práctica',
    examples: 'Ejemplos',
    pronunciation: 'Pronunciación',
    explanation: 'Explicación',
    quizHistory: 'Historial de Quiz',
    historyDetail: 'Detalle del Historial',
    score: 'Puntuación',
    date: 'Fecha',
    noHistory: 'Sin Historial',
    questionNumber: 'Pregunta',
    today: 'Hoy',
    yesterday: 'Ayer',
    tomorrow: 'Mañana',
    now: 'Ahora',
    later: 'Más tarde',
    soon: 'Pronto',
    justNow: 'Justo ahora',
    aMinuteAgo: 'Hace un minuto',
    minutesAgo: 'Hace minutos',
    anHourAgo: 'Hace una hora',
    hoursAgo: 'Hace horas',
    aDayAgo: 'Hace un día',
    daysAgo: 'Hace días',
    aWeekAgo: 'Hace una semana',
    weeksAgo: 'Hace semanas',
    aMonthAgo: 'Hace un mes',
    monthsAgo: 'Hace meses',
    aYearAgo: 'Hace un año',
    yearsAgo: 'Hace años',
    longTimeAgo: 'Hace mucho tiempo',
    inAMinute: 'En un minuto',
    inMinutes: 'En minutos',
    inAnHour: 'En una hora',
    inHours: 'En horas',
    inADay: 'En un día',
    inDays: 'En días',
    inAWeek: 'En una semana',
    inWeeks: 'En semanas',
    inAMonth: 'En un mes',
    inMonths: 'En meses',
    inAYear: 'En un año',
    inYears: 'En años',
    longTimeFromNow: 'En mucho tiempo',
    
    // 共通項目のキー
    'common.level': 'Nivel',
    'common.estimatedTime': 'Tiempo Estimado',
    'common.category': 'Categoría',
    'common.phrases': 'Frases',
    'common.quizzes': 'Quizzes',
    'common.completed': 'Completado',
    
    // レッスン詳細画面のキー
    'lessonDetail.availableCourses': 'Cursos Disponibles',
    'lessonDetail.notFound': 'Lección No Encontrada',
    'lessonDetail.notFoundMessage': 'No se encontró la lección solicitada.',
    
    // コース詳細画面のキー
    'courseDetail.progress': 'Tu Progreso',
    'courseDetail.learningProgress': 'Aprendizaje',
    'courseDetail.quizProgress': 'Quizzes',
    'courseDetail.quizHistory': 'Historial de Quizzes',
    'courseDetail.startLearning': 'Comenzar a Aprender',
    'courseDetail.takeQuiz': 'Tomar Quiz',
    'courseDetail.noHistory': 'No hay historial de quizzes completados.',
    'courseDetail.viewAllHistory': 'Ver Todo el Historial',
    'courseDetail.notFound': 'Curso No Encontrado',
    'courseDetail.notFoundMessage': 'No se encontró el curso solicitado.',
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
export async function loadTranslations(language: LanguageCode): Promise<TranslationsMap> {
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