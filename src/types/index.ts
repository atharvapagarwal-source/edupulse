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

// ============================================================================
// PROGRESS REPORTS & PERFORMANCE TRACKING TYPES
// ============================================================================

export type ReportPeriodType = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface ReportPeriodInfo {
  type: ReportPeriodType;
  start_date: string;
  end_date: string;
  label: string;
}

export interface StudentProgressReportData {
  student: {
    id: string;
    name: string;
    email: string;
    college: string;
    course: string;
    year: string;
    avatar_url?: string;
    cgpa: number;
    overall_attendance_pct: number;
    skills?: string;
  };
  period: ReportPeriodInfo;
  summary_metrics: {
    average_score: number;
    eval_count: number;
    status: string;
  };
  subject_performance: Array<{
    subject: string;
    code: string;
    count: number;
    average_score: number;
    min_score: number;
    max_score: number;
    standing: string;
    topics: Array<{ topic: string; score: number; type: string }>;
  }>;
  assessment_records: Array<{
    id: string;
    subject: string;
    topic: string;
    score: number;
    assessment_type: string;
    assessment_date: string;
  }>;
  attendance_summary: {
    total_sessions: number;
    present_sessions: number;
    late_sessions: number;
    absent_sessions: number;
    attendance_pct: number;
    meets_threshold: boolean;
    sessions: Array<{
      id: string;
      subject: string;
      date: string;
      status: 'Present' | 'Late' | 'Absent';
      session_topic: string;
    }>;
  };
  assignment_summary: {
    total_assigned: number;
    submitted_count: number;
    graded_count: number;
    pending_count: number;
    completion_pct: number;
    submitted_list: Array<{
      assignment_id: string;
      title: string;
      subject: string;
      submitted_at: string;
      status: string;
      marks: number | null;
      max_marks: number;
    }>;
    pending_list: Array<{
      assignment_id: string;
      title: string;
      subject: string;
      deadline: string;
      max_marks: number;
      difficulty: string;
    }>;
  };
  comparison: {
    has_comparison: boolean;
    delta: number;
    delta_str: string;
    label: string;
    context: string;
    prior_average?: number;
  };
  support_topics: Array<{
    subject: string;
    topic: string;
    score: number;
    date: string;
  }>;
  teacher_remarks: Array<{
    id: string;
    subject: string;
    remark: string;
    created_at: string;
    teacher_name?: string;
  }>;
  ai_recommendations: Array<{
    title: string;
    detail: string;
  }>;
}

export interface ClassProgressReportData {
  class_info: {
    id: string;
    name: string;
    code: string;
    description: string;
    teacher_id: string;
    teacher_name: string;
    credits: number;
    schedule: string;
  };
  period: ReportPeriodInfo;
  metrics: {
    class_average: number;
    attendance_rate: number;
    assignment_completion: number;
    total_enrolled: number;
    assessment_count: number;
    session_count: number;
    submission_count: number;
  };
  distributions: Array<{
    range: string;
    label: string;
    count: number;
    percentage: number;
  }>;
  students: Array<{
    id: string;
    name: string;
    attendance_pct: number;
    assignments_completed: number;
    assignments_total: number;
    average_score: number;
    status: string;
  }>;
  assessments: Array<{
    assessment: string;
    average: number;
    lowest: number;
    highest: number;
    count: number;
  }>;
  support_candidates: Array<{
    id: string;
    name: string;
    score: number;
    evidence: string[];
    recommendation: string;
  }>;
  recommendations: string[];
}

export interface ReportHistoryItem {
  id: string;
  user_id: string;
  report_type: 'STUDENT_INDIVIDUAL' | 'CLASS_CONSOLIDATED';
  target_id: string;
  target_name: string;
  period_type: string;
  start_date: string;
  end_date: string;
  file_name: string;
  file_url: string;
  created_at: string;
}


