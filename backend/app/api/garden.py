import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from supabase import create_client, Client
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone

from .. import models, schemas, database
from .deps import get_current_user

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def get_supabase() -> Client | None:
    if SUPABASE_URL and SUPABASE_KEY:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    return None

router = APIRouter(
    prefix="/api/garden",
    tags=["Digital Garden"]
)

# 1. Get all 50 plants from the catalog (Public Route)
@router.get("/catalog", response_model=List[schemas.PlantCatalogResponse])
def get_plant_catalog(db: Session = Depends(database.get_db)):
    plants = db.query(models.PlantCatalog).all()
    return plants

# 2. Get the logged-in user's garden (Protected Route)
@router.get("/", response_model=List[schemas.GardenResponse])
def get_my_garden(db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    garden_plants = db.query(models.UserGarden).filter(models.UserGarden.user_id == current_user.id).all()
    return garden_plants

# 3. Add a plant to the garden (Protected Route)
@router.post("/add", response_model=schemas.GardenResponse, status_code=status.HTTP_201_CREATED)
async def add_to_garden(
    plant_id: int = Form(...),
    nickname: str = Form(None),
    location: str = Form(None),
    notes: str = Form(None),
    planted_date: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(get_current_user)
):
    plant = db.query(models.PlantCatalog).filter(models.PlantCatalog.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found in catalog")

    # --- Step 1: Attempt image upload (non-fatal) ---
    image_url = None
    if image and image.filename:
        try:
            file_bytes = await image.read()
            if not file_bytes:
                print("UPLOAD WARNING: Image file was empty, skipping upload.")
            else:
                supabase = get_supabase()
                if supabase:
                    file_ext = image.filename.split(".")[-1]
                    file_name = f"{current_user.id}_{uuid.uuid4()}.{file_ext}"
                    file_options = {"content-type": image.content_type or "image/jpeg"}
                    
                    supabase.storage.from_("plant-images").upload(
                        file_name, 
                        file_bytes, 
                        file_options
                    )
                    image_url = supabase.storage.from_("plant-images").get_public_url(file_name)
                    print(f"UPLOAD SUCCESS: {file_name} -> {image_url}")
                else:
                    print("UPLOAD WARNING: Supabase client not configured, skipping image upload.")
        except Exception as e:
            # Log the exact error but don't crash — the plant should still be saved
            print(f"UPLOAD ERROR: {type(e).__name__}: {str(e)}")
            image_url = None  # Proceed without image

    # --- Step 2: Parse optional planted_date ---
    parsed_date = None
    if planted_date:
        try:
            parsed_date = datetime.fromisoformat(planted_date.replace('Z', '+00:00'))
        except ValueError:
            print(f"DATE WARNING: Could not parse planted_date '{planted_date}', using default.")

    # --- Step 3: Save to database ---
    try:
        new_garden_entry = models.UserGarden(
            user_id=current_user.id,
            plant_id=plant_id,
            nickname=nickname,
            location=location,
            notes=notes,
            image_url=image_url,
        )
        if parsed_date:
            new_garden_entry.planted_date = parsed_date

        db.add(new_garden_entry)
        db.commit()
        db.refresh(new_garden_entry)
        return new_garden_entry
    except Exception as e:
        db.rollback()
        print(f"DATABASE ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save plant: {str(e)}")

# 4. Remove a plant from the garden (Protected Route)
@router.delete("/{garden_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_garden(garden_id: str, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    garden_entry = db.query(models.UserGarden).filter(
        models.UserGarden.id == garden_id, 
        models.UserGarden.user_id == current_user.id
    ).first()
    
    if not garden_entry:
        raise HTTPException(status_code=404, detail="Plant not found in your garden")
        
    db.delete(garden_entry)
    db.commit()
    return None

# 5. Edit a plant in the garden (Protected Route)
@router.put("/{garden_id}", response_model=schemas.GardenResponse)
async def edit_garden_plant(
    garden_id: str,
    nickname: str = Form(None),
    location: str = Form(None),
    notes: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    garden_entry = db.query(models.UserGarden).filter(
        models.UserGarden.id == garden_id,
        models.UserGarden.user_id == current_user.id
    ).first()

    if not garden_entry:
        raise HTTPException(status_code=404, detail="Plant not found in your garden")

    # Update text fields (only if provided)
    if nickname is not None:
        garden_entry.nickname = nickname
    if location is not None:
        garden_entry.location = location
    if notes is not None:
        garden_entry.notes = notes

    # Handle optional new image upload
    if image and image.filename:
        try:
            file_bytes = await image.read()
            if file_bytes:
                supabase = get_supabase()
                if supabase:
                    file_ext = image.filename.split(".")[-1]
                    file_name = f"{current_user.id}_{uuid.uuid4()}.{file_ext}"
                    file_options = {"content-type": image.content_type or "image/jpeg"}
                    supabase.storage.from_("plant-images").upload(
                        file_name, file_bytes, file_options
                    )
                    garden_entry.image_url = supabase.storage.from_("plant-images").get_public_url(file_name)
                    print(f"EDIT UPLOAD SUCCESS: {file_name}")
        except Exception as e:
            print(f"EDIT UPLOAD ERROR: {type(e).__name__}: {str(e)}")

    try:
        db.commit()
        db.refresh(garden_entry)
        return garden_entry
    except Exception as e:
        db.rollback()
        print(f"EDIT DB ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update plant: {str(e)}")

# 6. Water a plant (Update last_watered_date)
@router.put("/{garden_id}/water", response_model=schemas.GardenResponse)
def water_plant(garden_id: str, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    garden_entry = db.query(models.UserGarden).filter(
        models.UserGarden.id == garden_id, 
        models.UserGarden.user_id == current_user.id
    ).first()
    
    if not garden_entry:
        raise HTTPException(status_code=404, detail="Plant not found in your garden")
        
    garden_entry.last_watered_date = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(garden_entry)
    return garden_entry

# 7. Toggle mute notifications for a plant
@router.put("/{garden_id}/mute", response_model=schemas.GardenResponse)
def toggle_mute_notifications(garden_id: str, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    garden_entry = db.query(models.UserGarden).filter(
        models.UserGarden.id == garden_id, 
        models.UserGarden.user_id == current_user.id
    ).first()
    
    if not garden_entry:
        raise HTTPException(status_code=404, detail="Plant not found in your garden")
        
    garden_entry.mute_notifications = not garden_entry.mute_notifications
    
    db.commit()
    db.refresh(garden_entry)
    return garden_entry