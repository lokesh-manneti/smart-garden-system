import os
import requests
from cachetools import TTLCache, cached
from dotenv import load_dotenv

load_dotenv()

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

# Cache configuration: Store up to 100 cities, keep data for 10800 seconds (3 hours)
weather_cache = TTLCache(maxsize=100, ttl=10800)

@cached(cache=weather_cache)
def get_weather(city: str):
    if not WEATHER_API_KEY:
        print("WARNING: No Weather API Key found in .env")
        return None
        
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
    
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        
        return {
            "temp": round(data["main"]["temp"]),
            "humidity": data["main"]["humidity"],
            "condition": data["weather"][0]["main"] # e.g., 'Rain', 'Clear', 'Clouds'
        }
    except Exception as e:
        print(f"Weather API Error for {city}: {e}")
        return None