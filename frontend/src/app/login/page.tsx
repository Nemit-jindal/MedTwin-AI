"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {

  const router = useRouter();

  const [formData, setFormData] =
    useState({
      email: "",
      password: ""
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });
  };

  const handleLogin =
    async () => {

      try {

        const response =
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/login`,
            formData
          );

        if (
          response.data.status ===
          "success"
        ) {
          console.log(
  "Logged in user:",
  response.data.user_id
);
          localStorage.setItem(
            "token",
            response.data.token
            
          );

          localStorage.setItem(
            "user_id",
            response.data.user_id
          );
          localStorage.setItem("name", response.data.name);
          localStorage.setItem("email", response.data.email);

          alert("Login successful");

          router.push("/predict");
        }

      } catch (error) {
        console.error(error);
      }
  };

  return (
    <div className="space-y-4">

      <div
        className="
          space-y-4
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            text-center
          "
        >
          Login
        </h1>

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

        <button
          onClick={handleLogin}
          className="
            w-full
            bg-black
            text-white
            p-3
            rounded
          "
        >
          Login
        </button>

      </div>

    </div>
  );
}