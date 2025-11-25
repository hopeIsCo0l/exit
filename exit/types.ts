export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  topic?: string;
}

export interface ExamConfig {
  department: string;
  year: string;
  session: string;
}

export interface ExamSession {
  questions: Question[];
  userAnswers: Record<number, number>; // questionId -> selectedOptionIndex
  isSubmitted: boolean;
  score: number;
  timeSpent: number; // in seconds
  timestamp: number; // Date exam was taken
}

export interface Department {
  id: string;
  name: string;
  icon: string;
  category: 'Engineering' | 'Health' | 'Social' | 'Natural' | 'Business';
}

export interface SavedExamState {
  config: ExamConfig;
  questions: Question[];
  userAnswers: Record<number, number>;
  timeLeft: number;
  currentIndex: number;
  flaggedQuestions: number[]; // Store as array for JSON serialization
  timestamp: number;
}

export interface ExamHistoryItem {
  id: string;
  departmentName: string;
  score: number;
  date: string;
  timeSpent: number;
  totalQuestions: number;
}