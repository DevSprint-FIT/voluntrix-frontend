// src/components/BankInformation.tsx
"use client";

import React from "react";

interface BankInformationProps {
  data: {
    bankName?: string;
    accountNumber?: string;
  };
}

const BankInformation: React.FC<BankInformationProps> = ({ data }) => {
    return (
      <div className="bg-shark-50 p-6 rounded-lg shadow flex-1 mb-6">
        <h2 className="text-xl font-semibold mb-2">Bank Information</h2>
        <div className="space-y-4">
          <div>
            <p>Bank Name</p>
            <p>{data?.bankName || "Not Provided"}</p>
          </div>
          
          <div>
            <p>Account Number</p>
            <p> {data?.accountNumber ? `****${data.accountNumber.slice(-4)}` : "Not Provided"}</p>
          </div>
         
        </div>
      </div>
    );
  };
  
  export default BankInformation;
