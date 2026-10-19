import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.database import get_collection
from app.seed_data import SEED_SUBJECTS, SEED_TOPICS, SEED_QUIZZES
from app.services.prediction_service import prediction_service

class LearningService:
    @staticmethod
    async def init_curriculum():
        """Initializes global curriculum catalogs if empty."""
        subjects_col = get_collection("subjects")
        topics_col = get_collection("topics")
        quizzes_col = get_collection("quizzes")

        if await subjects_col.count_documents() == 0:
            for s in SEED_SUBJECTS:
                doc = dict(s)
                doc["_id"] = s["id"]
                await subjects_col.insert_one(doc)

        if await topics_col.count_documents() == 0:
            for t in SEED_TOPICS:
                doc = dict(t)
                doc["_id"] = t["id"]
                await topics_col.insert_one(doc)

        if await quizzes_col.count_documents() == 0:
            for topic_id, q_data in SEED_QUIZZES.items():
                doc = dict(q_data)
                doc["_id"] = topic_id
                await quizzes_col.insert_one(doc)

    @staticmethod
    async def get_user_topic_progress(user_id: str, topic_id: str) -> Optional[Dict[str, Any]]:
        progress_col = get_collection("user_topic_progress")
        return await progress_col.find_one({"userId": user_id, "topicId": topic_id})

    @staticmethod
    async def get_all_topics_for_user(user_id: str) -> List[Dict[str, Any]]:
        """Returns all topics with user-specific progress merged and dynamic forecasts."""
        topics_col = get_collection("topics")
        if await topics_col.count_documents() == 0:
            await LearningService.init_curriculum()

        base_topics = await topics_col.find().to_list(100)
        progress_col = get_collection("user_topic_progress")
        user_progress_docs = await progress_col.find({"userId": user_id}).to_list(100)
        progress_map = {doc["topicId"]: doc for doc in user_progress_docs}

        result_topics = []
        for t in base_topics:
            t_id = t["id"]
            user_prog = progress_map.get(t_id)

            knowledge = user_prog.get("knowledge", t.get("knowledge", 70)) if user_prog else t.get("knowledge", 70)
            accuracy = user_prog.get("accuracy", t.get("accuracy", 75)) if user_prog else t.get("accuracy", 75)
            days_ago = user_prog.get("lastPracticedDaysAgo", t.get("lastPracticedDaysAgo", 3)) if user_prog else t.get("lastPracticedDaysAgo", 3)
            rep_count = user_prog.get("repetitionCount", 1) if user_prog else 1
            last_practiced = user_prog.get("lastPracticed", t.get("lastPracticed", "Recently")) if user_prog else t.get("lastPracticed", "Recently")

            pred = prediction_service.predict_topic_drift(
                topic_id=t_id,
                current_knowledge=knowledge,
                days_since_practice=days_ago,
                accuracy=accuracy,
                repetition_count=rep_count
            )

            merged = dict(t)
            merged["knowledge"] = knowledge
            merged["accuracy"] = accuracy
            merged["lastPracticed"] = last_practiced
            merged["lastPracticedDaysAgo"] = days_ago
            merged["driftProbability"] = pred["driftProbability"]
            merged["stability"] = pred["stability"]
            merged["riskLevel"] = pred["riskLevel"]
            merged["riskFactors"] = pred["riskFactors"]
            merged["revisionTimeMinutes"] = pred["revisionTimeMinutes"]
            merged["recommendedQuestions"] = pred["recommendedQuestions"]
            merged["forecastData"] = pred["forecastData"]
            merged["concepts"] = user_prog.get("concepts", t.get("concepts", [])) if user_prog else t.get("concepts", [])

            result_topics.append(merged)

        return result_topics

    @staticmethod
    async def get_all_subjects_for_user(user_id: str) -> List[Dict[str, Any]]:
        """Returns subjects with knowledge metrics calculated from user's topics."""
        subjects_col = get_collection("subjects")
        if await subjects_col.count_documents() == 0:
            await LearningService.init_curriculum()

        subjects = await subjects_col.find().to_list(100)
        topics = await LearningService.get_all_topics_for_user(user_id)

        result_subjects = []
        for s in subjects:
            s_topics = [t for t in topics if t.get("subjectId") == s["id"] or s["id"].lower() in t.get("subjectName", "").lower()]
            if s_topics:
                avg_knowledge = round(sum(t["knowledge"] for t in s_topics) / len(s_topics))
                completed = sum(1 for t in s_topics if t.get("accuracy", 0) >= 70)
                highest_risk = "Low"
                for t in s_topics:
                    if t["riskLevel"] == "Critical":
                        highest_risk = "Critical"
                        break
                    elif t["riskLevel"] == "High" and highest_risk != "Critical":
                        highest_risk = "High"
                    elif t["riskLevel"] == "Medium" and highest_risk not in ["Critical", "High"]:
                        highest_risk = "Medium"

                subj_dict = dict(s)
                subj_dict["knowledge"] = avg_knowledge
                subj_dict["retention"] = min(100, avg_knowledge + 6)
                subj_dict["topicCount"] = len(s_topics)
                subj_dict["completedTopics"] = completed
                subj_dict["riskLevel"] = highest_risk
                result_subjects.append(subj_dict)
            else:
                result_subjects.append(s)

        return result_subjects

    @staticmethod
    async def submit_quiz(user_id: str, topic_id: str, answers: Dict[str, int]) -> Dict[str, Any]:
        """Validates quiz, persists attempt, updates topic progress & knowledge, logs activity."""
        quizzes_col = get_collection("quizzes")
        quiz_data = await quizzes_col.find_one({"_id": topic_id}) or await quizzes_col.find_one({"topicId": topic_id})

        if not quiz_data and topic_id in SEED_QUIZZES:
            quiz_data = SEED_QUIZZES[topic_id]

        if not quiz_data:
            # Fallback to hashmap quiz if topic quiz not found
            quiz_data = SEED_QUIZZES.get("hashmap")

        questions = quiz_data.get("questions", [])
        correct_count = 0
        question_results = []

        for q in questions:
            q_id = q["id"]
            user_ans = answers.get(q_id)
            correct_ans = q.get("correctAnswer", 0)
            is_correct = (user_ans == correct_ans)
            if is_correct:
                correct_count += 1

            question_results.append({
                "questionId": q_id,
                "question": q["question"],
                "userAnswer": user_ans,
                "correctAnswer": correct_ans,
                "isCorrect": is_correct,
                "explanation": q.get("explanation", "")
            })

        total_questions = len(questions)
        score_percent = round((correct_count / total_questions) * 100) if total_questions > 0 else 0

        # Retrieve prior progress
        progress_col = get_collection("user_topic_progress")
        prior_prog = await progress_col.find_one({"userId": user_id, "topicId": topic_id})
        
        topics_col = get_collection("topics")
        base_topic = await topics_col.find_one({"_id": topic_id}) or await topics_col.find_one({"id": topic_id})
        default_knowledge = base_topic.get("knowledge", 64) if base_topic else 64

        before_knowledge = prior_prog.get("knowledge", default_knowledge) if prior_prog else default_knowledge
        
        # Knowledge update logic
        knowledge_gain = round((score_percent - before_knowledge) * 0.45 + 6) if score_percent >= 60 else -4
        after_knowledge = min(100, max(10, before_knowledge + knowledge_gain))
        knowledge_diff = after_knowledge - before_knowledge

        prior_accuracy = prior_prog.get("accuracy", 70) if prior_prog else 70
        new_accuracy = round((prior_accuracy + score_percent) / 2)
        new_rep_count = (prior_prog.get("repetitionCount", 0) if prior_prog else 0) + 1

        pred = prediction_service.predict_topic_drift(
            topic_id=topic_id,
            current_knowledge=after_knowledge,
            days_since_practice=0,
            accuracy=new_accuracy,
            repetition_count=new_rep_count
        )

        # Update concepts status
        base_concepts = base_topic.get("concepts", []) if base_topic else []
        updated_concepts = []
        for c in base_concepts:
            concept_score = min(100, max(20, c.get("score", 70) + (knowledge_gain // 2)))
            status = "Strong" if concept_score >= 80 else "Stable" if concept_score >= 65 else "Needs Review" if concept_score >= 50 else "At Risk"
            updated_concepts.append({"name": c["name"], "score": concept_score, "status": status})

        # Persist updated user topic progress
        progress_doc = {
            "userId": user_id,
            "topicId": topic_id,
            "knowledge": after_knowledge,
            "accuracy": new_accuracy,
            "repetitionCount": new_rep_count,
            "lastPracticed": "Just now",
            "lastPracticedDaysAgo": 0,
            "driftProbability": pred["driftProbability"],
            "stability": pred["stability"],
            "riskLevel": pred["riskLevel"],
            "concepts": updated_concepts,
            "updatedAt": datetime.now(timezone.utc).isoformat()
        }
        await progress_col.update_one(
            {"userId": user_id, "topicId": topic_id},
            {"$set": progress_doc},
            upsert=True
        )

        # Persist attempt record
        attempts_col = get_collection("quiz_attempts")
        attempt_id = str(uuid.uuid4())
        await attempts_col.insert_one({
            "_id": attempt_id,
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
            "timestamp": datetime.now(timezone.utc).isoformat()
        })

        # Log Activity
        activities_col = get_collection("activities")
        await activities_col.insert_one({
            "_id": str(uuid.uuid4()),
            "userId": user_id,
            "title": f"Completed {quiz_data.get('topicName', 'Topic')} Quiz",
            "subtitle": f"Score: {score_percent}% ({'+' if knowledge_diff >= 0 else ''}{knowledge_diff}% knowledge recovery)",
            "timestamp": "Just now",
            "type": "quiz",
            "iconName": "CheckCircle2",
            "createdAt": datetime.now(timezone.utc).isoformat()
        })

        # Recalculate user overall knowledge score
        user_topics = await LearningService.get_all_topics_for_user(user_id)
        if user_topics:
            overall_score = round(sum(t["knowledge"] for t in user_topics) / len(user_topics))
            high_risk = sum(1 for t in user_topics if t["riskLevel"] in ["High", "Critical"])
            retention_rate = min(100, max(50, round(overall_score * 0.95 + 8)))

            users_col = get_collection("users")
            await users_col.update_one(
                {"_id": user_id},
                {"$set": {
                    "knowledgeScore": overall_score,
                    "retentionRate": retention_rate,
                    "topicsAtRiskCount": high_risk
                }}
            )

        ai_insight = (
            f"Superb comprehension on core mechanics! Accuracy scored {score_percent}%. Memory stability boosted for the next 7 days."
            if score_percent >= 80 else
            f"Good attempt ({score_percent}%). Certain sub-concepts exhibited vulnerability. A 15-minute spaced revision is recommended within 48 hours."
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
            "questionResults": question_results
        }

    @staticmethod
    async def get_user_revision_tasks(user_id: str) -> List[Dict[str, Any]]:
        rev_col = get_collection("revision_tasks")
        tasks = await rev_col.find({"userId": user_id}).to_list(100)
        if not tasks:
            # Seed default personalized tasks for new user
            default_tasks = [
                {
                    "_id": str(uuid.uuid4()),
                    "id": f"rev-{uuid.uuid4().hex[:6]}",
                    "userId": user_id,
                    "topicId": "hashmap",
                    "topicName": "HashMap Internal Mechanics",
                    "subjectName": "Data Structures",
                    "riskLevel": "High",
                    "driftProbability": 78,
                    "timeMinutes": 20,
                    "questionsCount": 5,
                    "dueDateCategory": "Today",
                    "dueDateLabel": "Today (Priority 1)",
                    "completed": False,
                    "reason": "Practice gap increasing & collision resolution check"
                },
                {
                    "_id": str(uuid.uuid4()),
                    "id": f"rev-{uuid.uuid4().hex[:6]}",
                    "userId": user_id,
                    "topicId": "spring-security",
                    "topicName": "Spring Security & JWT",
                    "subjectName": "Spring Boot",
                    "riskLevel": "Critical",
                    "driftProbability": 84,
                    "timeMinutes": 25,
                    "questionsCount": 6,
                    "dueDateCategory": "Today",
                    "dueDateLabel": "Today (Priority 2)",
                    "completed": False,
                    "reason": "Critical prerequisite with low initial retention"
                },
                {
                    "_id": str(uuid.uuid4()),
                    "id": f"rev-{uuid.uuid4().hex[:6]}",
                    "userId": user_id,
                    "topicId": "sql-joins",
                    "topicName": "SQL JOIN Operations",
                    "subjectName": "SQL & Databases",
                    "riskLevel": "Medium",
                    "driftProbability": 62,
                    "timeMinutes": 15,
                    "questionsCount": 5,
                    "dueDateCategory": "Tomorrow",
                    "dueDateLabel": "Tomorrow, 9:00 AM",
                    "completed": False,
                    "reason": "Scheduled spaced repetition window"
                }
            ]
            for t in default_tasks:
                await rev_col.insert_one(t)
            tasks = default_tasks

        # Normalize ID
        for t in tasks:
            if "id" not in t:
                t["id"] = t.get("_id", str(uuid.uuid4()))
        return tasks

    @staticmethod
    async def add_revision_task(user_id: str, topic_id: str, due_date_category: str = "Today", reason: str = "Added by learner") -> Dict[str, Any]:
        rev_col = get_collection("revision_tasks")
        topics_col = get_collection("topics")
        topic = await topics_col.find_one({"_id": topic_id}) or await topics_col.find_one({"id": topic_id})

        task_id = f"rev-{uuid.uuid4().hex[:8]}"
        task_doc = {
            "_id": str(uuid.uuid4()),
            "id": task_id,
            "userId": user_id,
            "topicId": topic_id,
            "topicName": topic.get("name", topic_id) if topic else topic_id,
            "subjectName": topic.get("subjectName", "General") if topic else "General",
            "riskLevel": topic.get("riskLevel", "Medium") if topic else "Medium",
            "driftProbability": topic.get("driftProbability", 50) if topic else 50,
            "timeMinutes": topic.get("revisionTimeMinutes", 15) if topic else 15,
            "questionsCount": topic.get("recommendedQuestions", 5) if topic else 5,
            "dueDateCategory": due_date_category,
            "dueDateLabel": f"{due_date_category} (User Scheduled)",
            "completed": False,
            "reason": reason,
            "createdAt": datetime.now(timezone.utc).isoformat()
        }
        await rev_col.insert_one(task_doc)
        return task_doc

    @staticmethod
    async def complete_revision_task(user_id: str, task_id: str) -> bool:
        rev_col = get_collection("revision_tasks")
        task = await rev_col.find_one({"$or": [{"_id": task_id}, {"id": task_id}], "userId": user_id})
        if not task:
            return False

        await rev_col.update_one(
            {"$or": [{"_id": task_id}, {"id": task_id}], "userId": user_id},
            {"$set": {"completed": True, "completedAt": datetime.now(timezone.utc).isoformat()}}
        )

        topic_id = task.get("topicId")
        if topic_id:
            progress_col = get_collection("user_topic_progress")
            prog = await progress_col.find_one({"userId": user_id, "topicId": topic_id})
            curr_knowledge = prog.get("knowledge", 65) if prog else 65
            boosted = min(100, curr_knowledge + 14)

            pred = prediction_service.predict_topic_drift(
                topic_id=topic_id,
                current_knowledge=boosted,
                days_since_practice=0,
                accuracy=prog.get("accuracy", 80) if prog else 80,
                repetition_count=(prog.get("repetitionCount", 1) if prog else 1) + 1
            )

            await progress_col.update_one(
                {"userId": user_id, "topicId": topic_id},
                {"$set": {
                    "knowledge": boosted,
                    "lastPracticed": "Just now",
                    "lastPracticedDaysAgo": 0,
                    "driftProbability": pred["driftProbability"],
                    "riskLevel": pred["riskLevel"],
                    "stability": pred["stability"]
                }},
                upsert=True
            )

            activities_col = get_collection("activities")
            await activities_col.insert_one({
                "_id": str(uuid.uuid4()),
                "userId": user_id,
                "title": f"Completed Revision: {task.get('topicName', 'Topic')}",
                "subtitle": f"Spent {task.get('timeMinutes', 15)} mins revising concepts (+14% knowledge boosted)",
                "timestamp": "Just now",
                "type": "revision",
                "iconName": "BookOpen",
                "createdAt": datetime.now(timezone.utc).isoformat()
            })

        return True

    @staticmethod
    async def reschedule_task(user_id: str, task_id: str, new_category: str) -> bool:
        rev_col = get_collection("revision_tasks")
        res = await rev_col.update_one(
            {"$or": [{"_id": task_id}, {"id": task_id}], "userId": user_id},
            {"$set": {"dueDateCategory": new_category, "dueDateLabel": f"{new_category} (Rescheduled)"}}
        )
        return res.matched_count > 0

    @staticmethod
    async def get_user_activities(user_id: str) -> List[Dict[str, Any]]:
        activities_col = get_collection("activities")
        acts = await activities_col.find({"userId": user_id}).sort("createdAt", -1).to_list(20)
        if not acts:
            # Seed welcome activity
            welcome_act = {
                "_id": str(uuid.uuid4()),
                "id": "act-init",
                "userId": user_id,
                "title": "Enrolled in Technical Curriculum",
                "subtitle": "Knowledge retention tracking active",
                "timestamp": "Today",
                "type": "alert",
                "iconName": "Sparkles",
                "createdAt": datetime.now(timezone.utc).isoformat()
            }
            await activities_col.insert_one(welcome_act)
            acts = [welcome_act]
        
        for a in acts:
            if "id" not in a:
                a["id"] = a.get("_id", str(uuid.uuid4()))
        return acts

    @staticmethod
    async def get_dashboard(user_id: str) -> Dict[str, Any]:
        """Aggregates all user-specific data for the dashboard."""
        users_col = get_collection("users")
        user_doc = await users_col.find_one({"_id": user_id})
        if not user_doc:
            raise ValueError("User not found")

        topics = await LearningService.get_all_topics_for_user(user_id)
        subjects = await LearningService.get_all_subjects_for_user(user_id)
        activities = await LearningService.get_user_activities(user_id)

        # Priority topic: highest drift probability topic
        priority_topic = None
        if topics:
            priority_topic = max(topics, key=lambda t: t.get("driftProbability", 0))

        # Dynamic user-tailored analytics
        high_risk_count = sum(1 for t in topics if t.get("riskLevel") in ["Critical", "High"])
        med_risk_count = sum(1 for t in topics if t.get("riskLevel") == "Medium")
        low_risk_count = sum(1 for t in topics if t.get("riskLevel") == "Low")
        total_topics = max(1, len(topics))

        analytics_data = {
            "knowledgeGrowthHistory": [
                {"label": "W1", "overall": max(40, user_doc.get("knowledgeScore", 70) - 14), "java": 70, "sql": 62, "ds": 50, "springboot": 40},
                {"label": "W2", "overall": max(45, user_doc.get("knowledgeScore", 70) - 9), "java": 74, "sql": 68, "ds": 54, "springboot": 42},
                {"label": "W3", "overall": max(50, user_doc.get("knowledgeScore", 70) - 4), "java": 78, "sql": 72, "ds": 59, "springboot": 46},
                {"label": "W4", "overall": user_doc.get("knowledgeScore", 70), "java": 82, "sql": 76, "ds": 64, "springboot": 51}
            ],
            "subjectPerformance": [
                {"name": s.get("name", "Subject"), "score": s.get("knowledge", 70), "target": 80, "color": s.get("color", "#14B8A6")}
                for s in subjects
            ],
            "driftRiskDistribution": [
                {"name": "Low Risk (Stable)", "count": low_risk_count, "percentage": round((low_risk_count / total_topics) * 100), "color": "#10B981"},
                {"name": "Medium Risk", "count": med_risk_count, "percentage": round((med_risk_count / total_topics) * 100), "color": "#38BDF8"},
                {"name": "High Risk", "count": high_risk_count, "percentage": round((high_risk_count / total_topics) * 100), "color": "#F59E0B"}
            ],
            "revisionEffectiveness": [
                {"subject": "HashMap", "before": 54, "after": 72, "gain": 18},
                {"subject": "SQL Joins", "before": 60, "after": 76, "gain": 16},
                {"subject": "ArrayList", "before": 78, "after": 92, "gain": 14},
                {"subject": "Streams API", "before": 70, "after": 84, "gain": 14}
            ],
            "quizAccuracyTrend": [
                {"date": "Day 1", "accuracy": 65},
                {"date": "Day 3", "accuracy": 70},
                {"date": "Day 5", "accuracy": 74},
                {"date": "Day 7", "accuracy": 82}
            ]
        }

        # Build user profile response
        user_profile = {
            "id": user_doc["_id"],
            "name": user_doc.get("name", "Student"),
            "email": user_doc.get("email", ""),
            "role": user_doc.get("role", "Student"),
            "knowledgeScore": user_doc.get("knowledgeScore", 70),
            "retentionRate": user_doc.get("retentionRate", 75),
            "topicsAtRiskCount": high_risk_count,
            "learningStreak": user_doc.get("learningStreak", 1),
            "onboarded": user_doc.get("onboarded", False),
            "preferences": user_doc.get("preferences", {
                "dailyGoalMinutes": 30,
                "experienceLevel": "Intermediate",
                "goal": "Interview preparation",
                "preferredSubjects": ["Java", "SQL"],
                "emailAlerts": True,
                "driftAlerts": True,
                "weeklySummary": True,
                "theme": "light"
            })
        }

        return {
            "user": user_profile,
            "priorityTopic": priority_topic,
            "subjects": subjects,
            "topics": topics,
            "activities": activities,
            "analyticsData": analytics_data
        }
