# MedTwin AI

AI-powered diabetes risk prediction platform built using FastAPI, Next.js, Machine Learning, and Gemini AI.

## Features

- Diabetes risk prediction
- Medical report upload
- OCR extraction
- AI-generated health summary
- JWT authentication
- Prediction history
- PDF report generation
- User profile management

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend
- FastAPI
- SQLAlchemy
- JWT Auth
- Gemini API

### Machine Learning
- Logistic Regression
- Random Forest
- XGBoost

## Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `.env`:

```env
DATABASE_URL=
SECRET_KEY=
GEMINI_API_KEY=
```

## Project Structure

```text
backend/
frontend/
models/
uploads/
```

## Author

Nemit Jindal