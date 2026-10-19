import pytest
from app.services.prediction_service import EbbinghausDecayModel, prediction_service

def test_ebbinghaus_decay_properties():
    # Day 0 retention should equal initial knowledge
    r0 = EbbinghausDecayModel.predict_retention(initial_knowledge=80.0, days_elapsed=0, stability=1.5)
    assert r0 == 80.0

    # Retention should decrease monotonically as elapsed days increase
    r3 = EbbinghausDecayModel.predict_retention(initial_knowledge=80.0, days_elapsed=3, stability=1.5)
    r7 = EbbinghausDecayModel.predict_retention(initial_knowledge=80.0, days_elapsed=7, stability=1.5)
    r14 = EbbinghausDecayModel.predict_retention(initial_knowledge=80.0, days_elapsed=14, stability=1.5)

    assert r0 > r3 > r7 > r14

def test_stability_scaling():
    # Higher repetition count must increase stability
    s1 = EbbinghausDecayModel.calculate_stability(repetition_count=1, average_accuracy=80)
    s4 = EbbinghausDecayModel.calculate_stability(repetition_count=4, average_accuracy=80)
    assert s4 > s1

    # Higher accuracy must increase stability
    s_low_acc = EbbinghausDecayModel.calculate_stability(repetition_count=2, average_accuracy=50)
    s_high_acc = EbbinghausDecayModel.calculate_stability(repetition_count=2, average_accuracy=95)
    assert s_high_acc > s_low_acc

def test_14day_forecast_curve():
    forecast = EbbinghausDecayModel.generate_14day_forecast(
        current_knowledge=70.0,
        days_since_practice=4,
        stability=1.2
    )
    assert len(forecast) == 5
    for point in forecast:
        assert "predictedWithoutRev" in point
        assert "predictedWithRev" in point
        # Knowledge with revision must be higher than without revision
        assert point["predictedWithRev"] >= point["predictedWithoutRev"]

def test_drift_probability_and_risk_levels():
    # High practice gap and low accuracy -> Critical or High risk
    prob_high, level_high = EbbinghausDecayModel.calculate_drift_risk(
        current_knowledge=45,
        days_since_practice=10,
        accuracy=48,
        stability=0.8
    )
    assert level_high in ["Critical", "High"]
    assert prob_high >= 65

    # Recent practice and high accuracy -> Low risk
    prob_low, level_low = EbbinghausDecayModel.calculate_drift_risk(
        current_knowledge=90,
        days_since_practice=1,
        accuracy=94,
        stability=3.0
    )
    assert level_low == "Low"
    assert prob_low <= 40
