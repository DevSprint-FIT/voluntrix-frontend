"use client";

import { useEffect, useState } from "react";
import {
  getOrganizationSettingsByUsername,
  updateOrganizationEmail,
  OrganizationSettings,
} from "@/services/organizationSettingsService";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import PhoneVerificationModal from "@/components/UI/PhoneVerification";
import AccountDeletionModal from "@/components/UI/AccountDeletion";

const SettingsPage = () => {
  const [organization, setOrganization] = useState<OrganizationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const router = useRouter();
  const username = "IEEESLIT";

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const data = await getOrganizationSettingsByUsername(username);
        setOrganization(data);
        setNewEmail(data.email); // pre-fill current email
      } catch (error) {
        console.error("Failed to fetch organization", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrganization();
  }, []);

  const handleSaveEmail = async () => {
    if (!organization) return;

    try {
      const updated = await updateOrganizationEmail(organization.id, newEmail);
      setOrganization(updated);
      setEditingEmail(false);
    } catch (error) {
      console.error("Failed to update email:", error);
    }
  };

  return (
    <div className="p-5">
      <span className="text-shark-300">Organization / Settings</span>
      <h1 className="font-secondary font-bold mb-6 text-2xl mt-2">Settings</h1>

      {/* Email Section */}
      <div className="bg-shark-50 shadow rounded-2xl p-6 mb-6 pr-20 pl-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-secondary font-semibold text-xl">Your email address</h2>

            <div className="mb-4 text-shark-700">
              {!editingEmail ? (
                organization?.email || (
                  <div className="h-4 w-32 bg-shark-100 rounded animate-pulse"></div>
                )
              ) : (
                <>
                  <div className="mb-2">{organization?.email}</div>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="border border-shark-200  px-3 py-2 w-full max-w-md text-shark-950 rounded-2xl"
                    placeholder="Enter new email"
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      onPress={() => setEditingEmail(false)}
                      className="rounded-full bg-shark-100 text-shark-900 font-primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onPress={handleSaveEmail}
                      className="rounded-full bg-shark-950 text-shark-50 font-primary"
                    >
                      Save
                    </Button>
                  </div>
                </>
              )}
            </div>

            {!editingEmail && (
              <Button
                onPress={() => setEditingEmail(true)}
                className="rounded-full bg-shark-950 text-shark-50 font-primary"
              >
                Change email
              </Button>
            )}
          </div>

          {/* Username and Account Number */}
          <div className="flex flex-col">
            <div className="font-secondary text-shark-950 font-medium">Your username</div>
            <div className="font-secondary text-shark-600">
              {organization ? (
                `@${organization.username.replace(/\s+/g, "")}`
              ) : (
                <div className="h-4 w-24 bg-shark-100 rounded animate-pulse" />
              )}
            </div>

            <div className="font-secondary text-shark-950 mt-2 font-medium">Account Number</div>
            <div className="font-secondary text-shark-600">
              {organization?.accountNumber || (
                <div className="h-4 w-28 bg-shark-100 rounded animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Phone Verification Section */}
      <div className="bg-shark-50 shadow rounded-2xl p-6 mb-6 pr-20 pl-10">
        <h2 className="font-secondary font-semibold text-xl mb-2">Phone Verification</h2>
        <div className="mb-4 text-shark-700">
          {organization?.isVerified ? (
            "Your account is verified."
          ) : organization !== null ? (
            "Your account is not verified. Verifying your account with a phone number allows you to do more on Voluntrix, and helps prevent spam and other abuse."
          ) : (
            <div className="h-4 w-full max-w-md bg-shark-100 rounded animate-pulse"></div>
          )}
        </div>

        {organization && !organization.isVerified && (
          <Button
            onPress={() => setIsModalOpen(true)}
            className="rounded-full bg-shark-950 text-shark-50 font-primary"
          >
            Phone verify
          </Button>
        )}
      </div>

      {/* Danger Zone Section */}
      <div className="bg-shark-50 shadow rounded-2xl p-6 pl-10">
        <h2 className="font-secondary font-semibold text-xl text-red-600 mb-2">Danger Zone</h2>
        <div className="mb-4 text-gray-500">Permanently delete your account and all data.</div>
        <Button
          onPress={() => setOpen(true)}
          className="rounded-full bg-red-600 text-shark-50 font-primary"
        >
          Delete Account
        </Button>
      </div>

      {/* Modals */}
      <PhoneVerificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AccountDeletionModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          console.log("Confirmed deletion");
          setOpen(false);
        }}
      />
    </div>
  );
};

export default SettingsPage;
