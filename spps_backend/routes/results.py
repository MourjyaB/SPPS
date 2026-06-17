from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.models import TestAttempt 
from ml.predict import predict_student_performance
from app.utils.security import get_current_user

router = APIRouter(tags=["Results"])

def map_difficulty(difficulty:str)->int:
    difficulty_map = {'E': 0, 'M': 1, 'D': 2}
    return difficulty_map[difficulty]

@router.get("/students/overall_results")
def get_overall_results(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can access these results.")
    recent_tests = (db.query(TestAttempt).filter(TestAttempt.user_id == current_user.id).order_by(TestAttempt.timestamp.desc()).limit(5).all())
    if  len(recent_tests) == 0:
        raise HTTPException(status_code=404, detail="No test attempts found for the user.")
    scores = [test.percentage for test in reversed(recent_tests)]
    while len(scores) < 5:
        scores.insert(0, scores[0])
    latest_difficulty = recent_tests[0].difficulty_level
    difficulty = map_difficulty(latest_difficulty)
    average_score = round(sum(scores) / len(scores), 2)
    predicted_score = predict_student_performance(scores[0], scores[1], scores[2], scores[3], scores[4], difficulty)
    return {"student_id": current_user.id, "recent_scores": scores, "average_score": average_score, "current_difficulty": latest_difficulty, "predicted_next_score": predicted_score}

@router.get("/students/subject-wise_results/{subject}")
def get_subject_results(subject_name: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    subject_name = subject_name.lower()
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can access these results.")
    recent_tests = (db.query(TestAttempt).filter(TestAttempt.user_id == current_user.id, TestAttempt.subject == subject_name).order_by(TestAttempt.timestamp.desc()).limit(5).all())
    if  len(recent_tests) == 0:
        raise HTTPException(status_code=404, detail=f"No test attempts found for the user in {subject_name}.")
    scores = [test.percentage for test in reversed(recent_tests)]
    while len(scores) < 5:
        scores.insert(0, scores[0])
    latest_difficulty = recent_tests[0].difficulty_level
    difficulty = map_difficulty(latest_difficulty)
    average_score = round(sum(scores) / len(scores), 2)
    predicted_score = predict_student_performance(scores[0], scores[1], scores[2], scores[3], scores[4], difficulty)
    return {"student_id": current_user.id, "subject": subject_name, "recent_scores": scores, "average_score": average_score, "current_difficulty": latest_difficulty, "predicted_next_score": predicted_score}

@router.get("/teachers/find_student/{username/email/id}")
def find_student(username: str = None, email: str = None, user_id: int = None, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can use this.")
    if not username and not email and not user_id:
        raise HTTPException(status_code=400, detail="Provide username or email or user id.")
    query = db.query(models.User).filter(models.User.role == "student")
    if username:
        query = query.filter(models.User.username == username)
    if email:
        query = query.filter(models.User.email == email)
    if user_id:
        query = query.filter(models.User.id == user_id)
    users = query.all()
    if not users:
        raise HTTPException(status_code=404, detail="No student was found.")
    return [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
                "is_active": user.is_active,
                "created_at": user.created_at
            }
        for user in users
    ]  

@router.get("/teachers/student_report/{student_id}")
def get_student_report(student_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can access student reports.")
    student = db.query(models.User).filter(models.User.id == student_id, models.User.role == "student").first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    recent_tests = (db.query(TestAttempt).filter(TestAttempt.user_id == student_id).order_by(TestAttempt.timestamp.desc()).limit(5).all())
    if  len(recent_tests) == 0:
        raise HTTPException(status_code=404, detail="No test attempts found for the student.")
    scores = [test.percentage for test in reversed(recent_tests)]
    while len(scores) < 5:
        scores.insert(0, scores[0])
    latest_difficulty = map_difficulty(recent_tests[0].difficulty_level) 
    overall_average = round(sum(scores) / len(scores), 2)
    overall_prediction = predict_student_performance(scores[0], scores[1], scores[2], scores[3], scores[4], latest_difficulty)
    subjects = db.query(TestAttempt.subject).filter(TestAttempt.user_id == student_id).distinct().all()
    subject_reports = []
    for subject_row in subjects:
        subject_name = subject_row[0]
        subject_tests = (db.query(TestAttempt).filter(TestAttempt.user_id == student_id, TestAttempt.subject ==  subject_name).order_by(TestAttempt.timestamp.desc()).limit(5).all())
        if len (subject_tests) == 0:
            continue
        subject_scores = [test.percentage for test in reversed(subject_tests)]
        while len(subject_scores) < 5:
            subject_scores.insert(0, subject_scores[0])
        difficulty = map_difficulty(subject_tests[0].difficulty_level)
        prediction = predict_student_performance(subject_scores[0], subject_scores[1], subject_scores[2], subject_scores[3], subject_scores[4], difficulty)
        average = round (sum(subject_scores)/len(subject_scores), 2)
        subject_reports.append({"subject": subject_name, "average": average, "prediction": prediction, "recent_scores": subject_scores})        
    return {"student_id": student_id, "overall": {"average": overall_average, "prediction": overall_prediction, "recent_scores": scores}, "subjects": subject_reports}
