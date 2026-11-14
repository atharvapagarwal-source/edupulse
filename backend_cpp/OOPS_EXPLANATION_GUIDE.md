# StudentConnector C++ OOPS Architecture & Viva Cheat-Sheet

This guide prepares you to explain the C++ backend to your professor ("Mam") step-by-step.

---

## 1. High-Level Architecture
* **Frontend**: React + TypeScript + Tailwind CSS (runs on `http://localhost:5173`).
* **Backend**: Modern C++ (C++17) HTTP Server listening on port `8000` (runs via `server.exe`).
* **Database**: SQLite (`edupulse.db`) queried using standard C++ SQLite library (`sqlite3.h`).
* **Protocol**: REST API over JSON (using `json.hpp`).

---

## 2. Core OOPS Concepts Implemented in Code

When asked: *"Where have you used Object-Oriented Programming?"*  
Open [`backend_cpp/models.hpp`](file:///d:/VIT%20Sem%203/OOPS/edupulse/backend_cpp/models.hpp) and show these 5 concepts:

### 1. Abstraction (Pure Virtual Function & Abstract Base Class)
* **Class**: `User`
* **Code**:
  ```cpp
  virtual std::string getRole() const = 0;
  ```
* **Explanation to Mam**:  
  *"Mam, the `User` class is an abstract base class. It defines the generic interface for any user in StudentConnector. Because `getRole()` has `= 0`, it cannot be instantiated directly, enforcing pure abstraction."*

### 2. Encapsulation & Data Hiding
* **Protected and Private Members**:
  ```cpp
  protected:
      std::string id;
      std::string name;
      std::string email;
  ```
* **Constructor Member Initializer List**:
  ```cpp
  User(std::string id, std::string name, std::string email)
      : id(std::move(id)), name(std::move(name)), email(std::move(email)) {}
  ```
* **Explanation to Mam**:  
  *"We protect internal attributes (`id`, `name`, `email`) using access specifiers and expose access only through public getter methods (`getId()`, `getName()`), preventing unauthorized modifications."*

### 3. Inheritance (Code Reusability)
* **Classes**: `Student : public User`, `Teacher : public User`, `Admin : public User`
* **Code**:
  ```cpp
  class Student : public User { ... };
  class Teacher : public User { ... };
  ```
* **Explanation to Mam**:  
  *"Both `Student` and `Teacher` have an **'IS-A'** relationship with `User`. They inherit all common properties (ID, name, email) from `User`, and extend it with their domain-specific properties like CGPA, attendance, or department."*

### 4. Run-Time Polymorphism (Dynamic Binding / Method Overriding)
* **Overriding in Derived Classes**:
  ```cpp
  // Inside Student:
  std::string getRole() const override { return "STUDENT"; }

  // Inside Teacher:
  std::string getRole() const override { return "TEACHER"; }
  ```
* **Polymorphic Call in `server.cpp`**:
  ```cpp
  std::unique_ptr<User> currentUser;
  if (...) currentUser = std::make_unique<Teacher>(...);
  else currentUser = std::make_unique<Student>(...);

  // Dynamic dispatch calls the correct overridden function at runtime:
  std::string role = currentUser->getRole();
  ```
* **Explanation to Mam**:  
  *"Mam, we use base class pointers (`std::unique_ptr<User>`) to point to derived objects (`Student` or `Teacher`). When we call `currentUser->getRole()`, C++ uses the Virtual Table (VTable) at runtime to execute the correct derived method."*

### 5. RAII (Resource Acquisition Is Initialization)
* **Class**: `DatabaseManager`
* **Code**:
  ```cpp
  DatabaseManager::DatabaseManager(const std::string& path) {
      sqlite3_open(path.c_str(), &db); // Resource acquired
  }
  DatabaseManager::~DatabaseManager() {
      if (db) sqlite3_close(db);        // Resource automatically released
  }
  ```
* **Explanation to Mam**:  
  *"We use RAII for database connection management. When `DatabaseManager` is instantiated, it opens the SQLite database. When the server shuts down or the object goes out of scope, the destructor automatically closes the database handle, preventing memory and resource leaks."*

---

## 3. How to Run the Demo for Your Viva

### Step 1: Start the C++ Backend
* Double-click `run_cpp_backend.bat` in the project folder (or in terminal: `npm run cpp:start`).
* You will see:
  ```text
  [INFO] SQLite database connected
  [READY] StudentConnector C++ Server listening on http://localhost:8000
  ```

### Step 2: Start the Website Frontend
* Open a second terminal and run:
  ```bash
  npm run dev
  ```
* Open your browser at `http://localhost:5173`.

### Step 3: Show the Site
* Log in or navigate through **Student Dashboard**, **Performance Analytics**, and **Assignments**.
* In the C++ terminal, show how your C++ server logs each request in real time:
  ```text
  [LOG] User Login: Atharva Pagarwal | Polymorphic Role: STUDENT
  [LOG] GET /api/student/dashboard -> Serving Student metrics (CGPA: 8.2)
  [LOG] GET /api/assignments -> Returned 4 assignments
  ```
