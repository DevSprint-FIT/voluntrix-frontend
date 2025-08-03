"use client";

import React from "react";

interface ContactInformationProps {
  data?: {
    email?: string; 
    phone?: string; 
    website?: string; 
  };
}

const ContactInformation: React.FC<ContactInformationProps> = ({ data }) => {
  return (
    <div className="bg-[#FBFBFB] p-6 rounded-lg shadow-sm flex-1 mb-6">
      <h2 className="font-secondary text-xl font-medium mb-2">Contact Information</h2>
      <div className="space-y-4">
        <div>
          <p className="text-shark-500">Email</p>
          <div>
            {data?.email !== undefined && data?.email !== null
              ? (data.email || "-")
              : <div className="w-48 h-4 bg-shark-100 rounded"></div>}
          </div>
        </div>

        <div>
          <p className="text-shark-500">Phone</p>
          <div>
            {data?.phone !== undefined && data?.phone !== null
              ? (data.phone || "-")
              : <div className="w-32 h-4 bg-shark-100 rounded"></div>}
          </div>
        </div>

        <div>
          <p className="text-shark-500">Website</p>
          <div>
            {data?.website !== undefined && data?.website !== null
              ? (data.website || "-")
              : <div className="w-40 h-4 bg-shark-100 rounded"></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
