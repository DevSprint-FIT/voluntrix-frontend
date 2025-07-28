"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrganizationByUsername } from "@/services/organizationProfileService";
import ProfileHeader from "@/components/UI/ProfileHeader";
import AboutSection from "@/components/UI/AboutSection";
import BankInformation from "@/components/UI/BankInformation";
import ContactInformation from "@/components/UI/ContactInformation";
import SocialLinks from "@/components/UI/SocialLinks";

const Page = () => {
  const params = useParams();

if (!params || typeof params.username !== "string") {
  throw new Error("Username parameter is missing or invalid.");
}

const username = params.username;

  const [organizationData, setOrganizationData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getOrganizationByUsername(username);
        setOrganizationData(data);
      } catch (error) {
        console.error("Error fetching organization data:", error);
        setError("Failed to load organization data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) {
    return (
      <div className="container mx-auto p-5 mt-0">
        <span className="text-shark-300">Organization / Profile</span>
        <h1 className="text-2xl font-primary font-bold mb-4">Profile</h1>
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !organizationData) {
    return (
      <div className="container mx-auto p-5 mt-0">
        <span className="text-shark-300">Organization / Profile</span>
        <h1 className="text-2xl font-primary font-bold mb-4">Profile</h1>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">
            {error || "Organization not found"}
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5 mt-0">
      {/* Title */}
      <span className="text-shark-300">Organization / Profile</span>
      <h1 className="text-2xl font-primary font-bold mb-4">Profile</h1>

      {/* ProfileHeader Section */}
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

      {/* AboutSection */}
      <AboutSection description={organizationData?.description} />

      {/* Contact and Bank Information */}
      <div className="flex gap-24">
        <ContactInformation
          data={{
            email: organizationData.email,
            phone: organizationData.phone,
            website: organizationData.website,
          }}
        />
        <BankInformation
          data={{
            bankName: organizationData.bankName,
            accountNumber: organizationData.accountNumber,
          }}
        />
      </div>

      {/* Social Links */}
      <SocialLinks
        data={{
          facebookLink: organizationData.facebookLink,
          instagramLink: organizationData.instagramLink,
          linkedinLink: organizationData.linkedinLink,
        }}
      />
    </div>
  );
};

export default Page;