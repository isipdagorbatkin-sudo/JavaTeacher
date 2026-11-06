export type QuizQuestion = {
  question: string
  options: string[]
  correct: number
}

export type Lesson = {
  id: number
  title: string
  description: string
  duration: string
  icon: string
  theory: string[]
  code: string
  quiz: QuizQuestion[]
  task: string
  hint: string
  solution: string
}

export type Progress = {
  lesson_id: number
  completed: boolean
  quiz_score: number
  task_answer: string
}
