import os

import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv(
        "GEMINI_API_KEY"
    )
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

def generate_ai_health_summary(
    extracted_values: dict
):

    prompt = f"""
You are an AI healthcare assistant.

Medical Report Values:
{extracted_values}

Generate the response in this exact format:

📊 Health Status
<2-3 sentences>

⚠ Risk Observations
- point 1
- point 2

🍎 Lifestyle Recommendations
- point 1
- point 2
- point 3

Keep response under 120 words.
Do not diagnose diseases.
Use simple patient-friendly language.
"""

    response = model.generate_content(
        prompt
    )

    return response.text