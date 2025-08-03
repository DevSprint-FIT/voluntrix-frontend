import { useEffect, useState } from "react";
import { getAllOrganizations, getFollowedOrganizationIds, followOrganization } from "@/services/publicSocialFeedService";
import { PublicFeedOrganizationDetails } from "@/services/types";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@heroui/react";

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

export default function SuggestedOrganizations() {
  const [unfollowedOrgs, setUnfollowedOrgs] = useState<PublicFeedOrganizationDetails[]>([]);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      const allOrgs = await getAllOrganizations();
      const followedOrgIds = await getFollowedOrganizationIds();

      const unfollowed = allOrgs.filter(org => !followedOrgIds.includes(org.id));
      setUnfollowedOrgs(unfollowed);
    }

    fetchData(); 
  }, []);

  const handleFollow = async (orgId: number) => {
    try {
      await followOrganization(orgId);
      setUnfollowedOrgs(prev => prev.filter(org => org.id !== orgId));

      // Show success modal
      setModalType("success");
      setModalTitle("Successfully Followed");
      setModalMessage("You are now following this organization.");
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to follow organization:", error);
      // Show error modal
      setModalType("error");
      setModalTitle("Follow Failed");
      setModalMessage(
        error instanceof Error
          ? error.message
          : "Failed to follow organization. Please try again. "
      );
      setModalOpen(true);
    }
  };

  return (
    <div className="p-3 border-none rounded-xl  w-full bg-[#FBFBFB] mt-1">
      <h2 className="text-xl font-secondary font-semibold mb-6 mt-2">Suggested Organizations</h2>
      {unfollowedOrgs.length === 0 ? (
        <p>No new organizations to follow.</p>
      ) : (
        <ul className="space-y-3">
          {unfollowedOrgs.map(org => (
            <li key={org.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 ">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={org.imageUrl || "/default-org.png"}
                  alt={org.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div className="flex flex-col">
                   <span className="font-medium font-secondary">{org.name}</span>
                   <span className="text-sm text-shark-500 font-secondary">{org.institute}</span>
                </div>
                
              </div>
              <button className="px-3 py-2 bg-shark-950 text-white text-sm rounded-full hover:bg-shark-500 whitespace-nowrap mr-2"
              onClick={() => handleFollow(org.id)}
              >
                + Follow
              </button>
            </li>
          ))}
        </ul>
      )}
      <NotificationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
      />
    </div>
  );
}

