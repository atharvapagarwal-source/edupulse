import { User, Assignment, Opportunity, NotificationItem, FeedbackAnalytics, FeedbackItem, AcademicSupportStudent, StudyPlan } from '../types';

const API_BASE = '/api';

export async function fetchJson<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call failed for ${url}, using fallback demo data:`, err);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw err;
  }
}

// Student APIs
export async function getStudentDashboard(studentId: string = 'std-001') {
  return fetchJson(`/student/dashboard/${studentId}`, undefined, {
    cgpa: 8.2,
    attendance: 87.0,
    assignment_completion: 80.0,
    performance_trend: 'Improving',
    ai_insight: {
      strongest_area: 'Python Programming (86%)',
      weakest_area: 'Computer Networks — TCP/IP & Linear Transformations',
      message: 'Your strongest area is Python (86%). Your recent performance indicates that Computer Networks — particularly TCP/IP protocol stack — needs additional practice.'
    },
    upcoming: [
      { title: 'DSA Assignment on Trees', subject: 'Data Structures', deadline: 'Oct 05, 2026', type: 'Assignment' },
      { title: 'Computer Networks Quiz', subject: 'Computer Networks', deadline: 'Oct 07, 2026', type: 'Quiz' },
      { title: 'Linear Algebra Midterm Test', subject: 'Mathematics', deadline: 'Oct 10, 2026', type: 'Exam' }
    ],
    learning_gaps: {
      high_priority: ['Linear Transformations', 'TCP/IP Protocol Stack'],
      medium_priority: ['Trees & Binary Search Trees', 'Dynamic Programming']
    },
    recommended_opportunities: [
      {
        id: 'opp-001',
        title: 'National AI & Machine Learning Hackathon 2026',
        organization: 'TechVision Foundation',
        type: 'Hackathon',
        deadline: 'Oct 25, 2026',
        eligibility: 'Open to all B.Tech Undergrads',
        required_skills: 'Python, Machine Learning, Web Development',
        location: 'Online / Hybrid',
        description: 'Build innovative AI SaaS solutions for real-world problems. $10,000 prize pool.',
        match_score: 94,
        matched_skills: ['Python', 'Machine Learning'],
        recommendation_reason: 'You have Python and Machine Learning skills and meet the listed student eligibility requirements.'
      },
      {
        id: 'opp-002',
        title: 'Summer Data Science & AI Internship',
        organization: 'Apex Analytics Research',
        type: 'Internship',
        deadline: 'Nov 15, 2026',
        eligibility: '3rd Year CS Students',
        required_skills: 'Python, SQL, Data Structures',
        location: 'Bangalore / Remote',
        description: 'Paid 3-month summer internship working with production ML pipelines.',
        match_score: 88,
        matched_skills: ['Python', 'SQL'],
        recommendation_reason: 'Matches your core skills (Python, SQL) and academic standing.'
      }
    ],
    recent_notifications: []
  });
}

export async function getStudentPerformance(studentId: string = 'std-001') {
  return fetchJson(`/student/performance/${studentId}`);
}

export async function getAssignments(studentId: string = 'std-001') {
  return fetchJson<Assignment[]>(`/assignments?student_id=${studentId}`);
}

export async function submitAssignment(assignmentId: string, fileName: string, codeContent: string) {
  return fetchJson(`/assignments/submit`, {
    method: 'POST',
    body: JSON.stringify({ assignment_id: assignmentId, file_name: fileName, code_content: codeContent })
  });
}

export async function createAssignment(asg: any) {
  return fetchJson(`/assignments/create`, {
    method: 'POST',
    body: JSON.stringify(asg)
  });
}

export async function submitAnonymousFeedback(feedback: any) {
  return fetchJson(`/feedback/submit`, {
    method: 'POST',
    body: JSON.stringify(feedback)
  });
}

export async function getFeedbackAnalytics() {
  return fetchJson<{ analysis: FeedbackAnalytics; recent_responses: FeedbackItem[] }>(`/feedback/analytics`);
}

export async function getOpportunities(studentId: string = 'std-001') {
  return fetchJson<Opportunity[]>(`/opportunities?student_id=${studentId}`);
}

export async function sendAIChat(query: string, studentId: string = 'std-001') {
  return fetchJson<{ query: string; response: string }>(`/ai/chat`, {
    method: 'POST',
    body: JSON.stringify({ query })
  });
}

export async function generateStudyPlan(durationDays: number = 7, studentId: string = 'std-001') {
  return fetchJson<StudyPlan>(`/ai/generate-plan`, {
    method: 'POST',
    body: JSON.stringify({ duration_days: durationDays })
  });
}

export async function getTeacherDashboard() {
  return fetchJson(`/teacher/dashboard`);
}

export async function getAdminDashboard() {
  return fetchJson(`/admin/dashboard`);
}

export async function updateStudentProfile(skills: string[], interests: string[], careerGoals: string) {
  return fetchJson(`/student/profile/update`, {
    method: 'POST',
    body: JSON.stringify({ skills, interests, career_goals: careerGoals })
  });
}
