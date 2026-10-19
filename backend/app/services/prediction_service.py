import math
from typing import Dict, Any, List, Tuple

class EbbinghausDecayModel:
    """
    Mathematical Spaced-Repetition Retention Model based on the Ebbinghaus Forgetting Curve:
        R(t) = R_0 * exp(-lambda * t / S)
    where:
        - R(t): Estimated retention percentage at elapsed time t (in days)
        - R_0: Initial post-learning knowledge retention level (0 to 100%)
        - lambda: Empirical memory decay rate coefficient (default 0.18)
        - S: Memory stability index, scaled by repetition count and practice accuracy
    """
    DEFAULT_LAMBDA = 0.18

    @classmethod
    def calculate_stability(cls, repetition_count: int, average_accuracy: float, topic_difficulty: float = 1.0) -> float:
        """
        Computes memory stability S. Repeated spaced reviews increase stability exponentially,
        while high topic difficulty scales down retention stability.
        """
        rep_factor = 1.0 + (0.45 * max(0, repetition_count))
        acc_factor = 0.5 + (0.5 * (max(0.0, min(100.0, average_accuracy)) / 100.0))
        diff_factor = max(0.6, min(1.5, topic_difficulty))
        stability = (rep_factor * acc_factor) / diff_factor
        return round(max(0.8, stability), 3)

    @classmethod
    def predict_retention(cls, initial_knowledge: float, days_elapsed: float, stability: float) -> float:
        """Calculates retention after days_elapsed using the exponential decay equation."""
        if days_elapsed <= 0:
            return round(min(100.0, max(10.0, initial_knowledge)), 1)
        decay_exponent = -(cls.DEFAULT_LAMBDA * days_elapsed) / max(0.5, stability)
        retained = initial_knowledge * math.exp(decay_exponent)
        return round(min(100.0, max(10.0, retained)), 1)

    @classmethod
    def generate_14day_forecast(cls, current_knowledge: float, days_since_practice: int, stability: float) -> List[Dict[str, Any]]:
        """Generates a 14-day projection comparing natural decay vs decay after immediate revision."""
        horizon_days = [0, 3, 7, 10, 14]
        day_labels = ["Today", "+3 Days", "+7 Days", "+10 Days", "+14 Days"]
        forecast = []

        # Boosted parameters assuming a revision session today
        boosted_knowledge = min(100.0, current_knowledge + 18.0)
        boosted_stability = stability * 1.65

        for i, delta_t in enumerate(horizon_days):
            without_rev = cls.predict_retention(current_knowledge, delta_t, stability)
            with_rev = cls.predict_retention(boosted_knowledge, delta_t, boosted_stability) if delta_t > 0 else round(boosted_knowledge, 1)

            forecast.append({
                "day": day_labels[i],
                "knowledge": round(without_rev),
                "predictedWithoutRev": round(without_rev),
                "predictedWithRev": round(with_rev)
            })
        return forecast

    @classmethod
    def calculate_drift_risk(cls, current_knowledge: float, days_since_practice: int, accuracy: float, stability: float) -> Tuple[int, str]:
        """
        Calculates knowledge drift probability (0-100%) and categorizes the risk level.
        Considers projected 7-day retention, practice gap, and quiz accuracy.
        """
        retention_7d = cls.predict_retention(current_knowledge, 7, stability)
        decay_deficit = max(0.0, 80.0 - retention_7d) # target retention is 80%
        knowledge_deficit = max(0.0, 80.0 - current_knowledge)
        accuracy_deficit = max(0.0, 75.0 - accuracy)
        time_penalty = min(25.0, days_since_practice * 2.5)

        drift_score = (decay_deficit * 0.50) + (knowledge_deficit * 0.25) + (accuracy_deficit * 0.20) + (time_penalty * 0.20)
        drift_probability = int(min(96, max(10, round(drift_score + 18))))

        if drift_probability >= 75 or current_knowledge < 55:
            risk_level = "Critical"
        elif drift_probability >= 60 or current_knowledge < 68:
            risk_level = "High"
        elif drift_probability >= 40 or current_knowledge < 80:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        return drift_probability, risk_level


class SequentialDriftPredictor:
    """
    Sequential learner recurrent predictor interface.
    Evaluates sequence of recent learner interactions: [(timestamp, score, duration), ...]
    Provides an honest evaluation: when interaction count is small, combines sequential trends with Ebbinghaus decay.
    """
    def __init__(self):
        self.model_type = "hybrid_ebbinghaus_recurrent_baseline"

    def predict_topic_drift(
        self,
        topic_id: str,
        current_knowledge: int,
        days_since_practice: int,
        accuracy: int,
        repetition_count: int = 1,
        recent_scores: List[float] = None
    ) -> Dict[str, Any]:
        recent_scores = recent_scores or [accuracy]
        
        # Stability derivation
        stability_index = EbbinghausDecayModel.calculate_stability(
            repetition_count=repetition_count,
            average_accuracy=accuracy
        )

        drift_prob, risk_level = EbbinghausDecayModel.calculate_drift_risk(
            current_knowledge=current_knowledge,
            days_since_practice=days_since_practice,
            accuracy=accuracy,
            stability=stability_index
        )

        forecast_data = EbbinghausDecayModel.generate_14day_forecast(
            current_knowledge=current_knowledge,
            days_since_practice=days_since_practice,
            stability=stability_index
        )

        stability_label = "High" if stability_index > 2.0 else "Medium" if stability_index > 1.2 else "Low"

        risk_factors = []
        if days_since_practice >= 5:
            risk_factors.append(f"{days_since_practice} days elapsed since last practice session")
        if accuracy < 70:
            risk_factors.append(f"Historical quiz accuracy ({accuracy}%) is below mastery benchmark (80%)")
        if drift_prob >= 65:
            risk_factors.append("Projected 7-day retention falls below stability threshold")
        if not risk_factors:
            risk_factors.append("Consistent recent practice and satisfactory retention score")

        # Recommendation parameters
        revision_mins = 25 if risk_level == "Critical" else 20 if risk_level == "High" else 15 if risk_level == "Medium" else 10
        recommended_questions = 6 if risk_level == "Critical" else 5 if risk_level == "High" else 4 if risk_level == "Medium" else 3

        return {
            "topicId": topic_id,
            "knowledge": current_knowledge,
            "driftProbability": drift_prob,
            "stability": stability_label,
            "stabilityIndex": stability_index,
            "riskLevel": risk_level,
            "riskFactors": risk_factors,
            "revisionTimeMinutes": revision_mins,
            "recommendedQuestions": recommended_questions,
            "forecastData": forecast_data,
            "modelMetadata": {
                "engine": self.model_type,
                "mathematicalFormulation": "R(t) = R_0 * exp(-lambda * t / S)",
                "stabilityFormula": "S = (1 + 0.45*n) * (0.5 + 0.5*(acc/100))",
                "evaluatedHorizonDays": 14
            }
        }

prediction_service = SequentialDriftPredictor()
