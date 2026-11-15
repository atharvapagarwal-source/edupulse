#pragma once
#include <string>
#include <vector>
#include <memory>
#include <map>
#include <algorithm>
#include <iostream>
#include <sqlite3.h>
#include "json.hpp"

using json = nlohmann::json;

// ============================================================================
// 1. ABSTRACTION & ENCAPSULATION: Base Class User
// ============================================================================
class User {
protected:
    std::string id;
    std::string name;
    std::string email;
    std::string college;
    std::string course;
    std::string year;

public:
    User(std::string id, std::string name, std::string email, 
         std::string college = "VIT University", std::string course = "B.Tech Computer Science", std::string year = "3rd Year")
        : id(std::move(id)), name(std::move(name)), email(std::move(email)), 
          college(std::move(college)), course(std::move(course)), year(std::move(year)) {}

    virtual ~User() = default;

    virtual std::string getRole() const = 0;

    virtual json toJson() const {
        return json{
            {"id", id},
            {"name", name},
            {"email", email},
            {"college", college},
            {"course", course},
            {"year", year},
            {"role", getRole()}
        };
    }

    std::string getId() const { return id; }
    std::string getName() const { return name; }
    std::string getEmail() const { return email; }
    std::string getCourse() const { return course; }
    std::string getYear() const { return year; }
};

// ============================================================================
// 2. INHERITANCE: Student Class (Student IS-A User)
// ============================================================================
class Student : public User {
private:
    double cgpa;
    double attendance;
    double assignmentCompletion;
    double averageScore;
    std::vector<std::string> skills;
    std::vector<std::string> interests;
    std::string careerGoals;

public:
    Student(std::string id, std::string name, std::string email, 
            double cgpa = 8.2, double attendance = 87.0, double completion = 80.0, double avgScore = 78.5,
            std::vector<std::string> skills = {"C++", "Data Structures", "Python", "SQL"},
            std::vector<std::string> interests = {"AI", "Cloud", "Systems"},
            std::string careerGoals = "Software Systems Engineer",
            std::string college = "VIT University", std::string course = "B.Tech Computer Science", std::string year = "3rd Year")
        : User(std::move(id), std::move(name), std::move(email), std::move(college), std::move(course), std::move(year)), 
          cgpa(cgpa), attendance(attendance), assignmentCompletion(completion), averageScore(avgScore),
          skills(std::move(skills)), interests(std::move(interests)), careerGoals(std::move(careerGoals)) {}

    std::string getRole() const override {
        return "STUDENT";
    }

    json toJson() const override {
        json j = User::toJson();
        j["cgpa"] = cgpa;
        j["attendance"] = attendance;
        j["assignment_completion"] = assignmentCompletion;
        j["average_score"] = averageScore;
        j["skills"] = skills;
        j["interests"] = interests;
        j["career_goals"] = careerGoals;
        return j;
    }

    double getCGPA() const { return cgpa; }
    double getAttendance() const { return attendance; }
    double getAssignmentCompletion() const { return assignmentCompletion; }
    double getAverageScore() const { return averageScore; }
    const std::vector<std::string>& getSkills() const { return skills; }
};

// ============================================================================
// 3. INHERITANCE: Teacher Class (Teacher IS-A User)
// ============================================================================
class Teacher : public User {
private:
    std::string department;
    std::string designation;
    std::vector<std::string> subjectsTaught;

public:
    Teacher(std::string id, std::string name, std::string email, 
            std::string dept = "Computer Science & Engineering",
            std::string designation = "Associate Professor",
            std::vector<std::string> subjects = {"Data Structures & Algorithms", "OOPS in C++"})
        : User(std::move(id), std::move(name), std::move(email)),
          department(std::move(dept)), designation(std::move(designation)), subjectsTaught(std::move(subjects)) {}

    std::string getRole() const override {
        return "TEACHER";
    }

    json toJson() const override {
        json j = User::toJson();
        j["department"] = department;
        j["designation"] = designation;
        j["subjects_taught"] = subjectsTaught;
        return j;
    }
};

// ============================================================================
// 4. INHERITANCE: Admin Class (Admin IS-A User)
// ============================================================================
class Admin : public User {
public:
    Admin(std::string id, std::string name, std::string email)
        : User(std::move(id), std::move(name), std::move(email), "VIT University", "Academic Affairs", "Dean") {}

    std::string getRole() const override {
        return "ADMIN";
    }
};

// ============================================================================
// 5. Data Transfer Objects / Entities
// ============================================================================
struct PerformanceRecord {
    std::string id;
    std::string studentId;
    std::string subject;
    std::string topic;
    double score;
    std::string assessmentType;
    std::string date;

    json toJson() const {
        return json{
            {"id", id},
            {"student_id", studentId},
            {"subject", subject},
            {"topic", topic},
            {"score", score},
            {"assessment_type", assessmentType},
            {"date", date}
        };
    }
};

struct SubjectRecord {
    std::string id;
    std::string name;
    std::string code;
    std::string description;
    std::string teacherId;
    std::string teacherName;
    int credits;
    std::string schedule;

    json toJson() const {
        return json{
            {"id", id},
            {"name", name},
            {"code", code},
            {"description", description},
            {"teacher_id", teacherId},
            {"teacher_name", teacherName},
            {"credits", credits},
            {"schedule", schedule}
        };
    }
};

struct AssignmentWithSubmission {
    std::string id;
    std::string title;
    std::string subject;
    std::string topic;
    std::string deadline;
    int maxMarks;
    std::string difficulty;
    std::string description;
    std::string status;          // Assignment overall status: Active, Closed
    std::string userStatus;      // Student specific: Pending, Submitted, Graded
    double marks;
    bool hasMarks;
    std::string teacherFeedback;
    json aiEvaluation;

    json toJson() const {
        json j = {
            {"id", id},
            {"title", title},
            {"subject", subject},
            {"topic", topic},
            {"deadline", deadline},
            {"max_marks", maxMarks},
            {"difficulty", difficulty},
            {"description", description},
            {"status", status},
            {"user_status", userStatus},
            {"grade", hasMarks ? json(marks) : nullptr},
            {"teacher_feedback", teacherFeedback.empty() ? nullptr : json(teacherFeedback)},
            {"ai_evaluation", aiEvaluation.is_null() ? nullptr : aiEvaluation}
        };
        return j;
    }
};

struct NotificationRecord {
    std::string id;
    std::string userId;
    std::string title;
    std::string message;
    std::string type;
    int isRead;
    std::string createdAt;

    json toJson() const {
        return json{
            {"id", id},
            {"user_id", userId},
            {"title", title},
            {"message", message},
            {"type", type},
            {"is_read", isRead},
            {"created_at", createdAt}
        };
    }
};

struct FeedbackHistoryRecord {
    std::string id;
    std::string subject;
    std::string teacherName;
    std::string category;
    std::string comment;
    int teachingRating;
    int difficultyRating;
    int paceRating;
    int materialRating;
    std::string status;
    std::string createdAt;

    json toJson() const {
        return json{
            {"id", id},
            {"subject", subject},
            {"teacher_name", teacherName},
            {"category", category},
            {"comment", comment},
            {"teaching_rating", teachingRating},
            {"difficulty_rating", difficultyRating},
            {"pace_rating", paceRating},
            {"material_rating", materialRating},
            {"status", status},
            {"created_at", createdAt}
        };
    }
};

// ============================================================================
// 6. RAII Database Manager with Parameterized Queries
// ============================================================================
class DatabaseManager {
private:
    sqlite3* db = nullptr;

public:
    DatabaseManager(const std::string& dbPath) {
        if (sqlite3_open(dbPath.c_str(), &db) != SQLITE_OK) {
            std::cerr << "[ERROR] Failed to open SQLite database: " << sqlite3_errmsg(db) << "\n";
            db = nullptr;
        } else {
            std::cout << "[INFO] SQLite database connected: " << dbPath << "\n";
        }
    }

    ~DatabaseManager() {
        if (db) {
            sqlite3_close(db);
            std::cout << "[INFO] SQLite connection cleanly closed (RAII).\n";
        }
    }

    bool isOpen() const { return db != nullptr; }
    sqlite3* getHandle() const { return db; }

    // Fetch User by ID
    std::unique_ptr<User> getUserById(const std::string& userId) {
        if (!db) return nullptr;
        sqlite3_stmt* stmt;
        const char* sql = "SELECT u.id, u.name, u.email, u.role, u.college, u.course, u.year, "
                          "p.cgpa, p.attendance_pct, p.assignment_completion_pct, p.average_score, p.skills, p.interests, p.career_goals "
                          "FROM users u LEFT JOIN student_profiles p ON u.id = p.user_id WHERE u.id = ?";
        
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) return nullptr;
        sqlite3_bind_text(stmt, 1, userId.c_str(), -1, SQLITE_STATIC);

        std::unique_ptr<User> user = nullptr;
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            std::string id = (const char*)sqlite3_column_text(stmt, 0);
            std::string name = (const char*)sqlite3_column_text(stmt, 1);
            std::string email = (const char*)sqlite3_column_text(stmt, 2);
            std::string role = (const char*)sqlite3_column_text(stmt, 3);
            std::string college = sqlite3_column_text(stmt, 4) ? (const char*)sqlite3_column_text(stmt, 4) : "VIT University";
            std::string course = sqlite3_column_text(stmt, 5) ? (const char*)sqlite3_column_text(stmt, 5) : "B.Tech Computer Science";
            std::string year = sqlite3_column_text(stmt, 6) ? (const char*)sqlite3_column_text(stmt, 6) : "3rd Year";

            if (role == "STUDENT") {
                double cgpa = sqlite3_column_double(stmt, 7);
                double att = sqlite3_column_double(stmt, 8);
                double comp = sqlite3_column_double(stmt, 9);
                double avg = sqlite3_column_double(stmt, 10);
                std::vector<std::string> skills = {"C++", "Python", "Data Structures", "SQL"};
                if (sqlite3_column_text(stmt, 11)) {
                    try { skills = json::parse((const char*)sqlite3_column_text(stmt, 11)).get<std::vector<std::string>>(); } catch (...) {}
                }
                std::vector<std::string> interests = {"AI", "Cloud Computing"};
                if (sqlite3_column_text(stmt, 12)) {
                    try { interests = json::parse((const char*)sqlite3_column_text(stmt, 12)).get<std::vector<std::string>>(); } catch (...) {}
                }
                std::string goals = sqlite3_column_text(stmt, 13) ? (const char*)sqlite3_column_text(stmt, 13) : "";

                user = std::make_unique<Student>(id, name, email, cgpa, att, comp, avg, skills, interests, goals, college, course, year);
            } else if (role == "TEACHER") {
                user = std::make_unique<Teacher>(id, name, email);
            } else {
                user = std::make_unique<Admin>(id, name, email);
            }
        }
        sqlite3_finalize(stmt);
        return user;
    }

    // Fetch User by Email
    std::unique_ptr<User> getUserByEmail(const std::string& emailQuery) {
        if (!db) return nullptr;
        sqlite3_stmt* stmt;
        const char* sql = "SELECT id FROM users WHERE email = ? LIMIT 1";
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) return nullptr;
        sqlite3_bind_text(stmt, 1, emailQuery.c_str(), -1, SQLITE_STATIC);

        std::string userId = "";
        if (sqlite3_step(stmt) == SQLITE_ROW) {
            userId = (const char*)sqlite3_column_text(stmt, 0);
        }
        sqlite3_finalize(stmt);

        if (!userId.empty()) {
            return getUserById(userId);
        }
        return nullptr;
    }

    // Fetch Performance Records for a SPECIFIC Student
    std::vector<PerformanceRecord> getPerformanceRecords(const std::string& studentId) {
        std::vector<PerformanceRecord> list;
        if (!db) return list;

        sqlite3_stmt* stmt;
        const char* sql = "SELECT id, student_id, subject, topic, score, assessment_type, assessment_date "
                          "FROM performance_records WHERE student_id = ? ORDER BY assessment_date ASC";
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) return list;
        sqlite3_bind_text(stmt, 1, studentId.c_str(), -1, SQLITE_STATIC);

        while (sqlite3_step(stmt) == SQLITE_ROW) {
            PerformanceRecord r;
            r.id = (const char*)sqlite3_column_text(stmt, 0);
            r.studentId = (const char*)sqlite3_column_text(stmt, 1);
            r.subject = (const char*)sqlite3_column_text(stmt, 2);
            r.topic = (const char*)sqlite3_column_text(stmt, 3);
            r.score = sqlite3_column_double(stmt, 4);
            r.assessmentType = sqlite3_column_text(stmt, 5) ? (const char*)sqlite3_column_text(stmt, 5) : "Assessment";
            r.date = sqlite3_column_text(stmt, 6) ? (const char*)sqlite3_column_text(stmt, 6) : "";
            list.push_back(r);
        }
        sqlite3_finalize(stmt);
        return list;
    }

    // Fetch Enrolled Classes / Subjects
    std::vector<SubjectRecord> getStudentClasses(const std::string& studentId) {
        std::vector<SubjectRecord> list;
        if (!db) return list;

        sqlite3_stmt* stmt;
        const char* sql = "SELECT id, name, code, description, teacher_id, teacher_name, credits, schedule FROM subjects ORDER BY code ASC";
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) return list;

        while (sqlite3_step(stmt) == SQLITE_ROW) {
            SubjectRecord s;
            s.id = (const char*)sqlite3_column_text(stmt, 0);
            s.name = (const char*)sqlite3_column_text(stmt, 1);
            s.code = (const char*)sqlite3_column_text(stmt, 2);
            s.description = sqlite3_column_text(stmt, 3) ? (const char*)sqlite3_column_text(stmt, 3) : "";
            s.teacherId = sqlite3_column_text(stmt, 4) ? (const char*)sqlite3_column_text(stmt, 4) : "";
            s.teacherName = sqlite3_column_text(stmt, 5) ? (const char*)sqlite3_column_text(stmt, 5) : "";
            s.credits = sqlite3_column_int(stmt, 6);
            s.schedule = sqlite3_column_text(stmt, 7) ? (const char*)sqlite3_column_text(stmt, 7) : "";
            list.push_back(s);
        }
        sqlite3_finalize(stmt);
        return list;
    }

    // Fetch Assignments Joined with this SPECIFIC Student's Submissions
    std::vector<AssignmentWithSubmission> getStudentAssignments(const std::string& studentId) {
        std::vector<AssignmentWithSubmission> list;
        if (!db) return list;

        sqlite3_stmt* stmt;
        const char* sql = "SELECT a.id, a.title, a.subject, a.topic, a.deadline, a.max_marks, a.difficulty, a.description, a.status, "
                          "s.status, s.marks, s.teacher_feedback, s.ai_evaluation "
                          "FROM assignments a "
                          "LEFT JOIN submissions s ON a.id = s.assignment_id AND s.student_id = ? "
                          "ORDER BY a.deadline ASC";
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) return list;
        sqlite3_bind_text(stmt, 1, studentId.c_str(), -1, SQLITE_STATIC);

        while (sqlite3_step(stmt) == SQLITE_ROW) {
            AssignmentWithSubmission a;
            a.id = (const char*)sqlite3_column_text(stmt, 0);
            a.title = (const char*)sqlite3_column_text(stmt, 1);
            a.subject = (const char*)sqlite3_column_text(stmt, 2);
            a.topic = sqlite3_column_text(stmt, 3) ? (const char*)sqlite3_column_text(stmt, 3) : "";
            a.deadline = (const char*)sqlite3_column_text(stmt, 4);
            a.maxMarks = sqlite3_column_int(stmt, 5);
            a.difficulty = (const char*)sqlite3_column_text(stmt, 6);
            a.description = sqlite3_column_text(stmt, 7) ? (const char*)sqlite3_column_text(stmt, 7) : "";
            a.status = (const char*)sqlite3_column_text(stmt, 8);

            const char* submStatus = (const char*)sqlite3_column_text(stmt, 9);
            if (submStatus) {
                a.userStatus = submStatus;
                if (sqlite3_column_type(stmt, 10) != SQLITE_NULL) {
                    a.marks = sqlite3_column_double(stmt, 10);
                    a.hasMarks = true;
                } else {
                    a.marks = 0;
                    a.hasMarks = false;
                }
                a.teacherFeedback = sqlite3_column_text(stmt, 11) ? (const char*)sqlite3_column_text(stmt, 11) : "";
                if (sqlite3_column_text(stmt, 12)) {
                    try { a.aiEvaluation = json::parse((const char*)sqlite3_column_text(stmt, 12)); } catch (...) {}
                }
            } else {
                a.userStatus = (a.status == "Active") ? "Pending" : "Overdue";
                a.marks = 0;
                a.hasMarks = false;
            }
            list.push_back(a);
        }
        sqlite3_finalize(stmt);
        return list;
    }

    // Submit an assignment for this SPECIFIC student
    bool submitAssignment(const std::string& submId, const std::string& asgId, const std::string& studentId,
                          const std::string& studentName, const std::string& fileName, const json& aiEval) {
        if (!db) return false;
        sqlite3_stmt* stmt;
        // Delete any existing submission for this student on this assignment first
        const char* delSql = "DELETE FROM submissions WHERE assignment_id = ? AND student_id = ?";
        if (sqlite3_prepare_v2(db, delSql, -1, &stmt, nullptr) == SQLITE_OK) {
            sqlite3_bind_text(stmt, 1, asgId.c_str(), -1, SQLITE_STATIC);
            sqlite3_bind_text(stmt, 2, studentId.c_str(), -1, SQLITE_STATIC);
            sqlite3_step(stmt);
            sqlite3_finalize(stmt);
        }

        const char* insSql = "INSERT INTO submissions (id, assignment_id, student_id, student_name, submitted_at, file_name, status, marks, teacher_feedback, ai_evaluation) "
                             "VALUES (?, ?, ?, ?, 'Today', ?, 'Submitted', NULL, NULL, ?)";
        if (sqlite3_prepare_v2(db, insSql, -1, &stmt, nullptr) != SQLITE_OK) return false;

        std::string evalStr = aiEval.dump();
        sqlite3_bind_text(stmt, 1, submId.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 2, asgId.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 3, studentId.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 4, studentName.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 5, fileName.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 6, evalStr.c_str(), -1, SQLITE_STATIC);

        bool ok = (sqlite3_step(stmt) == SQLITE_DONE);
        sqlite3_finalize(stmt);
        return ok;
    }

    // Fetch Notifications for this SPECIFIC Student
    std::vector<NotificationRecord> getStudentNotifications(const std::string& studentId) {
        std::vector<NotificationRecord> list;
        if (!db) return list;

        sqlite3_stmt* stmt;
        const char* sql = "SELECT id, user_id, title, message, type, is_read, created_at "
                          "FROM notifications WHERE user_id = ? ORDER BY created_at DESC";
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) return list;
        sqlite3_bind_text(stmt, 1, studentId.c_str(), -1, SQLITE_STATIC);

        while (sqlite3_step(stmt) == SQLITE_ROW) {
            NotificationRecord n;
            n.id = (const char*)sqlite3_column_text(stmt, 0);
            n.userId = (const char*)sqlite3_column_text(stmt, 1);
            n.title = (const char*)sqlite3_column_text(stmt, 2);
            n.message = (const char*)sqlite3_column_text(stmt, 3);
            n.type = (const char*)sqlite3_column_text(stmt, 4);
            n.isRead = sqlite3_column_int(stmt, 5);
            n.createdAt = sqlite3_column_text(stmt, 6) ? (const char*)sqlite3_column_text(stmt, 6) : "";
            list.push_back(n);
        }
        sqlite3_finalize(stmt);
        return list;
    }

    // Fetch Feedback History for this SPECIFIC Student (while keeping teacher view anonymous)
    std::vector<FeedbackHistoryRecord> getStudentFeedbackHistory(const std::string& studentId) {
        std::vector<FeedbackHistoryRecord> list;
        if (!db) return list;

        sqlite3_stmt* stmt;
        const char* sql = "SELECT id, subject, teacher_name, category, comment, teaching_rating, difficulty_rating, pace_rating, material_rating, status, created_at "
                          "FROM anonymous_feedback WHERE student_id = ? ORDER BY created_at DESC";
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) return list;
        sqlite3_bind_text(stmt, 1, studentId.c_str(), -1, SQLITE_STATIC);

        while (sqlite3_step(stmt) == SQLITE_ROW) {
            FeedbackHistoryRecord f;
            f.id = (const char*)sqlite3_column_text(stmt, 0);
            f.subject = (const char*)sqlite3_column_text(stmt, 1);
            f.teacherName = (const char*)sqlite3_column_text(stmt, 2);
            f.category = (const char*)sqlite3_column_text(stmt, 3);
            f.comment = (const char*)sqlite3_column_text(stmt, 4);
            f.teachingRating = sqlite3_column_int(stmt, 5);
            f.difficultyRating = sqlite3_column_int(stmt, 6);
            f.paceRating = sqlite3_column_int(stmt, 7);
            f.materialRating = sqlite3_column_int(stmt, 8);
            f.status = sqlite3_column_text(stmt, 9) ? (const char*)sqlite3_column_text(stmt, 9) : "Submitted";
            f.createdAt = sqlite3_column_text(stmt, 10) ? (const char*)sqlite3_column_text(stmt, 10) : "";
            list.push_back(f);
        }
        sqlite3_finalize(stmt);
        return list;
    }

    // Insert feedback with student_id linked for student history
    bool submitFeedback(const std::string& fbId, const std::string& studentId, const std::string& subject,
                        const std::string& teacherName, const std::string& category, const std::string& comment,
                        int tRate, int dRate, int pRate, int mRate) {
        if (!db) return false;
        sqlite3_stmt* stmt;
        const char* sql = "INSERT INTO anonymous_feedback (id, student_id, subject, teacher_name, category, comment, teaching_rating, difficulty_rating, pace_rating, material_rating, status, created_at) "
                          "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted', 'Today')";
        if (sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr) != SQLITE_OK) return false;

        sqlite3_bind_text(stmt, 1, fbId.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 2, studentId.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 3, subject.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 4, teacherName.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 5, category.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 6, comment.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_int(stmt, 7, tRate);
        sqlite3_bind_int(stmt, 8, dRate);
        sqlite3_bind_int(stmt, 9, pRate);
        sqlite3_bind_int(stmt, 10, mRate);

        bool ok = (sqlite3_step(stmt) == SQLITE_DONE);
        sqlite3_finalize(stmt);
        return ok;
    }
};
