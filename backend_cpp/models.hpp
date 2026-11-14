#pragma once
#include <string>
#include <vector>
#include "json.hpp"
#include <sqlite3.h>
#include <iostream>

using json = nlohmann::json;

// ============================================================================
// 1. ABSTRACTION & ENCAPSULATION: Base Class User
// ============================================================================
// Represents a generic user in the StudentConnector academic system.
// Demonstrates Encapsulation (protected fields) and Abstraction (pure virtual).
class User {
protected:
    std::string id;
    std::string name;
    std::string email;
    std::string college;

public:
    // Constructor using Member Initializer List (Best practice in C++)
    User(std::string id, std::string name, std::string email, std::string college = "VIT University")
        : id(std::move(id)), name(std::move(name)), email(std::move(email)), college(std::move(college)) {}

    virtual ~User() = default;

    // PURE VIRTUAL METHOD -> Forces derived classes to implement their own role
    // This demonstrates RUN-TIME POLYMORPHISM & ABSTRACTION.
    virtual std::string getRole() const = 0;

    // Virtual serialization method (Polymorphic JSON output)
    virtual json toJson() const {
        return json{
            {"id", id},
            {"name", name},
            {"email", email},
            {"college", college},
            {"role", getRole()}
        };
    }

    // Getters demonstrating Encapsulation (controlled read access)
    std::string getId() const { return id; }
    std::string getName() const { return name; }
    std::string getEmail() const { return email; }
};

// ============================================================================
// 2. INHERITANCE: Student Class (Student IS-A User)
// ============================================================================
class Student : public User {
private:
    double cgpa;
    double attendance;
    double assignmentCompletion;
    std::vector<std::string> skills;
    std::string course;

public:
    Student(std::string id, std::string name, std::string email, 
            double cgpa = 8.2, double attendance = 87.0, double completion = 80.0,
            std::vector<std::string> skills = {"C++", "Python", "DSA", "SQL"},
            std::string course = "B.Tech Computer Science")
        : User(std::move(id), std::move(name), std::move(email)), 
          cgpa(cgpa), attendance(attendance), assignmentCompletion(completion), 
          skills(std::move(skills)), course(std::move(course)) {}

    // RUN-TIME POLYMORPHISM: Overriding base pure virtual method
    std::string getRole() const override {
        return "STUDENT";
    }

    // Overriding toJson to include student-specific academic metrics
    json toJson() const override {
        json j = User::toJson();
        j["cgpa"] = cgpa;
        j["attendance"] = attendance;
        j["assignment_completion"] = assignmentCompletion;
        j["skills"] = skills;
        j["course"] = course;
        j["year"] = "3rd Year";
        return j;
    }

    double getCGPA() const { return cgpa; }
    double getAttendance() const { return attendance; }
};

// ============================================================================
// 3. INHERITANCE: Teacher Class (Teacher IS-A User)
// ============================================================================
class Teacher : public User {
private:
    std::string department;
    std::string designation;

public:
    Teacher(std::string id, std::string name, std::string email, 
            std::string dept = "Computer Science & Engineering",
            std::string designation = "Associate Professor")
        : User(std::move(id), std::move(name), std::move(email)),
          department(std::move(dept)), designation(std::move(designation)) {}

    std::string getRole() const override {
        return "TEACHER";
    }

    json toJson() const override {
        json j = User::toJson();
        j["department"] = department;
        j["designation"] = designation;
        return j;
    }
};

// ============================================================================
// 4. INHERITANCE: Admin Class (Admin IS-A User)
// ============================================================================
class Admin : public User {
public:
    Admin(std::string id, std::string name, std::string email)
        : User(std::move(id), std::move(name), std::move(email)) {}

    std::string getRole() const override {
        return "ADMIN";
    }
};

// ============================================================================
// 5. ENCAPSULATION: Assignment Class
// ============================================================================
class Assignment {
private:
    std::string id;
    std::string title;
    std::string subject;
    std::string topic;
    std::string deadline;
    int maxMarks;
    std::string difficulty;
    std::string status;

public:
    Assignment(std::string id, std::string title, std::string subject, std::string topic,
               std::string deadline, int maxMarks, std::string difficulty, std::string status = "Active")
        : id(std::move(id)), title(std::move(title)), subject(std::move(subject)),
          topic(std::move(topic)), deadline(std::move(deadline)), maxMarks(maxMarks),
          difficulty(std::move(difficulty)), status(std::move(status)) {}

    json toJson() const {
        return json{
            {"id", id},
            {"title", title},
            {"subject", subject},
            {"topic", topic},
            {"deadline", deadline},
            {"max_marks", maxMarks},
            {"difficulty", difficulty},
            {"status", status},
            {"user_status", "Active"}
        };
    }
};

// ============================================================================
// 6. RAII (Resource Acquisition Is Initialization): Database Manager
// ============================================================================
// Manages the SQLite database connection handle safely.
// Automatically closes connection when object goes out of scope.
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
};
