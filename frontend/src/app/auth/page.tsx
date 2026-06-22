"use client";

import { useState } from "react";
import LoginPage from "../login/page";
import SignupPage from "../signup/page";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  return (
   <main className="min-h-screen bg-black text-white relative overflow-x-hidden overflow-y-auto">
      {/* Background Glow */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-600/20 blur-[120px] rounded-full" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] min-h-screen">
        {/* Left Side */}
       <section className="flex flex-col justify-start pt-16 lg:pt-28 px-6 lg:px-10 max-w-md mx-auto h-full">
          <p className="text-cyan-400 uppercase tracking-[0.25em] text-sm mb-4">
            Secure Access
          </p>

          <h1 className="text-5xl font-bold leading-tight mb-5">
            Access Your
            <span className="text-cyan-400"> MedTwin AI</span>
          </h1>

          <p className="text-zinc-400 text-lg max-w-lg leading-8">
            Sign in to analyze diabetes risk, view prediction history, monitor
            trends, and download AI-powered reports securely.
          </p>

          <div className="mt-8 space-y-4 text-zinc-300">
            <p>✓ AI-powered diabetes prediction</p>
            <p>✓ Personalized health summaries</p>
            <p>✓ Secure prediction history</p>
            <p>✓ Downloadable PDF reports</p>
          </div>

          <div className="mt-10 flex gap-8 text-sm text-zinc-500">
            <div>
              <h3 className="text-white text-2xl font-bold">JWT</h3>
              <p>Protected APIs</p>
            </div>

            <div>
              <h3 className="text-white text-2xl font-bold">AI</h3>
              <p>Risk Insights</p>
            </div>

            <div>
              <h3 className="text-white text-2xl font-bold">History</h3>
              <p>Secure Tracking</p>
            </div>
          </div>
        </section>

        {/* Right Side */}
        <section className="flex justify-center pt-6 lg:pt-10 px-4 lg:px-12 pb-10">
          <div className="w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-start">
            <div className="flex bg-zinc-900 rounded-2xl p-1 mb-6">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-3 rounded-xl transition ${
                  mode === "login"
                    ? "bg-cyan-500 text-black font-semibold"
                    : "text-zinc-400"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setMode("signup")}
                className={`flex-1 py-3 rounded-xl transition ${
                  mode === "signup"
                    ? "bg-cyan-500 text-black font-semibold"
                    : "text-zinc-400"
                }`}
              >
                Signup
              </button>
            </div>

            {mode === "login" ? <LoginPage /> : <SignupPage />}
          </div>
        </section>
      </div>
    </main>
  );
}
