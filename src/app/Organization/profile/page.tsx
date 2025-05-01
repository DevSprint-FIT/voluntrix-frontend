"use client";

import React, { useEffect, useState } from "react";
import { getOrganizationByUsername } from "@/services/organizationProfileService"; 

import ProfileHeader from "@/components/UI/ProfileHeader"; 
import AboutSection from "@/components/UI/AboutSection";
import BankInformation from "@/components/UI/BankInformation";
import ContactInformation from "@/components/UI/ContactInformation";

const Page = () => {
  const [organizationData, setOrganizationData] = useState<any>(null); 

  useEffect(() => {
    // Fetch organization data by username
    const fetchData = async () => {
      try {
        const data = await getOrganizationByUsername("IEEEUOM"); // Replace with the actual username
        setOrganizationData(data);
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };

    fetchData();
  }, []);

  if (!organizationData) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="container mx-auto p-6">
      <ProfileHeader
         data={{
           name: organizationData.name,
           username: organizationData.username,
           institute: organizationData.institute,
           isVerified: organizationData.isVerified,
           followerCount: organizationData.followerCount,
           joinedDate: organizationData.joinedDate,
           imageUrl: organizationData.imageUrl, 
  }}
/>

      <AboutSection description={organizationData.description} />
      <div className="flex gap-24">
      <ContactInformation data={{ email: organizationData.email, phone: organizationData.phone, website: organizationData.website }} />
      <BankInformation data={{ bankName: organizationData.bankName, accountNumber: organizationData.accountNumber }} />
      
      </div>
      
    </div>
  );
};

export default Page;
