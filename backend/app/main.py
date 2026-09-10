from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database.db import init_db
from .routers import personas, products, profile, evaluate, documents, auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite schema and seed data on startup
    init_db()
    yield

app = FastAPI(
    title="AlignFin Intelligence API",
    description="Explainable Financial Product Suitability Intelligence Engine",
    version="1.0.0",
    lifespan=lifespan
)

import os

# Configure CORS for local development and production
frontend_origin = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173,http://127.0.0.1:5173")
origins = [origin.strip() for origin in frontend_origin.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router)
app.include_router(personas.router)
app.include_router(products.router)
app.include_router(profile.router)
app.include_router(evaluate.router)
app.include_router(documents.router)

@app.get("/")
def root():
    return {
        "project": "AlignFin",
        "tagline": "Eligibility tells you what you can get. AlignFin tells you what fits.",
        "status": "active",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "engine": "deterministic_fbsi_v1", "version": "1.0.0"}
