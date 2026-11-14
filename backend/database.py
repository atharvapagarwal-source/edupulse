import os
from collections.abc import Mapping

import psycopg
from psycopg.rows import tuple_row


class Row(Mapping):
    """A small SQLite-like row: supports row[0], row[\"column\"], and dict(row)."""
    def __init__(self, names, values):
        self._names = tuple(names)
        self._values = tuple(values)
        self._lookup = {name: index for index, name in enumerate(self._names)}

    def __getitem__(self, key):
        if isinstance(key, int):
            return self._values[key]
        return self._values[self._lookup[key]]

    def __iter__(self):
        return iter(self._names)

    def __len__(self):
        return len(self._names)


class Cursor:
    def __init__(self, cursor):
        self._cursor = cursor

    @property
    def rowcount(self):
        return self._cursor.rowcount

    def execute(self, sql, params=()):
        # Existing EduPulse queries use SQLite's ? placeholders.
        self._cursor.execute(sql.replace("?", "%s"), params)
        return self

    def fetchone(self):
        values = self._cursor.fetchone()
        if values is None:
            return None
        names = [column.name for column in self._cursor.description]
        return Row(names, values)

    def fetchall(self):
        rows = self._cursor.fetchall()
        if not self._cursor.description:
            return rows
        names = [column.name for column in self._cursor.description]
        return [Row(names, values) for values in rows]

    def close(self):
        self._cursor.close()


class Connection:
    def __init__(self, connection):
        self._connection = connection

    def execute(self, sql, params=()):
        return Cursor(self._connection.execute(sql.replace("?", "%s"), params))

    def cursor(self):
        return Cursor(self._connection.cursor())

    def commit(self):
        self._connection.commit()

    def rollback(self):
        self._connection.rollback()

    def close(self):
        self._connection.close()


def get_db_connection():
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is missing. Add it to the backend environment settings.")
    connection = psycopg.connect(
        database_url,
        sslmode="require",
        connect_timeout=10,
        prepare_threshold=None,
        row_factory=tuple_row,
    )
    return Connection(connection)


def init_db():
    """Create EduPulse's existing tables in Supabase if they do not exist yet."""
    conn = get_db_connection()
    try:
        statements = [
            """CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
                role TEXT NOT NULL, college TEXT, course TEXT, year TEXT, avatar_url TEXT
            )""",
            """CREATE TABLE IF NOT EXISTS student_profiles (
                user_id TEXT PRIMARY KEY, cgpa REAL, attendance_pct REAL,
                assignment_completion_pct REAL, average_score REAL, skills TEXT,
                interests TEXT, career_goals TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )""",
            """CREATE TABLE IF NOT EXISTS teacher_profiles (
                user_id TEXT PRIMARY KEY, department TEXT, designation TEXT,
                subjects_taught TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )""",
            """CREATE TABLE IF NOT EXISTS subjects (
                id TEXT PRIMARY KEY, name TEXT NOT NULL, code TEXT NOT NULL,
                description TEXT, teacher_id TEXT
            )""",
            """CREATE TABLE IF NOT EXISTS assignments (
                id TEXT PRIMARY KEY, title TEXT NOT NULL, subject TEXT NOT NULL,
                topic TEXT NOT NULL, deadline TEXT NOT NULL, max_marks INTEGER NOT NULL,
                difficulty TEXT NOT NULL, description TEXT, status TEXT NOT NULL
            )""",
            """CREATE TABLE IF NOT EXISTS submissions (
                id TEXT PRIMARY KEY, assignment_id TEXT NOT NULL, student_id TEXT NOT NULL,
                student_name TEXT NOT NULL, submitted_at TEXT NOT NULL, file_name TEXT,
                status TEXT NOT NULL, marks INTEGER, teacher_feedback TEXT, ai_evaluation TEXT,
                FOREIGN KEY(assignment_id) REFERENCES assignments(id)
            )""",
            """CREATE TABLE IF NOT EXISTS performance_records (
                id TEXT PRIMARY KEY, student_id TEXT NOT NULL, subject TEXT NOT NULL,
                topic TEXT NOT NULL, score_pct REAL NOT NULL, date TEXT NOT NULL
            )""",
            """CREATE TABLE IF NOT EXISTS anonymous_feedback (
                id TEXT PRIMARY KEY, subject TEXT NOT NULL, teacher_name TEXT NOT NULL,
                category TEXT NOT NULL, comment TEXT NOT NULL, teaching_rating INTEGER,
                difficulty_rating INTEGER, pace_rating INTEGER, material_rating INTEGER,
                created_at TEXT NOT NULL
            )""",
            """CREATE TABLE IF NOT EXISTS opportunities (
                id TEXT PRIMARY KEY, title TEXT NOT NULL, organization TEXT NOT NULL,
                type TEXT NOT NULL, deadline TEXT NOT NULL, eligibility TEXT NOT NULL,
                required_skills TEXT NOT NULL, location TEXT NOT NULL, description TEXT NOT NULL
            )""",
            """CREATE TABLE IF NOT EXISTS study_plans (
                id TEXT PRIMARY KEY, student_id TEXT NOT NULL, title TEXT NOT NULL,
                duration_days INTEGER NOT NULL, schedule TEXT NOT NULL, created_at TEXT NOT NULL
            )""",
            """CREATE TABLE IF NOT EXISTS notifications (
                id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL,
                message TEXT NOT NULL, type TEXT NOT NULL, is_read INTEGER DEFAULT 0,
                created_at TEXT NOT NULL
            )""",
            """CREATE TABLE IF NOT EXISTS saved_opportunities (
                student_id TEXT NOT NULL, opportunity_id TEXT NOT NULL,
                PRIMARY KEY (student_id, opportunity_id)
            )""",
        ]
        for statement in statements:
            conn.execute(statement)
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
