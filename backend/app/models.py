from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, timezone
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship to the garden
    garden_plants = relationship("UserGarden", back_populates="owner", cascade="all, delete-orphan")

class PlantCatalog(Base):
    __tablename__ = "plant_catalog"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    species = Column(String, nullable=False)
    water_frequency_days = Column(Integer, nullable=False)
    sunlight_need = Column(String, nullable=False)

class UserGarden(Base):
    __tablename__ = "user_garden"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    plant_id = Column(Integer, ForeignKey("plant_catalog.id"), nullable=False)
    nickname = Column(String, nullable=True)
    
    # --- NEW COLUMNS ---
    location = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    planted_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    # -------------------

    last_watered_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="garden_plants")
    plant_info = relationship("PlantCatalog")