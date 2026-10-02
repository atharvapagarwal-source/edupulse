export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  college?: string;
  course?: string;
  year?: string;
  avatar_url?: string;
}

export interface StudentProfile {
  user_id: string;
  cgpa: number;
  attendance_pct: number;
  assignment_completion_pct: number;
  average_score: number;
  skills: string[];
  interests: string[];
  career_goals: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  topic: string;
  deadline: string;
  max_marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  status: string;
  user_status?: 'Pending' | 'Submitted' | 'Graded' | 'Overdue';
  grade?: number | null;
  teacher_feedback?: string | null;
  ai_evaluation?: AIEvaluation | null;
}

export interface AIEvaluation {
  correctness_score: number;
  code_quality: string;
  complexity_analysis: string;
  missing_edge_cases: string[];
  ai_feedback: string;
  disclaimer: string;
}

export interface TopicPerformance {
  topic: string;
  score: number;
  status: 'Strong' | 'Good' | 'Moderate' | 'Weak';
}

export interface FeedbackItem {
  id: string;
  subject: string;
  teacher_name: string;
  category: string;
  comment: string;
  teaching_rating: number;
  difficulty_rating: number;
  pace_rating: number;
  material_rating: number;
  created_at: string;
}

export interface FeedbackAnalytics {
  teaching_quality: number;
  course_difficulty: number;
  study_material: number;
  teaching_pace: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  common_topics: string[];
  ai_summary: string;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: string;
  deadline: string;
  eligibility: string;
  required_skills: string;
  location: string;
  description: string;
  match_score?: number;
  matched_skills?: string[];
  recommendation_reason?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  is_read: number;
  created_at: string;
}

export interface StudyPlanDay {
  day: string;
  focus_area: string;
  tasks: string[];
  estimated_hours: number;
}

export interface StudyPlan {
  title: string;
  duration_days: number;
  weak_topics: string[];
  schedule: StudyPlanDay[];
  ai_tip: string;
}

export interface AcademicSupportStudent {
  id: string;
  name: string;
  attendance_pct: number;
  assignment_completion_pct: number;
  average_score: number;
  support_level: 'Low Support Indicator' | 'Moderate Support Indicator' | 'Higher Support Indicator';
  style: string;
  indicators: string[];
  disclaimer: string;
}
