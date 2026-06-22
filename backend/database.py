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

# Handle SQLite properly for both local + Render
if DATABASE_URL and DATABASE_URL.startswith("sqlite:///"):
    DB_PATH = DATABASE_URL.replace(
        "sqlite:///",
        ""
    )
else:
    DB_PATH = os.path.join(
        BASE_DIR,
        "medtwin.db"
    )


def create_db():
    # Ensure directory exists
    os.makedirs(
        os.path.dirname(DB_PATH)
        if os.path.dirname(DB_PATH)
        else ".",
        exist_ok=True
    )

    conn = sqlite3.connect(
        DB_PATH
    )

    cursor = conn.cursor()

    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    # Predictions table
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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    conn.commit()
    conn.close()