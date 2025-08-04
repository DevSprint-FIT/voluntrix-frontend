/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { startPayment, PaymentDetails, checkPaymentStatus } from "@/services/paymentService";

declare global {
  interface Window {
    payhere: any;
  }
}

const dummyData : PaymentDetails = {
  "orderId": "ORD999045",
  "amount": "100",
  "currency": "LKR",
  "firstName": null,
  "lastName": null,
  "email": "samantha@gmail.com",
  "phone": null,
  "address": null,
  "city": null,
  "country": null,
  "userType": "SPONSOR",
  "volunteerId": null,
  "sponsorId": 1,
  "eventId": 1,
  "isAnnonymous": false,
  "transactionType": "SPONSORSHIP"
}


export default function PaymentPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.payhere) {
      window.payhere.onCompleted = function (orderId: string) {
        let attempts = 0;
        const interval = setInterval(async () => {
          try {
            const status = await checkPaymentStatus(orderId);
            if(status === "SUCCESS") {
              clearInterval(interval);
              window.location.href = "/checkout/success";
            } else if (status === "FAILED" || attempts > 10) {
              clearInterval(interval);
              window.location.href = "/checkout/fail";
            }
            attempts++;
          } catch (error) {
            clearInterval(interval);
            window.location.href = "/checkout/fail";
          }
        }, 1000);
      };
  
      window.payhere.onDismissed = function () {
        window.location.href = "/checkout/fail";
      };
  
      window.payhere.onError = function (error: any) {
        console.error("Error occurred:", error);
        window.location.href = "/checkout/fail";
      };
    }
  }, []);
  
  const handlePayment = async () => {
    const paymentDetails: PaymentDetails = dummyData;

    console.log("Starting payment with details:", paymentDetails);
    console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

    try {
      const { hash, merchantId } = await startPayment(paymentDetails);
      
      console.log("Payment response:", { hash, merchantId });
      
      const payment = {
        sandbox: true,
        merchant_id: merchantId,
        return_url: process.env.NEXT_PUBLIC_PAYHERE_RETURN_URL,
        cancel_url: process.env.NEXT_PUBLIC_PAYHERE_FAIL_URL,
        notify_url: process.env.NEXT_PUBLIC_PAYHERE_NOTIFY_URL,
        order_id: paymentDetails.orderId,
        items: paymentDetails.transactionType,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        first_name: paymentDetails.firstName,
        last_name: paymentDetails.lastName,
        email: paymentDetails.email,
        phone: paymentDetails.phone,
        address: paymentDetails.address,
        city: paymentDetails.city,
        country: paymentDetails.country,
        hash: hash,
      };

      console.log("PayHere payment object:", payment);
      window.payhere.startPayment(payment);
    } catch (error) {
      console.error("Payment failed:", error);
      alert(`Payment failed: ${error}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Proceed to Payment</h1>
      <button
        id="payhere-payment"
        onClick={handlePayment}
        className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
      >
        PayHere Pay
      </button>
    </div>
  );
}
