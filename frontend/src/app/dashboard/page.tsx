"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getHistory } from "@/services/api";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      router.replace("/auth");
      return;
    }

    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const userId = Number(localStorage.getItem("user_id"));
    const data = await getHistory(userId);
    setHistory(data);
  };

  const totalReports = history.length;

  const avgGlucose =
    history.length > 0
      ? (
          history.reduce((sum, item) => sum + item.glucose, 0) /
          history.length
        ).toFixed(1)
      : 0;

  const avgBMI =
    history.length > 0
      ? (
          history.reduce((sum, item) => sum + item.bmi, 0) /
          history.length
        ).toFixed(1)
      : 0;

  const riskData = [
    {
      name: "High",
      value: history.filter((h) => h.risk_level === "High").length,
    },
    {
      name: "Moderate",
      value: history.filter((h) => h.risk_level === "Moderate").length,
    },
    {
      name: "Low",
      value: history.filter((h) => h.risk_level === "Low").length,
    },
  ];

  const trendData = history.map((item, index) => ({
    name: `R${index + 1}`,
    glucose: item.glucose,
    bmi: item.bmi,
  }));

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#060B14] text-white px-8 py-12">

      {/* Background Glow */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-600/20 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3">
            Dashboard Analytics
          </h1>
          <p className="text-zinc-400 text-lg">
            Track prediction trends and monitor your health insights.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <p className="text-zinc-400 mb-2">Total Reports</p>
            <h2 className="text-4xl font-bold text-white">
              {totalReports}
            </h2>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <p className="text-zinc-400 mb-2">Average Glucose</p>
            <h2 className="text-4xl font-bold text-white">
              {avgGlucose}
            </h2>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <p className="text-zinc-400 mb-2">Average BMI</p>
            <h2 className="text-4xl font-bold text-white">
              {avgBMI}
            </h2>
          </div>

        </div>

        {/* Risk Distribution */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-6">
            Risk Distribution
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={riskData}
                dataKey="value"
                outerRadius={110}
                label
              >
                <Cell fill="#ff4d4f" />
                <Cell fill="#faad14" />
                <Cell fill="#52c41a" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Trends Grid */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Glucose Trend */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Glucose Trend
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="glucose"
                  stroke="#00D4FF"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* BMI Trend */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h2 className="text-2xl font-semibold mb-6">
              BMI Trend
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="bmi" fill="#00D4FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>

      </div>
    </main>
  );
}