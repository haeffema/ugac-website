"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Attempting to log you in...");

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      localStorage.setItem("user_id", id);
      console.log(`User ID ${id} stored in localStorage.`);
      setMessage("Login successful! Redirecting to home page...");

      const timer = setTimeout(() => {
        router.push("/");
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      console.warn("No 'id' parameter found in URL. Redirecting to home page.");
      setMessage("No user ID found. Redirecting to home page...");
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Login</h1>
        <p className="text-lg text-gray-200">{message}</p>
        <p className="text-sm text-gray-400 mt-2">
          (If you are not redirected, please navigate to the home page.)
        </p>
      </div>
    </div>
  );
}
