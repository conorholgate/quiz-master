interface Answer {
  phrasing: string
  isCorrect: boolean
}
export interface Question {
  question: string
  answers: Answer[]
}

interface AnswerSelectedPayload {
  question: Question
  answer: Answer
}
export interface EmitFunctions {
  answerSelected(payload: AnswerSelectedPayload): void
}

export interface UserAnswer {
  answer: Answer
  question: Question[]
}

export interface QuizResultsProps {
  label?: string
  questionsLength: number
  userAnswers: UserAnswer[]
  questions: Question[]
}
