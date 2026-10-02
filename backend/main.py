from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import json
import uuid
import os
from typing import List, Dict, Any

from database import get_db_connection, init_db
from models import (
    LoginRequest, UserResponse, AssignmentCreate, SubmissionSubmit,
    GradeSubmission, FeedbackSubmit, UpdateProfileSkills, AIChatRequest, StudyPlanRequest
)
from ai_engine import (
    FeedbackAIEngine, LearningAIEngine, RecommendationAIEngine, GenerativeAIEngine
)
from seed_data import seed_database

app = FastAPI(title="EduPulse AI Engine & API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    if not os.path.exists(os.path.join(os.path.dirname(__file__), "edupulse.db")):
        seed_database()
    else:
        init_db()

@app.get("/api/health")
def health_check():
    return {"status": "online", "platform": "EduPulse — AI-Powered Academic Intelligence"}

# AUTHENTICATION
@app.post("/api/auth/login")
def login(req: LoginRequest):
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE email = ?", (req.email,)).fetchone()
    conn.close()
    
    if not user:
        # Default mock fallback for demo emails
        if "teacher" in req.email or "sharma" in req.email:
            return {
                "token": "demo-jwt-teacher",
                "user": {"id": "tch-001", "name": "Prof. Rajesh Sharma", "email": req.email, "role": "TEACHER", "college": "VIT University", "course": "CS & Eng", "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"}
            }
        elif "admin" in req.email:
            return {
                "token": "demo-jwt-admin",
                "user": {"id": "adm-001", "name": "Dr. Sunita Deshmukh", "email": req.email, "role": "ADMIN", "college": "VIT University", "course": "Dean Academic Affairs", "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"}
            }
        else:
            return {
                "token": "demo-jwt-student",
                "user": {"id": "std-001", "name": "Atharva Pagarwal", "email": req.email, "role": "STUDENT", "college": "VIT University", "course": "B.Tech CS", "year": "3rd Year", "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            }
            
    return {
        "token": f"jwt-{user['id']}",
        "user": dict(user)
    }

# STUDENT DASHBOARD METRICS
@app.get("/api/student/dashboard/{student_id}")
def get_student_dashboard(student_id: str = "std-001"):
    conn = get_db_connection()
    profile = conn.execute("SELECT * FROM student_profiles WHERE user_id = ?", (student_id,)).fetchone()
    perf_records = conn.execute("SELECT * FROM performance_records WHERE student_id = ?", (student_id,)).fetchall()
    notifications = conn.execute("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5", (student_id,)).fetchall()
    opps = conn.execute("SELECT * FROM opportunities LIMIT 3").fetchall()
    conn.close()

    perf_list = [dict(p) for p in perf_records]
    gaps = LearningAIEngine.identify_learning_gaps(perf_list)

    opp_list = [dict(o) for o in opps]
    skills = json.loads(profile["skills"]) if profile and profile["skills"] else ["Python", "Machine Learning"]
    recommended_opps = RecommendationAIEngine.match_opportunities(skills, opp_list)

    return {
        "cgpa": profile["cgpa"] if profile else 8.2,
        "attendance": profile["attendance_pct"] if profile else 87.0,
        "assignment_completion": profile["assignment_completion_pct"] if profile else 80.0,
        "performance_trend": "Improving",
        "ai_insight": {
            "strongest_area": "Python Programming",
            "weakest_area": "Computer Networks — TCP/IP & Linear Transformations",
            "message": "Your strongest area is Python (86%). Your recent performance indicates that Computer Networks — particularly TCP/IP protocol stack — needs additional practice before the upcoming quiz."
        },
        "upcoming": [
            {"title": "DSA Assignment on Trees", "subject": "Data Structures", "deadline": "Oct 05, 2026", "type": "Assignment"},
            {"title": "Computer Networks Quiz", "subject": "Computer Networks", "deadline": "Oct 07, 2026", "type": "Quiz"},
            {"title": "Linear Algebra Midterm Test", "subject": "Mathematics", "deadline": "Oct 10, 2026", "type": "Exam"}
        ],
        "learning_gaps": gaps,
        "recommended_opportunities": recommended_opps[:3],
        "recent_notifications": [dict(n) for n in notifications]
    }

# PERFORMANCE ANALYTICS
@app.get("/api/student/performance/{student_id}")
def get_student_performance(student_id: str = "std-001"):
    conn = get_db_connection()
    records = conn.execute("SELECT * FROM performance_records WHERE student_id = ?", (student_id,)).fetchall()
    conn.close()

    subject_data = [
        {"subject": "Python", "score": 86},
        {"subject": "Data Structures", "score": 78},
        {"subject": "Computer Networks", "score": 72},
        {"subject": "Mathematics", "score": 61},
        {"subject": "DBMS", "score": 80}
    ]

    topic_hierarchy = {
        "Data Structures & Algorithms": [
            {"topic": "Arrays", "score": 84, "status": "Strong"},
            {"topic": "Linked Lists", "score": 78, "status": "Good"},
            {"topic": "Stacks & Queues", "score": 72, "status": "Moderate"},
            {"topic": "Trees", "score": 61, "status": "Weak"},
            {"topic": "Graphs", "score": 55, "status": "Weak"}
        ],
        "Computer Networks": [
            {"topic": "OSI Layer Model", "score": 88, "status": "Strong"},
            {"topic": "TCP/IP Stack", "score": 62, "status": "Weak"},
            {"topic": "Socket Programming", "score": 76, "status": "Good"},
            {"topic": "Subnetting & IP", "score": 72, "status": "Moderate"}
        ],
        "Mathematics — Linear Algebra": [
            {"topic": "Matrix Operations", "score": 75, "status": "Good"},
            {"topic": "Vector Spaces", "score": 68, "status": "Moderate"},
            {"topic": "Linear Transformations", "score": 58, "status": "Weak"}
        ]
    }

    trend_data = [
        {"assessment": "Test 1", "score": 71},
        {"assessment": "Quiz 1", "score": 74},
        {"assessment": "Midterm", "score": 76},
        {"assessment": "Quiz 2", "score": 82},
        {"assessment": "Assignment 4", "score": 79}
    ]

    return {
        "subject_scores": subject_data,
        "topic_hierarchy": topic_hierarchy,
        "trend": trend_data,
        "ai_analysis": "Your performance has improved by 8% over the last four assessments. However, your performance in Trees (61%) and Graphs (55%) remains below your overall average of 78.5%.",
        "gaps": {
            "high_priority": ["Linear Transformations", "TCP/IP Protocol Stack"],
            "medium_priority": ["Trees & Binary Search Trees", "Dynamic Programming"]
        }
    }

# ASSIGNMENT MANAGEMENT
@app.get("/api/assignments")
def get_assignments(student_id: str = "std-001"):
    conn = get_db_connection()
    assignments = conn.execute("SELECT * FROM assignments").fetchall()
    submissions = conn.execute("SELECT * FROM submissions WHERE student_id = ?", (student_id,)).fetchall()
    conn.close()

    subm_map = {s["assignment_id"]: dict(s) for s in submissions}
    res = []
    for a in assignments:
        a_dict = dict(a)
        subm = subm_map.get(a_dict["id"])
        if subm:
            a_dict["user_status"] = subm["status"]
            a_dict["grade"] = subm["marks"]
            a_dict["teacher_feedback"] = subm["teacher_feedback"]
            a_dict["ai_evaluation"] = json.loads(subm["ai_evaluation"]) if subm["ai_evaluation"] else None
        else:
            a_dict["user_status"] = "Pending" if a_dict["status"] == "Active" else "Overdue"
            a_dict["grade"] = None
            a_dict["teacher_feedback"] = None
            a_dict["ai_evaluation"] = None
        res.append(a_dict)

    return res

@app.post("/api/assignments/create")
def create_assignment(asg: AssignmentCreate):
    conn = get_db_connection()
    new_id = f"asg-{uuid.uuid4().hex[:6]}"
    conn.execute("""
    INSERT INTO assignments (id, title, subject, topic, deadline, max_marks, difficulty, description, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (new_id, asg.title, asg.subject, asg.topic, asg.deadline, asg.max_marks, asg.difficulty, asg.description, "Active"))
    conn.commit()
    conn.close()
    return {"message": "Assignment created successfully", "id": new_id}

@app.post("/api/assignments/submit")
def submit_assignment(subm: SubmissionSubmit, student_id: str = "std-001"):
    conn = get_db_connection()
    subm_id = f"subm-{uuid.uuid4().hex[:6]}"
    
    # Generate AI evaluation immediately
    eval_res = GenerativeAIEngine.evaluate_assignment(subm.code_content or "", "Submitted Topic")
    
    conn.execute("""
    INSERT INTO submissions (id, assignment_id, student_id, student_name, submitted_at, file_name, status, marks, teacher_feedback, ai_evaluation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (subm_id, subm.assignment_id, student_id, "Atharva Pagarwal", "Oct 02, 2026", subm.file_name, "Submitted", None, None, json.dumps(eval_res)))
    
    conn.commit()
    conn.close()
    return {"message": "Assignment submitted successfully!", "ai_evaluation": eval_res}

# ANONYMOUS FEEDBACK
@app.post("/api/feedback/submit")
def submit_feedback(fb: FeedbackSubmit):
    conn = get_db_connection()
    fb_id = f"fb-{uuid.uuid4().hex[:6]}"
    conn.execute("""
    INSERT INTO anonymous_feedback (id, subject, teacher_name, category, comment, teaching_rating, difficulty_rating, pace_rating, material_rating, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (fb_id, fb.subject, fb.teacher_name, fb.category, fb.comment, fb.teaching_rating, fb.difficulty_rating, fb.pace_rating, fb.material_rating, "2026-10-02"))
    conn.commit()
    conn.close()
    return {"message": "Feedback submitted anonymously! Your identity is not stored."}

@app.get("/api/feedback/analytics")
def get_feedback_analytics():
    conn = get_db_connection()
    feedback_rows = conn.execute("SELECT * FROM anonymous_feedback").fetchall()
    conn.close()
    
    fb_list = [dict(f) for f in feedback_rows]
    analysis = FeedbackAIEngine.analyze_feedback_batch(fb_list)
    return {
        "analysis": analysis,
        "recent_responses": fb_list
    }

# OPPORTUNITIES & RECOMMENDATIONS
@app.get("/api/opportunities")
def get_opportunities(student_id: str = "std-001"):
    conn = get_db_connection()
    profile = conn.execute("SELECT skills FROM student_profiles WHERE user_id = ?", (student_id,)).fetchone()
    opps = conn.execute("SELECT * FROM opportunities").fetchall()
    conn.close()

    skills = json.loads(profile["skills"]) if profile and profile["skills"] else ["Python", "Machine Learning", "Web Development"]
    opp_list = [dict(o) for o in opps]
    return RecommendationAIEngine.match_opportunities(skills, opp_list)

# AI ASSISTANT & STUDY PLAN
@app.post("/api/ai/chat")
def ai_chat(req: AIChatRequest, student_id: str = "std-001"):
    conn = get_db_connection()
    profile = conn.execute("SELECT * FROM student_profiles WHERE user_id = ?", (student_id,)).fetchone()
    conn.close()
    
    student_ctx = {
        "cgpa": profile["cgpa"] if profile else 8.2,
        "skills": json.loads(profile["skills"]) if profile and profile["skills"] else ["Python", "Machine Learning"]
    }
    
    answer = GenerativeAIEngine.answer_student_chat(req.query, student_ctx)
    return {"query": req.query, "response": answer}

@app.post("/api/ai/generate-plan")
def generate_study_plan(req: StudyPlanRequest, student_id: str = "std-001"):
    plan = GenerativeAIEngine.generate_study_plan("Atharva", ["TCP/IP Networking", "Trees & Graphs", "Linear Transformations"], req.duration_days)
    return plan

# TEACHER DASHBOARD & SUPPORT INDICATORS
@app.get("/api/teacher/dashboard")
def get_teacher_dashboard():
    conn = get_db_connection()
    students = conn.execute("SELECT * FROM users WHERE role = 'STUDENT'").fetchall()
    profiles = conn.execute("SELECT * FROM student_profiles").fetchall()
    conn.close()

    profile_map = {p["user_id"]: dict(p) for p in profiles}
    
    support_students = []
    for s in students:
        s_dict = dict(s)
        p = profile_map.get(s_dict["id"], {})
        rec = {
            "id": s_dict["id"],
            "name": s_dict["name"],
            "attendance_pct": p.get("attendance_pct", 85),
            "assignment_completion_pct": p.get("assignment_completion_pct", 80),
            "average_score": p.get("average_score", 75)
        }
        indicator = LearningAIEngine.detect_academic_support_need(rec)
        if indicator["support_level"] != "Low Support Indicator":
            support_students.append({**rec, **indicator})

    return {
        "total_students": len(students),
        "average_score": 74.5,
        "assignment_completion": 81.2,
        "attendance": 87.0,
        "learning_gaps": [
            {"topic": "Trees & BST", "priority": "High Priority", "avg_score": 61},
            {"topic": "Graph Algorithms", "priority": "High Priority", "avg_score": 55},
            {"topic": "Dynamic Programming", "priority": "Medium Priority", "avg_score": 68}
        ],
        "academic_support_list": support_students,
        "ai_class_insight": "Students are performing exceptionally well in basic Python and Data Structures (Arrays 84%), but show consistent learning gaps in recursive tree algorithms and TCP network packet routing."
    }

# ADMIN DASHBOARD
@app.get("/api/admin/dashboard")
def get_admin_dashboard():
    return {
        "total_students": 1240,
        "total_teachers": 48,
        "active_courses": 32,
        "assignments_created": 380,
        "feedback_responses": 1120,
        "active_opportunities": 85,
        "department_performance": [
            {"dept": "Computer Science", "score": 82},
            {"dept": "Information Tech", "score": 79},
            {"dept": "Mathematics", "score": 74},
            {"dept": "Electronics", "score": 76}
        ]
    }

# UPDATE STUDENT SKILLS
@app.post("/api/student/profile/update")
def update_profile(req: UpdateProfileSkills, student_id: str = "std-001"):
    conn = get_db_connection()
    conn.execute("""
    UPDATE student_profiles
    SET skills = ?, interests = ?, career_goals = ?
    WHERE user_id = ?
    """, (json.dumps(req.skills), json.dumps(req.interests), req.career_goals or "", student_id))
    conn.commit()
    conn.close()
    return {"message": "Profile updated successfully! Recommendation engine re-indexed."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
