"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGoogleSignup = () => {
    setIsLoading(true);
    window.location.href = `http://localhost:8080/oauth2/authorization/google`;
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create a new account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <Button
            onPress={handleGoogleSignup}
            isDisabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? "Loading..." : "Continue with Google"}
          </Button>
        </div>
      </div>
    </div>
  );
}