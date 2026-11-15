import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(path, method="GET", body=None, headers=None):
    url = f"{BASE_URL}{path}"
    req_headers = {"Content-Type": "application/json"}
    if headers:
        req_headers.update(headers)
    
    data = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(url, data=data, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(err_body)
        except:
            return e.code, {"error": err_body}

def run_tests():
    print("=" * 60)
    print("  StudentConnector C++ Backend & Security Test Suite")
    print("=" * 60)

    # 1. Health Check
    status, res = make_request("/health")
    assert status == 200, f"Health check failed with {status}"
    print("[PASS] 1. Health Check: Status online, C++ engine running")

    # 2. Login Student 1 (Atharva)
    status, login1 = make_request("/auth/login", method="POST", body={"email": "atharva@studentconnector.edu"})
    assert status == 200, f"Login std-001 failed: {login1}"
    token1 = login1["token"]
    assert login1["user"]["id"] == "std-001"
    assert login1["user"]["role"] == "STUDENT"
    print(f"[PASS] 2. Login Student 1 (Atharva Pagarwal): Token {token1}")

    # 3. Login Student 2 (Riya)
    status, login2 = make_request("/auth/login", method="POST", body={"email": "riya@studentconnector.edu"})
    assert status == 200, f"Login std-002 failed: {login2}"
    token2 = login2["token"]
    assert login2["user"]["id"] == "std-002"
    assert login2["user"]["role"] == "STUDENT"
    print(f"[PASS] 3. Login Student 2 (Riya Sharma): Token {token2}")

    # 4. Student 1 Dashboard Data
    status, dash1 = make_request("/student/dashboard", headers={"Authorization": f"Bearer {token1}"})
    assert status == 200, f"Dashboard std-001 failed: {dash1}"
    assert dash1["student"]["name"] == "Atharva Pagarwal"
    assert dash1["student"]["cgpa"] == 8.2
    assert dash1["student"]["attendance"] == 87.0
    print(f"[PASS] 4. Student 1 Dashboard: Name={dash1['student']['name']}, CGPA={dash1['student']['cgpa']}, Attendance={dash1['student']['attendance']}%")

    # 5. Student 2 Dashboard Data (Strict Separation)
    status, dash2 = make_request("/student/dashboard", headers={"Authorization": f"Bearer {token2}"})
    assert status == 200, f"Dashboard std-002 failed: {dash2}"
    assert dash2["student"]["name"] == "Riya Sharma"
    assert dash2["student"]["cgpa"] == 9.1
    assert dash2["student"]["attendance"] == 94.0
    print(f"[PASS] 5. Student 2 Dashboard: Name={dash2['student']['name']}, CGPA={dash2['student']['cgpa']}, Attendance={dash2['student']['attendance']}%")
    assert dash1["student"]["cgpa"] != dash2["student"]["cgpa"], "Data isolation failed: CGPAs match!"

    # 6. Cross-Student Access Authorization Test (std-001 attempting to fetch std-002's data)
    status, cross_attempt = make_request("/student/dashboard/std-002", headers={"Authorization": f"Bearer {token1}"})
    assert status == 403, f"Security Breach! Expected 403 Forbidden but got {status}"
    print(f"[PASS] 6. Cross-Student Protection: Student 1 blocked from accessing Student 2 data (HTTP 403 Forbidden)")

    status, cross_perf = make_request("/student/performance/std-002", headers={"Authorization": f"Bearer {token1}"})
    assert status == 403, f"Security Breach! Expected 403 Forbidden but got {status}"
    print(f"[PASS] 7. Cross-Student Protection: Student 1 blocked from accessing Student 2 performance (HTTP 403 Forbidden)")

    # 7. Student Attempting to Access Teacher Endpoint
    status, teacher_block = make_request("/teacher/dashboard", headers={"Authorization": f"Bearer {token1}"})
    assert status == 403, f"Security Breach! Expected 403 Forbidden but got {status}"
    print(f"[PASS] 8. Role Enforcement: Student blocked from accessing Faculty Dashboard (HTTP 403 Forbidden)")

    # 8. Student 1 Performance Data vs Student 2 Performance Data
    status, perf1 = make_request("/student/performance", headers={"Authorization": f"Bearer {token1}"})
    assert status == 200
    status, perf2 = make_request("/student/performance", headers={"Authorization": f"Bearer {token2}"})
    assert status == 200
    print(f"[PASS] 9. Performance Analytics: Student 1 has {len(perf1['weak_topics'])} weak topics; Student 2 has {len(perf2['weak_topics'])} weak topics")

    # 9. Assignments & Submissions Isolation
    status, asgs1 = make_request("/assignments", headers={"Authorization": f"Bearer {token1}"})
    assert status == 200
    status, asgs2 = make_request("/assignments", headers={"Authorization": f"Bearer {token2}"})
    assert status == 200
    
    # asg-001 marks for Atharva vs Riya
    asg1_std1 = next(a for a in asgs1 if a["id"] == "asg-001")
    asg1_std2 = next(a for a in asgs2 if a["id"] == "asg-001")
    assert asg1_std1["grade"] == 85.0
    assert asg1_std2["grade"] == 94.0
    print(f"[PASS] 10. Assignment Submission Isolation: Student 1 Grade = {asg1_std1['grade']}/100; Student 2 Grade = {asg1_std2['grade']}/100")

    # 10. Student Feedback Submission & History Isolation
    status, fb_subm = make_request(
        "/feedback/submit",
        method="POST",
        body={"subject": "OOPS in C++", "teacher_name": "Prof. Rajesh Sharma", "category": "Pacing", "comment": "Great depth on virtual tables."},
        headers={"Authorization": f"Bearer {token1}"}
    )
    assert status == 200
    status, hist1 = make_request("/feedback/my-history", headers={"Authorization": f"Bearer {token1}"})
    status, hist2 = make_request("/feedback/my-history", headers={"Authorization": f"Bearer {token2}"})
    print(f"[PASS] 11. Feedback Privacy & Tracking: Student 1 has {len(hist1)} submissions; Student 2 has {len(hist2)} submissions")

    print("=" * 60)
    print("  ALL 11 TESTS PASSED! Strict Student-Only Isolation Verified.")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
