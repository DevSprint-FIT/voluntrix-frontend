"use client";

export default function FailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-600">Payment Failed!</h1>
      <p className="mt-4 text-lg">Sorry, there was a problem processing your payment. Please try again.</p>
    </div>
  );
}
