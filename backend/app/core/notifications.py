import os
import resend
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import random

from .. import models
from .weather import get_weather
from ..api.tips import GENERAL_GARDENING_TIPS
from ..core.scheduler import calculate_next_watering

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY

def process_daily_alerts(db: Session, force_user_id=None):
    print("Running Daily Garden Digest Job...")
    if not RESEND_API_KEY:
        print("RESEND_API_KEY not set. Digest job returning early.")
        return

    current_hour = datetime.now().hour
    
    try:
        if force_user_id:
            users = db.query(models.User).filter(models.User.id == force_user_id).all()
        else:
            users = db.query(models.User).filter(models.User.marketing_consent == True).all()
        
        weather_data = get_weather("Bengaluru") # Hardcoded default for safety
        current_weather = weather_data.get("description", "Sunny") if weather_data else "Sunny"
        temp = weather_data.get("temp", 25) if weather_data else 25
        
        daily_tip = random.choice(GENERAL_GARDENING_TIPS)

        for user in users:
            if not force_user_id:
                if not user.notification_time or user.notification_time.hour != current_hour:
                    continue
            
            plants_to_water = []
            for plant in user.garden_plants:
                if plant.mute_notifications:
                    continue
                
                # calculate watering
                schedule = calculate_next_watering(plant.last_watered_date, plant.plant_info.water_frequency_days, weather_data)
                if schedule["days_remaining"] <= 0:
                    plants_to_water.append(plant)
            
            # Build email HTML
            first_name = user.first_name or "Gardener"
            plants_html = ""
            if plants_to_water:
                plants_html = "<h3>Plants that need water today:</h3><ul style='padding-left: 20px;'>"
                for p in plants_to_water:
                    name = p.nickname or p.plant_info.name
                    plants_html += f"<li><strong>{name}</strong></li>"
                plants_html += "</ul>"
            else:
                plants_html = "<p>All your plants are perfectly hydrated! Great job.</p>"

            tip_html = f"<h3>Today's Gardening Tip 💡</h3><p><em>{daily_tip}</em></p>"
            
            weather_html = f"<h3>Current Weather 🌤️</h3><p>{temp}°C and {current_weather} in Bengaluru</p>"

            html_content = f"""
            <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; background-color: #f0fdf4; padding: 20px; border-radius: 12px; border: 1px solid #bbf7d0;">
                <h1 style="color: #16a34a; text-align: center;">Daily Garden Digest</h1>
                <p>Good morning, <b>{first_name}</b>!</p>
                <hr style="border: none; border-top: 1px solid #bbf7d0; margin: 20px 0;" />
                {weather_html}
                <hr style="border: none; border-top: 1px solid #bbf7d0; margin: 20px 0;" />
                {plants_html}
                <hr style="border: none; border-top: 1px solid #bbf7d0; margin: 20px 0;" />
                {tip_html}
                <p style="font-size: 12px; color: #166534; text-align: center; margin-top: 30px;">
                    Log in to your Smart Garden System to manage your notifications or update your plant details.
                </p>
            </div>
            """

            try:
                resend.Emails.send({
                    "from": "onboarding@resend.dev",
                    "to": user.email,
                    "subject": "🌿 Your Daily Garden Digest",
                    "html": html_content
                })
                print(f"Sent digest to {user.email}")
            except Exception as e:
                print(f"Failed to send digest to {user.email}: {e}")
                
    except Exception as general_error:
        print(f"Error in process_daily_alerts: {general_error}")
