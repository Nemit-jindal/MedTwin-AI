"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {

  const router = useRouter();

  const [formData, setFormData] =
    useState({
      name: "",
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

  const handleSignup =
    async () => {

      try {

        const response =
          await axios.post(
            "http://127.0.0.1:8000/signup",
            formData
          );

        if (
          response.data.status ===
          "success"
        ) {
          alert(
            "Signup successful"
          );

          router.push(
            "/login"
          );
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

        <button
          onClick={handleSignup}
          className="
            w-full
            bg-black
            text-white
            p-3
            rounded
          "
        >
          Create Account
        </button>

      </div>

    </div>
  );
}