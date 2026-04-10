from pydantic import BaseModel, EmailStr, field_validator
from uuid import UUID
from datetime import datetime, time
import re

# --- Incoming Request Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    marketing_consent: bool = True

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r'\d', v):
            raise ValueError("Password must contain at least one number")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError("Password must contain at least one special character")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    notification_time: time | None = None
    marketing_consent: bool | None = None
    city: str | None = None

# --- Outgoing Response Schemas ---
class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    first_name: str | None
    last_name: str | None
    marketing_consent: bool
    notification_time: time | None
    city: str | None
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
    default_image_url: str | None = None

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
    image_url: str | None
    mute_notifications: bool
    plant_info: PlantCatalogResponse 

    class Config:
        from_attributes = True

class DiagnosisResponse(BaseModel):
    diagnosis: str
    treatment: str
    confidence: float

class DiagnosticHistoryResponse(BaseModel):
    id: UUID
    plant_name: str | None
    symptoms: str | None
    image_url: str | None
    diagnosis: str
    treatment: str
    confidence: str
    created_at: datetime

    class Config:
        from_attributes = True