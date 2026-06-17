from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session 
import random 
from sqlalchemy.sql.expression import func 
from app.database import get_db
from app import models, schemas
from app.utils.security import get_current_user
from features.pdf_parser import (extract_text_from_pdf, extract_questions) 

router = APIRouter(tags=["Questions"])

#Uploading_questions_via_PDF
@router.post("/teachers/upload_pdf")
def upload_pdf_questions(file: UploadFile = File(), db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can upload questions.")
    temp_file = "temp.pdf"
    with open(temp_file, "wb") as buffer:
        buffer.write(file.file.read())
    text =  extract_text_from_pdf(temp_file)
    questions = extract_questions(text)
    if not questions:
        raise HTTPException(status_code=400, detail="No valid questions found in the PDF.")
    for q in questions:
        new_q = models.Question(**q, teacher_id=current_user.id, status="pending")
        db.add(new_q)
    db.commit()
    return {"message": f"{len(questions)} questions uploaded successfully", "status": "pending"}

#Adaptaive_Test_Generation
PROMOTE_E_TO_M_THRESHOLD = 70
PROMOTE_M_TO_D_THRESHOLD = 80

DEMOTE_M_TO_E_THRESHOLD = 50
DEMOTE_D_TO_M_THRESHOLD = 50

def determine_difficulty(user_id, subject, db):
    recent_attempts = db.query(models.TestAttempt).filter(models.TestAttempt.user_id == user_id, models.TestAttempt.subject == subject).order_by(models.TestAttempt.timestamp.desc()).limit(5).all()
    if len(recent_attempts) < 5:
        return "E"
    avg_percentage = sum(test.percentage for test in recent_attempts) / len(recent_attempts)
    current_band = recent_attempts[0].difficulty_level
    
    #Current Easy 
    if current_band == "E":
        if avg_percentage >= PROMOTE_E_TO_M_THRESHOLD:
            return "M"
        return "E"
    
    #Current Moderate
    if current_band == "M":
        if avg_percentage >= PROMOTE_M_TO_D_THRESHOLD:
            return "D"
        elif avg_percentage < DEMOTE_M_TO_E_THRESHOLD:
            return "E"
        return "M"
    
    #Current Difficult
    if current_band == "D":
        if avg_percentage < DEMOTE_D_TO_M_THRESHOLD:
            return "M"
        return "D"

@router.get("/students/generate_test/{subject}", response_model=list[schemas.QuestionOut])
def generate_test(subject: str, limit: int = 10, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    subject = subject.lower()
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can take tests.")
    difficulty = determine_difficulty(current_user.id, subject, db)
    
    questions = (db.query(models.Question).filter(models.Question.subject == subject, models.Question.status == "verified", models.Question.difficulty_level == difficulty).order_by(func.random()).limit(limit).all())
    if len(questions) < limit:
        raise HTTPException(status_code=400, detail=f"Not enough questions available for subject '{subject}' at difficulty '{difficulty}'.")
    return questions 

#Submitting_answers_and_calculating_score
@router.post("/students/submit_test",response_model=schemas.SubmitTestResponse)
def submit_test(submission: schemas.TestSubmission,db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can submit tests.")
    score = 0
    subject = None
    wrong_answers = []

    for ans in submission.answers:
        q = db.query(models.Question).filter(models.Question.id == ans.question_id).first()
        if not q:
            continue
        if not subject:
            subject = q.subject
        if q and q.correct_option == ans.selected_option:
            score += 1
        else:
            wrong_answers.append({"question": q.question, "selected_option": ans.selected_option, "correct_option": q.correct_option, "explanation": q.explanation})

    total_questions = submission.total_questions
    percentage = (score / total_questions) * 100 
    diff = determine_difficulty(current_user.id, subject, db)
    attempt = models.TestAttempt(user_id=current_user.id, subject=subject, score=score, total_questions=total_questions, percentage=percentage, difficulty_level=diff)
    db.add(attempt)
    db.commit()

    return {"score": score, "total_questions": total_questions, "percentage": percentage, "wrong_answers": wrong_answers} 