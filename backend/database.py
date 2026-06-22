import sqlite3
from dotenv import load_dotenv
import os

load_dotenv()

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DATABASE_URL = os.getenv(
    "DATABASE_URL"
)

if not DATABASE_URL:
    DATABASE_URL = os.path.join(
        BASE_DIR,
        "medtwin.db"
    )

def create_db():
    conn = sqlite3.connect(
        DATABASE_URL.replace(
            "sqlite:///",
            ""
        )
    )

    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            prediction TEXT,
            probability REAL,
            risk_level TEXT,
            glucose REAL,
            bmi REAL,
            age INTEGER,
            ai_summary TEXT,
            recommendation TEXT,
            top_risk_factors TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            password TEXT
        )
    """)

    conn.commit()
    conn.close()