import sqlite3
from dotenv import load_dotenv
import os

load_dotenv()

import sqlite3


def create_db():

    conn = sqlite3.connect(
        os.getenv("DATABASE_URL")
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