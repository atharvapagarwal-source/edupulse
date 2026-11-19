import sqlite3
import json

def seed():
    conn = sqlite3.connect("backend/edupulse.db")
    c = conn.cursor()
    
    # Drop and recreate tables cleanly to avoid column mismatches
    c.executescript("""
    DROP TABLE IF EXISTS announcements;
    DROP TABLE IF EXISTS teacher_remarks;
    DROP TABLE IF EXISTS generated_reports;
    DROP TABLE IF EXISTS attendance_records;
    DROP TABLE IF EXISTS saved_opportunities;
    DROP TABLE IF EXISTS notifications;
    DROP TABLE IF EXISTS study_plans;
    DROP TABLE IF EXISTS opportunities;
    DROP TABLE IF EXISTS anonymous_feedback;
    DROP TABLE IF EXISTS performance_records;
    DROP TABLE IF EXISTS submissions;
    DROP TABLE IF EXISTS assignments;
    DROP TABLE IF EXISTS subjects;
    DROP TABLE IF EXISTS teacher_profiles;
    DROP TABLE IF EXISTS student_profiles;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        college TEXT,
        course TEXT,
        year TEXT,
        avatar_url TEXT
    );

    CREATE TABLE student_profiles (
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

    CREATE TABLE teacher_profiles (
        user_id TEXT PRIMARY KEY,
        department TEXT,
        designation TEXT,
        subjects_taught TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE subjects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        description TEXT,
        teacher_id TEXT,
        teacher_name TEXT,
        credits INTEGER,
        schedule TEXT
    );

    CREATE TABLE assignments (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subject TEXT NOT NULL,
        topic TEXT,
        deadline TEXT,
        max_marks INTEGER,
        difficulty TEXT,
        description TEXT,
        status TEXT
    );

    CREATE TABLE submissions (
        id TEXT PRIMARY KEY,
        assignment_id TEXT,
        student_id TEXT,
        student_name TEXT,
        submitted_at TEXT,
        file_name TEXT,
        status TEXT,
        marks REAL,
        teacher_feedback TEXT,
        ai_evaluation TEXT,
        FOREIGN KEY(assignment_id) REFERENCES assignments(id),
        FOREIGN KEY(student_id) REFERENCES users(id)
    );

    CREATE TABLE performance_records (
        id TEXT PRIMARY KEY,
        student_id TEXT,
        subject TEXT,
        topic TEXT,
        score REAL,
        assessment_type TEXT,
        assessment_date TEXT,
        FOREIGN KEY(student_id) REFERENCES users(id)
    );

    CREATE TABLE anonymous_feedback (
        id TEXT PRIMARY KEY,
        student_id TEXT,
        subject TEXT,
        teacher_name TEXT,
        category TEXT,
        comment TEXT,
        teaching_rating INTEGER,
        difficulty_rating INTEGER,
        pace_rating INTEGER,
        material_rating INTEGER,
        status TEXT DEFAULT 'Submitted',
        created_at TEXT
    );

    CREATE TABLE opportunities (
        id TEXT PRIMARY KEY,
        title TEXT,
        organization TEXT,
        type TEXT,
        deadline TEXT,
        eligibility TEXT,
        required_skills TEXT,
        location TEXT,
        description TEXT
    );

    CREATE TABLE study_plans (
        id TEXT PRIMARY KEY,
        student_id TEXT,
        title TEXT,
        duration_days INTEGER,
        schedule TEXT,
        created_at TEXT,
        FOREIGN KEY(student_id) REFERENCES users(id)
    );

    CREATE TABLE notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT,
        message TEXT,
        type TEXT,
        is_read INTEGER DEFAULT 0,
        created_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE announcements (
        id TEXT PRIMARY KEY,
        teacher_id TEXT,
        teacher_name TEXT,
        subject TEXT,
        title TEXT,
        content TEXT,
        created_at TEXT
    );

    CREATE TABLE attendance_records (
        id TEXT PRIMARY KEY,
        student_id TEXT,
        subject TEXT,
        date TEXT,
        status TEXT,
        session_topic TEXT,
        FOREIGN KEY(student_id) REFERENCES users(id)
    );

    CREATE TABLE generated_reports (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        report_type TEXT,
        target_id TEXT,
        target_name TEXT,
        period_type TEXT,
        start_date TEXT,
        end_date TEXT,
        file_name TEXT,
        file_url TEXT,
        created_at TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE teacher_remarks (
        id TEXT PRIMARY KEY,
        student_id TEXT,
        teacher_id TEXT,
        subject TEXT,
        remark TEXT,
        created_at TEXT,
        FOREIGN KEY(student_id) REFERENCES users(id),
        FOREIGN KEY(teacher_id) REFERENCES users(id)
    );
    """)

    # 1. Users & Profiles
    # Student 1: Atharva Pagarwal
    c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
        "std-001", "Atharva Pagarwal", "atharva@studentconnector.edu", "STUDENT",
        "VIT University", "B.Tech Computer Science", "3rd Year",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    ))
    c.execute("INSERT INTO student_profiles VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
        "std-001", 8.2, 87.0, 80.0, 78.5,
        json.dumps(["C++", "Data Structures", "Algorithms", "Python", "SQL"]),
        json.dumps(["Artificial Intelligence", "Systems Programming", "Cloud Computing"]),
        "Targeting AI Systems Engineer roles at top product companies."
    ))

    # Student 2: Riya Sharma
    c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
        "std-002", "Riya Sharma", "riya@studentconnector.edu", "STUDENT",
        "VIT University", "B.Tech Computer Science", "3rd Year",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    ))
    c.execute("INSERT INTO student_profiles VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
        "std-002", 9.1, 94.0, 95.0, 91.0,
        json.dumps(["React", "TypeScript", "Node.js", "Python", "Web Development"]),
        json.dumps(["Full Stack Engineering", "Open Source Software", "UI/UX Design"]),
        "Targeting Full Stack Software Engineering and open-source fellowships."
    ))

    # Teachers
    c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
        "tch-001", "Prof. Rajesh Sharma", "sharma@studentconnector.edu", "TEACHER",
        "VIT University", "School of Computer Science & Engineering", "Faculty",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    ))
    c.execute("INSERT INTO teacher_profiles VALUES (?, ?, ?, ?)", (
        "tch-001", "Computer Science & Engineering", "Senior Associate Professor",
        json.dumps(["Data Structures & Algorithms", "OOPS in C++"])
    ))

    c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
        "tch-002", "Dr. Vance Montgomery", "vance@studentconnector.edu", "TEACHER",
        "VIT University", "School of Computer Science & Engineering", "Faculty",
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
    ))
    c.execute("INSERT INTO teacher_profiles VALUES (?, ?, ?, ?)", (
        "tch-002", "Computer Science & Engineering", "Professor",
        json.dumps(["Computer Networks", "Network Security"])
    ))

    # Admin
    c.execute("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)", (
        "adm-001", "Dr. Sunita Deshmukh", "admin@studentconnector.edu", "ADMIN",
        "VIT University", "Academic Affairs & Analytics", "Dean",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    ))

    # 2. Subjects / Enrolled Classes
    subjects = [
        ("sub-101", "Data Structures & Algorithms", "CS201", "Trees, Graphs, Sorting, Dynamic Programming", "tch-001", "Prof. Rajesh Sharma", 4, "Mon & Wed 10:00 AM - 11:30 AM"),
        ("sub-102", "Computer Networks", "CS302", "TCP/IP Stack, Routing, Sockets, Packet Inspection", "tch-002", "Dr. Vance Montgomery", 3, "Tue & Thu 02:00 PM - 03:30 PM"),
        ("sub-103", "OOPS in C++", "CS203", "Classes, Inheritance, Polymorphism, RAII, Templates", "tch-001", "Prof. Rajesh Sharma", 4, "Mon & Fri 12:00 PM - 01:30 PM"),
        ("sub-104", "Mathematics — Linear Algebra", "MA202", "Matrices, Vector Spaces, Eigenvalues, Transformations", "tch-003", "Dr. Meera Iyer", 4, "Wed & Fri 08:30 AM - 10:00 AM"),
        ("sub-105", "Database Management Systems", "CS204", "Relational Algebra, SQL, Normalization, Transactions", "tch-004", "Prof. Vikram Malhotra", 3, "Thu & Sat 11:30 AM - 01:00 PM")
    ]
    for s in subjects:
        c.execute("INSERT INTO subjects VALUES (?, ?, ?, ?, ?, ?, ?, ?)", s)

    # 3. Assignments
    assignments = [
        ("asg-001", "Binary Tree Traversal & Recursion", "Data Structures & Algorithms", "Trees", "Oct 05, 2026", 100, "Medium", "Implement recursive and iterative preorder, inorder, and postorder traversals in C++.", "Active"),
        ("asg-002", "TCP/IP Packet Header Analyzer", "Computer Networks", "TCP/IP", "Oct 08, 2026", 50, "Hard", "Write a socket program in C++ to parse TCP/UDP headers and measure packet round trip time.", "Active"),
        ("asg-003", "Linear Transformation Matrix Operations", "Mathematics — Linear Algebra", "Linear Transformations", "Oct 10, 2026", 50, "Medium", "Solve vector space transformation matrices and compute eigenvectors.", "Active"),
        ("asg-004", "C++ Polymorphism & Inheritance Lab", "OOPS in C++", "Polymorphism", "Oct 12, 2026", 40, "Easy", "Implement inheritance hierarchies, virtual functions, and memory management (RAII).", "Active"),
        ("asg-005", "SQL Complex Joins & Query Optimization", "Database Management Systems", "SQL Joins", "Oct 15, 2026", 100, "Medium", "Construct nested SQL queries with INNER JOIN, GROUP BY, and HAVING.", "Active")
    ]
    for a in assignments:
        c.execute("INSERT INTO assignments VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", a)

    # 4. Submissions (Atharva std-001)
    c.execute("INSERT INTO submissions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (
        "subm-001", "asg-001", "std-001", "Atharva Pagarwal", "Oct 02, 2026", "binary_tree.cpp",
        "Graded", 85.0, "Clean C++ implementation using recursion and proper base-case validation.",
        json.dumps({"correctness_score": 85, "code_quality": "High", "complexity_analysis": "O(N) Time, O(H) Space", "ai_feedback": "Tree traversals function accurately. Edge cases on empty root handled."})
    ))
    c.execute("INSERT INTO submissions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (
        "subm-002", "asg-002", "std-001", "Atharva Pagarwal", "Oct 06, 2026", "packet_analyzer.cpp",
        "Submitted", None, None,
        json.dumps({"correctness_score": 78, "code_quality": "Good", "complexity_analysis": "O(1) Header Parse", "ai_feedback": "Socket bind and checksum validation implemented cleanly."})
    ))

    # Submissions (Riya std-002) - completely different data!
    c.execute("INSERT INTO submissions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (
        "subm-003", "asg-001", "std-002", "Riya Sharma", "Oct 01, 2026", "binary_tree_traversal.cpp",
        "Graded", 94.0, "Superb modular architecture with comprehensive test fixtures and zero memory leaks.",
        json.dumps({"correctness_score": 94, "code_quality": "Excellent", "complexity_analysis": "O(N) Time, O(log N) Space", "ai_feedback": "Very clean structure and well-commented functions."})
    ))
    c.execute("INSERT INTO submissions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (
        "subm-004", "asg-002", "std-002", "Riya Sharma", "Oct 05, 2026", "tcp_header_parser.cpp",
        "Graded", 48.0, "Excellent raw socket parsing and precise timing measurement.",
        json.dumps({"correctness_score": 96, "code_quality": "High", "complexity_analysis": "O(1)", "ai_feedback": "Bitfield header parsing verified."})
    ))
    c.execute("INSERT INTO submissions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (
        "subm-005", "asg-003", "std-002", "Riya Sharma", "Oct 07, 2026", "matrix_transform.cpp",
        "Submitted", None, None,
        json.dumps({"correctness_score": 88, "code_quality": "Good", "complexity_analysis": "O(N^3)", "ai_feedback": "Matrix multiplication and determinant calculations validated."})
    ))
    # Pending submission for Prof. Rajesh Sharma (tch-001) in OOPS in C++
    c.execute("INSERT INTO submissions VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (
        "subm-006", "asg-004", "std-001", "Atharva Pagarwal", "Oct 08, 2026", "polymorphism_lab.cpp",
        "Submitted", None, None,
        json.dumps({"correctness_score": 86, "code_quality": "High", "complexity_analysis": "O(1) Virtual Dispatch", "ai_feedback": "Virtual destructor and abstract base class implemented cleanly."})
    ))

    # 5. Performance Records (std-001 Atharva)
    perf_atharva = [
        ("perf-001", "std-001", "Data Structures & Algorithms", "Arrays & Vectors", 84.0, "Quiz 1", "2026-09-05"),
        ("perf-002", "std-001", "Data Structures & Algorithms", "Linked Lists", 78.0, "Test 1", "2026-09-12"),
        ("perf-003", "std-001", "Data Structures & Algorithms", "Stacks & Queues", 72.0, "Midterm", "2026-09-18"),
        ("perf-004", "std-001", "Data Structures & Algorithms", "Binary Trees", 61.0, "Quiz 2", "2026-09-25"),
        ("perf-005", "std-001", "Data Structures & Algorithms", "Graph Traversals", 55.0, "Assignment 2", "2026-09-28"),

        ("perf-006", "std-001", "Computer Networks", "OSI Model", 88.0, "Quiz 1", "2026-09-02"),
        ("perf-007", "std-001", "Computer Networks", "TCP/IP Protocol Stack", 62.0, "Test 1", "2026-09-15"),
        ("perf-008", "std-001", "Computer Networks", "Socket Programming", 76.0, "Midterm", "2026-09-22"),
        ("perf-009", "std-001", "Computer Networks", "Subnetting & CIDR", 72.0, "Assignment 1", "2026-09-29"),

        ("perf-010", "std-001", "OOPS in C++", "Classes & Constructors", 94.0, "Quiz 1", "2026-08-30"),
        ("perf-011", "std-001", "OOPS in C++", "Inheritance & Polymorphism", 88.0, "Midterm", "2026-09-10"),
        ("perf-012", "std-001", "OOPS in C++", "RAII & Smart Pointers", 86.0, "Assignment 1", "2026-09-20"),

        ("perf-013", "std-001", "Mathematics — Linear Algebra", "Matrix Operations", 75.0, "Quiz 1", "2026-09-08"),
        ("perf-014", "std-001", "Mathematics — Linear Algebra", "Vector Spaces", 68.0, "Midterm", "2026-09-16"),
        ("perf-015", "std-001", "Mathematics — Linear Algebra", "Linear Transformations", 58.0, "Assignment 2", "2026-09-26")
    ]
    for p in perf_atharva:
        c.execute("INSERT INTO performance_records VALUES (?, ?, ?, ?, ?, ?, ?)", p)

    # Performance Records (std-002 Riya Sharma) - distinct higher scores & topics!
    perf_riya = [
        ("perf-101", "std-002", "Data Structures & Algorithms", "Arrays & Vectors", 95.0, "Quiz 1", "2026-09-05"),
        ("perf-102", "std-002", "Data Structures & Algorithms", "Linked Lists", 92.0, "Test 1", "2026-09-12"),
        ("perf-103", "std-002", "Data Structures & Algorithms", "Stacks & Queues", 90.0, "Midterm", "2026-09-18"),
        ("perf-104", "std-002", "Data Structures & Algorithms", "Binary Trees", 88.0, "Quiz 2", "2026-09-25"),
        ("perf-105", "std-002", "Data Structures & Algorithms", "Graph Traversals", 85.0, "Assignment 2", "2026-09-28"),

        ("perf-106", "std-002", "Computer Networks", "OSI Model", 96.0, "Quiz 1", "2026-09-02"),
        ("perf-107", "std-002", "Computer Networks", "TCP/IP Protocol Stack", 90.0, "Test 1", "2026-09-15"),
        ("perf-108", "std-002", "Computer Networks", "Socket Programming", 92.0, "Midterm", "2026-09-22"),

        ("perf-109", "std-002", "OOPS in C++", "Classes & Constructors", 98.0, "Quiz 1", "2026-08-30"),
        ("perf-110", "std-002", "OOPS in C++", "Inheritance & Polymorphism", 94.0, "Midterm", "2026-09-10"),
        ("perf-111", "std-002", "OOPS in C++", "RAII & Smart Pointers", 91.0, "Assignment 1", "2026-09-20"),

        ("perf-112", "std-002", "Mathematics — Linear Algebra", "Matrix Operations", 92.0, "Quiz 1", "2026-09-08"),
        ("perf-113", "std-002", "Mathematics — Linear Algebra", "Vector Spaces", 89.0, "Midterm", "2026-09-16"),
        ("perf-114", "std-002", "Mathematics — Linear Algebra", "Linear Transformations", 82.0, "Assignment 2", "2026-09-26")
    ]
    for p in perf_riya:
        c.execute("INSERT INTO performance_records VALUES (?, ?, ?, ?, ?, ?, ?)", p)

    # 6. Notifications
    notifs_atharva = [
        ("notif-001", "std-001", "Upcoming Deadline Alert", "DSA Assignment on Binary Tree Traversal is due on Oct 5 at 11:59 PM.", "warning", 0, "2026-10-02 09:30"),
        ("notif-002", "std-001", "Grade Published", "Prof. Sharma graded your Binary Tree Traversal submission (85/100).", "success", 0, "2026-10-02 14:15"),
        ("notif-003", "std-001", "AI Study Priority", "Review suggested for Trees (61%) and TCP/IP (62%) based on recent assessments.", "info", 0, "2026-10-01 18:00")
    ]
    for n in notifs_atharva:
        c.execute("INSERT INTO notifications VALUES (?, ?, ?, ?, ?, ?, ?)", n)

    notifs_riya = [
        ("notif-101", "std-002", "Academic Excellence Recognition", "Top 5% in Department ranking with 9.1 CGPA and 94% attendance.", "success", 0, "2026-10-02 10:00"),
        ("notif-102", "std-002", "Grade Published", "TCP/IP Packet Header Analyzer graded with 48/50 marks.", "info", 0, "2026-10-01 16:30"),
        ("notif-103", "std-002", "Open Source Opportunity", "Recommended for 2027 Open Source Software Fellowship based on web & systems skills.", "info", 0, "2026-09-30 11:00")
    ]
    for n in notifs_riya:
        c.execute("INSERT INTO notifications VALUES (?, ?, ?, ?, ?, ?, ?)", n)

    # Teacher Notifications
    notifs_teachers = [
        ("notif-t01", "tch-001", "New Assignment Submission", "Atharva Pagarwal submitted C++ Polymorphism & Inheritance Lab.", "info", 0, "2026-10-08 14:00"),
        ("notif-t02", "tch-001", "Course Feedback Summary Ready", "3 new student feedback entries recorded for Data Structures and OOPS.", "success", 0, "2026-10-07 10:30"),
        ("notif-t03", "tch-001", "Department Meeting Reminder", "Academic curriculum board meeting scheduled for Thursday at 4 PM.", "warning", 1, "2026-10-06 09:00"),
        ("notif-t04", "tch-002", "Submission Pending Evaluation", "Atharva Pagarwal submitted TCP/IP Packet Header Analyzer.", "info", 0, "2026-10-06 16:30"),
        ("notif-t05", "tch-002", "Lab Equipment Inspection", "Network lab switches and routers calibrated for practical evaluation.", "success", 0, "2026-10-05 11:15")
    ]
    for nt in notifs_teachers:
        c.execute("INSERT INTO notifications VALUES (?, ?, ?, ?, ?, ?, ?)", nt)

    # 7. Anonymous Feedback (associated with student_id internally for history, but anonymized when queried by teacher)
    feedbacks = [
        ("fb-001", "std-001", "Computer Networks", "Dr. Vance Montgomery", "Teaching Pace", "The lecture pace on TCP was good, practical packet trace examples helped.", 4, 3, 3, 4, "Submitted", "2026-10-02"),
        ("fb-002", "std-001", "Data Structures & Algorithms", "Prof. Rajesh Sharma", "Course Difficulty", "Trees and Graph algorithms are well explained, would love extra practice sets.", 5, 4, 3, 5, "Submitted", "2026-10-03"),
        ("fb-003", "std-002", "OOPS in C++", "Prof. Rajesh Sharma", "Teaching Quality", "The explanation of virtual functions and VTable was exceptionally clear.", 5, 3, 4, 5, "Submitted", "2026-10-01"),
        ("fb-004", "std-002", "Computer Networks", "Dr. Vance Montgomery", "Course Difficulty", "Socket programming assignment was appropriately challenging. Enjoyed the raw header decoding.", 5, 4, 3, 5, "Submitted", "2026-10-04")
    ]
    for fb in feedbacks:
        c.execute("INSERT INTO anonymous_feedback VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", fb)

    # Announcements
    announcements = [
        ("ann-001", "tch-001", "Prof. Rajesh Sharma", "Data Structures & Algorithms", "Mid-Term Exam Syllabus & Format", "The mid-term exam will cover Trees, Binary Search Trees, and Graph Traversals (BFS/DFS). Bring standard blue books.", "Oct 04, 2026"),
        ("ann-002", "tch-001", "Prof. Rajesh Sharma", "OOPS in C++", "Virtual Functions Lab Evaluation Schedule", "Lab evaluation will be held in Turing Lab during our regular Friday session. Review abstract classes.", "Oct 06, 2026"),
        ("ann-003", "tch-002", "Dr. Vance Montgomery", "Computer Networks", "Wireshark Packet Trace Submission Guidelines", "Ensure you capture at least 3 distinct TCP 3-way handshakes and include sequence number calculations in your report.", "Oct 05, 2026")
    ]
    for ann in announcements:
        c.execute("INSERT INTO announcements VALUES (?, ?, ?, ?, ?, ?, ?)", ann)

    # 8. Opportunities
    opps = [
        ("opp-001", "National AI & Machine Learning Hackathon 2026", "TechVision Foundation", "Hackathon", "Oct 25, 2026", "Open to all Undergrads", "Python, C++, Machine Learning, SQL", "Online / Hybrid", "Build innovative AI & systems solutions. $10,000 prize pool."),
        ("opp-002", "ACM Collegiate Algorithmic CodeSprint", "ACM Student Chapter", "Competition", "Oct 18, 2026", "CS Students", "C++, Data Structures, Algorithms", "University Campus", "Solve 8 complex algorithmic challenges in 4 hours."),
        ("opp-003", "Summer Systems & Full-Stack Internship", "Apex Analytics Research", "Internship", "Nov 15, 2026", "3rd Year CS Students", "C++, React, Python, Sockets", "Bangalore / Remote", "Paid 3-month summer internship working with production software."),
        ("opp-004", "Open Source Software Fellowship 2027", "Open Innovators Guild", "Research", "Dec 10, 2026", "Developers with GitHub portfolio", "C++, Python, Git, Web Development", "Remote", "Stipended 6-month open source research fellowship.")
    ]
    for opp in opps:
        c.execute("INSERT INTO opportunities VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", opp)

    # 9. Attendance Sessions (Real session-by-session records for dynamic calculation)
    # Course schedule:
    # CS201 Data Structures & Algorithms: Mon & Wed
    # CS203 OOPS in C++: Mon & Fri
    # CS302 Computer Networks: Tue & Thu
    # CS204 Mathematics — Linear Algebra: Wed & Fri

    sessions = [
        # August 2026
        ("2026-08-24", "Data Structures & Algorithms", "Introduction & Time Complexity"),
        ("2026-08-24", "OOPS in C++", "C++ Basic Syntax & Memory Layout"),
        ("2026-08-25", "Computer Networks", "Network Models & OSI 7-Layer Architecture"),
        ("2026-08-26", "Data Structures & Algorithms", "Dynamic Arrays & std::vector"),
        ("2026-08-26", "Mathematics — Linear Algebra", "System of Linear Equations & Matrices"),
        ("2026-08-27", "Computer Networks", "Physical & Data Link Layers"),
        ("2026-08-28", "OOPS in C++", "Classes, Objects & Constructors"),
        ("2026-08-28", "Mathematics — Linear Algebra", "Matrix Multiplication & Inverses"),
        ("2026-08-31", "Data Structures & Algorithms", "Singly & Doubly Linked Lists"),
        ("2026-08-31", "OOPS in C++", "Copy Constructors & Deep Copy"),

        # September 2026 (Week 1: Sep 1 - Sep 6)
        ("2026-09-01", "Computer Networks", "Framing, Error Detection & CRC"),
        ("2026-09-02", "Data Structures & Algorithms", "Linked List Operations & Reversal"),
        ("2026-09-02", "Mathematics — Linear Algebra", "Determinants & Elementary Row Operations"),
        ("2026-09-03", "Computer Networks", "Flow Control & Sliding Window Protocols"),
        ("2026-09-04", "OOPS in C++", "Operator Overloading & Friend Functions"),
        ("2026-09-04", "Mathematics — Linear Algebra", "Vector Spaces & Subspaces"),

        # September 2026 (Week 2: Sep 7 - Sep 13)
        ("2026-09-07", "Data Structures & Algorithms", "Stacks & Queues Implementation"),
        ("2026-09-07", "OOPS in C++", "Inheritance Hierarchies & Access Specifiers"),
        ("2026-09-08", "Computer Networks", "Medium Access Control & CSMA/CD"),
        ("2026-09-09", "Data Structures & Algorithms", "Stack Applications: Infix to Postfix"),
        ("2026-09-09", "Mathematics — Linear Algebra", "Linear Independence & Basis"),
        ("2026-09-10", "Computer Networks", "Ethernet Standards & Switching"),
        ("2026-09-11", "OOPS in C++", "Virtual Functions & Dynamic Binding"),
        ("2026-09-11", "Mathematics — Linear Algebra", "Dimension & Rank-Nullity Theorem"),

        # September 2026 (Week 3: Sep 14 - Sep 20)
        ("2026-09-14", "Data Structures & Algorithms", "Recursion & Divide and Conquer"),
        ("2026-09-14", "OOPS in C++", "Pure Virtual Functions & Abstract Classes"),
        ("2026-09-15", "Computer Networks", "IPv4 Addressing & Classful Routing"),
        ("2026-09-16", "Data Structures & Algorithms", "Binary Trees & Tree Traversals"),
        ("2026-09-16", "Mathematics — Linear Algebra", "Linear Transformations & Kernel"),
        ("2026-09-17", "Computer Networks", "Subnetting & CIDR Calculations"),
        ("2026-09-18", "OOPS in C++", "RAII Pattern & Smart Pointers"),
        ("2026-09-18", "Mathematics — Linear Algebra", "Matrix Representation of Transformations"),

        # September 2026 (Week 4: Sep 21 - Sep 27)
        ("2026-09-21", "Data Structures & Algorithms", "Binary Search Trees (BST) Insertion & Search"),
        ("2026-09-21", "OOPS in C++", "Exception Handling & Stack Unwinding"),
        ("2026-09-22", "Computer Networks", "Address Resolution Protocol (ARP) & ICMP"),
        ("2026-09-23", "Data Structures & Algorithms", "AVL Trees & Rotations"),
        ("2026-09-23", "Mathematics — Linear Algebra", "Eigenvalues & Eigenvectors"),
        ("2026-09-24", "Computer Networks", "Routing Algorithms: Distance Vector & OSPF"),
        ("2026-09-25", "OOPS in C++", "C++ Standard Template Library (STL) Containers"),
        ("2026-09-25", "Mathematics — Linear Algebra", "Diagonalization of Matrices"),

        # September 2026 - October (Week 5: Sep 28 - Oct 4)
        ("2026-09-28", "Data Structures & Algorithms", "Graph Representations: Adjacency List & Matrix"),
        ("2026-09-28", "OOPS in C++", "STL Iterators & Lambda Expressions"),
        ("2026-09-29", "Computer Networks", "TCP Connection Management & Handshake"),
        ("2026-09-30", "Data Structures & Algorithms", "Graph Traversals: BFS & DFS"),
        ("2026-09-30", "Mathematics — Linear Algebra", "Inner Product Spaces & Orthogonality"),
        ("2026-10-01", "Computer Networks", "TCP Flow Control & Congestion Control"),
        ("2026-10-02", "OOPS in C++", "File I/O Streams & Serialization"),
        ("2026-10-02", "Mathematics — Linear Algebra", "Gram-Schmidt Orthogonalization"),

        # October 2026 (Week 6: Oct 5 - Oct 11)
        ("2026-10-05", "Data Structures & Algorithms", "Dijkstra's Shortest Path Algorithm"),
        ("2026-10-05", "OOPS in C++", "C++ Multithreading Basics & std::thread"),
        ("2026-10-06", "Computer Networks", "Socket Programming with TCP Sockets"),
        ("2026-10-07", "Data Structures & Algorithms", "Minimum Spanning Tree: Prim & Kruskal"),
        ("2026-10-07", "Mathematics — Linear Algebra", "Symmetric Matrices & Quadratic Forms"),
        ("2026-10-08", "Computer Networks", "UDP Sockets & Header Inspection Lab"),
        ("2026-10-09", "OOPS in C++", "Polymorphism Lab & Code Optimization"),
        ("2026-10-09", "Mathematics — Linear Algebra", "Singular Value Decomposition (SVD)")
    ]

    att_id_counter = 1
    # Specific absent and late dates for Atharva (std-001) to achieve ~87% attendance
    std1_absent = {"2026-09-18", "2026-09-28"}
    std1_late = {"2026-09-08", "2026-09-22", "2026-10-06"}

    # Specific absent and late dates for Riya (std-002) to achieve ~95% attendance
    std2_absent = {"2026-09-11"}
    std2_late = {"2026-09-25"}

    for dt, subj, topic in sessions:
        # std-001
        st1 = "Absent" if dt in std1_absent else "Late" if dt in std1_late else "Present"
        c.execute("INSERT INTO attendance_records VALUES (?, ?, ?, ?, ?, ?)", (
            f"att-{att_id_counter:04d}", "std-001", subj, dt, st1, topic
        ))
        att_id_counter += 1

        # std-002
        st2 = "Absent" if dt in std2_absent else "Late" if dt in std2_late else "Present"
        c.execute("INSERT INTO attendance_records VALUES (?, ?, ?, ?, ?, ?)", (
            f"att-{att_id_counter:04d}", "std-002", subj, dt, st2, topic
        ))
        att_id_counter += 1

    # 10. Teacher Remarks
    remarks = [
        ("rem-001", "std-001", "tch-001", "Data Structures & Algorithms",
         "Demonstrates solid logical aptitude in Arrays and Linked Lists. Needs reinforcement on recursive tree traversals and graph algorithms before end-semester evaluations.",
         "2026-10-05"),
        ("rem-002", "std-001", "tch-001", "OOPS in C++",
         "Consistent practical implementation skills in inheritance and memory safety (RAII). Keep up the excellent work in polymorphic dispatch.",
         "2026-10-07"),
        ("rem-003", "std-001", "tch-002", "Computer Networks",
         "Completed packet header analyzer successfully. Suggested focus: revise CIDR subnetting and TCP sliding window sequence number calculations.",
         "2026-10-06"),
        ("rem-004", "std-002", "tch-001", "Data Structures & Algorithms",
         "Exceptional algorithmic precision and modular clean code practices. Actively participates in advanced graph optimization discussions.",
         "2026-10-05"),
        ("rem-005", "std-002", "tch-002", "Computer Networks",
         "Top scoring student across socket assignments and midterm examination. Demonstrates deep grasp of protocol mechanics.",
         "2026-10-06")
    ]
    for r in remarks:
        c.execute("INSERT INTO teacher_remarks VALUES (?, ?, ?, ?, ?, ?)", r)

    # 11. Initial Generated Report History
    initial_reports = [
        ("rep-001", "std-001", "STUDENT_INDIVIDUAL", "std-001", "Atharva Pagarwal", "monthly", "2026-09-01", "2026-09-30", "Student_Report_std-001_September_2026.pdf", "/api/reports/download/rep-001", "2026-10-01 10:15"),
        ("rep-002", "std-001", "STUDENT_INDIVIDUAL", "std-001", "Atharva Pagarwal", "weekly", "2026-09-21", "2026-09-27", "Student_Report_std-001_Week4_Sep2026.pdf", "/api/reports/download/rep-002", "2026-09-28 09:30"),
        ("rep-003", "tch-001", "CLASS_CONSOLIDATED", "sub-101", "Data Structures & Algorithms (CS201)", "monthly", "2026-09-01", "2026-09-30", "Class_Report_CS201_September_2026.pdf", "/api/reports/download/rep-003", "2026-10-02 11:45"),
        ("rep-004", "tch-002", "CLASS_CONSOLIDATED", "sub-102", "Computer Networks (CS302)", "monthly", "2026-09-01", "2026-09-30", "Class_Report_CS302_September_2026.pdf", "/api/reports/download/rep-004", "2026-10-03 14:20")
    ]
    for rep in initial_reports:
        c.execute("INSERT INTO generated_reports VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", rep)

    conn.commit()
    conn.close()
    print("Clean SQLite database created and seeded with verified, distinct multi-student data, attendance records, and reports!")

if __name__ == "__main__":
    seed()
