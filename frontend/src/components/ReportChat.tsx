"use client";

import { useState } from "react";
import axios from "axios";
import { PredictionResponse }
from "@/types/prediction";
export default function ReportChat({
  reportText,
  result,
}: {
  reportText: string;
  result: PredictionResponse;
}) {

  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const askQuestion = async () => {

    const response =
      await axios.post(
  "http://127.0.0.1:8000/chat-report",
  {
    report_text: reportText,

    question,

    prediction:
      result.prediction,

    risk_level:
      result.risk_level,

    probability:
      result.probability,

    top_risk_factors:
      result.top_risk_factors,
  }
);

    setAnswer(
      response.data.answer
    );
  };

  return (
    <div className="space-y-4">

      <textarea
        className="
          w-full
          border
          rounded-lg
          p-3
        "
        rows={3}
        value={question}
        onChange={(e) =>
          setQuestion(
            e.target.value
          )
        }
        placeholder="
          Ask about your report...
        "
      />

      <button
        onClick={askQuestion}
        className="
          px-4
          py-2
          rounded-lg
          bg-black
          text-white
        "
      >
        Ask MedTwin AI
      </button>

      {answer && (

        <div
          className="
            border
            rounded-lg
            p-4
          "
        >
          {answer}
        </div>

      )}

    </div>
  );
}