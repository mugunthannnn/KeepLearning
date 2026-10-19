from typing import List
from fastapi import APIRouter, HTTPException, Depends
from app.auth.security import get_current_user
from app.services.learning_service import LearningService

router = APIRouter(prefix="/subjects", tags=["Subjects"])

@router.get("", response_model=List[dict])
async def list_subjects(current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    return await LearningService.get_all_subjects_for_user(user_id)

@router.get("/{subject_id}")
async def get_subject_details(subject_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    subjects = await LearningService.get_all_subjects_for_user(user_id)
    subject = next((s for s in subjects if s["id"] == subject_id), None)
    
    if not subject:
        # Fallback search by category or lowercase
        subject = next((s for s in subjects if subject_id.lower() in s["id"].lower()), None)
    
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    all_topics = await LearningService.get_all_topics_for_user(user_id)
    subject_topics = [
        t for t in all_topics 
        if t.get("subjectId") == subject["id"] or subject["id"].lower() in t.get("subjectName", "").lower()
    ]

    return {
        "subject": subject,
        "topics": subject_topics
    }
