import sqlite3
import json
import uuid
import os
import random
from database import get_db_connection, init_db


def seed_database():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing data to ensure clean seed
    tables = [
        "users", "student_profiles", "teacher_profiles", "subjects",
        "assignments", "submissions", "performance_records", "anonymous_feedback",
        "opportunities", "study_plans", "notifications"
    ]
    for t in tables:
        cursor.execute(f"DELETE FROM {t};")

    print("Seeding Users & Profiles...")

    # 1. Primary Student: Atharva Pagarwal
    student_id = "std-001"
    cursor.execute("""
    INSERT INTO users (id, name, email, role, college, course, year, avatar_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """, (student_id, "Atharva Pagarwal", "atharva@edupulse.edu", "STUDENT", "VIT University", "B.Tech Computer Science", "3rd Year", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"))

    cursor.execute("""
    INSERT INTO student_profiles (user_id, cgpa, attendance_pct, assignment_completion_pct, average_score, skills, interests, career_goals)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        student_id, 8.2, 87.0, 80.0, 78.5,
        json.dumps(["Python", "Machine Learning", "Web Development", "Data Structures", "SQL"]),
        json.dumps(["Artificial Intelligence", "Cloud Computing", "Cybersecurity", "Open Source"]),
        "Aiming to become an AI Software Engineer at a top EdTech/Tech SaaS product company."
    ))

    # Additional Demo Students
    students_demo = [
        ("std-002", "Riya Sharma", "riya@edupulse.edu", 9.1, 94.0, 95.0, 91.0, ["Python", "React", "Node.js"], "Software Engineer"),
        ("std-003", "Aarav Patel", "aarav@edupulse.edu", 7.4, 76.0, 70.0, 68.0, ["Java", "C++", "SQL"], "Backend Developer"),
        ("std-004", "Ananya Verma", "ananya@edupulse.edu", 8.8, 91.0, 90.0, 86.5, ["Python", "R", "Statistics"], "Data Scientist"),
        ("std-005", "Kabir Singh", "kabir@edupulse.edu", 6.2, 65.0, 55.0, 58.0, ["HTML", "CSS", "Python"], "Frontend Dev"),
        ("std-006", "Sneha Gupta", "sneha@edupulse.edu", 7.9, 82.0, 85.0, 77.0, ["Java", "Android", "Kotlin"], "Mobile App Developer"),
        ("std-007", "Devansh Joshi", "devansh@edupulse.edu", 8.5, 89.0, 88.0, 83.0, ["Python", "Django", "PostgreSQL"], "Full Stack Dev"),
        ("std-008", "Priya Nair", "priya@edupulse.edu", 6.8, 71.0, 60.0, 62.5, ["C", "C++", "Linux"], "Systems Engineer"),
        ("std-009", "Rohan Mehta", "rohan@edupulse.edu", 8.0, 84.0, 82.0, 79.0, ["Python", "TensorFlow", "AWS"], "MLOps Engineer"),
        ("std-010", "Isha Kulkarni", "isha@edupulse.edu", 9.4, 96.0, 100.0, 94.5, ["Python", "Deep Learning", "NLP"], "AI Researcher")
    ]

    for s_id, s_name, s_email, s_cgpa, s_att, s_comp, s_avg, s_skills, s_goal in students_demo:
        cursor.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
            s_id, s_name, s_email, "STUDENT", "VIT University", "B.Tech Computer Science", "3rd Year",
            f"https://images.unsplash.com/photo-{1500000000000 + random.randint(1000, 9999)}?w=150&auto=format&fit=crop&q=80"
        ))
        cursor.execute("INSERT INTO student_profiles VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
            s_id, s_cgpa, s_att, s_comp, s_avg, json.dumps(s_skills), json.dumps(["AI", "Web Dev"]), s_goal
        ))

    # 2. Teachers
    teachers = [
        ("tch-001", "Prof. Rajesh Sharma", "sharma@edupulse.edu", "Computer Science & Engineering", "Senior Associate Professor", ["Data Structures & Algorithms", "Python Programming"]),
        ("tch-002", "Dr. Vance Montgomery", "vance@edupulse.edu", "Computer Science & Engineering", "Professor", ["Computer Networks", "Cyber Security"]),
        ("tch-003", "Dr. Meera Iyer", "meera@edupulse.edu", "Mathematics", "Associate Professor", ["Linear Algebra & Discrete Maths", "Calculus"]),
        ("tch-004", "Prof. Vikram Malhotra", "vikram@edupulse.edu", "Information Technology", "Assistant Professor", ["Database Management Systems", "Cloud Computing"])
    ]

    for t_id, t_name, t_email, t_dept, t_desig, t_subs in teachers:
        cursor.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
            t_id, t_name, t_email, "TEACHER", "VIT University", "School of Computer Science", "Faculty",
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
        ))
        cursor.execute("INSERT INTO teacher_profiles VALUES (?, ?, ?, ?)", (
            t_id, t_dept, t_desig, json.dumps(t_subs)
        ))

    # 3. Admin User
    admin_id = "adm-001"
    cursor.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
        admin_id, "Dr. Sunita Deshmukh", "admin@edupulse.edu", "ADMIN", "VIT University", "Academic Affairs", "Dean",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    ))

    # 4. Subjects
    subjects = [
        ("sub-101", "Data Structures & Algorithms", "CS201", "Fundamental data structures, trees, graphs, sorting and algorithm complexity analysis.", "tch-001"),
        ("sub-102", "Computer Networks", "CS302", "OSI & TCP/IP stack, routing protocols, socket programming, packet analysis.", "tch-002"),
        ("sub-103", "Python Programming", "CS105", "Python syntax, object-oriented concepts, data analysis with NumPy/Pandas.", "tch-001"),
        ("sub-104", "Mathematics — Linear Algebra", "MA202", "Matrices, vector spaces, linear transformations, eigenvalues and eigenvectors.", "tch-003"),
        ("sub-105", "Database Management Systems", "CS204", "Relational algebra, SQL queries, normalization, indexing, transaction processing.", "tch-004")
    ]

    for s_id, s_name, s_code, s_desc, t_id in subjects:
        cursor.execute("INSERT INTO subjects VALUES (?, ?, ?, ?, ?)", (s_id, s_name, s_code, s_desc, t_id))

    # 5. Assignments (20+)
    assignments = [
        ("asg-001", "Binary Tree Traversal & Recursion", "Data Structures & Algorithms", "Trees", "Oct 05, 2026", 100, "Medium", "Implement recursive and iterative preorder, inorder, and postorder traversals in Python/C++.", "Active"),
        ("asg-002", "TCP/IP Packet Header Analyzer", "Computer Networks", "TCP/IP", "Oct 08, 2026", 50, "Hard", "Write a socket program to parse TCP/UDP headers and measure packet round trip time.", "Active"),
        ("asg-003", "Linear Transformation Matrix Operations", "Mathematics — Linear Algebra", "Linear Transformations", "Oct 10, 2026", 50, "Medium", "Solve vector space transformation matrices and compute eigenvectors.", "Active"),
        ("asg-004", "Python Pandas & Data Cleaning Lab", "Python Programming", "Data Analysis", "Oct 12, 2026", 40, "Easy", "Process CSV datasets, remove duplicate entries, and visualize statistical metrics.", "Active"),
        ("asg-005", "SQL Complex Queries & Joins", "Database Management Systems", "SQL Joins", "Oct 15, 2026", 100, "Medium", "Construct nested SQL queries involving INNER JOIN, GROUP BY, and HAVING clauses.", "Active"),
        ("asg-006", "Graph Shortest Path Dijkstra Algorithm", "Data Structures & Algorithms", "Graphs", "Sep 28, 2026", 100, "Hard", "Implement Dijkstra's algorithm using priority queue in Python.", "Closed"),
        ("asg-007", "Subnet Masking & IP Addressing Lab", "Computer Networks", "Subnetting", "Sep 22, 2026", 50, "Medium", "Calculate subnet ranges, broadcast addresses, and CIDR prefix notation.", "Closed"),
        ("asg-008", "OOP Design Patterns in Python", "Python Programming", "Object Oriented Design", "Sep 20, 2026", 60, "Medium", "Implement Singleton and Factory design patterns with unit test assertions.", "Closed"),
        ("asg-009", "B-Tree Indexing Simulation", "Database Management Systems", "Indexing", "Sep 15, 2026", 100, "Hard", "Demonstrate B+ Tree node splitting and search query cost reductions.", "Closed"),
        ("asg-010", "Eigenvalues & Eigenvectors Application", "Mathematics — Linear Algebra", "Eigenvalues", "Sep 10, 2026", 50, "Hard", "Apply Principal Component Analysis transformation using covariance matrix decomposition.", "Closed"),
        ("asg-011", "Dynamic Programming Memoization", "Data Structures & Algorithms", "Dynamic Programming", "Oct 20, 2026", 100, "Hard", "Solve 0/1 Knapsack problem using bottom-up tabulation approach.", "Active"),
        ("asg-012", "DNS Resolution & Socket Server", "Computer Networks", "Application Layer", "Oct 22, 2026", 50, "Medium", "Create a multi-threaded Python TCP server handling custom client requests.", "Active"),
        ("asg-013", "Relational Normalization 3NF & BCNF", "Database Management Systems", "Normalization", "Oct 25, 2026", 60, "Medium", "Decompose 1NF tables into 3NF and BCNF to eliminate insertion anomalies.", "Active"),
        ("asg-014", "Decorators & Generators in Python", "Python Programming", "Advanced Python", "Oct 18, 2026", 40, "Easy", "Write custom function execution timer decorators and memory-efficient generators.", "Active"),
        ("asg-015", "Vector Space & Subspaces Proofs", "Mathematics — Linear Algebra", "Vector Spaces", "Oct 28, 2026", 50, "Medium", "Prove linear independence and span for a set of given 3D vectors.", "Active"),
        ("asg-016", "Array & Linked List Benchmark", "Data Structures & Algorithms", "Arrays", "Sep 05, 2026", 50, "Easy", "Measure execution time for element insertion at head vs tail.", "Closed"),
        ("asg-017", "HTTP GET/POST Client from Scratch", "Computer Networks", "HTTP Protocol", "Sep 01, 2026", 40, "Easy", "Send raw HTTP socket requests to server and render HTML body.", "Closed"),
        ("asg-018", "Python Exception Handling & I/O", "Python Programming", "File I/O", "Aug 28, 2026", 30, "Easy", "Handle file not found and value errors gracefully with log output.", "Closed"),
        ("asg-019", "ER Diagram to Relational Schema", "Database Management Systems", "ER Modeling", "Aug 25, 2026", 80, "Easy", "Convert an e-commerce enterprise ER diagram into DDL SQL script.", "Closed"),
        ("asg-020", "Matrix Multiplication Performance", "Mathematics — Linear Algebra", "Matrices", "Aug 20, 2026", 50, "Medium", "Compare Strassen matrix multiplication against standard O(N^3) method.", "Closed")
    ]

    for asg in assignments:
        cursor.execute("INSERT INTO assignments VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", asg)

    # 6. Submissions (Atharva + Demo Students)
    submissions = [
        ("subm-001", "asg-006", student_id, "Atharva Pagarwal", "Sep 27, 2026", "dijkstra_impl.py", "Graded", 86, 100, "Excellent code organization and efficient heap queue implementation. Minor missing comment headers.", json.dumps({
            "correctness_score": 86, "code_quality": "High", "complexity_analysis": "O(E log V)", "missing_edge_cases": ["Disconnected graph component check"], "ai_feedback": "Implementation is clean. Add validation for disconnected nodes."
        })),
        ("subm-002", "asg-007", student_id, "Atharva Pagarwal", "Sep 21, 2026", "subnet_calc.py", "Graded", 38, 50, "Good grasp of CIDR notation, but subnet mask calculation for /27 had minor arithmetic errors.", json.dumps({
            "correctness_score": 76, "code_quality": "Medium", "complexity_analysis": "O(1)", "missing_edge_cases": ["Broadcast address calculation"], "ai_feedback": "Subnet calculations accurate except bitwise mask inversion."
        })),
        ("subm-003", "asg-008", student_id, "Atharva Pagarwal", "Sep 19, 2026", "design_patterns.py", "Graded", 56, 60, "Flawless implementation of Singleton and Factory design pattern.", json.dumps({
            "correctness_score": 93, "code_quality": "Excellent", "complexity_analysis": "O(1)", "missing_edge_cases": [], "ai_feedback": "Thread-safe singleton implementation verified."
        })),
        ("subm-004", "asg-001", student_id, "Atharva Pagarwal", "Oct 02, 2026", "binary_tree.py", "Pending", None, 100, None, json.dumps({
            "correctness_score": 82, "code_quality": "Good", "complexity_analysis": "O(N) Time, O(H) Space", "missing_edge_cases": ["Empty root tree node", "Duplicate node key insertion"], "ai_feedback": "Your implementation handles the main case correctly, but additional handling is required for empty input and duplicate values."
        }))
    ]

    for subm in submissions:
        cursor.execute("INSERT INTO submissions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", subm)

    # 7. Performance Records (Subject & Topic Marks for Atharva)
    performance = [
        ("perf-001", student_id, "Data Structures & Algorithms", "Arrays", 84.0, "2026-09-05"),
        ("perf-002", student_id, "Data Structures & Algorithms", "Linked Lists", 78.0, "2026-09-12"),
        ("perf-003", student_id, "Data Structures & Algorithms", "Stacks & Queues", 72.0, "2026-09-18"),
        ("perf-004", student_id, "Data Structures & Algorithms", "Trees", 61.0, "2026-09-25"),
        ("perf-005", student_id, "Data Structures & Algorithms", "Graphs", 55.0, "2026-09-28"),

        ("perf-006", student_id, "Computer Networks", "OSI Model", 88.0, "2026-09-02"),
        ("perf-007", student_id, "Computer Networks", "TCP/IP Protocol", 62.0, "2026-09-15"),
        ("perf-008", student_id, "Computer Networks", "Socket Programming", 76.0, "2026-09-22"),
        ("perf-009", student_id, "Computer Networks", "Subnetting", 72.0, "2026-09-29"),

        ("perf-010", student_id, "Python Programming", "Syntax & Data Types", 94.0, "2026-08-30"),
        ("perf-011", student_id, "Python Programming", "OOP Concepts", 88.0, "2026-09-10"),
        ("perf-012", student_id, "Python Programming", "Pandas & Data Analysis", 86.0, "2026-09-20"),

        ("perf-013", student_id, "Mathematics — Linear Algebra", "Matrix Operations", 75.0, "2026-09-08"),
        ("perf-014", student_id, "Mathematics — Linear Algebra", "Vector Spaces", 68.0, "2026-09-16"),
        ("perf-015", student_id, "Mathematics — Linear Algebra", "Linear Transformations", 58.0, "2026-09-26")
    ]

    for p in performance:
        cursor.execute("INSERT INTO performance_records VALUES (?, ?, ?, ?, ?, ?)", p)

    # 8. Anonymous Feedback (15+ items for Teachers to analyze)
    feedback_entries = [
        ("fb-001", "Computer Networks", "Dr. Vance Montgomery", "Teaching Pace", "The lecture pace on TCP congestion control was a bit fast. Would appreciate more practical packet trace examples.", 4, 3, 2, 4, "2026-09-28"),
        ("fb-002", "Data Structures & Algorithms", "Prof. Rajesh Sharma", "Course Difficulty", "Trees and Graph algorithms are being covered very quickly. A supplementary review session on recursion would help immensely.", 5, 4, 2, 5, "2026-09-29"),
        ("fb-003", "Mathematics — Linear Algebra", "Dr. Meera Iyer", "Study Material", "The linear transformation notes are very clear, but we need more solved practice problems before the midterms.", 4, 4, 3, 3, "2026-09-30"),
        ("fb-004", "Python Programming", "Prof. Rajesh Sharma", "Teaching", "Great hands-on coding demos in class! Love how real-world data science examples are integrated.", 5, 2, 4, 5, "2026-09-27"),
        ("fb-005", "Computer Networks", "Dr. Vance Montgomery", "Assignments", "The socket programming assignment was challenging but very rewarding.", 4, 4, 3, 4, "2026-09-26"),
        ("fb-006", "Database Management Systems", "Prof. Vikram Malhotra", "Teaching Pace", "SQL Join queries were explained thoroughly. Really liked the interactive SQL whiteboard.", 5, 3, 4, 5, "2026-09-25"),
        ("fb-007", "Data Structures & Algorithms", "Prof. Rajesh Sharma", "Teaching Pace", "Please slow down when explaining time complexity derivations for recursive divide-and-conquer algorithms.", 3, 4, 2, 3, "2026-09-24"),
        ("fb-008", "Mathematics — Linear Algebra", "Dr. Meera Iyer", "Course Difficulty", "Eigenvalues matrix proof was hard to follow without step-by-step intermediate calculations.", 3, 5, 2, 3, "2026-09-23"),
        ("fb-009", "Computer Networks", "Dr. Vance Montgomery", "Infrastructure", "Lab computers had outdated Wireshark versions which caused minor packet capture issues.", 3, 3, 3, 3, "2026-09-22"),
        ("fb-010", "Python Programming", "Prof. Rajesh Sharma", "Study Material", "Submitting code via EduPulse platform is so much smoother than email attachments!", 5, 2, 4, 5, "2026-09-21")
    ]

    for fb in feedback_entries:
        cursor.execute("INSERT INTO anonymous_feedback VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", fb)

    # 9. Opportunities (15+)
    opportunities = [
        ("opp-001", "National AI & Machine Learning Hackathon 2026", "TechVision Foundation", "Hackathon", "Oct 25, 2026", "Open to all B.Tech / CS Undergrads", "Python, Machine Learning, Web Development, SQL", "Online / Hybrid", "Build innovative AI SaaS solutions for real-world problems. $10,000 prize pool and fast-track internship interviews."),
        ("opp-002", "Summer Data Science & AI Internship", "Apex Analytics Research", "Internship", "Nov 15, 2026", "3rd & 4th Year CS / Data Science Students", "Python, SQL, Machine Learning, Data Structures", "Bangalore / Remote", "Paid 3-month summer internship working with production ML pipelines and large data processing."),
        ("opp-003", "Women & Tech Future Leadership Scholarship", "Global EdTech Initiative", "Scholarship", "Nov 01, 2026", "Undergraduate Tech Students with CGPA > 8.0", "Python, React, Cloud Computing", "Global / Remote", "$5,000 academic grant and 1-on-1 industry mentorship for high-performing engineering candidates."),
        ("opp-004", "ACM Collegiate Algorithmic CodeSprint", "ACM Student Chapter", "Competition", "Oct 18, 2026", "Enrolled Engineering Students", "Data Structures, C++, Python, Algorithms", "University Campus", "Solve 8 complex algorithmic challenges in 4 hours. Prizes & national leaderboard ranking."),
        ("opp-005", "Cloud-Native Microservices & Docker Workshop", "Cloud Scale Labs", "Workshop", "Oct 12, 2026", "All CS & IT Students", "Linux, Web Development, Cloud Computing", "Online Live", "Hands-on weekend bootcamp building containerized API microservices with Docker and Kubernetes."),
        ("opp-006", "Open Source Software Fellowship 2027", "Open Innovators Guild", "Research", "Dec 10, 2026", "Passionate developers with GitHub portfolio", "Python, Git, Web Development, C++", "Remote", "Stipended 6-month open source research fellowship contributing to core developer tools."),
        ("opp-007", "Cybersecurity & Ethical Hacking Bootcamp", "SecureNet Academy", "Certification", "Nov 20, 2026", "Undergraduates with basic Networking knowledge", "Computer Networks, Linux, Python", "Hybrid", "Industry recognized certification in network packet inspection, vulnerability assessment, and defensive security."),
        ("opp-008", "Deep Learning & NLP Research Symposium", "IIT Innovation Hub", "Research", "Nov 30, 2026", "Pre-final and Final Year Students", "Python, PyTorch, Machine Learning, NLP", "New Delhi", "Present undergraduate AI research posters and network with leading AI scientists.")
    ]

    for opp in opportunities:
        cursor.execute("INSERT INTO opportunities VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", opp)

    # 10. Initial Notifications for Atharva
    notifications = [
        ("notif-001", student_id, "Upcoming Deadline Alert", "DSA Assignment on Binary Tree Traversal is due on Oct 5 at 11:59 PM.", "warning", 0, "2026-10-02 09:30"),
        ("notif-002", student_id, "AI Performance Improvement", "Your performance score in Python Programming improved by +12% this month!", "success", 0, "2026-10-01 14:15"),
        ("notif-003", student_id, "New High-Match Opportunity", "National AI & Machine Learning Hackathon matches 94% of your profile skills.", "info", 0, "2026-09-30 18:00"),
        ("notif-004", student_id, "Teacher Feedback Released", "Prof. Sharma published graded feedback on your Dijkstra Algorithm submission.", "info", 1, "2026-09-28 11:00")
    ]

    for n in notifications:
        cursor.execute("INSERT INTO notifications VALUES (?, ?, ?, ?, ?, ?, ?)", n)

    conn.commit()
    conn.close()
    print("Database seeded successfully with rich demo data!")

if __name__ == "__main__":
    seed_database()
