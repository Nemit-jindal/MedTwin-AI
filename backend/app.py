from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from fastapi import UploadFile, File
from fastapi.staticfiles import StaticFiles
from database import create_db
from dotenv import load_dotenv
import os
import sqlite3
from jose import jwt
from datetime import datetime, timedelta
from fastapi import Header, Depends, HTTPException
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
def verify_token(
    authorization: str = Header(...)
):
    try:

        token = authorization.split(" ")[1]

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

from report_extractor import (
    extract_text_from_pdf,
    extract_medical_values
)
import pandas as pd
import pickle
import os
import shutil
from passlib.context import CryptContext
from gemini_service import (
    generate_ai_health_summary
)

from pdf_generator import (
    generate_pdf_report
)
# =====================================================
# Load Trained Model, Scaler & SHAP Explainer
# =====================================================

with open("../models/best_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("../models/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("../models/shap_explainer.pkl", "rb") as f:
    explainer = pickle.load(f)



pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)
# =====================================================
# FastAPI App
# =====================================================

app = FastAPI(
    title="MedTwin AI",
    description="AI-Powered Diabetes Risk Assessment API",
    version="1.0.0"
)
create_db()
app.mount(
    "/reports",
    StaticFiles(directory="reports"),
    name="reports"
)
# =====================================================
# CORS Configuration
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# Upload Configuration
# =====================================================

UPLOAD_DIR = "uploads"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)
# =====================================================
# Feature Display Names
# =====================================================

feature_display_names = {
    "Pregnancies": "Pregnancies",
    "Glucose": "Glucose",
    "BloodPressure": "Blood Pressure",
    "SkinThickness": "Skin Thickness",
    "Insulin": "Insulin",
    "BMI": "BMI",
    "DiabetesPedigreeFunction": "Diabetes Pedigree Function",
    "Age": "Age"
}

# =====================================================
# Request Schema
# =====================================================

class PatientData(BaseModel):
    user_id: int
    Gender: str
    Pregnancies: int = Field(..., ge=0, le=20)

    Glucose: float = Field(
        ...,
        ge=40,
        le=300
    )

    BloodPressure: float = Field(
        ...,
        ge=40,
        le=250
    )

    SkinThickness: float = Field(
        ...,
        ge=0,
        le=100
    )

    Insulin: float = Field(
        ...,
        ge=0,
        le=900
    )

    BMI: float = Field(
        ...,
        ge=10,
        le=70
    )

    DiabetesPedigreeFunction: float = Field(
        ...,
        ge=0,
        le=3
    )

    Age: int = Field(
        ...,
        ge=1,
        le=120
    )

# =====================================================
# Response Schema
# =====================================================

class PredictionResponse(BaseModel):

    status: str
    prediction: str
    probability: float
    risk_level: str
    recommendation: str

    ai_summary: str

    top_risk_factors: list[str]

    model_info: dict

    patient_summary: dict

class ReportRequest(
    BaseModel
):

    prediction: str

    probability: float

    risk_level: str

    ai_summary: str

    report_summary: str

    recommendation: str

    top_risk_factors: list[str]

    patient_summary: dict

class ChatRequest(BaseModel):
    

    report_text: str

    question: str

    prediction: str

    risk_level: str

    probability: float

    top_risk_factors: list[str]

@app.post("/chat-report")
def chat_report(
    data: ChatRequest
):

    prompt = f"""
You are MedTwin AI, an intelligent healthcare assistant.

Patient Medical Report:
{data.report_text}

Diabetes Prediction:
Prediction: {data.prediction}
Risk Level: {data.risk_level}
Probability: {data.probability}%
Top Risk Factors: {', '.join(data.top_risk_factors)}

User Question:
{data.question}

Instructions:
If the user asks "how", "what should I do", "how can I improve", or asks for recommendations:

- Focus primarily on actionable steps.
- Limit repeating report values.
- Give practical recommendations.
- Organize into Diet, Exercise, Weight Management, and Medical Follow-up.
- Answer like a health coach, not a report summarizer.
Do not describe a feature as abnormal solely because it is a SHAP risk factor.
Distinguish between:
Model importance (SHAP)
Clinical abnormality

1. Answer the exact question asked.
2. Use values from the medical report.
3. Use diabetes prediction results.
4. Use SHAP risk factors when relevant.
5. Mention normal ranges if applicable.
6. Explain WHY the issue may occur.
7. Give personalized recommendations.
8. Keep the answer concise but informative.
9. Do not give generic responses.
"""

    answer = generate_ai_health_summary(
        prompt
    )

    return {
        "answer": answer
    }
# =====================================================
# Home Route
# =====================================================

@app.get("/")
def home():

    return {
        "message": "Welcome to MedTwin AI"
    }
# =====================================================
# Upload Report Route
# =====================================================

@app.post("/upload-report")
async def upload_report(
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {
        "status": "success",
        "filename": file.filename,
        "saved_path": file_path
    }
# =====================================================
# Extract Medical Report Route
# =====================================================

@app.post("/extract-report")
async def extract_report(
    file: UploadFile = File(...)
):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    text = extract_text_from_pdf(
        file_path
    )

    extracted_values = (
        extract_medical_values(
            text
        )
    )

    health_summary = (
        generate_ai_health_summary(
            extracted_values
        )
    )

    return {
        "status": "success",
        "filename": file.filename,
        "extracted_values": extracted_values,
        "health_summary": health_summary,
        "report_text": text
}
    
# =====================================================
# Prediction Route
# =====================================================

@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict( data: PatientData,
    user=Depends(verify_token)):

    input_df = pd.DataFrame([
        {
            "Pregnancies": data.Pregnancies,
            "Glucose": data.Glucose,
            "BloodPressure": data.BloodPressure,
            "SkinThickness": data.SkinThickness,
            "Insulin": data.Insulin,
            "BMI": data.BMI,
            "DiabetesPedigreeFunction":
                data.DiabetesPedigreeFunction,
            "Age": data.Age
        }
    ])
    
    # ==========================================
    # Scale Features
    # ==========================================

    input_scaled = scaler.transform(input_df)

    # ==========================================
    # SHAP Explainability
    # ==========================================

    shap_values = explainer.shap_values(
        input_scaled
    )

    feature_names = list(
        input_df.columns
    )

    feature_impacts = dict(
        zip(
            feature_names,
            shap_values[0]
        )
    )

    sorted_features = sorted(
        feature_impacts.items(),
        key=lambda x: abs(x[1]),
        reverse=True
    )

    # ==========================================
    # Fields Actually Filled By User
    # ==========================================

    filled_fields = [
        "Glucose",
        "BloodPressure",
        "BMI",
        "Age"
    ]

    if data.Pregnancies > 0:
        filled_fields.append(
            "Pregnancies"
        )

    if data.SkinThickness > 0:
        filled_fields.append(
            "SkinThickness"
        )

    if data.Insulin > 0:
        filled_fields.append(
            "Insulin"
        )

    if data.DiabetesPedigreeFunction > 0:
        filled_fields.append(
            "DiabetesPedigreeFunction"
        )

    # ==========================================
    # Top Risk Factors
    # ==========================================

    top_risk_factors = []

    for feature, _ in sorted_features:

        if feature not in filled_fields:
            continue

        if (
            data.Gender == "Male"
            and feature == "Pregnancies"
        ):
            continue

        top_risk_factors.append(
            feature_display_names[
                feature
            ]
        )

        if len(top_risk_factors) == 3:
            break

    # ==========================================
    # Prediction
    # ==========================================

    prediction = model.predict(
        input_scaled
    )[0]

    probability = model.predict_proba(
        input_scaled
    )[0][1]

    # ==========================================
    # Risk Assessment
    # ==========================================

    if probability < 0.30:

        risk_level = "Low"

        recommendation = (
            "Maintain healthy lifestyle habits."
        )

    elif probability < 0.70:

        risk_level = "Moderate"

        recommendation = (
            "Monitor blood sugar levels and consider medical consultation."
        )

    else:

        risk_level = "High"

        recommendation = (
            "Consult a healthcare professional for detailed evaluation."
        )

    # ==========================================
    # AI Summary
    # ==========================================

    ai_summary = (
        f"The patient is classified as "
        f"{risk_level.lower()} risk for diabetes. "
        f"The strongest contributing factors were "
        f"{', '.join(top_risk_factors)}."
    )

    # ==========================================
    # Response
    # ==========================================
    conn = sqlite3.connect(
       "medtwin.db"
)

    cursor = conn.cursor()

    cursor.execute(
    """
    INSERT INTO predictions (
        user_id,
        prediction,
        probability,
        risk_level,
        glucose,
        bmi,
        age,
        ai_summary,
        recommendation,
        top_risk_factors
    )
    VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)
    """,
    (   data.user_id,
        "Diabetic"
        if prediction == 1
        else "Non-Diabetic",

        round(
            float(probability) * 100,
            2
        ),

        risk_level,

        data.Glucose,
        data.BMI,
        data.Age,

        ai_summary,

        recommendation,

        ", ".join(
            top_risk_factors
        )
    )
)

    conn.commit()
    conn.close()
    return {

        "status": "success",

        "prediction": (
            "Diabetic"
            if prediction == 1
            else "Non-Diabetic"
        ),

        "probability": round(
            float(probability) * 100,
            2
        ),

        "risk_level": risk_level,

        "recommendation": recommendation,

        "ai_summary": ai_summary,

        "top_risk_factors": top_risk_factors,

        "model_info": {
            "model_name": "Logistic Regression",
            "version": "1.0.0"
        },

        "patient_summary": {
            "age": data.Age,
            "glucose": data.Glucose,
            "bmi": data.BMI
        }
    }
@app.post("/generate-report")
def generate_report(data: ReportRequest):

    filepath = generate_pdf_report(
        data.dict()
    )

    import os

    filename = os.path.basename(
    filepath
)
    return {
    "status": "success",
    "download_url":
        f"http://127.0.0.1:8000/reports/{filename}"
}
@app.get("/history/{user_id}")
def get_history(
    user_id: int,
    user=Depends(verify_token)
):

    conn = sqlite3.connect(
        "medtwin.db"
    )

    cursor = conn.cursor()

    cursor.execute(
    """
    SELECT *
    FROM predictions
    WHERE user_id = ?
    ORDER BY created_at DESC
    """,
    (user_id,)
)

    rows = cursor.fetchall()

    conn.close()

    history = []

    for row in rows:

        history.append({
        "id": row[0],
"user_id": row[1],
"prediction": row[2],
"probability": row[3],
"risk_level": row[4],
"glucose": row[5],
"bmi": row[6],
"age": row[7],
"ai_summary": row[8],
"recommendation": row[9],
"top_risk_factors": row[10],
"created_at": row[11]
    })

    return history
@app.delete("/history/{prediction_id}")
def delete_history(
    prediction_id: int,
    user=Depends(verify_token)
):

    conn = sqlite3.connect(
        "medtwin.db"
    )

    cursor = conn.cursor()

    cursor.execute(
        """
        DELETE FROM predictions
        WHERE id = ?
        """,
        (prediction_id,)
    )

    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message":
            "Prediction deleted"
    }
class UserSignup(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str

@app.post("/signup")
def signup(
    user: UserSignup
):

    conn = sqlite3.connect(
        "medtwin.db"
    )

    cursor = conn.cursor()

    hashed_password =pwd_context.hash(
            user.password
        )

    try:

        cursor.execute(
            """
            INSERT INTO users (
                name,
                email,
                password
            )
            VALUES (?, ?, ?)
            """,
            (
                user.name,
                user.email,
                hashed_password
            )
        )

        conn.commit()

    except:

        conn.close()

        return {
            "status": "error",
            "message":
                "User already exists"
        }

    conn.close()

    return {
        "status": "success",
        "message":
            "Signup successful"
    }

@app.post("/login")
def login(
    user: UserLogin
):

    conn = sqlite3.connect(
        "medtwin.db"
    )

    cursor = conn.cursor()

    cursor.execute(
        """
         SELECT id, name, email, password
    FROM users
    WHERE email = ?
        """,
        (user.email,)
    )

    db_user =cursor.fetchone()

    conn.close()

    if not db_user:

        return {
            "status": "error",
            "message":
                "User not found"
        }

    user_id = db_user[0]
    name = db_user[1]
    email = db_user[2]
    hashed_password = db_user[3]

    if not pwd_context.verify(
        user.password,
        hashed_password
    ):

        return {
            "status": "error",
            "message":
                "Invalid password"
        }

    token =jwt.encode(
            {
                "user_id":
                    user_id,
                "exp":
                    datetime.utcnow()
                    + timedelta(
                        days=1
                    )
            },
            SECRET_KEY,
            algorithm=ALGORITHM
            
        )

    return {
    "status": "success",
    "token": token,
    "user_id": user_id,
    "name": name,
    "email": email
}