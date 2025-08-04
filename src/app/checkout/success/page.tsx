"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardBody, Button } from "@heroui/react";
import { CheckCircle, Receipt, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect to sponsorship dashboard after 10 seconds
    const timer = setTimeout(() => {
      router.push('/Sponsor/sponsorships/approved');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 flex items-center justify-center p-6">
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl max-w-lg w-full">
        <CardBody className="p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-verdant-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-verdant-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-shark-900 mb-4 font-secondary">
            Payment Successful!
          </h1>

          {/* Description */}
          <p className="text-lg text-shark-600 mb-6 font-primary">
            Thank you for your generous sponsorship! Your contribution makes a significant impact.
          </p>

          {/* Receipt Info */}
          <div className="bg-verdant-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Receipt className="w-5 h-5 text-verdant-600 mr-2" />
              <span className="text-shark-700 font-medium font-secondary">Receipt</span>
            </div>
            <p className="text-shark-600 text-sm font-primary">
              A receipt has been sent to your email address.
            </p>
          </div>

          {/* Additional Info */}
          <p className="text-sm text-shark-500 mb-8 font-primary">
            Your sponsorship transaction has been recorded successfully. You will receive updates about the event and your sponsorship benefits.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              as={Link}
              href="/Sponsor/sponsorships/approved"
              className="w-full bg-verdant-600 hover:bg-verdant-700 text-white font-primary font-medium py-3"
              size="lg"
              endContent={<ArrowRight className="w-4 h-4" />}
            >
              View My Sponsorships
            </Button>
            
            <Button
              as={Link}
              href="/Sponsor/dashboard"
              variant="bordered"
              className="w-full border-verdant-600 text-verdant-600 hover:bg-verdant-50 font-primary font-medium py-3"
              size="lg"
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Auto redirect notice */}
          <p className="text-xs text-shark-400 mt-6 font-primary">
            You will be automatically redirected to your sponsorships in 10 seconds
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
