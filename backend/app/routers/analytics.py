from fastapi import APIRouter, Depends
from app.auth.security import get_current_user
from app.services.learning_service import LearningService

router = APIRouter(tags=["Analytics & Dashboard"])

@router.get("/dashboard")
async def get_dashboard(current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    return await LearningService.get_dashboard(user_id)

@router.get("/analytics")
async def get_analytics(current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    dashboard_data = await LearningService.get_dashboard(user_id)
    return dashboard_data["analyticsData"]
