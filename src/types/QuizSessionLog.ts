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
