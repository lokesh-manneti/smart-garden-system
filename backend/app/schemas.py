from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

# --- Incoming Request Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --- Outgoing Response Schemas ---
class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# --- Plant & Garden Schemas ---
class PlantCatalogResponse(BaseModel):
    id: int
    name: str
    species: str
    water_frequency_days: int
    sunlight_need: str

    class Config:
        from_attributes = True

class GardenAdd(BaseModel):
    plant_id: int
    nickname: str | None = None
    location: str | None = None
    notes: str | None = None
    planted_date: datetime | None = None

class GardenResponse(BaseModel):
    id: UUID
    plant_id: int
    nickname: str | None
    location: str | None
    notes: str | None
    planted_date: datetime
    last_watered_date: datetime
    plant_info: PlantCatalogResponse 

    class Config:
        from_attributes = True