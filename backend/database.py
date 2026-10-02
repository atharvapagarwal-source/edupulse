import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "edupulse.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        college TEXT,
        course TEXT,
        year TEXT,
        avatar_url TEXT
    );
    """)

    # Student Profiles
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_profiles (
        user_id TEXT PRIMARY KEY,
        cgpa REAL,
        attendance_pct REAL,
        assignment_completion_pct REAL,
        average_score REAL,
        skills TEXT,
        interests TEXT,
        career_goals TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)

    # Teacher Profiles
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS teacher_profiles (
        user_id TEXT PRIMARY KEY,
        department TEXT,
        designation TEXT,
        subjects_taught TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    """)

    # Subjects
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        description TEXT,
        teacher_id TEXT
    );
    """)

    # Assignments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assignments (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        topic TEXT NOT NULL,
        deadline TEXT NOT NULL,
        max_marks INTEGER NOT NULL,
        difficulty TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL
    );
    """)

    # Submissions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        assignment_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        student_name TEXT NOT NULL,
        submitted_at TEXT NOT NULL,
        file_name TEXT,
        status TEXT NOT NULL,
        marks INTEGER,
        teacher_feedback TEXT,
        ai_evaluation TEXT,
        FOREIGN KEY(assignment_id) REFERENCES assignments(id)
    );
    """)

    # Performance / Marks Records
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS performance_records (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        topic TEXT NOT NULL,
        score_pct REAL NOT NULL,
        date TEXT NOT NULL
    );
    """)

    # Anonymous Feedback
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS anonymous_feedback (
        id TEXT PRIMARY KEY,
        subject TEXT NOT NULL,
        teacher_name TEXT NOT NULL,
        category TEXT NOT NULL,
        comment TEXT NOT NULL,
        teaching_rating INTEGER,
        difficulty_rating INTEGER,
        pace_rating INTEGER,
        material_rating INTEGER,
        created_at TEXT NOT NULL
    );
    """)

    # Opportunities
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS opportunities (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        organization TEXT NOT NULL,
        type TEXT NOT NULL,
        deadline TEXT NOT NULL,
        eligibility TEXT NOT NULL,
        required_skills TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL
    );
    """)

    # Study Plans
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS study_plans (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        title TEXT NOT NULL,
        duration_days INTEGER NOT NULL,
        schedule TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    """)

    # Notifications
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    );
    """)

    # Saved Opportunities
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saved_opportunities (
        student_id TEXT NOT NULL,
        opportunity_id TEXT NOT NULL,
        PRIMARY KEY (student_id, opportunity_id)
    );
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
