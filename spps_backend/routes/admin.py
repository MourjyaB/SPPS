from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.utils.security import get_current_user
from datetime import datetime 

router = APIRouter(tags=["Admin"])

def admin_only(current_user):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only.")
    return current_user

@router.get("/dashboard")
def admin_dashboard_data(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    admin_only(current_user)
    total_users = db.query(models.User).count()
    total_active_teachers = db.query(models.User).filter(models.User.role == "teacher", models.User.is_active == "TRUE").count()
    total_active_students = db.query(models.User).filter(models.User.role == "student", models.User.is_active == "TRUE").count()
    total_active_admins = db.query(models.User).filter(models.User.role == "admin", models.User.is_active == "TRUE").count()
    total_banned_users = db.query(models.User).filter(models.User.is_active == "FALSE").count()
    total_tests_taken = db.query(models.TestAttempt).count()
    total_questions = db.query(models.Question).count()
    verified_questions = db.query(models.Question).filter(models.Question.status == "verified").count()
    rejected_questions = db.query(models.Question).filter(models.Question.status == "rejected").count() 
    pending_questions = db.query(models.Question).filter(models.Question.status == "pending").count()
    return {
        "total_users": total_users,
        "total_active_teachers": total_active_teachers,
        "total_active_students": total_active_students,
        "total_active_admins": total_active_admins,
        "total_banned_users": total_banned_users,
        "total_questions": total_questions,
        "verified_questions": verified_questions,
        "rejected_questions": rejected_questions,
        "pending_questions": pending_questions,
        "total_tests_taken": total_tests_taken
    }

@router.get("/questions/pending/{subject}")
def get_pending_questions(subject: str = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    admin_only(current_user)
    query = db.query(models.Question).filter(models.Question.status == "pending")
    if subject:
        query = query.filter(models.Question.subject == subject.lower())
    questions = query.all()
    return [
        {
            "id": qn.id,
            "subject": qn.subject,
            "question": qn.question, 
            "option_a": qn.option_a, 
            "option_b": qn.option_b, 
            "option_c": qn.option_c, 
            "option_d": qn.option_d, 
            "correct_option": qn.correct_option, 
            "explanation": qn.explanation,
            "difficulty_level": qn.difficulty_level,
            "teacher_id": qn.teacher_id,
            "created_at": qn.created_at,
            "status": qn.status
        }
        for qn in questions
    ]

@router.get("/questions/verified/{subject}")
def get_verified_questions(subject: str = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    admin_only(current_user)
    query = db.query(models.Question).filter(models.Question.status == "verified")
    if subject:
        query = query.filter(models.Question.subject == subject.lower())
    questions = query.all()
    return [
        {
            "id": qn.id,
            "subject": qn.subject,
            "question": qn.question, 
            "option_a": qn.option_a, 
            "option_b": qn.option_b, 
            "option_c": qn.option_c, 
            "option_d": qn.option_d, 
            "correct_option": qn.correct_option, 
            "explanation": qn.explanation,
            "difficulty_level": qn.difficulty_level,
            "teacher_id": qn.teacher_id,
            "created_at": qn.created_at,
            "status": qn.status
        }
        for qn in questions
    ]

@router.get("/questions/rejected/{subject}")
def get_rejected_questions(subject: str = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    admin_only(current_user)
    query = db.query(models.Question).filter(models.Question.status == "rejected")
    if subject:
        query = query.filter(models.Question.subject == subject.lower())
    questions = query.all()
    return [
        {
            "id": qn.id,
            "subject": qn.subject,
            "question": qn.question, 
            "option_a": qn.option_a, 
            "option_b": qn.option_b, 
            "option_c": qn.option_c, 
            "option_d": qn.option_d, 
            "correct_option": qn.correct_option, 
            "explanation": qn.explanation,
            "difficulty_level": qn.difficulty_level,
            "teacher_id": qn.teacher_id,
            "created_at": qn.created_at,
            "status": qn.status
        }
        for qn in questions
    ]

@router.put("/questions/verify/{question_id}")
def verify_question(question_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    admin_only(current_user)
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    question.status = "verified"
    db.commit()
    return {"message": "Question verified successfully."} 

@router.put("/questions/reject/{question_id}")
def reject_question(question_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    admin_only(current_user)
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    question.status = "rejected"
    db.commit()
    return {"message": "Question rejected successfully."} 

@router.get("/all_students")
def get_all_students(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only.")
    students = db.query(models.User).filter(models.User.role == "student").all()
    return [
        {
            "id": student.id, 
            "username": student.username, 
            "email": student.email,
            "is_active": student.is_active,
            "created_at": student.created_at, 
            "promoted_by": student.promoted_by, 
            "promoted_at": student.promoted_at, 
            "banned_by": student.banned_by,  
            "banned_at": student.banned_at, 
            "unbanned_by": student.unbanned_by, 
            "unbanned_at": student.unbanned_at
        }
        for student in students
    ]

@router.get("/all_teachers")
def get_all_teachers(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only.")
    teachers = db.query(models.User).filter(models.User.role == "teacher").all()
    return [
        {
            "id": teacher.id, 
            "username": teacher.username, 
            "email": teacher.email,
            "is_active": teacher.is_active,
            "created_at": teacher.created_at, 
            "promoted_by": teacher.promoted_by, 
            "promoted_at": teacher.promoted_at, 
            "banned_by": teacher.banned_by,  
            "banned_at": teacher.banned_at, 
            "unbanned_by": teacher.unbanned_by, 
            "unbanned_at": teacher.unbanned_at
        }
        for teacher in teachers
    ]    

@router.get("/teacher_stats/{teacher_id}")
def get_teacher_stats(teacher_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    admin_only(current_user)
    teacher = db.query(models.User).filter(models.User.id == teacher_id, models.User.role == "teacher").first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found.")
    total_questions_uploaded = db.query(models.Question).filter(models.Question.teacher_id == teacher_id).count()
    pending = db.query(models.Question).filter(models.Question.teacher_id == teacher_id, models.Question.status == "pending").count()
    verified = db.query(models.Question).filter(models.Question.teacher_id == teacher_id, models.Question.status == "verified").count()
    rejected = db.query(models.Question).filter(models.Question.teacher_id == teacher_id, models.Question.status == "rejected").count()
    approval_rate = 0
    if total_questions_uploaded > 0:
        approval_rate = (verified / total_questions_uploaded) * 100
    return {
        "teacher_id": teacher.id,
        "username": teacher.username,
        "email": teacher.email, 
        "total_questions_uploaded": total_questions_uploaded,
        "pending": pending,
        "verified": verified,
        "rejected": rejected,
        "approval_rate": round(approval_rate, 2)
    }

@router.get("/all_admins")
def get_all_admins(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only.")
    admins = db.query(models.User).filter(models.User.role == "admin").all()
    return [
        {
            "id": admin.id, 
            "username": admin.username, 
            "email": admin.email,
            "is_active": admin.is_active,
            "created_at": admin.created_at, 
            "promoted_by": admin.promoted_by, 
            "promoted_at": admin.promoted_at, 
            "banned_by": admin.banned_by,  
            "banned_at": admin.banned_at, 
            "unbanned_by": admin.unbanned_by, 
            "unbanned_at": admin.unbanned_at
        }
        for admin in admins
    ]    

@router.get("/all_banned_accounts")
def get_all_banned(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only.")
    banned = db.query(models.User).filter(models.User.banned_by.isnot(None)).all()
    return [
        {
            "id": ban.id, 
            "username": ban.username, 
            "email": ban.email,
            "is_active": ban.is_active,
            "created_at": ban.created_at, 
            "promoted_by": ban.promoted_by, 
            "promoted_at": ban.promoted_at, 
            "banned_by": ban.banned_by,  
            "banned_at": ban.banned_at, 
            "unbanned_by": ban.unbanned_by, 
            "unbanned_at": ban.unbanned_at
        }
        for ban in banned
    ] 

@router.get("/find_user/{username/email/user_id}")
def find_user(username: str = None, email: str = None, user_id: int = None, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only.")
    if not username and not email and not user_id:
        raise HTTPException(status_code=400, detail="Provide username or email or user id.")
    query = db.query(models.User)
    if username:
        query = query.filter(models.User.username == username)
    if email:
        query = query.filter(models.User.email == email)
    if user_id:
        query = query.filter(models.User.id == user_id)
    users = query.all()
    if not users:
        raise HTTPException(status_code=404, detail="User not found.")
    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "promoted_by": user.promoted_by,
            "promoted_at": user.promoted_at,
            "banned_by": user.banned_by,
            "banned_at": user.banned_at,
            "unbanned_by": user.unbanned_by,
            "unbanned_at": user.unbanned_at
        }
        for user in users 
    ]

@router.put("/ban_user/{user_id}")
def ban_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    admin_only(current_user)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Admins cannot ban themselves.")
    if user.role == "admin" and current_user.promoted_by is not None:
        raise HTTPException(status_code=403, detail="Promoted admins cannot ban other admins.")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="User is already banned.")
    user.is_active = False
    user.banned_by = current_user.id
    user.banned_at = datetime.utcnow()
    db.commit()
    return {"message": f"User {user.username} banned successfully."}

@router.put("/unban_user/{user_id}")
def unban_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    admin_only(current_user)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if user.is_active:
        raise HTTPException(status_code=400, detail="User is not banned.")
    user.is_active = True
    user.unbanned_by = current_user.id
    user.unbanned_at = datetime.utcnow()
    db.commit()
    return {"message": f"User {user.username} unbanned successfully."}

@router.put("/promote_user_to_admin/{user_id}")
def promote_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    admin_only(current_user)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="User is already an admin.")
    user.role = "admin"
    user.promoted_by = current_user.id
    user.promoted_at = datetime.utcnow()
    db.commit()
    return {"message": f"User {user.username} promoted to admin successfully."}

@router.put("/demote_admin/{user_id}")
def demote_admin(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admins only.")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if user.role != "admin":
        raise HTTPException(status_code=400, detail="Target user is not an admin.")
    if user.promoted_by is None:
        raise HTTPException(status_code=403, detail="Original admin cannot be demoted.")
    if user.id == current_user.id:
        raise HTTPException(status_code=403, detail="You cannot demote yourself.")    
    #Checking Records
    student_record = db.query(models.TestAttempt).filter(models.TestAttempt.user_id == user.id).first()
    teacher_record = db.query(models.Question).filter(models.Question.teacher_id == user.id).first()
    if student_record is not None:
        user.role = "student"
        db.commit()
        return {f"User {user.id} demoted to student."}
    elif teacher_record is not None:
        user.role = "teacher"
        db.commit()
        return {f"User {user.id} demoted to teacher."}
    else:
        user.is_active = False
        user.banned_by = current_user.id
        user.banned_at = datetime.utcnow()
        db.commit()
        return {"message": f"User {user.username} banned successfully."} 
