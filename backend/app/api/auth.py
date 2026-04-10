from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from .. import models, schemas, database
from ..core import security
from . import deps

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # 1. Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )

    # 2. Hash the password
    hashed_pwd = security.hash_password(user.password)

    # 3. Save to database
    new_user = models.User(
        email=user.email,
        password_hash=hashed_pwd,
        first_name=user.first_name,
        last_name=user.last_name,
        marketing_consent=user.marketing_consent
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post("/login", response_model=schemas.Token)
def login_user(
    # We change this to expect Form Data instead of JSON
    user_credentials: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(database.get_db)
):
    # OAuth2 specifies a 'username' field, so we map our email to it
    user = db.query(models.User).filter(models.User.email == user_credentials.username).first()
    
    if not user or not security.verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate JWT Token
    access_token = security.create_access_token(data={"user_id": str(user.id)})

    return {"access_token": access_token, "token_type": "bearer"}

@router.put("/settings", response_model=schemas.UserResponse)
def update_settings(
    settings: schemas.UserUpdate, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(deps.get_current_user)
):
    if settings.first_name is not None:
        current_user.first_name = settings.first_name
    if settings.last_name is not None:
        current_user.last_name = settings.last_name
    if settings.marketing_consent is not None:
        current_user.marketing_consent = settings.marketing_consent
    if settings.notification_time is not None:
        current_user.notification_time = settings.notification_time
    if settings.city is not None:
        current_user.city = settings.city

    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(deps.get_current_user)):
    return current_user