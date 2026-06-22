"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import PredictionForm from "@/components/PredictionForm";
import ReportUpload from "@/components/ReportUpload";
import { FormDataType } from "@/types/form";
import { Button } from "@/components/ui/button";

export default function PredictPage() {
  const router = useRouter();

  const [formData, setFormData] =
    useState<FormDataType>({
      Gender: "",
      Pregnancies: "",
      Glucose: "",
      BloodPressure: "",
      SkinThickness: "",
      Insulin: "",
      BMI: "",
      DiabetesPedigreeFunction: "",
      Age: "",
    });

  const [healthSummary, setHealthSummary] =
    useState("");

  const [reportText, setReportText] =
    useState("");

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      router.replace("/auth");
    }
  }, [router]);

  const handleExtractedData = (
    data: {
      extractedValues: Record<
        string,
        number
      >;
      healthSummary: string;
      reportText: string;
    }
  ) => {
    setHealthSummary(
      data.healthSummary
    );

    setReportText(
      data.reportText
    );

    const extracted =
      data.extractedValues;

    setFormData((prev) => ({
      ...prev,

      Glucose:
        extracted.Glucose?.toString() || "",

      BloodPressure:
        extracted.BloodPressure?.toString() || "",

      BMI:
        extracted.BMI?.toString() || "",

      Age:
        extracted.Age?.toString() || "",
    }));
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#060B14] text-white px-8 py-12">

      {/* Background Glow */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-600/20 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-10">

          <div className="flex justify-between items-center mb-8">

            <div className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300">
              🩺 AI Healthcare Platform
            </div>

            <Button
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
              onClick={() => {
                localStorage.clear();
                router.push("/auth");
              }}
            >
              Logout
            </Button>

          </div>

          <div className="text-center">
            <h1 className="text-5xl font-bold mb-3">
              MedTwin AI
            </h1>

            <p className="text-zinc-400 text-lg">
              AI-Powered Diabetes Risk Assessment Platform
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[0.35fr_0.65fr] gap-8">

          {/* Left Side */}
          <div className="space-y-6">

            {/* Upload Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <ReportUpload
                onExtractedData={
                  handleExtractedData
                }
              />

              <p className="text-zinc-400 mt-4 text-sm">
                Upload PDF, JPG, PNG medical reports for AI extraction.
              </p>
            </div>

            {/* Quick Tips */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">

              <h2 className="text-xl font-semibold mb-4">
                Quick Tips
              </h2>

              <div className="space-y-3 text-zinc-400">
                <p>
                  ✓ Upload clear reports
                </p>
                <p>
                  ✓ Verify extracted values
                </p>
                <p>
                  ✓ Complete all required fields
                </p>
                <p>
                  ✓ Review AI recommendations
                </p>
              </div>

            </div>

            {/* Health Summary */}
            {healthSummary && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">

                <h2 className="text-xl font-semibold mb-4">
                  AI Health Summary
                </h2>

                <p className="text-zinc-400 leading-7">
                  {healthSummary}
                </p>

              </div>
            )}

          </div>

          {/* Right Side Form */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

            <h2 className="text-2xl font-semibold mb-6">
              Patient Information
            </h2>

            <PredictionForm
  formData={formData}
  setFormData={setFormData}
  healthSummary={healthSummary}
  reportText={reportText}
/>

          </div>

        </div>

        {/* Report Text */}
        {reportText && (
          <div className="mt-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

            <h2 className="text-2xl font-semibold mb-6">
              Extracted Report Text
            </h2>

            <div className="bg-zinc-900 rounded-2xl p-6 max-h-[400px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-zinc-300 text-sm leading-7">
                {reportText}
              </pre>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}