from typing import List
from fastapi import APIRouter, HTTPException, Depends
from app.auth.security import get_current_user
from app.models.schemas import AddRevisionTaskRequest, RescheduleTaskRequest
from app.services.learning_service import LearningService

router = APIRouter(prefix="/revision-plan", tags=["Revision Plan"])

@router.get("", response_model=List[dict])
async def get_revision_plan(current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    return await LearningService.get_user_revision_tasks(user_id)

@router.post("/add")
async def add_task(payload: AddRevisionTaskRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    task = await LearningService.add_revision_task(
        user_id=user_id,
        topic_id=payload.topicId,
        due_date_category=payload.dueDateCategory or "Today",
        reason=payload.reason or "Added by learner"
    )
    return {"message": "Task added to revision plan", "task": task}

@router.post("/{task_id}/complete")
async def complete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    success = await LearningService.complete_revision_task(user_id, task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found or unauthorized")
    return {"message": "Revision marked as completed and knowledge reinforced"}

@router.post("/{task_id}/reschedule")
async def reschedule_task(task_id: str, payload: RescheduleTaskRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    success = await LearningService.reschedule_task(user_id, task_id, payload.dueDateCategory)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found or unauthorized")
    return {"message": f"Task rescheduled to {payload.dueDateCategory}"}
