from app.schemas import RegisterRequest, UserOut  
from app.database import SessionLocal
from app.models import User
from fastapi import HTTPException, Depends, APIRouter 
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import or_ 
from app.utils.security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(tags=["Authorization"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register_endpoint(data: RegisterRequest, db: SessionLocal = Depends(get_db)):

    try:
        existing_user = db.query(User).filter(User.email == data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_password = hash_password(data.password)

        new_user = User(
            username=data.username,
            email=data.email,
            password=hashed_password,
            role=data.role,
            is_active=True,
            promoted_by=None,
            promoted_at=None
        )

        db.add(new_user)
        db.commit()

        return {"message": "User registered successfully"}

    finally:        
        db.close()

@router.post("/login")
def login_endpoint(form_data: OAuth2PasswordRequestForm = Depends(), db: SessionLocal = Depends(get_db)):
    
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated.")

    token = create_access_token({"sub": user.email, "role": user.role, "user_id": user.id})

    return {
            "access_token": token,
            "token_type": "bearer"
        }    

@router.get("/me", response_model = UserOut)
def get_me(current_user = Depends(get_current_user)):
    return current_user