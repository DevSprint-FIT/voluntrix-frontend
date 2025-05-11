"use client";

import React from "react";

interface BankInformationProps {
  data?: {
    bankName?: string;
    accountNumber?: string;
  };
}

const BankInformation: React.FC<BankInformationProps> = ({ data }) => {
  return (
    <div className="bg-[#FBFBFB] p-6 rounded-lg shadow-sm flex-1 mb-6">
      <h2 className="text-xl font-semibold mb-2">Bank Information</h2>
      <div className="space-y-4">
        {/* Bank Name */}
        <div>
          <p className="text-shark-500">Bank Name</p>
          <div>
            {data?.bankName !== undefined && data?.bankName !== null
              ? (data.bankName || "-")
              : <div className="w-48 h-4 bg-shark-100 rounded"></div>}
          </div>
        </div>

        {/* Account Number */}
        <div>
          <p className="text-shark-500">Account Number</p>
          <div>
            {data?.accountNumber !== undefined && data?.accountNumber !== null
              ? (data.accountNumber
                  ? `****${data.accountNumber.slice(-4)}`
                  : "-")
              : <div className="w-32 h-4 bg-shark-100 rounded"></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankInformation;
