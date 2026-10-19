from typing import List
from fastapi import APIRouter, HTTPException, Depends
from app.auth.security import get_current_user
from app.services.learning_service import LearningService

router = APIRouter(prefix="/topics", tags=["Topics"])

@router.get("", response_model=List[dict])
async def list_topics(current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    return await LearningService.get_all_topics_for_user(user_id)

@router.get("/{topic_id}")
async def get_topic_details(topic_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    topics = await LearningService.get_all_topics_for_user(user_id)
    topic = next((t for t in topics if t["id"] == topic_id), None)
    
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    return topic

@router.get("/{topic_id}/forecast")
async def get_topic_forecast(topic_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    topics = await LearningService.get_all_topics_for_user(user_id)
    topic = next((t for t in topics if t["id"] == topic_id), None)
    
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    return {
        "topicId": topic["id"],
        "topicName": topic["name"],
        "forecastData": topic.get("forecastData", [])
    }
