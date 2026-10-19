import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
import uuid

@pytest.mark.asyncio
async def test_cross_user_data_isolation():
    """
    CRITICAL TEST: Verifies that Account A's learning progress, quiz attempts,
    revision tasks, and activities are strictly isolated from Account B.
    Account B must start fresh and cannot modify or access Account A's records.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create Account A (Alice)
        alice_email = f"alice_{uuid.uuid4().hex[:6]}@keeplearning.io"
        alice_reg = await client.post("/api/auth/register", json={
            "full_name": "Alice Developer",
            "email": alice_email,
            "password": "AliceSecretPassword123!"
        })
        assert alice_reg.status_code == 201
        alice_token = alice_reg.json()["access_token"]
        alice_headers = {"Authorization": f"Bearer {alice_token}"}

        # Create Account B (Bob)
        bob_email = f"bob_{uuid.uuid4().hex[:6]}@keeplearning.io"
        bob_reg = await client.post("/api/auth/register", json={
            "full_name": "Bob Learner",
            "email": bob_email,
            "password": "BobSecretPassword123!"
        })
        assert bob_reg.status_code == 201
        bob_token = bob_reg.json()["access_token"]
        bob_headers = {"Authorization": f"Bearer {bob_token}"}

        # 1. Alice adds a custom revision task
        alice_task_resp = await client.post(
            "/api/revision-plan/add",
            headers=alice_headers,
            json={"topicId": "hashmap", "dueDateCategory": "Today", "reason": "Alice private revision task"}
        )
        assert alice_task_resp.status_code == 200
        alice_task_id = alice_task_resp.json()["task"]["id"]

        # 2. Bob lists revision tasks: must NOT contain Alice's private task
        bob_tasks_resp = await client.get("/api/revision-plan", headers=bob_headers)
        assert bob_tasks_resp.status_code == 200
        bob_tasks = bob_tasks_resp.json()
        assert not any(t.get("reason") == "Alice private revision task" for t in bob_tasks)

        # 3. Bob attempts to complete Alice's task (must be rejected!)
        bob_hack_attempt = await client.post(
            f"/api/revision-plan/{alice_task_id}/complete",
            headers=bob_headers
        )
        assert bob_hack_attempt.status_code in [404, 401, 403]

        # 4. Alice submits a quiz on hashmap with 100% score
        alice_quiz_submit = await client.post(
            "/api/quizzes/hashmap/submit",
            headers=alice_headers,
            json={"answers": {"q1": 1, "q2": 2, "q3": 1, "q4": 2, "q5": 1}}
        )
        assert alice_quiz_submit.status_code == 200
        alice_quiz_data = alice_quiz_submit.json()
        assert alice_quiz_data["score"] == 100
        alice_after_knowledge = alice_quiz_data["afterKnowledge"]

        # 5. Check Bob's quiz history: must have 0 attempts
        bob_history_resp = await client.get("/api/quizzes/history/me", headers=bob_headers)
        assert bob_history_resp.status_code == 200
        bob_history = bob_history_resp.json()
        assert len(bob_history) == 0

        # 6. Check Alice's quiz history: contains her attempt
        alice_history_resp = await client.get("/api/quizzes/history/me", headers=alice_headers)
        assert alice_history_resp.status_code == 200
        alice_history = alice_history_resp.json()
        assert len(alice_history) == 1
        assert alice_history[0]["score"] == 100

        # 7. Check Alice's Dashboard vs Bob's Dashboard
        alice_dash = (await client.get("/api/dashboard", headers=alice_headers)).json()
        bob_dash = (await client.get("/api/dashboard", headers=bob_headers)).json()

        assert alice_dash["user"]["name"] == "Alice Developer"
        assert bob_dash["user"]["name"] == "Bob Learner"
        assert alice_dash["user"]["email"] == alice_email
        assert bob_dash["user"]["email"] == bob_email

        # Alice's hashmap topic has updated knowledge
        alice_hashmap = next(t for t in alice_dash["topics"] if t["id"] == "hashmap")
        assert alice_hashmap["knowledge"] == alice_after_knowledge
