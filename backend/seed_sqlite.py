import sqlite3
import json
import random

def seed():
    conn = sqlite3.connect("backend/edupulse.db")
    c = conn.cursor()
    
    # Create tables
    c.executescript("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL, college TEXT, course TEXT, year TEXT, avatar_url TEXT
    );
    CREATE TABLE IF NOT EXISTS student_profiles (
        user_id TEXT PRIMARY KEY, cgpa REAL, attendance_pct REAL,
        assignment_completion_pct REAL, average_score REAL, skills TEXT,
        interests TEXT, career_goals TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS teacher_profiles (
        user_id TEXT PRIMARY KEY, department TEXT, designation TEXT,
        subjects_taught TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, code TEXT NOT NULL,
        description TEXT, teacher_id TEXT
    );
    CREATE TABLE IF NOT EXISTS assignments (
        id TEXT PRIMARY KEY, title TEXT NOT NULL, subject TEXT NOT NULL,
        topic TEXT, deadline TEXT, max_marks INTEGER, difficulty TEXT,
        description TEXT, status TEXT
    );
    CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY, assignment_id TEXT, student_id TEXT,
        student_name TEXT, submitted_at TEXT, file_name TEXT,
        status TEXT, marks REAL, max_marks REAL, teacher_feedback TEXT,
        ai_evaluation TEXT
    );
    CREATE TABLE IF NOT EXISTS performance_records (
        id TEXT PRIMARY KEY, student_id TEXT, subject TEXT,
        topic TEXT, score REAL, assessment_date TEXT
    );
    CREATE TABLE IF NOT EXISTS anonymous_feedback (
        id TEXT PRIMARY KEY, subject TEXT, teacher_name TEXT,
        category TEXT, comment TEXT, teaching_rating INTEGER,
        difficulty_rating INTEGER, pace_rating INTEGER, material_rating INTEGER,
        created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS opportunities (
        id TEXT PRIMARY KEY, title TEXT, organization TEXT,
        type TEXT, deadline TEXT, eligibility TEXT,
        required_skills TEXT, location TEXT, description TEXT
    );
    CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY, user_id TEXT, title TEXT,
        message TEXT, type TEXT, is_read INTEGER, created_at TEXT
    );
    """)

    # Clear old data
    for t in ["users", "student_profiles", "teacher_profiles", "subjects", "assignments", "submissions", "performance_records", "anonymous_feedback", "opportunities", "notifications"]:
        c.execute(f"DELETE FROM {t}")

    # Seed Atharva
    student_id = "std-001"
    c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
        student_id, "Atharva Pagarwal", "atharva@edupulse.edu", "STUDENT", "VIT University", "B.Tech Computer Science", "3rd Year", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    ))
    c.execute("INSERT INTO student_profiles VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
        student_id, 8.2, 87.0, 80.0, 78.5,
        json.dumps(["Python", "Machine Learning", "Web Development", "Data Structures", "SQL"]),
        json.dumps(["Artificial Intelligence", "Cloud Computing", "Cybersecurity", "Open Source"]),
        "Aiming to become an AI Software Engineer at a top EdTech/Tech SaaS product company."
    ))

    # Other students
    students_demo = [
        ("std-002", "Riya Sharma", "riya@edupulse.edu", 9.1, 94.0, 95.0, 91.0, ["Python", "React", "Node.js"], "Software Engineer"),
        ("std-003", "Aarav Patel", "aarav@edupulse.edu", 7.4, 76.0, 70.0, 68.0, ["Java", "C++", "SQL"], "Backend Developer"),
        ("std-004", "Ananya Verma", "ananya@edupulse.edu", 8.8, 91.0, 90.0, 86.5, ["Python", "R", "Statistics"], "Data Scientist"),
        ("std-005", "Kabir Singh", "kabir@edupulse.edu", 6.2, 65.0, 55.0, 58.0, ["HTML", "CSS", "Python"], "Frontend Dev")
    ]
    for s_id, s_name, s_email, s_cgpa, s_att, s_comp, s_avg, s_skills, s_goal in students_demo:
        c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
            s_id, s_name, s_email, "STUDENT", "VIT University", "B.Tech Computer Science", "3rd Year",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        ))
        c.execute("INSERT INTO student_profiles VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
            s_id, s_cgpa, s_att, s_comp, s_avg, json.dumps(s_skills), json.dumps(["AI", "Web Dev"]), s_goal
        ))

    # Teachers
    teachers = [
        ("tch-001", "Prof. Rajesh Sharma", "sharma@edupulse.edu", "Computer Science & Engineering", "Senior Associate Professor", ["Data Structures & Algorithms", "Python Programming"]),
        ("tch-002", "Dr. Vance Montgomery", "vance@edupulse.edu", "Computer Science & Engineering", "Professor", ["Computer Networks", "Cyber Security"])
    ]
    for t_id, t_name, t_email, t_dept, t_desig, t_subs in teachers:
        c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
            t_id, t_name, t_email, "TEACHER", "VIT University", "School of Computer Science", "Faculty",
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
        ))
        c.execute("INSERT INTO teacher_profiles VALUES (?, ?, ?, ?)", (
            t_id, t_dept, t_desig, json.dumps(t_subs)
        ))

    # Admin
    c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
        "adm-001", "Dr. Sunita Deshmukh", "admin@edupulse.edu", "ADMIN", "VIT University", "Academic Affairs", "Dean",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    ))

    # Assignments
    assignments = [
        ("asg-001", "Binary Tree Traversal & Recursion", "Data Structures & Algorithms", "Trees", "Oct 05, 2026", 100, "Medium", "Implement recursive and iterative preorder, inorder, and postorder traversals in C++.", "Active"),
        ("asg-002", "TCP/IP Packet Header Analyzer", "Computer Networks", "TCP/IP", "Oct 08, 2026", 50, "Hard", "Write a socket program in C++ to parse TCP/UDP headers and measure packet round trip time.", "Active"),
        ("asg-003", "Linear Transformation Matrix Operations", "Mathematics — Linear Algebra", "Linear Transformations", "Oct 10, 2026", 50, "Medium", "Solve vector space transformation matrices and compute eigenvectors.", "Active"),
        ("asg-004", "Object-Oriented Design in C++", "Data Structures & Algorithms", "OOP Design", "Oct 12, 2026", 40, "Easy", "Implement inheritance, virtual methods, and encapsulation.", "Active")
    ]
    for asg in assignments:
        c.execute("INSERT INTO assignments VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", asg)

    # Submissions
    submissions = [
        ("subm-001", "asg-001", student_id, "Atharva Pagarwal", "Oct 02, 2026", "binary_tree.cpp", "Submitted", 85, "Clean C++ implementation using recursion.", json.dumps({"score": 85, "quality": "High"}))
    ]
    for subm in submissions:
        c.execute("INSERT INTO submissions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", subm)

    # Opportunities
    opps = [
        ("opp-001", "National AI & Machine Learning Hackathon 2026", "TechVision Foundation", "Hackathon", "Oct 25, 2026", "Open to all Undergrads", "Python, C++, Machine Learning", "Online / Hybrid", "Build innovative AI solutions. $10,000 prize pool."),
        ("opp-002", "ACM Collegiate Algorithmic CodeSprint", "ACM Chapter", "Competition", "Oct 18, 2026", "CS Students", "C++, Data Structures, Algorithms", "University Campus", "Solve 8 complex algorithmic challenges in 4 hours.")
    ]
    for opp in opps:
        c.execute("INSERT INTO opportunities VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", opp)

    # Feedback
    feedbacks = [
        ("fb-001", "Computer Networks", "Dr. Vance Montgomery", "Teaching Pace", "The lecture pace on TCP was good, practical packet trace examples helped.", 4, 3, 3, 4, "2026-10-02"),
        ("fb-002", "Data Structures & Algorithms", "Prof. Rajesh Sharma", "Course Difficulty", "Trees and Graph algorithms are well explained.", 5, 4, 3, 5, "2026-10-03")
    ]
    for fb in feedbacks:
        c.execute("INSERT INTO anonymous_feedback VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", fb)

    # Notifications
    notifs = [
        ("notif-001", student_id, "Upcoming Deadline Alert", "DSA Assignment on Binary Tree Traversal is due on Oct 5 at 11:59 PM.", "warning", 0, "2026-10-02 09:30"),
        ("notif-002", student_id, "New High-Match Opportunity", "ACM Collegiate CodeSprint matches your C++ and DSA skills.", "info", 0, "2026-10-01 14:15")
    ]
    for n in notifs:
        c.execute("INSERT INTO notifications VALUES (?, ?, ?, ?, ?, ?, ?)", n)

    conn.commit()
    conn.close()
    print("SQLite seeded successfully!")

if __name__ == "__main__":
    seed()
