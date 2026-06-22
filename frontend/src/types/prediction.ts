export interface PredictionRequest {
  user_id: number;
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
}

export interface PredictionResponse {
  status: string;
  prediction: string;
  probability: number;
  risk_level: string;
  recommendation: string;
  ai_summary: string;
  top_risk_factors: string[];

  model_info: {
    model_name: string;
    version: string;
  };

  patient_summary: {
    age: number;
    glucose: number;
    bmi: number;
  };
}