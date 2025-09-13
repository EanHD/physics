export interface Module {
  id: string
  title: string
  summary: string
  estimated_minutes?: number
  prerequisites?: string[]
  resources?: string[]
  tags?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false' | 'short_answer'
  options?: string[]
  correct_answer?: string
  explanation?: string
}

export interface Quiz {
  questions: QuizQuestion[]
}

export interface ModuleContent {
  id: string
  content: string
  quiz?: Quiz | null
  resources?: Resource[]
}

export interface Resource {
  id: string
  name: string
  description: string
  link: string
  category: string
}

export interface ModuleState {
  status: 'not-started' | 'in-progress' | 'completed'
  last_accessed?: string
  score?: number | null
  attempts?: number
}

export interface UserProgress {
  user_id?: string | null
  completed_modules: string[]
  module_states: Record<string, ModuleState>
  study_streak?: number
  total_study_time?: number
  completion_percentage?: number
}

export interface ReviewItem {
  module_id: string
  next_review: string
  interval_days: number
  ease_factor?: number
}
