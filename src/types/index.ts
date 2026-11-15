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

export interface EnrolledClass {
  id: string;
  name: string;
  code: string;
  description: string;
  teacher_id: string;
  teacher_name: string;
  credits: number;
  schedule: string;
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
  missing_edge_cases?: string[];
  ai_feedback: string;
  disclaimer?: string;
}

export interface TopicPerformance {
  topic: string;
  score: number;
  status: 'Strong' | 'Good' | 'Moderate' | 'Weak';
  assessment_type?: string;
  date?: string;
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
  status?: string;
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
  day: number | string;
  topic?: string;
  focus_area?: string;
  tasks?: string[];
  estimated_hours?: number;
  hours?: number;
  priority?: string;
}

export interface StudyPlan {
  title?: string;
  student_id?: string;
  duration_days: number;
  weak_topics?: string[];
  focus_topics_count?: number;
  schedule: StudyPlanDay[];
  verified_recommendation?: string;
  ai_tip?: string;
}

export interface StudentDashboardData {
  student: {
    id: string;
    name: string;
    email: string;
    course: string;
    year: string;
    cgpa: number;
    attendance: number;
    assignment_completion: number;
    average_score: number;
    skills: string[];
  };
  subject_marks: Array<{
    subject: string;
    average_score: number;
    assessments_count: number;
  }>;
  upcoming_assignments: Array<{
    id: string;
    title: string;
    subject: string;
    topic: string;
    deadline: string;
    difficulty: string;
    max_marks: number;
    status: string;
  }>;
  enrolled_classes: EnrolledClass[];
  notifications: NotificationItem[];
  recommended_opportunities: Opportunity[];
  study_recommendation: string;
  weak_topics_count: number;
  strongest_subject: string;
  weakest_subject: string;
}

export interface StudentPerformanceData {
  student_id: string;
  subject_scores: Array<{
    subject: string;
    score: number;
  }>;
  topic_hierarchy: Record<string, TopicPerformance[]>;
  trend: Array<{
    assessment: string;
    score: number;
    subject: string;
    date: string;
  }>;
  weak_topics: string[];
  strong_topics: string[];
  ai_analysis: string;
  total_assessments_logged: number;
}
