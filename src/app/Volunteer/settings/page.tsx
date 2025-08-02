"use client";

import { useEffect, useState } from "react";
import {
  getVolunteerSettings,
  updateVolunteerEmail,
  updateVolunteerAvailability,
  VolunteerSettings,
} from "@/services/volunteerSettingsService";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import ProfileIndicator from "@/components/UI/ProfileIndicator";

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
            className={`rounded-full font-primary tracking-wide text-base ${
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

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDestructive = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="text-red-600 mr-3" size={24} />
          <h2 className="text-lg font-semibold font-secondary text-gray-900">
            {title}
          </h2>
        </div>
        <p className="text-gray-600 font-secondary mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button
            onPress={onClose}
            className="rounded-full bg-shark-100 text-shark-900 font-primary tracking-wide text-base"
          >
            {cancelText}
          </Button>
          <Button
            onPress={onConfirm}
            className={`rounded-full font-primary tracking-wide text-base ${
              isDestructive
                ? "bg-red-600 text-white"
                : "bg-shark-950 text-shark-50"
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const [volunteer, setVolunteer] = useState<VolunteerSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const loadVolunteer = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getVolunteerSettings();
        setVolunteer(data);
        setNewEmail(data.email);
      } catch (error) {
        console.error("Failed to fetch volunteer settings:", error);
        setError("Failed to load volunteer settings");
      } finally {
        setLoading(false);
      }
    };
    loadVolunteer();
  }, []);

  const handleSaveEmail = async () => {
    if (!volunteer) return;

    try {
      const updated = await updateVolunteerEmail(newEmail);
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
      const updated = await updateVolunteerAvailability(newAvailability);
      setVolunteer(updated);

      // Show success modal
      setModalType("success");
      setModalTitle("Availability Updated");
      setModalMessage(
        `Your availability has been updated to ${
          newAvailability ? "Available" : "Not Available"
        }.`
      );
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to update availability:", error);

      // Show error modal
      setModalType("error");
      setModalTitle("Update Failed");
      setModalMessage(
        error instanceof Error
          ? error.message
          : "Failed to update availability. Please try again."
      );
      setModalOpen(true);
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const handleDeleteAccount = () => {
    // This is just for display - no actual functionality implemented
    console.log("Delete account clicked - functionality not implemented");
  };

  if (loading) {
    return (
      <div className="p-5 h-screen">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-shark-300">Volunteer / Settings</span>
            <h1 className="font-secondary font-bold text-2xl mt-2">Settings</h1>
          </div>
          <ProfileIndicator />
        </div>
        <div className="flex items-center justify-center h-full -mt-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verdant-700"></div>
            <p className="text-shark-700 font-secondary">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !volunteer) {
    return (
      <div className="p-5">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-shark-300">Volunteer / Settings</span>
            <h1 className="font-secondary font-bold text-2xl mt-2">Settings</h1>
          </div>
          <ProfileIndicator />
        </div>
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">
            {error || "Volunteer settings not found"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-shark-300">Volunteer / Settings</span>
          <h1 className="font-secondary font-bold text-2xl mt-2">Settings</h1>
        </div>
        <ProfileIndicator />
      </div>

      {/* Email Section */}
      <div className="bg-[#FBFBFB] shadow-sm rounded-2xl p-6 mb-6 pr-20 pl-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-secondary font-semibold text-2xl">
              Your email address
            </h2>
            <div className="mb-4 text-shark-700">
              {!editingEmail ? (
                volunteer.email
              ) : (
                <>
                  <div className="mb-2">{volunteer.email}</div>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="border border-shark-200 px-3 py-2 w-full max-w-md text-shark-950 rounded-2xl"
                    placeholder="Enter new email"
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      onPress={() => {
                        setEditingEmail(false);
                        setNewEmail(volunteer.email);
                      }}
                      className="rounded-full bg-shark-100 text-shark-900 font-primary tracking-wide text-base"
                    >
                      Cancel
                    </Button>
                    <Button
                      onPress={handleSaveEmail}
                      className="rounded-full bg-shark-950 text-shark-50 font-primary tracking-wide text-base"
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
                className="rounded-full bg-shark-950 text-shark-50 font-primary tracking-wide text-base"
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
              {volunteer.username} (not editable)
            </div>
          </div>
        </div>
      </div>

      {/* Availability Section */}
      <div className="bg-[#FBFBFB] shadow-sm rounded-2xl p-6 mb-6 pr-20 pl-10">
        <h2 className="font-secondary font-semibold text-2xl mb-2">
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
                volunteer.isAvailable ? "text-green-600" : "text-red-600"
              }`}
            >
              {volunteer.isAvailable ? "Available" : "Not Available"}
            </div>
          </div>
        </div>
        <Button
          onPress={handleToggleAvailability}
          disabled={updatingAvailability}
          className="rounded-full bg-shark-950 text-shark-50 font-primary tracking-wide text-base"
        >
          {updatingAvailability
            ? "Updating..."
            : volunteer.isAvailable
            ? "Set Not Available"
            : "Set Available"}
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#FBFBFB] shadow-sm rounded-2xl p-6 pr-20 pl-10">
        <h2 className="font-secondary font-semibold text-2xl text-red-600 mb-2">
          Danger Zone
        </h2>
        <div className="mb-4 text-shark-700">
          Permanently delete your account and all data.
        </div>
        <Button
          onPress={handleDeleteAccount}
          className="rounded-full bg-red-600 text-shark-50 font-primary tracking-wide text-base"
        >
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
