import os
import json
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form

from google import genai
from google.genai import types
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from supabase import create_client, Client

from .deps import get_current_user
from ..database import get_db
from .. import schemas, models

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def get_supabase() -> Client | None:
    if SUPABASE_URL and SUPABASE_KEY:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    return None

client = None
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)

router = APIRouter(
    prefix="/api/doctor",
    tags=["Plant Doctor"]
)

@router.post("/diagnose", response_model=schemas.DiagnosisResponse)
async def diagnose_plant(
    symptoms: str = Form(...),
    plant_name: str = Form(None),
    image: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured.")

    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        image_bytes = await image.read()
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Uploaded image file was empty.")
        
        # Build context-aware prompt with rich diagnostic structure
        plant_context = f" The plant species is {plant_name}." if plant_name else ""
        prompt = (
            "You are a senior plant pathologist with 20 years of clinical experience. "
            f"A user has submitted a photo of their plant for diagnosis.{plant_context} "
            f"Observed symptoms: \"{symptoms}\". "
            "Carefully analyze the image alongside the described symptoms. "
            "Provide a thorough, professional diagnosis. "
            "Respond as a JSON object with EXACTLY these keys: "
            "'diagnosis' (string: a clear, specific identification of the condition — e.g. 'Powdery Mildew' not just 'fungal infection'), "
            "'treatment' (string: 3-5 numbered actionable steps the user should take immediately, written conversationally), "
            "'confidence' (float between 0.0 and 1.0: your diagnostic confidence based on image clarity and symptom match)."
        )
        
        if not client:
            raise HTTPException(status_code=500, detail="Gemini Client is not configured.")

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type=image.content_type),
                prompt
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        
        # Parse the JSON response
        result = json.loads(response.text)
        
        diagnosis_text = result.get("diagnosis", "Unknown issue")
        treatment_text = result.get("treatment", "No treatment found")
        confidence_val = float(result.get("confidence", 0.0))

        # --- Non-fatal: Upload image to storage & save history ---
        image_url = None
        try:
            supabase = get_supabase()
            if supabase and image.filename:
                file_ext = image.filename.split(".")[-1]
                file_name = f"diag_{current_user.id}_{uuid.uuid4()}.{file_ext}"
                supabase.storage.from_("plant-images").upload(
                    file_name,
                    image_bytes,
                    {"content-type": image.content_type}
                )
                image_url = supabase.storage.from_("plant-images").get_public_url(file_name)
                print(f"DOCTOR UPLOAD SUCCESS: {file_name}")
        except Exception as upload_err:
            print(f"DOCTOR UPLOAD ERROR: {type(upload_err).__name__}: {upload_err}")

        try:
            history_entry = models.DiagnosticHistory(
                user_id=current_user.id,
                plant_name=plant_name,
                symptoms=symptoms,
                image_url=image_url,
                diagnosis=diagnosis_text,
                treatment=treatment_text,
                confidence=str(confidence_val)
            )
            db.add(history_entry)
            db.commit()
            print(f"DOCTOR HISTORY SAVED for user {current_user.id}")
        except Exception as db_err:
            db.rollback()
            print(f"DOCTOR DB ERROR: {type(db_err).__name__}: {db_err}")

        return schemas.DiagnosisResponse(
            diagnosis=diagnosis_text,
            treatment=treatment_text,
            confidence=confidence_val
        )

    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e).upper()
        if "503" in error_msg or "UNAVAILABLE" in error_msg:
            raise HTTPException(status_code=503, detail="The AI Doctor is currently experiencing high traffic. Please try again in a few minutes.")
        print(f"DOCTOR FATAL ERROR: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Diagnosis failed: {str(e)}")

@router.get("/history", response_model=List[schemas.DiagnosticHistoryResponse])
def get_diagnostic_history(
    current_user = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    history = db.query(models.DiagnosticHistory).filter(
        models.DiagnosticHistory.user_id == current_user.id
    ).order_by(models.DiagnosticHistory.created_at.desc()).all()
    
    return history
