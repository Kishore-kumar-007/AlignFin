import pytest
from backend.app.database.db import init_db, get_all_products, get_product_by_id
from backend.app.models.user import UserProfile
from backend.app.database.seed_data import DEMO_PERSONAS
from backend.app.engine.risk_engine import RiskCapacityEngine
from backend.app.engine.suitability_engine import SuitabilityEngine

@pytest.fixture(autouse=True)
def setup_database():
    init_db()

def test_database_seeding():
    products = get_all_products()
    assert len(products) >= 28
    
    loans = get_all_products(category="loan")
    investments = get_all_products(category="investment")
    savings = get_all_products(category="savings")
    
    assert len(loans) >= 10
    assert len(investments) >= 8
    assert len(savings) >= 6

def test_scenario_1_loan_headline_trap():
    """
    Killer Demo Scenario 1:
    Rohan (36-month horizon, ₹2,00,000 loan)
    Loan A (Prime Advantage): 8.5% rate, ₹8,000 fee, 4.5% prepay penalty, 7-year tenure
    Loan B (Flexi-Term): 9.2% rate, ₹2,000 fee, 0% prepay penalty, 3-year tenure
    
    Expected: Loan B MUST outscore Loan A despite higher advertised headline rate.
    """
    rohan_profile_data = DEMO_PERSONAS[0]["profile"]
    rohan_profile = UserProfile(**rohan_profile_data)
    
    results = SuitabilityEngine.evaluate_products_for_profile(rohan_profile)
    
    loan_a_res = next(r for r in results if r.product.id == "loan-headline-bait")
    loan_b_res = next(r for r in results if r.product.id == "loan-flexi-fit")
    
    assert loan_b_res.suitability_score > loan_a_res.suitability_score, (
        f"Loan B ({loan_b_res.suitability_score}) should outscore Loan A ({loan_a_res.suitability_score})"
    )
    
    # Check that Loan A has a prepayment penalty & upfront fee flagged
    assert any(p.title == "Prepayment Exit Penalty Drag" for p in loan_a_res.penalties)
    assert any(p.title == "Heavy Upfront Processing Fee" for p in loan_a_res.penalties)
    
    # Check comparison matrix
    matrix = SuitabilityEngine.compare_selected_products(rohan_profile, ["loan-headline-bait", "loan-flexi-fit"])
    assert matrix.results[0].product.id == "loan-flexi-fit"
    assert "lower upfront drag" in matrix.verdict.lower() or "wins" in matrix.verdict.lower()

def test_scenario_2_risk_mismatch():
    """
    Killer Demo Scenario 2:
    Aarav (Income ₹25k, Expenses ₹23k, Savings ₹10k, Stated tolerance HIGH)
    
    Expected:
    1. Derived risk capacity MUST be 'low'
    2. risk_mismatch_detected MUST be True
    3. High-volatility crypto basket MUST receive critical penalty and low suitability
    """
    aarav_profile_data = DEMO_PERSONAS[1]["profile"]
    aarav_profile = UserProfile(**aarav_profile_data)
    
    risk_analysis = RiskCapacityEngine.evaluate(aarav_profile)
    assert risk_analysis.derived_risk_capacity == "low"
    assert risk_analysis.risk_mismatch_detected is True
    assert risk_analysis.conflict_severity in ["mild", "critical"]
    
    results = SuitabilityEngine.evaluate_products_for_profile(aarav_profile)
    crypto_res = next(r for r in results if r.product.id == "inv-crypto-momentum")
    
    assert crypto_res.suitability_score < 60.0
    assert any("Solvency Risk Mismatch" in p.title for p in crypto_res.penalties)

def test_scenario_3_investment_horizon_match():
    """
    Killer Demo Scenario 3:
    Priya (5-year horizon, moderate risk, ₹2.5L savings)
    
    Expected: Balanced Hybrid / Index fund outranks short-term cash or rigid lock-in violations.
    """
    priya_profile_data = DEMO_PERSONAS[2]["profile"]
    priya_profile = UserProfile(**priya_profile_data)
    
    results = SuitabilityEngine.evaluate_products_for_profile(priya_profile)
    top_result = results[0]
    
    assert top_result.suitability_score >= 80.0
    assert top_result.product.risk_level in ["moderate", "low"]
