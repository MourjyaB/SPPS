from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean 
from app.database import Base   
from datetime import datetime 

# Users Table
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow) 
    promoted_by = Column(Integer, ForeignKey("users.id"), nullable=True) 
    promoted_at = Column(DateTime, nullable=True)
    banned_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    banned_at = Column(DateTime, nullable=True)
    unbanned_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    unbanned_at = Column(DateTime, nullable=True)

# Questions Table
class Question(Base):
    __tablename__ = "questions"

    id = Column (Integer, primary_key=True, index=True)
    subject = Column (String, index=True)
    question = Column (String)
    option_a = Column (String)
    option_b = Column (String)
    option_c = Column (String)
    option_d = Column (String)
    correct_option = Column (String)
    explanation = Column (String)
    difficulty_level = Column(String(1), nullable=False)  # E.g., 'E', 'M', 'D' for Easy, Moderate, Difficult 
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="pending")  # pending, verified, rejected 

# Test Attempts Table
class TestAttempt(Base):
    __tablename__ = "test_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject = Column(String)
    score = Column(Integer)
    total_questions = Column(Integer)
    percentage = Column (Float) 
    difficulty_level = Column(String(1), nullable=False)  
    timestamp = Column(DateTime, default=datetime.utcnow)