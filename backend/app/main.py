from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from apscheduler.schedulers.background import BackgroundScheduler
import contextlib
from . import models, database
from .api import auth, garden, schedule, doctor, tips, deps
from .core.notifications import process_daily_alerts

models.Base.metadata.create_all(bind=database.engine)

scheduler = BackgroundScheduler()

def run_daily_job():
    db = database.SessionLocal()
    try:
        process_daily_alerts(db)
    finally:
        db.close()

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.add_job(run_daily_job, "cron", minute=0)
    scheduler.start()
    yield
    scheduler.shutdown()

app = FastAPI(
    title="Smart Home Gardening API",
    description="API for managing digital gardens and weather-based watering schedules",
    version="1.0.0",
    lifespan=lifespan
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
app.include_router(doctor.router)
app.include_router(tips.router)

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

@app.post("/api/test-email")
def test_email(db: Session = Depends(database.get_db), current_user: models.User = Depends(deps.get_current_user)):
    try:
        process_daily_alerts(db, force_user_id=current_user.id)
        return {"message": "Test email dispatched."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to dispatch test email: {str(e)}")