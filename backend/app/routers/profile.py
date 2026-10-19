from fastapi import APIRouter, Depends, HTTPException
from app.auth.security import get_current_user
from app.database import get_collection
from app.models.schemas import UserProfile, UserProfileUpdate, OnboardingRequest

router = APIRouter(prefix="/profile", tags=["Profile & Settings"])

@router.get("", response_model=UserProfile)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return UserProfile(
        id=current_user["_id"],
        name=current_user.get("name", "Student"),
        email=current_user.get("email", ""),
        role=current_user.get("role", "Student"),
        knowledgeScore=current_user.get("knowledgeScore", 70),
        retentionRate=current_user.get("retentionRate", 75),
        topicsAtRiskCount=current_user.get("topicsAtRiskCount", 0),
        learningStreak=current_user.get("learningStreak", 1),
        onboarded=current_user.get("onboarded", False),
        preferences=current_user.get("preferences", {}),
        createdAt=current_user.get("createdAt")
    )

@router.put("", response_model=UserProfile)
async def update_profile(payload: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    users_col = get_collection("users")

    update_fields = {}
    if payload.name is not None:
        update_fields["name"] = payload.name.strip()
    if payload.role is not None:
        update_fields["role"] = payload.role.strip()
    if payload.preferences is not None:
        current_prefs = current_user.get("preferences", {})
        current_prefs.update(payload.preferences)
        update_fields["preferences"] = current_prefs

    if update_fields:
        await users_col.update_one({"_id": user_id}, {"$set": update_fields})

    updated_user = await users_col.find_one({"_id": user_id})
    return UserProfile(
        id=updated_user["_id"],
        name=updated_user.get("name", "Student"),
        email=updated_user.get("email", ""),
        role=updated_user.get("role", "Student"),
        knowledgeScore=updated_user.get("knowledgeScore", 70),
        retentionRate=updated_user.get("retentionRate", 75),
        topicsAtRiskCount=updated_user.get("topicsAtRiskCount", 0),
        learningStreak=updated_user.get("learningStreak", 1),
        onboarded=updated_user.get("onboarded", False),
        preferences=updated_user.get("preferences", {}),
        createdAt=updated_user.get("createdAt")
    )

@router.post("/onboarding", response_model=UserProfile)
async def submit_onboarding(payload: OnboardingRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    users_col = get_collection("users")

    current_prefs = current_user.get("preferences", {})
    current_prefs.update({
        "preferredSubjects": payload.subjects,
        "experienceLevel": payload.level,
        "goal": payload.goal,
        "dailyGoalMinutes": int(payload.dailyTime) if payload.dailyTime.isdigit() else 30
    })

    await users_col.update_one(
        {"_id": user_id},
        {"$set": {
            "onboarded": True,
            "preferences": current_prefs
        }}
    )

    updated_user = await users_col.find_one({"_id": user_id})
    return UserProfile(
        id=updated_user["_id"],
        name=updated_user.get("name", "Student"),
        email=updated_user.get("email", ""),
        role=updated_user.get("role", "Student"),
        knowledgeScore=updated_user.get("knowledgeScore", 70),
        retentionRate=updated_user.get("retentionRate", 75),
        topicsAtRiskCount=updated_user.get("topicsAtRiskCount", 0),
        learningStreak=updated_user.get("learningStreak", 1),
        onboarded=True,
        preferences=updated_user.get("preferences", {}),
        createdAt=updated_user.get("createdAt")
    )
