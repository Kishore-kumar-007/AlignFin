import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_api_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

def test_api_personas():
    res = client.get("/api/personas")
    assert res.status_code == 200
    personas = res.json()
    assert len(personas) >= 4
    assert personas[0]["id"] == "persona-loan-trap"

def test_api_products():
    res = client.get("/api/products?category=loan")
    assert res.status_code == 200
    products = res.json()
    assert len(products) >= 10
    assert all(p["category"] == "loan" for p in products)

def test_api_risk_analysis():
    payload = {
        "monthly_income": 35000,
        "monthly_expenses": 25000,
        "existing_debt_emi": 2000,
        "current_savings": 75000,
        "target_amount": 200000,
        "target_horizon_months": 36,
        "risk_tolerance": "moderate",
        "financial_goal": "vehicle_purchase",
        "category_interest": "loan"
    }
    res = client.post("/api/profile/analyze-risk", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["derived_risk_capacity"] == "moderate"
    assert data["emergency_runway_months"] == 3.0

def test_api_recommendations():
    payload = {
        "monthly_income": 35000,
        "monthly_expenses": 25000,
        "existing_debt_emi": 2000,
        "current_savings": 75000,
        "target_amount": 200000,
        "target_horizon_months": 36,
        "risk_tolerance": "moderate",
        "financial_goal": "vehicle_purchase",
        "category_interest": "loan"
    }
    res = client.post("/api/evaluate/recommendations", json=payload)
    assert res.status_code == 200
    results = res.json()
    assert len(results) >= 10
    # Highest ranked should have suitability_score >= 80
    assert results[0]["suitability_score"] >= 80

def test_api_compare():
    profile = {
        "monthly_income": 35000,
        "monthly_expenses": 25000,
        "existing_debt_emi": 2000,
        "current_savings": 75000,
        "target_amount": 200000,
        "target_horizon_months": 36,
        "risk_tolerance": "moderate",
        "financial_goal": "vehicle_purchase",
        "category_interest": "loan"
    }
    payload = {
        "profile": profile,
        "product_ids": ["loan-headline-bait", "loan-flexi-fit"]
    }
    res = client.post("/api/evaluate/compare", json=payload)
    assert res.status_code == 200
    matrix = res.json()
    assert len(matrix["results"]) == 2
    assert matrix["results"][0]["product"]["id"] == "loan-flexi-fit"
    assert len(matrix["key_tradeoffs"]) > 0

def test_auth_registration_valid():
    res = client.post("/api/auth/register", json={"email": "test@example.com", "password": "validpassword"})
    # Since DB is shared during tests and resets might not happen, we might get 400 Email already registered, 
    # but as long as it's not the short password error it's fine.
    assert res.status_code in [200, 400]
    if res.status_code == 400:
        assert res.json()["detail"] == "Email already registered"

def test_auth_registration_short_password():
    res = client.post("/api/auth/register", json={"email": "short@example.com", "password": "short"})
    assert res.status_code == 400
    assert res.json()["detail"] == "Password must be at least 6 characters."

def test_auth_registration_empty_password():
    res = client.post("/api/auth/register", json={"email": "empty@example.com", "password": ""})
    assert res.status_code == 400
    assert res.json()["detail"] == "Password must be at least 6 characters."
