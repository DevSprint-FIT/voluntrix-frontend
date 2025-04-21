/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { startPayment, PaymentDetails } from "@/services/paymentService";

declare global {
  interface Window {
    payhere: any;
  }
}

export default function PaymentPage() {

  useEffect(() => {
    if (typeof window !== "undefined" && window.payhere) {
      window.payhere.onCompleted = function (orderId: string) {
        console.log("Payment completed! OrderID:", orderId);
        window.location.href = "/checkout/success";
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
    const paymentDetails: PaymentDetails = {
      orderId: "ItemNo12345",
      amount: "100.00",
      currency: "LKR",
      firstName: "Saman",
      lastName: "Perera",
      email: "samanp@gmail.com",
      phone: "0771234567",
      address: "No.1, Galle Road",
      city: "Colombo",
      country: "Sri Lanka",
    };

    try {
      const { hash, merchantId } = await startPayment(paymentDetails);
      
      console.log("Hash and Merchant ID received:", hash, merchantId);

      const payment = {
        sandbox: true,
        merchant_id: merchantId,
        return_url: process.env.NEXT_PUBLIC_PAYHERE_RETURN_URL,
        cancel_url: process.env.NEXT_PUBLIC_PAYHERE_FAIL_URL,
        notify_url: process.env.NEXT_PUBLIC_PAYHERE_NOTIFY_URL,
        order_id: paymentDetails.orderId,
        items: "Item Title",
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

      window.payhere.startPayment(payment);
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Proceed to Payment</h1>
      <button
        id="payhere-payment"
        onClick={handlePayment}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
      >
        PayHere Pay
      </button>
    </div>
  );
}
