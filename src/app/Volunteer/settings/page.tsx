"use client";

import { useEffect, useState } from "react";
import {
  getVolunteerSettingsByUsername,
  updateVolunteerEmail,
  VolunteerSettings,
} from "@/services/volunteerSettingsService";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";

const SettingsPage = () => {
  const [volunteer, setVolunteer] = useState<VolunteerSettings | null>(null);
  const [loading, setLoading] = useState(true);
  //const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const router = useRouter();
  const username = "marie";

  useEffect(() => {
    const loadVolunteer = async () => {
      try {
        const data = await getVolunteerSettingsByUsername(username);
        setVolunteer(data);
        setNewEmail(data.email);
      } catch (error) {
        console.error("Failed to fetch volunteer", error);
      } finally {
        setLoading(false);
      }
    };
    loadVolunteer();
  }, []);

  const handleSaveEmail = async () => {
    if (!volunteer) return;

    try {
      const updated = await updateVolunteerEmail(
        volunteer.volunteerId,
        newEmail
      );
      setVolunteer(updated);
      setEditingEmail(false);
    } catch (error) {
      console.error("Failed to update email:", error);
    }
  };

  return (
    <div className="p-5">
      <span className="text-shark-300">Volunteer / Settings</span>
      <h1 className="font-secondary font-bold mb-6 text-2xl mt-2">Settings</h1>

      <div className="bg-[#FBFBFB] shadow-sm rounded-2xl p-6 mb-6 pr-20 pl-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-secondary font-semibold text-xl">
              Your email address
            </h2>
            <div className="mb-4 text-shark-700">
              {!editingEmail ? (
                volunteer?.email || (
                  <div className="h-4 w-32 bg-shark-100 rounded animate-pulse"></div>
                )
              ) : (
                <>
                  <div className="mb-2">{volunteer?.email}</div>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="border border-shark-200 px-3 py-2 w-full max-w-md text-shark-950 rounded-2xl"
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

          <div className="flex flex-col justify-start">
            <div className="font-secondary text-shark-950 font-medium">
              Your username
            </div>
            <div className="font-secondary text-shark-700">
              {volunteer ? (
                `${volunteer.username} (not editable)`
              ) : (
                <div className="h-4 w-24 bg-shark-100 rounded animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Phone Verification */}
      <div className="bg-[#FBFBFB] shadow-sm rounded-2xl p-6 mb-6 pr-20 pl-10">
        <h2 className="font-secondary font-semibold text-xl mb-2">
          Phone Verification
        </h2>
        <div className="mb-4 text-shark-700">
          Your account is not verified. Verifying your account with a phone
          number allows you to do more on Voluntrix.
        </div>
        <Button className="rounded-full bg-shark-950 text-shark-50 font-primary">
          Phone verify
        </Button>
      </div>

      {/* Availability */}
      <div className="bg-[#FBFBFB] shadow-sm rounded-2xl p-6 mb-6 pr-20 pl-10">
        <h2 className="font-secondary font-semibold text-xl mb-2">
          Availability
        </h2>
        <div className="mb-4 text-shark-700">
          While unavailable, your account will be hidden and rewards won’t get
          affected.
        </div>
        <Button className="rounded-full bg-shark-950 text-shark-50 font-primary">
          Set Your Availability
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#FBFBFB] shadow-sm rounded-2xl p-6 pr-20 pl-10">
        <h2 className="font-secondary font-semibold text-xl text-red-600 mb-2">
          Danger Zone
        </h2>
        <div className="mb-4 text-shark-700">
          Permanently delete your account and all data.
        </div>
        <Button className="rounded-full bg-red-600 text-shark-50 font-primary">
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
