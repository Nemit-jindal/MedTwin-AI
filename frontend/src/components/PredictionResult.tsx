import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import ReportChat
from "@/components/ReportChat";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
  Brain,
  Activity,
  AlertTriangle,
  HeartPulse,
  ClipboardList,
  User
} from "lucide-react";

import { PredictionResponse } from "@/types/prediction";
import { generateReport } from "@/services/api";
import Link from "next/link";

interface PredictionResultProps {
  result: PredictionResponse;
  healthSummary: string;
  reportText: string;
}

export default function PredictionResult({
  result,
  healthSummary,
  reportText,
}: PredictionResultProps) {
  const [downloading, setDownloading] =
  useState(false);

const handleDownload = async () => {

  try {

    setDownloading(true);

    const response =
      await generateReport({

        prediction:
          result.prediction,

        probability:
          result.probability,

        risk_level:
          result.risk_level,

        ai_summary:
          result.ai_summary,

        report_summary:
            healthSummary,

        recommendation:
          result.recommendation,

        top_risk_factors:
          result.top_risk_factors,
        
        patient_summary:
          result.patient_summary,

      });

    window.open(
      response.download_url,
      "_blank"
    );

  } catch (error) {

    console.error(error);

    alert(
      "Failed to generate report"
    );

  } finally {

    setDownloading(false);

  }

};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

      {/* Prediction */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Prediction
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">
            {result.prediction}
          </p>
        </CardContent>
      </Card>

      {/* Probability */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Probability
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <Progress
            value={result.probability}
          />

          <p className="text-3xl font-bold">
            {result.probability}%
          </p>

        </CardContent>
      </Card>

      {/* Risk Level */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Level
          </CardTitle>
        </CardHeader>

        <CardContent>

          <p
            className={`text-3xl font-bold ${
              result.risk_level === "High"
                ? "text-red-500"
                : result.risk_level === "Moderate"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {result.risk_level}
          </p>

        </CardContent>
      </Card>

      {/* Recommendation */}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5" />
            Recommendation
          </CardTitle>
        </CardHeader>

        <CardContent>

          <p className="leading-7">
            {result.recommendation}
          </p>

        </CardContent>
      </Card>

      {/* SHAP Factors */}

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            🔥 Top Risk Factors (SHAP)
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {result.top_risk_factors.map(
              (factor) => (
                <div
                  key={factor}
                  className="
                    rounded-xl
                    border
                    p-4
                    text-center
                    font-medium
                    bg-muted/30
                    hover:bg-muted/50
                    transition
                  "
                >
                  🔥 {factor}
                </div>
              )
            )}

          </div>

        </CardContent>
      </Card>

      {/* AI Summary */}

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            AI Health Summary
          </CardTitle>
        </CardHeader>

        <CardContent>

          <p className="leading-8 text-muted-foreground">
            {result.ai_summary}
          </p>

        </CardContent>
      </Card>

      {/* Patient Summary */}

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Summary
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div>
              <p className="text-sm text-muted-foreground">
                Age
              </p>

              <p className="text-2xl font-bold">
                {result.patient_summary.age}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Glucose
              </p>

              <p className="text-2xl font-bold">
                {result.patient_summary.glucose}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                BMI
              </p>

              <p className="text-2xl font-bold">
                {result.patient_summary.bmi}
              </p>
            </div>

          </div>

        </CardContent>
      </Card>
      <Card className="md:col-span-2">

  <CardHeader>

    <CardTitle>
      💬 Ask MedTwin AI
    </CardTitle>

  </CardHeader>

  <CardContent>

    <ReportChat
      reportText={reportText}
      result={result}
    />

  </CardContent>

</Card>

      {/* Download Report */}

      <Card className="md:col-span-2 border-primary/20">

        <CardHeader>

          <CardTitle>
            📄 AI Medical Report
          </CardTitle>

        </CardHeader>

        <CardContent className="space-y-4">

          <p className="text-muted-foreground">

            Download a professional PDF report
            containing prediction results,
            AI analysis, SHAP explainability,
            and medical recommendations.

          </p>

          <div
  className="
    flex
    gap-4
    mt-6
  "
>

  <Button
    onClick={handleDownload}
    disabled={downloading}
  >
    {downloading
      ? "Generating..."
      : "Download Report"}
  </Button>

  <Link href="/history">

    <Button
      variant="outline"
    >
      View History
    </Button>

  </Link>

</div>

        </CardContent>

      </Card>

    </div>
  );
}