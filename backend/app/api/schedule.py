import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, database
from .deps import get_current_user
from ..core import weather, scheduler

router = APIRouter(
    prefix="/api/schedule",
    tags=["Smart Schedule"]
)

@router.get("/")
def get_smart_schedule(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    # 1. Fetch user's garden
    garden_plants = db.query(models.UserGarden).filter(models.UserGarden.user_id == current_user.id).all()
    
    # 2. Fetch current weather (Uses environment default)
    city = os.getenv("DEFAULT_CITY", "Bengaluru")
    current_weather = weather.get_weather(city)
    
    # 3. Process each plant through the algorithm
    schedule_list = []
    for entry in garden_plants:
        schedule_info = scheduler.calculate_next_watering(
            last_watered_date=entry.last_watered_date,
            water_frequency_days=entry.plant_info.water_frequency_days,
            weather_data=current_weather
        )
        
        schedule_list.append({
            "garden_id": entry.id,
            "nickname": entry.nickname,
            "plant_name": entry.plant_info.name,
            "location": entry.location,
            "schedule": schedule_info
        })
        
    return {
        "location": city,
        "weather": current_weather,
        "tasks": schedule_list
    }