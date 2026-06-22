"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input }
from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  generateReport,
  getHistory
} from "@/services/api";
import { Button } from "@/components/ui/button";
interface HistoryItem {
  id: number;
  prediction: string;
  probability: number;
  risk_level: string;
  glucose: number;
  bmi: number;
  age: number;

  ai_summary: string;
  recommendation: string;
  top_risk_factors: string;

  created_at: string;
}
import { useRouter } from "next/navigation";
export default function HistoryPage() {
  const router = useRouter();

  const [history, setHistory] =
    useState<HistoryItem[]>([]);
  const [filter, setFilter] =
  useState("All");
  const [dateFilter, setDateFilter] =
  useState("All");
  const [search, setSearch] =
  useState("");
  const [loading, setLoading] =
    useState(true);
  const [isReady, setIsReady] =
  useState(false);
  useEffect(() => {
    const token =
  localStorage.getItem(
    "token"
  );

if (!token) {
  router.push("/login");
  return;
}
setIsReady(true);

    const fetchHistory =
      async () => {

        try {

          const userId =
  Number(
    localStorage.getItem(
      "user_id"
    )
  );

const data =
  await getHistory(
    userId
  );

setHistory(data);

        } catch (error) {

          console.error(
            "Failed to fetch history",
            error
          );

        } finally {

          setLoading(false);

        }

      };

    fetchHistory();

  }, []);
  if (!isReady) {
  return null;
}
  const totalPredictions =
  history.length;

    const highRisk =
    history.filter(
        (item) =>
        item.risk_level === "High"
    ).length;

    const moderateRisk =
    history.filter(
        (item) =>
        item.risk_level === "Moderate"
    ).length;

    const lowRisk =
    history.filter(
        (item) =>
        item.risk_level === "Low"
    ).length;

  if (loading) {
    return (
      <div className="p-10">
        Loading history...
      </div>
    );
  }
const handleDelete =
  async (id: number) => {

    try {

      await axios.delete(
  `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/history/${id}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

      setHistory(
        history.filter(
          (item) =>
            item.id !== id
        )
      );

    } catch (error) {

      console.error(
        "Delete failed",
        error
      );

    }

};
const filteredHistory =
  history.filter((item) => {

    const matchesRisk =
      filter === "All"
        ? true
        : item.risk_level === filter;

    const createdDate =
      new Date(item.created_at + "Z");

    const now =
      new Date();

    let matchesDate =
      true;

    if (
      dateFilter === "Today"
    ) {
      matchesDate =
        createdDate.toDateString() ===
        now.toDateString();
    }

    if (
      dateFilter === "This Week"
    ) {
      const oneWeekAgo =
        new Date();

      oneWeekAgo.setDate(
        now.getDate() - 7
      );

      matchesDate =
        createdDate >= oneWeekAgo;
    }

    if (
      dateFilter === "This Month"
    ) {
      matchesDate =
        createdDate.getMonth() ===
          now.getMonth() &&
        createdDate.getFullYear() ===
          now.getFullYear();
    }

    return (
      matchesRisk &&
      matchesDate
    );

});
    const handleReportDownload =
  async (
    item: HistoryItem
  ) => {

    try {

      const response =
        await generateReport({

          prediction:
            item.prediction,

          probability:
            item.probability,

          risk_level:
            item.risk_level,

          ai_summary:
            item.ai_summary,

          report_summary:
            item.ai_summary,

          recommendation:
            item.recommendation,

          top_risk_factors:
            item.top_risk_factors
              .split(", "),

          patient_summary: {
            age: item.age,
            glucose:
              item.glucose,
            bmi: item.bmi,
          },
        });

      window.open(
        response.download_url,
        "_blank"
      );

    } catch (error) {

      console.error(
        error
      );

    }

};
  return (
     <main className="min-h-screen relative overflow-hidden bg-[#060B14] text-white px-8 py-12">
     <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full" />
  <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-600/20 blur-[120px] rounded-full" />

  <div className="relative z-10">
      <h1 className="text-5xl font-bold mb-10">
  Prediction History
</h1>
      
      <div
  className="
    grid
    md:grid-cols-4
    gap-4
    mb-8
  "
>

  <Card className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl">
    <CardContent
      className="p-6"
    >
      <p
        className="
          text-sm
          text-zinc-400
        "
      >
        Total Predictions
      </p>

      <p
        className="
          text-3xl
          font-bold
          text-white
        "
      >
        {totalPredictions}
      </p>
    </CardContent>
  </Card>

  <Card className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl">
    <CardContent
      className="p-6"
    >
      <p className="text-zinc-300">🔴 High Risk</p>

      <p
        className="
          text-3xl
          font-bold
          text-white
        "
      >
        {highRisk}
      </p>
    </CardContent>
  </Card>

  <Card className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl">
    <CardContent
      className="p-6"
    >
      <p className="text-zinc-300">🟡 Moderate</p>

      <p
        className="
          text-3xl
          font-bold
          text-white
        "
      >
        {moderateRisk}
      </p>
    </CardContent>
  </Card>

  <Card className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl">
    <CardContent
      className="p-6"
    >
      <p className="text-zinc-300">🟢 Low Risk</p>

      <p
        className="
          text-3xl
          font-bold
          text-white
        "
      >
        {lowRisk}
      </p>
    </CardContent>
  </Card>

</div>
<div
  className="
    flex
    gap-3
    mb-8
  "
>

  {[
    "All",
    "Today",
    "This Week",
    "This Month"
  ].map((range) => (

    <button
      key={range}
      onClick={() =>
        setDateFilter(range)
      }
      className={`
  px-5 py-3 rounded-xl border transition
  ${
    dateFilter === range
      ? "bg-white text-black border-white"
      : "bg-zinc-900 border-zinc-700 text-white hover:border-white/40"
  }
`}
    >
      {range}
    </button>

  ))}

</div>
<div
  className="
    flex
    gap-3
    mb-8
  "
>

  {[
    "All",
    "High",
    "Moderate",
    "Low"
  ].map((level) => (

    <button
      key={level}
      onClick={() =>
        setFilter(level)
      }
      className={`
  px-5 py-3 rounded-xl border transition
  ${
    filter === level
      ? "bg-white text-black border-white"
      : "bg-zinc-900 border-zinc-700 text-white hover:border-white/40"
  }
`}
    >
      {level}
    </button>

  ))}

</div>
<div className="mb-8">

  <Input className="
bg-white/5
border-white/10
text-white
placeholder:text-zinc-500
rounded-xl
h-12
"
    placeholder="
      Search by prediction,
      glucose, age, BMI...
    "
    value={search}
    onChange={(e) =>
      setSearch(
        e.target.value
      )
    }
  />

</div>

      {filteredHistory.length === 0 ? (

        <p className="text-zinc-300">
          No predictions found.
        </p>

      ) : (

        <div
          className="
            grid
            md:grid-cols-2
            gap-6
          "
        >

          {filteredHistory.map((item) => (

            <Card
  key={item.id}
  className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl"
>

              <CardHeader>

                <CardTitle className="text-white text-2xl">
                  {item.prediction}
                </CardTitle>

              </CardHeader>

              <CardContent
                className="
                  space-y-3
                "
              >

                <p className="text-zinc-300">
  <strong className="text-white">
    Risk Level:
  </strong>{" "}

  <span
    className={`px-3 py-1 rounded-full text-white text-sm ${
      item.risk_level === "High"
        ? "bg-red-500"
        : item.risk_level === "Moderate"
        ? "bg-yellow-500"
        : "bg-green-500"
    }`}
  >
    {item.risk_level}
  </span>
</p>

                <p className="text-zinc-300">
                  <strong className="text-white">
                    Probability:
                  </strong>{" "}
                  {item.probability}%
                </p>

                <p className="text-zinc-300">
                  <strong className="text-white">
                    Glucose:
                  </strong>{" "}
                  {item.glucose}
                </p>

                <p className="text-zinc-300">
                  <strong className="text-white">
                    BMI:
                  </strong>{" "}
                  {item.bmi}
                </p>

                <p className="text-zinc-300">
                  <strong className="text-white">
                    Age:
                  </strong>{" "}
                  {item.age}
                </p>

                <p
                  className="
                    text-sm
                    text-zinc-400
                  "
                >
                  {new Date(
                    item.created_at + "Z"
                  ).toLocaleString()}
                </p>
                <div
  className="
    flex
    flex-wrap
    gap-3
    mt-4
    w-full
  "
>
                <Dialog>

  <DialogTrigger asChild>

    <Button
  className="
     h-10
     flex-1
     min-w-[140px]
     px-4
     bg-white
     text-black
     hover:bg-zinc-200
     rounded-xl
  "
>
      View Details
    </Button>

  </DialogTrigger>

  <DialogContent className="bg-black border border-white/10 text-white rounded-3xl">

    <DialogHeader>

      <DialogTitle>
        Prediction Details
      </DialogTitle>
     <DialogDescription>
      View complete prediction details.
    </DialogDescription>
    </DialogHeader>

    <div className="space-y-4">

      <p className="text-zinc-300">
        <strong className="text-white">
          Prediction:
        </strong>{" "}
        {item.prediction}
      </p>

      <p className="text-zinc-300">
        <strong className="text-white">
          Probability:
        </strong>{" "}
        {item.probability}%
      </p>

      <p className="text-zinc-300">
        <strong className="text-white">
          Risk Level:
        </strong>{" "}
        {item.risk_level}
      </p>

      <p className="text-zinc-300">
        <strong className="text-white">
          Top Risk Factors:
        </strong>{" "}
        {item.top_risk_factors}
      </p>

      <p className="text-zinc-300">
        <strong className="text-white">
          AI Summary:
        </strong>{" "}
        {item.ai_summary}
      </p>

      <p className="text-zinc-300">
        <strong className="text-white" >
          Recommendation:
        </strong>{" "}
        {item.recommendation}
      </p>
      <Button className="bg-white text-black rounded-xl hover:bg-zinc-200"
  onClick={() =>
    handleReportDownload(
      item
    )
  }
>
  Download This Report
</Button>

      <p className="text-zinc-300">
        <strong className="text-white">
          Patient Metrics:
        </strong>
      </p>

      <ul
        className="
          list-disc
          pl-5
        "
      >
        <li>
          Glucose:
          {item.glucose}
        </li>

        <li>
          BMI:
          {item.bmi}
        </li>

        <li>
          Age:
          {item.age}
        </li>
      </ul>

      <p
        className="
          text-sm
          text-zinc-400
        "
      >
        {new Date(
          item.created_at
        ).toLocaleString()}
      </p>

    </div>

  </DialogContent>

</Dialog>
                <Button
  variant="outline"
  onClick={() =>
    handleDelete(item.id)
  }
  className="
    h-10
    min-w-[40px]
    w-10
    border-red-500
    text-red-400
    hover:bg-red-500/10
    bg-transparent
  "
>
  <Trash2 className="h-4 w-4" />
</Button>

</div>

              </CardContent>

            </Card>

          ))}

        </div>

      )}
    </div>
    </main>
  );
}