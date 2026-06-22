"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth");
      return;
    }

    setUser({
      name: localStorage.getItem("name") || "",
      email: localStorage.getItem("email") || "",
    });
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#060B14] text-white px-8 py-12">

      {/* Background Glow */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-600/20 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="text-cyan-400 uppercase tracking-[0.25em] text-sm mb-4">
            User Profile
          </p>

          <h1 className="text-5xl font-bold mb-3">
            My Account
          </h1>

          <p className="text-zinc-400 text-lg">
            Manage your profile, monitor account activity, and access MedTwin services.
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-10">

          <div className="flex flex-col md:flex-row md:items-center gap-8">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-cyan-500 flex items-center justify-center text-4xl font-bold text-black">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>

            {/* User Info */}
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {user.name || "User"}
              </h2>

              <p className="text-zinc-400 text-lg break-all">
                {user.email}
              </p>
            </div>

          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <p className="text-zinc-400 mb-2">Account Status</p>
            <h3 className="text-2xl font-bold text-green-400">
              Active
            </h3>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <p className="text-zinc-400 mb-2">Security</p>
            <h3 className="text-2xl font-bold text-cyan-400">
              Protected
            </h3>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <p className="text-zinc-400 mb-2">AI Access</p>
            <h3 className="text-2xl font-bold text-yellow-400">
              Enabled
            </h3>
          </div>

        </div>

        {/* Account Information */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-10">

          <h2 className="text-2xl font-semibold mb-6">
            Account Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-zinc-900 rounded-2xl p-5">
              <p className="text-zinc-400 text-sm mb-2">
                Full Name
              </p>

              <h3 className="text-xl font-semibold">
                {user.name}
              </h3>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-5">
              <p className="text-zinc-400 text-sm mb-2">
                Email Address
              </p>

              <h3 className="text-xl font-semibold break-all">
                {user.email}
              </h3>
            </div>

          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <button
            onClick={() => router.push("/predict")}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-left hover:border-cyan-400 transition"
          >
            <h3 className="text-xl font-semibold mb-2">
              Analyze Risk
            </h3>
            <p className="text-zinc-400">
              Upload a new report and get AI insights.
            </p>
          </button>

          <button
            onClick={() => router.push("/history")}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-left hover:border-cyan-400 transition"
          >
            <h3 className="text-xl font-semibold mb-2">
              View History
            </h3>
            <p className="text-zinc-400">
              Access all previous predictions securely.
            </p>
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-left hover:border-cyan-400 transition"
          >
            <h3 className="text-xl font-semibold mb-2">
              Dashboard
            </h3>
            <p className="text-zinc-400">
              Monitor trends and analytics.
            </p>
          </button>

        </div>

        {/* Logout */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/auth");
            }}
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-semibold"
          >
            Logout
          </button>
        </div>

      </div>
    </main>
  );
}