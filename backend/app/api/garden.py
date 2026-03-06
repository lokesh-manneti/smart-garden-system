from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from .deps import get_current_user

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
def add_to_garden(item: schemas.GardenAdd, db: Session = Depends(database.get_db), current_user: models.User = Depends(get_current_user)):
    # Verify the plant exists in the catalog
    plant = db.query(models.PlantCatalog).filter(models.PlantCatalog.id == item.plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found in catalog")

    new_garden_entry = models.UserGarden(
        user_id=current_user.id,
        plant_id=item.plant_id,
        nickname=item.nickname
    )
    db.add(new_garden_entry)
    db.commit()
    db.refresh(new_garden_entry)
    return new_garden_entry

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