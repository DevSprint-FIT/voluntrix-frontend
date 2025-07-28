"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Mail,
  Phone,
  X,
  Award,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  volunteerProfileService,
  VolunteerProfile,
  Organization,
} from "@/services/volunteerProfileService";

// Notification Modal Component
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
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-full font-primary tracking-wide text-base ${
              type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal Component
const FollowedOrganizationsModal = ({
  isOpen,
  onClose,
  organizations,
  onUnfollow,
}: {
  isOpen: boolean;
  onClose: () => void;
  organizations: Organization[];
  onUnfollow: (orgId: number) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-10 pt-6 pb-2">
          <h2 className="text-xl font-semibold font-secondary text-gray-900">
            Followed Organizations
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-6 pt-2 pb-6 max-h-96 overflow-y-auto">
          {organizations.length === 0 ? (
            <p className="text-gray-500 font-secondary text-center py-8">
              No organizations followed yet.
            </p>
          ) : (
            <div className="space-y-4">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={org.imageUrl || "/api/placeholder/40/40"}
                      alt={org.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium font-secondary text-gray-900">
                        {org.name}
                      </h3>
                      <p className="text-sm font-secondary text-gray-500">
                        {org.institute}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onUnfollow(org.id)}
                    className="px-4 py-2 text-sm font-medium font-secondary text-red-600 bg-red-50 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
                  >
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const VolunteerProfilePage = () => {
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [followedOrganizations, setFollowedOrganizations] = useState<
    Organization[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Using hardcoded values as specified
  const volunteerId = 1;
  const username = "anne13";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch volunteer profile
        const profileData = await volunteerProfileService.getVolunteerProfile(
          username
        );
        setProfile(profileData);

        // Fetch followed organizations
        const organizationsData =
          await volunteerProfileService.getFollowedOrganizations(volunteerId);
        setFollowedOrganizations(organizationsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUnfollow = async (organizationId: number) => {
    try {
      await volunteerProfileService.unfollowOrganization(
        volunteerId,
        organizationId
      );
      // Remove the organization from the local state
      setFollowedOrganizations((prev) =>
        prev.filter((org) => org.id !== organizationId)
      );

      // Show success modal
      setModalType("success");
      setModalTitle("Organization Unfollowed");
      setModalMessage("You have successfully unfollowed this organization.");
      setModalOpen(true);
    } catch (err) {
      console.error("Failed to unfollow organization:", err);

      // Show error modal
      setModalType("error");
      setModalTitle("Unfollow Failed");
      setModalMessage(
        err instanceof Error
          ? err.message
          : "Failed to unfollow organization. Please try again."
      );
      setModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        {" "}
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#029972] mx-auto mb-4"></div>
          <p className="text-gray-600 font-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        {" "}
        <div className="text-center">
          <p className="text-red-600 font-secondary mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white font-secondary rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600 font-secondary">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-6 py-4">
        <div>
          <nav className="text-[#B0B0B0] font-secondary mb-2 mt-3">
            Volunteer / Profile
          </nav>
          <h1 className="text-2xl font-bold font-secondary text-gray-900">
            Profile
          </h1>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Profile Card */}
          <div className="bg-[#FBFBFB] rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-10">
              <img
                src={profile.profilePictureUrl || "/api/placeholder/120/120"}
                alt={profile.firstName}
                className="w-32 h-32 rounded-lg object-cover"
              />

              <div className="flex-1">
                <div className="flex flex-col mb-2">
                  <span className="text-gray-500 font-secondary mb-0">
                    @{profile.username}
                  </span>
                  <h2 className="text-2xl font-bold font-secondary text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h2>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-gray-600 font-secondary">
                    <MapPin size={16} className="mr-1" />
                    <span>{profile.institute}</span>
                  </div>
                  <div className="flex items-center text-gray-600 font-secondary">
                    <Calendar size={16} className="mr-1" />
                    <span>
                      Joined{" "}
                      {volunteerProfileService.formatJoinedDate(
                        profile.joinedDate
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium font-secondary bg-[#ECFDF6] text-[#029972] px-3 py-1 rounded-full">
                      Level {profile.volunteerLevel} Volunteer
                    </span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium font-secondary ${
                      profile.isAvailable
                        ? "bg-[#ECFDF6] text-[#029972]"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {profile.isAvailable ? "Available" : "Not Available"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section - Full Width */}
          <div className="bg-[#FBFBFB] rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold font-secondary text-gray-900 mb-4">
              About
            </h3>
            <p className="text-gray-600 font-secondary leading-relaxed">
              {profile.about}
            </p>
          </div>

          {/* Two Column Layout for Contact and Organizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="bg-[#FBFBFB] rounded-lg p-6">
              <h3 className="text-lg font-semibold font-secondary text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 font-secondary">
                      Email
                    </p>
                    <p className="font-medium text-gray-900 font-secondary">
                      {profile.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 font-secondary">
                      Phone
                    </p>
                    <p className="font-medium text-gray-900 font-secondary">
                      {profile.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Followed Organizations */}
            <div className="bg-[#FBFBFB] rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold font-secondary text-gray-900">
                  Followed Organizations
                </h3>
              </div>

              <div className="flex space-x-2">
                {followedOrganizations.slice(0, 3).map((org) => (
                  <div key={org.id} className="flex-shrink-0">
                    <img
                      src={org.imageUrl || "/api/placeholder/40/40"}
                      alt={org.name}
                      className="w-10 h-10 rounded-full object-cover"
                      title={org.name}
                    />
                  </div>
                ))}
                {followedOrganizations.length > 3 && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-medium font-secondary text-gray-600">
                      +{followedOrganizations.length - 3}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-[#4F4F4F] hover:text-gray-700 text-sm font-medium font-secondary underline"
                >
                  View All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <FollowedOrganizationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        organizations={followedOrganizations}
        onUnfollow={handleUnfollow}
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

export default VolunteerProfilePage;
