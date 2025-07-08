"use client";

import { useEffect, useState } from "react";
import {
  getVolunteerSettingsByUsername,
  updateVolunteerEmail,
  updateVolunteerAvailability,
  VolunteerSettings,
} from "@/services/volunteerSettingsService";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { X, CheckCircle, AlertCircle } from "lucide-react";

// Modal Component
const NotificationModal = ({
  isOpen,
  onClose,
  type,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {type === "success" ? (
              <CheckCircle className="text-green-600" size={24} />
            ) : (
              <AlertCircle className="text-red-600" size={24} />
            )}
            <h2 className="text-lg font-semibold font-secondary text-gray-900">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 font-secondary mb-6">{message}</p>
        <div className="flex justify-end">
          <Button
            onPress={onClose}
            className={`rounded-full font-primary ${
              type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const [volunteer, setVolunteer] = useState<VolunteerSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const router = useRouter();
  const username = "anne13";

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

      // Show success modal
      setModalType("success");
      setModalTitle("Email Updated");
      setModalMessage("Your email address has been successfully updated.");
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to update email:", error);

      // Show error modal
      setModalType("error");
      setModalTitle("Update Failed");
      setModalMessage(
        error instanceof Error
          ? error.message
          : "Failed to update email address. Please try again."
      );
      setModalOpen(true);
    }
  };

  const handleToggleAvailability = async () => {
    if (!volunteer) return;

    setUpdatingAvailability(true);
    try {
      const newAvailability = !volunteer.isAvailable;
      const updated = await updateVolunteerAvailability(
        volunteer.volunteerId,
        newAvailability
      );
      setVolunteer(updated);
    } catch (error) {
      console.error("Failed to update availability:", error);
    } finally {
      setUpdatingAvailability(false);
    }
  };

  if (loading) {
    return (
      <div className="p-5">
        <span className="text-shark-300">Volunteer / Settings</span>
        <h1 className="font-secondary font-bold mb-6 text-2xl mt-2">
          Settings
        </h1>
        <div className="bg-[#FBFBFB] shadow-sm rounded-2xl p-6 mb-6 pr-20 pl-10">
          <div className="animate-pulse">
            <div className="h-6 bg-shark-100 rounded mb-4"></div>
            <div className="h-4 bg-shark-100 rounded mb-2"></div>
            <div className="h-4 bg-shark-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Availability */}
      <div className="bg-[#FBFBFB] shadow-sm rounded-2xl p-6 mb-6 pr-20 pl-10">
        <h2 className="font-secondary font-semibold text-xl mb-2">
          Availability
        </h2>
        <div className="mb-4 text-shark-700">
          While unavailable, your account will be hidden and rewards won't get
          affected.
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="font-secondary text-shark-950 font-medium">
              Current Status:
            </div>
            <div
              className={`font-secondary font-medium ${
                volunteer?.isAvailable ? "text-green-600" : "text-red-600"
              }`}
            >
              {volunteer?.isAvailable ? "Available" : "Not Available"}
            </div>
          </div>
        </div>
        <Button
          onPress={handleToggleAvailability}
          disabled={updatingAvailability}
          className="rounded-full bg-shark-950 text-shark-50 font-primary"
        >
          {updatingAvailability
            ? "Updating..."
            : volunteer?.isAvailable
            ? "Set Not Available"
            : "Set Available"}
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

      {/* Notification Modal */}
      <NotificationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
      />
    </div>
  );
};

export default SettingsPage;
