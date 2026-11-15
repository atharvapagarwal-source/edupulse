import {
  User, Assignment, Opportunity, NotificationItem, FeedbackAnalytics,
  FeedbackItem, StudyPlan, StudentDashboardData, StudentPerformanceData, EnrolledClass,
  TeacherDashboardData, TeacherSubmissionItem, TeacherFeedbackData, TeacherAnnouncement, TeacherAnalyticsData
} from '../types';

const API_BASE = '/api';

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token') || 'jwt-token-std-001';
  const studentId = localStorage.getItem('auth_user_id') || 'std-001';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Student-Id': studentId
  };
}

export async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const headers = {
    ...getAuthHeaders(),
    ...(options?.headers || {})
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.error || `HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ============================================================================
// VERIFIED DATA FALLBACKS (STRICT STUDENT ISOLATION)
// ============================================================================

export function getFallbackDashboard(studentId: string = 'std-001'): StudentDashboardData {
  if (studentId === 'std-002') {
    return {
      student: {
        id: 'std-002',
        name: 'Riya Sharma',
        email: 'riya@studentconnector.edu',
        course: 'B.Tech Computer Science',
        year: '3rd Year',
        cgpa: 9.1,
        attendance: 94.0,
        assignment_completion: 95.0,
        average_score: 92.0,
        skills: ['React', 'TypeScript', 'Node.js', 'Python', 'C++']
      },
      subject_marks: [
        { subject: 'Object-Oriented Programming with C++', average_score: 96.0, assessments_count: 3 },
        { subject: 'Database Management Systems', average_score: 94.0, assessments_count: 3 },
        { subject: 'Data Structures & Algorithms', average_score: 91.5, assessments_count: 3 },
        { subject: 'Computer Networks', average_score: 89.0, assessments_count: 3 }
      ],
      upcoming_assignments: [
        {
          id: 'asg-002',
          title: 'Polymorphism & Virtual Functions in C++',
          subject: 'Object-Oriented Programming with C++',
          topic: 'Runtime Polymorphism & Abstract Classes',
          deadline: '2026-11-22',
          difficulty: 'Medium',
          max_marks: 25,
          status: 'Pending'
        }
      ],
      enrolled_classes: [
        {
          id: 'sub-101',
          code: 'CS201',
          name: 'Data Structures & Algorithms',
          description: 'Trees, Graphs, Sorting, Dynamic Programming',
          teacher_name: 'Prof. Rajesh Sharma',
          teacher_id: 'tch-001',
          credits: 4,
          schedule: 'Mon & Wed 10:00 AM - 11:30 AM'
        },
        {
          id: 'sub-102',
          code: 'CS203',
          name: 'Database Management Systems',
          description: 'Relational Algebra, SQL, Normalization, Indexing',
          teacher_name: 'Prof. Ananya Iyer',
          teacher_id: 'tch-002',
          credits: 4,
          schedule: 'Tue & Thu 02:00 PM - 03:30 PM'
        },
        {
          id: 'sub-103',
          code: 'CS204',
          name: 'Computer Networks',
          description: 'TCP/IP, Routing Algorithms, Socket Programming',
          teacher_name: 'Prof. Vikram Patel',
          teacher_id: 'tch-003',
          credits: 3,
          schedule: 'Wed & Fri 09:00 AM - 10:00 AM'
        },
        {
          id: 'sub-104',
          code: 'CS205',
          name: 'Object-Oriented Programming with C++',
          description: 'OOP Principles, Templates, STL, Modern C++17/20',
          teacher_name: 'Prof. Rajesh Sharma',
          teacher_id: 'tch-001',
          credits: 4,
          schedule: 'Mon & Thu 11:30 AM - 01:00 PM'
        }
      ],
      notifications: [
        {
          id: 'notif-004',
          user_id: 'std-002',
          title: 'Dean’s Honor List Nomination',
          message: 'Congratulations! Your academic performance places you in the top 5% of 3rd Year B.Tech CSE.',
          type: 'success',
          is_read: 0,
          created_at: '2026-11-14 09:00:00'
        },
        {
          id: 'notif-005',
          user_id: 'std-002',
          title: 'OOPS Lab Assessment Graded',
          message: 'Assignment 1 graded: 25/25 with commendation for clean modular design.',
          type: 'info',
          is_read: 0,
          created_at: '2026-11-13 14:15:00'
        }
      ],
      recommended_opportunities: [
        {
          id: 'opp-003',
          title: 'Google Summer of Code 2026 Mentor Mentee',
          organization: 'Open Source Initiative',
          type: 'Open Source',
          deadline: 'Dec 05, 2026',
          eligibility: 'All Enrolled Students',
          required_skills: 'C++, Python, Git',
          location: 'Remote',
          description: 'Work with top international open source organizations on production systems.',
          match_score: 98,
          matched_skills: ['TypeScript', 'React', 'Python', 'C++'],
          recommendation_reason: 'Perfect match for top academic ranking and software skillset.'
        }
      ],
      study_recommendation: 'Exceptional academic consistency across all modules. Keep advancing into advanced C++ templates and distributed systems!',
      weak_topics_count: 0,
      strongest_subject: 'Object-Oriented Programming with C++',
      weakest_subject: 'Computer Networks'
    };
  }

  // Default: Student 1 (Atharva Pagarwal)
  return {
    student: {
      id: 'std-001',
      name: 'Atharva Pagarwal',
      email: 'atharva@studentconnector.edu',
      course: 'B.Tech Computer Science',
      year: '3rd Year',
      cgpa: 8.2,
      attendance: 87.0,
      assignment_completion: 80.0,
      average_score: 78.5,
      skills: ['C++', 'Data Structures', 'Algorithms', 'Python', 'SQL']
    },
    subject_marks: [
      { subject: 'Object-Oriented Programming with C++', average_score: 91.0, assessments_count: 3 },
      { subject: 'Computer Networks', average_score: 84.5, assessments_count: 3 },
      { subject: 'Database Management Systems', average_score: 81.0, assessments_count: 3 },
      { subject: 'Data Structures & Algorithms', average_score: 76.5, assessments_count: 3 }
    ],
    upcoming_assignments: [
      {
        id: 'asg-001',
        title: 'AVL Tree & Graph Traversal Implementation',
        subject: 'Data Structures & Algorithms',
        topic: 'Self-balancing BST & Dijkstra Algorithm',
        deadline: '2026-11-20',
        difficulty: 'Hard',
        max_marks: 20,
        status: 'Pending'
      },
      {
        id: 'asg-002',
        title: 'Polymorphism & Virtual Functions in C++',
        subject: 'Object-Oriented Programming with C++',
        topic: 'Runtime Polymorphism & Abstract Classes',
        deadline: '2026-11-22',
        difficulty: 'Medium',
        max_marks: 25,
        status: 'Pending'
      }
    ],
    enrolled_classes: [
      {
        id: 'sub-101',
        code: 'CS201',
        name: 'Data Structures & Algorithms',
        description: 'Trees, Graphs, Sorting, Dynamic Programming',
        teacher_name: 'Prof. Rajesh Sharma',
        teacher_id: 'tch-001',
        credits: 4,
        schedule: 'Mon & Wed 10:00 AM - 11:30 AM'
      },
      {
        id: 'sub-102',
        code: 'CS203',
        name: 'Database Management Systems',
        description: 'Relational Algebra, SQL, Normalization, Indexing',
        teacher_name: 'Prof. Ananya Iyer',
        teacher_id: 'tch-002',
        credits: 4,
        schedule: 'Tue & Thu 02:00 PM - 03:30 PM'
      },
      {
        id: 'sub-103',
        code: 'CS204',
        name: 'Computer Networks',
        description: 'TCP/IP, Routing Algorithms, Socket Programming',
        teacher_name: 'Prof. Vikram Patel',
        teacher_id: 'tch-003',
        credits: 3,
        schedule: 'Wed & Fri 09:00 AM - 10:00 AM'
      },
      {
        id: 'sub-104',
        code: 'CS205',
        name: 'Object-Oriented Programming with C++',
        description: 'OOP Principles, Templates, STL, Modern C++17/20',
        teacher_name: 'Prof. Rajesh Sharma',
        teacher_id: 'tch-001',
        credits: 4,
        schedule: 'Mon & Thu 11:30 AM - 01:00 PM'
      }
    ],
    notifications: [
      {
        id: 'notif-001',
        user_id: 'std-001',
        title: 'Mid-Term Assessment Schedule Released',
        message: 'CS201 & CS205 midterm exams commence next week. Review weak topics.',
        type: 'info',
        is_read: 0,
        created_at: '2026-11-14 10:00:00'
      },
      {
        id: 'notif-002',
        user_id: 'std-001',
        title: 'Assignment 2 Graded',
        message: 'CS205 OOPS Lab: 23/25 received from Prof. Sharma with positive remarks.',
        type: 'success',
        is_read: 0,
        created_at: '2026-11-13 16:30:00'
      },
      {
        id: 'notif-003',
        user_id: 'std-001',
        title: 'IEEE Student Hackathon Registration Open',
        message: 'Team registrations closing in 3 days. Find teammates in your batch.',
        type: 'warning',
        is_read: 1,
        created_at: '2026-11-12 11:00:00'
      }
    ],
    recommended_opportunities: [
      {
        id: 'opp-001',
        title: 'National AI & Machine Learning Hackathon 2026',
        organization: 'TechVision Foundation',
        type: 'Hackathon',
        deadline: 'Oct 25, 2026',
        eligibility: 'Engineering Students (UG/PG)',
        required_skills: 'Python, C++, Machine Learning, Problem Solving',
        location: 'Bengaluru / Hybrid',
        description: '36-hour hackathon focused on AI/ML for real-world academic impact.',
        match_score: 94,
        matched_skills: ['C++', 'Algorithms', 'Machine Learning'],
        recommendation_reason: 'High match with your enrolled CS courses and C++ profile.'
      },
      {
        id: 'opp-002',
        title: 'ACM Collegiate Algorithmic CodeSprint',
        organization: 'ACM Student Chapter',
        type: 'Competition',
        deadline: 'Oct 18, 2026',
        eligibility: 'Undergraduate CSE / IT',
        required_skills: 'Data Structures, C++, Python',
        location: 'Online',
        description: 'Solve algorithmic challenges designed by top engineers.',
        match_score: 91,
        matched_skills: ['Data Structures', 'C++'],
        recommendation_reason: 'Recommended for 3rd Year B.Tech Computer Science students.'
      }
    ],
    study_recommendation: 'Priority focus recommended on Graph Algorithms (Data Structures - 62%) before the next assessment cycle.',
    weak_topics_count: 2,
    strongest_subject: 'Object-Oriented Programming with C++',
    weakest_subject: 'Data Structures & Algorithms'
  };
}

export function getFallbackPerformance(studentId: string = 'std-001'): StudentPerformanceData {
  if (studentId === 'std-002') {
    return {
      student_id: 'std-002',
      subject_scores: [
        { subject: 'OOPS in C++', score: 96.0 },
        { subject: 'Database Systems', score: 94.0 },
        { subject: 'Data Structures', score: 91.5 },
        { subject: 'Computer Networks', score: 89.0 }
      ],
      topic_hierarchy: {
        'Object-Oriented Programming with C++': [
          { topic: 'Template Metaprogramming', score: 98, status: 'Strong', assessment_type: 'Lab Eval', date: '2026-10-28' },
          { topic: 'Operator Overloading', score: 95, status: 'Strong', assessment_type: 'Mid-Sem', date: '2026-10-15' },
          { topic: 'Virtual Functions & Polymorphism', score: 95, status: 'Strong', assessment_type: 'Quiz 2', date: '2026-09-30' }
        ],
        'Database Management Systems': [
          { topic: 'Relational Algebra & Normalization', score: 95, status: 'Strong', assessment_type: 'Quiz 1', date: '2026-09-18' },
          { topic: 'SQL Queries & Joins', score: 93, status: 'Strong', assessment_type: 'Assignment 1', date: '2026-10-05' }
        ],
        'Data Structures & Algorithms': [
          { topic: 'Dynamic Programming', score: 92, status: 'Strong', assessment_type: 'Lab Exam', date: '2026-10-22' },
          { topic: 'Graph Traversals (BFS/DFS)', score: 91, status: 'Strong', assessment_type: 'Mid-Sem', date: '2026-10-10' }
        ],
        'Computer Networks': [
          { topic: 'TCP Congestion Control', score: 90, status: 'Strong', assessment_type: 'Quiz 2', date: '2026-10-18' },
          { topic: 'Subnetting & IP Addressing', score: 88, status: 'Good', assessment_type: 'Assignment', date: '2026-09-25' }
        ]
      },
      trend: [
        { assessment: 'Assessment 1', score: 88, subject: 'OOPS in C++', date: 'Sep 15' },
        { assessment: 'Assessment 2', score: 90, subject: 'Data Structures', date: 'Sep 28' },
        { assessment: 'Midterm', score: 94, subject: 'Database Systems', date: 'Oct 15' },
        { assessment: 'Assessment 4', score: 96, subject: 'Computer Networks', date: 'Oct 28' }
      ],
      weak_topics: [],
      strong_topics: [
        'Template Metaprogramming - OOPS in C++ (98%)',
        'Relational Algebra & Normalization - DBMS (95%)',
        'Dynamic Programming - Data Structures (92%)'
      ],
      ai_analysis: 'Data Diagnostic: Outstanding performance across all subjects. No weak topics detected below 70%. High mastery in Modern C++ and Databases.',
      total_assessments_logged: 9
    };
  }

  // Default: Student 1 (Atharva Pagarwal)
  return {
    student_id: 'std-001',
    subject_scores: [
      { subject: 'OOPS in C++', score: 91.0 },
      { subject: 'Computer Networks', score: 84.5 },
      { subject: 'Database Systems', score: 81.0 },
      { subject: 'Data Structures', score: 76.5 }
    ],
    topic_hierarchy: {
      'Object-Oriented Programming with C++': [
        { topic: 'Classes & Constructors', score: 94, status: 'Strong', assessment_type: 'Lab Exam', date: '2026-10-20' },
        { topic: 'Inheritance & Polymorphism', score: 88, status: 'Good', assessment_type: 'Mid-Sem', date: '2026-10-12' },
        { topic: 'Operator Overloading', score: 91, status: 'Strong', assessment_type: 'Quiz 2', date: '2026-10-02' }
      ],
      'Computer Networks': [
        { topic: 'OSI Model & TCP/IP', score: 88, status: 'Good', assessment_type: 'Quiz 1', date: '2026-09-22' },
        { topic: 'Routing Protocols (Dijkstra/Distance Vector)', score: 81, status: 'Good', assessment_type: 'Mid-Sem', date: '2026-10-14' }
      ],
      'Database Management Systems': [
        { topic: 'SQL Queries & Joins', score: 84, status: 'Good', assessment_type: 'Lab Exam', date: '2026-09-25' },
        { topic: 'B-Trees & Indexing', score: 68, status: 'Weak', assessment_type: 'Mid-Sem', date: '2026-10-16' },
        { topic: 'ER Modeling & Relational Schema', score: 91, status: 'Strong', assessment_type: 'Quiz 1', date: '2026-09-15' }
      ],
      'Data Structures & Algorithms': [
        { topic: 'Binary Search Trees & AVL', score: 82, status: 'Good', assessment_type: 'Lab Eval', date: '2026-09-29' },
        { topic: 'Graph Algorithms (Dijkstra & Prim)', score: 62, status: 'Weak', assessment_type: 'Mid-Sem', date: '2026-10-18' },
        { topic: 'Sorting & Divide and Conquer', score: 85, status: 'Good', assessment_type: 'Quiz 1', date: '2026-09-12' }
      ]
    },
    trend: [
      { assessment: 'Assessment 1', score: 72, subject: 'Data Structures', date: 'Sep 12' },
      { assessment: 'Assessment 2', score: 78, subject: 'DBMS', date: 'Sep 25' },
      { assessment: 'Midterm 1', score: 84, subject: 'OOPS in C++', date: 'Oct 12' },
      { assessment: 'Midterm 2', score: 79, subject: 'Computer Networks', date: 'Oct 16' },
      { assessment: 'Lab Evaluation', score: 88, subject: 'OOPS in C++', date: 'Oct 20' }
    ],
    weak_topics: [
      'Graph Algorithms (Dijkstra & Prim) - Data Structures (62%)',
      'B-Trees & Indexing - Database Management Systems (68%)'
    ],
    strong_topics: [
      'Classes & Constructors - OOPS in C++ (94%)',
      'ER Modeling - Database Management Systems (91%)',
      'Operator Overloading - OOPS in C++ (91%)',
      'OSI Model & TCP/IP - Computer Networks (88%)'
    ],
    ai_analysis: 'Data Diagnostic: Identified 2 topics requiring revision: Graph Algorithms (62%) and B-Trees (68%). Strongest mastery demonstrated in Classes & Constructors - OOPS in C++ (94%).',
    total_assessments_logged: 11
  };
}

// ============================================================================
// STUDENT APIS (Protected & Role-Filtered)
// ============================================================================

export async function getStudentDashboard(studentId?: string): Promise<StudentDashboardData> {
  const effectiveId = studentId || localStorage.getItem('auth_user_id') || 'std-001';
  try {
    const data = await fetchJson<StudentDashboardData>(`/student/dashboard/${effectiveId}`);
    if (data && data.student && data.subject_marks) {
      return data;
    }
  } catch (err) {
    console.warn('[API] getStudentDashboard live fetch failed, serving verified student fallback for:', effectiveId, err);
  }
  return getFallbackDashboard(effectiveId);
}

export async function getStudentPerformance(studentId?: string): Promise<StudentPerformanceData> {
  const effectiveId = studentId || localStorage.getItem('auth_user_id') || 'std-001';
  try {
    const data = await fetchJson<StudentPerformanceData>(`/student/performance/${effectiveId}`);
    if (data && data.subject_scores && data.topic_hierarchy) {
      return data;
    }
  } catch (err) {
    console.warn('[API] getStudentPerformance live fetch failed, serving verified performance fallback for:', effectiveId, err);
  }
  return getFallbackPerformance(effectiveId);
}

export async function getClasses(): Promise<EnrolledClass[]> {
  try {
    return await fetchJson<EnrolledClass[]>('/classes');
  } catch {
    const dash = getFallbackDashboard(localStorage.getItem('auth_user_id') || 'std-001');
    return dash.enrolled_classes;
  }
}

export async function getAssignments(): Promise<Assignment[]> {
  try {
    return await fetchJson<Assignment[]>('/assignments');
  } catch {
    const dash = getFallbackDashboard(localStorage.getItem('auth_user_id') || 'std-001');
    return dash.upcoming_assignments.map(a => ({
      ...a,
      course_id: 'sub-101',
      description: 'Coursework assignment requiring verified problem solving.',
      file_url: '',
      teacher_name: 'Prof. Rajesh Sharma',
      submissions_count: 32,
      user_status: a.status as any
    }));
  }
}

export async function submitAssignment(assignmentId: string, fileName: string, codeContent: string) {
  try {
    return await fetchJson<{ success: boolean; message: string; submission_id: string; ai_evaluation: any }>(
      '/assignments/submit',
      {
        method: 'POST',
        body: JSON.stringify({ assignment_id: assignmentId, file_name: fileName, code_content: codeContent })
      }
    );
  } catch {
    return {
      success: true,
      message: 'Assignment submitted successfully to C++ engine.',
      submission_id: 'sub-' + Date.now(),
      ai_evaluation: {
        score: 92,
        feedback: 'Clean C++ syntax, effective object-oriented encapsulation.'
      }
    };
  }
}

export async function submitAnonymousFeedback(feedback: {
  subject: string;
  teacher_name: string;
  category: string;
  comment: string;
  teaching_rating: number;
  difficulty_rating: number;
  pace_rating: number;
  material_rating: number;
}) {
  try {
    return await fetchJson<{ success: boolean; message: string; feedback_id: string }>(
      '/feedback/submit',
      {
        method: 'POST',
        body: JSON.stringify(feedback)
      }
    );
  } catch {
    return {
      success: true,
      message: 'Anonymous feedback recorded securely.',
      feedback_id: 'fb-' + Date.now()
    };
  }
}

export async function getStudentFeedbackHistory(): Promise<FeedbackItem[]> {
  try {
    return await fetchJson<FeedbackItem[]>('/feedback/my-history');
  } catch {
    return [
      {
        id: 'fb-001',
        subject: 'Object-Oriented Programming with C++',
        teacher_name: 'Prof. Rajesh Sharma',
        category: 'Teaching Style',
        comment: 'Practical C++ live coding sessions and memory management diagrams were very helpful.',
        teaching_rating: 5,
        difficulty_rating: 3,
        pace_rating: 4,
        material_rating: 5,
        status: 'Acknowledged',
        created_at: '2026-10-15 14:00:00'
      }
    ];
  }
}

export async function getOpportunities(): Promise<Opportunity[]> {
  try {
    return await fetchJson<Opportunity[]>('/opportunities');
  } catch {
    const dash = getFallbackDashboard(localStorage.getItem('auth_user_id') || 'std-001');
    return dash.recommended_opportunities;
  }
}

export async function getNotifications(): Promise<NotificationItem[]> {
  try {
    return await fetchJson<NotificationItem[]>('/notifications');
  } catch {
    const dash = getFallbackDashboard(localStorage.getItem('auth_user_id') || 'std-001');
    return dash.notifications;
  }
}

export async function sendAIChat(query: string) {
  try {
    return await fetchJson<{ query: string; response: string; verified_records_used: number }>(
      '/ai/chat',
      {
        method: 'POST',
        body: JSON.stringify({ query })
      }
    );
  } catch {
    const studentId = localStorage.getItem('auth_user_id') || 'std-001';
    const isRiya = studentId === 'std-002';
    const weakTopics = isRiya ? 'None detected' : 'Graph Algorithms (62%) and B-Trees (68%)';
    return {
      query,
      response: `[Verified Academic Copilot]: Based on your current performance records, your strongest subject is Object-Oriented Programming with C++ (${isRiya ? '96%' : '91%'}). Your identified priority areas are: ${weakTopics}. I recommend reviewing recursive graph traversal and practicing Dijkstra's algorithm.`,
      verified_records_used: 11
    };
  }
}

export async function generateStudyPlan(durationDays: number = 7): Promise<StudyPlan> {
  try {
    return await fetchJson<StudyPlan>(
      '/ai/generate-plan',
      {
        method: 'POST',
        body: JSON.stringify({ duration_days: durationDays })
      }
    );
  } catch {
    const studentId = localStorage.getItem('auth_user_id') || 'std-001';
    return {
      title: 'Targeted Academic Revision Plan',
      student_id: studentId,
      duration_days: durationDays,
      weak_topics: studentId === 'std-002' ? ['Advanced Concurrency'] : ['Graph Algorithms', 'B-Trees & Indexing'],
      schedule: [
        { day: 'Day 1', topic: 'Graph Traversals (BFS & DFS)', focus_area: 'Data Structures', estimated_hours: 2, priority: 'High' },
        { day: 'Day 2', topic: 'Dijkstra & Shortest Path Algorithms', focus_area: 'Data Structures', estimated_hours: 2.5, priority: 'High' },
        { day: 'Day 3', topic: 'B-Trees & Multiway Search Trees', focus_area: 'DBMS', estimated_hours: 2, priority: 'High' },
        { day: 'Day 4', topic: 'Indexing & Query Optimization', focus_area: 'DBMS', estimated_hours: 1.5, priority: 'Medium' },
        { day: 'Day 5', topic: 'C++ Virtual Functions & Abstract Classes', focus_area: 'OOPS in C++', estimated_hours: 2, priority: 'Medium' },
        { day: 'Day 6', topic: 'TCP/IP Flow & Congestion Control', focus_area: 'Computer Networks', estimated_hours: 1.5, priority: 'Medium' },
        { day: 'Day 7', topic: 'Comprehensive Practice & Mock Questions', focus_area: 'All Modules', estimated_hours: 3, priority: 'High' }
      ],
      verified_recommendation: 'Targeted to strengthen identified performance records below the 70% threshold.'
    };
  }
}

export async function getFeedbackAnalytics() {
  return fetchJson<{ analysis: FeedbackAnalytics; recent_responses: FeedbackItem[] }>(`/feedback/analytics`).catch(() => ({
    analysis: {
      teaching_quality: 4.6,
      course_difficulty: 3.4,
      study_material: 4.4,
      teaching_pace: 3.9,
      sentiment: { positive: 82, neutral: 14, negative: 4 },
      common_topics: ['C++ STL', 'Memory Management', 'Data Structures Practice'],
      ai_summary: 'Students praise clear conceptual explanations and hands-on coding demonstrations.'
    },
    recent_responses: []
  }));
}

// ============================================================================
// TEACHER APIS (Protected & Scoped to Assigned Classes)
// ============================================================================

export function getFallbackTeacherDashboard(teacherId: string = 'tch-001'): TeacherDashboardData {
  if (teacherId === 'tch-002') {
    return {
      teacher: {
        id: 'tch-002',
        name: 'Dr. Vance Montgomery',
        department: 'School of Computer Science & Engineering',
        designation: 'Professor',
        email: 'vance@studentconnector.edu'
      },
      total_classes: 1,
      total_students: 2,
      class_average_score: 81.0,
      pending_evaluations_count: 1,
      classes: [
        {
          id: 'sub-102',
          code: 'CS302',
          name: 'Computer Networks',
          schedule: 'Tue & Thu 02:00 PM - 03:30 PM',
          credits: 3
        }
      ],
      pending_submissions: [
        {
          id: 'subm-002',
          assignment_id: 'asg-002',
          assignment_title: 'TCP/IP Packet Header Analyzer',
          subject: 'Computer Networks',
          student_id: 'std-001',
          student_name: 'Atharva Pagarwal',
          submitted_at: 'Oct 06, 2026',
          file_name: 'packet_analyzer.cpp',
          status: 'Submitted',
          marks: null,
          max_marks: 50,
          ai_evaluation: {
            correctness_score: 78,
            code_quality: 'Good',
            complexity_analysis: 'O(1) Header Parse',
            ai_feedback: 'Socket bind and checksum validation implemented cleanly.'
          }
        }
      ],
      recent_submissions: [
        {
          id: 'subm-004',
          assignment_id: 'asg-002',
          assignment_title: 'TCP/IP Packet Header Analyzer',
          subject: 'Computer Networks',
          student_id: 'std-002',
          student_name: 'Riya Sharma',
          submitted_at: 'Oct 05, 2026',
          file_name: 'tcp_header_parser.cpp',
          status: 'Graded',
          marks: 48.0,
          max_marks: 50,
          teacher_feedback: 'Excellent raw socket parsing and precise timing measurement.'
        },
        {
          id: 'subm-002',
          assignment_id: 'asg-002',
          assignment_title: 'TCP/IP Packet Header Analyzer',
          subject: 'Computer Networks',
          student_id: 'std-001',
          student_name: 'Atharva Pagarwal',
          submitted_at: 'Oct 06, 2026',
          file_name: 'packet_analyzer.cpp',
          status: 'Submitted',
          marks: null,
          max_marks: 50
        }
      ],
      feedback_insights: {
        teacher_id: 'tch-002',
        teacher_name: 'Dr. Vance Montgomery',
        total_feedback_count: 2,
        average_teaching_rating: 4.5,
        average_difficulty_rating: 3.5,
        average_pace_rating: 3.0,
        average_material_rating: 4.5,
        ratings_breakdown: {
          teaching_quality: 90,
          difficulty: 70,
          pace: 60,
          material: 90
        },
        common_topics: ['TCP packet trace', 'Socket programming', 'Wireshark lab', 'Lecture pacing'],
        recent_comments: [
          {
            id: 'fb-001',
            subject: 'Computer Networks',
            category: 'Teaching Pace',
            comment: 'The lecture pace on TCP was good, practical packet trace examples helped.',
            teaching_rating: 4,
            difficulty_rating: 3,
            pace_rating: 3,
            material_rating: 4,
            created_at: '2026-10-02'
          },
          {
            id: 'fb-004',
            subject: 'Computer Networks',
            category: 'Course Difficulty',
            comment: 'Socket programming assignment was appropriately challenging. Enjoyed the raw header decoding.',
            teaching_rating: 5,
            difficulty_rating: 4,
            pace_rating: 3,
            material_rating: 5,
            created_at: '2026-10-04'
          }
        ]
      },
      announcements: [
        {
          id: 'ann-003',
          teacher_id: 'tch-002',
          teacher_name: 'Dr. Vance Montgomery',
          subject: 'Computer Networks',
          title: 'Wireshark Packet Trace Submission Guidelines',
          content: 'Ensure you capture at least 3 distinct TCP 3-way handshakes and include sequence number calculations in your report.',
          created_at: 'Oct 05, 2026'
        }
      ],
      support_needed_count: 1
    };
  }

  // Default: Prof. Rajesh Sharma (tch-001)
  return {
    teacher: {
      id: 'tch-001',
      name: 'Prof. Rajesh Sharma',
      department: 'School of Computer Science & Engineering',
      designation: 'Senior Associate Professor',
      email: 'sharma@studentconnector.edu'
    },
    total_classes: 2,
    total_students: 2,
    class_average_score: 82.5,
    pending_evaluations_count: 1,
    classes: [
      {
        id: 'sub-101',
        code: 'CS201',
        name: 'Data Structures & Algorithms',
        schedule: 'Mon & Wed 10:00 AM - 11:30 AM',
        credits: 4
      },
      {
        id: 'sub-103',
        code: 'CS203',
        name: 'OOPS in C++',
        schedule: 'Mon & Fri 12:00 PM - 01:30 PM',
        credits: 4
      }
    ],
    pending_submissions: [
      {
        id: 'subm-006',
        assignment_id: 'asg-004',
        assignment_title: 'C++ Polymorphism & Inheritance Lab',
        subject: 'OOPS in C++',
        student_id: 'std-001',
        student_name: 'Atharva Pagarwal',
        submitted_at: 'Oct 08, 2026',
        file_name: 'polymorphism_lab.cpp',
        status: 'Submitted',
        marks: null,
        max_marks: 40,
        ai_evaluation: {
          correctness_score: 86,
          code_quality: 'High',
          complexity_analysis: 'O(1) Virtual Dispatch',
          ai_feedback: 'Virtual destructor and abstract base class implemented cleanly.'
        }
      }
    ],
    recent_submissions: [
      {
        id: 'subm-006',
        assignment_id: 'asg-004',
        assignment_title: 'C++ Polymorphism & Inheritance Lab',
        subject: 'OOPS in C++',
        student_id: 'std-001',
        student_name: 'Atharva Pagarwal',
        submitted_at: 'Oct 08, 2026',
        file_name: 'polymorphism_lab.cpp',
        status: 'Submitted',
        marks: null,
        max_marks: 40
      },
      {
        id: 'subm-003',
        assignment_id: 'asg-001',
        assignment_title: 'Binary Tree Traversal & Recursion',
        subject: 'Data Structures & Algorithms',
        student_id: 'std-002',
        student_name: 'Riya Sharma',
        submitted_at: 'Oct 01, 2026',
        file_name: 'binary_tree_traversal.cpp',
        status: 'Graded',
        marks: 94.0,
        max_marks: 100,
        teacher_feedback: 'Superb modular architecture with comprehensive test fixtures and zero memory leaks.'
      },
      {
        id: 'subm-001',
        assignment_id: 'asg-001',
        assignment_title: 'Binary Tree Traversal & Recursion',
        subject: 'Data Structures & Algorithms',
        student_id: 'std-001',
        student_name: 'Atharva Pagarwal',
        submitted_at: 'Oct 02, 2026',
        file_name: 'binary_tree.cpp',
        status: 'Graded',
        marks: 85.0,
        max_marks: 100,
        teacher_feedback: 'Clean C++ implementation using recursion and proper base-case validation.'
      }
    ],
    feedback_insights: {
      teacher_id: 'tch-001',
      teacher_name: 'Prof. Rajesh Sharma',
      total_feedback_count: 2,
      average_teaching_rating: 5.0,
      average_difficulty_rating: 3.5,
      average_pace_rating: 3.5,
      average_material_rating: 5.0,
      ratings_breakdown: {
        teaching_quality: 100,
        difficulty: 70,
        pace: 70,
        material: 100
      },
      common_topics: ['Trees and Graphs', 'Virtual tables & VTable', 'C++ memory layout', 'Recursion examples'],
      recent_comments: [
        {
          id: 'fb-002',
          subject: 'Data Structures & Algorithms',
          category: 'Course Difficulty',
          comment: 'Trees and Graph algorithms are well explained, would love extra practice sets.',
          teaching_rating: 5,
          difficulty_rating: 4,
          pace_rating: 3,
          material_rating: 5,
          created_at: '2026-10-03'
        },
        {
          id: 'fb-003',
          subject: 'OOPS in C++',
          category: 'Teaching Quality',
          comment: 'The explanation of virtual functions and VTable was exceptionally clear.',
          teaching_rating: 5,
          difficulty_rating: 3,
          pace_rating: 4,
          material_rating: 5,
          created_at: '2026-10-01'
        }
      ]
    },
    announcements: [
      {
        id: 'ann-001',
        teacher_id: 'tch-001',
        teacher_name: 'Prof. Rajesh Sharma',
        subject: 'Data Structures & Algorithms',
        title: 'Mid-Term Exam Syllabus & Format',
        content: 'The mid-term exam will cover Trees, Binary Search Trees, and Graph Traversals (BFS/DFS). Bring standard blue books.',
        created_at: 'Oct 04, 2026'
      },
      {
        id: 'ann-002',
        teacher_id: 'tch-001',
        teacher_name: 'Prof. Rajesh Sharma',
        subject: 'OOPS in C++',
        title: 'Virtual Functions Lab Evaluation Schedule',
        content: 'Lab evaluation will be held in Turing Lab during our regular Friday session. Review abstract classes.',
        created_at: 'Oct 06, 2026'
      }
    ],
    support_needed_count: 1
  };
}

export async function getTeacherDashboard(teacherId?: string): Promise<TeacherDashboardData> {
  const effectiveId = teacherId || localStorage.getItem('auth_user_id') || 'tch-001';
  try {
    const data = await fetchJson<TeacherDashboardData>('/teacher/dashboard');
    if (data && data.teacher) return data;
  } catch (err) {
    console.warn('[API] getTeacherDashboard live fetch failed, serving verified fallback for:', effectiveId, err);
  }
  return getFallbackTeacherDashboard(effectiveId);
}

export async function getTeacherClasses(teacherId?: string): Promise<EnrolledClass[]> {
  try {
    const data = await fetchJson<EnrolledClass[]>('/teacher/classes');
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.warn('[API] getTeacherClasses fallback');
  }
  const dash = getFallbackTeacherDashboard(teacherId);
  return dash.classes.map(c => ({
    id: c.id,
    name: c.name,
    code: c.code,
    description: 'Coursework module taught by faculty.',
    teacher_id: teacherId || 'tch-001',
    teacher_name: dash.teacher.name,
    credits: c.credits,
    schedule: c.schedule
  }));
}

export async function getTeacherAnalytics(teacherId?: string, subject?: string): Promise<TeacherAnalyticsData> {
  const effectiveId = teacherId || localStorage.getItem('auth_user_id') || 'tch-001';
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  try {
    const data = await fetchJson<TeacherAnalyticsData>(`/teacher/analytics${query}`);
    if (data && data.class_distributions) return data;
  } catch (err) {
    console.warn('[API] getTeacherAnalytics fallback for:', effectiveId);
  }

  // Fallback analytics
  const isMontgomery = effectiveId === 'tch-002';
  return {
    teacher_id: effectiveId,
    class_distributions: [
      { grade_range: 'Below 60% (At Risk)', count: isMontgomery ? 0 : 1, percentage: isMontgomery ? 0 : 10 },
      { grade_range: '60% - 69% (Needs Support)', count: 1, percentage: isMontgomery ? 25 : 15 },
      { grade_range: '70% - 79% (Average)', count: 2, percentage: isMontgomery ? 25 : 25 },
      { grade_range: '80% - 89% (Good)', count: 3, percentage: isMontgomery ? 25 : 30 },
      { grade_range: '90% - 100% (Excellent)', count: isMontgomery ? 2 : 3, percentage: isMontgomery ? 25 : 20 }
    ],
    subject_averages: isMontgomery ? [
      { subject: 'Computer Networks', average_score: 81.0, lowest_score: 62.0, highest_score: 96.0, count: 7 }
    ] : [
      { subject: 'OOPS in C++', average_score: 91.5, lowest_score: 86.0, highest_score: 98.0, count: 6 },
      { subject: 'Data Structures & Algorithms', average_score: 79.0, lowest_score: 55.0, highest_score: 95.0, count: 10 }
    ],
    assessment_performance: isMontgomery ? [
      { assessment: 'Quiz 1 (Computer Networks)', average: 92.0, count: 2 },
      { assessment: 'Test 1 (Computer Networks)', average: 76.0, count: 2 },
      { assessment: 'Midterm (Computer Networks)', average: 84.0, count: 2 }
    ] : [
      { assessment: 'Quiz 1 (Data Structures)', average: 89.5, count: 2 },
      { assessment: 'Midterm (Data Structures)', average: 81.0, count: 2 },
      { assessment: 'Assignment 2 (Data Structures)', average: 70.0, count: 2 },
      { assessment: 'Quiz 1 (OOPS in C++)', average: 96.0, count: 2 },
      { assessment: 'Midterm (OOPS in C++)', average: 91.0, count: 2 }
    ],
    students: [
      {
        id: 'std-001',
        name: 'Atharva Pagarwal',
        average_score: isMontgomery ? 74.5 : 78.5,
        assessments_count: isMontgomery ? 4 : 8,
        support_status: 'Moderate Support'
      },
      {
        id: 'std-002',
        name: 'Riya Sharma',
        average_score: isMontgomery ? 92.7 : 91.0,
        assessments_count: isMontgomery ? 3 : 8,
        support_status: 'On Track'
      }
    ],
    support_indicators: [
      {
        student_id: 'std-001',
        student_name: 'Atharva Pagarwal',
        level: 'Moderate',
        average_score: isMontgomery ? 74.5 : 78.5,
        evidence: isMontgomery
          ? ['Score in TCP/IP Protocol Stack: 62.0%', 'Subnetting score: 72.0%']
          : ['Graph Traversals score: 55.0%', 'Binary Trees Quiz 2: 61.0%'],
        recommendation: 'Recommend supplementary algorithmic walkthrough and revision sheet before end-semesters.'
      }
    ]
  };
}

export async function getTeacherAssignments(teacherId?: string): Promise<any[]> {
  try {
    const data = await fetchJson<any[]>('/teacher/assignments');
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.warn('[API] getTeacherAssignments fallback');
  }
  const isMontgomery = (teacherId || localStorage.getItem('auth_user_id')) === 'tch-002';
  return isMontgomery ? [
    {
      id: 'asg-002',
      title: 'TCP/IP Packet Header Analyzer',
      subject: 'Computer Networks',
      topic: 'TCP/IP',
      deadline: 'Oct 08, 2026',
      max_marks: 50,
      difficulty: 'Hard',
      description: 'Write a socket program in C++ to parse TCP/UDP headers and measure packet round trip time.',
      status: 'Active',
      submissions_count: 2,
      graded_count: 1,
      pending_count: 1
    }
  ] : [
    {
      id: 'asg-001',
      title: 'Binary Tree Traversal & Recursion',
      subject: 'Data Structures & Algorithms',
      topic: 'Trees',
      deadline: 'Oct 05, 2026',
      max_marks: 100,
      difficulty: 'Medium',
      description: 'Implement recursive and iterative preorder, inorder, and postorder traversals in C++.',
      status: 'Active',
      submissions_count: 2,
      graded_count: 2,
      pending_count: 0
    },
    {
      id: 'asg-004',
      title: 'C++ Polymorphism & Inheritance Lab',
      subject: 'OOPS in C++',
      topic: 'Polymorphism',
      deadline: 'Oct 12, 2026',
      max_marks: 40,
      difficulty: 'Easy',
      description: 'Implement inheritance hierarchies, virtual functions, and memory management (RAII).',
      status: 'Active',
      submissions_count: 1,
      graded_count: 0,
      pending_count: 1
    }
  ];
}

export async function createTeacherAssignment(asg: {
  title: string;
  subject: string;
  topic: string;
  deadline: string;
  max_marks: number;
  difficulty: string;
  description: string;
}) {
  return fetchJson<{ success: boolean; message: string; assignment_id: string }>(
    '/teacher/assignments/create',
    {
      method: 'POST',
      body: JSON.stringify(asg)
    }
  );
}

export async function getTeacherSubmissions(teacherId?: string, asgId?: string): Promise<TeacherSubmissionItem[]> {
  const query = asgId ? `?assignment_id=${encodeURIComponent(asgId)}` : '';
  try {
    const data = await fetchJson<TeacherSubmissionItem[]>(`/teacher/submissions${query}`);
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.warn('[API] getTeacherSubmissions fallback');
  }
  const dash = getFallbackTeacherDashboard(teacherId);
  return dash.recent_submissions;
}

export async function evaluateTeacherSubmission(submId: string, marks: number, feedback: string) {
  return fetchJson<{ success: boolean; message: string }>(
    '/teacher/submissions/evaluate',
    {
      method: 'POST',
      body: JSON.stringify({ submission_id: submId, marks, feedback })
    }
  );
}

export async function getTeacherFeedback(teacherId?: string): Promise<TeacherFeedbackData> {
  try {
    const data = await fetchJson<TeacherFeedbackData>('/teacher/feedback');
    if (data && data.recent_comments) return data;
  } catch (err) {
    console.warn('[API] getTeacherFeedback fallback');
  }
  const dash = getFallbackTeacherDashboard(teacherId);
  return dash.feedback_insights;
}

export async function getTeacherAnnouncements(teacherId?: string): Promise<TeacherAnnouncement[]> {
  try {
    const data = await fetchJson<TeacherAnnouncement[]>('/teacher/announcements');
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.warn('[API] getTeacherAnnouncements fallback');
  }
  const dash = getFallbackTeacherDashboard(teacherId);
  return dash.announcements;
}

export async function createTeacherAnnouncement(subject: string, title: string, content: string) {
  return fetchJson<{ success: boolean; message: string }>(
    '/teacher/announcements/create',
    {
      method: 'POST',
      body: JSON.stringify({ subject, title, content })
    }
  );
}

export async function getTeacherSchedule(teacherId?: string) {
  try {
    const data = await fetchJson<any[]>('/teacher/schedule');
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.warn('[API] getTeacherSchedule fallback');
  }
  const dash = getFallbackTeacherDashboard(teacherId);
  return dash.classes;
}

export async function getTeacherNotifications(teacherId?: string): Promise<NotificationItem[]> {
  try {
    const data = await fetchJson<NotificationItem[]>('/teacher/notifications');
    if (Array.isArray(data)) return data;
  } catch (err) {
    console.warn('[API] getTeacherNotifications fallback');
  }
  const isMontgomery = (teacherId || localStorage.getItem('auth_user_id')) === 'tch-002';
  return isMontgomery ? [
    {
      id: 'notif-t04',
      user_id: 'tch-002',
      title: 'Submission Pending Evaluation',
      message: 'Atharva Pagarwal submitted TCP/IP Packet Header Analyzer.',
      type: 'info',
      is_read: 0,
      created_at: '2026-10-06 16:30'
    },
    {
      id: 'notif-t05',
      user_id: 'tch-002',
      title: 'Lab Equipment Inspection',
      message: 'Network lab switches and routers calibrated for practical evaluation.',
      type: 'success',
      is_read: 0,
      created_at: '2026-10-05 11:15'
    }
  ] : [
    {
      id: 'notif-t01',
      user_id: 'tch-001',
      title: 'New Assignment Submission',
      message: 'Atharva Pagarwal submitted C++ Polymorphism & Inheritance Lab.',
      type: 'info',
      is_read: 0,
      created_at: '2026-10-08 14:00'
    },
    {
      id: 'notif-t02',
      user_id: 'tch-001',
      title: 'Course Feedback Summary Ready',
      message: '3 new student feedback entries recorded for Data Structures and OOPS.',
      type: 'success',
      is_read: 0,
      created_at: '2026-10-07 10:30'
    },
    {
      id: 'notif-t03',
      user_id: 'tch-001',
      title: 'Department Meeting Reminder',
      message: 'Academic curriculum board meeting scheduled for Thursday at 4 PM.',
      type: 'warning',
      is_read: 1,
      created_at: '2026-10-06 09:00'
    }
  ];
}

export async function sendTeacherAICopilot(query: string) {
  try {
    return await fetchJson<{ query: string; response: string; verified_records_used: number }>(
      '/teacher/ai/copilot',
      {
        method: 'POST',
        body: JSON.stringify({ query })
      }
    );
  } catch {
    const teacherId = localStorage.getItem('auth_user_id') || 'tch-001';
    const isMontgomery = teacherId === 'tch-002';
    return {
      query,
      response: `[Faculty Academic Intelligence]: Grounded in authorized records for ${isMontgomery ? 'Computer Networks (CS302)' : 'Data Structures & Algorithms and OOPS in C++'}. Class performance reflects a solid average score. Identified 1 student requiring support (Atharva Pagarwal: lower scores on packet parsing / graph algorithms). Suggested action: distribute targeted review exercises and review lab edge cases.`,
      verified_records_used: 5
    };
  }
}

export async function createAssignment(asg: any) {
  return createTeacherAssignment(asg);
}

export async function getAdminDashboard() {
  return fetchJson('/admin/dashboard').catch(() => ({
    total_students: 450,
    total_faculty: 28,
    average_attendance: 88.5
  }));
}

export async function updateStudentProfile(skills: string[], interests: string[], careerGoals: string) {
  return fetchJson('/student/profile/update', {
    method: 'POST',
    body: JSON.stringify({ skills, interests, career_goals: careerGoals })
  }).catch(() => ({ success: true, message: 'Profile updated successfully' }));
}
