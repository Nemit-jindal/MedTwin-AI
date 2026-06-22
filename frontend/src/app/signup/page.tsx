"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSignup =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/signup`,
            formData
          );

        if (
          response.data.status ===
          "success"
        ) {
          alert(
            "Signup successful"
          );

          router.push("/auth");
        } else {
          setError(
            response.data.message
          );
        }
      } catch (error: any) {
        console.error(error);

        setError(
          error?.response?.data?.message ||
          "Signup failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="space-y-4">
      <div className="space-y-4">

        <h1
          className="
            text-3xl
            font-bold
            text-center
          "
        >
          Signup
        </h1>

        <input
          name="name"
          placeholder="Name"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="
            w-full
            bg-black
            text-white
            p-3
            rounded
          "
        >
          {loading
            ? "Creating..."
            : "Create Account"}
        </button>

      </div>
    </div>
  );
}