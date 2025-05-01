"use client"
import React from "react";

interface ContactInformationProps {
  data?: {
    email: string;
    phone: string;
    website?: string;
  };
}

const ContactInformation: React.FC<ContactInformationProps> = ({ data }) => {
  return (
    <div className="bg-shark-50 p-6 rounded-lg shadow flex-1 ">
      <h2 className="font-secondary text-xl font-medium mb-2">Contact Information</h2>
      <div  className="space-y-4">
        <div>
          <p className="text-shark-500">Email</p>
          <p>{data?.email || "Not Provided"}</p>
        </div>

        <div>
          <p className="text-shark-500">Phone</p>
          <p>{data?.phone || "Not Provided"}</p>
        </div>

        <div>
          <p className="text-shark-500">Website</p>
          <p>{data?.website || "Not Provided"}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
