from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    college: Optional[str] = None
    course: Optional[str] = None
    year: Optional[str] = None
    avatar_url: Optional[str] = None

class AssignmentCreate(BaseModel):
    title: str
    subject: str
    topic: str
    deadline: str
    max_marks: int
    difficulty: str
    description: str

class SubmissionSubmit(BaseModel):
    assignment_id: str
    file_name: str
    code_content: Optional[str] = None

class GradeSubmission(BaseModel):
    marks: int
    feedback: str

class FeedbackSubmit(BaseModel):
    subject: str
    teacher_name: str
    category: str
    comment: str
    teaching_rating: Optional[int] = 4
    difficulty_rating: Optional[int] = 3
    pace_rating: Optional[int] = 3
    material_rating: Optional[int] = 4

class UpdateProfileSkills(BaseModel):
    skills: List[str]
    interests: List[str]
    career_goals: Optional[str] = None

class AIChatRequest(BaseModel):
    query: str

class StudyPlanRequest(BaseModel):
    duration_days: int = 7
