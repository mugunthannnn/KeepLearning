import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends
from app.database import get_collection
from app.models.schemas import UserRegister, UserLogin, TokenResponse, UserProfile
from app.auth.security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister):
    users_col = get_collection("users")
    
    # Check for existing email (case-insensitive)
    existing_user = await users_col.find_one({"email": payload.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists."
        )

    user_id = str(uuid.uuid4())
    hashed_pwd = hash_password(payload.password)
    now_iso = datetime.now(timezone.utc).isoformat()

    user_doc = {
        "_id": user_id,
        "name": payload.full_name.strip(),
        "email": payload.email.lower().strip(),
        "passwordHash": hashed_pwd,
        "role": "Computer Science Student",
        "knowledgeScore": 70,
        "retentionRate": 75,
        "topicsAtRiskCount": 0,
        "learningStreak": 1,
        "onboarded": False,
        "preferences": {
            "dailyGoalMinutes": 30,
            "experienceLevel": "Intermediate",
            "goal": "Interview preparation & Skill Mastery",
            "preferredSubjects": ["Java", "SQL"],
            "emailAlerts": True,
            "driftAlerts": True,
            "weeklySummary": True,
            "theme": "light"
        },
        "createdAt": now_iso
    }

    await users_col.insert_one(user_doc)

    access_token = create_access_token(data={"sub": user_id, "email": user_doc["email"]})
    
    profile = UserProfile(
        id=user_id,
        name=user_doc["name"],
        email=user_doc["email"],
        role=user_doc["role"],
        knowledgeScore=user_doc["knowledgeScore"],
        retentionRate=user_doc["retentionRate"],
        topicsAtRiskCount=user_doc["topicsAtRiskCount"],
        learningStreak=user_doc["learningStreak"],
        onboarded=user_doc["onboarded"],
        preferences=user_doc["preferences"],
        createdAt=user_doc["createdAt"]
    )

    return TokenResponse(access_token=access_token, user=profile)

@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    users_col = get_collection("users")
    user_doc = await users_col.find_one({"email": payload.email.lower().strip()})

    if not user_doc or not verify_password(payload.password, user_doc.get("passwordHash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    user_id = user_doc["_id"]
    access_token = create_access_token(data={"sub": user_id, "email": user_doc["email"]})

    profile = UserProfile(
        id=user_id,
        name=user_doc.get("name", "Student"),
        email=user_doc.get("email", ""),
        role=user_doc.get("role", "Student"),
        knowledgeScore=user_doc.get("knowledgeScore", 70),
        retentionRate=user_doc.get("retentionRate", 75),
        topicsAtRiskCount=user_doc.get("topicsAtRiskCount", 0),
        learningStreak=user_doc.get("learningStreak", 1),
        onboarded=user_doc.get("onboarded", False),
        preferences=user_doc.get("preferences", {}),
        createdAt=user_doc.get("createdAt")
    )

    return TokenResponse(access_token=access_token, user=profile)

@router.get("/me", response_model=UserProfile)
async def get_me(current_user: dict = Depends(get_current_user)):
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
