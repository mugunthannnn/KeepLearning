from typing import List
from fastapi import APIRouter, HTTPException, Depends
from app.auth.security import get_current_user
from app.database import get_collection
from app.models.schemas import QuizSubmitRequest, QuizSubmitResponse, QuizDetail
from app.seed_data import SEED_QUIZZES
from app.services.learning_service import LearningService

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

@router.get("/{topic_id}", response_model=QuizDetail)
async def get_quiz(topic_id: str, current_user: dict = Depends(get_current_user)):
    quizzes_col = get_collection("quizzes")
    quiz = await quizzes_col.find_one({"_id": topic_id}) or await quizzes_col.find_one({"topicId": topic_id})

    if not quiz and topic_id in SEED_QUIZZES:
        quiz = SEED_QUIZZES[topic_id]

    if not quiz:
        # Fallback to hashmap quiz
        quiz = SEED_QUIZZES.get("hashmap")

    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found for this topic")

    # Filter out correctAnswer and explanation so student cannot cheat from network inspect
    sanitized_questions = []
    for q in quiz.get("questions", []):
        sanitized_questions.append({
            "id": q["id"],
            "question": q["question"],
            "options": q["options"]
        })

    return {
        "topicId": quiz.get("topicId", topic_id),
        "topicName": quiz.get("topicName", "Assessment"),
        "subjectName": quiz.get("subjectName", "Technical"),
        "questions": sanitized_questions
    }

@router.post("/{topic_id}/submit", response_model=QuizSubmitResponse)
async def submit_quiz(topic_id: str, payload: QuizSubmitRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    result = await LearningService.submit_quiz(user_id, topic_id, payload.answers)
    return result

@router.get("/history/me", response_model=List[dict])
async def get_quiz_history(current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    attempts_col = get_collection("quiz_attempts")
    attempts = await attempts_col.find({"userId": user_id}).sort("timestamp", -1).to_list(50)
    for a in attempts:
        if "id" not in a:
            a["id"] = a.get("_id")
    return attempts
