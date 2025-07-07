"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Mail,
  Phone,
  Edit,
  X,
  User,
  Star,
  Award,
  ExternalLink,
} from "lucide-react";
import {
  volunteerProfileService,
  VolunteerProfile,
  Organization,
} from "@/services/volunteerProfileService";

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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Followed Organizations
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {organizations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No organizations followed yet.
            </p>
          ) : (
            <div className="space-y-4">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={org.imageUrl || "/api/placeholder/40/40"}
                      alt={org.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{org.name}</h3>
                      <p className="text-sm text-gray-500">{org.institute}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onUnfollow(org.id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-md transition-colors"
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
    } catch (err) {
      console.error("Failed to unfollow organization:", err);
      alert("Failed to unfollow organization. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-gray-500 mb-2">
              Volunteer / Profile
            </nav>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>
          <div className="flex items-center space-x-3">
            <img
              src={profile.profilePictureUrl || "/api/placeholder/40/40"}
              alt={profile.firstName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-gray-900">
                {profile.firstName} {profile.lastName}
              </p>
              <p className="text-sm text-gray-500">{profile.institute}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Edit Profile Button */}
          <div className="mb-6">
            <button className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors">
              <Edit size={16} className="mr-2" />
              Edit Your Public Profile
            </button>
          </div>

          {/* Main Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-start space-x-6">
              <img
                src={profile.profilePictureUrl || "/api/placeholder/120/120"}
                alt={profile.firstName}
                className="w-32 h-32 rounded-lg object-cover"
              />

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <span className="text-gray-500">@{profile.username}</span>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-1" />
                    <span>{profile.institute}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
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
                    <span className="text-sm font-medium text-gray-700">
                      Level {profile.volunteerLevel} Volunteer
                    </span>
                    <Award size={16} className="text-yellow-500" />
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profile.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {profile.isAvailable ? "Available" : "Not Available"}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-600">
                    <Star size={16} className="mr-1 text-yellow-500" />
                    <span>{profile.rewardPoints} Reward Points</span>
                  </div>
                  {profile.isEventHost && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      Event Host
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About
              </h3>
              <p className="text-gray-600 leading-relaxed">{profile.about}</p>
            </div>

            {/* Followed Organizations */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Followed Organizations
                </h3>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
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
                    <span className="text-xs font-medium text-gray-600">
                      +{followedOrganizations.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">
                      {profile.phoneNumber}
                    </p>
                  </div>
                </div>
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
    </div>
  );
};

export default VolunteerProfilePage;
