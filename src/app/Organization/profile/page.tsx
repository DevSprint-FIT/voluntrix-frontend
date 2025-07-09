"use client";

import React, { useEffect, useState } from "react";
import { getOrganizationByUsername } from "@/services/organizationProfileService";
import ProfileHeader from "@/components/UI/ProfileHeader";
import AboutSection from "@/components/UI/AboutSection";
import BankInformation from "@/components/UI/BankInformation";
import ContactInformation from "@/components/UI/ContactInformation";
import SocialLinks from "@/components/UI/SocialLinks";
import { Button } from "@heroui/react";
import { Pencil } from "lucide-react";

const Page = () => {
  const [organizationData, setOrganizationData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrganizationByUsername("IEEESLIT");
        setOrganizationData(data);
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-5 mt-0">
      {/* Title */}
      <span className="text-shark-300">Organization / Profile</span>
      <h1 className="text-2xl font-primary font-bold mb-4">Profile</h1>

      {/* ProfileHeader Section */}
      {!organizationData ? (
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-6"></div>
      ) : (
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
      )}

      {/* AboutSection */}
      <AboutSection description={organizationData?.description} />

      {/* Contact and Bank Information */}
      <div className="flex gap-24">
        <ContactInformation
          data={
            organizationData
              ? {
                  email: organizationData.email,
                  phone: organizationData.phone,
                  website: organizationData.website,
                }
              : undefined
          }
        />
        <BankInformation
          data={
            organizationData
              ? {
                  bankName: organizationData.bankName,
                  accountNumber: organizationData.accountNumber,
                }
              : undefined
          }
        />
      </div>

      {/* Social Links */}
      <SocialLinks
        data={
          organizationData
            ? {
                facebookLink: organizationData.facebookLink,
                instagramLink: organizationData.instagramLink,
                linkedinLink: organizationData.linkedinLink,
              }
            : undefined
        }
      />
    </div>
  );
};

export default Page;
