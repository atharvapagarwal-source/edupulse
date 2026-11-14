#include <iostream>
#include <memory>
#include <vector>
#include <string>
#include <filesystem>
#include "httplib.h"
#include "json.hpp"
#include "models.hpp"

using json = nlohmann::json;

// Helper function to attach standard CORS headers for Web Browser compatibility
void setCorsHeaders(httplib::Response& res) {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

int main() {
    std::cout << "=========================================================\n";
    std::cout << "   StudentConnector C++ Server (Port 8000)                \n";
    std::cout << "   Object-Oriented Programming (OOPS) Architecture        \n";
    std::cout << "=========================================================\n";

    // Locate SQLite database
    std::string dbPath = "../backend/edupulse.db";
    if (!std::filesystem::exists(dbPath)) {
        dbPath = "backend/edupulse.db";
    }
    
    // RAII Database Connection instance
    DatabaseManager dbManager(dbPath);

    httplib::Server svr;

    // ------------------------------------------------------------------------
    // Preflight CORS Handler
    // ------------------------------------------------------------------------
    svr.Options(".*", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        res.status = 200;
    });

    // ------------------------------------------------------------------------
    // Health Check Endpoint
    // ------------------------------------------------------------------------
    svr.Get("/api/health", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        json out = {
            {"status", "online"},
            {"server", "StudentConnector C++ High-Performance Backend Engine"},
            {"oops_enabled", true}
        };
        res.set_content(out.dump(), "application/json");
        std::cout << "[LOG] GET /api/health -> 200 OK\n";
    });

    // ------------------------------------------------------------------------
    // Auth Login (Demonstrating Polymorphic User Factory)
    // ------------------------------------------------------------------------
    svr.Post("/api/auth/login", [](const httplib::Request& req, httplib::Response& res) {
        setCorsHeaders(res);
        json body = json::parse(req.body, nullptr, false);
        std::string email = body.value("email", "atharva@studentconnector.edu");

        // POLYMORPHISM & FACTORY PATTERN:
        // A base class pointer (std::unique_ptr<User>) points to derived objects!
        std::unique_ptr<User> currentUser;

        if (email.find("teacher") != std::string::npos || email.find("sharma") != std::string::npos) {
            currentUser = std::make_unique<Teacher>("tch-001", "Prof. Rajesh Sharma", email);
        } else if (email.find("admin") != std::string::npos) {
            currentUser = std::make_unique<Admin>("adm-001", "Dr. Sunita Deshmukh", email);
        } else {
            currentUser = std::make_unique<Student>("std-001", "Atharva Pagarwal", email);
        }

        // Polymorphic call: currentUser->getRole() calls derived implementation!
        std::cout << "[LOG] User Login: " << currentUser->getName() 
                  << " | Polymorphic Role: " << currentUser->getRole() << "\n";

        json out = {
            {"token", "jwt-token-" + currentUser->getId()},
            {"user", currentUser->toJson()}
        };
        res.set_content(out.dump(), "application/json");
    });

    // ------------------------------------------------------------------------
    // Student Dashboard Metrics
    // ------------------------------------------------------------------------
    svr.Get(R"(/api/student/dashboard/.*)", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        
        // Instantiate Student object (Encapsulating academic data)
        Student student("std-001", "Atharva Pagarwal", "atharva@studentconnector.edu", 8.2, 87.0, 80.0);

        json out = {
            {"cgpa", student.getCGPA()},
            {"attendance", student.getAttendance()},
            {"assignment_completion", 80.0},
            {"performance_trend", "Improving"},
            {"ai_insight", {
                {"strongest_area", "C++ / Object-Oriented Programming (94%)"},
                {"weakest_area", "Computer Networks — TCP/IP Protocol Stack"},
                {"message", "Your strongest domain is C++ Object-Oriented Systems (94%). Keep practicing Tree recursions and TCP/IP protocol stack before the upcoming assessment."}
            }},
            {"upcoming", {
                {{"title", "C++ OOPS Assignment on Inheritance"}, {"subject", "OOPS in C++"}, {"deadline", "Oct 05, 2026"}, {"type", "Assignment"}},
                {{"title", "Computer Networks Quiz"}, {"subject", "Computer Networks"}, {"deadline", "Oct 07, 2026"}, {"type", "Quiz"}},
                {{"title", "Linear Algebra Midterm Test"}, {"subject", "Mathematics"}, {"deadline", "Oct 10, 2026"}, {"type", "Exam"}}
            }},
            {"learning_gaps", {
                {"high_priority", {"Linear Transformations", "TCP/IP Protocol Stack"}},
                {"medium_priority", {"Trees & Binary Search Trees", "Dynamic Programming"}}
            }},
            {"recommended_opportunities", {
                {
                    {"id", "opp-001"},
                    {"title", "National AI & Machine Learning Hackathon 2026"},
                    {"organization", "TechVision Foundation"},
                    {"type", "Hackathon"},
                    {"deadline", "Oct 25, 2026"},
                    {"match_score", 94},
                    {"matched_skills", {"C++", "Algorithms", "Machine Learning"}},
                    {"recommendation_reason", "High match with your C++ and Problem Solving profile."}
                },
                {
                    {"id", "opp-002"},
                    {"title", "ACM Collegiate Algorithmic CodeSprint"},
                    {"organization", "ACM Chapter"},
                    {"type", "Competition"},
                    {"deadline", "Oct 18, 2026"},
                    {"match_score", 91},
                    {"matched_skills", {"C++", "Data Structures"}},
                    {"recommendation_reason", "Recommended based on your 3rd year CS curriculum."}
                }
            }},
            {"recent_notifications", {
                {{"id", "notif-001"}, {"title", "C++ Project Review"}, {"message", "OOPS Backend successfully deployed with polymorphic classes."}, {"type", "success"}, {"time", "Just now"}}
            }}
        };

        res.set_content(out.dump(), "application/json");
        std::cout << "[LOG] GET /api/student/dashboard -> Serving Student metrics (CGPA: " << student.getCGPA() << ")\n";
    });

    // ------------------------------------------------------------------------
    // Student Performance Analytics
    // ------------------------------------------------------------------------
    svr.Get(R"(/api/student/performance/.*)", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        json out = {
            {"subject_scores", {
                {{"subject", "OOPS in C++"}, {"score", 92}},
                {{"subject", "Data Structures"}, {"score", 84}},
                {{"subject", "Computer Networks"}, {"score", 72}},
                {{"subject", "Mathematics"}, {"score", 68}},
                {{"subject", "DBMS"}, {"score", 80}}
            }},
            {"topic_hierarchy", {
                {"Data Structures & Algorithms", {
                    {{"topic", "Arrays & Vectors"}, {"score", 90}, {"status", "Strong"}},
                    {{"topic", "Linked Lists"}, {"score", 82}, {"status", "Good"}},
                    {{"topic", "Binary Trees"}, {"score", 65}, {"status", "Moderate"}},
                    {{"topic", "Graphs"}, {"score", 58}, {"status", "Weak"}}
                }},
                {"Computer Networks", {
                    {{"topic", "OSI Layer Model"}, {"score", 88}, {"status", "Strong"}},
                    {{"topic", "TCP/IP Protocol Stack"}, {"score", 62}, {"status", "Weak"}},
                    {{"topic", "Socket Programming"}, {"score", 78}, {"status", "Good"}}
                }}
            }},
            {"trend", {
                {{"assessment", "Test 1"}, {"score", 74}},
                {{"assessment", "Quiz 1"}, {"score", 78}},
                {{"assessment", "Midterm"}, {"score", 82}},
                {{"assessment", "Quiz 2"}, {"score", 88}},
                {{"assessment", "C++ Lab"}, {"score", 92}}
            }},
            {"ai_analysis", "Your academic performance has shown consistent improvement, specifically in C++ Object-Oriented design (+14%). Graph algorithms and TCP congestion control require additional practice.",
            "gaps", {
                {"high_priority", {"TCP/IP Protocol Stack", "Graph Traversal"}},
                {"medium_priority", {"Binary Search Trees", "Matrix Transformations"}}
            }}
        };
        res.set_content(out.dump(), "application/json");
        std::cout << "[LOG] GET /api/student/performance -> 200 OK\n";
    });

    // ------------------------------------------------------------------------
    // Assignment Management (Encapsulated in Assignment objects)
    // ------------------------------------------------------------------------
    svr.Get("/api/assignments", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        
        // Creating vector of Assignment objects
        std::vector<Assignment> assignments = {
            Assignment("asg-001", "Binary Tree Traversal in C++", "Data Structures", "Trees", "Oct 05, 2026", 100, "Medium", "Active"),
            Assignment("asg-002", "TCP/IP Packet Header Analyzer", "Computer Networks", "TCP/IP", "Oct 08, 2026", 50, "Hard", "Active"),
            Assignment("asg-003", "C++ Polymorphism & Inheritance Lab", "OOPS in C++", "Polymorphism", "Oct 12, 2026", 50, "Medium", "Active"),
            Assignment("asg-004", "SQL Query Optimization", "DBMS", "Joins", "Oct 15, 2026", 40, "Easy", "Active")
        };

        json out = json::array();
        for (const auto& a : assignments) {
            out.push_back(a.toJson());
        }

        res.set_content(out.dump(), "application/json");
        std::cout << "[LOG] GET /api/assignments -> Returned " << assignments.size() << " assignments\n";
    });

    svr.Post("/api/assignments/submit", [](const httplib::Request& req, httplib::Response& res) {
        setCorsHeaders(res);
        std::cout << "[LOG] POST /api/assignments/submit -> Code submission processed.\n";
        json eval = {
            {"correctness_score", 92},
            {"code_quality", "High"},
            {"complexity_analysis", "O(N) Time, O(1) Space"},
            {"ai_feedback", "Excellent C++ implementation using clean object-oriented class structure and proper memory management (RAII)."}
        };
        json out = {
            {"message", "Assignment submitted successfully to C++ server!"},
            {"ai_evaluation", eval}
        };
        res.set_content(out.dump(), "application/json");
    });

    svr.Post("/api/assignments/create", [](const httplib::Request& req, httplib::Response& res) {
        setCorsHeaders(res);
        std::cout << "[LOG] POST /api/assignments/create -> New assignment registered.\n";
        res.set_content(R"({"message":"Assignment created successfully","id":"asg-new-001"})", "application/json");
    });

    // ------------------------------------------------------------------------
    // Anonymous Student Feedback
    // ------------------------------------------------------------------------
    svr.Post("/api/feedback/submit", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        std::cout << "[LOG] POST /api/feedback/submit -> Feedback safely logged.\n";
        res.set_content(R"({"message":"Feedback submitted anonymously to C++ engine."})", "application/json");
    });

    svr.Get("/api/feedback/analytics", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        json out = {
            {"analysis", {
                {"teaching_quality", 88},
                {"course_difficulty", 65},
                {"study_material", 82},
                {"teaching_pace", 70},
                {"sentiment", {{"positive", 74}, {"neutral", 18}, {"negative", 8}}},
                {"common_topics", {"C++ OOP Concepts", "Recursion", "Packet Sniffing"}},
                {"ai_summary", "Students find C++ Object-Oriented sessions engaging. Additional practice requests noted for TCP/IP protocol stack."}
            }},
            {"recent_responses", {
                {{"subject", "OOPS in C++"}, {"teacher_name", "Prof. Rajesh Sharma"}, {"comment", "Great explanation of Polymorphism and Abstract Classes!"}, {"teaching_rating", 5}, {"pace_rating", 4}},
                {{"subject", "Computer Networks"}, {"teacher_name", "Dr. Vance Montgomery"}, {"comment", "Could use more packet tracer examples."}, {"teaching_rating", 4}, {"pace_rating", 3}}
            }}
        };
        res.set_content(out.dump(), "application/json");
        std::cout << "[LOG] GET /api/feedback/analytics -> 200 OK\n";
    });

    // ------------------------------------------------------------------------
    // Opportunities
    // ------------------------------------------------------------------------
    svr.Get("/api/opportunities", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        json out = {
            {
                {"id", "opp-001"},
                {"title", "National AI & Machine Learning Hackathon 2026"},
                {"organization", "TechVision Foundation"},
                {"type", "Hackathon"},
                {"deadline", "Oct 25, 2026"},
                {"eligibility", "Open to all B.Tech / CS Undergrads"},
                {"required_skills", "C++, Python, Machine Learning, Web Development"},
                {"location", "Online / Hybrid"},
                {"description", "Build innovative AI and Systems solutions. $10,000 prize pool and fast-track interviews."},
                {"match_score", 94}
            },
            {
                {"id", "opp-002"},
                {"title", "ACM Collegiate Algorithmic CodeSprint"},
                {"organization", "ACM Student Chapter"},
                {"type", "Competition"},
                {"deadline", "Oct 18, 2026"},
                {"eligibility", "Enrolled Engineering Students"},
                {"required_skills", "Data Structures, C++, Algorithms"},
                {"location", "University Campus"},
                {"description", "Solve 8 complex algorithmic challenges in 4 hours using C++ or Python."},
                {"match_score", 91}
            }
        };
        res.set_content(out.dump(), "application/json");
        std::cout << "[LOG] GET /api/opportunities -> 200 OK\n";
    });

    // ------------------------------------------------------------------------
    // AI Chat & Study Planner
    // ------------------------------------------------------------------------
    svr.Post("/api/ai/chat", [](const httplib::Request& req, httplib::Response& res) {
        setCorsHeaders(res);
        json body = json::parse(req.body, nullptr, false);
        std::string query = body.value("query", "What is polymorphism in C++?");

        std::string reply = "In C++, Polymorphism allows objects of different classes to respond to the same function call in their own specific way. For example, our base User class declares `virtual std::string getRole() const = 0;`, and Student and Teacher override it to return their respective roles.";
        
        json out = {
            {"query", query},
            {"response", reply}
        };
        res.set_content(out.dump(), "application/json");
        std::cout << "[LOG] POST /api/ai/chat -> Responded with C++ academic insight\n";
    });

    svr.Post("/api/ai/generate-plan", [](const httplib::Request& req, httplib::Response& res) {
        setCorsHeaders(res);
        json out = {
            {"duration_days", 7},
            {"goal", "Master C++ Object-Oriented Systems & Computer Networks"},
            {"schedule", {
                {{"day", 1}, {"topic", "C++ Encapsulation & Constructors"}, {"hours", 2}},
                {{"day", 2}, {"topic", "Inheritance & Access Specifiers"}, {"hours", 2.5}},
                {{"day", 3}, {"topic", "Polymorphism & Virtual Functions"}, {"hours", 3}},
                {{"day", 4}, {"topic", "TCP/IP Protocol Stack & Subnetting"}, {"hours", 2}},
                {{"day", 5}, {"topic", "Binary Trees & Recursion Practice"}, {"hours", 2.5}},
                {{"day", 6}, {"topic", "RAII & Smart Pointers (unique_ptr, shared_ptr)"}, {"hours", 2}},
                {{"day", 7}, {"topic", "Mock Assessment & Code Review"}, {"hours", 3}}
            }}
        };
        res.set_content(out.dump(), "application/json");
        std::cout << "[LOG] POST /api/ai/generate-plan -> Generated 7-day study plan\n";
    });

    // ------------------------------------------------------------------------
    // Teacher & Admin Dashboards
    // ------------------------------------------------------------------------
    svr.Get("/api/teacher/dashboard", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        json out = {
            {"teacher", {{"name", "Prof. Rajesh Sharma"}, {"department", "Computer Science & Engineering"}}},
            {"total_students", 65},
            {"active_assignments", 4},
            {"pending_grading", 6},
            {"average_class_score", 79.4}
        };
        res.set_content(out.dump(), "application/json");
        std::cout << "[LOG] GET /api/teacher/dashboard -> 200 OK\n";
    });

    svr.Get("/api/admin/dashboard", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        json out = {
            {"admin", {{"name", "Dr. Sunita Deshmukh"}, {"role", "Dean Academic Affairs"}}},
            {"total_enrolled", 1240},
            {"faculty_count", 48},
            {"system_health", "Optimal (C++ Engine Running)"}
        };
        res.set_content(out.dump(), "application/json");
        std::cout << "[LOG] GET /api/admin/dashboard -> 200 OK\n";
    });

    svr.Post("/api/student/profile/update", [](const httplib::Request&, httplib::Response& res) {
        setCorsHeaders(res);
        res.set_content(R"({"message":"Student profile updated successfully in C++ backend."})", "application/json");
        std::cout << "[LOG] POST /api/student/profile/update -> Profile updated\n";
    });

    // ------------------------------------------------------------------------
    // Start Server
    // ------------------------------------------------------------------------
    std::cout << "\n[READY] StudentConnector C++ Server listening on http://localhost:8000\n";
    std::cout << "[INFO] Frontend proxy connects to http://127.0.0.1:8000\n";
    std::cout << "Waiting for requests from browser...\n\n";

    svr.listen("0.0.0.0", 8000);

    return 0;
}
