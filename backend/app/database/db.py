import sqlite3
import json
import os
from typing import List, Dict, Any, Optional
from ..models.product import Product
from .seed_data import SEED_PRODUCTS, DEMO_PERSONAS

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "alignfin.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        provider TEXT NOT NULL,
        category TEXT NOT NULL,
        headline_rate REAL NOT NULL,
        headline_label TEXT NOT NULL,
        min_amount REAL NOT NULL,
        max_amount REAL NOT NULL,
        min_tenure_months INTEGER,
        max_tenure_months INTEGER,
        lock_in_months INTEGER DEFAULT 0,
        processing_fee_flat REAL DEFAULT 0,
        processing_fee_pct REAL DEFAULT 0,
        prepayment_penalty_pct REAL DEFAULT 0,
        exit_load_pct REAL DEFAULT 0,
        expense_ratio_pct REAL DEFAULT 0,
        risk_level TEXT NOT NULL,
        liquidity_rating TEXT NOT NULL,
        tax_status TEXT,
        key_features TEXT,
        secondary_conditions TEXT,
        badge TEXT,
        evidence_json TEXT,
        evidence_coverage_pct REAL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evaluations (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        suitability_score REAL NOT NULL,
        category TEXT NOT NULL,
        risk_capacity TEXT NOT NULL,
        breakdown_json TEXT NOT NULL,
        penalties_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    conn.commit()
    
    # Seed products if empty
    cursor.execute("SELECT COUNT(*) FROM products")
    count = cursor.fetchone()[0]
    if count == 0:
        for p in SEED_PRODUCTS:
            cursor.execute("""
            INSERT INTO products (
                id, name, provider, category, headline_rate, headline_label,
                min_amount, max_amount, min_tenure_months, max_tenure_months,
                lock_in_months, processing_fee_flat, processing_fee_pct,
                prepayment_penalty_pct, exit_load_pct, expense_ratio_pct,
                risk_level, liquidity_rating, tax_status, key_features,
                secondary_conditions, badge, evidence_json, evidence_coverage_pct
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                p["id"], p["name"], p["provider"], p["category"], p["headline_rate"], p["headline_label"],
                p["min_amount"], p["max_amount"], p.get("min_tenure_months", 12), p.get("max_tenure_months", 84),
                p.get("lock_in_months", 0), p.get("processing_fee_flat", 0.0), p.get("processing_fee_pct", 0.0),
                p.get("prepayment_penalty_pct", 0.0), p.get("exit_load_pct", 0.0), p.get("expense_ratio_pct", 0.0),
                p["risk_level"], p["liquidity_rating"], p.get("tax_status", "taxable"),
                json.dumps(p.get("key_features", [])),
                json.dumps(p.get("secondary_conditions", [])),
                p.get("badge"),
                json.dumps({}), 0.0
            ))
        conn.commit()
    conn.close()

def get_all_products(category: Optional[str] = None) -> List[Product]:
    conn = get_db_connection()
    cursor = conn.cursor()
    if category:
        cursor.execute("SELECT * FROM products WHERE category = ?", (category,))
    else:
        cursor.execute("SELECT * FROM products")
    rows = cursor.fetchall()
    conn.close()
    
    products = []
    for r in rows:
        d = dict(r)
        d["key_features"] = json.loads(d["key_features"]) if d["key_features"] else []
        d["secondary_conditions"] = json.loads(d["secondary_conditions"]) if d["secondary_conditions"] else []
        d["evidence_map"] = json.loads(d["evidence_json"]) if d.get("evidence_json") else {}
        products.append(Product(**d))
    return products

def get_product_by_id(product_id: str) -> Optional[Product]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d["key_features"] = json.loads(d["key_features"]) if d["key_features"] else []
    d["secondary_conditions"] = json.loads(d["secondary_conditions"]) if d["secondary_conditions"] else []
    d["evidence_map"] = json.loads(d["evidence_json"]) if d.get("evidence_json") else {}
    return Product(**d)
