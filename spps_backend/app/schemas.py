from pydantic import BaseModel, EmailStr, StringConstraints 
from typing import Literal, Annotated


#Registration_System
class RegisterRequest(BaseModel):
    username: Annotated[str, StringConstraints(strip_whitespace = True, min_length=3, max_length=50, pattern="^[a-zA-Z0-9_]+$")]
    email: EmailStr
    password: Annotated[str, StringConstraints(strip_whitespace = True, min_length=3, max_length=72)]
    role: Literal["teacher", "student"]

class UserOut(BaseModel):
    username: Annotated[str, StringConstraints(strip_whitespace = True, min_length=3, max_length=50, pattern="^[a-zA-Z0-9_]+$")]
    email: EmailStr
    role: str 


#Testing_System
class QuestionBase(BaseModel):
    subject: str 
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    explanation: str
    difficulty_level: str

class QuestionResponse(QuestionBase):
    id: int

    class Config:
        from_attributes = True

class QuestionOut(BaseModel):
    id: int 
    subject: str 
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

    class Config:
        from_attributes = True

class AnswerSubmission(BaseModel):
    question_id: int
    selected_option: str

class TestSubmission(BaseModel):
    total_questions: int
    answers: list[AnswerSubmission]
    difficulty_level: str

class WrongAnswerReview(BaseModel):
    question: str
    selected_option: str
    correct_option: str
    explanation: str

#Result_Analysis_and_Prediction_System
class TestAttemptResponse(BaseModel):
    id: int
    user_id: int
    subject: str
    score: int
    total_questions: int
    percentage: float

    class Config:
        from_attributes = True

class SubmitTestResponse(BaseModel):
    score: int
    total_questions: int
    percentage: float
    wrong_answers: list[WrongAnswerReview]