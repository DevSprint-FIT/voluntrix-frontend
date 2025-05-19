"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FailPage() {
  const [animate, setAnimate] = useState(false);
  const [transactionRef, setTransactionRef] = useState("");

  useEffect(() => {
    // Start animations after component mounts
    setAnimate(true);
    
    // Generate transaction reference only on client-side
    setTransactionRef(Math.random().toString(36).substring(2, 10).toUpperCase());
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center relative transform transition-all duration-500 ease-out">
        {/* Red notification icon with animation */}
        <div 
          className={`mx-auto mb-6 w-20 h-20 rounded-full bg-red-100 flex items-center justify-center transform transition-all duration-700 ${
            animate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          <svg 
            className="w-10 h-10 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 
          className={`text-3xl font-bold text-gray-800 mb-4 transition-all duration-700 ${
            animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          Payment Unsuccessful
        </h1>

        <div 
          className={`space-y-4 transition-all duration-700 delay-300 ${
            animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <p className="text-gray-600 mb-6">
            We couldn&apos;t process your payment at this time. This could be due to:
          </p>
          
          <ul className="text-left text-gray-600 mb-6 bg-red-50 p-4 rounded-lg">
            <li className="flex items-start mb-2">
              <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Insufficient funds in your account</span>
            </li>
            <li className="flex items-start mb-2">
              <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Temporary issue with your payment method</span>
            </li>
            <li className="flex items-start mb-2">
              <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Network connectivity issues</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Your bank may have declined the transaction</span>
            </li>
          </ul>

          <p className="text-gray-600">
            No worries! You can try again or use a different payment method.
          </p>
        </div>

        <div 
          className={`mt-8 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-500 ${
            animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <Link href="/checkout">
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all w-full">
              Try Again
            </button>
          </Link>
          <Link href="/">
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all w-full">
              Back to Homepage
            </button>
          </Link>
        </div>

        <div 
          className={`mt-6 text-sm text-gray-500 transition-all duration-700 delay-600 ${
            animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <p>Need help? <a href="#" className="text-blue-600 hover:underline">Contact our support team</a></p>
        </div>
      </div>      {transactionRef && (
        <div 
          className={`mt-6 text-xs text-gray-400 transition-all duration-700 delay-700 ${
            animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <p>Transaction reference: {transactionRef}</p>
        </div>
      )}
    </div>
  );
}
