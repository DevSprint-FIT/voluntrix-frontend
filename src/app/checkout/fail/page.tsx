"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, Button } from "@heroui/react";
import { XCircle, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';

export default function FailPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect to sponsorship dashboard after 15 seconds
    const timer = setTimeout(() => {
      router.push('/Sponsor/sponsorship');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  const commonIssues = [
    "Insufficient funds in your account",
    "Your bank declined the transaction",
    "Network connectivity issues",
    
    "Incorrect payment details",
    "Payment method temporarily unavailable"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 flex items-center justify-center p-6">
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl max-w-md w-full">
        <CardBody className="p-6 text-center">
          {/* Error Icon */}
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-shark-900 mb-3 font-secondary">
            Payment Unsuccessful
          </h1>

          {/* Description */}
          <p className="text-base text-shark-600 mb-4 font-primary">
            We couldn&apos;t process your sponsorship payment at this time.
          </p>

          {/* Common Issues */}
          <div className="bg-red-50 rounded-lg p-3 mb-4 text-left">
            <div className="flex items-center mb-2">
              <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
              <span className="text-shark-700 font-medium font-secondary text-sm">Common Issues:</span>
            </div>
            <ul className="text-xs text-shark-600 space-y-1 font-primary">
              {commonIssues.map((issue, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2 mt-1">•</span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-shark-500 mb-6 font-primary">
            Don&apos;t worry! You can try again or use a different payment method. Your sponsorship details are saved.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => window.history.back()}
              className="w-full bg-verdant-600 hover:bg-verdant-700 text-white font-primary font-medium py-3"
              size="lg"
              startContent={<RotateCcw className="w-4 h-4" />}
            >
              Try Payment Again
            </Button>
            
            <Button
              as={Link}
              href="/Sponsor/sponsorship"
              variant="bordered"
              className="w-full border-verdant-600 text-verdant-600 hover:bg-verdant-50 font-primary font-medium py-3"
              size="lg"
              endContent={<ArrowRight className="w-4 h-4" />}
            >
              View My Sponsorships
            </Button>

            <Button
              as={Link}
              href="/Sponsor/dashboard"
              variant="light"
              className="w-full text-shark-600 hover:bg-shark-50 font-primary font-medium py-3"
              size="lg"
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Support Info */}
          <div className="mt-4 pt-3 border-t border-shark-200">
            <p className="text-xs text-shark-500 font-primary">
              Need help?{" "}
              <Link href="/support" className="text-verdant-600 hover:text-verdant-700 underline font-medium">
                Contact our support team
              </Link>
            </p>
          </div>

          {/* Auto redirect notice */}
          <p className="text-xs text-shark-400 mt-3 font-primary">
            You will be automatically redirected to your sponsorships in 10 seconds
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
