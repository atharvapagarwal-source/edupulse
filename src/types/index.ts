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

// ============================================================================
// TEACHER SPECIFIC INTERFACES
// ============================================================================

export interface TeacherDashboardData {
  teacher: {
    id: string;
    name: string;
    department: string;
    designation?: string;
    email?: string;
  };
  total_classes: number;
  total_students: number;
  class_average_score: number;
  pending_evaluations_count: number;
  classes: Array<{
    id: string;
    code: string;
    name: string;
    schedule: string;
    credits: number;
  }>;
  pending_submissions: TeacherSubmissionItem[];
  recent_submissions: TeacherSubmissionItem[];
  feedback_insights: TeacherFeedbackData;
  announcements: TeacherAnnouncement[];
  support_needed_count: number;
}

export interface TeacherSubmissionItem {
  id: string;
  assignment_id: string;
  assignment_title: string;
  subject: string;
  student_id: string;
  student_name: string;
  submitted_at: string;
  file_name: string;
  status: string;
  marks: number | null;
  max_marks: number;
  teacher_feedback?: string | null;
  ai_evaluation?: any;
}

export interface TeacherFeedbackData {
  teacher_id: string;
  teacher_name: string;
  total_feedback_count: number;
  average_teaching_rating: number;
  average_difficulty_rating: number;
  average_pace_rating: number;
  average_material_rating: number;
  ratings_breakdown: {
    teaching_quality: number;
    difficulty: number;
    pace: number;
    material: number;
  };
  common_topics: string[];
  recent_comments: Array<{
    id: string;
    subject: string;
    category: string;
    comment: string;
    teaching_rating: number;
    difficulty_rating: number;
    pace_rating: number;
    material_rating: number;
    created_at: string;
  }>;
}

export interface TeacherAnnouncement {
  id: string;
  teacher_id: string;
  teacher_name: string;
  subject: string;
  title: string;
  content: string;
  created_at: string;
}

export interface TeacherAnalyticsData {
  teacher_id: string;
  class_distributions: Array<{
    grade_range: string;
    count: number;
    percentage: number;
  }>;
  subject_averages: Array<{
    subject: string;
    average_score: number;
    lowest_score: number;
    highest_score: number;
    count: number;
  }>;
  assessment_performance: Array<{
    assessment: string;
    average: number;
    count: number;
  }>;
  students: Array<{
    id: string;
    name: string;
    average_score: number;
    assessments_count: number;
    support_status: 'On Track' | 'Moderate Support' | 'Higher Support';
  }>;
  support_indicators: Array<{
    student_id: string;
    student_name: string;
    level: 'Moderate' | 'Higher';
    average_score: number;
    evidence: string[];
    recommendation: string;
  }>;
}

