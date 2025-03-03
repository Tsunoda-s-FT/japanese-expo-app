/**
 * 翻訳ファイルの管理と読み込みを担当
 */
import { LanguageCode } from './index';

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
    quizCompleted: 'Quiz Completed',
    yourScore: 'Your Score',
    correctAnswers: 'Correct Answers',
    incorrectAnswers: 'Incorrect Answers',
    reviewAnswers: 'Review Answers',
    returnToMenu: 'Return to Menu',
    retakeQuiz: 'Retake Quiz',
    continueLesson: 'Continue Lesson',
    pronunciation: 'Pronunciation',
    meaning: 'Meaning',
    examples: 'Examples',
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
    date: 'Date',
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
    score: 'Score',
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
    quizCompleted: 'クイズ完了',
    yourScore: 'あなたのスコア',
    correctAnswers: '正解数',
    incorrectAnswers: '不正解数',
    reviewAnswers: '回答を確認',
    returnToMenu: 'メニューに戻る',
    retakeQuiz: 'クイズをやり直す',
    continueLesson: 'レッスンを続ける',
    pronunciation: '発音',
    meaning: '意味',
    examples: '例文',
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
    date: '日付',
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
    score: 'スコア',
    total: '合計',
    average: '平均',
    best: '最高',
    worst: '最低',
    current: '現在',
    previous: '前',
    nextItem: '次',
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
    beta: 'ベータ',
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
    never: '決して',
    always: '常に',
    sometimes: '時々',
    rarely: 'まれに',
    frequently: '頻繁に',
    occasionally: '時折',
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
    longTimeFromNow: '遠い将来',
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
    quickMenu: '快速菜单',
    speedQuiz: '速度测验',
    randomQuizDescription: '来自所有课程的随机问题',
    lessonList: '课程列表',
    courseList: '课程列表',
    lessonDetail: '课程详情',
    courseDetail: '课程详情',
    quizMode: '测验模式',
    learningMode: '学习模式',
    quizResult: '测验结果',
    loading: '加载中...',
    noLessonsFound: '未找到课程',
    noCoursesFound: '未找到课程',
    level: '级别',
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
    quizCompleted: '测验完成',
    yourScore: '你的分数',
    correctAnswers: '正确答案',
    incorrectAnswers: '错误答案',
    reviewAnswers: '查看答案',
    returnToMenu: '返回菜单',
    retakeQuiz: '重新测验',
    continueLesson: '继续课程',
    pronunciation: '发音',
    meaning: '含义',
    examples: '例子',
    notes: '笔记',
    beginner: '初学者',
    intermediate: '中级',
    advanced: '高级',
    minutes: '分钟',
    seconds: '秒',
    completed: '已完成',
    inProgress: '进行中',
    notStarted: '未开始',
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
    phraseProgress: '구문 진행 상황',
    quizProgress: '퀴즈 진행 상황',
    recordAudio: '오디오 녹음',
    playAudio: '오디오 재생',
    answer: '답변',
    showResult: '결과 보기',
    exitSession: '세션 종료',
    tryAgain: '다시 시도',
    congratulations: '축하합니다!',
    quizCompleted: '퀴즈 완료',
    yourScore: '당신의 점수',
    correctAnswers: '정답',
    incorrectAnswers: '오답',
    reviewAnswers: '답변 검토',
    returnToMenu: '메뉴로 돌아가기',
    retakeQuiz: '퀴즈 다시 풀기',
    continueLesson: '레슨 계속하기',
    pronunciation: '발음',
    meaning: '의미',
    examples: '예시',
    notes: '노트',
    beginner: '초급',
    intermediate: '중급',
    advanced: '고급',
    minutes: '분',
    seconds: '초',
    completed: '완료됨',
    inProgress: '진행 중',
    notStarted: '시작되지 않음',
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
    quickMenu: 'Menú Rápido',
    speedQuiz: 'Cuestionario Rápido',
    randomQuizDescription: 'Preguntas aleatorias de todas las lecciones',
    lessonList: 'Lista de Lecciones',
    courseList: 'Lista de Cursos',
    lessonDetail: 'Detalles de la Lección',
    courseDetail: 'Detalles del Curso',
    quizMode: 'Modo Cuestionario',
    learningMode: 'Modo Aprendizaje',
    quizResult: 'Resultados del Cuestionario',
    loading: 'Cargando...',
    noLessonsFound: 'No se encontraron lecciones',
    noCoursesFound: 'No se encontraron cursos',
    level: 'Nivel',
    estimatedTime: 'Tiempo Estimado',
    category: 'Categoría',
    progress: 'Progreso',
    totalCourses: 'Total de Cursos',
    startLearning: 'Comenzar Aprendizaje',
    startQuiz: 'Comenzar Cuestionario',
    courseProgress: 'Progreso del Curso',
    phraseProgress: 'Progreso de Frases',
    quizProgress: 'Progreso del Cuestionario',
    recordAudio: 'Grabar Audio',
    playAudio: 'Reproducir Audio',
    answer: 'Respuesta',
    showResult: 'Mostrar Resultado',
    exitSession: 'Salir de la Sesión',
    tryAgain: 'Intentar de Nuevo',
    congratulations: '¡Felicitaciones!',
    quizCompleted: 'Cuestionario Completado',
    yourScore: 'Tu Puntuación',
    correctAnswers: 'Respuestas Correctas',
    incorrectAnswers: 'Respuestas Incorrectas',
    reviewAnswers: 'Revisar Respuestas',
    returnToMenu: 'Volver al Menú',
    retakeQuiz: 'Volver a Hacer el Cuestionario',
    continueLesson: 'Continuar Lección',
    pronunciation: 'Pronunciación',
    meaning: 'Significado',
    examples: 'Ejemplos',
    notes: 'Notas',
    beginner: 'Principiante',
    intermediate: 'Intermedio',
    advanced: 'Avanzado',
    minutes: 'minutos',
    seconds: 'segundos',
    completed: 'Completado',
    inProgress: 'En Progreso',
    notStarted: 'No Iniciado',
  }
};

/**
 * 指定された言語の翻訳データを取得する
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