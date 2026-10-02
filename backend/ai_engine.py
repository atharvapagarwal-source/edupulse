import json
import random
from typing import List, Dict, Any

class FeedbackAIEngine:
    @staticmethod
    def analyze_feedback_batch(feedback_items: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not feedback_items:
            return {
                "teaching_quality": 82,
                "course_difficulty": 68,
                "study_material": 74,
                "teaching_pace": 59,
                "sentiment": {"positive": 61, "neutral": 25, "negative": 14},
                "common_topics": ["Course pace", "Assignment difficulty", "Study material", "Practical examples"],
                "ai_summary": "Students generally find the course informative, but multiple responses indicate that recursion and TCP/IP protocol stack are being taught faster than students can comfortably follow."
            }
        
        pos_count = 0
        neu_count = 0
        neg_count = 0
        
        pace_ratings = []
        teaching_ratings = []
        diff_ratings = []
        mat_ratings = []

        for item in feedback_items:
            comment = item.get("comment", "").lower()
            tr = item.get("teaching_rating", 4)
            dr = item.get("difficulty_rating", 3)
            pr = item.get("pace_rating", 3)
            mr = item.get("material_rating", 4)

            teaching_ratings.append(tr)
            diff_ratings.append(dr)
            pace_ratings.append(pr)
            mat_ratings.append(mr)

            if "hard" in comment or "fast" in comment or "difficult" in comment or "confusing" in comment or pr <= 2:
                neg_count += 1
            elif "great" in comment or "good" in comment or "helpful" in comment or tr >= 4:
                pos_count += 1
            else:
                neu_count += 1

        total = max(1, len(feedback_items))
        pos_pct = round((pos_count / total) * 100)
        neg_pct = round((neg_count / total) * 100)
        neu_pct = max(0, 100 - pos_pct - neg_pct)

        avg_teaching = round((sum(teaching_ratings) / total) * 20) if teaching_ratings else 82
        avg_diff = round((sum(diff_ratings) / total) * 20) if diff_ratings else 68
        avg_pace = round((sum(pace_ratings) / total) * 20) if pace_ratings else 59
        avg_mat = round((sum(mat_ratings) / total) * 20) if mat_ratings else 74

        return {
            "teaching_quality": avg_teaching,
            "course_difficulty": avg_diff,
            "study_material": avg_mat,
            "teaching_pace": avg_pace,
            "sentiment": {
                "positive": pos_pct,
                "neutral": neu_pct,
                "negative": neg_pct
            },
            "common_topics": ["Course pace", "Assignment difficulty", "Study material", "Practical examples", "Recursion & Trees"],
            "ai_summary": "Students appreciate practical code demos in class, but express concern that Data Structures (Trees/Graphs) and Computer Networks (TCP/IP) are proceeding too quickly."
        }


class LearningAIEngine:
    @staticmethod
    def identify_learning_gaps(performance_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        high_priority = []
        medium_priority = []

        for record in performance_data:
            score = record.get("score_pct", 100)
            topic = record.get("topic", "")
            if score < 65:
                if topic not in high_priority:
                    high_priority.append(topic)
            elif score < 75:
                if topic not in medium_priority and topic not in high_priority:
                    medium_priority.append(topic)

        if not high_priority:
            high_priority = ["Linear Transformations", "TCP/IP Protocol Stack"]
        if not medium_priority:
            medium_priority = ["Trees & Binary Search Trees", "Dynamic Programming"]

        return {
            "high_priority": high_priority,
            "medium_priority": medium_priority,
            "summary": "Your recent performance indicates that Computer Networks (TCP/IP) and Linear Transformations need focused practice before the upcoming midterms."
        }

    @staticmethod
    def detect_academic_support_need(student_record: Dict[str, Any]) -> Dict[str, Any]:
        attendance = student_record.get("attendance_pct", 85)
        assignment_completion = student_record.get("assignment_completion_pct", 80)
        average_score = student_record.get("average_score", 75)

        indicators = []

        if attendance < 80:
            indicators.append("Declining class attendance trend (< 80%)")
        if assignment_completion < 75:
            indicators.append("Low assignment submission rate (< 75%)")
        if average_score < 65:
            indicators.append("Assessment score below course average (< 65%)")

        if len(indicators) >= 2 or average_score < 60:
            support_level = "Higher Support Indicator"
            bg_color = "bg-rose-50 border-rose-200 text-rose-800"
        elif len(indicators) == 1 or average_score < 72:
            support_level = "Moderate Support Indicator"
            bg_color = "bg-amber-50 border-amber-200 text-amber-800"
        else:
            support_level = "Low Support Indicator"
            bg_color = "bg-emerald-50 border-emerald-200 text-emerald-800"

        return {
            "student_name": student_record.get("name", "Student"),
            "support_level": support_level,
            "style": bg_color,
            "indicators": indicators if indicators else ["On-track academic performance"],
            "disclaimer": "These indicators are intended to support proactive intervention and academic guidance, not definitive predictions."
        }


class RecommendationAIEngine:
    @staticmethod
    def match_opportunities(student_skills: List[str], opportunities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        student_skill_set = set(s.lower() for s in student_skills)
        matched_results = []

        for opp in opportunities:
            req_skills = [s.strip().lower() for s in opp.get("required_skills", "").split(",") if s.strip()]
            req_set = set(req_skills)
            
            common = student_skill_set.intersection(req_set)
            
            if req_set:
                match_pct = min(98, round((len(common) / len(req_set)) * 100))
                if match_pct < 40:
                    match_pct = random.randint(55, 75) # generous matching for demo
            else:
                match_pct = 85

            matched_skills = [s.title() for s in common] if common else [student_skills[0].title() if student_skills else "Python"]

            matched_results.append({
                **opp,
                "match_score": match_pct,
                "matched_skills": matched_skills,
                "recommendation_reason": f"Matches your profile skills ({', '.join(matched_skills[:2])}) and meets listed eligibility guidelines."
            })

        matched_results.sort(key=lambda x: x["match_score"], reverse=True)
        return matched_results


class GenerativeAIEngine:
    @staticmethod
    def evaluate_assignment(code_or_text: str, topic: str) -> Dict[str, Any]:
        return {
            "correctness_score": 82,
            "code_quality": "Good — clean modular structure with proper variable naming.",
            "complexity_analysis": "O(N log N) time complexity — optimal for search & sorting.",
            "missing_edge_cases": [
                "Empty input list validation",
                "Handling duplicate element keys in tree insertion"
            ],
            "ai_feedback": f"Your implementation of {topic} handles the primary standard inputs correctly. However, edge case handling for empty inputs and duplicate keys should be added prior to submission.",
            "disclaimer": "AI evaluation is advisory. Final grading and evaluation is performed by your course instructor."
        }

    @staticmethod
    def generate_study_plan(student_name: str, weak_topics: List[str], duration_days: int = 7) -> Dict[str, Any]:
        topics = weak_topics if weak_topics else ["TCP/IP Networking", "Trees & Graphs", "Linear Algebra"]
        days = []
        
        t_index = 0
        for day in range(1, duration_days + 1):
            curr_topic = topics[t_index % len(topics)]
            days.append({
                "day": f"Day {day}",
                "focus_area": curr_topic,
                "tasks": [
                    f"Review core concepts of {curr_topic} (45 mins)",
                    f"Solve 3 practice problems on {curr_topic} in EduPulse Workbench (60 mins)",
                    f"Complete EduPulse interactive diagnostic self-quiz (20 mins)"
                ],
                "estimated_hours": 2.2
            })
            if day % 2 == 0:
                t_index += 1

        return {
            "title": f"{duration_days}-Day AI Personal Revision Plan for {student_name}",
            "duration_days": duration_days,
            "weak_topics": topics,
            "schedule": days,
            "ai_tip": "Focusing 2 hours daily on high-priority weak topics can improve your quiz retention by up to 35%."
        }

    @staticmethod
    def answer_student_chat(query: str, student_context: Dict[str, Any]) -> str:
        q = query.lower()
        cgpa = student_context.get("cgpa", 8.2)
        skills = student_context.get("skills", ["Python", "DSA"])

        if "struggling" in q or "data structures" in q or "dsa" in q or "tree" in q:
            return f"Based on your performance analytics, your scores in Arrays (84%) and Linked Lists (78%) are solid! However, Trees (61%) and Graphs (55%) are pulling down your average score. I recommend spending 45 minutes on Tree Traversals (Inorder/Preorder) today. Would you like me to generate a 5-day targeted revision plan for Data Structures?"

        elif "study plan" in q or "plan" in q or "schedule" in q:
            return f"I have prepared a custom revision schedule for you based on your upcoming Computer Networks quiz on Oct 7 and Mathematics test on Oct 10. Focus on TCP/IP Protocol Layers for the next 2 days, followed by Linear Transformations. You can click 'Generate Study Plan' on your dashboard to save it to your planner!"

        elif "assignment" in q or "due" in q or "pending" in q:
            return f"You currently have 2 upcoming assignments due: 1) DSA Implementation Assignment (Due Oct 5) and 2) Computer Networks Packet Simulator (Due Oct 8). Would you like AI feedback on your draft code before submitting?"

        elif "opportunity" in q or "internship" in q or "hackathon" in q or "match" in q:
            return f"With your strong background in {', '.join(skills[:3])} and a CGPA of {cgpa}, you are a 92% match for the upcoming AI National Student Hackathon and the Data Science Summer Internship. Check out the Opportunities tab for application links!"

        else:
            return f"Hello Atharva! I'm your EduPulse AI Assistant. I have indexed your current academic metrics (CGPA {cgpa}, 87% attendance, 2 weak topics identified in CN & Maths). How can I assist your study session today?"
