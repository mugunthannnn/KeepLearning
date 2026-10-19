from typing import List, Dict, Optional, Any
from pydantic import BaseModel, EmailStr, Field

# User & Auth Schemas
class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserPreferences(BaseModel):
    dailyGoalMinutes: int = 30
    experienceLevel: str = "Intermediate"
    goal: str = "Interview preparation"
    preferredSubjects: List[str] = ["Java", "SQL", "Data Structures"]
    emailAlerts: bool = True
    driftAlerts: bool = True
    weeklySummary: bool = True
    theme: str = "light"

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    role: str = "Student"
    knowledgeScore: int = 70
    retentionRate: int = 75
    topicsAtRiskCount: int = 0
    learningStreak: int = 1
    onboarded: bool = False
    preferences: UserPreferences = Field(default_factory=UserPreferences)
    createdAt: Optional[str] = None

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

class OnboardingRequest(BaseModel):
    subjects: List[str] = []
    level: str = "Intermediate"
    goal: str = "Skill Mastery"
    dailyTime: str = "30"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile

# Subject & Topic Schemas
class Concept(BaseModel):
    name: str
    score: int = 70
    status: str = "Stable"

class Lesson(BaseModel):
    title: str
    content: str
    codeSnippet: Optional[str] = None

class ForecastPoint(BaseModel):
    day: str
    knowledge: int
    predictedWithoutRev: int
    predictedWithRev: int

class Topic(BaseModel):
    id: str
    subjectId: str
    subjectName: str
    name: str
    description: str
    knowledge: int = 70
    driftProbability: int = 30
    stability: str = "Medium"
    riskLevel: str = "Low"
    lastPracticed: str = "Recently"
    lastPracticedDaysAgo: int = 0
    accuracy: int = 75
    revisionTimeMinutes: int = 15
    recommendedQuestions: int = 5
    riskFactors: List[str] = []
    forecastData: List[ForecastPoint] = []
    concepts: List[Concept] = []
    lesson: Optional[Lesson] = None

class Subject(BaseModel):
    id: str
    name: str
    category: str
    iconName: str
    knowledge: int = 70
    retention: int = 75
    topicCount: int = 0
    completedTopics: int = 0
    riskLevel: str = "Low"
    lastStudied: str = "Recently"
    description: str
    color: str = "#14B8A6"

# Quiz Schemas
class QuizQuestionPublic(BaseModel):
    id: str
    question: str
    options: List[str]

class QuizQuestionFull(QuizQuestionPublic):
    correctAnswer: int
    explanation: str

class QuizDetail(BaseModel):
    topicId: str
    topicName: str
    subjectName: str
    questions: List[QuizQuestionPublic]

class QuizSubmitRequest(BaseModel):
    answers: Dict[str, int] # question_id -> option_index

class QuestionResult(BaseModel):
    questionId: str
    question: str
    userAnswer: Optional[int]
    correctAnswer: int
    isCorrect: bool
    explanation: str

class QuizSubmitResponse(BaseModel):
    topicId: str
    topicName: str
    subjectName: str
    score: int
    correctCount: int
    totalQuestions: int
    beforeKnowledge: int
    afterKnowledge: int
    knowledgeDiff: int
    conceptsBreakdown: List[Concept]
    aiInsight: str
    questionResults: List[QuestionResult]

# Revision Task Schemas
class RevisionTask(BaseModel):
    id: str
    userId: str
    topicId: str
    topicName: str
    subjectName: str
    riskLevel: str
    driftProbability: int
    timeMinutes: int
    questionsCount: int
    dueDateCategory: str
    dueDateLabel: str
    completed: bool = False
    reason: str

class AddRevisionTaskRequest(BaseModel):
    topicId: str
    dueDateCategory: Optional[str] = "Today"
    reason: Optional[str] = "Manually scheduled revision"

class RescheduleTaskRequest(BaseModel):
    dueDateCategory: str

# Activity & Analytics Schemas
class ActivityItem(BaseModel):
    id: str
    title: str
    subtitle: str
    timestamp: str
    type: str # quiz, revision, alert
    iconName: str

class AnalyticsData(BaseModel):
    knowledgeGrowthHistory: List[Dict[str, Any]]
    subjectPerformance: List[Dict[str, Any]]
    driftRiskDistribution: List[Dict[str, Any]]
    revisionEffectiveness: List[Dict[str, Any]]
    quizAccuracyTrend: List[Dict[str, Any]]

class DashboardData(BaseModel):
    user: UserProfile
    priorityTopic: Optional[Topic] = None
    subjects: List[Subject] = []
    topics: List[Topic] = []
    activities: List[ActivityItem] = []
    analyticsData: AnalyticsData
