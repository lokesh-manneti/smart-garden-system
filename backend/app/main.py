from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from . import models, database
from .api import auth, garden, schedule

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Smart Home Gardening API",
    description="API for managing digital gardens and weather-based watering schedules",
    version="1.0.0"
)

# Configure CORS so our React frontend can communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routers
app.include_router(auth.router)
app.include_router(garden.router)
app.include_router(schedule.router)

@app.get("/")
def root():
    return {"message": "Smart Gardening API is running!"}

@app.get("/api/health/db")
def test_db_connection(db: Session = Depends(database.get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "success", "message": "Successfully connected to Supabase PostgreSQL!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")