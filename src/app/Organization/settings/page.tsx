"use client";

import { useEffect, useState } from "react";
import {
  getOrganizationSettingsByUsername,
  updateOrganizationEmail,
  OrganizationSettings,
  deleteOrganizationById
} from "@/services/organizationSettingsService";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import PhoneVerificationModal from "@/components/UI/PhoneVerification";
import AccountDeletionModal from "@/components/UI/AccountDeletion";
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
              <CheckCircle className="text-verdant-600" size={24} />
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
                ? "bg-verdant-600 text-white"
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
  const [organization, setOrganization] = useState<OrganizationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [orgProfile, setOrgProfile] = useState<{
  imageUrl: string;
  name: string;
  institute: string;
} | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

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

    console.log("Starting email update...");
    
    try {
      const updated = await updateOrganizationEmail(organization.id, newEmail);
      console.log("Email update successful:", updated);
      
      setOrganization(updated);
      setEditingEmail(false);

      // Show success modal
      setModalType("success");
      setModalTitle("Email Updated");
      setModalMessage("Your email address has been successfully updated.");
      setModalOpen(true);
      
      console.log("Success modal should show now");
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
      
      console.log("Error modal should show now");
    }
  };

  return (
    <div className="p-5">
        {/* Title with Organization Info */}
      <div className="flex justify-between items-center mb-4 px-4">
      {/* Left Side: Title */}
        <div>
           <p className="text-shark-300">Organization / Settings</p>
           <h1 className="text-2xl font-primary font-bold">Settings</h1>
        </div>

      {/* Right Side: Organization Info */}
         <div className="flex items-center gap-3">
           <img
             src={organization?.imageUrl} 
             alt="Organization Logo"
             className="w-10 h-10 rounded-full object-cover"
           />
         <div>
           <h2 className="font-semibold font-secondary text-xl leading-tight">{organization?.name}</h2> 
           <p className="font-secondary font-semibold text-shark-600 text-xs leading-tight">{organization?.institute}</p>       
         </div>
       </div>
    </div>

      {/* Email Section */}
      <div className="bg-[#FBFBFB] shadow-sm  rounded-2xl p-6 mb-6 pr-20 pl-10">
        <div className="flex justify-between items-start mb-4">
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
                      className="!rounded-full bg-shark-100 text-shark-900 font-primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onPress={handleSaveEmail}
                      className="!rounded-full bg-shark-950 text-shark-50 font-primary"
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
                className="!rounded-full bg-shark-950 text-shark-50 font-primary"
              >
                Change email
              </Button>
            )}
          </div>

          {/* Username */}
          <div className="flex flex-col justify-start">
            <div className="font-secondary text-shark-950 font-medium">Your username</div>
            <div className="font-secondary  text-shark-700">
              {organization ? (
                `${organization.username} (not editable)`
              ) : (
                <div className="h-4 w-24 bg-shark-100 rounded animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone Section */}
      <div className="bg-[#FBFBFB] shadow-sm rounded-2xl p-6 pl-10">
        <h2 className="font-secondary font-semibold text-xl text-red-600 mb-2">Danger Zone</h2>
        <div className="mb-4 text-shark-700">Permanently delete your account and all data.</div>
        <Button
          onPress={() => setOpen(true)}
          className="!rounded-full bg-red-600 text-shark-50 font-primary"
        >
          Delete Account
        </Button>
      </div>

      {/* Modals */}
      <PhoneVerificationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AccountDeletionModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={async () => {
          if(!organization) return;

          try {
            await deleteOrganizationById(organization.id);
            setOpen(false);
            router.push("/");
          } catch (error) {
             console.error("Failed to delete account", error);
          }
        }}
      />

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