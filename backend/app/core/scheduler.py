from datetime import datetime, timedelta, timezone

def calculate_next_watering(last_watered_date: datetime, water_frequency_days: int, weather_data: dict) -> dict:
    # 1. Start with the baseline watering frequency
    days_to_add = water_frequency_days
    modifier_reason = "Normal weather conditions."

    # 2. Apply multi-factor weather intelligence
    if weather_data and isinstance(weather_data, dict):
        temp = weather_data.get("temp", 25)
        humidity = weather_data.get("humidity", 50)
        condition = str(weather_data.get("condition", "Clear")).lower()

        # Rain or high humidity → delay watering
        if "rain" in condition or "drizzle" in condition or humidity > 80:
            days_to_add += 1
            modifier_reason = f"Delayed +1 day: {'rain' if 'rain' in condition else 'high humidity'} detected ({humidity}% humidity)."

        # Thunderstorm or heavy rain → delay more
        elif "storm" in condition or "thunder" in condition:
            days_to_add += 2
            modifier_reason = f"Delayed +2 days: heavy storm activity detected."

        # Extreme heat → accelerate watering
        elif temp > 38:
            days_to_add = max(1, days_to_add - 2)
            modifier_reason = f"Advanced by 2 days: extreme heat ({temp}°C). Increase misting."

        elif temp > 35:
            days_to_add = max(1, days_to_add - 1)
            modifier_reason = f"Advanced by 1 day: high heat ({temp}°C)."

        # Dry + windy conditions → slight acceleration
        elif humidity < 30 and temp > 28:
            days_to_add = max(1, days_to_add - 1)
            modifier_reason = f"Advanced by 1 day: dry conditions ({humidity}% humidity, {temp}°C)."

        # Cool + overcast → slight delay
        elif temp < 18 and "cloud" in condition:
            days_to_add += 1
            modifier_reason = f"Delayed +1 day: cool overcast conditions ({temp}°C)."

    # 3. Calculate exact dates and status
    next_date = last_watered_date + timedelta(days=days_to_add)
    now = datetime.now(timezone.utc)
    
    # Calculate difference in whole days
    days_remaining = (next_date.date() - now.date()).days
    
    if days_remaining < -1:
        status = f"Overdue by {abs(days_remaining)} days"
    elif days_remaining < 0:
        status = "Overdue"
    elif days_remaining == 0:
        status = "Due Today"
    elif days_remaining == 1:
        status = "Tomorrow"
    else:
        status = f"In {days_remaining} days"

    return {
        "next_watering_date": next_date,
        "days_remaining": days_remaining,
        "status": status,
        "reason": modifier_reason
    }