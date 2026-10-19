import httpx
import uuid
import sys

def run_live_verification():
    print("==================================================================")
    print("keepLearning - REAL-TIME LIVE FULL-STACK END-TO-END VERIFICATION")
    print("==================================================================")

    base_api = "http://127.0.0.1:8000/api"
    frontend_url = "http://127.0.0.1:5173"

    with httpx.Client(timeout=10.0) as client:
        # 1. Verify Frontend Vite Server is serving
        print("\n[Step 1] Testing Vite Frontend Server...")
        try:
            fe_resp = client.get(frontend_url)
            assert fe_resp.status_code == 200, f"Frontend returned {fe_resp.status_code}"
            assert "keeplearning" in fe_resp.text.lower() or "vite" in fe_resp.text.lower()
            print("  --> [SUCCESS] Frontend web application is live and serving HTTP 200 at", frontend_url)
        except Exception as e:
            print("  --> [FAIL] Could not connect to Frontend:", e)
            sys.exit(1)

        # 2. Verify Backend FastAPI Server Health
        print("\n[Step 2] Testing FastAPI Backend Health Endpoint...")
        try:
            health_resp = client.get(f"{base_api}/health")
            assert health_resp.status_code == 200, f"Backend returned {health_resp.status_code}"
            health_json = health_resp.json()
            print("  --> [SUCCESS] Backend is healthy:", health_json)
        except Exception as e:
            print("  --> [FAIL] Could not connect to Backend:", e)
            sys.exit(1)

        # 3. Create Account 1: Devika
        print("\n[Step 3] Registering Account 1: Devika S (devika@keeplearning.io)...")
        devika_email = f"devika_{uuid.uuid4().hex[:6]}@keeplearning.io"
        devika_reg = client.post(f"{base_api}/auth/register", json={
            "full_name": "Devika S",
            "email": devika_email,
            "password": "Password123!"
        })
        assert devika_reg.status_code == 201, f"Devika registration failed: {devika_reg.text}"
        devika_data = devika_reg.json()
        devika_token = devika_data["access_token"]
        devika_headers = {"Authorization": f"Bearer {devika_token}"}
        print(f"  --> [SUCCESS] Devika registered with user ID: {devika_data['user']['id']}")

        # 4. Devika submits Onboarding
        print("\n[Step 4] Devika completes 4-Step Onboarding...")
        onboard_resp = client.post(f"{base_api}/profile/onboarding", headers=devika_headers, json={
            "subjects": ["Java", "Data Structures"],
            "level": "Intermediate",
            "goal": "Technical Interview Preparation",
            "dailyTime": "30"
        })
        assert onboard_resp.status_code == 200
        print("  --> [SUCCESS] Devika's onboarding preferences persisted on backend.")

        # 5. Devika inspects Topics
        print("\n[Step 5] Devika retrieves technical curriculum topics...")
        topics_resp = client.get(f"{base_api}/topics", headers=devika_headers)
        assert topics_resp.status_code == 200
        devika_topics = topics_resp.json()
        assert len(devika_topics) >= 5
        hashmap_t = next(t for t in devika_topics if t["id"] == "hashmap")
        print(f"  --> [SUCCESS] Retrieved {len(devika_topics)} topics. Initial HashMap knowledge: {hashmap_t['knowledge']}%, Drift Risk: {hashmap_t['driftProbability']}%")

        # 6. Devika takes HashMap Practice Quiz
        print("\n[Step 6] Devika takes and submits HashMap Practice Quiz...")
        # Answers: q1:1, q2:2, q3:1, q4:2, q5:1 (All correct = 100%)
        quiz_submit_resp = client.post(f"{base_api}/quizzes/hashmap/submit", headers=devika_headers, json={
            "answers": {"q1": 1, "q2": 2, "q3": 1, "q4": 2, "q5": 1}
        })
        assert quiz_submit_resp.status_code == 200
        quiz_res = quiz_submit_resp.json()
        print(f"  --> [SUCCESS] Quiz evaluated: Score {quiz_res['score']}%, Knowledge: {quiz_res['beforeKnowledge']}% -> {quiz_res['afterKnowledge']}% (+{quiz_res['knowledgeDiff']}%)")
        print(f"      AI Insight: \"{quiz_res['aiInsight']}\"")

        # 7. Devika adds topic to Revision Plan & completes revision task
        print("\n[Step 7] Devika manages Spaced Repetition tasks...")
        add_rev_resp = client.post(f"{base_api}/revision-plan/add", headers=devika_headers, json={
            "topicId": "hashmap",
            "dueDateCategory": "Today",
            "reason": "Devika's private spaced repetition session"
        })
        assert add_rev_resp.status_code == 200
        devika_task_id = add_rev_resp.json()["task"]["id"]

        comp_resp = client.post(f"{base_api}/revision-plan/{devika_task_id}/complete", headers=devika_headers)
        assert comp_resp.status_code == 200
        print("  --> [SUCCESS] Devika marked revision task as completed.")

        # 8. Check Devika's Dashboard
        print("\n[Step 8] Checking Devika's Dashboard Metrics...")
        devika_dash = client.get(f"{base_api}/dashboard", headers=devika_headers).json()
        print(f"  --> [SUCCESS] Devika's Name: {devika_dash['user']['name']}, Knowledge Score: {devika_dash['user']['knowledgeScore']}%, Activities Count: {len(devika_dash['activities'])}")

        # 9. Create Account 2: Mugunthan M
        print("\n[Step 9] Registering Account 2: Mugunthan M (mugunthan@keeplearning.io)...")
        mugunthan_email = f"mugunthan_{uuid.uuid4().hex[:6]}@keeplearning.io"
        mugunthan_reg = client.post(f"{base_api}/auth/register", json={
            "full_name": "Mugunthan M",
            "email": mugunthan_email,
            "password": "Password123!"
        })
        assert mugunthan_reg.status_code == 201
        mugunthan_data = mugunthan_reg.json()
        mugunthan_token = mugunthan_data["access_token"]
        mugunthan_headers = {"Authorization": f"Bearer {mugunthan_token}"}
        print(f"  --> [SUCCESS] Mugunthan registered with user ID: {mugunthan_data['user']['id']}")

        # 10. CRITICAL CHECK: Verify Mugunthan starts fresh and cannot see Devika's data
        print("\n[Step 10] CRITICAL: Verifying Complete Cross-User Data Isolation...")
        mugunthan_dash = client.get(f"{base_api}/dashboard", headers=mugunthan_headers).json()
        mugunthan_quiz_history = client.get(f"{base_api}/quizzes/history/me", headers=mugunthan_headers).json()
        mugunthan_rev_tasks = client.get(f"{base_api}/revision-plan", headers=mugunthan_headers).json()

        assert mugunthan_dash["user"]["name"] == "Mugunthan M"
        assert mugunthan_dash["user"]["email"] == mugunthan_email
        assert len(mugunthan_quiz_history) == 0, f"Mugunthan unexpectedly inherited quiz history! {mugunthan_quiz_history}"
        assert not any(t.get("reason") == "Devika's private spaced repetition session" for t in mugunthan_rev_tasks), "Mugunthan saw Devika's private revision task!"
        print("  --> [SUCCESS] Mugunthan's dashboard is completely isolated: 0 quiz attempts, zero cross-user pollution.")

        # 11. Security Test: Mugunthan attempts to modify Devika's revision task
        print("\n[Step 11] Security Authorization Enforcement Check...")
        hack_resp = client.post(f"{base_api}/revision-plan/{devika_task_id}/complete", headers=mugunthan_headers)
        assert hack_resp.status_code in [404, 401, 403], f"Security failure: Mugunthan was able to complete Devika's task! Status {hack_resp.status_code}"
        print(f"  --> [SUCCESS] Server correctly rejected unauthorized cross-user operation with status {hack_resp.status_code}.")

        print("\n==================================================================")
        print(">>> ALL LIVE END-TO-END VERIFICATION CHECKS PASSED WITH 100% SUCCESS! <<<")
        print("==================================================================")

if __name__ == "__main__":
    run_live_verification()
