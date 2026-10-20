
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

from app.database import get_collection
from app.seed_data import SEED_SUBJECTS, SEED_TOPICS, SEED_QUIZZES
from app.services.prediction_service import prediction_service


class LearningService:

    @staticmethod
    async def init_curriculum():
        """Initialize global curriculum catalogs if empty."""
        subjects_col = get_collection("subjects")
        topics_col = get_collection("topics")
        quizzes_col = get_collection("quizzes")

        if await subjects_col.count_documents() == 0:
            for subject in SEED_SUBJECTS:
                doc = dict(subject)
                doc["_id"] = subject["id"]
                await subjects_col.insert_one(doc)

        if await topics_col.count_documents() == 0:
            for topic in SEED_TOPICS:
                doc = dict(topic)
                doc["_id"] = topic["id"]
                await topics_col.insert_one(doc)

        if await quizzes_col.count_documents() == 0:
            for topic_id, quiz in SEED_QUIZZES.items():
                doc = dict(quiz)
                doc["_id"] = topic_id
                await quizzes_col.insert_one(doc)

    @staticmethod
    async def get_user_topic_progress(
        user_id: str,
        topic_id: str
    ) -> Optional[Dict[str, Any]]:
        progress_col = get_collection("user_topic_progress")
        return await progress_col.find_one({
            "userId": user_id,
            "topicId": topic_id
        })

    @staticmethod
    async def get_all_topics_for_user(
        user_id: str
    ) -> List[Dict[str, Any]]:
        """Merge curriculum topics with this user's progress only."""
        topics_col = get_collection("topics")

        if await topics_col.count_documents() == 0:
            await LearningService.init_curriculum()

        base_topics = await topics_col.find().to_list(100)

        progress_col = get_collection("user_topic_progress")
        progress_docs = await progress_col.find({
            "userId": user_id
        }).to_list(100)

        progress_map = {
            doc["topicId"]: doc
            for doc in progress_docs
        }

        result_topics = []

        for original in base_topics:
            topic = dict(original)
            topic_id = topic.get("id", topic.get("_id"))
            progress = progress_map.get(topic_id)

            if progress:
                knowledge = int(progress.get("knowledge", 0))
                accuracy = int(progress.get("accuracy", 0))
                days_ago = int(
                    progress.get("lastPracticedDaysAgo", 0)
                )
                repetition_count = int(
                    progress.get("repetitionCount", 0)
                )
                last_practiced = progress.get(
                    "lastPracticed", "Not started"
                )
                concepts = progress.get("concepts", [])

                prediction = prediction_service.predict_topic_drift(
                    topic_id=topic_id,
                    current_knowledge=knowledge,
                    days_since_practice=days_ago,
                    accuracy=accuracy,
                    repetition_count=repetition_count,
                )
            else:
                knowledge = 0
                accuracy = 0
                days_ago = 0
                repetition_count = 0
                last_practiced = "Not started"
                concepts = []

                # Untouched topics are not revision risks.
                prediction = {
                    "driftProbability": 0,
                    "stability": 0,
                    "riskLevel": "Not Started",
                    "riskFactors": [],
                    "revisionTimeMinutes": 0,
                    "recommendedQuestions": 0,
                    "forecastData": [],
                }

            topic["id"] = topic_id
            topic["knowledge"] = knowledge
            topic["accuracy"] = accuracy
            topic["lastPracticed"] = last_practiced
            topic["lastPracticedDaysAgo"] = days_ago
            topic["repetitionCount"] = repetition_count
            topic["driftProbability"] = prediction["driftProbability"]
            topic["stability"] = prediction["stability"]
            topic["riskLevel"] = prediction["riskLevel"]
            topic["riskFactors"] = prediction["riskFactors"]
            topic["revisionTimeMinutes"] = prediction[
                "revisionTimeMinutes"
            ]
            topic["recommendedQuestions"] = prediction[
                "recommendedQuestions"
            ]
            topic["forecastData"] = prediction["forecastData"]
            topic["concepts"] = concepts

            result_topics.append(topic)

        return result_topics

    @staticmethod
    async def get_all_subjects_for_user(
        user_id: str
    ) -> List[Dict[str, Any]]:
        """Calculate subject metrics using this user's progress."""
        subjects_col = get_collection("subjects")

        if await subjects_col.count_documents() == 0:
            await LearningService.init_curriculum()

        subjects = await subjects_col.find().to_list(100)
        topics = await LearningService.get_all_topics_for_user(user_id)

        result_subjects = []

        for subject in subjects:
            subject_id = subject.get("id", subject.get("_id"))
            subject_name = subject.get("name", "")

            subject_topics = [
                topic for topic in topics
                if (
                    topic.get("subjectId") == subject_id
                    or subject_id.lower()
                    in topic.get("subjectName", "").lower()
                )
            ]

            subject_data = dict(subject)

            if subject_topics:
                subject_data["knowledge"] = round(
                    sum(
                        topic.get("knowledge", 0)
                        for topic in subject_topics
                    ) / len(subject_topics)
                )

                subject_data["topicCount"] = len(subject_topics)

                subject_data["completedTopics"] = sum(
                    1 for topic in subject_topics
                    if (
                        topic.get("accuracy", 0) >= 70
                        and topic.get("repetitionCount", 0) > 0
                    )
                )

                subject_data["startedTopics"] = sum(
                    1 for topic in subject_topics
                    if topic.get("repetitionCount", 0) > 0
                )

                started_topics = [
                    topic for topic in subject_topics
                    if topic.get("repetitionCount", 0) > 0
                ]

                risk_levels = [
                    topic.get("riskLevel", "Not Started")
                    for topic in started_topics
                ]

                if "Critical" in risk_levels:
                    subject_data["riskLevel"] = "Critical"
                elif "High" in risk_levels:
                    subject_data["riskLevel"] = "High"
                elif "Medium" in risk_levels:
                    subject_data["riskLevel"] = "Medium"
                elif started_topics:
                    subject_data["riskLevel"] = "Low"
                else:
                    subject_data["riskLevel"] = "Not Started"

            else:
                subject_data["knowledge"] = 0
                subject_data["topicCount"] = 0
                subject_data["completedTopics"] = 0
                subject_data["startedTopics"] = 0
                subject_data["riskLevel"] = "Not Started"

            result_subjects.append(subject_data)

        return result_subjects

    @staticmethod
    async def submit_quiz(
        user_id: str,
        topic_id: str,
        answers: Dict[str, int]
    ) -> Dict[str, Any]:
        """Validate quiz, save the attempt, and update user progress."""
        quizzes_col = get_collection("quizzes")

        quiz_data = (
            await quizzes_col.find_one({"_id": topic_id})
            or await quizzes_col.find_one({"topicId": topic_id})
        )

        if not quiz_data:
            quiz_data = SEED_QUIZZES.get(topic_id)

        if not quiz_data:
            raise ValueError(f"No quiz found for topic: {topic_id}")

        questions = quiz_data.get("questions", [])
        if not questions:
            raise ValueError("This quiz has no questions.")

        correct_count = 0
        question_results = []

        for question in questions:
            question_id = question["id"]
            user_answer = answers.get(question_id)
            correct_answer = question.get("correctAnswer", 0)
            is_correct = user_answer == correct_answer

            if is_correct:
                correct_count += 1

            question_results.append({
                "questionId": question_id,
                "question": question.get("question", ""),
                "userAnswer": user_answer,
                "correctAnswer": correct_answer,
                "isCorrect": is_correct,
                "explanation": question.get("explanation", ""),
            })

        total_questions = len(questions)
        score_percent = round(
            correct_count / total_questions * 100
        )

        progress_col = get_collection("user_topic_progress")
        prior_progress = await progress_col.find_one({
            "userId": user_id,
            "topicId": topic_id,
        })

        topics_col = get_collection("topics")
        base_topic = (
            await topics_col.find_one({"_id": topic_id})
            or await topics_col.find_one({"id": topic_id})
        )

        # A first-time quiz starts from zero, not seeded knowledge.
        before_knowledge = (
            int(prior_progress.get("knowledge", 0))
            if prior_progress
            else 0
        )

        if score_percent >= 60:
            knowledge_gain = max(
                1,
                round((score_percent - before_knowledge) * 0.45 + 6)
            )
        else:
            knowledge_gain = 0

        after_knowledge = min(
            100,
            max(0, before_knowledge + knowledge_gain)
        )
        knowledge_diff = after_knowledge - before_knowledge

        prior_accuracy = (
            int(prior_progress.get("accuracy", 0))
            if prior_progress
            else 0
        )
        previous_attempts = (
            int(prior_progress.get("repetitionCount", 0))
            if prior_progress
            else 0
        )

        new_accuracy = round(
            (prior_accuracy * previous_attempts + score_percent)
            / (previous_attempts + 1)
        )
        new_repetition_count = previous_attempts + 1

        prediction = prediction_service.predict_topic_drift(
            topic_id=topic_id,
            current_knowledge=after_knowledge,
            days_since_practice=0,
            accuracy=new_accuracy,
            repetition_count=new_repetition_count,
        )

        base_concepts = (
            base_topic.get("concepts", [])
            if base_topic
            else []
        )

        updated_concepts = []
        for concept in base_concepts:
            concept_score = min(
                100,
                max(
                    0,
                    int(concept.get("score", 0)) + knowledge_diff
                )
            )

            if concept_score >= 80:
                status = "Strong"
            elif concept_score >= 65:
                status = "Stable"
            elif concept_score >= 50:
                status = "Needs Review"
            else:
                status = "At Risk"

            updated_concepts.append({
                "name": concept.get("name", ""),
                "score": concept_score,
                "status": status,
            })

        now = datetime.now(timezone.utc).isoformat()

        progress_doc = {
            "userId": user_id,
            "topicId": topic_id,
            "knowledge": after_knowledge,
            "accuracy": new_accuracy,
            "repetitionCount": new_repetition_count,
            "lastPracticed": "Just now",
            "lastPracticedDaysAgo": 0,
            "driftProbability": prediction["driftProbability"],
            "stability": prediction["stability"],
            "riskLevel": prediction["riskLevel"],
            "concepts": updated_concepts,
            "updatedAt": now,
        }

        await progress_col.update_one(
            {"userId": user_id, "topicId": topic_id},
            {"$set": progress_doc},
            upsert=True,
        )

        attempts_col = get_collection("quiz_attempts")
        await attempts_col.insert_one({
            "_id": str(uuid.uuid4()),
            "userId": user_id,
            "topicId": topic_id,
            "topicName": quiz_data.get("topicName", topic_id),
            "subjectName": quiz_data.get("subjectName", "General"),
            "score": score_percent,
            "correctCount": correct_count,
            "totalQuestions": total_questions,
            "beforeKnowledge": before_knowledge,
            "afterKnowledge": after_knowledge,
            "knowledgeDiff": knowledge_diff,
            "answers": answers,
            "timestamp": now,
        })

        activities_col = get_collection("activities")
        await activities_col.insert_one({
            "_id": str(uuid.uuid4()),
            "userId": user_id,
            "title": (
                f"Completed {quiz_data.get('topicName', 'Topic')} Quiz"
            ),
            "subtitle": (
                f"Score: {score_percent}% "
                f"({knowledge_diff:+d}% knowledge change)"
            ),
            "timestamp": "Just now",
            "type": "quiz",
            "iconName": "CheckCircle2",
            "createdAt": now,
        })

        # Calculate overall knowledge from this user's topic progress.
        user_topics = await LearningService.get_all_topics_for_user(
            user_id
        )
        started_topics = [
            topic for topic in user_topics
            if topic.get("repetitionCount", 0) > 0
        ]

        overall_score = (
            round(
                sum(topic["knowledge"] for topic in started_topics)
                / len(started_topics)
            )
            if started_topics
            else 0
        )

        high_risk_count = sum(
            1 for topic in started_topics
            if topic.get("riskLevel") in ["High", "Critical"]
        )

        retention_rate = (
            round(
                sum(topic["accuracy"] for topic in started_topics)
                / len(started_topics)
            )
            if started_topics
            else 0
        )

        users_col = get_collection("users")
        await users_col.update_one(
            {"_id": user_id},
            {"$set": {
                "knowledgeScore": overall_score,
                "retentionRate": retention_rate,
                "topicsAtRiskCount": high_risk_count,
            }},
        )

        if score_percent >= 80:
            ai_insight = (
                f"Great work! Your quiz accuracy was {score_percent}%. "
                "Keep practising to strengthen retention."
            )
        else:
            ai_insight = (
                f"Your quiz accuracy was {score_percent}%. "
                "Review the incorrect answers and try again."
            )

        return {
            "topicId": topic_id,
            "topicName": quiz_data.get("topicName", topic_id),
            "subjectName": quiz_data.get("subjectName", ""),
            "score": score_percent,
            "correctCount": correct_count,
            "totalQuestions": total_questions,
            "beforeKnowledge": before_knowledge,
            "afterKnowledge": after_knowledge,
            "knowledgeDiff": knowledge_diff,
            "conceptsBreakdown": updated_concepts,
            "aiInsight": ai_insight,
            "questionResults": question_results,
        }

    @staticmethod
    async def get_user_revision_tasks(
        user_id: str
    ) -> List[Dict[str, Any]]:
        """Return existing revision tasks for this user only."""
        rev_col = get_collection("revision_tasks")

        tasks = await rev_col.find({
            "userId": user_id
        }).to_list(100)

        for task in tasks:
            if "id" not in task:
                task["id"] = task.get("_id", str(uuid.uuid4()))

        # Do not generate default tasks for new accounts.
        return tasks

    @staticmethod
    async def add_revision_task(
        user_id: str,
        topic_id: str,
        due_date_category: str = "Today",
        reason: str = "Added by learner"
    ) -> Dict[str, Any]:
        rev_col = get_collection("revision_tasks")
        topics_col = get_collection("topics")

        topic = (
            await topics_col.find_one({"_id": topic_id})
            or await topics_col.find_one({"id": topic_id})
        )

        task_id = f"rev-{uuid.uuid4().hex[:8]}"

        task_doc = {
            "_id": str(uuid.uuid4()),
            "id": task_id,
            "userId": user_id,
            "topicId": topic_id,
            "topicName": topic.get("name", topic_id) if topic else topic_id,
            "subjectName": (
                topic.get("subjectName", "General")
                if topic else "General"
            ),
            "riskLevel": (
                topic.get("riskLevel", "Not Started")
                if topic else "Not Started"
            ),
            "driftProbability": (
                topic.get("driftProbability", 0)
                if topic else 0
            ),
            "timeMinutes": (
                topic.get("revisionTimeMinutes", 0)
                if topic else 0
            ),
            "questionsCount": (
                topic.get("recommendedQuestions", 0)
                if topic else 0
            ),
            "dueDateCategory": due_date_category,
            "dueDateLabel": f"{due_date_category} (User Scheduled)",
            "completed": False,
            "reason": reason,
            "createdAt": datetime.now(timezone.utc).isoformat(),
        }

        await rev_col.insert_one(task_doc)
        return task_doc

    @staticmethod
    async def complete_revision_task(
        user_id: str,
        task_id: str
    ) -> bool:
        rev_col = get_collection("revision_tasks")

        task = await rev_col.find_one({
            "$or": [
                {"_id": task_id},
                {"id": task_id},
            ],
            "userId": user_id,
        })

        if not task:
            return False

        await rev_col.update_one(
            {
                "$or": [
                    {"_id": task_id},
                    {"id": task_id},
                ],
                "userId": user_id,
            },
            {"$set": {
                "completed": True,
                "completedAt": datetime.now(timezone.utc).isoformat(),
            }},
        )

        topic_id = task.get("topicId")
        if not topic_id:
            return True

        progress_col = get_collection("user_topic_progress")
        progress = await progress_col.find_one({
            "userId": user_id,
            "topicId": topic_id,
        })

        # Do not create artificial progress for an untouched topic.
        if not progress:
            return True

        current_knowledge = int(progress.get("knowledge", 0))
        boosted_knowledge = min(100, current_knowledge + 14)
        accuracy = int(progress.get("accuracy", 0))
        repetition_count = int(progress.get("repetitionCount", 0)) + 1

        prediction = prediction_service.predict_topic_drift(
            topic_id=topic_id,
            current_knowledge=boosted_knowledge,
            days_since_practice=0,
            accuracy=accuracy,
            repetition_count=repetition_count,
        )

        now = datetime.now(timezone.utc).isoformat()

        await progress_col.update_one(
            {"userId": user_id, "topicId": topic_id},
            {"$set": {
                "knowledge": boosted_knowledge,
                "repetitionCount": repetition_count,
                "lastPracticed": "Just now",
                "lastPracticedDaysAgo": 0,
                "driftProbability": prediction["driftProbability"],
                "riskLevel": prediction["riskLevel"],
                "stability": prediction["stability"],
                "updatedAt": now,
            }},
        )

        activities_col = get_collection("activities")
        await activities_col.insert_one({
            "_id": str(uuid.uuid4()),
            "userId": user_id,
            "title": f"Completed Revision: {task.get('topicName', 'Topic')}",
            "subtitle": (
                f"Spent {task.get('timeMinutes', 0)} mins revising "
                "concepts"
            ),
            "timestamp": "Just now",
            "type": "revision",
            "iconName": "BookOpen",
            "createdAt": now,
        })

        return True

    @staticmethod
    async def reschedule_task(
        user_id: str,
        task_id: str,
        new_category: str
    ) -> bool:
        rev_col = get_collection("revision_tasks")

        result = await rev_col.update_one(
            {
                "$or": [
                    {"_id": task_id},
                    {"id": task_id},
                ],
                "userId": user_id,
            },
            {"$set": {
                "dueDateCategory": new_category,
                "dueDateLabel": f"{new_category} (Rescheduled)",
            }},
        )

        return result.matched_count > 0

    @staticmethod
    async def get_user_activities(
        user_id: str
    ) -> List[Dict[str, Any]]:
        """Return only actual activities for this user."""
        activities_col = get_collection("activities")

        activities = await activities_col.find({
            "userId": user_id
        }).sort("createdAt", -1).to_list(20)

        # No synthetic welcome activity for fresh accounts.
        for activity in activities:
            if "id" not in activity:
                activity["id"] = activity.get(
                    "_id", str(uuid.uuid4())
                )

        return activities

    @staticmethod
    async def get_dashboard(
        user_id: str
    ) -> Dict[str, Any]:
        """Aggregate dashboard data for one user."""
        users_col = get_collection("users")
        user_doc = await users_col.find_one({"_id": user_id})

        if not user_doc:
            raise ValueError("User not found")

        topics = await LearningService.get_all_topics_for_user(user_id)
        subjects = await LearningService.get_all_subjects_for_user(user_id)
        activities = await LearningService.get_user_activities(user_id)

        started_topics = [
            topic for topic in topics
            if topic.get("repetitionCount", 0) > 0
        ]

        priority_topic = (
            max(
                started_topics,
                key=lambda topic: topic.get("driftProbability", 0)
            )
            if started_topics
            else None
        )

        high_risk_count = sum(
            1 for topic in started_topics
            if topic.get("riskLevel") in ["Critical", "High"]
        )
        medium_risk_count = sum(
            1 for topic in started_topics
            if topic.get("riskLevel") == "Medium"
        )
        low_risk_count = sum(
            1 for topic in started_topics
            if topic.get("riskLevel") == "Low"
        )

        total_started_topics = len(started_topics)

        if total_started_topics:
            risk_distribution = [
                {
                    "name": "Low Risk (Stable)",
                    "count": low_risk_count,
                    "percentage": round(
                        low_risk_count / total_started_topics * 100
                    ),
                    "color": "#10B981",
                },
                {
                    "name": "Medium Risk",
                    "count": medium_risk_count,
                    "percentage": round(
                        medium_risk_count / total_started_topics * 100
                    ),
                    "color": "#38BDF8",
                },
                {
                    "name": "High Risk",
                    "count": high_risk_count,
                    "percentage": round(
                        high_risk_count / total_started_topics * 100
                    ),
                    "color": "#F59E0B",
                },
            ]
        else:
            risk_distribution = []

        knowledge_score = int(user_doc.get("knowledgeScore", 0))
        retention_rate = int(user_doc.get("retentionRate", 0))

        # Use actual quiz attempts instead of fabricated historical data.
        attempts_col = get_collection("quiz_attempts")
        attempts = await attempts_col.find({
            "userId": user_id
        }).to_list(500)

        attempts.sort(key=lambda item: item.get("timestamp", ""))

        knowledge_growth_history = []
        quiz_accuracy_trend = []

        if attempts:
            for index, attempt in enumerate(attempts, start=1):
                knowledge_growth_history.append({
                    "label": f"Attempt {index}",
                    "overall": attempt.get("afterKnowledge", 0),
                })
                quiz_accuracy_trend.append({
                    "date": f"Attempt {index}",
                    "accuracy": attempt.get("score", 0),
                })

        subject_performance = [
            {
                "name": subject.get("name", "Subject"),
                "score": subject.get("knowledge", 0),
                "target": 80,
                "color": subject.get("color", "#14B8A6"),
            }
            for subject in subjects
            if subject.get("startedTopics", 0) > 0
        ]

        # Only show revision effectiveness when real revision data exists.
        revision_effectiveness = []
        for attempt in attempts:
            before = int(attempt.get("beforeKnowledge", 0))
            after = int(attempt.get("afterKnowledge", 0))
            revision_effectiveness.append({
                "subject": attempt.get("topicName", "Topic"),
                "before": before,
                "after": after,
                "gain": after - before,
            })

        user_profile = {
            "id": user_doc["_id"],
            "name": user_doc.get("name", "Student"),
            "email": user_doc.get("email", ""),
            "role": user_doc.get("role", "Student"),
            "knowledgeScore": knowledge_score,
            "retentionRate": retention_rate,
            "topicsAtRiskCount": high_risk_count,
            "learningStreak": int(user_doc.get("learningStreak", 0)),
            "onboarded": user_doc.get("onboarded", False),
            "preferences": user_doc.get("preferences", {}),
        }

        analytics_data = {
            "knowledgeGrowthHistory": knowledge_growth_history,
            "subjectPerformance": subject_performance,
            "driftRiskDistribution": risk_distribution,
            "revisionEffectiveness": revision_effectiveness,
            "quizAccuracyTrend": quiz_accuracy_trend,
        }

        return {
            "user": user_profile,
            "priorityTopic": priority_topic,
            "subjects": subjects,
            "topics": topics,
            "activities": activities,
            "analyticsData": analytics_data,
        }
