"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get token or error from URL query params
    const token = searchParams.get("token");
    const errorMessage = searchParams.get("error");

    if (token) {
      // Save the token to localStorage or HTTP-only cookie via an API call
      localStorage.setItem("auth_token", token);
      
      // Redirect to dashboard or home page
      router.push("/dashboard");
    } else if (errorMessage) {
      setError(errorMessage);
    } else {
      setError("Authentication failed. Please try again.");
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white shadow rounded-lg">
          <div className="text-center text-red-600">
            <h2 className="text-xl font-bold">Authentication Error</h2>
            <p className="mt-2">{error}</p>
            <button
              onClick={() => router.push("/auth/login")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-lg">Authenticating...</p>
        <div className="mt-4 w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}