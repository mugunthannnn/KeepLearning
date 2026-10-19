import os
from typing import List

class Settings:
    PROJECT_NAME: str = "keepLearning - AI-Powered Revision & Knowledge Drift Prediction"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"

    # Database
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "keeplearning_db")
    DATA_DIR: str = os.getenv("DATA_DIR", os.path.join(os.path.dirname(os.path.dirname(__file__)), "data"))

    # Security & JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "keeplearning-super-secret-jwt-key-2026-academic-review")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080")) # 7 days

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

settings = Settings()
