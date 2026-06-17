from fastapi import FastAPI
from app.database import Base, engine 
from app import models 
from routes import questions, results, admin, auth  

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(auth.router, prefix="/auth")
app.include_router(questions.router) 
app.include_router(results.router)
app.include_router(admin.router, prefix="/admin")