from datetime import datetime, timedelta, timezone

def calculate_next_watering(last_watered_date: datetime, water_frequency_days: int, weather_data: dict) -> dict:
    # 1. Start with the baseline rules
    days_to_add = water_frequency_days
    modifier_reason = "Normal weather conditions."

    # 2. Apply the Smart Algorithm if weather data is available
    if weather_data:
        temp = weather_data.get("temp", 25)
        humidity = weather_data.get("humidity", 50)
        condition = weather_data.get("condition", "Clear")

        if condition == "Rain" or humidity > 80:
            days_to_add += 1
            modifier_reason = f"Delayed by 1 day due to {condition.lower()}/high humidity."
        elif temp > 35:
            days_to_add -= 1
            # Ensure we don't tell them to water more than once a day
            days_to_add = max(1, days_to_add)
            modifier_reason = f"Advanced by 1 day due to extreme heat ({temp}°C)."

    # 3. Calculate exact dates and status
    next_date = last_watered_date + timedelta(days=days_to_add)
    now = datetime.now(timezone.utc)
    
    # Calculate difference in whole days
    days_remaining = (next_date.date() - now.date()).days
    
    if days_remaining < 0:
        status = "Overdue"
    elif days_remaining == 0:
        status = "Due Today"
    else:
        status = f"In {days_remaining} days"

    return {
        "next_watering_date": next_date,
        "days_remaining": days_remaining,
        "status": status,
        "reason": modifier_reason
    }