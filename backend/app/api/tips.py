import os
import json
from fastapi import APIRouter, Depends, HTTPException
from google import genai
from google.genai import types
import random
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from .deps import get_current_user
from ..database import get_db
from .. import models
from ..core.weather import get_weather

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = None
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)

GENERAL_GARDENING_TIPS = [
    "Check your soil's pH periodically to ensure your plants can absorb nutrients optimally.",
    "Water plants early in the morning to reduce evaporation and prevent fungal diseases.",
    "Prune dead or yellowing leaves to redirect the plant's energy to new growth.",
    "Avoid getting water on the leaves of plants prone to fungal infections, like tomatoes or zucchini.",
    "Mulch your garden beds to retain moisture, suppress weeds, and regulate soil temperature.",
    "Rotate your crops every season to prevent soil depletion and break pest cycles.",
    "Compost your kitchen scraps to add rich, organic matter back into your garden.",
    "Check the undersides of leaves regularly for early signs of pests like aphids or spider mites.",
    "Group plants with similar water and light needs together.",
    "Don't over-fertilize; too much nitrogen can lead to lush foliage but poor fruit or flower production.",
    "Use a moisture meter or the 'finger test' before watering.",
    "Keep your gardening tools clean and sharp to make clean cuts and prevent disease spread.",
    "Plant marigolds or other companion plants to naturally deter pests.",
    "Ensure your pots have drainage holes to prevent root rot in container gardens.",
    "Wipe the leaves of your indoor plants with a damp cloth to remove dust.",
    "Overwatering kills more indoor plants than underwatering. When in doubt, wait a day.",
    "Feed indoor plants only during their active growing season (spring and summer).",
    "Pinch back the tips of herbs like basil or mint to encourage bushier growth.",
    "Plant shade-tolerant vegetables (like lettuce or spinach) under taller crops.",
    "Water deeply and less frequently to encourage deep root growth.",
    "Use neem oil as an organic, multi-purpose pest and fungus control.",
    "Keep a garden journal to track what varieties perform best in your specific microclimate.",
    "Remove spent flowers (deadheading) to encourage plants to produce more blooms.",
    "Amaze friends by starting a new plant from a simple cutting placed in water.",
    "Acclimate indoor seedlings gradually to outdoor conditions before transplanting (hardening off).",
    "Attract pollinators by planting native wildflowers around the border of your vegetable garden.",
    "To test seed viability, place a few on a damp paper towel in a sealed bag and check for sprouting.",
    "A layer of newspaper under mulch can help smother stubborn perennial weeds.",
    "Place lighter-colored decorative stones around plants to reflect light to lower leaves.",
    "Use the water left over from boiling vegetables to water plants once cooled.",
    "Rotate houseplants slightly every time you water them for even growth on all sides.",
    "Adding a pinch of cinnamon to the soil can help prevent 'damping off' disease in seedlings.",
    "Water at the base of the plant to keep the foliage dry and fungus-free.",
    "When transplanting, gently tease the roots apart if they are tightly bound in the pot.",
    "Mist humidity-loving plants regularly, or place them on a pebble tray filled with water.",
    "Use crushed eggshells around the base of plants to deter slugs and snails.",
    "Start herbs in your kitchen window for fresh ingredients right at your fingertips.",
    "If your plant is stretching towards the light, it means it’s not getting enough of it.",
    "Save seeds from your best producing plants for next year.",
    "Ensure good air circulation around plants to combat mildew and mold.",
    "Watering in the late afternoon is the second best time, after early morning.",
    "Choose disease-resistant plant varieties if your area is prone to certain blights.",
    "Don't compact the soil around the roots too tightly when planting.",
    "Provide trellises or supports early, before the plants get too big.",
    "Weed your garden after a light rain when the soil is loose.",
    "Add coffee grounds to acid-loving plants like roses, hydrangeas, or blueberries.",
    "Keep a close eye on container plants on windy or hot days, as they dry out very fast.",
    "Thin out crowded seedlings to give the strongest ones room to grow.",
    "Avoid walking on garden soil, especially when wet, to prevent destroying its structure.",
    "Learn to identify beneficial insects like ladybugs, lacewings, and parasitic wasps."
]

router = APIRouter(
    prefix="/api/tips",
    tags=["Daily Tips"]
)

@router.get("/")
async def get_daily_tips(
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured.")

    try:
        # Get user's garden
        garden_plants = db.query(models.UserGarden).filter(models.UserGarden.user_id == current_user.id).all()
        
        if not garden_plants:
            return {
                "ai_tips": [
                    {
                        "category": "Getting Started",
                        "tip": "Start by adding some plants to your garden to receive personalized daily tips!",
                        "plant_focus": "General"
                    }
                ],
                "general_tips": [
                    {"category": "General Wisdom", "tip": tip, "plant_focus": "General"} 
                    for tip in random.sample(GENERAL_GARDENING_TIPS, 3)
                ]
            }

        garden_data = []
        locations = set()
        for gp in garden_plants:
            plant_info = gp.plant_info
            garden_data.append({
                "nickname": gp.nickname or plant_info.name,
                "species": plant_info.species,
                "sunlight_need": plant_info.sunlight_need,
                "water_frequency_days": plant_info.water_frequency_days,
                "location": gp.location or "Unknown"
            })
            if gp.location:
                locations.add(gp.location)
        
        # We MUST strictly use "Bengaluru" entirely bypassing user location column
        target_location = "Bengaluru"
        weather_data = None
        try:
            weather_data = get_weather(target_location)
        except Exception:
            weather_data = "Weather data unavailable"
            
        prompt = (f"I have a smart garden. The weather in my area ({target_location}) is currently: {weather_data}. "
                  f"My garden contains the following plants: {json.dumps(garden_data)}. "
                  "Please provide 3 personalized daily gardening tips based on this weather and my specific plants. "
                  "Return a JSON array of objects, where each object has 'category' (e.g. Watering, Sunlight, Pruning), "
                  "'tip' (the advice), and 'plant_focus' (which plant it applies to, or 'General').")

        if not client:
            raise HTTPException(status_code=500, detail="Gemini Client is not configured.")

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        
        ai_tips = json.loads(response.text)
        
        if not isinstance(ai_tips, list):
            ai_tips = [ai_tips]
            
        # Select 3-5 random general tips
        num_general_tips = random.randint(3, 5)
        selected_general = random.sample(GENERAL_GARDENING_TIPS, num_general_tips)
        general_tips_formatted = [
            {"category": "General Wisdom", "tip": tip, "plant_focus": "General"} 
            for tip in selected_general
        ]
            
        return {
            "ai_tips": ai_tips,
            "general_tips": general_tips_formatted
        }
        
    except Exception as e:
        print(f"Failed to generate tips: {e}")
        # Fallback response
        return {
            "ai_tips": [
                {
                    "category": "General",
                    "tip": "Water your plants regularly according to their schedule.",
                    "plant_focus": "General"
                }
            ],
            "general_tips": [
                {"category": "General Wisdom", "tip": tip, "plant_focus": "General"} 
                for tip in random.sample(GENERAL_GARDENING_TIPS, 3)
            ]
        }
