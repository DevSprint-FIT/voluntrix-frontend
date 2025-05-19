"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SuccessPage() {
  const [animate, setAnimate] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiItems, setConfettiItems] = useState<Array<{
    left: string;
    top: string;
    width: string;
    height: string;
    backgroundColor: string;
    animation: string;
    opacity: number;
    transform: string;
  }>>([]);

  useEffect(() => {
    // Start animations after component mounts
    setAnimate(true);
    
    // Generate confetti only on client-side
    const confetti = Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 10 + 5}px`,
      height: `${Math.random() * 10 + 5}px`,
      backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'][
        Math.floor(Math.random() * 5)
      ],
      animation: `fall ${Math.random() * 3 + 3}s linear ${Math.random() * 2}s infinite`,
      opacity: Math.random() * 0.8 + 0.2,
      transform: `rotate(${Math.random() * 360}deg)`,
    }));
    
    setConfettiItems(confetti);
    setShowConfetti(true);

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 relative overflow-hidden">      {/* Animated confetti effect - only rendered client-side */}
      {showConfetti && confettiItems.length > 0 && (
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
          {confettiItems.map((confetti, i) => (
            <div
              key={i}
              className="absolute rounded-md"
              style={confetti}
            />
          ))}
        </div>
      )}

      <div className="z-10 bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-xl w-full text-center transform transition-all duration-1000 ease-out">
        {/* Success icon with animation */}
        <div 
          className={`mx-auto mb-8 w-24 h-24 rounded-full bg-green-100 flex items-center justify-center transform transition-all duration-1000 ${
            animate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          <div className="relative w-16 h-16">
            <Image 
              src="/icons/tick-circle.svg" 
              alt="Success" 
              fill
              className={`transition-transform duration-1000 ${animate ? 'scale-100' : 'scale-0'}`}
            />
          </div>
        </div>

        <h1 className={`text-4xl font-bold text-green-600 mb-6 transition-all duration-700 ${
          animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          Payment Successful!
        </h1>

        <div className={`space-y-4 transition-all duration-700 delay-300 ${
          animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <p className="text-lg text-gray-700">
            Thank you for your contribution! Your generosity makes a difference.
          </p>
          
          <div className="bg-green-50 rounded-lg p-4 my-6">
            <p className="text-gray-700">
              A receipt has been sent to your email.
            </p>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Your transaction has been recorded successfully. Any updates regarding your contribution will be communicated to you.
          </p>
        </div>

        <div className={`mt-8 flex flex-col md:flex-row gap-4 justify-center transition-all duration-700 delay-500 ${
          animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Link href="/">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all w-full md:w-auto">
              Back to Homepage
            </button>
          </Link>
          <Link href="/events">
            <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all w-full md:w-auto">
              Explore Events
            </button>
          </Link>
        </div>
      </div>

      {/* Social share section */}
      <div className={`mt-8 text-center z-10 transition-all duration-700 delay-700 ${
        animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <p className="text-gray-600 font-medium mb-3">Share your contribution</p>
        <div className="flex justify-center gap-4">
          <button className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-all" aria-label="Share on Facebook">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
            </svg>
          </button>
          <button className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-all" aria-label="Share on Twitter">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
            </svg>
          </button>
          <button className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-all" aria-label="Share via Email">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
