import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
import uuid

@pytest.mark.asyncio
async def test_complete_learning_journey():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Register user
        user_email = f"learner_{uuid.uuid4().hex[:6]}@keeplearning.io"
        reg = await client.post("/api/auth/register", json={
            "full_name": "Full Journey Learner",
            "email": user_email,
            "password": "LearnerPassword2026!"
        })
        assert reg.status_code == 201
        token = reg.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Fetch Subjects
        sub_resp = await client.get("/api/subjects", headers=headers)
        assert sub_resp.status_code == 200
        subjects = sub_resp.json()
        assert len(subjects) >= 4
        assert any(s["id"] == "ds" for s in subjects)

        # 2. Fetch Topics
        top_resp = await client.get("/api/topics", headers=headers)
        assert top_resp.status_code == 200
        topics = top_resp.json()
        assert len(topics) >= 5
        hashmap_topic = next(t for t in topics if t["id"] == "hashmap")
        assert "forecastData" in hashmap_topic
        initial_knowledge = hashmap_topic["knowledge"]

        # 3. Fetch Quiz for topic (Verify correct answers are masked)
        quiz_resp = await client.get("/api/quizzes/hashmap", headers=headers)
        assert quiz_resp.status_code == 200
        quiz_data = quiz_resp.json()
        assert quiz_data["topicId"] == "hashmap"
        for q in quiz_data["questions"]:
            assert "correctAnswer" not in q
            assert "explanation" not in q

        # 4. Submit Quiz with answers
        # hashmap correct answers: q1:1, q2:2, q3:1, q4:2, q5:1
        submit_resp = await client.post(
            "/api/quizzes/hashmap/submit",
            headers=headers,
            json={"answers": {"q1": 1, "q2": 2, "q3": 1, "q4": 0, "q5": 1}} # 4 out of 5 correct = 80%
        )
        assert submit_resp.status_code == 200
        result = submit_resp.json()
        assert result["score"] == 80
        assert result["correctCount"] == 4
        assert result["totalQuestions"] == 5
        assert result["afterKnowledge"] >= initial_knowledge
        assert "aiInsight" in result
        assert len(result["questionResults"]) == 5

        # 5. Verify revision tasks list & complete a task
        rev_resp = await client.get("/api/revision-plan", headers=headers)
        assert rev_resp.status_code == 200
        tasks = rev_resp.json()
        assert len(tasks) > 0
        first_task = tasks[0]

        complete_resp = await client.post(f"/api/revision-plan/{first_task['id']}/complete", headers=headers)
        assert complete_resp.status_code == 200

        # 6. Verify dashboard reflects recent activity
        dash_resp = await client.get("/api/dashboard", headers=headers)
        assert dash_resp.status_code == 200
        dash = dash_resp.json()
        assert len(dash["activities"]) >= 2 # quiz + revision
        assert any("Completed HashMap" in a["title"] for a in dash["activities"])
