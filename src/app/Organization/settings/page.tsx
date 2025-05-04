"use client";

import { useEffect, useState } from "react";
import { getOrganizationSettingsByUsername, OrganizationSettings } from "@/services/organizationSettingsService";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

const SettingsPage = () => {
  const [organization, setOrganization] = useState<OrganizationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const username = "IEEEUOM"; 

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const data = await getOrganizationSettingsByUsername(username);
        setOrganization(data);
      } catch (error) {
        console.error("Failed to fetch organization", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrganization();
  }, []);

  return (
    <div className="p-5">
      <span className="text-shark-300">Organization / Settings</span>
      <h1 className="font-secondary font-bold mb-6 text-2xl mt-2">Settings</h1>

      {/* Email Section */}
      <div className="bg-shark-50 shadow rounded-2xl p-6 mb-6 pr-20 pl-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-secondary font-semibold text-xl">Your email address</h2>
            <p className="mb-4 text-shark-700">
              {organization?.email || <div className="h-4 w-32 bg-shark-100 rounded animate-pulse"></div>}
            </p>
            <Button className="rounded-full bg-shark-950 text-shark-50 font-primary">
              Change email
            </Button>
          </div>
          <div className="flex flex-col">
            <p className="font-secondary text-shark-950 font-medium">Your username</p>
            <p className="font-secondary text-shark-600">
              {organization
                ? `@${organization.username.replace(/\s+/g, "")}`
                : <div className="h-4 w-24 bg-shark-100 rounded animate-pulse" />}
            </p>
            <p className="font-secondary text-shark-950 mt-2 font-medium">Account Number</p>
            <p className="font-secondary text-shark-600">
              {organization?.accountNumber || <div className="h-4 w-28 bg-shark-100 rounded animate-pulse"></div>}
            </p>
          </div>
        </div>
      </div>

      {/* Phone Verification Section */}
      <div className="bg-shark-50 shadow rounded-2xl p-6 mb-6 pr-20 pl-10">
        <h2 className="font-secondary font-semibold text-xl mb-2">Phone Verification</h2>
        <p className="mb-4 text-shark-700">
          {organization?.isVerified
            ? "Your account is verified."
            : organization !== null
            ? "Your account is not verified. Verifying your account with a phone number allows you to do more on Voluntrix, and helps prevent spam and other abuse."
            : <div className="h-4 w-full max-w-md bg-shark-100 rounded animate-pulse"></div>}
        </p>
        {organization && !organization.isVerified && (
          <Button className="rounded-full bg-shark-950 text-shark-50 font-primary">
            Phone verify
          </Button>
        )}
      </div>

      {/* Danger Zone Section */}
      <div className="bg-shark-50 shadow rounded-2xl p-6 pl-10">
        <h2 className="font-secondary font-semibold text-xl text-red-600 mb-2">Danger Zone</h2>
        <p className="mb-4 text-gray-500">Permanently delete your account and all data.</p>
        <Button className="rounded-full bg-red-600 text-shark-50 font-primary">
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
