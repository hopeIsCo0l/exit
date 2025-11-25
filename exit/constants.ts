import { Department } from './types';

export const YEARS = ['2023', '2024', '2025'];

// Specific logic for available exams based on the "2.5 years" requirement
// 2023 (I & II), 2024 (I & II), 2025 (I)
export const AVAILABLE_EXAMS = [
  { year: '2025', session: 'Session I (Jan/Feb)' },
  { year: '2024', session: 'Session II (June/July)' },
  { year: '2024', session: 'Session I (Jan/Feb)' },
  { year: '2023', session: 'Session II (June/July)' },
  { year: '2023', session: 'Session I (Jan/Feb)' },
];

export const DEPARTMENTS: Department[] = [
  { id: 'cs', name: 'Computer Science', icon: '💻', category: 'Engineering' },
  { id: 'se', name: 'Software Engineering', icon: '⚙️', category: 'Engineering' },
  { id: 'civil', name: 'Civil Engineering', icon: '🏗️', category: 'Engineering' },
  { id: 'med', name: 'Medicine', icon: '🩺', category: 'Health' },
  { id: 'pharm', name: 'Pharmacy', icon: '💊', category: 'Health' },
  { id: 'nurse', name: 'Nursing', icon: '🏥', category: 'Health' },
  { id: 'acct', name: 'Accounting & Finance', icon: '📊', category: 'Business' },
  { id: 'mgmt', name: 'Management', icon: '👔', category: 'Business' },
  { id: 'econ', name: 'Economics', icon: '📈', category: 'Business' },
  { id: 'law', name: 'Law', icon: '⚖️', category: 'Social' },
  { id: 'psych', name: 'Psychology', icon: '🧠', category: 'Social' },
];

export const CATEGORIES = ['All', 'Engineering', 'Health', 'Business', 'Social'];